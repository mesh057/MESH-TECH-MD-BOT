const assert = require('assert');
const statusCommand = require('./commands/status');
const { getMenu, getStatusBox } = require('./media/menu');
const { getCommandMetrics } = require('./lib/menuHandler');

(async () => {
  const sent = [];
  const sock = {
    sendMessage: async (...args) => { sent.push(args); },
    sendPresenceUpdate: async () => {}
  };
  const botData = { statusSettings: {}, presenceSettings: {} };
  const saveBotData = () => {};
  const msg = { key: { remoteJid: '254700000000@s.whatsapp.net', id: 'test' } };
  const send = async (args) => statusCommand(sock, msg.key.remoteJid, msg, true, botData, saveBotData, 'bot-session', args);

  await send(['like', 'on']);
  await send(['seen', 'on']);
  await send(['reply', 'on', 'Thanks for sharing']);
  await send(['online', 'on']);
  assert.strictEqual(botData.statusSettings['bot-session'].autoLike, true);
  assert.strictEqual(botData.statusSettings['bot-session'].autoSeen, true);
  assert.strictEqual(botData.statusSettings['bot-session'].autoReply, true);
  assert.strictEqual(botData.statusSettings['bot-session'].replyText, 'Thanks for sharing');
  assert.strictEqual(botData.presenceSettings['bot-session'].alwaysOnline, true);

  const metrics = getCommandMetrics(3);
  assert(metrics.commandsLoaded > 0);
  assert(metrics.menuCount > 0);
  assert.strictEqual(metrics.activeBots, 3);
  const statusBox = getStatusBox('Africa/Nairobi', 7, metrics);
  assert(statusBox.includes(`${metrics.commandsLoaded} 𝗟𝗼𝗮𝗱𝗲𝗱`));
  assert(statusBox.includes('3 Connected'));
  assert(getMenu('Africa/Nairobi', 7, metrics).includes('𝗠𝗘𝗦𝗛-𝗧𝗘𝗖𝗛 𝗠𝗗 𝗕𝗢𝗧'));
  console.log('Requested feature smoke tests passed.');
})();
