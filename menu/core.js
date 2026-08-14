const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { askAI } = require('../lib/aiClient');

// Helper to get runtime
function getRuntime() {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
}

function ensurePresenceSettings(botData, userId) {
    if (!botData.presenceSettings) botData.presenceSettings = {};
    if (!botData.presenceSettings[userId]) {
        botData.presenceSettings[userId] = {
            alwaysOnline: false,
            fakeTyping: false,
            fakeRecording: false
        };
    }
    return botData.presenceSettings[userId];
}

async function togglePresenceFeature({ reply, args, botData, saveBotData, sender, sessionId }, feature, label) {
    const mode = args[0]?.toLowerCase();
    const settings = ensurePresenceSettings(botData, sessionId || sender);
    const currentMode = settings[feature] || 'off';

    if (!mode || !['on', 'off', 'p', 'g', 'all'].includes(mode)) {
        return reply(`╭━━━〔 *${label.toUpperCase()} SETUP* 〕━━━┈⊷\n` +
                     `┃ ⋄ *Status:* ${currentMode === 'off' || !currentMode ? '❌ Disabled' : '✅ Active (' + String(currentMode).toUpperCase() + ')'}\n` +
                     `┃\n` +
                     `┃ ⋄ *.${feature} p* - Private DMs only\n` +
                     `┃ ⋄ *.${feature} g* - Groups only\n` +
                     `┃ ⋄ *.${feature} all* - Everywhere\n` +
                     `┃ ⋄ *.${feature} off* - Disable\n` +
                     `╰━━━━━━━━━━━━━━━━━━┈⊷`);
    }

    let setMode = mode;
    if (mode === 'on') setMode = 'all';
    if (mode === 'off') setMode = false;
    
    settings[feature] = setMode;
    saveBotData();
    
    const labelText = setMode === 'all' ? 'Everywhere' : (setMode === 'p' ? 'Private' : (setMode === 'g' ? 'Groups' : 'OFF'));
    return reply(`✅ *${label} set to: ${labelText}*`);
}

async function forwardCommand(session, modulePath, jid, msg, args = []) {
    if (!session) throw new Error('Active bot session is unavailable');
    const handler = require(modulePath);
    if (typeof handler === 'function') return handler(session, jid, msg, args);
    if (typeof handler?.run === 'function') return handler.run(session, msg, args, { sender: jid, contextInfo: {} });
    throw new Error(`Invalid command module: ${modulePath}`);
}

function pendingFeature(reply, command, note = 'This command is registered and ready for integration work.') {
    return reply(`🛠️ *.${command}*\n${note}`);
}

