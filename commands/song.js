const axios = require('axios');
const yts = require('yt-search');

const BASE = 'https://apis.xcasper.space/api';

module.exports = async function(session, from, msg) {
    const sock = session.sock;
    const body = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').trim();
    const args = body.split(/ +/).slice(1);
    const query = args.join(' ').trim();

    if (!query)
        return session.safeSendMessage(from, { text: '🎵 *Song Downloader*\n\nUsage:\n.song <song name | YouTube link>' }, { quoted: msg });

    try {
        let videoUrl;
        let videoTitle = 'YouTube Song';

        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            videoUrl = query;
        } else {
            const { videos } = await yts(query);
            if (!videos?.length)
                return session.safeSendMessage(from, { text: '❌ No results found.' }, { quoted: msg });
            videoUrl = videos[0].url;
            videoTitle = videos[0].title;
        }

        await session.safeSendMessage(from, { text: `⏳ Fetching audio for *${videoTitle}*...` }, { quoted: msg });

        const response = await axios.get(`${BASE}/ytmp3?url=${encodeURIComponent(videoUrl)}`, { timeout: 25000 });
        const data = response.data;
        if (!data || !data.status || !data.data || !data.data.download) {
            throw new Error('Failed to retrieve audio download link from API.');
        }

        await session.safeSendMessage(from, {
            audio: { url: data.data.download },
            mimetype: 'audio/mpeg',
            fileName: `${data.data.title || videoTitle}.mp3`,
            ptt: false
        }, { quoted: msg });
    }
    catch (err) {
        console.error('Song plugin error:', err.message);
        await session.safeSendMessage(from, { text: `❌ Failed: ${err.message}` }, { quoted: msg }).catch(() => {});
    }
};
