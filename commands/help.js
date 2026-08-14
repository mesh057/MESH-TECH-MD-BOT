'use strict';

const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗵', 'I': '𝗶', 'J': '𝗷', 'K': '𝗸', 'L': '𝗹', 'M': '𝗺', 'N': '𝗻', 'O': '𝗼', 'P': '𝗽', 'Q': '𝗾', 'R': '𝗿', 'S': '𝘀', 'T': '𝘁', 'U': '𝘂', 'V': '𝘃', 'W': '𝘄', 'X': '𝘅', 'Y': '𝘆', 'Z': '𝘇',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(c => boldChars[c] || c).join('');
};

const MARKERS = ['➊', '➋', '➌', '➍', '➎', '➏', '➐', '➑', '➒', '➓'];

function numberedLine(index, command) {
    return `║${MARKERS[index] || `${index + 1}.`} ⟿ .${command}`;
}

const pages = [
    // Page 1: How to Use
    `╭━━━〔 ${toBold("MESH-TECH MD BOT - START GUIDE")} 〕━━━┈⊷
┃ 👋 *Hello! I am MESH-TECH-MD-BOT.*
┃ 
┃ 📖 *How to use:*
┃ 1. All commands start with a dot [ *.* ]
┃ 2. Example: Type *.menu* to see all features.
┃ 3. For specific help, type *.help [page]*
┃ 
┃ 🎮 *Interactive Navigation:*
┃ • React with ⬅️ to go to the previous page.
┃ • React with ➡️ to go to the next page.
┃ • Reactions only work for the person who ran .help
┃ 
┃ 🚀 *Start exploring by clicking ➡️ below!*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 2: Help Index
    `╭━━━〔 ${toBold("MESH-TECH MD BOT - HELP INDEX")} 〕━━━┈⊷
┃ 📄 *Page 1:* How to Use
┃ 📑 *Page 2:* Help Index
┃ 👑 *Page 3:* Owner & Admin Menu
┃ 📥 *Page 4:* Download & Media Menu
┃ 🪼 *Page 5:* Automation & Presence
┃ ⚡ *Page 6:* AI & Chatbot Menu
┃ 👥 *Page 7:* Group Management
┃ 🎨 *Page 8:* Logo & Text Effects
┃ ☣️ *Page 9:* Tools & Utilities
┃ 🎮 *Page 10:* Games & Fun
┃ 🎌 *Page 11:* Anime Menu
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 3: Owner Menu
    `╔═❖•⊰ 👑 *OWNER MENU* ⊱•❖═╗
${numberedLine(0, 'self / .public - Bot mode')}
${numberedLine(1, 'block / .unblock - User management')}
${numberedLine(2, 'restart / .shutdown - Bot control')}
${numberedLine(3, 'setbio / .setname / .setpp - Profile')}
${numberedLine(4, 'join / .leave - Group control')}
${numberedLine(5, 'broadcast - Send msg to all chats')}
${numberedLine(6, 'kickall - Clean group members')}
${numberedLine(7, 'del - Delete any bot message')}
${numberedLine(8, 'save - Save any message to DM')}
╚════════════════════╝`,

    // Page 4: Download Menu
    `╔═❖•⊰ 📥 *DOWNLOAD MENU* ⊱•❖═╗
${numberedLine(0, 'video / .ytmp4 - YouTube Video')}
${numberedLine(1, 'song / .ytmp3 / .play - Music')}
${numberedLine(2, 'tiktok - TikTok No Watermark')}
${numberedLine(3, 'insta - Instagram Reels/Posts')}
${numberedLine(4, 'fb - Facebook Video Downloader')}
${numberedLine(5, 'gitclone - Clone GitHub Repos')}
${numberedLine(6, 'img - Google Image Search')}
${numberedLine(7, 'apk - Android App Downloader')}
${numberedLine(8, 'pinterest - Pinterest Media')}
╚════════════════════╝`,

    // Page 5: Auto Menu
    `╔═❖•⊰ 🪼 *AUTO MENU* ⊱•❖═╗
${numberedLine(0, 'status - View/Set all automation')}
${numberedLine(1, 'antidelete [on/off] - Recover msgs')}
${numberedLine(2, 'antilink [on/off] - Group protection')}
${numberedLine(3, 'anticall [on/off] - Block calls')}
${numberedLine(4, 'autostatus [on/off] - View statuses')}
${numberedLine(5, 'autoreact [p/g/all/off] - Reactions')}
${numberedLine(6, 'alwaysonline [p/g/all/off] - Online')}
${numberedLine(7, 'autotyping [p/g/all/off] - Typing')}
${numberedLine(8, 'autorecoding [p/g/all/off] - Record')}
╚════════════════════╝`,

    // Page 6: AI Menu
    `╔═❖•⊰ ⚡ *AI MENU* ⊱•❖═╗
${numberedLine(0, 'ai / .chatgpt - Fast AI Chat')}
${numberedLine(1, 'grok / .mistral - Advanced AI')}
${numberedLine(2, 'bible / .quran - Religious AI')}
${numberedLine(3, 'casperai - Casper Tech AI')}
${numberedLine(4, 'imagine - AI Image Generation')}
${numberedLine(5, 'remini - Enhance blurry images')}
${numberedLine(6, 'chatbot [on/off] - Auto AI reply')}
╚════════════════════╝`,

    // Page 7: Group Menu
    `╔═❖•⊰ 👥 *GROUP MENU* ⊱•❖═╗
${numberedLine(0, 'kick / .add - Member management')}
${numberedLine(1, 'promote / .demote - Admin control')}
${numberedLine(2, 'open / .close - Group privacy')}
${numberedLine(3, 'tagall / .hidetag - Mention all')}
${numberedLine(4, 'welcome [on/off] - Welcome msg')}
${numberedLine(5, 'ginfo - Detailed group info')}
${numberedLine(6, 'warn - Member warning system')}
╚════════════════════╝`,

    // Page 8: Logo Menu
    `╔═❖•⊰ 🎨 *LOGO MENU* ⊱•❖═╗
${numberedLine(0, 'fire [text] - Fire text effect')}
${numberedLine(1, 'logo [text] - Gaming logo maker')}
${numberedLine(2, 'glow / .glass - Glow text style')}
${numberedLine(3, 'balloon - Foil balloon text')}
${numberedLine(4, 'neonlight / .blackpink - Styles')}
${numberedLine(5, 'dragonball / .thunder - Effects')}
${numberedLine(6, 'marvel / .glitch - More styles')}
╚════════════════════╝`,

    // Page 9: Tools & Utility
    `╔═❖•⊰ ☣️ *TOOLS & UTILITY* ⊱•❖═╗
${numberedLine(0, 'sticker / .s - Image to Sticker')}
${numberedLine(1, 'toimg / .tovideo - Convert')}
${numberedLine(2, 'qr [text] - Generate QR code')}
${numberedLine(3, 'ss [url] - Web Screenshot')}
${numberedLine(4, 'ocr - Extract text from image')}
${numberedLine(5, 'tempmail - Instant temp email')}
${numberedLine(6, 'removebg / .enlarger - Image AI')}
${numberedLine(7, 'shorturl / .calc - Utilities')}
${numberedLine(8, 'weather / .trt - Info/Trans')}
╚════════════════════╝`,

    // Page 10: Games & Fun
    `╔═❖•⊰ 🎮 *GAMES & FUN* ⊱•❖═╗
${numberedLine(0, 'tictactoe - Play with friends')}
${numberedLine(1, 'truth / .dare - Party game')}
${numberedLine(2, 'joke / .fact - Fun content')}
${numberedLine(3, 'ship / .hack / .matrix - Effects')}
╚════════════════════╝`,

    // Page 11: Anime Menu
    `╔═❖•⊰ 🎌 *ANIME MENU* ⊱•❖═╗
${numberedLine(0, 'waifu / .neko - Anime girls')}
${numberedLine(1, 'shinobu / .megumin - Characters')}
${numberedLine(2, 'hug / .kiss / .slap - Reactions')}
${numberedLine(3, 'cry / .dance / .smile - Actions')}
${numberedLine(4, 'husbu / .kitsune - Boys/Fox')}
${numberedLine(5, 'luffy / .zoro - One Piece')}
╚════════════════════╝`
];

