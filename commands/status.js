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
    if (!botData.presenceSettings[userId]) {
        botData.presenceSettings[userId] = {
            alwaysOnline: 'off',
            fakeTyping: 'off',
            fakeRecording: 'off'
        };
    }
    
    const settings = botData.statusSettings[userId];
    const presence = botData.presenceSettings[userId];
    
    const action = args[0]?.toLowerCase();
    
    if (!action) {
        const formatVal = (v) => {
            if (v === true || v === 'all') return 'ALL (✅)';
            if (v === 'p') return 'PRIVATE (👤)';
            if (v === 'g') return 'GROUP (👥)';
            return 'OFF (❌)';
        };

        const menu = `╭━━━〔 ${toBold("STATUS & PRESENCE SETTINGS")} 〕━━━┈⊷\n` +
                   `┃ ⋄ ${toBold("Auto Status:")} ${settings.autoStatus ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Auto Seen:")} ${settings.autoSeen ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Auto Like:")} ${settings.autoLike ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Auto Reply:")} ${settings.autoReply ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Auto Download:")} ${settings.autoDownload ? '✅' : '❌'}\n` +
                   `┃ ⋄ ${toBold("Always Online:")} ${formatVal(presence.alwaysOnline)}\n` +
                   `┃ ⋄ ${toBold("Auto Typing:")} ${formatVal(presence.fakeTyping)}\n` +
                   `┃ ⋄ ${toBold("Auto Recording:")} ${formatVal(presence.fakeRecording)}\n` +
                   `┃ ⋄ ${toBold("Current System:")} ${settings.system || 1}\n` +
                   `╰━━━━━━━━━━━━━━━━━━┈⊷\n\n` +
                   `*Commands (p/g/all/off):*\n` +
                   `.status on/off - Toggle All Status\n` +
                   `.status seen on/off\n` +
                   `.status like on/off\n` +
                   `.status reply on/off [text]\n` +
                   `.status download on/off\n` +
                   `.status online p/g/all/off\n` +
                   `.status typing p/g/all/off\n` +
                   `.status recording p/g/all/off\n` +
                   `.status system 1/2/3`;
        return await sock.sendMessage(from, { text: menu }, { quoted: msg });
    }

    if (action === 'on') {
        settings.autoStatus = true;
        settings.autoSeen = true;
        settings.autoLike = true;
        settings.autoReply = true;
        settings.autoDownload = true;
        presence.alwaysOnline = 'all';
        saveBotData();
        await sock.sendMessage(from, { text: "✅ *ALL STATUS & ONLINE FEATURES: ON (ALL)*" }, { quoted: msg });
    } else if (action === 'off') {
        settings.autoStatus = false;
        settings.autoSeen = false;
        settings.autoLike = false;
        settings.autoReply = false;
        settings.autoDownload = false;
        presence.alwaysOnline = 'off';
        presence.fakeTyping = 'off';
        presence.fakeRecording = 'off';
        saveBotData();
        await sock.sendMessage(from, { text: "❌ *ALL STATUS & PRESENCE FEATURES: OFF*" }, { quoted: msg });
    } else if (action === 'seen') {
        const val = args[1]?.toLowerCase();
        if (val === 'on' || val === 'all' || val === 'true') {
            settings.autoSeen = true;
            settings.autoStatus = true;
            saveBotData();
            await sock.sendMessage(from, { text: "✅ *Auto Seen: ON*" }, { quoted: msg });
        } else if (val === 'off' || val === 'false') {
            settings.autoSeen = false;
            saveBotData();
            await sock.sendMessage(from, { text: "❌ *Auto Seen: OFF*" }, { quoted: msg });
        }
    } else if (action === 'like') {
        const val = args[1]?.toLowerCase();
        if (val === 'on' || val === 'all' || val === 'true') {
            settings.autoLike = true;
            settings.autoStatus = true;
            saveBotData();
            await sock.sendMessage(from, { text: "✅ *Auto Like: ON*" }, { quoted: msg });
        } else if (val === 'off' || val === 'false') {
            settings.autoLike = false;
            saveBotData();
            await sock.sendMessage(from, { text: "❌ *Auto Like: OFF*" }, { quoted: msg });
        }
    } else if (action === 'reply') {
        const val = args[1]?.toLowerCase();
        if (val === 'on' || val === 'all' || val === 'true') {
            settings.autoReply = true;
            settings.autoStatus = true;
            if (args.slice(2).length) settings.replyText = args.slice(2).join(' ');
            saveBotData();
            await sock.sendMessage(from, { text: `✅ *Auto Reply Status: ON*\n💬 ${settings.replyText}` }, { quoted: msg });
        } else if (val === 'off' || val === 'false') {
            settings.autoReply = false;
            saveBotData();
            await sock.sendMessage(from, { text: "❌ *Auto Reply Status: OFF*" }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { text: "❌ Usage: .status reply on/off [message]" }, { quoted: msg });
        }
    } else if (action === 'online') {
        const val = args[1]?.toLowerCase();
        let target = 'off';
        if (val === 'on' || val === 'all') target = 'all';
        else if (val === 'p' || val === 'g' || val === 'off') target = val;
        
        presence.alwaysOnline = target;
        saveBotData();
        if (target !== 'off' && sock?.user?.id) {
            await sock.sendPresenceUpdate('available').catch(() => {});
        }
        await sock.sendMessage(from, { text: `✅ *Always Online set to: ${target.toUpperCase()}*` }, { quoted: msg });
    } else if (action === 'typing') {
        const val = args[1]?.toLowerCase();
        let target = 'off';
        if (val === 'on' || val === 'all') target = 'all';
        else if (val === 'p' || val === 'g' || val === 'off') target = val;
        
        presence.fakeTyping = target;
        if (target !== 'off') presence.fakeRecording = 'off';
        saveBotData();
        await sock.sendMessage(from, { text: `✅ *Auto Typing set to: ${target.toUpperCase()}*` }, { quoted: msg });
    } else if (action === 'recording') {
        const val = args[1]?.toLowerCase();
        let target = 'off';
        if (val === 'on' || val === 'all') target = 'all';
        else if (val === 'p' || val === 'g' || val === 'off') target = val;
        
        presence.fakeRecording = target;
        if (target !== 'off') presence.fakeTyping = 'off';
        saveBotData();
        await sock.sendMessage(from, { text: `✅ *Auto Recording set to: ${target.toUpperCase()}*` }, { quoted: msg });
    } else if (action === 'download') {
        const val = args[1]?.toLowerCase();
        if (val === 'on' || val === 'all' || val === 'true') {
            settings.autoDownload = true;
            settings.autoStatus = true;
            saveBotData();
            await sock.sendMessage(from, { text: "✅ *Auto Download: ON*" }, { quoted: msg });
        } else if (val === 'off' || val === 'false') {
            settings.autoDownload = false;
            saveBotData();
            await sock.sendMessage(from, { text: "❌ *Auto Download: OFF*" }, { quoted: msg });
        }
    } else if (action === 'system') {
        const sys = parseInt(args[1]);
        if ([1, 2, 3].includes(sys)) {
            settings.system = sys;
            saveBotData();
            await sock.sendMessage(from, { text: `✅ *OS System set to: ${sys}*` }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { text: "❌ Choose system 1, 2, or 3." }, { quoted: msg });
        }
    }
}

module.exports = statusCommand;
