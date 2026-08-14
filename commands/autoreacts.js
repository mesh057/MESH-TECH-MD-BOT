async function autoreactsCommand(sock, from, msg, isAdmin, botData, saveBotData, userId, args) {
    if (!isAdmin) return await sock.sendMessage(from, { text: "❌ Only owner can use this command." }, { quoted: msg });
    
    if (!botData.autoReacts) botData.autoReacts = {};
    
    const mode = args[0]?.toLowerCase();
    const currentMode = botData.autoReacts[userId] || 'off';

    if (!mode || !['on', 'off', 'p', 'g', 'all'].includes(mode)) {
        return sock.sendMessage(from, {
            text: `╭━━━〔 *AUTO-REACT SETUP* 〕━━━┈⊷\n` +
                   `┃ ⋄ *Status:* ${currentMode === 'off' ? '❌ Disabled' : '✅ Active (' + String(currentMode).toUpperCase() + ')'}\n` +
                   `┃\n` +
                   `┃ ⋄ *.autoreact p* - Private DMs only\n` +
                   `┃ ⋄ *.autoreact g* - Groups only\n` +
                   `┃ ⋄ *.autoreact all* - Everywhere\n` +
                   `┃ ⋄ *.autoreact off* - Disable\n` +
                   `╰━━━━━━━━━━━━━━━━━━┈⊷`
        }, {quoted: msg});
    }

    let setMode = mode;
    if (mode === 'on') setMode = 'all';
    if (mode === 'off') setMode = false;
    
    botData.autoReacts[userId] = setMode;
    saveBotData();
    
    const label = setMode === 'all' ? 'Everywhere' : (setMode === 'p' ? 'Private DMs' : (setMode === 'g' ? 'Groups' : 'OFF'));
    await sock.sendMessage(from, { text: `✅ *Auto-React set to: ${label}*` }, { quoted: msg });
}

module.exports = autoreactsCommand;
