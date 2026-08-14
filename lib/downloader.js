'use strict';

const axios = require('axios');

async function getYouTubeDownload(url, type = 'mp4') {
    try {
        // Try Siputzx SaveFrom API (Very robust)
        const res = await axios.get(`https://api.siputzx.my.id/api/d/savefrom?url=${encodeURIComponent(url)}`, { timeout: 15000 });
        if (res.data && res.data.data && res.data.data[0]) {
            const videoData = res.data.data[0];
            const formats = videoData.url || [];
            
            if (type === 'mp4') {
                // Find highest quality MP4
                const mp4s = formats.filter(f => f.ext === 'mp4' && f.downloadable);
                mp4s.sort((a, b) => (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0));
                if (mp4s.length > 0) {
                    return {
                        success: true,
                        title: videoData.meta?.title || 'YouTube Video',
                        download: mp4s[0].url,
                        quality: mp4s[0].quality
                    };
                }
            } else {
                // Try to find audio/mp3
                // In SaveFrom, audio might be in different formats or we use another API for mp3
            }
        }
    } catch (e) {
        console.error('Siputzx SaveFrom error:', e.message);
    }

    // Fallback to other APIs if needed
    try {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/ummy?url=${encodeURIComponent(url)}`, { timeout: 15000 });
        if (res.data && res.data.status && res.data.data) {
             return {
                success: true,
                title: res.data.data.title || 'YouTube Media',
                download: type === 'mp4' ? res.data.data.video : res.data.data.audio,
                quality: 'High'
            };
        }
    } catch (e) {}

    return { success: false, error: 'All download sources failed.' };
}

module.exports = { getYouTubeDownload };
