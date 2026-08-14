'use strict';

const { getYouTubeDownload } = require('../lib/downloader');

module.exports = {
    commands: ['ytmp4', 'ytvideo', 'ytv', 'yt'],
    description: 'Download YouTube video quickly',
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

        await session.safeSendMessage(sender, { text: '⏳ *Fetching video... Please wait.*', contextInfo }, { quoted: message });

        try {
            const result = await getYouTubeDownload(url, 'mp4');
            if (!result.success) throw new Error(result.error);

            await session.safeSendMessage(sender, {
                video: { url: result.download },
                caption: `✅ *${result.title}*\n📈 Quality: ${result.quality}`,
                mimetype: 'video/mp4',
                contextInfo
            }, { quoted: message });

        } catch (err) {
            console.error('ytmp4 error:', err.message);
            await session.safeSendMessage(sender, {
                text: `❌ Video download failed: ${err.message}\nTry again in a few moments.`,
                contextInfo
            }, { quoted: message }).catch(() => {});
        }
    }
};
