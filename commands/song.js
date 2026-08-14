const axios = require('axios');
const yts = require('yt-search');

module.exports = async function(session, from, msg) {
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

        await session.safeSendMessage(from, { text: `⏳ *Fetching audio for:* ${videoTitle}...` }, { quoted: msg });

        // Using a working audio API
        const res = await axios.get(`https://api.siputzx.my.id/api/d/ummy?url=${encodeURIComponent(videoUrl)}`, { timeout: 20000 });
        const data = res.data;
        
        if (!data || !data.status || !data.data || !data.data.audio) {
            throw new Error('Failed to retrieve audio download link.');
        }

        await session.safeSendMessage(from, {
            audio: { url: data.data.audio },
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
