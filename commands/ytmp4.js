'use strict';

const axios = require('axios');
const BASE = 'https://apis.xcasper.space/api';

module.exports = {
    commands: ['ytmp4', 'ytvideo', 'ytv', 'yt'],
    description: 'Download YouTube video quickly via X-Casper API',
    permission: 'public',
    group: true,
    private: true,

    run: async (session, message, args, { sender, contextInfo }) => {
        const url = args[0];
        if (!url || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(url)) {
            return session.safeSendMessage(sender, {
                text: '🎬 Please provide a valid YouTube URL.\nExample: `.ytmp4 https://youtu.be/...`',
                contextInfo
            }, { quoted: message });
        }

        await session.safeSendMessage(sender, { text: '⏳ Fetching video...', contextInfo }, { quoted: message });

        try {
            const response = await axios.get(`${BASE}/ytmp4?url=${encodeURIComponent(url)}`, { timeout: 25000 });
            const data = response.data;
            if (!data || !data.status || !data.data || !data.data.download) {
                throw new Error('Failed to retrieve video download link from API.');
            }

            const videoUrl = data.data.download;
            const title = data.data.title || 'YouTube Video';

            await session.safeSendMessage(sender, {
                video: { url: videoUrl },
                caption: `✅ *${title}*`,
                mimetype: 'video/mp4',
                contextInfo
            }, { quoted: message });

        } catch (err) {
            console.error('ytmp4 error:', err.message);
            await session.safeSendMessage(sender, {
                text: `❌ Video download failed: ${err.message}`,
                contextInfo
            }, { quoted: message }).catch(() => {});
        }
    }
};
