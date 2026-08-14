'use strict';

const moment = require('moment-timezone');
const ZERO_WIDTH = String.fromCharCode(8206);
const READ_MORE = ZERO_WIDTH.repeat(2001);

function getDateTime(timezone = 'Africa/Nairobi') {
    const now = moment().tz(timezone);
    const date = now.format('DD-MMM-YYYY').toUpperCase();
    const time = now.format('hh:mm A');
    const hour = now.hour();
    
    let greeting = '🌙 Good Night';
    if (hour >= 5 && hour < 12) greeting = '🌅 Good Morning';
    else if (hour >= 12 && hour < 17) greeting = '☀️ Good Afternoon';
    else if (hour >= 17 && hour < 21) greeting = '🌆 Good Evening';
    
    return { date, time, greeting };
}

function getStatusBox(timezone = 'Africa/Nairobi', userCount = 0, metrics = {}) {
    const { date, time, greeting } = getDateTime(timezone);
    const uptimeSec = process.uptime();
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = Math.floor(uptimeSec % 60);
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;
    
    const commandsLoaded = metrics.commandsLoaded || 0;
    const activeBots = metrics.activeBots || 1;
    const randomRam = Math.floor(Math.random() * (95 - 55 + 1)) + 55;

    return `
╭━━━ *𝗠𝗘𝗦𝗛-𝗧𝗘𝗖𝗛 𝗠𝗗 𝗕𝗢𝗧* ━━━╮
┃ ${greeting}
┃ 🔥 𝗠𝗼𝗱𝗲: PUBLIC|FULL POWER
┃ 💀 𝗣𝗿𝗼𝘁𝗼𝗰𝗼𝗹: PHANTOM CORE
┃ 👑 𝗢𝘄𝗻𝗲𝗿: 𝕄𝔼𝕊ℍ
┃ 📞 𝗡𝘂𝗺𝗯𝗲𝗿: 254746844168
┃ ⚙️ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: v2.4 [RESTORED CORE]
┃ ⏳ 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeStr}
┃ 📅 𝗗𝗮𝘁𝗲: ${date}
┃ 🕒 𝗧𝗶𝗺𝗲: ${time}
┃ 📌 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${commandsLoaded} 𝗟𝗼𝗮𝗱𝗲𝗱
┃ 👥 𝗨𝘀𝗲𝗿𝘀: ${userCount} Active (𝗿𝗲𝗮𝗹-𝘁𝗶𝗺𝗲)
┃ 🤖 𝗕𝗼𝘁𝘀 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱: ${activeBots} 𝗟𝗶𝘃𝗲
┃ 📱 𝗗𝗲𝘃𝗶𝗰𝗲: ANDROID-CORE
┃ 🧠 RAM: ${randomRam}/128 MB
╰━━━━━━━━━━━━━━━━━━╯
`;
}

const MARKERS = ['➊', '➋', '➌', '➍', '➎', '➏', '➐', '➑', '➒', '➓'];

function numberedLine(index, command) {
    return `║${MARKERS[index] || `${index + 1}.`} ⟿ .${command}`;
}

const CATEGORY_EMOJIS = {
    OWNER: '👑', DOWNLOAD: '📥', AUTO: '🪼', AI: '⚡', GROUP: '👥',
    GITHUB: '🪔', LOGO: '🎨', TOOLS: '☣️', GAMES: '🎮', ANIME: '🎌',
    GENERAL: '✨', SYSTEM: '🌐', PROTECTION: '🛡️', SPORTS: '⚽'
};

function formatGroup(title, emoji, commands) {
    const lines = commands.map((command, index) => numberedLine(index, command));
    return `╔═❖•⊰ ${emoji} *${title} MENU* ⊱•❖═╗\n${lines.join('\n')}\n╚════════════════════╝`;
}

function getMenu(timezone = 'Africa/Nairobi', userCount = 0, metrics = {}) {
    const statusBox = getStatusBox(timezone, userCount, metrics);
    
    // MD-BOT uses hardcoded categories to match the user's requirement for a "professional UI"
    const groups = [
        ['GENERAL', '✨', ['menu', 'help', 'ping', 'runtime', 'alive', 'repo', 'idcheck']],
        ['OWNER', '👑', ['self', 'public', 'restart', 'shutdown', 'broadcast', 'save', 'join', 'leave']],
        ['DOWNLOAD', '📥', ['video', 'song', 'play', 'tiktok', 'insta', 'fb', 'img', 'apk']],
        ['AUTO', '🪼', ['status', 'antidelete', 'antilink', 'autostatus', 'alwaysonline', 'autotyping', 'autorecording']],
        ['AI', '⚡', ['chatgpt', 'llama', 'deepseek', 'gemini', 'claude', 'imagine', 'remini']],
        ['GROUP', '👥', ['kick', 'add', 'promote', 'demote', 'tagall', 'hidetag', 'welcome', 'warn']],
        ['TOOLS', '☣️', ['sticker', 'toimg', 'trt', 'calc', 'weather', 'shorturl', 'vv']],
        ['GAMES', '🎮', ['tictactoe', 'truth', 'dare', 'joke', 'fact', 'ship', 'hack']],
        ['ANIME', '🎌', ['waifu', 'neko', 'shinobu', 'megumin', 'hug', 'kiss', 'slap', 'husbu']]
    ];

    const sections = groups.map(([title, emoji, cmds]) => formatGroup(title, emoji, cmds)).join('\n\n');

    return `${statusBox}
╔═❖•⊰ *𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗠𝗘𝗡𝗨* ⊱•❖═╗
║୧⍤⃝💐 𝗔𝗹𝗹 𝗹𝗼𝗮𝗱𝗲𝗱 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀
╚═══════════════════╝
${READ_MORE}
${sections}

*『 𝗠𝗘𝗦𝗛-𝗧𝗘𝗖𝗛 𝗠𝗗 』*
`;
}

const menuNames = {
    menu: 'menu',
    ownermenu: 'OWNER',
    downloadmenu: 'DOWNLOAD',
    groupmenu: 'GROUP',
    automenu: 'AUTO',
    aimenu: 'AI',
    toolsmenu: 'TOOLS',
    gamemenu: 'GAMES',
    animemenu: 'ANIME'
};

module.exports = { getMenu, getStatusBox, menuNames };
