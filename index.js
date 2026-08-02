require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const express = require('express');
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
    dp: require('./commands/dp'),
    ytmp3: require('./commands/ytmp3'),
    ytmp4: require('./commands/ytmp4'),
    welcome: require('./commands/welcome'),
    antilink: require('./commands/antilink'),
    kick: require('./commands/kick'),
};

const { storeMessage, handleMessageRevocation } = require('./commands/antidelete');
const isOwner = require('./lib/isOwner');
const { isAdmin: checkAdmin } = require('./lib/isAdmin');
const { handleMenuCommand } = require('./lib/menuHandler');

const AUTH_DIR = './sessions';
const DATA_FILE = './data/bot_data.json';
fs.ensureDirSync(AUTH_DIR);
fs.ensureDirSync('./data');

let botData = { antilinkGroups: {}, totalBots: 0, registeredBots: [], statusSettings: {}, antiDelete: {}, userNames: {}, antiCall: {}, chatbot: {} };
if (fs.existsSync(DATA_FILE)) {
    try { botData = fs.readJsonSync(DATA_FILE); } catch (e) {}
}

function saveBotData() {
    fs.writeJsonSync(DATA_FILE, botData);
}

const sessions = {};
const pairingCooldowns = new Map();

// Tracks whichever pairing request the web dashboard is currently waiting on
const currentPairing = { userId: null, code: null, error: null, requestedAt: null };

