const { menuNames } = require('../media/menu');

const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(c => boldChars[c] || c).join('');
};

async function helpCommand(sock, from, msg) {
    const helpText = `╭━━━〔 ${toBold("MESH-TECH MD BOT - MASTER HELP")} 〕━━━┈⊷
┃ 👋 *Welcome! Here is the complete list of all*
┃ *commands available across all menu categories.*
┃ *Use prefix [. (dot)] before any command.*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷

👑 *1. OWNER MENU (Admin Only)*
• .self - Switch bot to self mode
• .public - Switch bot to public mode
• .block / .unblock - Manage blocked users
• .repo - Get repository link
• .restart - Restart bot instance
• .shutdown - Shutdown bot
• .setbio / .setname / .setpp - Customize bot profile
• .save - Save replied message/media
• .join / .leave - Manage group memberships
• .delaymsg - Configure delay
• .numinfo - Check phone number info
• .del - Delete bot message
• .reactch - React to channel messages
• .idcheck - Check chat/group ID

📥 *2. DOWNLOAD MENU*
• .video / .video2 - Download YouTube videos
• .song / .song2 / .play - Download audio/songs
• .gitclone - Clone GitHub repository as zip
• .tiktok - Download TikTok videos
• .insta - Download Instagram media
• .fb - Download Facebook videos
• .img - Search and download images
• .apk - Download Android APKs
• .ytmp4 / .ytmp3 - YouTube media converters

🪼 *3. AUTO MENU (Automation & Protection)*
• .antilink [on/off] - Delete links in groups
• .antilinkkick [on/off] - Kick link posters
• .antibug [on/off] - Anti crash/bug protection
• .antidelete [on/off] - Recover deleted messages in DMs
• .autostatus [on/off] - Auto handle statuses
• .autoreact [on/off] - Auto react to chats
• .autogreet [on/off] - Welcome new members
• .autotypings / .autorecordings - Fake typing/recording
• .alwaysonline [on/off] - Keep status online
• .autoreactstatus / .autolikestatus [on/off] - Auto like WhatsApp status
• .autoviewstatus [on/off] - Auto view WhatsApp status
• .autoreplystatus [on/off [text]] - Auto reply to WhatsApp status

⚡ *4. AI MENU*
• .chatgpt [prompt] - Query ChatGPT AI
• .llama [prompt] - Query Llama AI
• .claude [prompt] - Query Claude AI
• .mistral [prompt] - Query Mistral AI
• .gemini [prompt] - Query Gemini AI
• .deepseek [prompt] - Query DeepSeek AI
• .chatbot [on/off] - Toggle AI auto-chat

👥 *5. GROUP MENU*
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

🪔 *6. GITHUB MENU*
• .github - GitHub profile info
• .gitrepos - List user repositories
• .gitfollowers - List followers
• .gitstarred - List starred repos
• .gitfollow [user] - Follow GitHub user

🎨 *7. LOGO MENU*
• .logo [text] - Generate custom logo
• .d3comic / .dragonball / .deadpool / .blackpink / .neonlight / .cat - Specialized text effects

☣️ *8. TOOLS & UTILITY MENU*
• .readmore - Send hidden expander text
• .nice / .say - Text utilities
• .tte - Text to emoji
• .calc [expr] - Calculator
• .poll [question|opt1,opt2] - Create poll
• .hack - Fun simulation
• .matrix - Matrix rain effect
• .fancy [text] - Fancy font generator
• .cpp - Code runner
• .insult - Random insult generator
• .sticker / .s - Convert image/video to sticker
• .toimg - Convert sticker to image
• .qc - Quote maker
• .weather [city] - Check weather

🎮 *9. GAMES & FUN MENU*
• .tictactoe - Play Tic-Tac-Toe
• .minesweeper - Play Minesweeper
• .truth / .dare - Party games
• .pickup - Pick-up lines
• .joke - Random jokes
• .ship - Love compatibility calculator

╭━━━〔 ${toBold("HOW TO USE")} 〕━━━┈⊷
┃ 1. Send any command with the dot prefix (.help)
┃ 2. Type *.menu* to view the interactive category view
┃ 3. Enjoy using *MESH-TECH MD BOT*! 🚀
╰━━━━━━━━━━━━━━━━━━┈⊷`;

    await sock.sendMessage(from, { text: helpText }, { quoted: msg });
}

module.exports = helpCommand;
