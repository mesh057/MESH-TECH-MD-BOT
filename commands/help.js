'use strict';

const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗵', 'I': '𝗶', 'J': '𝗷', 'K': '𝗸', 'L': '𝗹', 'M': '𝗺', 'N': '𝗻', 'O': '𝗼', 'P': '𝗽', 'Q': '𝗾', 'R': '𝗿', 'S': '𝘀', 'T': '𝘁', 'U': '𝘂', 'V': '𝘃', 'W': '𝘄', 'X': '𝘅', 'Y': '𝘆', 'Z': '𝘇',
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
• .self — Set bot to private mode.
• .public — Set bot to public mode.
• .block — Block a user from using the bot.
• .unblock — Unblock a user.
• .restart — Restarts the bot process.
• .shutdown — Shuts down the bot process.
• .setbio — Set the bot WhatsApp bio.
• .setname — Set the bot profile name.
• .setpp — Set the bot profile picture.
• .join — Join a group via invite link.
• .leave — Make the bot leave a group.
• .kickall — Remove all members from group.
• .del — Delete any message from the bot.
• .save — Save any message to your DM.
╚════════════════════╝`,

    // Page 4: Download Menu
    `╔═❖•⊰ 📥 *DOWNLOAD MENU* ⊱•❖═╗
• .song — Download music from YouTube.
• .video — Download video from YouTube.
• .play — Search and play audio from YouTube.
• .ytmp3 — Download YouTube audio via link.
• .ytmp4 — Download YouTube video via link.
• .tiktok — Download TikTok video (no WM).
• .insta — Download Instagram Reels/Posts.
• .fb — Download Facebook videos.
• .gitclone — Clone a GitHub repository.
• .img — Search for images on Google.
• .apk — Download Android apps (APK).
• .pinterest — Download Pinterest media.
╚════════════════════╝`,

    // Page 5: Auto Menu
    `╔═❖•⊰ 🪼 *AUTO MENU* ⊱•❖═╗
• .status — View/Set all automation.
• .antidelete — Toggle message recovery.
• .antilink — Toggle group link protection.
• .anticall — Toggle call blocking.
• .autostatus — Toggle viewing statuses.
• .autoreact — Toggle auto message reactions.
• .alwaysonline — Toggle always online mode.
• .autotyping — Toggle fake typing indicator.
• .autorecording — Toggle fake recording.
╚════════════════════╝`,

    // Page 6: AI Menu
    `╔═❖•⊰ ⚡ *AI MENU* ⊱•❖═╗
• .ai — Chat with GPT-4 AI assistant.
• .grok — Chat with xAI Grok assistant.
• .mistral — Chat with Mistral AI.
• .bible — Search for verses in the Bible.
• .quran — Search for verses in the Quran.
• .casperai — Chat with Casper Tech AI.
• .imagine — Generate AI images from text.
• .remini — Enhance blurry images with AI.
• .chatbot — Toggle automatic AI replies.
╚════════════════════╝`,

    // Page 7: Group Menu
    `╔═❖•⊰ 👥 *GROUP MENU* ⊱•❖═╗
• .kick — Remove a member from the group.
• .add — Add a participant to the group.
• .promote — Promote a member to admin.
• .demote — Demote an admin to member.
• .open — Open group for all members.
• .close — Close group for admins only.
• .tagall — Mention all members in group.
• .hidetag — Mention all without visible tags.
• .welcome — Toggle welcome messages.
• .ginfo — Show detailed group information.
• .warn — Give a warning to a member.
╚════════════════════╝`,

    // Page 8: Logo Menu
    `╔═❖•⊰ 🎨 *LOGO MENU* ⊱•❖═╗
• .fire — Generate fire-style text logo.
• .logo — Generate professional gaming logo.
• .glow — Generate glowing neon text logo.
• .glass — Generate glass-style text logo.
• .balloon — Generate foil balloon text logo.
• .neonlight — Generate neon light text.
• .dragonball — Generate Dragon Ball style.
• .thunder — Generate thunder text effect.
• .marvel — Generate Marvel logo style.
• .glitch — Generate glitchy text effect.
╚════════════════════╝`,

    // Page 9: Tools & Utility
    `╔═❖•⊰ ☣️ *TOOLS & UTILITY* ⊱•❖═╗
• .sticker — Convert image to sticker.
• .toimg — Convert sticker to image.
• .tovideo — Convert sticker/GIF to video.
• .qr — Generate or read QR codes.
• .ss — Take a screenshot of a website.
• .ocr — Extract text from an image.
• .tempmail — Generate a temporary email.
• .removebg — Remove background from image.
• .shorturl — Shorten a long URL link.
• .calc — Perform math calculations.
• .weather — Check current weather info.
• .trt — Translate text between languages.
╚════════════════════╝`,

    // Page 10: Games & Fun
    `╔═❖•⊰ 🎮 *GAMES & FUN* ⊱•❖═╗
• .tictactoe — Play TicTacToe with friends.
• .truth — Get a random truth question.
• .dare — Get a random dare challenge.
• .joke — Get a random funny joke.
• .fact — Get a random interesting fact.
• .ship — Check love compatibility.
• .hack — Simulate a "hacking" effect.
• .matrix — Generate matrix text effect.
╚════════════════════╝`,

    // Page 11: Anime Menu
    `╔═❖•⊰ 🎌 *ANIME MENU* ⊱•❖═╗
• .waifu — Get random waifu anime picture.
• .neko — Get random neko anime picture.
• .shinobu — Get random shinobu picture.
• .megumin — Get random megumin picture.
• .hug — Send a hug reaction.
• .kiss — Send a kiss reaction.
• .slap — Send a slap reaction.
• .cry — Send a crying reaction.
• .dance — Send a dancing reaction.
• .smile — Send a smiling reaction.
• .husbu — Get random husbu picture.
• .kitsune — Get random kitsune picture.
• .luffy — Get random luffy picture.
• .zoro — Get random zoro picture.
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
