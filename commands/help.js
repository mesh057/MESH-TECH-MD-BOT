const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(c => boldChars[c] || c).join('');
};

const pages = [
    // Page 1: Overview & Index
    `╭━━━〔 ${toBold("MESH-TECH MD BOT - HELP HUB")} 〕━━━┈⊷
┃ 👋 *Welcome to the Interactive Help Center!*
┃ *Use .help [page number] to jump directly:*
┃ 
┃ 📄 *Page 1:* Overview & Index
┃ 👑 *Page 2:* Owner Menu (Admin)
┃ 📥 *Page 3:* Download Menu
┃ 🪼 *Page 4:* Auto Menu (Automation)
┃ ⚡ *Page 5:* AI Menu
┃ 👥 *Page 6:* Group Menu
┃ 🪔 *Page 7:* GitHub Menu
┃ 🎨 *Page 8:* Logo Menu
┃ ☣️ *Page 9:* Tools & Utility Menu
┃ 🎮 *Page 10:* Games & Fun Menu
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷
💡 *Tip:* Type *.help 2* or *.h 2* to view specific pages!`,

    // Page 2: Owner Menu
    `╭━━━〔 ${toBold("1. OWNER MENU (PAGE 2/10)")} 〕━━━┈⊷
• .self - Switch bot to self mode
• .public - Switch bot to public mode
• .block / .unblock - Manage blocked users
• .repo - Get repository link
• .restart - Restart bot instance
• .shutdown - Shutdown bot
• .setbio / .setname / .setpp - Customize profile
• .save - Save replied message/media
• .join / .leave - Manage group memberships
• .delaymsg - Configure response delay
• .numinfo - Check phone number info
• .del - Delete bot message
• .reactch - React to channel messages
• .idcheck - Check chat/group ID
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 3: Download Menu
    `╭━━━〔 ${toBold("2. DOWNLOAD MENU (PAGE 3/10)")} 〕━━━┈⊷
• .video / .video2 - Download YouTube videos
• .song / .song2 / .play - Download audio/songs
• .gitclone - Clone GitHub repository as zip
• .tiktok - Download TikTok videos
• .insta - Download Instagram media
• .fb - Download Facebook videos
• .img - Search and download images
• .apk - Download Android APKs
• .ytmp4 / .ytmp3 - YouTube media converters
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 4: Auto Menu
    `╭━━━〔 ${toBold("3. AUTO MENU (PAGE 4/10)")} 〕━━━┈⊷
• .antilink [on/off] - Delete links in groups
• .antilinkkick [on/off] - Kick link posters
• .antibug [on/off] - Anti crash/bug protection
• .antidelete [on/off] - Recover deleted messages
• .autostatus [on/off] - Auto handle statuses
• .autoreact [on/off] - Auto react to chats
• .autogreet [on/off] - Welcome new members
• .autotypings / .autorecordings - Fake status
• .alwaysonline [on/off] - Keep status online
• .autoreactstatus / .autolikestatus [on/off] - Auto like
• .autoviewstatus [on/off] - Auto view status
• .autoreplystatus [on/off [text]] - Auto reply
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 5: AI Menu
    `╭━━━〔 ${toBold("4. AI MENU (PAGE 5/10)")} 〕━━━┈⊷
• .chatgpt [prompt] - Query ChatGPT AI
• .llama [prompt] - Query Llama AI
• .claude [prompt] - Query Claude AI
• .mistral [prompt] - Query Mistral AI
• .gemini [prompt] - Query Gemini AI
• .deepseek [prompt] - Query DeepSeek AI
• .chatbot [on/off] - Toggle AI auto-chat
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 6: Group Menu
    `╭━━━〔 ${toBold("5. GROUP MENU (PAGE 6/10)")} 〕━━━┈⊷
• .kick [mention] - Remove member from group
• .add [number] - Add member to group
• .kickall - Remove all members
• .open / .close - Open or close group chat
• .tagall - Mention all group members
• .tagadmin - Mention group admins
• .hidetag [text] - Send hidden tag message
• .listactive - List active group members
• .changename [name] - Change group subject
• .closetime [mins] - Auto close group
• .ginfo - Get group information
• .warn [mention] - Warn group member
• .gpp - Get group picture
• .promote / .demote - Manage admin roles
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 7: GitHub Menu
    `╭━━━〔 ${toBold("6. GITHUB MENU (PAGE 7/10)")} 〕━━━┈⊷
• .github - GitHub profile info
• .gitrepos - List user repositories
• .gitfollowers - List followers
• .gitstarred - List starred repos
• .gitfollow [user] - Follow GitHub user
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 8: Logo Menu
    `╭━━━〔 ${toBold("7. LOGO MENU (PAGE 8/10)")} 〕━━━┈⊷
• .logo [text] - Generate custom logo
• .d3comic [text] - Comic text effect
• .dragonball [text] - Dragonball text effect
• .deadpool [text] - Deadpool text effect
• .blackpink [text] - Blackpink text effect
• .neonlight [text] - Neon light effect
• .cat [text] - Cute cat text effect
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 9: Tools & Utility Menu
    `╭━━━〔 ${toBold("8. TOOLS & UTILITY (PAGE 9/10)")} 〕━━━┈⊷
• .readmore - Send hidden expander text
• .nice / .say - Text utilities
• .tte - Text to emoji converter
• .calc [expr] - Simple calculator
• .poll [question|opt1,opt2] - Create poll
• .hack / .matrix - Fun simulation effects
• .fancy [text] - Fancy font generator
• .cpp - Code runner
• .insult - Random insult generator
• .sticker / .s - Convert media to sticker
• .toimg - Convert sticker to image
• .qc - Quote maker
• .weather [city] - Check weather
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`,

    // Page 10: Games & Fun Menu
    `╭━━━〔 ${toBold("9. GAMES & FUN (PAGE 10/10)")} 〕━━━┈⊷
• .tictactoe - Play Tic-Tac-Toe
• .minesweeper - Play Minesweeper
• .truth / .dare - Party games
• .pickup - Pick-up lines
• .joke - Random jokes
• .ship - Love compatibility calculator
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`
];

async function helpCommand(sock, from, msg, args) {
    let pageNum = 1;
    if (args && args[0]) {
        const parsed = parseInt(args[0]);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= pages.length) {
            pageNum = parsed;
        }
    }

    const content = pages[pageNum - 1];
    const footer = `\n📌 *Page ${pageNum} of ${pages.length}* | Type *.help [1-${pages.length}]* to navigate.`;
    
    await sock.sendMessage(from, { text: content + footer }, { quoted: msg });
}

module.exports = helpCommand;
