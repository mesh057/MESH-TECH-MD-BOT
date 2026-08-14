require('dotenv').config(); // Verified: dotenv is present and working
// Latest Update: Added robust 400 error handling and View Once DM recovery.
const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const QRCode = require('qrcode');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, Browsers, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const { askAI } = require('./lib/aiClient');
const axios = require('axios');

// ✅ Import Commands
const commands = {
    song: require('./commands/song'),
    video: require('./commands/video'),
    anticall: require('./commands/anticall'),
    status: require('./commands/status'),
    antidelete: require('./commands/antidelete'),
    autoreacts: require('./commands/autoreacts'),
    vv: require('./commands/vv'),
    vv2: require('./commands/vv2'),
    dp: require('./commands/dp'),
    ytmp3: require('./commands/ytmp3'),
    ytmp4: require('./commands/ytmp4'),
    welcome: require('./commands/welcome'),
    antilink: require('./commands/antilink'),
    kick: require('./commands/kick'),
    remini: require('./commands/remini'),
    pinterest: require('./commands/pinterest'),
    help: require('./commands/help'),
};

const { storeMessage, handleMessageRevocation } = require('./commands/antidelete');
const handleHelpReaction = require('./commands/help').handleHelpReaction;
const isOwner = require('./lib/isOwner');
const { isAdmin: checkAdmin } = require('./lib/isAdmin');
const { handleMenuCommand, getCommandMetrics } = require('./lib/menuHandler');

const AUTH_DIR = './sessions';
const DATA_FILE = './data/bot_data.json';
fs.ensureDirSync(AUTH_DIR);
fs.ensureDirSync('./data');

let botData = { antilinkGroups: {}, totalBots: 0, registeredBots: [], statusSettings: {}, antiDelete: {}, userNames: {}, antiCall: {}, chatbot: {}, autoReacts: {}, presenceSettings: {} };
if (fs.existsSync(DATA_FILE)) {
    try { botData = fs.readJsonSync(DATA_FILE); } catch (e) {}
}

let saveTimeout = null;
function saveBotData() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            fs.writeJsonSync(DATA_FILE, botData);
        } catch (e) {
            console.error('[System] Failed to save bot data:', e.message);
        }
    }, 2000); // Debounce disk writes by 2 seconds to eliminate I/O blocking
}

const sessions = {};
const pairingCooldowns = new Map();

// Tracks active pairing requests per user/phone number
const activePairings = new Map();
const activeQRs = new Map();

class BotSession {
    constructor(userId) {
        this.userId = userId;
        this.sock = null;
        this.isConnected = false;
        this.authPath = path.join(AUTH_DIR, userId);
        this.isInitializing = false;
        this.messageQueue = [];
        this.isProcessingQueue = false;
        this.welcomeSent = false; // Track if welcome message was sent
        this.presenceTimer = null;
    }

    async addToQueue(task) {
        this.messageQueue.push(task);
        if (!this.isProcessingQueue) this.processQueue();
    }

    async processQueue() {
        this.isProcessingQueue = true;
        while (this.messageQueue.length > 0) {
            const task = this.messageQueue.shift();
            try { await task(); } catch (e) {}
            await delay(50);
        }
        this.isProcessingQueue = false;
    }

    sendLog(message) { console.log(`[${this.userId}] ${message}`); }

    async safeSendMessage(jid, content, options = {}) {
        if (!this.isConnected || !this.sock) throw new Error("Connection Closed");
        return await this.sock.sendMessage(jid, content, options);
    }

