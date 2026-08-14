const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(c => boldChars[c] || c).join('');
};

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

    // Page 2: Index
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
    `╭━━━〔 ${toBold("3. OWNER MENU (PAGE 3/11)")} 〕━━━┈⊷
┃ • .self - Bot only responds to you
┃ • .public - Bot responds to everyone
┃ • .block / .unblock - User management
┃ • .restart - Reboot the bot instance
┃ • .shutdown - Turn off the bot
┃ • .setbio / .setname / .setpp - Profile
┃ • .join / .leave - Group control
┃ • .broadcast - Send msg to all chats
┃ • .kickall - Clean group members
┃ • .del - Delete any bot message
┃ • .idcheck - Get chat/user IDs
┃ • .save - Save status/media to DM
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 4: Download Menu
    `╭━━━〔 ${toBold("4. DOWNLOAD MENU (PAGE 4/11)")} 〕━━━┈⊷
┃ • .video / .video2 - YouTube Video
┃ • .song / .song2 / .play - Audio/Music
┃ • .ytmp4 / .ytmp3 - YT Converters
┃ • .tiktok - TikTok No Watermark
┃ • .insta - Instagram Reels/Posts
┃ • .fb - Facebook Video Downloader
┃ • .gitclone - Clone GitHub Repos
┃ • .img - Google Image Search
┃ • .apk - Android App Downloader
┃ • .pinterest - Pinterest Media
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 5: Auto Menu
    `╭━━━〔 ${toBold("5. AUTO MENU (PAGE 5/11)")} 〕━━━┈⊷
┃ • .status - View/Set all automation
┃ • .antidelete [on/off] - Recover msgs
┃ • .antilink [on/off] - Group link protection
┃ • .anticall [on/off] - Block incoming calls
┃ • .autostatus [on/off] - View statuses
┃ • .autoreact [p/g/all/off] - Auto reactions
┃ • .alwaysonline [p/g/all/off] - Stay online
┃ • .autotyping [p/g/all/off] - Fake typing
┃ • .autorecording [p/g/all/off] - Fake record
┃ • .autoreplystatus [on/off] - Status reply
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 6: AI Menu
    `╭━━━〔 ${toBold("6. AI MENU (PAGE 6/11)")} 〕━━━┈⊷
┃ • .chatgpt [prompt] - Open AI ChatGPT
┃ • .llama [prompt] - Meta Llama 3
┃ • .deepseek [prompt] - DeepSeek AI
┃ • .gemini [prompt] - Google Gemini
┃ • .claude [prompt] - Anthropic Claude
┃ • .chatbot [on/off] - Auto AI reply
┃ • .remini - Enhance blurry images
┃ • .imagine - AI Image Generation
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 7: Group Menu
    `╭━━━〔 ${toBold("7. GROUP MENU (PAGE 7/11)")} 〕━━━┈⊷
┃ • .kick / .add - Member management
┃ • .promote / .demote - Admin control
┃ • .open / .close - Group privacy
┃ • .tagall - Mention every member
┃ • .hidetag [text] - Ghost mention
┃ • .welcome [on/off] - Welcome message
┃ • .ginfo - Detailed group info
┃ • .warn - Warn members (3 = kick)
┃ • .listactive - Show active users
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 8: Logo Menu
    `╭━━━〔 ${toBold("8. LOGO MENU (PAGE 8/11)")} 〕━━━┈⊷
┃ • .logo [text] - Custom branding
┃ • .neonlight - Neon text effect
┃ • .blackpink - BP style logo
┃ • .dragonball - DBZ text effect
┃ • .thunder - Lightning effect
┃ • .glitch - Glitch text style
┃ • .marvel - Marvel studio logo
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 9: Tools & Utility
    `╭━━━〔 ${toBold("9. TOOLS & UTILITY (PAGE 9/11)")} 〕━━━┈⊷
┃ • .sticker / .s - Image to Sticker
┃ • .toimg - Sticker to Image
┃ • .tovideo - Sticker to Video
┃ • .qc - Create chat bubble quote
┃ • .trt [lang] [text] - Translate
┃ • .calc - Calculator tool
┃ • .weather - Local weather info
┃ • .shorturl - Link shortener
┃ • .vv / .vv2 - View Once bypass
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 10: Games & Fun
    `╭━━━〔 ${toBold("10. GAMES & FUN (PAGE 10/11)")} 〕━━━┈⊷
┃ • .tictactoe - Play with friends
┃ • .truth / .dare - Party game
┃ • .joke - Random funny jokes
┃ • .fact - Interesting facts
┃ • .ship - Love percentage
┃ • .hack - Fake hacking effect
┃ • .matrix - Matrix text effect
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 11: Anime Menu
    `╭━━━〔 ${toBold("11. ANIME MENU (PAGE 11/11)")} 〕━━━┈⊷
┃ • .waifu / .neko - Anime girls
┃ • .shinobu / .megumin - Characters
┃ • .hug / .kiss / .slap - Reactions
┃ • .cry / .dance / .smile - Actions
┃ • .husbu - Anime boys
┃ • .kitsune - Fox girls
┃ • .luffy / .zoro - One Piece
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`
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
