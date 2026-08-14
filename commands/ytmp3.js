'use strict';

const axios = require('axios');

module.exports = {
    commands: ['ytmp3', 'ytaudio', 'yta'],
    description: 'Download YouTube audio quickly',
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

        await session.safeSendMessage(sender, { text: '⏳ *Fetching audio... Please wait.*', contextInfo }, { quoted: message });

        try {
            // Using a working audio API
            const res = await axios.get(`https://api.siputzx.my.id/api/d/ummy?url=${encodeURIComponent(url)}`, { timeout: 20000 });
            const data = res.data;
            
            if (!data || !data.status || !data.data || !data.data.audio) {
                throw new Error('Failed to retrieve audio download link.');
            }

            await session.safeSendMessage(sender, {
                audio: { url: data.data.audio },
                mimetype: 'audio/mpeg',
                fileName: `${data.data.title || 'audio'}.mp3`,
                ptt: false,
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
