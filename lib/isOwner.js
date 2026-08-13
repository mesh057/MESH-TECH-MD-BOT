const settings = require('../settings');
const { jidNormalizedUser } = require('@whiskeysockets/baileys');

function isOwner(senderId, session = null) {
    if (!senderId) return false;
    
    // If a session is provided and has a connected user ID, check against that session's number
    if (session && session.sock && session.sock.user && session.sock.user.id) {
        const sessionOwnerJid = jidNormalizedUser(session.sock.user.id);
        if (jidNormalizedUser(senderId) === sessionOwnerJid) {
            return true;
        }
    }

    // Fallback to global environment/settings owner number
    const globalOwner = settings.ownerNumber + '@s.whatsapp.net';
    if (jidNormalizedUser(senderId) === jidNormalizedUser(globalOwner)) {
        return true;
    }

    return false;
}

module.exports = isOwner;
