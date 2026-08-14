const axios = require('axios');
const yts = require('yt-search');
const { getYouTubeDownload } = require('../lib/downloader');

module.exports = async function(session, from, msg) {
    const body = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').trim();
    const args = body.split(/ +/).slice(1);
    const query = args.join(' ').trim();

    if (!query)
        return session.safeSendMessage(from, { text: '📹 *Video Downloader*\n\nUsage:\n.video <video name | YouTube link>' }, { quoted: msg });

    try {
        let videoUrl;
        let videoTitle = 'YouTube Video';

        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            videoUrl = query;
        } else {
            const { videos } = await yts(query);
            if (!videos?.length)
                return session.safeSendMessage(from, { text: '❌ No results found.' }, { quoted: msg });
            videoUrl = videos[0].url;
            videoTitle = videos[0].title;
        }

        await session.safeSendMessage(from, { text: `⏳ *Fetching video for:* ${videoTitle}...` }, { quoted: msg });

        const result = await getYouTubeDownload(videoUrl, 'mp4');
        if (!result.success) throw new Error(result.error);

        await session.safeSendMessage(from, {
            video: { url: result.download },
            caption: `✅ *${result.title || videoTitle}*\n📈 Quality: ${result.quality}`,
            mimetype: 'video/mp4'
        }, { quoted: msg });
    }
    catch (err) {
        console.error('Video plugin error:', err.message);
        await session.safeSendMessage(from, { text: `❌ Failed: ${err.message}` }, { quoted: msg }).catch(() => {});
    }
};