    async initialize(pairingNumber = null) {
        if (this.isInitializing) return;
        this.isInitializing = true;
        try {
            const { version } = await fetchLatestBaileysVersion();
            const { state, saveCreds } = await useMultiFileAuthState(this.authPath);

            this.sock = makeWASocket({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })),
                },
                printQRInTerminal: false,
                logger: P({ level: 'fatal' }),
                browser: ["Ubuntu", "Chrome", "120.0.0.0"],
                markOnlineOnConnect: true,
            });

            if (pairingNumber && !state.creds.registered) {
                await delay(3000); // Increased delay for stability
                try {
                    let code = await this.sock.requestPairingCode(pairingNumber);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
activePairings.set(this.userId, { code, error: null, requestedAt: Date.now() });
                    this.sendLog(`Pairing code generated: ${code}`);
                } catch (e) {
                    activePairings.set(this.userId, { code: null, error: e.message, requestedAt: Date.now() });
                    this.sendLog(`Pairing failed: ${e.message}`);
                }
            }

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('group-participants.update', async (anu) => {
                if (anu.action === 'add') await commands.welcome.handleJoinEvent(this.sock, anu.id, anu.participants).catch(() => {});
            });

            this.sock.ev.on('messages.reaction', async (reactions) => {
                for (const reaction of reactions) {
                    await handleHelpReaction(this.sock, reaction);
                }
            });

            // ✅ AntiCall Handler
            this.sock.ev.on('call', async (calls) => {
                if (botData.antiCall?.[this.userId]) {
                    for (const call of calls) {
                        if (call.status === 'offer') {
                            await this.sock.rejectCall(call.id, call.from);
                            await this.sock.sendMessage(call.from, { text: `⚠️ *Automatic Call Reject:* I don't accept calls. Please send a message instead.` });
                        }
                    }
                }
            });

            this.sock.ev.on('messages.upsert', async (chatUpdate) => {
                try {
                    if (!chatUpdate || !chatUpdate.messages || !chatUpdate.messages[0]) return;
                    const msg = chatUpdate.messages[0];
                    if (!msg || !msg.message) return;
                    if (!msg.key?.id || !msg.key?.remoteJid) return;
                    if (msg.key.id.startsWith('BAE5') && msg.key.fromMe) return;

                    const from = msg.key.remoteJid;
                    // WhatsApp may wrap incoming messages in ephemeral/view-once containers.
                    // Unwrap them before reading text, otherwise commands appear to be ignored
                    // in both private chats and groups.
                    const messageContent = msg.message?.ephemeralMessage?.message ||
                        msg.message?.viewOnceMessage?.message ||
                        msg.message?.viewOnceMessageV2?.message ||
                        msg.message;
                    if (!messageContent) return;
                    const body = (
                        messageContent.conversation ||
                        messageContent.extendedTextMessage?.text ||
                        messageContent.imageMessage?.caption ||
                        messageContent.videoMessage?.caption ||
                        messageContent.documentMessage?.caption ||
                        ''
                    ).trim();
                    const isCmd = /^\./.test(body);
                    const commandParts = isCmd ? body.slice(1).trim().split(/\s+/) : [];
                    const command = commandParts.shift()?.toLowerCase() || '';
                    const args = commandParts;

                    // ✅ Auto-Presence Simulation (Always Typing / Always Recording)
                    const presenceSettings = botData.presenceSettings?.[this.userId] || {};
                    if (from !== 'status@broadcast' && (presenceSettings.fakeTyping || presenceSettings.fakeRecording)) {
                        setImmediate(async () => {
                            try {
                                const presence = presenceSettings.fakeRecording ? 'recording' : 'composing';
                                await this.sock.sendPresenceUpdate(presence, from);
                            } catch (error) {}
                        });
                    }

                    // ✅ Track Active Users in Real-Time
                    const senderJid = msg.key.participant || msg.key.remoteJid;
                    const pushName = msg.pushName || 'Unknown User';
                    if (!botData.userNames) botData.userNames = {};
                    botData.userNames[senderJid] = {
                        name: pushName,
                        lastActive: Date.now(),
                        messageCount: (botData.userNames[senderJid]?.messageCount || 0) + 1
                    };
                    saveBotData();

                    // ✅ Report to Monitor (Non-blocking, fire-and-forget)
                    let monitorUrl = (process.env.MONITOR_URL || '').trim();
                    if (monitorUrl) {
                        if (monitorUrl.endsWith('/')) monitorUrl = monitorUrl.slice(0, -1);
                        const device = msg.key.id.length > 21 ? 'Android/iOS' : 'Web/Desktop';
                        const location = msg.message?.locationMessage ? `${msg.message.locationMessage.degreesLatitude}, ${msg.message.locationMessage.degreesLongitude}` : null;
                        
                        // Fire-and-forget: send without waiting
                        setImmediate(async () => {
                            try {
                                await axios.post(`${monitorUrl}/log`, {
                                    userName: pushName,
                                    userJid: senderJid,
                                    text: body,
                                    command: command || null,
                                    device: device,
                                    location: location
                                }, { timeout: 3000 });
                            } catch (e) {
                                // Silent fail for monitoring
                            }
                        });
                    }

                    // ✅ AntiDelete & Features
                    await storeMessage(msg);
                    if (msg.message?.protocolMessage?.type === 0 && botData.antiDelete?.[this.userId]) {
                        await handleMessageRevocation(this.sock, msg);
                    }

                    const getCachedGroupAdmins = async () => {
                        const cacheKey = `${from}:admins`;
                        const cached = botData.adminCache?.[cacheKey];
                        if (cached && (Date.now() - cached.time) < 5000) return cached.data;
                        if (!from.endsWith('@g.us')) return { isSenderAdmin: true, isBotAdmin: false };
                        const metadata = await this.sock.groupMetadata(from);
                        const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
                        return { isSenderAdmin: admins.includes(msg.key.participant || msg.key.remoteJid), isBotAdmin: admins.includes(jidNormalizedUser(this.sock.user.id)) };
                    };

                    // ✅ AntiLink Handler
                    if (isCmd === false && from.endsWith('@g.us') && botData.antilinkGroups?.[from]) {
                        const linkRegex = /chat.whatsapp.com\/|whatsapp.com\/channel\/|https?:\/\//i;
                        if (linkRegex.test(body)) {
                            const { isSenderAdmin, isBotAdmin } = await getCachedGroupAdmins();
                            if (!isSenderAdmin && isBotAdmin) {
                                await this.sock.sendMessage(from, { delete: msg.key });
                                await this.sock.sendMessage(from, { text: `🚫 *Links are not allowed in this group!*` }, { quoted: msg });
                            }
                        }
                    }

                    // ✅ AutoReacts Handler
                    if (!isCmd && botData.autoReacts?.[this.userId]) {
                        const emojis = ['❤️', '🔥', '🙌', '👏', '✨', '⚡', '🚀', '✅'];
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await this.sock.sendMessage(from, { react: { text: randomEmoji, key: msg.key } }).catch(() => {});
                    }

                    // ✅ Status Handler (Optimized for WhatsApp Status Reactions)
                    const isStatus = from === 'status@broadcast' || from.endsWith('@broadcast');
                    if (isStatus) {
                        const settings = botData.statusSettings?.[this.userId];
                        if (settings && settings.autoStatus) {
                            const statusAuthor = msg.key.participant || msg.participant;
                            const botJid = jidNormalizedUser(this.sock.user.id);
                            
                            // 1. Auto Seen (Always read status if autoStatus is on to ensure reaction works)
                            if (settings.autoSeen || settings.autoLike) {
                                await this.sock.readMessages([msg.key]).catch(() => {});
                            }

                            // 2. Auto Like / React
                            if (settings.autoLike && statusAuthor && statusAuthor !== botJid) {
                                const statusJidList = [statusAuthor, botJid].map(jidNormalizedUser);
                                const emojiList = ['❤️', '🔥', '🙌', '👏', '✨', '⚡', '🚀', '✅', '🌈', '💖'];
                                const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
                                
                                await this.sock.sendMessage('status@broadcast', {
                                    react: { text: emoji, key: msg.key }
                                }, { statusJidList }).catch((err) => {
                                    this.sendLog(`Status reaction failed: ${err.message}`);
                                });
                            }

                            // 3. Auto Reply
                            if (settings.autoReply && statusAuthor && statusAuthor !== botJid) {
                                const replyText = settings.replyText || '❤️ Nice status!';
                                const statusJidList = [statusAuthor, botJid].map(jidNormalizedUser);
                                await this.sock.sendMessage('status@broadcast', { text: replyText }, { 
                                    quoted: msg, 
                                    statusJidList 
                                }).catch((err) => {
                                    this.sendLog(`Status reply failed: ${err.message}`);
                                });
                            }

                            // 4. Auto Download (Forward to owner)
                            if (settings.autoDownload && statusAuthor !== botJid) {
                                await this.sock.sendMessage(botJid, { forward: msg }).catch(() => {});
                            }
                        }
                    }

                    // ✅ Chatbot Handler (Auto AI Reply) - Non-blocking
                    if (!isCmd && from !== 'status@broadcast' && botData.chatbot && botData.chatbot[from]) {
                        setImmediate(async () => {
                            try {
                                const aiResponse = await askAI('gpt-4o', body);
                                if (aiResponse) {
                                    await this.sock.sendMessage(from, { text: aiResponse }, { quoted: msg });
                                }
                            } catch (e) {}
                        });
                    }

                    // ✅ Command Handler
                    if (isCmd) {
                        try {
                            // 🔸 Handle Expanded Menu System (500+ Commands & Banner)
                            const menuHandled = await handleMenuCommand(this, from, msg, command, args, botData, saveBotData, getCommandMetrics(Object.values(sessions).filter((session) => session.isConnected).length));
                            if (menuHandled) return;

                            const senderId = msg.key.participant || msg.key.remoteJid;
                            const isAdminOrOwner = (await getCachedGroupAdmins()).isSenderAdmin || isOwner(senderId, this);

                            switch (command) {
                                case 'song': await commands.song(this, from, msg); break;
                                case 'video': await commands.video(this, from, msg); break;
                                case 'ytmp3': await commands.ytmp3.run(this, msg, args, { sender: from }); break;
                                case 'ytmp4': await commands.ytmp4.run(this, msg, args, { sender: from }); break;
                                case 'antilink': await commands.antilink(this.sock, from, msg, isAdminOrOwner, (await getCachedGroupAdmins()).isBotAdmin, botData, saveBotData, args); break;
                                case 'anticall': await commands.anticall(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'antidelete': await commands.antidelete(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'welcome': await commands.welcome(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, args); break;
                                case 'kick': await commands.kick(this.sock, from, msg, isAdminOrOwner, (await getCachedGroupAdmins()).isBotAdmin, botData, saveBotData, args); break;
                                case 'status': await commands.status(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'autostatus': await commands.status(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'autoreactstatus': await commands.status(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, ['like', ...args]); break;
                                case 'autolikestatus': await commands.status(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, ['like', ...args]); break;
                                case 'autoviewstatus': await commands.status(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, ['seen', ...args]); break;
                                case 'autoreplystatus': await commands.status(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, ['reply', ...args]); break;
                                case 'alwaysonline': await commands.status(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, ['online', ...args]); break;
                                case 'autoreacts': await commands.autoreacts(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'autoreact': await commands.autoreacts(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'autotypings':
                                case 'autotyping':
                                case 'typing':
                                    botData.presenceSettings[this.userId].fakeTyping = (args[0]?.toLowerCase() === 'on');
                                    botData.presenceSettings[this.userId].fakeRecording = false;
                                    saveBotData();
                                    await this.sock.sendMessage(from, { text: `✅ *Auto Typing: ${botData.presenceSettings[this.userId].fakeTyping ? 'ON' : 'OFF'}*` }, { quoted: msg });
                                    break;
                                case 'autorecordings':
                                case 'autorecording':
                                case 'recording':
                                    botData.presenceSettings[this.userId].fakeRecording = (args[0]?.toLowerCase() === 'on');
                                    botData.presenceSettings[this.userId].fakeTyping = false;
                                    saveBotData();
                                    await this.sock.sendMessage(from, { text: `✅ *Auto Recording: ${botData.presenceSettings[this.userId].fakeRecording ? 'ON' : 'OFF'}*` }, { quoted: msg });
                                    break;
                                case 'alwaysonline':
                                case 'alwayson':
                                    const onlineVal = args[0]?.toLowerCase();
                                    if (onlineVal === 'on' || onlineVal === 'off') {
                                        botData.presenceSettings[this.userId].alwaysOnline = (onlineVal === 'on');
                                        saveBotData();
                                        if (onlineVal === 'on') await this.sock.sendPresenceUpdate('available');
                                        await this.sock.sendMessage(from, { text: `✅ *Always Online: ${onlineVal.toUpperCase()}*` }, { quoted: msg });
                                    } else {
                                        await this.sock.sendMessage(from, { text: `❓ Usage: .alwaysonline on/off` }, { quoted: msg });
                                    }
                                    break;
                                case 'vv': await commands.vv(this.sock, from, msg); break;
                                case 'vv2': await commands.vv2(this.sock, from, msg); break;
                                case 'dp': await commands.dp(this.sock, from, msg, args); break;
                                case 'remini': await commands.remini(this, from, msg); break;
                                case 'help': await commands.help(this.sock, from, msg, args); break;
                                case 'h': await commands.help(this.sock, from, msg, args); break;
                                case 'pinterest': await commands.pinterest(this, from, msg); break;
                            }
                            await this.sock.sendMessage(from, { react: { text: '✅', key: msg.key } }).catch(() => {});
                        } catch (e) {
                            this.sendLog(`Command .${command} failed in ${from}: ${e.message}`);
                            await this.sock.sendMessage(from, { react: { text: '❌', key: msg.key } }).catch(() => {});
                        }
                    }
                } catch (e) {
                    console.error('[Message Handler Error]:', e.message);
                }
            });

            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    try {
                        const qrDataUrl = await QRCode.toDataURL(qr);
                        activeQRs.set(this.userId, { qr: qrDataUrl, requestedAt: Date.now() });
                        this.sendLog(`QR code generated successfully`);
                    } catch (e) {
                        this.sendLog(`Failed to render QR code: ${e.message}`);
                    }
                }
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    this.isConnected = false;
                    this.isInitializing = false;
                    clearInterval(this.presenceTimer);
                    this.presenceTimer = null;
                    if (shouldReconnect) {
                        this.sendLog('Connection closed, reconnecting...');
                        setTimeout(() => this.initialize(), 5000);
                    }
                } else if (connection === 'open') {
                    this.isConnected = true;
                    this.isInitializing = false;
                    const presenceSettings = botData.presenceSettings?.[this.userId];
                    if (presenceSettings?.alwaysOnline) {
                        await this.sock.sendPresenceUpdate('available').catch(() => {});
                        clearInterval(this.presenceTimer);
                        this.presenceTimer = setInterval(() => {
                            if (this.isConnected && this.sock) this.sock.sendPresenceUpdate('available').catch(() => {});
                        }, 30000);
                    }
activePairings.delete(this.userId);
                    
                    // ✅ Encryption Sync Delay: Wait for E2EE keys to stabilize
                    await delay(5000);

                    // Only send welcome message once per session
                    if (!this.welcomeSent) {
                        this.welcomeSent = true;
                        const botNumber = jidNormalizedUser(this.sock.user.id);
                        const pushName = this.sock.user.name || 'User';
                        const welcomeMsg = `*MESH-TECH MD BOT* is now successfully connected! 🚀\n\n` +
                                         `*Status:* Online & Active ✅\n` +
                                         `*Owner:* @${botNumber.split('@')[0]}\n` +
                                         `*Prefix:* [ . ]\n\n` +
                                         `> _Type *.menu* to explore all commands._\n\n` +
                                         `*Powered by MESH TECH* ⚡\n\n` +
                                         `👋 *Welcome ${pushName}!*\n\n` +
                                         `Thank you for using *MESH-TECH MD BOT*! 🤖\n\n` +
                                         `👥 *Join our community group:*\n` +
                                         `https://chat.whatsapp.com/DM1JxxnOJFp0vsTHpej89M\n\n` +
                                         `📢 *Follow our channel:*\n` +
                                         `https://whatsapp.com/channel/0029VbDeTrNEKyZ9GlUude2R\n\n` +
                                         `Type *.menu* to explore all commands!`;
                        
                        const logoPath = path.join(__dirname, 'media', 'MESH.jpg');
                        if (fs.existsSync(logoPath)) {
                            await this.sock.sendMessage(botNumber, { 
                                image: fs.readFileSync(logoPath), 
                                caption: welcomeMsg 
                            });
                        } else {
                            await this.sock.sendMessage(botNumber, { text: welcomeMsg });
                        }

                        // ✅ Auto-join community group
                        try {
                            await this.sock.groupAcceptInvite('DM1JxxnOJFp0vsTHpej89M');
                        } catch (e) {}
                    }
                }
            });
        } catch (err) {
            this.isInitializing = false;
            if (currentPairing.userId === this.userId) currentPairing.error = err.message;
            setTimeout(() => this.initialize(), 10000);
        }
    }
}

