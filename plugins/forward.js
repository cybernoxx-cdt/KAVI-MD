// ─────────────────────────────────────────────
//  forward.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────
const { getContentType } = require('@whiskeysockets/baileys');
const { randomBytes } = require('crypto');
const genMsgId = () => randomBytes(10).toString('hex').toUpperCase();

function stripNulls(obj) {
  if (Array.isArray(obj)) return obj.map(stripNulls).filter(v => v != null);
  if (obj && typeof obj === 'object') {
    const clean = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v == null) continue;
      clean[k] = stripNulls(v);
    }
    return clean;
  }
  return obj;
}

module.exports = {
  name: 'forward',
  command: ['forward', 'fw', 'fwd'],

  async execute({ socket, msg, args, sender }) {
    try {
      const ctx    = msg.message?.extendedTextMessage?.contextInfo;
      let quoted   = ctx?.quotedMessage;

      if (!quoted) return socket.sendMessage(sender, {
        text: `📤 *Forward Usage*\n\nReply to a message then type *.forward*\n\n✅ Custom JID: *.forward 120363382037700734@g.us*\n✅ Multiple (max 20): *.forward jid1,jid2*\n✅ No JID = current chat`
      }, { quoted: msg });

      let targets = [];
      const q = args.join(' ').trim();
      if (q) {
        targets = q.split(',').map(j => j.trim()).filter(Boolean).slice(0, 20);
      }
      if (!targets.length) targets = [sender];

      await socket.sendMessage(sender, { react: { text: '⏳', key: msg.key } });

      // Unwrap view once
      if (quoted.viewOnceMessageV2) quoted = quoted.viewOnceMessageV2.message;
      else if (quoted.viewOnceMessage) quoted = quoted.viewOnceMessage.message;

      let messageToForward = stripNulls(JSON.parse(JSON.stringify(quoted)));
      let mType = getContentType(messageToForward);
      if (!mType) throw new Error('Cannot detect message type.');

      if (mType === 'conversation') {
        messageToForward = { extendedTextMessage: { text: String(messageToForward.conversation) } };
        mType = 'extendedTextMessage';
      }

      if (messageToForward[mType] && typeof messageToForward[mType] === 'object') {
        messageToForward[mType].contextInfo = {
          ...(messageToForward[mType].contextInfo || {}),
          forwardingScore: 999, isForwarded: true
        };
      }

      let success = 0, failed = 0;
      for (const jid of targets) {
        try {
          await socket.relayMessage(String(jid), messageToForward, { messageId: genMsgId() });
          success++;
        } catch (err) {
          console.error(`[FORWARD] ${jid}:`, err.message);
          failed++;
        }
      }

      await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
      if (targets.length > 1)
        await socket.sendMessage(sender, { text: `✅ *Forward done!*\n\n📤 Success: ${success}/${targets.length}\n❌ Failed: ${failed}` });

    } catch (e) {
      console.error('forward error:', e);
      await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } });
      await socket.sendMessage(sender, { text: `❌ Forward failed: ${e.message}` });
    }
  }
};
