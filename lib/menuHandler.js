const fs = require('fs-extra');
const path = require('path');
const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");

// ✅ Load assets and menu data
const menuModule = require('../media/menu.js');
const corePath = path.join(__dirname, '..', 'menu', 'core.js');
const animePath = path.join(__dirname, '..', 'menu', 'anime.js');

let core = {};
let anime = {};

try { if (fs.existsSync(corePath)) core = require(corePath); } catch (e) {}
try { if (fs.existsSync(animePath)) anime = require(animePath); } catch (e) {}

const botBanner = 'https://i.postimg.cc/vHZz7VWG/bot-logo.png';
const botLogo = 'https://i.postimg.cc/vHZz7VWG/bot-logo.png';

async function handleMenuCommand(session, from, msg, command, args, botData, saveBotData) {
    const sock = session.sock;
    const jid = from;
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNum = sender.replace(/\D/g, "");
    const isGroup = jid.endsWith('@g.us');

    // ✅ Detect Timezone (Default to Nairobi)
    let timezone = 'Africa/Nairobi';
    if (senderNum.startsWith('254')) timezone = 'Africa/Nairobi';
    else if (senderNum.startsWith('92')) timezone = 'Asia/Karachi';
    else if (senderNum.startsWith('91')) timezone = 'Asia/Kolkata';
    else if (senderNum.startsWith('1')) timezone = 'America/New_York';
    // Add more if needed or just keep Nairobi as default

    const reply = (text) => sock.sendMessage(jid, { text }, { quoted: msg });

    // 🔸 1. Display Main Menu or Sub-menus
    const cmd = command.toLowerCase();
    
    // Support for direct sub-menu commands like '.aimenu'
    let displayType = null;
    if (cmd === 'menu') displayType = 'menu';
    else if (menuModule.menuNames[cmd]) displayType = menuModule.menuNames[cmd];
    // Support for replying to the full menu or typing sub-menu names directly
    else if (cmd.includes('menu')) {
        const potential = cmd.replace(/[^a-z]/g, '');
        if (menuModule.menuNames[potential]) displayType = menuModule.menuNames[potential];
    }

    if (displayType) {
        // Calculate user count from botData
        const userCount = Object.keys(botData.userNames || {}).length || 0;
        
        const fullMenu = menuModule.getMenu(timezone, userCount);
        let caption = fullMenu;
        
        if (displayType !== 'menu') {
            // Extract specific menu from the full string
            const menuName = displayType.toUpperCase().replace('MENU', ' MENU');
            const regex = new RegExp(`╔═❖•⊰.*?${menuName}.*?⊱•❖═╗[\\s\\S]*?╚═══════════════════╝`, 'i');
            const match = fullMenu.match(regex);
            if (match) {
                caption = menuModule.getStatusBox(timezone, userCount) + "\n" + match[0] + "\n\n*『 PHANTOM CORE v5.0.0 』*";
            }
        } else {
            // For main menu, show the FULL menu — every category and every
            // command flowing down in one message, exactly as laid out.
            caption = fullMenu;
        }

        return await sock.sendMessage(jid, {
            image: { url: displayType === 'menu' ? botBanner : botLogo },
            caption: caption
        }, { quoted: msg });
    }

    // 🔸 3. Handle Core Commands
    if (core && core[command] && typeof core[command] === "function") {
        return await core[command]({
            conn: sock,
            m: msg,
            args,
            command,
            jid,
            isGroup,
            sender: senderNum,
            reply,
            botData,
            saveBotData
        });
    }

    // 🔸 4. Handle Anime Commands
    if (anime && anime[command] && typeof anime[command] === "function") {
        return await anime[command]({
            conn: sock,
            m: msg,
            args,
            command,
            jid,
            isGroup,
            sender: senderNum,
            reply
        });
    }

    return null; // Not handled by the menu system
}

module.exports = { handleMenuCommand };
