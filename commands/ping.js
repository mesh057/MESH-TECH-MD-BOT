const REACTION_SEQUENCE = ['🤕', '😂', '👀', '🔥', '😈', '🌚', '💀', '🖕', '⚡', '😡', '🤬', '🐛', '✅'];
const REACTION_DELAY_MS = 80;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function react(sock, from, msg, emoji) {
    await sock.sendMessage(from, {
        react: { text: emoji, key: msg.key },
    }).catch(() => {});
}

async function ping(session, from, msg) {
    const sock = session.sock;
    const start = process.hrtime.bigint();

    // Fire off the reaction sequence
    const reactionSequence = (async () => {
        for (const emoji of REACTION_SEQUENCE) {
            await react(sock, from, msg, emoji);
            await delay(REACTION_DELAY_MS);
        }
        await react(sock, from, msg, ''); // Clear
    })();

    // Send placeholder
    let sent;
    try {
        sent = await sock.sendMessage(from, { text: '𝗣𝗶𝗻𝗴𝗶𝗻𝗴...' }, { quoted: msg });
    } catch (err) {
        return;
    }

    const end = process.hrtime.bigint();
    const speed = (Number(end - start) / 1e6).toFixed(4);

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

    const text = `╭─❖ *P O N G !* ❖─╮\n` +
                 `│\n` +
                 `│  😡 *Speed:*  ${speed} ms\n` +
                 `│  ⏱️ *Uptime:*  ${uptimeStr}\n` +
                 `│  🖥️ *Status:*  Online ✅\n` +
                 `│\n` +
                 `╰────────────────╯`;

    try {
        await sock.sendMessage(from, { text, edit: sent.key });
    } catch (err) {
        await sock.sendMessage(from, { text }, { quoted: msg });
    }

    await reactionSequence;
}

module.exports = ping;
