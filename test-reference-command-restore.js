const core = require('./menu/core');
const menu = require('./media/menu');
const required = [
  'self', 'public', 'leave', 'numinfo', 'idcheck', 'song', 'song2', 'video', 'video2',
  'ytmp3', 'ytmp4', 'insta', 'fb', 'img', 'autogreet', 'autoread', 'waifu', 'luffy'
];
const missing = required.filter((name) => typeof core[name] !== 'function');
if (missing.length) throw new Error(`Missing handlers: ${missing.join(', ')}`);
const text = menu.getMenu('Africa/Nairobi', 3, {
  commandsLoaded: Object.keys(core).length,
  menuCount: Object.keys(menu.menuNames).length,
  activeBots: 2
});
for (const token of ['𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗘𝗠𝗢𝗝𝗜 𝗟𝗘𝗚𝗘𝗡𝗗', '🐦‍🔥', '୧⍤⃝💐', '🪼']) {
  if (!text.includes(token)) throw new Error(`Missing menu token: ${token}`);
}
console.log(JSON.stringify({ coreCommands: Object.keys(core).length, menus: Object.keys(menu.menuNames).length, checks: 'passed' }));
