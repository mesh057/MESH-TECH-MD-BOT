const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(c => boldChars[c] || c).join('');
};

async function statusCommand(sock, from, msg, isAdmin, botData, saveBotData, userId, args) {
    if (!isAdmin) return await sock.sendMessage(from, { text: "❌ Only owner can use this command." }, { quoted: msg });
    
    if (!botData.statusSettings) botData.statusSettings = {};
    if (!botData.statusSettings[userId]) {
        botData.statusSettings[userId] = {
            autoStatus: false,
            autoSeen: false,
            autoLike: false,
            autoReply: false,
            autoDownload: false,
            replyText: '❤️ Nice status!',
            system: 1,
            isPublic: false
        };
    }
    if (!botData.presenceSettings) botData.presenceSettings = {};
    if (!botData.presenceSettings[userId]) botData.presenceSettings[userId] = { alwaysOnline: false };
    const settings = botData.statusSettings[userId];
    
    const action = args[0]?.toLowerCase();
    
    if (!action) {
        const settings = botData.statusSettings[userId];
        const menu = `╭━━━〔 ${toBold("STATUS SETTINGS")} 〕━━━┈⊷\n` +
                   `┃ ⋄ ${toBold("Auto Status:")} ${settings.autoStatus ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Auto Seen:")} ${settings.autoSeen ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Auto Like:")} ${settings.autoLike ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Auto Reply:")} ${settings.autoReply ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Auto Download:")} ${settings.autoDownload ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Always Online:")} ${botData.presenceSettings[userId]?.alwaysOnline ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Current System:")} ${settings.system || 1}\n` +
                   `╰━━━━━━━━━━━━━━━━━━┈⊷\n\n` +
                   `*Commands:*\n` +
                   `.status on/off - Toggle All\n` +
                   `.status seen on/off\n` +
                   `.status like on/off\n` +
                   `.status reply on/off [text]\n` +
                   `.status download on/off\n` +
                   `.status online on/off\n` +
                   `.status system 1/2/3`;
        return await sock.sendMessage(from, { text: menu }, { quoted: msg });
    }

    if (action === 'on') {
        botData.statusSettings[userId].autoStatus = true;
        botData.statusSettings[userId].autoSeen = true;
        botData.statusSettings[userId].autoLike = true;
        botData.statusSettings[userId].autoReply = true;
        botData.statusSettings[userId].autoDownload = true;
        botData.presenceSettings[userId].alwaysOnline = true;
        saveBotData();
        await sock.sendMessage(from, { text: "✅ *ALL STATUS FEATURES: ON*" }, { quoted: msg });
    } else if (action === 'off') {
        botData.statusSettings[userId].autoStatus = false;
        botData.statusSettings[userId].autoSeen = false;
        botData.statusSettings[userId].autoLike = false;
        botData.statusSettings[userId].autoReply = false;
        botData.statusSettings[userId].autoDownload = false;
        botData.presenceSettings[userId].alwaysOnline = false;
        saveBotData();
        await sock.sendMessage(from, { text: "❌ *ALL STATUS FEATURES: OFF*" }, { quoted: msg });
    } else if (action === 'seen') {
        const val = args[1]?.toLowerCase();
        if (val === 'on') {
            botData.statusSettings[userId].autoSeen = true;
            botData.statusSettings[userId].autoStatus = true;
            saveBotData();
            await sock.sendMessage(from, { text: "✅ *Auto Seen: ON*" }, { quoted: msg });
        } else if (val === 'off') {
            botData.statusSettings[userId].autoSeen = false;
            saveBotData();
            await sock.sendMessage(from, { text: "❌ *Auto Seen: OFF*" }, { quoted: msg });
        }
    } else if (action === 'like') {
        const val = args[1]?.toLowerCase();
        if (val === 'on') {
            botData.statusSettings[userId].autoLike = true;
            botData.statusSettings[userId].autoStatus = true;
            saveBotData();
            await sock.sendMessage(from, { text: "✅ *Auto Like: ON*" }, { quoted: msg });
        } else if (val === 'off') {
            botData.statusSettings[userId].autoLike = false;
            saveBotData();
            await sock.sendMessage(from, { text: "❌ *Auto Like: OFF*" }, { quoted: msg });
        }
    } else if (action === 'reply') {
        const val = args[1]?.toLowerCase();
        if (val === 'on') {
            settings.autoReply = true;
            settings.autoStatus = true;
            if (args.slice(2).length) settings.replyText = args.slice(2).join(' ');
            saveBotData();
            await sock.sendMessage(from, { text: `✅ *Auto Reply Status: ON*\n💬 ${settings.replyText}` }, { quoted: msg });
        } else if (val === 'off') {
            settings.autoReply = false;
            saveBotData();
            await sock.sendMessage(from, { text: "❌ *Auto Reply Status: OFF*" }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { text: "❌ Usage: .status reply on/off [message]" }, { quoted: msg });
        }
    } else if (action === 'online') {
        const val = args[1]?.toLowerCase();
        if (val === 'on') {
            botData.presenceSettings[userId].alwaysOnline = true;
            saveBotData();
            await sock.sendPresenceUpdate('available').catch(() => {});
            await sock.sendMessage(from, { text: "✅ *Always Online: ON*" }, { quoted: msg });
        } else if (val === 'off') {
            botData.presenceSettings[userId].alwaysOnline = false;
            saveBotData();
            await sock.sendMessage(from, { text: "❌ *Always Online: OFF*" }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { text: "❌ Usage: .status online on/off" }, { quoted: msg });
        }
    } else if (action === 'download') {
        const val = args[1]?.toLowerCase();
        if (val === 'on') {
            botData.statusSettings[userId].autoDownload = true;
            botData.statusSettings[userId].autoStatus = true;
            saveBotData();
            await sock.sendMessage(from, { text: "✅ *Auto Download: ON*" }, { quoted: msg });
        } else if (val === 'off') {
            botData.statusSettings[userId].autoDownload = false;
            saveBotData();
            await sock.sendMessage(from, { text: "❌ *Auto Download: OFF*" }, { quoted: msg });
        }
    } else if (action === 'system') {
        const sys = parseInt(args[1]);
        if ([1, 2, 3].includes(sys)) {
            botData.statusSettings[userId].system = sys;
            saveBotData();
            await sock.sendMessage(from, { text: `✅ *OS System set to: ${sys}*` }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { text: "❌ Choose system 1, 2, or 3." }, { quoted: msg });
        }
    }
}

module.exports = statusCommand;