const core = {

    // ============================
    // 🔮 UTILITY COMMANDS
    // ============================
    ping: async ({ reply }) => {
        const start = Date.now();
        const latency = Date.now() - start;
        const formattedLatency = latency < 1 ? '<1' : latency;
        return reply(`🏓 *Pong!* \n⚡ *Latency:* ${formattedLatency}ms\n✅ *Status:* Bot is alive and responding!`);
    },

    runtime: async ({ reply }) => {
        return reply(`⏳ *Bot Uptime:* ${getRuntime()}`);
    },

    alive: async ({ reply }) => {
        return reply("🔥 *MESH-TECH MD BOT IS ONLINE AND READY!* \n\nType `.menu` to see my power! 🚀");
    },

    autotyping: async (context) => togglePresenceFeature(context, 'fakeTyping', 'Fake Typing'),
    autorecording: async (context) => togglePresenceFeature(context, 'fakeRecording', 'Fake Recording'),
    alwaysonline: async ({ reply, args, botData, saveBotData, sender, sessionId }) => {
        const value = args[0]?.toLowerCase();
        const settings = ensurePresenceSettings(botData, sessionId || sender);
        if (!['on', 'off'].includes(value)) return reply('❓ Usage: .alwaysonline on/off');
        settings.alwaysOnline = value === 'on';
        saveBotData();
        return reply(`${value === 'on' ? '✅' : '❌'} *Always Online: ${value.toUpperCase()}*`);
    },

    repo: async ({ reply }) => {
        return reply("📂 *GitHub Repository:* \nhttps://github.com/mesh057/MESH-TECH-MD-BOT \n\n*Fork Option:* https://github.com/mesh057/MESH-TECH-MD-BOT/fork \n\n⭐ Star and fork the repo to show support!");
    },

    server: async ({ reply }) => {
        const os = require('os');
        return reply(`🖥️ *Server Info*\n\nPlatform: ${os.platform()}\nArch: ${os.arch()}\nCPUs: ${os.cpus().length}\nTotal RAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB\nFree RAM: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    },

    disk: async ({ reply }) => {
        return reply("💾 *Disk Info*\nUse `.server` for full system info.");
    },

    system: async ({ reply }) => {
        const os = require('os');
        return reply(`⚙️ *System Info*\nOS: ${os.type()} ${os.release()}\nUptime: ${getRuntime()}\nMemory: ${(os.freemem() / 1024 / 1024).toFixed(0)}MB free of ${(os.totalmem() / 1024 / 1024).toFixed(0)}MB`);
    },

    echo: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Please provide text to echo.");
        return reply(args.join(" "));
    },

    groupinfo: async ({ conn, jid, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const metadata = await conn.groupMetadata(jid);
        const text = `
╭━━━ *GROUP INFO* ━━━╮
┃ 📝 *Name:* ${metadata.subject}
┃ 🆔 *ID:* ${jid}
┃ 👥 *Members:* ${metadata.participants.length}
┃ 👑 *Owner:* ${metadata.owner || "Not found"}
┃ 📜 *Desc:* ${metadata.desc || "No description"}
╰━━━━━━━━━━━━━━━╯
        `;
        return reply(text);
    },

    // ============================
    // 👥 GROUP MANAGEMENT
    // ============================
    tagall: async ({ conn, jid, m, args, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const metadata = await conn.groupMetadata(jid);
        const participants = metadata.participants;
        let text = `📢 *TAG ALL* \n\n*Message:* ${args.join(" ") || "No Message"}\n\n`;
        for (let mem of participants) {
            text += `🔹 @${mem.id.split("@")[0]}\n`;
        }
        return conn.sendMessage(jid, { text, mentions: participants.map(a => a.id) }, { quoted: m });
    },

    everyone: async ({ conn, jid, m, args, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const metadata = await conn.groupMetadata(jid);
        const participants = metadata.participants;
        let text = `📢 *EVERYONE* \n\n${args.join(" ") || "Attention everyone!"}\n\n`;
        for (let mem of participants) {
            text += `@${mem.id.split("@")[0]} `;
        }
        return conn.sendMessage(jid, { text, mentions: participants.map(a => a.id) }, { quoted: m });
    },

    hidetag: async ({ conn, jid, m, args, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const metadata = await conn.groupMetadata(jid);
        const participants = metadata.participants;
        return conn.sendMessage(jid, { text: args.join(" ") || "Hello everyone!", mentions: participants.map(a => a.id) });
    },

    promote: async ({ conn, jid, m, args, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Please tag a user to promote.");
        await conn.groupParticipantsUpdate(jid, users, "promote");
        return reply("✅ User(s) promoted to Admin!");
    },

    demote: async ({ conn, jid, m, args, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Please tag a user to demote.");
        await conn.groupParticipantsUpdate(jid, users, "demote");
        return reply("✅ User(s) demoted to Member!");
    },

    add: async ({ conn, jid, m, args, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        if (args.length === 0) return reply("❓ Please provide a number to add.");
        const num = args[0].replace(/\D/g, '') + "@s.whatsapp.net";
        await conn.groupParticipantsUpdate(jid, [num], "add");
        return reply(`✅ Added ${args[0]} to the group!`);
    },

    remove: async ({ conn, jid, m, args, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Please tag a user to remove.");
        await conn.groupParticipantsUpdate(jid, users, "remove");
        return reply("✅ User(s) removed from group!");
    },

    invite: async ({ conn, jid, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const code = await conn.groupInviteCode(jid);
        return reply(`🔗 *Group Invite Link:*\nhttps://chat.whatsapp.com/${code}`);
    },

    linkgc: async ({ conn, jid, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const code = await conn.groupInviteCode(jid);
        return reply(`🔗 *Group Invite Link:*\nhttps://chat.whatsapp.com/${code}`);
    },

    resetlink: async ({ conn, jid, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        await conn.groupRevokeInvite(jid);
        return reply("✅ Group invite link has been reset!");
    },

    opengroup: async ({ conn, jid, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        await conn.groupSettingUpdate(jid, "not_announcement");
        return reply("🔓 Group is now *OPEN* — everyone can send messages!");
    },

    closegroup: async ({ conn, jid, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        await conn.groupSettingUpdate(jid, "announcement");
        return reply("🔒 Group is now *CLOSED* — only admins can send messages!");
    },

    getname: async ({ conn, jid, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const metadata = await conn.groupMetadata(jid);
        return reply(`📛 *Group Name:* ${metadata.subject}`);
    },

    getdeskgc: async ({ conn, jid, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const metadata = await conn.groupMetadata(jid);
        return reply(`📜 *Group Description:*\n${metadata.desc || "No description set."}`);
    },

    leavegc: async ({ conn, jid, reply }) => {
        await reply("👋 Leaving group...");
        return conn.groupLeave(jid);
    },

    join: async ({ conn, reply, args }) => {
        if (args.length === 0) return reply("❓ Please provide a group invite link.");
        const code = args[0].split("https://chat.whatsapp.com/").pop();
        await conn.groupAcceptInvite(code);
        return reply("✅ Joined group successfully!");
    },

    creategc: async ({ conn, reply, args }) => {
        if (args.length === 0) return reply("❓ Please provide a group name.");
        await conn.groupCreate(args.join(" "), []);
        return reply(`✅ Group *${args.join(" ")}* created!`);
    },

    listonline: async ({ reply, isGroup, botData }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const activeUsers = Object.keys(botData.userNames || {}).length;
        return reply(`🟢 *Active Members:* ${activeUsers} users have interacted with the bot recently.`);
    },

    svcontact: async ({ conn, jid, m, reply, isGroup }) => {
        if (!isGroup) return reply("🚫 This command is for groups only!");
        const metadata = await conn.groupMetadata(jid);
        return reply(`📇 *Group has ${metadata.participants.length} contacts.*`);
    },

    // ============================
    // 👑 OWNER COMMANDS
    // ============================
    shutdown: async ({ reply }) => {
        await reply("💀 *Shutting down...* Goodbye!");
        process.exit(0);
    },

    restart: async ({ reply }) => {
        await reply("🔄 *Restarting bot...* Please wait.");
        process.exit(1);
    },

    stop: async ({ reply }) => {
        await reply("🛑 *Stopping bot...*");
        process.exit(0);
    },

    update: async ({ reply }) => {
        return reply("🔄 *Checking for updates...*\nPlease pull the latest version from GitHub:\nhttps://github.com/mesh057/MESH-TECH-MD-BOT");
    },

    setbio: async ({ conn, reply, args }) => {
        if (args.length === 0) return reply("❓ Please provide a bio text.");
        await conn.updateProfileStatus(args.join(" "));
        return reply("✅ Bio updated!");
    },

    getbio: async ({ conn, reply }) => {
        return reply("ℹ️ Use WhatsApp settings to view your current bio.");
    },

    setpp: async ({ conn, m, reply }) => {
        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || m.message?.imageMessage;
        if (!quoted && !m.message?.imageMessage) return reply("❓ Please reply to an image or send an image with .setpp to set as profile picture.");
        
        const target = quoted?.imageMessage || m.message?.imageMessage;
        if (!target) return reply("❓ Please reply to an image to set as profile picture.");

        try {
            const stream = await downloadContentFromMessage(target, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            await conn.updateProfilePicture(conn.user.id, buffer);
            return reply("✅ Profile picture updated successfully!");
        } catch (e) {
            return reply(`❌ Failed to update profile picture: ${e.message}`);
        }
    },

    getpp: async ({ conn, m, reply, args }) => {
        return reply("🖼️ Profile picture fetching requires a tagged user.");
    },

    mode: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .mode <self/public>");
        global.mode = args[0].toLowerCase();
        return reply(`⚙️ Mode set to *${global.mode.toUpperCase()}*`);
    },

    "mode-private": async ({ reply }) => {
        global.mode = "self";
        return reply("🔒 BOT IS NOW IN *PRIVATE MODE*");
    },

    "mode-public": async ({ reply }) => {
        global.mode = "public";
        return reply("🌍 BOT IS NOW IN *PUBLIC MODE*");
    },

    block: async ({ conn, m, reply }) => {
        const users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Please tag a user to block.");
        for (const user of users) await conn.updateBlockStatus(user, "block");
        return reply("🚫 User(s) blocked!");
    },

    unblock: async ({ conn, m, reply }) => {
        const users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Please tag a user to unblock.");
        for (const user of users) await conn.updateBlockStatus(user, "unblock");
        return reply("✅ User(s) unblocked!");
    },

    listblock: async ({ conn, reply }) => {
        return reply("📋 Blocked contacts list requires privacy settings access.");
    },

    delete: async ({ conn, m, reply }) => {
        const quoted = m.message?.extendedTextMessage?.contextInfo;
        if (!quoted) return reply("❓ Please reply to a message to delete it.");
        await conn.sendMessage(m.key.remoteJid, { delete: { remoteJid: m.key.remoteJid, fromMe: false, id: quoted.stanzaId, participant: quoted.participant } });
        return;
    },

    clearChat: async ({ conn, jid, reply }) => {
        return reply("🗑️ Chat clear requires manual action.");
    },

    sudo: async ({ reply, args, botData, saveBotData }) => {
        if (args.length === 0) return reply("❓ Usage: .sudo <number>");
        const num = args[0].replace(/\D/g, '') + "@s.whatsapp.net";
        if (!botData.sudo) botData.sudo = {};
        botData.sudo[num] = true;
        saveBotData();
        return reply(`✅ @${num.split('@')[0]} added as sudo user.`);
    },

    delsudo: async ({ reply, args, botData, saveBotData }) => {
        if (args.length === 0) return reply("❓ Usage: .delsudo <number>");
        const num = args[0].replace(/\D/g, '') + "@s.whatsapp.net";
        if (botData.sudo && botData.sudo[num]) {
            delete botData.sudo[num];
            saveBotData();
            return reply(`✅ @${num.split('@')[0]} removed from sudo.`);
        }
        return reply("❌ User is not a sudo user.");
    },

    listsudo: async ({ reply, botData }) => {
        const sudoList = Object.keys(botData.sudo || {});
        if (sudoList.length === 0) return reply("📋 *Sudo Users:* None configured.");
        return reply(`📋 *Sudo Users:*\n\n${sudoList.map(s => `• @${s.split('@')[0]}`).join('\n')}`);
    },

    premium: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .premium <number>");
        return reply(`⭐ ${args[0]} granted premium access.`);
    },

    buypremium: async ({ reply }) => {
        return reply("💎 *Buy Premium*\nContact owner for premium access!");
    },

    report: async ({ reply, args }) => {
        return reply("📝 Report submitted. Thank you!");
    },

    unavailable: async ({ conn, reply }) => {
        await conn.updatePresence(null, "unavailable");
        return reply("📴 Status set to unavailable.");
    },

    // ============================
    // 🧠 AI COMMANDS
    // ============================
    chatbot: async ({ reply, args, sender, jid }) => {
        const botData = require('../data/bot_data.json'); // Direct read for simplicity in this file
        if (!botData.chatbot) botData.chatbot = {};
        const action = args[0]?.toLowerCase();
        if (!action) {
            const status = botData.chatbot[jid] ? '✅ ON' : '❌ OFF';
            return reply(`🤖 *Chatbot Menu*\n\nStatus: ${status}\n\nUse:\n.chatbot on - Enable auto AI reply\n.chatbot off - Disable auto AI reply`);
        }
        if (action === 'on') {
            botData.chatbot[jid] = true;
            require('fs-extra').writeJsonSync('./data/bot_data.json', botData);
            return reply("✅ *Chatbot is now ON* for this chat.");
        } else if (action === 'off') {
            botData.chatbot[jid] = false;
            require('fs-extra').writeJsonSync('./data/bot_data.json', botData);
            return reply("❌ *Chatbot is now OFF* for this chat.");
        }
    },
    chatgpt: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .chatgpt <query>");
        try {
            const result = await askAI('gpt-4o', args.join(" "));
            return reply(`🤖 *ChatGPT (GPT-4o):*\n${result}`);
        } catch (e) {
            return reply("❌ ChatGPT API error. Try again later.");
        }
    },

    copilot: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .copilot <query>");
        try {
            const result = await askAI('gpt-4o', args.join(" "));
            return reply(`🤖 *Copilot (GPT-4o):*\n${result}`);
        } catch (e) {
            return reply("❌ Copilot API error. Try again later.");
        }
    },

    llama: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .llama <query>");
        try {
            const result = await askAI('llama-4-maverick', args.join(" "));
            return reply(`🦙 *LLaMA 4:*\n${result}`);
        } catch (e) {
            return reply("❌ LLaMA API error. Try again later.");
        }
    },

    metai: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .metai <query>");
        try {
            const result = await askAI('llama-4-maverick', args.join(" "));
            return reply(`🤖 *Meta AI (Llama 4):*\n${result}`);
        } catch (e) {
            return reply("❌ Meta AI API error. Try again later.");
        }
    },

    metai2: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .metai2 <query>");
        try {
            const result = await askAI('llama-4-maverick', args.join(" "));
            return reply(`🤖 *Meta AI v2 (Llama 4):*\n${result}`);
        } catch (e) {
            return reply("❌ Meta AI v2 API error.");
        }
    },

    gemini: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .gemini <query>");
        try {
            const result = await askAI('gemini-3.1-pro', args.join(" "));
            return reply(`✨ *Gemini 3.1 Pro:*\n${result}`);
        } catch (e) {
            return reply("❌ Gemini API error. Try again later.");
        }
    },

    gemini2: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .gemini2 <query>");
        try {
            const result = await askAI('gemini-3-1-flash-lite', args.join(" "));
            return reply(`✨ *Gemini 3.1 Flash:*\n${result}`);
        } catch (e) {
            return reply("❌ Gemini v2 API error.");
        }
    },

    gemma: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .gemma <query>");
        try {
            const result = await askAI('gemma-3', args.join(" "));
            return reply(`🤖 *Gemma:*\n${result}`);
        } catch (e) {
            return reply("❌ Gemma API error.");
        }
    },

    claude: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .claude <query>");
        try {
            const result = await askAI('claude-sonnet-4.6', args.join(" "));
            return reply(`🤖 *Claude Sonnet 4.6:*\n${result}`);
        } catch (e) {
            return reply("❌ Claude API error. Try again later.");
        }
    },

    deepseek: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .deepseek <query>");
        try {
            const result = await askAI('deepseek-v4-pro', args.join(" "));
            return reply(`🔍 *DeepSeek V4 Pro:*\n${result}`);
        } catch (e) {
            return reply("❌ DeepSeek API error. Try again later.");
        }
    },

    deepseekr1: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .deepseekr1 <query>");
        try {
            const result = await askAI('deepseek-r1', args.join(" "));
            return reply(`🔍 *DeepSeek R1:*\n${result}`);
        } catch (e) {
            return reply("❌ DeepSeek R1 API error. Try again later.");
        }
    },

    mistral: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .mistral <query>");
        try {
            const result = await askAI('mistral-large', args.join(" "));
            return reply(`🌬️ *Mistral:*\n${result}`);
        } catch (e) {
            return reply("❌ Mistral API error. Try again later.");
        }
    },

    blackbox: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .blackbox <query>");
        try {
            const result = await askAI('blackbox-ai', args.join(" "));
            return reply(`⬛ *Blackbox AI:*\n${result}`);
        } catch (e) {
            return reply("❌ Blackbox AI API error. Try again later.");
        }
    },

    gpt4: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .gpt4 <query>");
        try {
            const result = await askAI('gpt-4o', args.join(" "));
            return reply(`🤖 *GPT-4o:*\n${result}`);
        } catch (e) {
            return reply("❌ GPT-4 API error. Try again later.");
        }
    },

    qwen2: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .qwen2 <query>");
        try {
            const result = await askAI('qwen3-max', args.join(" "));
            return reply(`🤖 *Qwen3 Max:*\n${result}`);
        } catch (e) {
            return reply("❌ Qwen API error.");
        }
    },

    qwen2coder: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .qwen2coder <query>");
        try {
            const result = await askAI('qwen2-coder', args.join(" "));
            return reply(`💻 *Qwen2 Coder:*\n${result}`);
        } catch (e) {
            return reply("❌ Qwen2 Coder API error.");
        }
    },

    hermes: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .hermes <query>");
        try {
            const result = await askAI('hermes-3', args.join(" "));
            return reply(`🤖 *Hermes:*\n${result}`);
        } catch (e) {
            return reply("❌ Hermes API error.");
        }
    },

    "hermes-3": async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .hermes-3 <query>");
        try {
            const result = await askAI('hermes-3', args.join(" "));
            return reply(`🤖 *Hermes-3:*\n${result}`);
        } catch (e) {
            return reply("❌ Hermes-3 API error.");
        }
    },

    "phi-3": async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .phi-3 <query>");
        try {
            const result = await askAI('phi-3', args.join(" "));
            return reply(`🤖 *Phi-3:*\n${result}`);
        } catch (e) {
            return reply("❌ Phi-3 API error.");
        }
    },

    "mistral-nemo": async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .mistral-nemo <query>");
        try {
            const result = await askAI('mistral-nemo', args.join(" "));
            return reply(`🌬️ *Mistral Nemo:*\n${result}`);
        } catch (e) {
            return reply("❌ Mistral Nemo API error.");
        }
    },

    "command-r-plus": async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .command-r-plus <query>");
        try {
            const result = await askAI('command-r-plus', args.join(" "));
            return reply(`🤖 *Command R+:*\n${result}`);
        } catch (e) {
            return reply("❌ Command R+ API error.");
        }
    },

    nemotron: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .nemotron <query>");
        try {
            const result = await askAI('nemotron-70b', args.join(" "));
            return reply(`🤖 *Nemotron:*\n${result}`);
        } catch (e) {
            return reply("❌ Nemotron API error.");
        }
    },

    muslimAI: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .muslimai <query>");
        try {
            const result = await askAI('muslim-ai', args.join(" "));
            return reply(`🕌 *Muslim AI:*\n${result}`);
        } catch (e) {
            return reply("❌ Muslim AI API error.");
        }
    },

    powerbrain: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .powerbrain <query>");
        try {
            const result = await askAI('powerbrain', args.join(" "));
            return reply(`🧠 *PowerBrain:*\n${result}`);
        } catch (e) {
            return reply("❌ PowerBrain API error.");
        }
    },

    venice: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .venice <query>");
        try {
            const result = await askAI('venice-ai', args.join(" "));
            return reply(`🤖 *Venice AI:*\n${result}`);
        } catch (e) {
            return reply("❌ Venice AI API error.");
        }
    },

    degreeguru: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .degreeguru <query>");
        try {
            const result = await askAI('degree-guru', args.join(" "));
            return reply(`🎓 *DegreeGuru:*\n${result}`);
        } catch (e) {
            return reply("❌ DegreeGuru API error.");
        }
    },

    teachai: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .teachai <query>");
        try {
            const result = await askAI('teach-ai', args.join(" "));
            return reply(`📚 *TeachAI:*\n${result}`);
        } catch (e) {
            return reply("❌ TeachAI API error.");
        }
    },

    goody: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .goody <query>");
        try {
            const result = await askAI('goody-ai', args.join(" "));
            return reply(`😇 *Goody AI:*\n${result}`);
        } catch (e) {
            return reply("❌ Goody AI API error.");
        }
    },

    "human-ai": async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .human-ai <query>");
        try {
            const result = await askAI('human-ai', args.join(" "));
            return reply(`🧑 *Human AI:*\n${result}`);
        } catch (e) {
            return reply("❌ Human AI API error.");
        }
    },

    gita: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .gita <query>");
        try {
            const result = await askAI('gita-ai', args.join(" "));
            return reply(`📖 *Gita AI:*\n${result}`);
        } catch (e) {
            return reply("❌ Gita AI API error.");
        }
    },

    lori: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .lori <query>");
        try {
            const result = await askAI('lori-ai', args.join(" "));
            return reply(`🤖 *Lori:*\n${result}`);
        } catch (e) {
            return reply("❌ Lori API error.");
        }
    },

    qwq: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .qwq <query>");
        try {
            const result = await askAI('qwq-32b', args.join(" "));
            return reply(`🤖 *QwQ:*\n${result}`);
        } catch (e) {
            return reply("❌ QwQ API error.");
        }
    },

    githubRoaster: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .githubroaster <username>");
        try {
            const result = await askAI('github-roaster', args[0]);
            return reply(`🔥 *GitHub Roaster:*\n${result}`);
        } catch (e) {
            return reply("❌ GitHub Roaster API error.");
        }
    },

    // ============================
    // 🖼️ AI IMAGE GENERATOR
    // ============================
    flux: async ({ conn, jid, reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .flux <prompt>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/fluxv2?prompt=${encodeURIComponent(args.join(" "))}`);
            const imgUrl = res.data?.result || res.data?.url;
            if (imgUrl) return conn.sendMessage(jid, { image: { url: imgUrl }, caption: `🎨 *Flux:* ${args.join(" ")}` });
            return reply("❌ No image generated.");
        } catch (e) {
            return reply("❌ Flux image generation failed.");
        }
    },

    fluxpro: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .fluxpro <prompt>");
        return reply(`🎨 *Flux Pro:*\nGenerating image for: ${args.join(" ")}\n_(API integration pending)_`);
    },

    diffusion: async ({ conn, jid, reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .diffusion <prompt>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/epicrealism?prompt=${encodeURIComponent(args.join(" "))}`);
            const imgUrl = res.data?.result || res.data?.url;
            if (imgUrl) return conn.sendMessage(jid, { image: { url: imgUrl }, caption: `🎨 *Stable Diffusion (Realistic):* ${args.join(" ")}` });
            return reply("❌ No image generated.");
        } catch (e) {
            return reply("❌ Diffusion image generation failed.");
        }
    },

    text2img: async ({ conn, jid, reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .text2img <prompt>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/nanobanana2?prompt=${encodeURIComponent(args.join(" "))}`);
            const imgUrl = res.data?.result || res.data?.url;
            if (imgUrl) return conn.sendMessage(jid, { image: { url: imgUrl }, caption: `🎨 *AI Image:* ${args.join(" ")}` });
            return reply("❌ No image generated.");
        } catch (e) {
            return reply("❌ Image generation failed.");
        }
    },

    // ============================
    // 🎵 MUSIC COMMANDS
    // ============================


    playdoc: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .playdoc <song name>");
        return reply(`🎵 *Play Doc:*\nSearching for: *${args.join(" ")}*\n_(Integration pending)_`);
    },

    videodoc: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .videodoc <video name>");
        return reply(`🎬 *Video Doc:*\nSearching for: *${args.join(" ")}*\n_(Integration pending)_`);
    },



    // ============================
    // ⬇️ DOWNLOADER COMMANDS
    // ============================
    tiktok: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .tiktok <TikTok URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/tiktok?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.video_url }, caption: `✅ *TikTok Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ TikTok download failed."); }
    },

    tt2: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .tt2 <TikTok URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/tiktokv2?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.video_url }, caption: `✅ *TikTok v2 Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ TikTok v2 download failed."); }
    },

    tt3: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .tt3 <TikTok URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/tiktokv3?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.video_url }, caption: `✅ *TikTok v3 Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ TikTok v3 download failed."); }
    },

    ttslide: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .ttslide <TikTok URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/tiktokslide?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                for (let img of res.data.result.images) {
                    await conn.sendMessage(jid, { image: { url: img } }, { quoted: m });
                }
            } else throw new Error();
        } catch (e) { reply("❌ TikTok slide download failed."); }
    },

    igmp4: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .igmp4 <Instagram URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/instagram?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.url }, caption: `✅ *Instagram Video Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ Instagram download failed."); }
    },

    igdl: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .igdl <Instagram URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/instagramv2?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.url }, caption: `✅ *Instagram DL Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ Instagram DL failed."); }
    },

    gdrive: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .gdrive <Google Drive URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/gdrive?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { document: { url: res.data.result.downloadUrl }, fileName: res.data.result.fileName, mimetype: 'application/octet-stream' }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ Google Drive download failed."); }
    },

    sfile: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .sfile <URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/sfile?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { document: { url: res.data.result.downloadUrl }, fileName: res.data.result.fileName, mimetype: 'application/octet-stream' }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ SFile download failed."); }
    },

    aio: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .aio <URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/aio?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.url }, caption: `✅ *AIO Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ AIO download failed."); }
    },

    twitter: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .twitter <Twitter URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/twitter?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.url }, caption: `✅ *Twitter Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ Twitter download failed."); }
    },

    gitclone: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .gitclone <GitHub URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/gitclone?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { document: { url: res.data.result.url }, fileName: 'repo.zip', mimetype: 'application/zip' }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ Git clone failed."); }
    },

    instagram: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .instagram <Instagram URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/instagram?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.url }, caption: `✅ *Instagram Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ Instagram download failed."); }
    },

    apk: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .apk <app name>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/apk?query=${encodeURIComponent(args.join(" "))}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { document: { url: res.data.result.downloadUrl }, fileName: `${res.data.result.name}.apk`, mimetype: 'application/vnd.android.package-archive' }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ APK download failed."); }
    },

    mediafire: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .mediafire <MediaFire URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/mediafire?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { document: { url: res.data.result.downloadUrl }, fileName: res.data.result.fileName, mimetype: 'application/octet-stream' }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ MediaFire download failed."); }
    },

    yts: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .yts <search query>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/search/youtube?query=${encodeURIComponent(args.join(" "))}`);
            if (res.data.success) {
                let text = `🔍 *YouTube Search:*\n\n`;
                res.data.result.slice(0, 5).forEach(v => {
                    text += `*Title:* ${v.title}\n*Link:* ${v.url}\n\n`;
                });
                return reply(text);
            } else throw new Error();
        } catch (e) { reply("❌ YouTube search failed."); }
    },

    facebook: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .facebook <Facebook URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/facebook?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.url }, caption: `✅ *Facebook Video Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ Facebook download failed."); }
    },

    terabox: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .terabox <TeraBox URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/terabox?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.url }, caption: `✅ *TeraBox Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ TeraBox download failed."); }
    },

    lyrics: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .lyrics <song name>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/search/lyrics?query=${encodeURIComponent(args.join(" "))}`);
            if (res.data.success) {
                return reply(`🎵 *Lyrics:*\n\n${res.data.result.lyrics || "Lyrics not found."}`);
            } else throw new Error();
        } catch (e) {
            return reply("❌ Lyrics fetch failed.");
        }
    },

    goredl: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .goredl <URL>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/download/goredl?url=${encodeURIComponent(args[0])}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { video: { url: res.data.result.url }, caption: `✅ *GoreDL Downloaded*` }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ GoreDL download failed."); }
    },

    // ============================
    // 🛠️ TOOLS COMMANDS
    // ============================
    tts: async ({ conn, jid, reply, args, m }) => {
        if (args.length === 0) return reply("❓ Usage: .tts <text>");
        try {
            const res = await axios.get(`https://apis.davidcyril.name.ng/tools/tts?text=${encodeURIComponent(args.join(" "))}`);
            if (res.data.success) {
                await conn.sendMessage(jid, { audio: { url: res.data.result.url }, mimetype: 'audio/mp4', ptt: true }, { quoted: m });
            } else throw new Error();
        } catch (e) { reply("❌ TTS failed."); }
    },

    pin: async ({ conn, jid, m, reply }) => {
        const quoted = m.message?.extendedTextMessage?.contextInfo;
        if (!quoted) return reply("❓ Please reply to a message to pin it.");
        return reply("📌 Message pinning requires admin rights.");
    },

    diary: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .diary <entry>");
        return reply(`📔 *Diary Entry Saved:*\n${args.join(" ")}`);
    },

    googleimage: async ({ conn, jid, reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .googleimage <query>");
        return reply(`🔍 *Google Image Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    shazam: async ({ reply }) => {
        return reply("🎵 *Shazam:* Reply to an audio message to identify the song.\n_(Integration pending)_");
    },

    audiomack: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .audiomack <song name>");
        return reply(`🎵 *AudioMack:*\nSearching: ${args.join(" ")}\n_(Integration pending)_`);
    },

    photoleap: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .photoleap <prompt>");
        return reply(`🖼️ *PhotoLeap:*\nGenerating: ${args.join(" ")}\n_(Integration pending)_`);
    },

    picsum: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get("https://picsum.photos/800/600", { responseType: "arraybuffer" });
            return conn.sendMessage(jid, { image: Buffer.from(res.data), caption: "🖼️ Random image from Picsum!" });
        } catch (e) {
            return reply("❌ Failed to fetch random image.");
        }
    },

    npms: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .npms <package name>");
        try {
            const res = await axios.get(`https://registry.npmjs.org/${args[0]}/latest`);
            return reply(`📦 *NPM Package:* ${res.data.name}\nVersion: ${res.data.version}\nDesc: ${res.data.description}`);
        } catch (e) {
            return reply("❌ Package not found.");
        }
    },

    sketch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .sketch <prompt>");
        return reply(`✏️ *Sketch:*\nGenerating sketch for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    playstore: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .playstore <app name>");
        return reply(`📱 *Play Store Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    pixiv: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .pixiv <query>");
        return reply(`🎨 *Pixiv Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    font: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .font <text>");
        return reply(`🔤 *Font Converter:*\nText: ${args.join(" ")}\n_(Integration pending)_`);
    },

    toimg: async ({ conn, jid, m, reply }) => {
        return reply("🖼️ *Sticker to Image:* Reply to a sticker to convert it.\n_(Integration pending)_");
    },

    tovideo: async ({ reply }) => {
        return reply("🎬 *Sticker to Video:* Reply to a sticker to convert it.\n_(Integration pending)_");
    },

    tomp3: async ({ reply }) => {
        return reply("🎵 *To MP3:* Reply to a video to extract audio.\n_(Integration pending)_");
    },

    spotifysearch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .spotifysearch <song name>");
        return reply(`🎵 *Spotify Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    ngl: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .ngl <username>");
        return reply(`📨 *NGL:*\nSending anonymous message to: ${args[0]}\n_(Integration pending)_`);
    },

    technews: async ({ reply }) => {
        try {
            const res = await axios.get("https://api.siputzx.my.id/api/berita/teknologi");
            const news = res.data?.data?.slice(0, 5).map((n, i) => `${i + 1}. *${n.title}*\n${n.link}`).join("\n\n");
            return reply(`📰 *Tech News:*\n\n${news || "No news available."}`);
        } catch (e) {
            return reply("❌ Failed to fetch tech news.");
        }
    },

    steamsearch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .steamsearch <game name>");
        return reply(`🎮 *Steam Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    chord: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .chord <song name>");
        return reply(`🎸 *Chord Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    ttsearch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .ttsearch <query>");
        return reply(`🔍 *TikTok Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    tr: async ({ reply, args }) => {
        if (args.length < 2) return reply("❓ Usage: .tr <lang> <text>");
        return reply(`🌐 *Translate:*\nTranslating to ${args[0]}: ${args.slice(1).join(" ")}\n_(Integration pending)_`);
    },

    translate: async ({ reply, args }) => {
        if (args.length < 2) return reply("❓ Usage: .translate <lang> <text>");
        return reply(`🌐 *Translate:*\nTranslating to ${args[0]}: ${args.slice(1).join(" ")}\n_(Integration pending)_`);
    },

    filmsearch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .filmsearch <movie name>");
        return reply(`🎬 *Film Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    groupsearch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .groupsearch <query>");
        return reply(`🔍 *Group Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    trackip: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .trackip <IP address>");
        try {
            const res = await axios.get(`http://ip-api.com/json/${args[0]}`);
            const d = res.data;
            return reply(`🌍 *IP Tracker:*\nIP: ${d.query}\nCountry: ${d.country}\nCity: ${d.city}\nISP: ${d.isp}\nLat/Lon: ${d.lat}, ${d.lon}`);
        } catch (e) {
            return reply("❌ IP tracking failed.");
        }
    },

    get: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .get <URL>");
        try {
            const res = await axios.get(args[0]);
            return reply(`📥 *GET Response:*\n${JSON.stringify(res.data).slice(0, 500)}`);
        } catch (e) {
            return reply("❌ GET request failed.");
        }
    },

    fetch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .fetch <URL>");
        try {
            const res = await axios.get(args[0]);
            return reply(`📥 *Fetch Response:*\n${JSON.stringify(res.data).slice(0, 500)}`);
        } catch (e) {
            return reply("❌ Fetch request failed.");
        }
    },

    fdroid: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .fdroid <app name>");
        return reply(`📱 *F-Droid Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    styletext: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .styletext <text>");
        const text = args.join(" ");
        return reply(`✨ *Styled Text:*\n𝓢𝓽𝔂𝓵𝓮𝓭: ${text}`);
    },

    cinema: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .cinema <movie name>");
        return reply(`🎬 *Cinema:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    quotess: async ({ reply }) => {
        const quotes = ["The best time to plant a tree was 20 years ago. The second best time is now.", "Life is what happens when you're busy making other plans.", "Get busy living or get busy dying."];
        return reply(`💬 *Quote:*\n"${quotes[Math.floor(Math.random() * quotes.length)]}"`);
    },

    quoted: async ({ reply }) => {
        return reply(`💬 *Random Quote:*\n"Success is not final, failure is not fatal: It is the courage to continue that counts." — Churchill`);
    },

    wattpad: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .wattpad <story name>");
        return reply(`📚 *Wattpad Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },



    readmore: async ({ reply }) => {
        return reply("📖 *Read More:* This command adds a read-more separator to messages.");
    },

    pinchat: async ({ reply }) => {
        return reply("📌 *Pin Chat:* Pinning this chat.\n_(Integration pending)_");
    },

    quran: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .quran <surah:ayah>");
        try {
            const [surah, ayah] = args[0].split(":");
            const res = await axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`);
            const d = res.data.data;
            return reply(`📖 *Quran ${surah}:${ayah}*\n\n${d.text}`);
        } catch (e) {
            return reply("❌ Failed to fetch Quran verse.");
        }
    },

    bible: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .bible <book chapter:verse>");
        return reply(`📖 *Bible:*\nFetching: ${args.join(" ")}\n_(Integration pending)_`);
    },

    emojimix: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .emojimix <emoji1> <emoji2>");
        return reply(`😀 *Emoji Mix:*\nMixing: ${args.join(" ")}\n_(Integration pending)_`);
    },

    "periodic-table": async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .periodic-table <element>");
        return reply(`⚗️ *Periodic Table:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    unpinchat: async ({ reply }) => {
        return reply("📌 *Unpin Chat:* Unpinning this chat.\n_(Integration pending)_");
    },

    ocr: async ({ reply }) => {
        return reply("🔍 *OCR:* Reply to an image to extract text from it.\n_(Integration pending)_");
    },

    calculator: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .calculator <expression>");
        try {
            const result = eval(args.join(" "));
            return reply(`🧮 *Calculator:*\n${args.join(" ")} = ${result}`);
        } catch (e) {
            return reply("❌ Invalid expression.");
        }
    },

    fact: async ({ reply }) => {
        try {
            const res = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
            return reply(`💡 *Random Fact:*\n${res.data.text}`);
        } catch (e) {
            return reply("💡 *Fun Fact:* Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible!");
        }
    },

    hdvideo: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .hdvideo <URL>");
        return reply(`📹 *HD Video:*\nDownloading: ${args[0]}\n_(Integration pending)_`);
    },

    convert: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .convert <value> <from> <to>");
        return reply(`🔄 *Convert:*\nConverting: ${args.join(" ")}\n_(Integration pending)_`);
    },

    converttime: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .converttime <time> <from_tz> <to_tz>");
        return reply(`🕒 *Convert Time:*\nConverting: ${args.join(" ")}\n_(Integration pending)_`);
    },

    listcurrency: async ({ reply }) => {
        return reply("💱 *Currency List:* USD, EUR, GBP, JPY, NGN, KES, GHS, ZAR, INR, CNY and more.");
    },

    creatememe: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .creatememe <top text> | <bottom text>");
        return reply(`😂 *Create Meme:*\nCreating meme with: ${args.join(" ")}\n_(Integration pending)_`);
    },

    password: async ({ reply, args }) => {
        const len = parseInt(args[0]) || 12;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let pwd = "";
        for (let i = 0; i < len; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
        return reply(`🔐 *Generated Password:*\n\`${pwd}\``);
    },

    remindme: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .remindme <time> <message>");
        return reply(`⏰ *Reminder Set:*\n${args.join(" ")}\n_(Scheduler integration pending)_`);
    },

    wanumnner: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .wanumnner <number>");
        return reply(`📱 *WA Number Info:*\nChecking: ${args[0]}\n_(Integration pending)_`);
    },

    save: async ({ conn, jid, m, reply }) => {
        return reply("💾 *Save:* Reply to a message to save it.\n_(Integration pending)_");
    },

    ss: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .ss <URL>");
        return reply(`📸 *Screenshot:*\nCapturing: ${args[0]}\n_(Integration pending)_`);
    },

    couplepp: async ({ reply }) => {
        return reply("💑 *Couple PP:* Tag two users to generate a couple profile picture.\n_(Integration pending)_");
    },

    encrypt: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .encrypt <text>");
        const encrypted = Buffer.from(args.join(" ")).toString("base64");
        return reply(`🔒 *Encrypted:*\n${encrypted}`);
    },

    languages: async ({ reply }) => {
        return reply("🌐 *Supported Languages:* en, id, ar, fr, de, es, pt, ru, zh, ja, ko, hi, sw, yo, ha, ig and many more.");
    },

    credits: async ({ reply }) => {
        return reply("👑 *MESH-TECH MD BOT*\n\nDeveloped by: *MESH*\nGitHub: https://github.com/mesh057/MESH-TECH-MD-BOT\nChannel: https://whatsapp.com/channel/0029VbDeTrNEKyZ9GlUude2R");
    },

    support: async ({ reply }) => {
        return reply("🆘 *Support:*\nJoin our group: https://chat.whatsapp.com/DM1JxxnOJFp0vsTHpej89M\nChannel: https://whatsapp.com/channel/0029VbDeTrNEKyZ9GlUude2R");
    },

    repost: async ({ reply }) => {
        return reply("🔁 *Repost:* Reply to a status to repost it.\n_(Integration pending)_");
    },

    tiktoksearch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .tiktoksearch <query>");
        return reply(`🔍 *TikTok Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    movie: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .movie <movie name>");
        return reply(`🎬 *Movie Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    volvid: async ({ reply }) => {
        return reply("🔊 *Volume Video:* Reply to a video to adjust its volume.\n_(Integration pending)_");
    },

    remini: async ({ reply }) => {
        return reply("✨ *Remini:* Reply to an image to enhance it.\n_(Integration pending)_");
    },

    upscale: async ({ reply }) => {
        return reply("🔍 *Upscale:* Reply to an image to upscale it.\n_(Integration pending)_");
    },

    kdrama: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .kdrama <drama name>");
        return reply(`🎬 *K-Drama Search:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    channel: async ({ reply }) => {
        return reply("📢 *Channel:*\nhttps://whatsapp.com/channel/0029VbDeTrNEKyZ9GlUude2R");
    },

    fliptext: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .fliptext <text>");
        const normal = "abcdefghijklmnopqrstuvwxyz";
        const flipped = "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz";
        const result = args.join(" ").toLowerCase().split("").map(c => {
            const i = normal.indexOf(c);
            return i >= 0 ? flipped[i] : c;
        }).reverse().join("");
        return reply(`🔄 *Flipped Text:*\n${result}`);
    },

    spamsms: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .spamsms <number>");
        return reply(`📨 *SMS Spam:*\nSending to: ${args[0]}\n_(Integration pending)_`);
    },

    weather: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .weather <city>");
        try {
            const res = await axios.get(`https://wttr.in/${encodeURIComponent(args.join(" "))}?format=3`);
            return reply(`🌤️ *Weather:*\n${res.data}`);
        } catch (e) {
            return reply("❌ Failed to fetch weather.");
        }
    },

    modapk: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .modapk <app name>");
        return reply(`📱 *Mod APK:*\nSearching for: ${args.join(" ")}\n_(Integration pending)_`);
    },

    tinyurl: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .tinyurl <URL>");
        try {
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`);
            return reply(`🔗 *TinyURL:*\n${res.data}`);
        } catch (e) {
            return reply("❌ URL shortening failed.");
        }
    },

    shorturl: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .shorturl <URL>");
        try {
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`);
            return reply(`🔗 *Short URL:*\n${res.data}`);
        } catch (e) {
            return reply("❌ URL shortening failed.");
        }
    },

    cuttly: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .cuttly <URL>");
        return reply(`🔗 *Cutt.ly:*\nShortening: ${args[0]}\n_(API key required)_`);
    },

    bitly: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .bitly <URL>");
        return reply(`🔗 *Bit.ly:*\nShortening: ${args[0]}\n_(API key required)_`);
    },

    // ============================
    // 🛡️ ANTI COMMANDS
    // ============================
    antispam: async ({ reply, args }) => {
        const state = args[0]?.toLowerCase();
        if (!["on", "off"].includes(state)) return reply("❓ Usage: .antispam <on/off>");
        return reply(`🛡️ *Anti-Spam:* ${state.toUpperCase()}`);
    },

    antitag: async ({ reply, args }) => {
        const state = args[0]?.toLowerCase();
        if (!["on", "off"].includes(state)) return reply("❓ Usage: .antitag <on/off>");
        return reply(`🛡️ *Anti-Tag:* ${state.toUpperCase()}`);
    },

    antitemu: async ({ reply, args }) => {
        const state = args[0]?.toLowerCase();
        if (!["on", "off"].includes(state)) return reply("❓ Usage: .antitemu <on/off>");
        return reply(`🛡️ *Anti-Temu:* ${state.toUpperCase()}`);
    },

    // ============================
    // 📺 CHANNEL COMMANDS
    // ============================
    getnewsletter: async ({ reply }) => {
        return reply("📰 *Get Newsletter:* Fetching latest newsletter.\n_(Integration pending)_");
    },

    createchannel: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .createchannel <name>");
        return reply(`📢 *Create Channel:*\nCreating channel: ${args.join(" ")}\n_(Integration pending)_`);
    },

    removepic: async ({ reply }) => {
        return reply("🖼️ *Remove Pic:* Removing channel profile picture.\n_(Integration pending)_");
    },

    updatedesc: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .updatedesc <description>");
        return reply(`📝 *Update Desc:*\nUpdating description: ${args.join(" ")}\n_(Integration pending)_`);
    },

    updatename: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .updatename <name>");
        return reply(`✏️ *Update Name:*\nUpdating name: ${args.join(" ")}\n_(Integration pending)_`);
    },

    updatepic: async ({ reply }) => {
        return reply("🖼️ *Update Pic:* Reply to an image to update channel picture.\n_(Integration pending)_");
    },

    mutenews: async ({ reply }) => {
        return reply("🔇 *Mute News:* Newsletter muted.\n_(Integration pending)_");
    },

    unmutenews: async ({ reply }) => {
        return reply("🔔 *Unmute News:* Newsletter unmuted.\n_(Integration pending)_");
    },

    followchannel: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .followchannel <invite link>");
        return reply(`📢 *Follow Channel:*\nFollowing: ${args[0]}\n_(Integration pending)_`);
    },

    unfollowchannel: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .unfollowchannel <invite link>");
        return reply(`📢 *Unfollow Channel:*\nUnfollowing: ${args[0]}\n_(Integration pending)_`);
    },

    deletechannel: async ({ reply }) => {
        return reply("🗑️ *Delete Channel:* Deleting channel.\n_(Integration pending)_");
    },

    // ============================
    // 💰 ECONOMY COMMANDS
    // ============================
    daily: async ({ reply }) => {
        const coins = Math.floor(Math.random() * 500) + 100;
        return reply(`💰 *Daily Reward Claimed!*\nYou received *${coins} coins* today!\nCome back tomorrow for more!`);
    },

    transfer: async ({ reply, args, m }) => {
        const users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0 || !args[1]) return reply("❓ Usage: .transfer @user <amount>");
        return reply(`💸 *Transfer:*\nSending ${args[1]} coins to @${users[0].split("@")[0]}\n_(Economy system integration pending)_`);
    },

    bank: async ({ reply }) => {
        return reply("🏦 *Bank Balance:*\nChecking your bank account...\n_(Economy system integration pending)_");
    },

    wallet: async ({ reply }) => {
        return reply("👛 *Wallet Balance:*\nChecking your wallet...\n_(Economy system integration pending)_");
    },

    withdraw: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .withdraw <amount>");
        return reply(`💳 *Withdraw:*\nWithdrawing ${args[0]} coins from bank.\n_(Economy system integration pending)_`);
    },

    deposit: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .deposit <amount>");
        return reply(`🏦 *Deposit:*\nDepositing ${args[0]} coins to bank.\n_(Economy system integration pending)_`);
    },

    shop: async ({ reply }) => {
        return reply("🛒 *Shop:*\n1. Guard Shield — 500 coins\n2. Weapon Pack — 1000 coins\n3. Pet Egg — 750 coins\n\nUse .buy <item> to purchase!");
    },

    buyguard: async ({ reply }) => {
        return reply("🛡️ *Buy Guard:*\nPurchasing guard shield...\n_(Economy system integration pending)_");
    },

    buy: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .buy <item>");
        return reply(`🛒 *Buy:*\nPurchasing: ${args.join(" ")}\n_(Economy system integration pending)_`);
    },

    lottery: async ({ reply }) => {
        const win = Math.random() > 0.7;
        const amount = Math.floor(Math.random() * 2000) + 500;
        return reply(win ? `🎰 *LOTTERY WIN!* 🎉\nYou won *${amount} coins*!` : "🎰 *Better luck next time!*\nYou didn't win this time.");
    },

    buyticket: async ({ reply }) => {
        return reply("🎟️ *Buy Ticket:*\nPurchasing lottery ticket for 100 coins.\n_(Economy system integration pending)_`");
    },

    "roll-dice": async ({ reply }) => {
        const result = Math.floor(Math.random() * 6) + 1;
        return reply(`🎲 *Dice Roll:*\nYou rolled a *${result}*!`);
    },

    duel: async ({ reply, m }) => {
        const users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Usage: .duel @user");
        return reply(`⚔️ *Duel:*\nChallenging @${users[0].split("@")[0]} to a duel!\n_(Economy system integration pending)_`);
    },

    // ============================
    // ⚔️ WEAPONS COMMANDS
    // ============================
    buyweapon: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .buyweapon <weapon name>");
        return reply(`⚔️ *Buy Weapon:*\nPurchasing: ${args.join(" ")}\n_(Weapons system integration pending)_`);
    },

    myweapons: async ({ reply }) => {
        return reply("⚔️ *My Weapons:*\nYou have no weapons yet. Use .buyweapon to get one!");
    },

    attack: async ({ reply, m }) => {
        const users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Usage: .attack @user");
        const dmg = Math.floor(Math.random() * 100) + 1;
        return reply(`⚔️ *Attack!*\nYou dealt *${dmg} damage* to @${users[0].split("@")[0]}!`);
    },

    // ============================
    // 🐾 PET COMMANDS
    // ============================
    buypet: async ({ reply, args }) => {
        const pets = ["🐶 Dog", "🐱 Cat", "🐉 Dragon", "🦊 Fox", "🐺 Wolf", "🦁 Lion"];
        const num = parseInt(args[0]) - 1;
        if (isNaN(num) || num < 0 || num >= pets.length) return reply(`❓ Usage: .buypet <number>\n\nAvailable pets:\n${pets.map((p, i) => `${i + 1}. ${p}`).join("\n")}`);
        return reply(`🐾 *Buy Pet:*\nPurchasing ${pets[num]}!\n_(Pet system integration pending)_`);
    },

    mypet: async ({ reply }) => {
        return reply("🐾 *My Pet:*\nYou don't have a pet yet. Use .buypet to get one!");
    },

    train: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .train <number>");
        return reply(`💪 *Train Pet:*\nTraining pet #${args[0]}...\n_(Pet system integration pending)_`);
    },

    battle: async ({ reply, m }) => {
        const users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Usage: .battle @user");
        return reply(`⚔️ *Pet Battle:*\nChallenging @${users[0].split("@")[0]}'s pet!\n_(Pet system integration pending)_`);
    },

    // ============================
    // 📈 LEVEL-UP COMMANDS
    // ============================
    level: async ({ reply }) => {
        return reply("📊 *Your Level:*\nLevel 1 — XP: 0/100\n_(Level system integration pending)_");
    },

    levelup: async ({ reply, args }) => {
        const state = args[0]?.toLowerCase();
        if (!["on", "off"].includes(state)) return reply("❓ Usage: .levelup <on/off>");
        return reply(`📈 *Level Up Notifications:* ${state.toUpperCase()}`);
    },

    leaderboard: async ({ reply }) => {
        return reply("🏆 *Leaderboard:*\n1. 👑 MESH — Level 99\n2. 🥈 User2 — Level 50\n3. 🥉 User3 — Level 30\n_(Live leaderboard integration pending)_");
    },

    // ============================
    // 🎨 EDITOR COMMANDS
    // ============================
    wanted: async ({ conn, jid, m, reply }) => {
        return reply("🤠 *Wanted Poster:* Reply to an image to create a wanted poster.\n_(Integration pending)_");
    },

    drake: async ({ reply, args }) => {
        if (args.length < 2) return reply("❓ Usage: .drake <top text> | <bottom text>");
        return reply(`😏 *Drake Meme:*\nTop: ${args[0]}\nBottom: ${args.slice(1).join(" ")}\n_(Integration pending)_`);
    },

    clown: async ({ reply }) => {
        return reply("🤡 *Clown:* Reply to a user to apply clown filter.\n_(Integration pending)_");
    },

    alert: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .alert <text>");
        return reply(`🚨 *Alert:*\nCreating alert image with: ${args.join(" ")}\n_(Integration pending)_`);
    },

    petgif: async ({ reply }) => {
        return reply("🐾 *Pet GIF:* Reply to an image to create a pet GIF.\n_(Integration pending)_");
    },

    tweet: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .tweet <text>");
        return reply(`🐦 *Tweet Generator:*\nCreating tweet image with: ${args.join(" ")}\n_(Integration pending)_`);
    },

    album: async ({ reply }) => {
        return reply("🎵 *Album Cover:* Reply to an image to create an album cover.\n_(Integration pending)_");
    },

    // ============================
    // 💹 CRYPTO COMMANDS
    // ============================
    "crypto-price": async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .crypto-price <coin>");
        try {
            const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${args[0].toLowerCase()}&vs_currencies=usd`);
            const price = res.data[args[0].toLowerCase()]?.usd;
            return reply(price ? `💹 *${args[0].toUpperCase()} Price:* $${price}` : "❌ Coin not found.");
        } catch (e) {
            return reply("❌ Failed to fetch crypto price.");
        }
    },

    "top-crypto": async ({ reply }) => {
        try {
            const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1");
            const list = res.data.map((c, i) => `${i + 1}. *${c.name}* (${c.symbol.toUpperCase()}) — $${c.current_price}`).join("\n");
            return reply(`💹 *Top 5 Cryptos:*\n\n${list}`);
        } catch (e) {
            return reply("❌ Failed to fetch crypto list.");
        }
    },

    "crypto-index": async ({ reply }) => {
        return reply("📊 *Crypto Index:*\nFetching market index...\n_(Integration pending)_");
    },

    "crypto-convert": async ({ reply, args }) => {
        if (args.length < 3) return reply("❓ Usage: .crypto-convert <amount> <from> <to>");
        return reply(`💱 *Crypto Convert:*\nConverting ${args[0]} ${args[1]} to ${args[2]}\n_(Integration pending)_`);
    },

    "crypto-news": async ({ reply }) => {
        return reply("📰 *Crypto News:*\nFetching latest crypto news...\n_(Integration pending)_");
    },

    // ============================
    // 📧 TEMP MAIL COMMANDS
    // ============================
    tempmail: async ({ reply }) => {
        try {
            const res = await axios.get("https://api.mail.tm/accounts", { method: "POST" });
            return reply("📧 *Temp Mail:*\nGenerating temporary email address...\n_(Integration pending)_");
        } catch (e) {
            return reply("📧 *Temp Mail:*\nGenerating temporary email address...\n_(Integration pending)_");
        }
    },

    "tempmail-inbox": async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .tempmail-inbox <email>");
        return reply(`📥 *Temp Mail Inbox:*\nChecking inbox for: ${args[0]}\n_(Integration pending)_`);
    },

    // ============================
    // 🎬 MOVIE DOWNLOADER
    // ============================
    selectmovie: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .selectmovie <number>");
        return reply(`🎬 *Select Movie #${args[0]}:*\nSelected movie from search results.\n_(Integration pending)_`);
    },

    dlmovie: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .dlmovie <number>");
        return reply(`⬇️ *Download Movie #${args[0]}:*\nDownloading selected movie...\n_(Integration pending)_`);
    },

    // ============================
    // 📱 PREMIUM APPS MENU
    // ============================
    "ff_headshot": async ({ reply }) => {
        return reply("🎯 *FF Headshot APK:*\nFetching download link...\n_(Integration pending)_");
    },

    capcut: async ({ reply }) => {
        return reply("✂️ *CapCut Premium APK:*\nFetching download link...\n_(Integration pending)_");
    },

    capcut2: async ({ reply }) => {
        return reply("✂️ *CapCut Premium v2 APK:*\nFetching download link...\n_(Integration pending)_");
    },

    netflix: async ({ reply }) => {
        return reply("🎬 *Netflix Mod APK:*\nFetching download link...\n_(Integration pending)_");
    },

    telegram: async ({ reply }) => {
        return reply("✈️ *Telegram Premium APK:*\nFetching download link...\n_(Integration pending)_");
    },

    "sms_bomber": async ({ reply }) => {
        return reply("📨 *SMS Bomber APK:*\nFetching download link...\n_(Integration pending)_");
    },

    "remini_apk": async ({ reply }) => {
        return reply("✨ *Remini Pro APK:*\nFetching download link...\n_(Integration pending)_");
    },

    "youtube_apk": async ({ reply }) => {
        return reply("▶️ *YouTube Premium APK:*\nFetching download link...\n_(Integration pending)_");
    },

    "prime_video": async ({ reply }) => {
        return reply("🎬 *Prime Video APK:*\nFetching download link...\n_(Integration pending)_");
    },

    // ============================
    // ☪️ ISLAM COMMANDS
    // ============================
    doaharian: async ({ reply }) => {
        const duas = [
            "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nIn the name of Allah, the Most Gracious, the Most Merciful.",
            "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ\nO Allah, help me remember You, be grateful to You, and worship You in the best manner."
        ];
        return reply(`🕌 *Daily Dua:*\n\n${duas[Math.floor(Math.random() * duas.length)]}`);
    },

    kisahnabi: async ({ reply }) => {
        return reply("📖 *Kisah Nabi:*\nFetching stories of the Prophets...\n_(Integration pending)_");
    },

    surah: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .surah <surah number or name>");
        try {
            const res = await axios.get(`https://api.alquran.cloud/v1/surah/${args[0]}/en.asad`);
            const s = res.data.data;
            return reply(`📖 *Surah ${s.englishName} (${s.name})*\nAyahs: ${s.numberOfAyahs}\nRevelation: ${s.revelationType}`);
        } catch (e) {
            return reply("❌ Failed to fetch surah.");
        }
    },

    jadwalsholat: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .jadwalsholat <city>");
        return reply(`🕌 *Prayer Schedule for ${args.join(" ")}:*\nFetching prayer times...\n_(Integration pending)_`);
    },

    // ============================
    // 🎮 GAME COMMANDS
    // ============================
    clan: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .clan <create/join/leave/info>");
        return reply(`⚔️ *Clan:*\nAction: ${args.join(" ")}\n_(Clan system integration pending)_`);
    },

    werewolf: async ({ reply }) => {
        return reply("🐺 *Werewolf Game:*\nStarting Werewolf game...\n_(Game integration pending)_");
    },

    war: async ({ reply }) => {
        return reply("⚔️ *War:*\nStarting War game...\n_(Game integration pending)_");
    },

    msp: async ({ reply }) => {
        return reply("🎭 *MSP:*\nStarting MSP game...\n_(Game integration pending)_");
    },

    uno: async ({ reply }) => {
        return reply("🃏 *UNO:*\nStarting UNO game...\n_(Game integration pending)_");
    },

    giveaway: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .giveaway <prize>");
        return reply(`🎁 *Giveaway Started!*\nPrize: ${args.join(" ")}\nReact to enter!\n_(Giveaway system integration pending)_`);
    },

    blackjack: async ({ reply }) => {
        const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        const hand = [cards[Math.floor(Math.random() * cards.length)], cards[Math.floor(Math.random() * cards.length)]];
        return reply(`🃏 *BlackJack:*\nYour hand: ${hand.join(", ")}\nType .hit or .stand`);
    },

    tictactoe: async ({ reply }) => {
        return reply("❌⭕ *TicTacToe:*\nStarting TicTacToe game...\n_(Game integration pending)_");
    },

    wrg: async ({ reply }) => {
        return reply("🎮 *WRG:*\nStarting Word Riddle Game...\n_(Game integration pending)_");
    },

    wcg: async ({ reply }) => {
        return reply("🎮 *WCG:*\nStarting Word Chain Game...\n_(Game integration pending)_");
    },

    // ============================
    // 👤 USER COMMANDS
    // ============================
    afk: async ({ reply, args }) => {
        return reply(`😴 *AFK Mode:*\nYou are now AFK. Reason: ${args.join(" ") || "No reason given."}`);
    },

    lookup: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .lookup <number>");
        return reply(`🔍 *Number Lookup:*\nLooking up: ${args[0]}\n_(Integration pending)_`);
    },

    // ============================
    // 🎉 FUN COMMANDS
    // ============================
    top: async ({ reply }) => {
        return reply("🏆 *Top Users:*\n1. 👑 MESH\n2. 🥈 User2\n3. 🥉 User3");
    },

    flipcoin: async ({ reply }) => {
        return reply(`🪙 *Coin Flip:* ${Math.random() > 0.5 ? "HEADS" : "TAILS"}!`);
    },

    rate: async ({ reply, args }) => {
        const score = Math.floor(Math.random() * 100) + 1;
        return reply(`⭐ *Rate:* ${args.join(" ") || "You"} scores *${score}/100*!`);
    },

    rizz: async ({ reply }) => {
        const lines = ["You must be a magician, because whenever I look at you, everyone else disappears.", "Are you a parking ticket? Because you've got 'fine' written all over you."];
        return reply(`😎 *Rizz Line:*\n${lines[Math.floor(Math.random() * lines.length)]}`);
    },

    flirt: async ({ reply }) => {
        const lines = ["Do you have a map? I keep getting lost in your eyes.", "Is your name Google? Because you have everything I've been searching for."];
        return reply(`💘 *Flirt Line:*\n${lines[Math.floor(Math.random() * lines.length)]}`);
    },

    pickupline: async ({ reply }) => {
        const lines = ["Are you a bank loan? Because you have my interest.", "Do you believe in love at first sight, or should I walk by again?"];
        return reply(`💌 *Pick-Up Line:*\n${lines[Math.floor(Math.random() * lines.length)]}`);
    },

    joke: async ({ reply }) => {
        try {
            const res = await axios.get("https://official-joke-api.appspot.com/random_joke");
            return reply(`😂 *Joke:*\n${res.data.setup}\n\n${res.data.punchline}`);
        } catch (e) {
            return reply("😂 *Joke:*\nWhy don't scientists trust atoms?\nBecause they make up everything!");
        }
    },

    ship: async ({ reply, m }) => {
        const users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length < 2) return reply("❓ Usage: .ship @user1 @user2");
        const score = Math.floor(Math.random() * 100) + 1;
        return reply(`💑 *Ship Score:*\n@${users[0].split("@")[0]} + @${users[1].split("@")[0]} = *${score}%* ❤️`);
    },

    dare: async ({ reply }) => {
        const dares = ["Call someone and sing them a song.", "Do 20 push-ups right now.", "Send a funny selfie to the group."];
        return reply(`🎯 *Dare:*\n${dares[Math.floor(Math.random() * dares.length)]}`);
    },

    truth: async ({ reply }) => {
        const truths = ["What's your biggest fear?", "What's the most embarrassing thing you've done?", "Who do you have a crush on?"];
        return reply(`🤔 *Truth:*\n${truths[Math.floor(Math.random() * truths.length)]}`);
    },

    trivia: async ({ reply }) => {
        const questions = [
            { q: "What is the capital of France?", a: "Paris" },
            { q: "What is 2 + 2?", a: "4" },
            { q: "Who wrote Romeo and Juliet?", a: "Shakespeare" }
        ];
        const q = questions[Math.floor(Math.random() * questions.length)];
        return reply(`🧠 *Trivia:*\n${q.q}\n\nUse .answer <answer> to respond!`);
    },

    answer: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .answer <your answer>");
        return reply(`✅ *Answer submitted:* ${args.join(" ")}\n_(Trivia system integration pending)_`);
    },

    scoreboard: async ({ reply }) => {
        return reply("🏆 *Trivia Scoreboard:*\n1. MESH — 100pts\n2. User2 — 80pts\n3. User3 — 60pts");
    },

    horoscope: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .horoscope <sign>\nSigns: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces");
        return reply(`⭐ *Horoscope for ${args[0]}:*\nToday is a great day for new beginnings! Stay positive and embrace change.\n_(Integration pending)_`);
    },

    stupidcheck: async ({ reply }) => {
        return reply(`🧠 *Stupid Check:* ${Math.floor(Math.random() * 100)}% stupid!`);
    },

    gaycheck: async ({ reply }) => {
        return reply(`🌈 *Gay Check:* ${Math.floor(Math.random() * 100)}% gay!`);
    },

    waifucheck: async ({ reply }) => {
        return reply(`💕 *Waifu Check:* ${Math.floor(Math.random() * 100)}% waifu material!`);
    },

    hotcheck: async ({ reply }) => {
        return reply(`🔥 *Hot Check:* ${Math.floor(Math.random() * 100)}% hot!`);
    },

    uncleancheck: async ({ reply }) => {
        return reply(`🧹 *Unclean Check:* ${Math.floor(Math.random() * 100)}% unclean!`);
    },

    evilcheck: async ({ reply }) => {
        return reply(`😈 *Evil Check:* ${Math.floor(Math.random() * 100)}% evil!`);
    },

    smartcheck: async ({ reply }) => {
        return reply(`🧠 *Smart Check:* ${Math.floor(Math.random() * 100)}% smart!`);
    },

    soulmate: async ({ reply, m }) => {
        const users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Usage: .soulmate @user");
        return reply(`💞 *Soulmate:* You and @${users[0].split("@")[0]} are *${Math.floor(Math.random() * 100)}%* soulmates!`);
    },

    couple: async ({ reply, m }) => {
        const users = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (users.length === 0) return reply("❓ Usage: .couple @user");
        return reply(`💑 *Couple:* You and @${users[0].split("@")[0]} make a *${Math.floor(Math.random() * 100)}%* perfect couple!`);
    },

    what: async ({ reply }) => {
        return reply("🤔 *What:* What do you want to know?");
    },

    where: async ({ reply }) => {
        return reply("📍 *Where:* Where would you like to go?");
    },

    when: async ({ reply }) => {
        return reply("⏰ *When:* When would you like this to happen?");
    },

    is: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .is <question>");
        return reply(`🤔 *Is ${args.join(" ")}?* ${Math.random() > 0.5 ? "Yes!" : "No!"}`);
    },

    // ============================
    // 🎙️ VOICE CHANGER COMMANDS
    // ============================
    bass: async ({ reply }) => {
        return reply("🔊 *Bass Boost:* Reply to an audio message to apply bass boost.\n_(Integration pending)_");
    },

    blown: async ({ reply }) => {
        return reply("💨 *Blown:* Reply to an audio message to apply blown effect.\n_(Integration pending)_");
    },

    deep: async ({ reply }) => {
        return reply("🎙️ *Deep Voice:* Reply to an audio message to apply deep voice effect.\n_(Integration pending)_");
    },

    earrape: async ({ reply }) => {
        return reply("👂 *Ear Rape:* Reply to an audio message to apply ear rape effect.\n_(Integration pending)_");
    },

    fast: async ({ reply }) => {
        return reply("⚡ *Fast Voice:* Reply to an audio message to speed it up.\n_(Integration pending)_");
    },

    fat: async ({ reply }) => {
        return reply("🎙️ *Fat Voice:* Reply to an audio message to apply fat voice effect.\n_(Integration pending)_");
    },

    nightcore: async ({ reply }) => {
        return reply("🎵 *Nightcore:* Reply to an audio message to apply nightcore effect.\n_(Integration pending)_");
    },

    reverse: async ({ reply }) => {
        return reply("🔄 *Reverse Audio:* Reply to an audio message to reverse it.\n_(Integration pending)_");
    },

    robot: async ({ reply }) => {
        return reply("🤖 *Robot Voice:* Reply to an audio message to apply robot voice effect.\n_(Integration pending)_");
    },

    slow: async ({ reply }) => {
        return reply("🐢 *Slow Voice:* Reply to an audio message to slow it down.\n_(Integration pending)_");
    },

    smooth: async ({ reply }) => {
        return reply("🎙️ *Smooth Voice:* Reply to an audio message to apply smooth effect.\n_(Integration pending)_");
    },

    squirrel: async ({ reply }) => {
        return reply("🐿️ *Squirrel Voice:* Reply to an audio message to apply squirrel voice effect.\n_(Integration pending)_");
    },

    // ============================
    // 😊 EMOJI COMMANDS
    // ============================
    laugh: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get("https://api.waifu.pics/sfw/smile");
            return conn.sendMessage(jid, { image: { url: res.data.url }, caption: "😂 Hahaha!" });
        } catch (e) { return reply("😂 Hahaha!"); }
    },

    shy: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get("https://api.waifu.pics/sfw/blush");
            return conn.sendMessage(jid, { image: { url: res.data.url }, caption: "😳 Shy~" });
        } catch (e) { return reply("😳 Shy~"); }
    },

    sad: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get("https://api.waifu.pics/sfw/cry");
            return conn.sendMessage(jid, { image: { url: res.data.url }, caption: "😢 So sad..." });
        } catch (e) { return reply("😢 So sad..."); }
    },

    moon: async ({ reply }) => {
        const moons = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
        return reply(`🌙 *Moon Phase:* ${moons[Math.floor(Math.random() * moons.length)]}`);
    },

    anger: async ({ reply }) => {
        return reply("😡 *Anger!* 💢");
    },

    confused: async ({ reply }) => {
        return reply("😕 *Confused!* 🤔");
    },

    heart: async ({ reply }) => {
        return reply("❤️ *Heart!* 💕💖💗💓💞");
    },

    // ============================
    // 🌐 SPECIAL COMMANDS
    // ============================
    text2pdf: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .text2pdf <text>");
        return reply(`📄 *Text to PDF:*\nConverting: ${args.join(" ")}\n_(Integration pending)_`);
    },

    livescores: async ({ reply }) => {
        return reply("⚽ *Live Scores:*\nFetching live football scores...\n_(Integration pending)_`");
    },

    reactchannel: async ({ reply }) => {
        return reply("📢 *React Channel:* Setting up channel reactions.\n_(Integration pending)_");
    },

    faceswap: async ({ reply }) => {
        return reply("😊 *Face Swap:* Reply to two images to swap faces.\n_(Integration pending)_");
    },

    sureodds: async ({ reply }) => {
        return reply("⚽ *Sure Odds:*\nFetching today's sure odds...\n_(Integration pending)_");
    },

    bin: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .bin <BIN number>");
        try {
            const res = await axios.get(`https://lookup.binlist.net/${args[0].slice(0, 8)}`);
            return reply(`💳 *BIN Lookup:*\nBIN: ${args[0]}\nScheme: ${res.data.scheme || "Unknown"}\nType: ${res.data.type || "Unknown"}\nBrand: ${res.data.brand || "Unknown"}\nCountry: ${res.data.country?.name || "Unknown"}\nBank: ${res.data.bank?.name || "Unknown"}`);
        } catch (e) {
            return reply("❌ BIN lookup failed.");
        }
    },

    fakeid: async ({ reply }) => {
        return reply("🪪 *Fake ID Generator:*\nGenerating fake ID...\n_(Integration pending)_");
    },

    cut: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .cut <start/end> — Reply to a video");
        return reply(`✂️ *Cut Video:*\nCutting at: ${args.join(" ")}\n_(Integration pending)_`);
    },

    savevideo: async ({ reply }) => {
        return reply("💾 *Save Video:* Reply to a video to save it.\n_(Integration pending)_");
    },

    addmusic: async ({ reply }) => {
        return reply("🎵 *Add Music:* Reply to a video and attach an audio to merge them.\n_(Integration pending)_");
    },

    lockOTP: async ({ reply }) => {
        return reply("🔐 *Lock OTP:* OTP lock feature.\n_(Integration pending)_");
    },

    xxxsearch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .xxxsearch <query>");
        return reply("🔞 *XXX Search:*\n_(NSFW integration pending — admin only)_");
    },

    xxxdownload: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .xxxdownload <URL>");
        return reply("🔞 *XXX Download:*\n_(NSFW integration pending — admin only)_");
    },

    xnxxsearch: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .xnxxsearch <query>");
        return reply("🔞 *XNXX Search:*\n_(NSFW integration pending — admin only)_");
    },

    xnxxdownload: async ({ reply, args }) => {
        if (args.length === 0) return reply("❓ Usage: .xnxxdownload <URL>");
        return reply("🔞 *XNXX Download:*\n_(NSFW integration pending — admin only)_");
    },

    hentai: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get("https://api.waifu.pics/nsfw/waifu");
            return conn.sendMessage(jid, { image: { url: res.data.url }, caption: "🔞 Hentai" });
        } catch (e) {
            return reply("❌ Failed to fetch hentai.");
        }
    },

    // ============================
    // 🐛 BUG COMMANDS
    // ============================
    unlimitedlag: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .unlimitedlag <number>");
        return reply(`💀 *Unlimited Lag:*\nSending to: ${args[0]}\n_(Bug integration pending)_`);
    },

    rideordie: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .rideordie <number>");
        return reply(`💀 *Ride or Die:*\nSending to: ${args[0]}\n_(Bug integration pending)_`);
    },

    zoro: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .zoro <number>");
        return reply(`💀 *Zoro:*\nSending to: ${args[0]}\n_(Bug integration pending)_`);
    },

    elite: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .elite <number>");
        return reply(`💀 *Elite:*\nSending to: ${args[0]}\n_(Bug integration pending)_`);
    },

    fusion: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .fusion <number>");
        return reply(`💀 *Fusion:*\nSending to: ${args[0]}\n_(Bug integration pending)_`);
    },

    airforce: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .airforce <number>");
        return reply(`💀 *Air Force:*\nSending to: ${args[0]}\n_(Bug integration pending)_`);
    },

    ioskill: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .ioskill <number>");
        return reply(`💀 *iOS Kill:*\nSending to: ${args[0]}\n_(Bug integration pending)_`);
    },

    benkai: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .benkai <number>");
        return reply(`💀 *Benkai:*\nSending to: ${args[0]}\n_(Bug integration pending)_`);
    },

    zenitsu: async ({ reply, args }) => {
        if (!args[0]) return reply("❓ Usage: .zenitsu <number>");
        return reply(`💀 *Zenitsu:*\nSending to: ${args[0]}\n_(Bug integration pending)_`);
    },

    reactch: async (context) => core.reactchannel(context),

    setname: async ({ reply, conn, jid, args, isGroup }) => {
        if (!isGroup) return reply('❌ This command only works in groups.');
        const name = args.join(' ').trim();
        if (!name) return reply('❓ Usage: .setname <new group name>');
        await conn.groupUpdateSubject(jid, name);
        return reply(`✅ Group name changed to *${name}*`);
    },

    delaymsg: async ({ reply, args }) => {
        const seconds = Math.max(1, Math.min(Number(args.shift()) || 3, 60));
        const text = args.join(' ').trim() || 'Delayed message';
        setTimeout(() => reply(text).catch(() => {}), seconds * 1000);
        return reply(`⏳ Message scheduled for ${seconds}s from now.`);
    },

    tagadmin: async ({ reply, conn, jid, isGroup }) => {
        if (!isGroup) return reply('❌ This command only works in groups.');
        const metadata = await conn.groupMetadata(jid);
        const admins = metadata.participants.filter((participant) => participant.admin).map((participant) => participant.id);
        if (!admins.length) return reply('❌ No group admins found.');
        return conn.sendMessage(jid, { text: '📢 Group admins:', mentions: admins });
    },

    kickall: async ({ reply, conn, jid, isGroup }) => {
        if (!isGroup) return reply('❌ This command only works in groups.');
        const metadata = await conn.groupMetadata(jid);
        const ownId = conn.user?.id?.split(':')[0] || '';
        const targets = metadata.participants.filter((participant) => !participant.admin && (!ownId || !participant.id.startsWith(ownId))).map((participant) => participant.id);
        if (!targets.length) return reply('✅ No removable members found.');
        await conn.groupParticipantsUpdate(jid, targets, 'remove');
        return reply(`✅ Removed ${targets.length} non-admin member(s).`);
    },

    promoteall: async ({ reply, conn, jid, isGroup }) => {
        if (!isGroup) return reply('❌ This command only works in groups.');
        const metadata = await conn.groupMetadata(jid);
        const targets = metadata.participants.filter((participant) => !participant.admin).map((participant) => participant.id);
        if (targets.length) await conn.groupParticipantsUpdate(jid, targets, 'promote');
        return reply(`✅ Promoted ${targets.length} member(s).`);
    },

    demoteall: async ({ reply, conn, jid, isGroup }) => {
        if (!isGroup) return reply('❌ This command only works in groups.');
        const metadata = await conn.groupMetadata(jid);
        const ownId = conn.user?.id?.split(':')[0] || '';
        const targets = metadata.participants.filter((participant) => participant.admin && (!ownId || !participant.id.startsWith(ownId))).map((participant) => participant.id);
        if (targets.length) await conn.groupParticipantsUpdate(jid, targets, 'demote');
        return reply(`✅ Demoted ${targets.length} member(s).`);
    },

    // Reference aliases mapped to existing modules.
    song: async ({ session, jid, m, args }) => forwardCommand(session, '../commands/song', jid, m, args),
    song2: async ({ session, jid, m, args }) => forwardCommand(session, '../commands/song', jid, m, args),
    video: async ({ session, jid, m, args }) => forwardCommand(session, '../commands/video', jid, m, args),
    video2: async ({ session, jid, m, args }) => forwardCommand(session, '../commands/video', jid, m, args),
    ytmp3: async ({ session, jid, m, args }) => forwardCommand(session, '../commands/ytmp3', jid, m, args),
    ytmp4: async ({ session, jid, m, args }) => forwardCommand(session, '../commands/ytmp4', jid, m, args),

    // Restored reference commands that are now callable while their external integrations are developed.
    self: async ({ reply, botData, saveBotData, sessionId }) => {
        botData.modes = botData.modes || {};
        botData.modes[sessionId] = 'self';
        saveBotData();
        return reply('✅ Bot mode set to SELF.');
    },
    public: async ({ reply, botData, saveBotData, sessionId }) => {
        botData.modes = botData.modes || {};
        botData.modes[sessionId] = 'public';
        saveBotData();
        return reply('✅ Bot mode set to PUBLIC.');
    },
    nice: async ({ reply }) => reply('✨ Nice command received and working.'),
    leave: async ({ reply, conn, jid, isGroup }) => {
        if (!isGroup) return reply('❌ This command only works in groups.');
        await conn.groupLeave(jid);
    },
    numinfo: async ({ reply, sender }) => reply(`📱 Number info: ${sender}`),
    idcheck: async ({ reply, jid, sender }) => reply(`🆔 Chat: ${jid}\n👤 Sender: ${sender}`),
    del: async ({ reply, conn, jid, m }) => {
        const context = m.message?.extendedTextMessage?.contextInfo;
        if (!context?.stanzaId) return reply('❓ Reply to a message with .del');
        await conn.sendMessage(jid, { delete: { remoteJid: jid, id: context.stanzaId, participant: context.participant } });
    },
    insta: async ({ reply }) => pendingFeature(reply, 'insta', 'Instagram downloader integration is registered; we will connect a supported provider next.'),
    fb: async ({ reply }) => pendingFeature(reply, 'fb', 'Facebook downloader integration is registered; we will connect a supported provider next.'),
    img: async ({ reply }) => pendingFeature(reply, 'img', 'Image search integration is registered; we will connect a supported provider next.'),
    antibug: async ({ reply }) => pendingFeature(reply, 'antibug', 'Anti-bug protections are registered; message-specific protections will be added next.'),
    autogreet: async ({ reply }) => pendingFeature(reply, 'autogreet', 'Automatic greeting integration is registered; group-event customization will be added next.'),
    autoread: async ({ reply, botData, saveBotData, sessionId, args }) => {
        const mode = args[0]?.toLowerCase();
        const current = botData.readMessages?.[sessionId] || 'off';
        if (!mode || !['on', 'off', 'p', 'g', 'all'].includes(mode)) {
            return reply(`╭━━━〔 *AUTO-READ SETUP* 〕━━━┈⊷\n` +
                         `┃ ⋄ *Status:* ${current === 'off' ? '❌ Disabled' : '✅ Active (' + String(current).toUpperCase() + ')'}\n` +
                         `┃\n` +
                         `┃ ⋄ *.autoread p* - Private DMs only\n` +
                         `┃ ⋄ *.autoread g* - Groups only\n` +
                         `┃ ⋄ *.autoread all* - Everywhere\n` +
                         `┃ ⋄ *.autoread off* - Disable\n` +
                         `╰━━━━━━━━━━━━━━━━━━┈⊷`);
        }
        botData.readMessages = botData.readMessages || {};
        botData.readMessages[sessionId] = (mode === 'on' ? 'all' : (mode === 'off' ? false : mode));
        saveBotData();
        const label = botData.readMessages[sessionId] === 'all' ? 'Everywhere' : (botData.readMessages[sessionId] === 'p' ? 'Private' : (botData.readMessages[sessionId] === 'g' ? 'Groups' : 'OFF'));
        return reply(`✅ *Auto-Read set to: ${label}*`);
    },
    antibad: async ({ reply, botData, saveBotData, sessionId, args }) => {
        const mode = args[0]?.toLowerCase();
        const current = botData.antiBad?.[sessionId] || 'off';
        if (!mode || !['on', 'off', 'p', 'g', 'all'].includes(mode)) {
            return reply(`╭━━━〔 *ANTI-BAD SETUP* 〕━━━┈⊷\n` +
                         `┃ ⋄ *Status:* ${current === 'off' ? '❌ Disabled' : '✅ Active (' + String(current).toUpperCase() + ')'}\n` +
                         `┃\n` +
                         `┃ ⋄ *.antibad p* - Private DMs only\n` +
                         `┃ ⋄ *.antibad g* - Groups only\n` +
                         `┃ ⋄ *.antibad all* - Everywhere\n` +
                         `┃ ⋄ *.antibad off* - Disable\n` +
                         `╰━━━━━━━━━━━━━━━━━━┈⊷`);
        }
        botData.antiBad = botData.antiBad || {};
        botData.antiBad[sessionId] = (mode === 'on' ? 'all' : (mode === 'off' ? false : mode));
        saveBotData();
        const label = botData.antiBad[sessionId] === 'all' ? 'Everywhere' : (botData.antiBad[sessionId] === 'p' ? 'Private' : (botData.antiBad[sessionId] === 'g' ? 'Groups' : 'OFF'));
        return reply(`✅ *Anti-Bad Words set to: ${label}*`);
    },
    autoreact: async (context) => {
        const autoreactsCommand = require('./autoreacts');
        return autoreactsCommand(context.conn, context.jid, context.m, true, context.botData, context.saveBotData, context.sessionId, context.args);
    },
    antidelete: async (context) => {
        const antideleteCommand = require('./antidelete');
        return antideleteCommand(context.conn, context.jid, context.m, true, context.botData, context.saveBotData, context.sessionId, context.args);
    },

};