class BotSession {
    constructor(userId) {
        this.userId = userId;
        this.sock = null;
        this.isConnected = false;
        this.authPath = path.join(AUTH_DIR, userId);
        this.isInitializing = false;
        this.messageQueue = [];
        this.isProcessingQueue = false;
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
            await delay(500);
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
                browser: Browsers.ubuntu('Chrome'),
                markOnlineOnConnect: true,
            });

            if (pairingNumber && !state.creds.registered) {
                await delay(3000);
                try {
                    let code = await this.sock.requestPairingCode(pairingNumber);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    if (currentPairing.userId === this.userId) {
                        currentPairing.code = code;
                        currentPairing.error = null;
                    }
                    this.sendLog(`Pairing code generated: ${code}`);
                } catch (e) {
                    if (currentPairing.userId === this.userId) {
                        currentPairing.error = e.message;
                    }
                    this.sendLog(`Pairing failed: ${e.message}`);
                }
            }

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('group-participants.update', async (anu) => {
                if (anu.action === 'add') await commands.welcome.handleJoinEvent(this.sock, anu.id, anu.participants).catch(() => {});
            });

            this.sock.ev.on('messages.upsert', async (chatUpdate) => {
                try {
                    const msg = chatUpdate.messages[0];
                    if (!msg.message) return;
                    if (msg.key.id.startsWith('BAE5') && msg.key.fromMe) return;

                    const from = msg.key.remoteJid;
                    const body = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption || '').trim();
                    const isCmd = body.startsWith('.');
                    const command = isCmd ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : '';
                    const args = body.trim().split(/ +/).slice(1);

                    // ✅ Report to Monitor
                    let monitorUrl = (process.env.MONITOR_URL || '').trim();
                    if (monitorUrl) {
                        if (monitorUrl.endsWith('/')) monitorUrl = monitorUrl.slice(0, -1);
                        const senderJid = msg.key.participant || msg.key.remoteJid;
                        const pushName = msg.pushName || 'Unknown User';
                        const device = msg.key.id.length > 21 ? 'Android/iOS' : 'Web/Desktop';
                        const location = msg.message?.locationMessage ? `${msg.message.locationMessage.degreesLatitude}, ${msg.message.locationMessage.degreesLongitude}` : null;
                        
                        console.log(`[Monitor] Sending log to ${monitorUrl}...`);
                        axios.post(`${monitorUrl}/log`, {
                            userName: pushName,
                            userJid: senderJid,
                            text: body,
                            command: command || null,
                            device: device,
                            location: location
                        }).then(() => console.log(`[Monitor] Log sent successfully.`))
                          .catch((err) => console.error(`[Monitor] Failed to send log: ${err.message}`));
                    }

                    // ✅ AntiDelete & Features
                    await storeMessage(msg);
                    if (msg.message?.protocolMessage?.type === 0) await handleMessageRevocation(this.sock, msg);

                    // ✅ Status Handler
                    if (from === 'status@broadcast') {
                        const settings = botData.statusSettings[this.userId];
                        if (settings && settings.autoStatus) {
                            if (settings.autoSeen) {
                                await this.sock.readMessages([msg.key]);
                            }
                            if (settings.autoLike) {
                                const emoji = ['❤️', '🔥', '🙌', '👏', '✨'][Math.floor(Math.random() * 5)];
                                await this.sock.sendMessage('status@broadcast', {
                                    react: { text: emoji, key: msg.key }
                                }, { statusJidList: [msg.key.participant] });
                            }
                        }
                    }

                    // ✅ Chatbot Handler (Auto AI Reply)
                    if (!isCmd && from !== 'status@broadcast' && botData.chatbot && botData.chatbot[from]) {
                        try {
                            const aiResponse = await askAI('gpt-4o', body);
                            if (aiResponse) {
                                await this.sock.sendMessage(from, { text: aiResponse }, { quoted: msg });
                            }
                        } catch (e) {
                            console.error('Chatbot auto-reply error:', e.message);
                        }
                    }

                    // ✅ Command Handler
                    if (isCmd) {
                        const getGroupAdmins = async () => {
                            if (!from.endsWith('@g.us')) return { isSenderAdmin: true, isBotAdmin: false };
                            const metadata = await this.sock.groupMetadata(from);
                            const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
                            return { isSenderAdmin: admins.includes(msg.key.participant || msg.key.remoteJid), isBotAdmin: admins.includes(jidNormalizedUser(this.sock.user.id)) };
                        };

                        try {
                            // 🔸 Handle Expanded Menu System (500+ Commands & Banner)
                            const menuHandled = await handleMenuCommand(this, from, msg, command, args, botData, saveBotData);
                            if (menuHandled) return;

                            const senderId = msg.key.participant || msg.key.remoteJid;
                            const isAdminOrOwner = (await getGroupAdmins()).isSenderAdmin || isOwner(senderId);

                            switch (command) {
                                case 'song': await commands.song(this, from, msg); break;
                                case 'video': await commands.video(this, from, msg); break;
                                case 'ytmp3': await commands.ytmp3.run(this, msg, args, { sender: from }); break;
                                case 'ytmp4': await commands.ytmp4.run(this, msg, args, { sender: from }); break;
                                case 'antilink': await commands.antilink(this.sock, from, msg, isAdminOrOwner, (await getGroupAdmins()).isBotAdmin, botData, saveBotData, args); break;
                                case 'anticall': await commands.anticall(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'antidelete': await commands.antidelete(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'welcome': await commands.welcome(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, args); break;
                                case 'kick': await commands.kick(this.sock, from, msg, isAdminOrOwner, (await getGroupAdmins()).isBotAdmin, botData, saveBotData, args); break;
                                case 'status': await commands.status(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'autoreacts': await commands.autoreacts(this.sock, from, msg, isAdminOrOwner, botData, saveBotData, this.userId, args); break;
                                case 'vv': await commands.vv(this.sock, from, msg); break;
                                case 'dp': await commands.dp(this.sock, from, msg, args); break;
                            }
                            await this.sock.sendMessage(from, { react: { text: '✅', key: msg.key } }).catch(() => {});
                        } catch (e) {
                            await this.sock.sendMessage(from, { react: { text: '❌', key: msg.key } }).catch(() => {});
                        }
                    }
                } catch (e) {}
            });

            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    this.isConnected = false;
                    this.isInitializing = false;
                    if (shouldReconnect) setTimeout(() => this.initialize(), 5000);
                } else if (connection === 'open') {
                    this.isConnected = true;
                    this.isInitializing = false;
                    if (currentPairing.userId === this.userId) {
                        currentPairing.userId = null;
                        currentPairing.code = null;
                        currentPairing.error = null;
                    }
                    const botNumber = jidNormalizedUser(this.sock.user.id);
                    const welcomeMsg = `*MESH-TECH MD ADVANCED BOT* is now successfully connected! 🚀\n\n` +
                                     `*Status:* Online & Active ✅\n` +
                                     `*Owner:* @${botNumber.split('@')[0]}\n` +
                                     `*Prefix:* [ . ]\n\n` +
                                     `> _Type *.menu* to explore all commands._\n\n` +
                                     `*Powered by MESH TECH* ⚡`;
                    
                    const logoPath = path.join(__dirname, 'media', 'MESH.jpg');
                    if (fs.existsSync(logoPath)) {
                        await this.sock.sendMessage(botNumber, { 
                            image: fs.readFileSync(logoPath), 
                            caption: welcomeMsg 
                        });
                    } else {
                        await this.sock.sendMessage(botNumber, { text: welcomeMsg });
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
app.use(express.json());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "pairing.html")));

app.get("/api/status", (req, res) => {
    const totalActive = Object.values(sessions).filter(s => s.isConnected).length;
    res.json({ botStatus: totalActive > 0 ? 'initialized' : 'not_initialized', totalActive });
});

app.post("/api/request-pairing", async (req, res) => {
    try {
        const raw = (req.body?.phoneNumber || '').toString();
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

        currentPairing.userId = userId;
        currentPairing.code = null;
        currentPairing.error = null;
        currentPairing.requestedAt = now;

        sessions[userId] = new BotSession(userId);
        sessions[userId].initialize(phoneNumber);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.get("/api/pairing-code", (req, res) => {
    if (currentPairing.error) {
        return res.json({ success: false, error: currentPairing.error });
    }
    if (currentPairing.code) {
        return res.json({ success: true, code: currentPairing.code });
    }
    res.json({ success: false });
});

app.listen(PORT, () => console.log(`🌐 Web Server running on port ${PORT}`));

loadExistingSessions();
process.on('uncaughtException', (err) => console.error('[System] Uncaught:', err.message));
process.on('unhandledRejection', (reason) => console.error('[System] Unhandled:', reason));
setInterval(() => {}, 1000);