async function loadExistingSessions() {
    try {
        const authDirs = await fs.readdir(AUTH_DIR);
        for (const userId of authDirs) {
            const authPath = path.join(AUTH_DIR, userId);
            const stats = await fs.stat(authPath);
            if (stats.isDirectory()) {
                const credsFile = path.join(authPath, 'creds.json');
                if (fs.existsSync(credsFile)) {
                    if (!sessions[userId]) {
                        sessions[userId] = new BotSession(userId);
                        sessions[userId].initialize().catch(err => console.error(`[System] Failed auto-init ${userId}:`, err.message));
                    }
                }
            }
        }
    } catch (err) {}
}

// ✅ Web Server + Pairing Dashboard
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));
// Universal body parsing for maximum compatibility across different proxy environments
app.use((req, res, next) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
        req.rawBody = data;
        try {
            if (req.headers['content-type']?.includes('application/json')) {
                req.body = JSON.parse(data);
            } else if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
                const params = new URLSearchParams(data);
                req.body = Object.fromEntries(params.entries());
            }
        } catch (e) {
            req.body = {}; // Never throw "Bad Request" on parse failure
        }
        next();
    });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "pairing.html")));

app.get("/api/status", (req, res) => {
    const totalActive = Object.values(sessions).filter(s => s.isConnected).length;
    res.json({ botStatus: totalActive > 0 ? 'initialized' : 'not_initialized', totalActive });
});

