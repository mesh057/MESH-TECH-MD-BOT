'use strict';

const axios = require('axios');
const BASE_URL = 'https://apis.xcasper.space/api';

const xcasper = {
    tiktok: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide a TikTok URL!');
        reply('⏳ *Downloading TikTok...*');
        try {
            const res = await axios.get(`${BASE_URL}/tiktok-dl?url=${encodeURIComponent(url)}`);
            if (res.data.status) {
                await conn.sendMessage(jid, { video: { url: res.data.data.video }, caption: '✅ *TikTok Downloaded*' }, { quoted: m });
            } else reply('❌ Download failed.');
        } catch (e) { reply(`❌ Error: ${e.message}`); }
    },

    ytmp4: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide a YouTube URL!');
        reply('⏳ *Fetching YouTube Video...*');
        try {
            const res = await axios.get(`${BASE_URL}/ytmp4?url=${encodeURIComponent(url)}`);
            if (res.data.status) {
                await conn.sendMessage(jid, { video: { url: res.data.data.download }, caption: '✅ *YouTube Video*' }, { quoted: m });
            } else reply('❌ Fetch failed.');
        } catch (e) { reply(`❌ Error: ${e.message}`); }
    },

    ytmp3: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide a YouTube URL!');
        reply('⏳ *Fetching YouTube Audio...*');
        try {
            const res = await axios.get(`${BASE_URL}/ytmp3?url=${encodeURIComponent(url)}`);
            if (res.data.status) {
                await conn.sendMessage(jid, { audio: { url: res.data.data.download }, mimetype: 'audio/mpeg' }, { quoted: m });
            } else reply('❌ Fetch failed.');
        } catch (e) { reply(`❌ Error: ${e.message}`); }
    },

    grok: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Enter message for Grok AI!');
        try {
            const res = await axios.get(`${BASE_URL}/grok-ai?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`🤖 *Grok AI:*\n\n${res.data.data.response || res.data.data}`);
            else reply('❌ AI error.');
        } catch (e) { reply('❌ AI unavailable.'); }
    },

    mistral: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Enter message for Mistral AI!');
        try {
            const res = await axios.get(`${BASE_URL}/mistral-ai?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`🤖 *Mistral AI:*\n\n${res.data.data.response || res.data.data}`);
            else reply('❌ AI error.');
        } catch (e) { reply('❌ AI unavailable.'); }
    },

    casperai: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Enter message for Casper AI!');
        try {
            const res = await axios.get(`${BASE_URL}/chatbot?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`🤖 *Casper AI:*\n\n${res.data.data.response || res.data.data}`);
            else reply('❌ AI error.');
        } catch (e) { reply('❌ AI unavailable.'); }
    },

    bible: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Ask a question about the Bible!');
        try {
            const res = await axios.get(`${BASE_URL}/bible-ai?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`📖 *Bible AI:*\n\n${res.data.data.response || res.data.data}`);
            else reply('❌ Error.');
        } catch (e) { reply('❌ Service unavailable.'); }
    },

    quran: async ({ reply, args }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Ask a question about the Quran!');
        try {
            const res = await axios.get(`${BASE_URL}/quran-ai?message=${encodeURIComponent(text)}`);
            if (res.data.status) reply(`☪️ *Quran AI:*\n\n${res.data.data.response || res.data.data}`);
            else reply('❌ Error.');
        } catch (e) { reply('❌ Service unavailable.'); }
    },

    removebg: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide an image URL!');
        reply('⏳ *Removing background...*');
        try {
            const res = await axios.get(`${BASE_URL}/ai/removebg?url=${encodeURIComponent(url)}`);
            if (res.data.status) {
                await conn.sendMessage(jid, { image: { url: res.data.data.url }, caption: '✅ *Background Removed*' }, { quoted: m });
            } else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    enlarger: async ({ conn, m, args, jid, reply }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide an image URL!');
        reply('⏳ *Enlarging image...*');
        try {
            const res = await axios.get(`${BASE_URL}/ai/enlarger?url=${encodeURIComponent(url)}`);
            if (res.data.status) {
                await conn.sendMessage(jid, { image: { url: res.data.data.url }, caption: '✅ *Image Enlarged*' }, { quoted: m });
            } else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    ocr: async ({ reply, args }) => {
        const url = args[0];
        if (!url) return reply('❌ Provide an image URL!');
        try {
            const res = await axios.get(`${BASE_URL}/tools/ocr?url=${encodeURIComponent(url)}`);
            if (res.data.status) reply(`📄 *OCR Result:*\n\n${res.data.data.text || res.data.data}`);
            else reply('❌ OCR failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    tempmail: async ({ reply }) => {
        try {
            const res = await axios.get(`${BASE_URL}/tools/temp-mail`);
            if (res.data.status) reply(`✉️ *Temp Email:*\n\n${res.data.data.email}`);
            else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    quote: async ({ reply }) => {
        try {
            const res = await axios.get(`${BASE_URL}/fun/quotes`);
            if (res.data.status) reply(`💬 *"${res.data.data.quote}"*\n— ${res.data.data.author}`);
            else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    joke: async ({ reply }) => {
        try {
            const res = await axios.get(`${BASE_URL}/fun/jokes`);
            if (res.data.status) reply(`😂 *Joke:*\n\n${res.data.data.joke || res.data.data}`);
            else reply('❌ Failed.');
        } catch (e) { reply('❌ Error.'); }
    },

    fire: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for fire effect!');
        reply('⏳ *Generating fire text...*');
        const imgUrl = `${BASE_URL}/fire-text?text=${encodeURIComponent(text)}`;
        await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '🔥 *Fire Text Effect*' }, { quoted: m });
    },

    logo: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for gaming logo!');
        reply('⏳ *Generating gaming logo...*');
        const imgUrl = `${BASE_URL}/game-logo?text=${encodeURIComponent(text)}`;
        await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '🎮 *Gaming Logo*' }, { quoted: m });
    },

    glass: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for glass effect!');
        reply('⏳ *Generating glass text...*');
        const imgUrl = `${BASE_URL}/foggy-glass?text=${encodeURIComponent(text)}`;
        await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '🔮 *Glass Text Effect*' }, { quoted: m });
    },

    balloon: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for balloon effect!');
        reply('⏳ *Generating balloon text...*');
        const imgUrl = `${BASE_URL}/foil-blallon?text=${encodeURIComponent(text)}`;
        await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '🎈 *Balloon Text Effect*' }, { quoted: m });
    },

    glow: async ({ conn, m, args, jid, reply }) => {
        const text = args.join(' ');
        if (!text) return reply('❌ Provide text for glow effect!');
        reply('⏳ *Generating glow text...*');
        const imgUrl = `${BASE_URL}/glow-chrome?text=${encodeURIComponent(text)}`;
        await conn.sendMessage(jid, { image: { url: imgUrl }, caption: '✨ *Glow Text Effect*' }, { quoted: m });
    }
};

module.exports = xcasper;
