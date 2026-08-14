'use strict';

const os = require('os');
const { performance } = require('perf_hooks');

module.exports = {
    name: 'system',
    aliases: ['sys', 'botstatus', 'health'],
    description: 'Check real-time bot health, memory, and event loop lag.',

    async execute(sock, msg, args, resources) {
        const jid = msg.key.remoteJid;
        const start = performance.now();

        // Measure event loop lag
        const lagStart = Date.now();
        setTimeout(() => {
            const lag = Date.now() - lagStart - 50;
            const ping = (performance.now() - start).toFixed(2);

            const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
            const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
            const usedMem = (totalMem - freeMem).toFixed(2);
            const processMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

            const uptimeSeconds = process.uptime();
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const seconds = Math.floor(uptimeSeconds % 60);

            const response = [
                `🛠️ *PHANTOM CORE SYSTEM HEALTH* 🛠️`,
                ``,
                `⏱️ *Response Ping:* ${ping}ms`,
                `⏳ *Event Loop Lag:* ${lag > 0 ? lag : 0}ms`,
                `💻 *Bot Process RAM:* ${processMem} MB`,
                `📊 *System RAM:* ${usedMem} MB / ${totalMem} MB`,
                `⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s`,
                `⚙️ *Platform:* ${os.platform()} (${os.arch()})`,
                `🟢 *Status:* Fully Operational & Optimized`
            ].join('\n');

            sock.sendMessage(jid, { text: response }, { quoted: msg });
        }, 50);
    }
};
