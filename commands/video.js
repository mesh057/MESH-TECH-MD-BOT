const axios = require('axios');
const yts = require('yt-search');

const BASE = 'https://apis.xcasper.space/api';

module.exports = async function(session, from, msg) {
    const sock = session.sock;
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

        await session.safeSendMessage(from, { text: `⏳ Fetching video for *${videoTitle}*...` }, { quoted: msg });

        const response = await axios.get(`${BASE}/ytmp4?url=${encodeURIComponent(videoUrl)}`, { timeout: 25000 });
        const data = response.data;
        if (!data || !data.status || !data.data || !data.data.download) {
            throw new Error('Failed to retrieve video download link from API.');
        }

        await session.safeSendMessage(from, {
            video: { url: data.data.download },
            caption: `✅ *${data.data.title || videoTitle}*`,
            mimetype: 'video/mp4'
        }, { quoted: msg });
    }
    catch (err) {
        console.error('Video plugin error:', err.message);
        await session.safeSendMessage(from, { text: `❌ Failed: ${err.message}` }, { quoted: msg }).catch(() => {});
    }
};
