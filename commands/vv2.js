const { downloadMediaMessage } = require('@whiskeysockets/baileys');

function unwrapViewOnce(message) {
    if (!message) return null;
    let m = message;
    if (m.ephemeralMessage?.message) m = m.ephemeralMessage.message;
    if (m.viewOnceMessage?.message) return m.viewOnceMessage.message;
    if (m.viewOnceMessageV2?.message) return m.viewOnceMessageV2.message;
    if (m.viewOnceMessageV2Extension?.message) return m.viewOnceMessageV2Extension.message;
    return m;
}

function getQuotedViewOnce(msg) {
    const content = msg.message?.ephemeralMessage?.message || 
                  msg.message?.viewOnceMessage?.message || 
                  msg.message?.viewOnceMessageV2?.message || 
                  msg.message;
    const ctx = content?.extendedTextMessage?.contextInfo;
    const quoted = ctx?.quotedMessage;
    if (!quoted) return null;
    const unwrapped = unwrapViewOnce(quoted);
    if (!unwrapped) return null;
    if (unwrapped.imageMessage) return { type: 'image', message: unwrapped.imageMessage };
    if (unwrapped.videoMessage) return { type: 'video', message: unwrapped.videoMessage };
    return null;
}

async function vv2Command(sock, from, msg) {
    const found = getQuotedViewOnce(msg);
    if (!found) {
        return await sock.sendMessage(from, { text: '❌ Reply to a View Once photo or video with *.vv2* to save as document.' }, { quoted: msg });
    }
    await sock.sendMessage(from, { react: { text: '📂', key: msg.key } }).catch(() => {});
    try {
        const buffer = await downloadMediaMessage(
            { message: { [`${found.type}Message`]: found.message } },
            'buffer',
            {}
        );
        const fileName = `ViewOnce_${Date.now()}.${found.type === 'image' ? 'jpg' : 'mp4'}`;
        const mimetype = found.type === 'image' ? 'image/jpeg' : 'video/mp4';
        await sock.sendMessage(from, { 
            document: buffer, 
            mimetype: found.message.mimetype || mimetype, 
            fileName: found.message.fileName || fileName,
            caption: `✅ Saved as document: ${fileName}`
        }, { quoted: msg });
    } catch (error) {
        await sock.sendMessage(from, { text: `❌ Failed to save View-Once media: ${error.message}` }, { quoted: msg });
    }
}

module.exports = vv2Command;
