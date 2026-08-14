'use strict';

const axios = require('axios');
const BASE_URL = 'https://apis.xcasper.space/api';

/**
 * MESH-TECH X-CASPER API INTEGRATION
 * Free, unlimited APIs for media, AI, search, and tools.
 */

const xcasper = {
    // --- DOWNLOADERS ---
    tiktok: async ({ conn, m, args, jid, reply }) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Please provide a TikTok URL!');
        reply('⏳ *Processing TikTok download...*');
        const res = await axios.get(`${BASE_URL}/tiktok-dl?url=${encodeURIComponent(query)}`);
        if (res.data.status) {
            const data = res.data.data;
            await conn.sendMessage(jid, { video: { url: data.video || data.nowm }, caption: `✅ *TikTok Downloaded!*` }, { quoted: m });
        } else reply('❌ Failed to download TikTok.');
    },
    
    ytmp3: async ({ conn, m, args, jid, reply }) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Please provide a YouTube URL!');
        reply('⏳ *Processing YouTube Audio...*');
        const res = await axios.get(`${BASE_URL}/ytmp3?url=${encodeURIComponent(query)}`);
        if (res.data.status) {
            await conn.sendMessage(jid, { audio: { url: res.data.data.download }, mimetype: 'audio/mpeg' }, { quoted: m });
        } else reply('❌ Failed to download YouTube audio.');
    },

    ytmp4: async ({ conn, m, args, jid, reply }) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Please provide a YouTube URL!');
        reply('⏳ *Processing YouTube Video...*');
        const res = await axios.get(`${BASE_URL}/ytmp4?url=${encodeURIComponent(query)}`);
        if (res.data.status) {
            await conn.sendMessage(jid, { video: { url: res.data.data.download }, caption: `✅ *YouTube Downloaded!*` }, { quoted: m });
        } else reply('❌ Failed to download YouTube video.');
    },

    fb: async ({ conn, m, args, jid, reply }) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Please provide a Facebook URL!');
        reply('⏳ *Processing Facebook download...*');
        const res = await axios.get(`${BASE_URL}/fb-dl?url=${encodeURIComponent(query)}`);
        if (res.data.status) {
            await conn.sendMessage(jid, { video: { url: res.data.data.url }, caption: `✅ *Facebook Downloaded!*` }, { quoted: m });
        } else reply('❌ Download failed.');
    },

    ig: async ({ conn, m, args, jid, reply }) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Please provide an Instagram URL!');
        reply('⏳ *Processing Instagram download...*');
        const res = await axios.get(`${BASE_URL}/dl-ig?url=${encodeURIComponent(query)}`);
        if (res.data.status) {
            const media = Array.isArray(res.data.data) ? res.data.data[0].url : res.data.data.url;
            await conn.sendMessage(jid, { video: { url: media }, caption: `✅ *Instagram Downloaded!*` }, { quoted: m });
        } else reply('❌ Download failed.');
    },

    // --- SEARCH ---
    google: async ({ args, reply }) => {
        const query = args.join(' ');
        if (!query) return reply('❌ What do you want to search?');
        const res = await axios.get(`${BASE_URL}/google?query=${encodeURIComponent(query)}`);
        if (res.data.status) {
            const results = res.data.data.map((r, i) => `*${i+1}. ${r.title}*\n🔗 ${r.link}`).join('\n\n');
            reply(`🔍 *Google Search Results:* \n\n${results}`);
        } else reply('❌ No results found.');
    },

    spotify: async ({ args, reply }) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Enter song name!');
        const res = await axios.get(`${BASE_URL}/search/spotify-search?q=${encodeURIComponent(query)}`);
        if (res.data.status) {
            const results = res.data.data.map((s, i) => `*${i+1}. ${s.title}*\n👤 ${s.artist}`).join('\n\n');
            reply(`🎵 *Spotify Search:* \n\n${results}`);
        } else reply('❌ No songs found.');
    },

    // --- AI ---
    grok: async ({ args, reply }) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Enter a message!');
        const res = await axios.get(`${BASE_URL}/grok-ai?message=${encodeURIComponent(query)}`);
        if (res.data.status) reply(`🤖 *Grok AI:*\n\n${res.data.data.response}`);
        else reply('❌ AI unavailable.');
    },

    mistral: async ({ args, reply }) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Enter a message!');
        const res = await axios.get(`${BASE_URL}/mistral-ai?message=${encodeURIComponent(query)}`);
        if (res.data.status) reply(`🤖 *Mistral AI:*\n\n${res.data.data.response}`);
        else reply('❌ AI unavailable.');
    },

    // --- TOOLS ---
    qr: async ({ conn, m, args, jid }) => {
        const query = args.join(' ');
        if (!query) return;
        const qrUrl = `${BASE_URL}/tools/qr?text=${encodeURIComponent(query)}`;
        await conn.sendMessage(jid, { image: { url: qrUrl }, caption: `✅ *QR Code Generated*` }, { quoted: m });
    },

    ss: async ({ conn, m, args, jid }) => {
        const query = args.join(' ');
        if (!query) return;
        const ssUrl = `${BASE_URL}/tools/screenshot?url=${encodeURIComponent(query)}`;
        await conn.sendMessage(jid, { image: { url: ssUrl }, caption: `📸 *Screenshot Taken*` }, { quoted: m });
    }
};

module.exports = xcasper;
