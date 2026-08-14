const fs = require('fs-extra');
const path = require('path');

module.exports = async (sock, msg, args, { from, senderId, isOwner, activeQRs, userId, initializeSession }) => {
    if (!isOwner) return sock.sendMessage(from, { text: '🚫 *Owner only command!*' }, { quoted: msg });

    const targetNumber = args[0]?.replace(/\D/g, '');
    if (!targetNumber || targetNumber.length < 10) {
        return sock.sendMessage(from, { text: '❌ *Please provide a valid phone number with country code!*\nExample: `.pairqr 254746844168`' }, { quoted: msg });
    }

    // Check if session already exists
    const sessionPath = path.join('./sessions', targetNumber);
    if (fs.existsSync(sessionPath) && fs.existsSync(path.join(sessionPath, 'creds.json'))) {
        return sock.sendMessage(from, { text: `✅ *Session for ${targetNumber} already exists and is logged in.*` }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: `⏳ *Generating QR code for ${targetNumber}...* Please wait about 10-15 seconds.` }, { quoted: msg });

    // Clear old QR
    activeQRs.delete(targetNumber);

    // Initialize session with NO pairing number to force QR generation
    initializeSession(targetNumber, true);

    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(async () => {
        attempts++;
        const qrData = activeQRs.get(targetNumber);
        if (qrData && qrData.qr) {
            clearInterval(interval);
            try {
                // In MD-BOT, qrData.qr is a Data URL (base64)
                const base64Data = qrData.qr.replace(/^data:image\/png;base64,/, "");
                const qrBuffer = Buffer.from(base64Data, 'base64');
                
                await sock.sendMessage(from, { 
                    image: qrBuffer, 
                    caption: `✅ *QR Code for ${targetNumber}*\n\n1. Open WhatsApp > Linked Devices\n2. Scan this QR code\n\n*Note:* This QR expires in 60 seconds.`
                }, { quoted: msg });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ *Failed to send QR image:* ${err.message}` }, { quoted: msg });
            }
        } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            await sock.sendMessage(from, { text: `❌ *QR generation timed out for ${targetNumber}.* Please try again.` }, { quoted: msg });
        }
    }, 2000);
};