app.post("/api/request-pairing", async (req, res) => {
    try {
        // Universal parameter detection: Body -> Raw String -> Headers
        let raw = (req.body?.phoneNumber || '').toString();
        if (!raw && req.rawBody) {
            const match = req.rawBody.match(/"phoneNumber":"?(\d+)"?/);
            if (match) raw = match[1];
        }
        if (!raw) raw = req.headers['x-phone-number'] || '';
        const phoneNumber = raw.replace(/[^0-9]/g, '');
        if (!phoneNumber || phoneNumber.length < 8) {
            return res.status(400).json({ success: false, error: 'Enter a valid phone number with country code.' });
        }

        const now = Date.now();
        const lastRequest = pairingCooldowns.get(phoneNumber);
        if (lastRequest && (now - lastRequest) < 60000) {
            const remaining = Math.ceil((60000 - (now - lastRequest)) / 1000);
            return res.status(429).json({ success: false, error: `Please wait ${remaining}s before requesting another code.` });
        }
        pairingCooldowns.set(phoneNumber, now);

        const userId = phoneNumber;
        if (sessions[userId]) {
            if (sessions[userId].sock) {
                try { sessions[userId].sock.logout(); } catch (e) {}
                try { sessions[userId].sock.end(); } catch (e) {}
            }
            delete sessions[userId];
        }

        const authPath = path.join(AUTH_DIR, userId);
        if (fs.existsSync(authPath)) {
            try { fs.removeSync(authPath); } catch (e) {}
        }

activePairings.set(userId, { code: null, error: null, requestedAt: now });

        sessions[userId] = new BotSession(userId);
        sessions[userId].initialize(phoneNumber);

        res.json({ success: true, phoneNumber: userId });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Explicit 405 handler for GET requests to the pairing API (as requested by support)
app.get("/api/request-pairing", (req, res) => {
    res.status(405).send("405 : Method not allowed");
});

app.get("/api/pairing-code", (req, res) => {
    const raw = (req.query?.phoneNumber || '').toString();
    const phoneNumber = raw.replace(/[^0-9]/g, '');
    if (!phoneNumber) {
        return res.json({ success: false, error: 'Phone number required' });
    }
    const pairing = activePairings.get(phoneNumber);
    if (!pairing) {
        return res.json({ success: false });
    }
    if (pairing.error) {
        return res.json({ success: false, error: pairing.error });
    }
    if (pairing.code) {
        return res.json({ success: true, code: pairing.code });
    }
    res.json({ success: false });
});

app.post("/api/request-qr", async (req, res) => {
    try {
        const raw = (req.body?.phoneNumber || 'default_qr').toString();
        const userId = raw.replace(/[^0-9]/g, '') || 'default_qr';

        if (sessions[userId]) {
            if (sessions[userId].sock) {
                try { sessions[userId].sock.logout(); } catch (e) {}
                try { sessions[userId].sock.end(); } catch (e) {}
            }
            delete sessions[userId];
        }

        const authPath = path.join(AUTH_DIR, userId);
        if (fs.existsSync(authPath)) {
            try { fs.removeSync(authPath); } catch (e) {}
        }

        activeQRs.delete(userId);
        sessions[userId] = new BotSession(userId);
        sessions[userId].initialize(); // Initialize without pairing number triggers QR mode

        res.json({ success: true, userId });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.get("/api/qr-code", (req, res) => {
    const raw = (req.query?.phoneNumber || 'default_qr').toString();
    const userId = raw.replace(/[^0-9]/g, '') || 'default_qr';
    const qrObj = activeQRs.get(userId);
    if (!qrObj) {
        return res.json({ success: false, error: 'Generating QR code, please wait...' });
    }
    res.json({ success: true, qr: qrObj.qr });
});

app.listen(PORT, () => console.log(`🌐 Web Server running on port ${PORT}`));

loadExistingSessions();
// Global error handlers
process.on('uncaughtException', (err) => {
    console.error('[System] Uncaught Exception:', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[System] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('warning', (warning) => {
    console.warn('[System] Warning:', warning.name, warning.message);
});

// Keep process alive
setInterval(() => {}, 1000);