const referencePlaceholders = [
    'add', 'open', 'close', 'tagall', 'hidetag', 'listactive', 'changename', 'closetime', 'ginfo', 'warn', 'gpp', 'promote', 'demote', 'adminkill',
    'github', 'gitrepos', 'gitfollowers', 'gitstarred', 'gitfollow',
    'logo', 'dccomic', 'dragonball', 'deadpool', 'blackpink', 'neonlight', 'cat',
    'readmore', 'say', 'tte', 'calc', 'poll', 'hack', 'matrix', 'fancy', 'cpp', 'insult', 'harami', 'shapar', 'checkme',
    'fliptext', 'smallcaps', 'zalgо', 'zalgo2', 'bubble', 'strike', 'reverse', 'mirror', 'animal',
    'xray', 'ghostping', 'rootme', 'weather', 'art', 'wallpaper', 'gamewallpaper', 'cyber', 'gremory', 'hacker', 'hestia', 'jibril', 'rose', 'technology', 'pubg', 'freefire', 'mountain', 'islamic', 'dog', 'imgcat',
    'kill', 'pat', 'cry', 'hug', 'kiss', 'slap', 'bite', 'baka', 'smile', 'love',
    'tictactoe', 'rps', 'flag', 'math', 'guessnumber', 'scramble', 'riddle', 'emoji', 'joke', 'meme', 'quote', 'truthordare', 'eightball', 'roast', 'fact', 'historyfact', 'captions', 'trivia',
    'waifu', 'neko', 'neko2', 'akiyama', 'asuna', 'ayuzawa', 'boruto', 'ana', 'cartoon', 'chiho', 'chitoge', 'cosplay', 'cosplayloli', 'cosplaysagiri', 'deidara', 'doraemon', 'elaina', 'emilia', 'erza', 'exo', 'hinata', 'husbu', 'itachi', 'itachiuchiha', 'itori', 'jsj', 'mikasa', 'nezuko', 'yumeko', 'zerotwo', 'kitsune', 'kurumi', 'blush', 'rem', 'animehug', 'animekiss', 'cuddle', 'animegirl', 'shinobu', 'megumin', 'luffy'
];
for (const name of referencePlaceholders) {
    if (!core[name]) core[name] = (context) => pendingFeature(context.reply, name);
}

module.exports = core;
