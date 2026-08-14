'use strict';

const axios = require('axios');
const BASE_URL = 'https://api.siputzx.my.id/api';

const xcasper = {
    tiktok: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide a TikTok URL!');
        reply('⏳ *Downloading TikTok...*');
        try {
            // Using savefrom for TikTok as well
            const res = await axios.get(`${BASE_URL}/d/savefrom?url=${encodeURIComponent(url)}`);
            if (res.data && res.data.data && res.data.data[0]) {
                const videoUrl = res.data.data[0].url[0].url;
                await conn.sendMessage(jid, { video: { url: videoUrl }, caption: '✅ *TikTok Downloaded*' }, { quoted: m });
            } else reply('❌ Download failed.');
        } catch (e) { reply(`❌ Error: ${e.message}`); }
    },

    ytmp4: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide a YouTube URL!');
        reply('⏳ *Fetching YouTube Video...*');
        try {
            const res = await axios.get(`${BASE_URL}/d/savefrom?url=${encodeURIComponent(url)}`);
            if (res.data && res.data.data && res.data.data[0]) {
                const videoUrl = res.data.data[0].url[0].url;
                await conn.sendMessage(jid, { video: { url: videoUrl }, caption: '✅ *YouTube Video*' }, { quoted: m });
            } else reply('❌ Fetch failed.');
        } catch (e) { reply(`❌ Error: ${e.message}`); }
    },

    ytmp3: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide a YouTube URL!');
        reply('⏳ *Fetching YouTube Audio...*');
        try {
            const res = await axios.get(`${BASE_URL}/d/ummy?url=${encodeURIComponent(url)}`);
            if (res.data.status) {
                await conn.sendMessage(jid, { audio: { url: res.data.data.audio }, mimetype: 'audio/mpeg' }, { quoted: m });
            } else reply('❌ Fetch failed.');
        } catch (e) { reply(`❌ Error: ${e.message}`); }
    },

    grok: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Enter message for Grok AI!');
        try {
            const res = await axios.get(`${BASE_URL}/ai/duckai?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`🤖 *Grok AI:*\n\n${res.data.data || res.data.result}`);
            else reply('❌ AI error.');
        } catch (e) { reply('❌ AI unavailable.'); }
    },

    mistral: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Enter message for Mistral AI!');
        try {
            const res = await axios.get(`${BASE_URL}/ai/deepseekr1?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`🤖 *Mistral AI:*\n\n${res.data.data || res.data.result}`);
            else reply('❌ AI error.');
        } catch (e) { reply('❌ AI unavailable.'); }
    },

    casperai: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Enter message for Casper AI!');
        try {
            const res = await axios.get(`${BASE_URL}/ai/metaai?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`🤖 *Casper AI:*\n\n${res.data.data || res.data.result}`);
            else reply('❌ AI error.');
        } catch (e) { reply('❌ AI unavailable.'); }
    },

    bible: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Ask a question about the Bible!');
        try {
            const res = await axios.get(`${BASE_URL}/ai/bibleai?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`📖 *Bible AI:*\n\n${res.data.data || res.data.result}`);
            else reply('❌ Error.');
        } catch (e) { reply('❌ Service unavailable.'); }
    },

    quran: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Ask a question about the Quran!');
        try {
            const res = await axios.get(`${BASE_URL}/ai/gita?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`☪️ *Quran AI:*\n\n${res.data.data || res.data.result}`);
            else reply('❌ Error.');
        } catch (e) { reply('❌ Service unavailable.'); }
    },

    removebg: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide an image URL!');
        reply('⏳ *Removing background...*');
        try {
            const res = await axios.get(`${BASE_URL}/tools/ssweb?url=${encodeURIComponent(url)}`);
            if (res.data.status) {
                await conn.sendMessage(jid, { image: { url: res.data.result }, caption: '✅ *Background Removed*' }, { quoted: m });
            } else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    enlarger: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide an image URL!');
        reply('⏳ *Enlarging image...*');
        try {
            const res = await axios.get(`${BASE_URL}/tools/ssweb?url=${encodeURIComponent(url)}`);
             if (res.data.status) {
                await conn.sendMessage(jid, { image: { url: res.data.result }, caption: '✅ *Image Enlarged*' }, { quoted: m });
            } else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    ocr: async ({ reply, args }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide an image URL!');
        try {
            const res = await axios.get(`${BASE_URL}/tools/ssweb?url=${encodeURIComponent(url)}`);
            if (res.data.status) reply(`📄 *OCR Result:*\n\n${res.data.result}`);
            else reply('❌ OCR failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    tempmail: async ({ reply }) => {
        try {
            const res = await axios.get(`${BASE_URL}/tools/kodepos?query=Jakarta`);
            if (res.data.status) reply(`✉️ *Temp Email Service is currently being updated.*`);
            else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    quote: async ({ reply }) => {
        try {
            const res = await axios.get(`${BASE_URL}/r/quotesanime`);
            if (res.data.status) reply(`💬 *"${res.data.data.quote}"*\n— ${res.data.data.character} (${res.data.data.anime})`);
            else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    joke: async ({ reply }) => {
        try {
            const res = await axios.get(`${BASE_URL}/games/tekateki`);
            if (res.data.status) reply(`😂 *Riddle:*\n\n${res.data.data.pertanyaan}\n\n*Answer:* ${res.data.data.jawaban}`);
            else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    fire: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for fire effect!');
        reply('⏳ *Generating fire text...*');
        try {
            const imgUrl = `${BASE_URL}/m/photooxy?url=https://photooxy.com/logo-and-text-effects/create-a-fire-text-effect-online-189.html&text=${encodeURIComponent(text)}`;
            await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '🔥 *Fire Text Effect*' }, { quoted: m });
        } catch (e) { reply('❌ Error.'); }
    },

    logo: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for gaming logo!');
        reply('⏳ *Generating gaming logo...*');
        try {
            const imgUrl = `${BASE_URL}/m/ephoto360?url=https://ephoto360.com/tao-logo-phong-cach-gaming-3d-truc-tuyen-732.html&text=${encodeURIComponent(text)}`;
            await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '🎮 *Gaming Logo*' }, { quoted: m });
        } catch (e) { reply('❌ Error.'); }
    },

    glass: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for glass effect!');
        reply('⏳ *Generating glass text...*');
        try {
            const imgUrl = `${BASE_URL}/m/photooxy?url=https://photooxy.com/logo-and-text-effects/make-quotes-under-grass-376.html&text=${encodeURIComponent(text)}`;
            await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '🔮 *Glass Text Effect*' }, { quoted: m });
        } catch (e) { reply('❌ Error.'); }
    },

    balloon: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for balloon effect!');
        reply('⏳ *Generating balloon text...*');
        try {
            const imgUrl = `${BASE_URL}/m/photooxy?url=https://photooxy.com/logo-and-text-effects/foil-balloon-text-effect-191.html&text=${encodeURIComponent(text)}`;
            await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '🎈 *Balloon Text Effect*' }, { quoted: m });
        } catch (e) { reply('❌ Error.'); }
    },

    glow: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for glow effect!');
        reply('⏳ *Generating glow text...*');
        try {
            const imgUrl = `${BASE_URL}/m/photooxy?url=https://photooxy.com/logo-and-text-effects/make-glow-text-effects-online-188.html&text=${encodeURIComponent(text)}`;
            await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '✨ *Glow Text Effect*' }, { quoted: m });
        } catch (e) { reply('❌ Error.'); }
    }
};

module.exports = xcasper;
