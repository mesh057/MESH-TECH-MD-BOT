'use strict';

const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
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
${numberedLine(0, 'self - Bot only responds to you')}
${numberedLine(1, 'public - Bot responds to everyone')}
${numberedLine(2, 'block / .unblock - User management')}
${numberedLine(3, 'restart - Reboot the bot instance')}
${numberedLine(4, 'shutdown - Turn off the bot')}
${numberedLine(5, 'setbio / .setname / .setpp - Profile')}
${numberedLine(6, 'join / .leave - Group control')}
${numberedLine(7, 'broadcast - Send msg to all chats')}
${numberedLine(8, 'kickall - Clean group members')}
${numberedLine(9, 'del - Delete any bot message')}
╚════════════════════╝`,

    // Page 4: Download Menu
    `╔═❖•⊰ 📥 *DOWNLOAD MENU* ⊱•❖═╗
${numberedLine(0, 'video / .video2 - YouTube Video')}
${numberedLine(1, 'song / .song2 / .play - Audio/Music')}
${numberedLine(2, 'ytmp4 / .ytmp3 - YT Converters')}
${numberedLine(3, 'tiktok - TikTok No Watermark')}
${numberedLine(4, 'insta - Instagram Reels/Posts')}
${numberedLine(5, 'fb - Facebook Video Downloader')}
${numberedLine(6, 'gitclone - Clone GitHub Repos')}
${numberedLine(7, 'img - Google Image Search')}
${numberedLine(8, 'apk - Android App Downloader')}
${numberedLine(9, 'pinterest - Pinterest Media')}
╚════════════════════╝`,

    // Page 5: Auto Menu
    `╔═❖•⊰ 🪼 *AUTO MENU* ⊱•❖═╗
${numberedLine(0, 'status - View/Set all automation')}
${numberedLine(1, 'antidelete [on/off] - Recover msgs')}
${numberedLine(2, 'antilink [on/off] - Group link protection')}
${numberedLine(3, 'anticall [on/off] - Block incoming calls')}
${numberedLine(4, 'autostatus [on/off] - View statuses')}
${numberedLine(5, 'autoreact [p/g/all/off] - Auto reactions')}
${numberedLine(6, 'alwaysonline [p/g/all/off] - Stay online')}
${numberedLine(7, 'autotyping [p/g/all/off] - Fake typing')}
${numberedLine(8, 'autorecoding [p/g/all/off] - Fake record')}
${numberedLine(9, 'autoreplystatus [on/off] - Status reply')}
╚════════════════════╝`,

    // Page 6: AI Menu
    `╔═❖•⊰ ⚡ *AI MENU* ⊱•❖═╗
${numberedLine(0, 'chatgpt [prompt] - Open AI ChatGPT')}
${numberedLine(1, 'llama [prompt] - Meta Llama 3')}
${numberedLine(2, 'deepseek [prompt] - DeepSeek AI')}
${numberedLine(3, 'gemini [prompt] - Google Gemini')}
${numberedLine(4, 'claude [prompt] - Anthropic Claude')}
${numberedLine(5, 'chatbot [on/off] - Auto AI reply')}
${numberedLine(6, 'remini - Enhance blurry images')}
${numberedLine(7, 'imagine - AI Image Generation')}
╚════════════════════╝`,

    // Page 7: Group Menu
    `╔═❖•⊰ 👥 *GROUP MENU* ⊱•❖═╗
${numberedLine(0, 'kick / .add - Member management')}
${numberedLine(1, 'promote / .demote - Admin control')}
${numberedLine(2, 'open / .close - Group privacy')}
${numberedLine(3, 'tagall - Mention every member')}
${numberedLine(4, 'hidetag [text] - Ghost mention')}
${numberedLine(5, 'welcome [on/off] - Welcome message')}
${numberedLine(6, 'ginfo - Detailed group info')}
${numberedLine(7, 'warn - Warn members (3 = kick)')}
${numberedLine(8, 'listactive - Show active users')}
╚════════════════════╝`,

    // Page 8: Logo Menu
    `╔═❖•⊰ 🎨 *LOGO MENU* ⊱•❖═╗
${numberedLine(0, 'logo [text] - Custom branding')}
${numberedLine(1, 'neonlight - Neon text effect')}
${numberedLine(2, 'blackpink - BP style logo')}
${numberedLine(3, 'dragonball - DBZ text effect')}
${numberedLine(4, 'thunder - Lightning effect')}
${numberedLine(5, 'glitch - Glitch text style')}
${numberedLine(6, 'marvel - Marvel studio logo')}
╚════════════════════╝`,

    // Page 9: Tools & Utility
    `╔═❖•⊰ ☣️ *TOOLS & UTILITY* ⊱•❖═╗
${numberedLine(0, 'sticker / .s - Image to Sticker')}
${numberedLine(1, 'toimg - Sticker to Image')}
${numberedLine(2, 'tovideo - Sticker to Video')}
${numberedLine(3, 'qc - Create chat bubble quote')}
${numberedLine(4, 'trt [lang] [text] - Translate')}
${numberedLine(5, 'calc - Calculator tool')}
${numberedLine(6, 'weather - Local weather info')}
${numberedLine(7, 'shorturl - Link shortener')}
${numberedLine(8, 'vv / .vv2 - View Once bypass')}
╚════════════════════╝`,

    // Page 10: Games & Fun
    `╔═❖•⊰ 🎮 *GAMES & FUN* ⊱•❖═╗
${numberedLine(0, 'tictactoe - Play with friends')}
${numberedLine(1, 'truth / .dare - Party game')}
${numberedLine(2, 'joke - Random funny jokes')}
${numberedLine(3, 'fact - Interesting facts')}
${numberedLine(4, 'ship - Love percentage')}
${numberedLine(5, 'hack - Fake hacking effect')}
${numberedLine(6, 'matrix - Matrix text effect')}
╚════════════════════╝`,

    // Page 11: Anime Menu
    `╔═❖•⊰ 🎌 *ANIME MENU* ⊱•❖═╗
${numberedLine(0, 'waifu / .neko - Anime girls')}
${numberedLine(1, 'shinobu / .megumin - Characters')}
${numberedLine(2, 'hug / .kiss / .slap - Reactions')}
${numberedLine(3, 'cry / .dance / .smile - Actions')}
${numberedLine(4, 'husbu - Anime boys')}
${numberedLine(5, 'kitsune - Fox girls')}
${numberedLine(6, 'luffy / .zoro - One Piece')}
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
