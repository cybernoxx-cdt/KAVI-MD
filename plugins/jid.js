// ─────────────────────────────────────────────
//  jid.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────

module.exports = {
  name: 'jid',
  command: ['jid', 'chatid', 'groupid'],

  async execute({ socket, msg, sender }) {
    try {
      await socket.sendMessage(sender, { text: sender }, { quoted: msg });
    } catch (e) {
      console.error('jid error:', e);
      await socket.sendMessage(sender, { text: '❌ Error fetching JID' });
    }
  }
};
