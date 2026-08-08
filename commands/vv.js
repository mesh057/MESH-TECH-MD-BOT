const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

function unwrapMessageContent(message) {
    let content = message;
    // WhatsApp can nest view-once media inside ephemeral and view-once wrappers.
    for (let i = 0; i < 5 && content; i += 1) {
        const wrapped = content.ephemeralMessage ||
            content.viewOnceMessageV2Extension ||
            content.viewOnceMessageV2 ||
            content.viewOnceMessage;
        if (!wrapped?.message) break;
        content = wrapped.message;
    }
    return content;
}

async function vvCommand(sock, from, msg) {
    // Loading reactions should never prevent the media from being opened.
    const loadEmojis = ['⏳', '🔓', '👁️'];
    for (const emoji of loadEmojis) {
        await sock.sendMessage(from, { react: { text: emoji, key: msg.key } }).catch(() => {});
    }

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
        msg.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
        msg.message?.viewOnceMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return await sock.sendMessage(from, { text: "❌ Please reply to a View-Once message." }, { quoted: msg });

    const message = unwrapMessageContent(quoted);
    if (!message) return await sock.sendMessage(from, { text: "❌ The View-Once message could not be opened." }, { quoted: msg });
    const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'];
    const vType = mediaTypes.find((type) => message[type]);

    if (vType) {
        try {
            const mediaType = vType.replace('Message', '');
            const stream = await downloadContentFromMessage(message[vType], mediaType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            
            if (vType === 'imageMessage') await sock.sendMessage(from, { image: buffer, caption: "✅ View-Once Image Downloaded" }, { quoted: msg });
            else if (vType === 'videoMessage') await sock.sendMessage(from, { video: buffer, caption: "✅ View-Once Video Downloaded" }, { quoted: msg });
            else if (vType === 'audioMessage') await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: msg });
            else if (vType === 'documentMessage') await sock.sendMessage(from, { document: buffer, mimetype: message[vType].mimetype || 'application/octet-stream', fileName: message[vType].fileName || 'view-once-file' }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ Failed to download View-Once media." }, { quoted: msg });
        }
    } else {
        await sock.sendMessage(from, { text: "❌ Not a View-Once media message." }, { quoted: msg });
    }
}

module.exports = vvCommand;
