const { downloadMediaMessage } = require('@whiskeysockets/baileys');

/**
 * Recursively unwraps WhatsApp message wrappers to find the core content.
 * Handles ephemeral, view-once v2, and extension wrappers.
 */
function unwrapViewOnce(message) {
    if (!message) return null;
    let m = message;

    // Handle Ephemeral (disappearing messages) wrapper
    if (m.ephemeralMessage?.message) m = m.ephemeralMessage.message;

    // Handle View Once wrappers
    if (m.viewOnceMessage?.message) return m.viewOnceMessage.message;
    if (m.viewOnceMessageV2?.message) return m.viewOnceMessageV2.message;
    if (m.viewOnceMessageV2Extension?.message) return m.viewOnceMessageV2Extension.message;

    return m;
}

/**
 * Extracts View Once media from a quoted message context.
 */
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
    if (unwrapped.audioMessage) return { type: 'audio', message: unwrapped.audioMessage };
    if (unwrapped.documentMessage) return { type: 'document', message: unwrapped.documentMessage };
    
    return null;
}

async function vvCommand(sock, from, msg) {
    const found = getQuotedViewOnce(msg);
    
    if (!found) {
        return await sock.sendMessage(from, { text: '❌ Please reply to a View Once photo, video, or audio with *.vv*' }, { quoted: msg });
    }

    // Visual feedback that the bot is processing
    await sock.sendMessage(from, { react: { text: '🔓', key: msg.key } }).catch(() => {});

    try {
        const buffer = await downloadMediaMessage(
            { message: { [`${found.type}Message`]: found.message } },
            'buffer',
            {}
        );

        const caption = found.message.caption || `✅ View-Once ${found.type.charAt(0).toUpperCase() + found.type.slice(1)} Recovered`;

        if (found.type === 'image') {
            await sock.sendMessage(from, { image: buffer, caption }, { quoted: msg });
        } else if (found.type === 'video') {
            await sock.sendMessage(from, { video: buffer, caption }, { quoted: msg });
        } else if (found.type === 'audio') {
            await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: msg });
        } else if (found.type === 'document') {
            await sock.sendMessage(from, { 
                document: buffer, 
                mimetype: found.message.mimetype || 'application/octet-stream', 
                fileName: found.message.fileName || 'recovered-file' 
            }, { quoted: msg });
        }
    } catch (error) {
        await sock.sendMessage(from, { text: `❌ Failed to retrieve View-Once media: ${error.message}` }, { quoted: msg });
    }
}

module.exports = vvCommand;
