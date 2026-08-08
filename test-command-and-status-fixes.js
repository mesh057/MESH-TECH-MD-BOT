const assert = require('assert');
const fs = require('fs');
const path = require('path');
const statusCommand = require('./commands/status');
const vvSource = fs.readFileSync(path.join(__dirname, 'commands', 'vv.js'), 'utf8');

const indexSource = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');

// Verify the dispatcher handles the message wrappers used by private chats and groups.
assert(indexSource.includes('msg.message?.ephemeralMessage?.message'), 'ephemeral messages are not unwrapped');
assert(indexSource.includes('msg.message?.viewOnceMessage?.message'), 'view-once messages are not unwrapped');
assert(indexSource.includes('messageContent.extendedTextMessage?.text'), 'extended text is not read from the unwrapped message');
assert(indexSource.includes('split(/\\s+/)'), 'command arguments are not parsed robustly');
assert(indexSource.includes('case \'song\''), 'command switch is missing');

// Verify the status reaction uses the status broadcast JID and recipient list.
assert(indexSource.includes("this.sock.sendMessage(from, {\n                                        react"), 'status reactions are not sent to the status JID');
assert(indexSource.includes('statusJidList'), 'statusJidList is missing from the reaction options');
assert(indexSource.includes('statusAuthor'), 'status author is not included in the reaction recipient list');
assert(vvSource.includes('viewOnceMessageV2Extension'), 'view-once V2 extension wrapper is not supported');
assert(vvSource.includes('content.ephemeralMessage'), 'ephemeral view-once wrapper is not supported');
assert(vvSource.includes('documentMessage'), 'view-once documents are not supported');

(async () => {
    const sent = [];
    const sock = {
        sendMessage: async (...args) => { sent.push(args); },
    };
    const botData = { statusSettings: {} };
    const saveBotData = () => {};
    const msg = { key: { remoteJid: '123@s.whatsapp.net' } };

    await statusCommand(sock, msg.key.remoteJid, msg, true, botData, saveBotData, 'bot-session', ['like', 'on']);
    assert.strictEqual(botData.statusSettings['bot-session'].autoLike, true);
    assert.strictEqual(botData.statusSettings['bot-session'].autoStatus, true);
    assert.match(sent[0][1].text, /Auto Like: ON/);

    console.log('Command and status auto-like smoke tests passed.');
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

function extractCommand(message) {
    const content = message?.ephemeralMessage?.message || message?.viewOnceMessage?.message || message;
    const body = (content?.conversation || content?.extendedTextMessage?.text || '').trim();
    const parts = /^\./.test(body) ? body.slice(1).trim().split(/\s+/) : [];
    return { command: (parts.shift() || '').toLowerCase(), args: parts };
}

assert.deepStrictEqual(extractCommand({ conversation: '.ping' }), { command: 'ping', args: [] });
assert.deepStrictEqual(extractCommand({ ephemeralMessage: { message: { extendedTextMessage: { text: '.status like on' } } } }), { command: 'status', args: ['like', 'on'] });
assert.deepStrictEqual(extractCommand({ viewOnceMessage: { message: { conversation: '.menu' } } }), { command: 'menu', args: [] });
console.log('Wrapped DM/group command extraction tests passed.');
