const axios = require('axios');

// Helper: fetch from waifu.pics SFW
async function waifuSFW(endpoint) {
    const res = await axios.get(`https://api.waifu.pics/sfw/${endpoint}`);
    return res.data.url;
}
// Helper: fetch from waifu.pics NSFW
async function waifuNSFW(endpoint) {
    const res = await axios.get(`https://api.waifu.pics/nsfw/${endpoint}`);
    return res.data.url;
}
// Helper: fetch from nekos.best
async function nekosBest(endpoint) {
    const res = await axios.get(`https://nekos.best/api/v2/${endpoint}`);
    return res.data.results[0].url;
}
// Helper: fetch from nekos.life
async function nekosLife(endpoint) {
    const res = await axios.get(`https://nekos.life/api/v2/img/${endpoint}`);
    return res.data.url;
}
// Generic image sender
async function sendImg(conn, jid, url, caption) {
    return conn.sendMessage(jid, { image: { url }, caption });
}

const animeCommands = {
    waifu: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/waifu');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Here is your waifu!' });
        } catch (e) {
            reply('Error fetching waifu.');
        }
    },
    neko: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/neko');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Here is your neko!' });
        } catch (e) {
            reply('Error fetching neko.');
        }
    },
    shinobu: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/shinobu');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Here is your shinobu!' });
        } catch (e) {
            reply('Error fetching shinobu.');
        }
    },
    megumin: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/megumin');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Here is your megumin!' });
        } catch (e) {
            reply('Error fetching megumin.');
        }
    },
    bully: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/bully');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Bully!' });
        } catch (e) {
            reply('Error fetching bully.');
        }
    },
    cuddle: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/cuddle');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Cuddle!' });
        } catch (e) {
            reply('Error fetching cuddle.');
        }
    },
    cry: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/cry');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Cry!' });
        } catch (e) {
            reply('Error fetching cry.');
        }
    },
    hug: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/hug');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Hug!' });
        } catch (e) {
            reply('Error fetching hug.');
        }
    },
    awoo: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/awoo');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Awoo!' });
        } catch (e) {
            reply('Error fetching awoo.');
        }
    },
    kiss: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/kiss');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Kiss!' });
        } catch (e) {
            reply('Error fetching kiss.');
        }
    },
    lick: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/lick');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Lick!' });
        } catch (e) {
            reply('Error fetching lick.');
        }
    },
    pat: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/pat');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Pat!' });
        } catch (e) {
            reply('Error fetching pat.');
        }
    },
    smug: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/smug');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Smug!' });
        } catch (e) {
            reply('Error fetching smug.');
        }
    },
    bonk: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/bonk');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Bonk!' });
        } catch (e) {
            reply('Error fetching bonk.');
        }
    },
    yeet: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/yeet');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Yeet!' });
        } catch (e) {
            reply('Error fetching yeet.');
        }
    },
    blush: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/blush');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Blush!' });
        } catch (e) {
            reply('Error fetching blush.');
        }
    },
    smile: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/smile');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Smile!' });
        } catch (e) {
            reply('Error fetching smile.');
        }
    },
    wave: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/wave');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Wave!' });
        } catch (e) {
            reply('Error fetching wave.');
        }
    },
    highfive: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/highfive');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Highfive!' });
        } catch (e) {
            reply('Error fetching highfive.');
        }
    },
    handhold: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/handhold');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Handhold!' });
        } catch (e) {
            reply('Error fetching handhold.');
        }
    },
    nom: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/nom');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Nom!' });
        } catch (e) {
            reply('Error fetching nom.');
        }
    },
    bite: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/bite');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Bite!' });
        } catch (e) {
            reply('Error fetching bite.');
        }
    },
    glomp: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/glomp');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Glomp!' });
        } catch (e) {
            reply('Error fetching glomp.');
        }
    },
    slap: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/slap');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Slap!' });
        } catch (e) {
            reply('Error fetching slap.');
        }
    },
    kill: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/kill');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Kill!' });
        } catch (e) {
            reply('Error fetching kill.');
        }
    },
    kick: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/kick');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Kick!' });
        } catch (e) {
            reply('Error fetching kick.');
        }
    },
    happy: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/happy');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Happy!' });
        } catch (e) {
            reply('Error fetching happy.');
        }
    },
    wink: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/wink');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Wink!' });
        } catch (e) {
            reply('Error fetching wink.');
        }
    },
    poke: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/poke');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Poke!' });
        } catch (e) {
            reply('Error fetching poke.');
        }
    },
    dance: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/dance');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Dance!' });
        } catch (e) {
            reply('Error fetching dance.');
        }
    },
    cringe: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/cringe');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: 'Cringe!' });
        } catch (e) {
            reply('Error fetching cringe.');
        }
    },
    husbu: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://nekos.best/api/v2/husbando');
            await conn.sendMessage(jid, { image: { url: res.data.results[0].url }, caption: 'Here is your husbu!' });
        } catch (e) {
            reply('Error fetching husbu.');
        }
    },
    kitsune: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://nekos.best/api/v2/kitsune');
            await conn.sendMessage(jid, { image: { url: res.data.results[0].url }, caption: 'Kitsune!' });
        } catch (e) {
            reply('Error fetching kitsune.');
        }
    },
    luffy: async ({ conn, jid, reply }) => {
        try {
            const res = await axios.get('https://api.waifu.pics/sfw/waifu');
            await conn.sendMessage(jid, { image: { url: res.data.url }, caption: '⚓ Luffy!' });
        } catch (e) {
            reply('Error fetching luffy.');
        }
    },

    // ============================
    // 🎌 EXTRA ANIME CHARACTERS (from commands.docx)
    // ============================
    akira: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎌 Akira!'}); } catch(e){ reply('❌ Error.'); } },
    akiyama: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎌 Akiyama!'}); } catch(e){ reply('❌ Error.'); } },
    art: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎨 Anime Art!'}); } catch(e){ reply('❌ Error.'); } },
    asuna: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚔️ Asuna!'}); } catch(e){ reply('❌ Error.'); } },
    ayuzawa: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Ayuzawa!'}); } catch(e){ reply('❌ Error.'); } },
    boruto: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚡ Boruto!'}); } catch(e){ reply('❌ Error.'); } },
    bts: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎵 BTS!'}); } catch(e){ reply('❌ Error.'); } },
    chiho: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Chiho!'}); } catch(e){ reply('❌ Error.'); } },
    cosplay: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎭 Cosplay!'}); } catch(e){ reply('❌ Error.'); } },
    cosplayloli: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎭 Cosplay Loli!'}); } catch(e){ reply('❌ Error.'); } },
    cyber: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💻 Cyber Anime!'}); } catch(e){ reply('❌ Error.'); } },
    deidara: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💥 Deidara!'}); } catch(e){ reply('❌ Error.'); } },
    doraemonq: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🤖 Doraemon!'}); } catch(e){ reply('❌ Error.'); } },
    eliana: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Eliana!'}); } catch(e){ reply('❌ Error.'); } },
    emilia: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'❄️ Emilia!'}); } catch(e){ reply('❌ Error.'); } },
    exo: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎵 EXO!'}); } catch(e){ reply('❌ Error.'); } },
    ezra: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚔️ Ezra!'}); } catch(e){ reply('❌ Error.'); } },
    gamewallpaper: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎮 Game Wallpaper!'}); } catch(e){ reply('❌ Error.'); } },
    gremony: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Gremony!'}); } catch(e){ reply('❌ Error.'); } },
    hacker: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💻 Hacker Anime!'}); } catch(e){ reply('❌ Error.'); } },
    hestia: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Hestia!'}); } catch(e){ reply('❌ Error.'); } },
    hinata: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💜 Hinata!'}); } catch(e){ reply('❌ Error.'); } },
    inori: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Inori!'}); } catch(e){ reply('❌ Error.'); } },
    isuzu: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Isuzu!'}); } catch(e){ reply('❌ Error.'); } },
    islamic: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'☪️ Islamic Art!'}); } catch(e){ reply('❌ Error.'); } },
    itori: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Itori!'}); } catch(e){ reply('❌ Error.'); } },
    jennie: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💕 Jennie!'}); } catch(e){ reply('❌ Error.'); } },
    itachi: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌀 Itachi!'}); } catch(e){ reply('❌ Error.'); } },
    jiso: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💕 Jiso!'}); } catch(e){ reply('❌ Error.'); } },
    justina: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Justina!'}); } catch(e){ reply('❌ Error.'); } },
    kaga: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Kaga!'}); } catch(e){ reply('❌ Error.'); } },
    kagura: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Kagura!'}); } catch(e){ reply('❌ Error.'); } },
    kakasih: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚡ Kakashi!'}); } catch(e){ reply('❌ Error.'); } },
    cartoon: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎨 Cartoon!'}); } catch(e){ reply('❌ Error.'); } },
    kaoshi: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Kaoshi!'}); } catch(e){ reply('❌ Error.'); } },
    shortquote: async ({ reply }) => { const q=['Stay strong.','Dream big.','Never give up.','Be yourself.','Keep going.']; return reply('💬 *Short Quote:*\n"' + q[Math.floor(Math.random()*q.length)] + '"'); },
    keneki: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👁️ Kaneki!'}); } catch(e){ reply('❌ Error.'); } },
    kotori: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Kotori!'}); } catch(e){ reply('❌ Error.'); } },
    kurumi: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⏰ Kurumi!'}); } catch(e){ reply('❌ Error.'); } },
    lisa: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💕 Lisa!'}); } catch(e){ reply('❌ Error.'); } },
    madara: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌀 Madara!'}); } catch(e){ reply('❌ Error.'); } },
    micky: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🐭 Mickey!'}); } catch(e){ reply('❌ Error.'); } },
    mikasa: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚔️ Mikasa!'}); } catch(e){ reply('❌ Error.'); } },
    miku: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎵 Miku!'}); } catch(e){ reply('❌ Error.'); } },
    naruto: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🍥 Naruto!'}); } catch(e){ reply('❌ Error.'); } },
    menato: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚡ Minato!'}); } catch(e){ reply('❌ Error.'); } },
    mountain: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🏔️ Mountain Anime!'}); } catch(e){ reply('❌ Error.'); } },
    nekomine: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🐱 Nekomine!'}); } catch(e){ reply('❌ Error.'); } },
    nezuko: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Nezuko!'}); } catch(e){ reply('❌ Error.'); } },
    onepeice: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚓ One Piece!'}); } catch(e){ reply('❌ Error.'); } },
    pokemon: async ({ conn, jid, reply }) => {
        try {
            const id = Math.floor(Math.random()*898)+1;
            const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            return conn.sendMessage(jid, { image: { url: res.data.sprites.front_default }, caption: `⚡ *${res.data.name.toUpperCase()}* (#${id})` });
        } catch(e) { reply('❌ Error fetching pokemon.'); }
    },
    programming: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💻 Programming Anime!'}); } catch(e){ reply('❌ Error.'); } },
    pentol: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Pentol!'}); } catch(e){ reply('❌ Error.'); } },
    randomnime: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎲 Random Anime!'}); } catch(e){ reply('❌ Error.'); } },
    randomnime2: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎲 Random Anime v2!'}); } catch(e){ reply('❌ Error.'); } },
    rize: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Rize!'}); } catch(e){ reply('❌ Error.'); } },
    rose: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌹 Rose!'}); } catch(e){ reply('❌ Error.'); } },
    sagiri: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Sagiri!'}); } catch(e){ reply('❌ Error.'); } },
    sakura: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Sakura!'}); } catch(e){ reply('❌ Error.'); } },
    satanic: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'😈 Satanic Anime!'}); } catch(e){ reply('❌ Error.'); } },
    sasuke: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚡ Sasuke!'}); } catch(e){ reply('❌ Error.'); } },
    shinan: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Shinan!'}); } catch(e){ reply('❌ Error.'); } },
    shinka: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Shinka!'}); } catch(e){ reply('❌ Error.'); } },
    shota: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Shota!'}); } catch(e){ reply('❌ Error.'); } },
    space: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🚀 Space Anime!'}); } catch(e){ reply('❌ Error.'); } },
    technology: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://nekos.life/api/v2/img/neko'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💻 Technology Anime!'}); } catch(e){ reply('❌ Error.'); } },
    tejina: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Tejina!'}); } catch(e){ reply('❌ Error.'); } },
    toukacha: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Touka!'}); } catch(e){ reply('❌ Error.'); } },
    tsunade: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💪 Tsunade!'}); } catch(e){ reply('❌ Error.'); } },
    yotsuba: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Yotsuba!'}); } catch(e){ reply('❌ Error.'); } },
    yuki: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'❄️ Yuki!'}); } catch(e){ reply('❌ Error.'); } },
    yumeko: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎲 Yumeko!'}); } catch(e){ reply('❌ Error.'); } },
    yulibocil: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Yulibocil!'}); } catch(e){ reply('❌ Error.'); } },
    blueArchive: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔵 Blue Archive!'}); } catch(e){ reply('❌ Error.'); } },
    animecharacter: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎌 Anime Character!'}); } catch(e){ reply('❌ Error.'); } },
    quotesanime: async ({ reply }) => {
        const q = ["It's not the face that makes someone a monster. — Naruto","The world isn't perfect. But it's there for us. — Roy Mustang","If you don't take risks, you can't create a future. — Luffy"];
        return reply('💬 *Anime Quote:*\n"' + q[Math.floor(Math.random()*q.length)] + '"');
    },
    kiryuu: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/sfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Kiryuu!'}); } catch(e){ reply('❌ Error.'); } },
    '9anime': async ({ reply, args }) => { if(!args||!args.length) return reply('❓ Usage: .9anime <name>'); return reply('🎌 *9Anime:* Searching for ' + args.join(' ') + '...'); },
    webtoon: async ({ reply, args }) => { if(!args||!args.length) return reply('❓ Usage: .webtoon <title>'); return reply('📖 *Webtoon:* Searching for ' + args.join(' ') + '...'); },
    animesearch: async ({ reply, args }) => {
        if(!args||!args.length) return reply('❓ Usage: .animesearch <name>');
        try {
            const res = await axios.get('https://api.jikan.moe/v4/anime?q=' + encodeURIComponent(args.join(' ')) + '&limit=3');
            const list = res.data.data.map((a,i)=> (i+1)+'. *'+a.title+'* ('+(a.year||'?')+')\n'+((a.synopsis||'').slice(0,80))+'...').join('\n\n');
            return reply('🎌 *Anime Search:*\n\n' + list);
        } catch(e){ return reply('❌ Anime search failed.'); }
    },
    animevideo: async ({ reply, args }) => { if(!args||!args.length) return reply('❓ Usage: .animevideo <name>'); return reply('🎬 *Anime Video:* Searching for ' + args.join(' ') + '...'); },

    // ============================
    // 🔞 NSFW COMMANDS (from commands.docx)
    // ============================
    genshin: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Genshin NSFW'}); } catch(e){ reply('❌ Error.'); } },
    swimsuit: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👙 Swimsuit'}); } catch(e){ reply('❌ Error.'); } },
    schoolswimsuit: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🏊 School Swimsuit'}); } catch(e){ reply('❌ Error.'); } },
    white: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⬜ White'}); } catch(e){ reply('❌ Error.'); } },
    barefoot: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🦶 Barefoot'}); } catch(e){ reply('❌ Error.'); } },
    touhou: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Touhou'}); } catch(e){ reply('❌ Error.'); } },
    gamecg: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎮 Game CG'}); } catch(e){ reply('❌ Error.'); } },
    hololive: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎭 Hololive'}); } catch(e){ reply('❌ Error.'); } },
    uncensored: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Uncensored'}); } catch(e){ reply('❌ Error.'); } },
    glasses: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🤓 Glasses'}); } catch(e){ reply('❌ Error.'); } },
    weapon: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚔️ Weapon'}); } catch(e){ reply('❌ Error.'); } },
    shirtlift: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👕 Shirt Lift'}); } catch(e){ reply('❌ Error.'); } },
    chain: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⛓️ Chain'}); } catch(e){ reply('❌ Error.'); } },
    fingering: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Fingering'}); } catch(e){ reply('❌ Error.'); } },
    flatchest: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Flat Chest'}); } catch(e){ reply('❌ Error.'); } },
    torncloth: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Torn Cloth'}); } catch(e){ reply('❌ Error.'); } },
    bondage: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Bondage'}); } catch(e){ reply('❌ Error.'); } },
    demon: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'😈 Demon'}); } catch(e){ reply('❌ Error.'); } },
    pantypull: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Panty Pull'}); } catch(e){ reply('❌ Error.'); } },
    headphone: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎧 Headphone'}); } catch(e){ reply('❌ Error.'); } },
    headdress: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👑 Headdress'}); } catch(e){ reply('❌ Error.'); } },
    anusview: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Anus View'}); } catch(e){ reply('❌ Error.'); } },
    shorts: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🩳 Shorts'}); } catch(e){ reply('❌ Error.'); } },
    stokings: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🧦 Stockings'}); } catch(e){ reply('❌ Error.'); } },
    topless: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Topless'}); } catch(e){ reply('❌ Error.'); } },
    beach: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🏖️ Beach'}); } catch(e){ reply('❌ Error.'); } },
    bunnygirl: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🐰 Bunny Girl'}); } catch(e){ reply('❌ Error.'); } },
    bunnyear: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🐰 Bunny Ear'}); } catch(e){ reply('❌ Error.'); } },
    vampire: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🧛 Vampire'}); } catch(e){ reply('❌ Error.'); } },
    bikini: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👙 Bikini'}); } catch(e){ reply('❌ Error.'); } },
    nobra: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 No Bra'}); } catch(e){ reply('❌ Error.'); } },
    whitehair: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⬜ White Hair'}); } catch(e){ reply('❌ Error.'); } },
    blonde: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👱 Blonde'}); } catch(e){ reply('❌ Error.'); } },
    pinkhair: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Pink Hair'}); } catch(e){ reply('❌ Error.'); } },
    bed: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🛏️ Bed'}); } catch(e){ reply('❌ Error.'); } },
    ponytail: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Ponytail'}); } catch(e){ reply('❌ Error.'); } },
    nude: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Nude'}); } catch(e){ reply('❌ Error.'); } },
    dress: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👗 Dress'}); } catch(e){ reply('❌ Error.'); } },
    underwear: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🩲 Underwear'}); } catch(e){ reply('❌ Error.'); } },
    uniform: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👔 Uniform'}); } catch(e){ reply('❌ Error.'); } },
    foxgirl: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🦊 Fox Girl'}); } catch(e){ reply('❌ Error.'); } },
    skirt: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👗 Skirt'}); } catch(e){ reply('❌ Error.'); } },
    breast: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Breast'}); } catch(e){ reply('❌ Error.'); } },
    twintail: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🌸 Twin Tail'}); } catch(e){ reply('❌ Error.'); } },
    spreadpussy: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Spread Pussy'}); } catch(e){ reply('❌ Error.'); } },
    seethrough: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 See Through'}); } catch(e){ reply('❌ Error.'); } },
    breasthold: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Breast Hold'}); } catch(e){ reply('❌ Error.'); } },
    fateseries: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'⚔️ Fate Series'}); } catch(e){ reply('❌ Error.'); } },
    spreadlegs: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Spread Legs'}); } catch(e){ reply('❌ Error.'); } },
    openshirt: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'👕 Open Shirt'}); } catch(e){ reply('❌ Error.'); } },
    headband: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🎀 Headband'}); } catch(e){ reply('❌ Error.'); } },
    nipples: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Nipples'}); } catch(e){ reply('❌ Error.'); } },
    erectnipples: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🔞 Erect Nipples'}); } catch(e){ reply('❌ Error.'); } },
    greenhair: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'💚 Green Hair'}); } catch(e){ reply('❌ Error.'); } },
    wolfgirl: async ({ conn, jid, reply }) => { try { const r=await axios.get('https://api.waifu.pics/nsfw/waifu'); return conn.sendMessage(jid,{image:{url:r.data.url},caption:'🐺 Wolf Girl'}); } catch(e){ reply('❌ Error.'); } },

};

module.exports = animeCommands;