// Active help sessions store: messageId -> { pageNum, author }
const activeHelpSessions = new Map();

async function helpCommand(sock, from, msg, args) {
    let pageNum = 1;
    if (args && args[0]) {
        const parsed = parseInt(args[0]);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= pages.length) {
            pageNum = parsed;
        }
    }

    const content = pages[pageNum - 1];
    const footer = `\n📌 *Page ${pageNum} of ${pages.length}* | React ⬅️ or ➡️ to flip pages.`;
    
    const sentMsg = await sock.sendMessage(from, { text: content + footer }, { quoted: msg });
    
    if (sentMsg?.key?.id) {
        activeHelpSessions.set(sentMsg.key.id, {
            pageNum,
            from,
            author: msg.key.participant || msg.key.remoteJid
        });

        // Add initial navigation reactions
        try {
            await sock.sendMessage(from, { react: { text: '⬅️', key: sentMsg.key } });
            await sock.sendMessage(from, { react: { text: '➡️', key: sentMsg.key } });
        } catch (e) {}
    }
}

async function handleHelpReaction(sock, reaction) {
    try {
        const { key, text: emoji } = reaction;
        if (!key?.id || !activeHelpSessions.has(key.id)) return;

        const session = activeHelpSessions.get(key.id);
        if (emoji !== '⬅️' && emoji !== '➡️') return;

        let newPage = session.pageNum;
        if (emoji === '➡️') {
            newPage = newPage >= pages.length ? 1 : newPage + 1;
        } else if (emoji === '⬅️') {
            newPage = newPage <= 1 ? pages.length : newPage - 1;
        }

        session.pageNum = newPage;
        activeHelpSessions.set(key.id, session);

        const content = pages[newPage - 1];
        const footer = `\n📌 *Page ${newPage} of ${pages.length}* | React ⬅️ or ➡️ to flip pages.`;

        await sock.sendMessage(session.from, {
            edit: key,
            text: content + footer
        });
    } catch (e) {
        console.error('Help reaction error:', e);
    }
}

module.exports = helpCommand;
module.exports.handleHelpReaction = handleHelpReaction;
