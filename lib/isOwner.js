const { jidNormalizedUser } = require('@whiskeysockets/baileys');

function normalizeNumber(value) {
    return String(value || '').replace(/\D/g, '');
}

function isOwner(senderId, session = null) {
    if (!senderId) return false;

    const senderJid = jidNormalizedUser(senderId);

    // A session supplied by the message handler must always be checked against
    // that session's authenticated WhatsApp identity. This prevents an owner
    // of one tenant from becoming an owner of every tenant.
    if (session) {
        const sessionOwnerId = session.sock?.user?.id;
        if (!sessionOwnerId) return false;
        return senderJid === jidNormalizedUser(sessionOwnerId);
    }

    // Keep a global fallback only for callers that do not have a session
    // context, such as standalone startup utilities.
    const configuredOwner = normalizeNumber(process.env.OWNER_NUMBER || process.env.OWNER);
    if (!configuredOwner) return false;
    return senderJid === jidNormalizedUser(`${configuredOwner}@s.whatsapp.net`);
}

module.exports = isOwner;

