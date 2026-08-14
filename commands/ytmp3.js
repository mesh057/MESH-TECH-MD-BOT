'use strict';

const axios = require('axios');
const BASE = 'https://apis.xcasper.space/api';

module.exports = {
    commands: ['ytmp3', 'ytaudio'],
    description: 'Download YouTube audio quickly via X-Casper API',
    permission: 'public',
    group: true,
    private: true,

    run: async (session, message, args, { sender, contextInfo }) => {
        const url = args[0];
        if (!url || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(url)) {
            return session.safeSendMessage(sender, {
                text: '🎵 Please provide a valid YouTube URL.\nExample: `.ytmp3 https://youtu.be/...`',
                contextInfo
            }, { quoted: message });
        }

        await session.safeSendMessage(sender, { text: '⏳ Fetching audio...', contextInfo }, { quoted: message });

        try {
            const response = await axios.get(`${BASE}/ytmp3?url=${encodeURIComponent(url)}`, { timeout: 25000 });
            const data = response.data;
            if (!data || !data.status || !data.data || !data.data.download) {
                throw new Error('Failed to retrieve audio download link from API.');
            }

            const audioUrl = data.data.download;
            const title = data.data.title || 'YouTube Audio';

            await session.safeSendMessage(sender, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                ptt: false,
                contextInfo
            }, { quoted: message });

            await session.safeSendMessage(sender, {
                text: `🎵 *${title}*`,
                contextInfo
            }, { quoted: message });

        } catch (err) {
            console.error('ytmp3 error:', err.message);
            await session.safeSendMessage(sender, {
                text: `❌ Audio download failed: ${err.message}`,
                contextInfo
            }, { quoted: message }).catch(() => {});
        }
    }
};
