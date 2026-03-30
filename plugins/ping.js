// ─────────────────────────────────────────────
//  ping.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────

const fakevCard = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: {
    contactMessage: {
      displayName: 'Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ',
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ\nORG:Sʜᴀᴠɪʏᴀ Tᴇᴄʜ;\nTEL;type=CELL;type=VOICE;waid=94707085822:+94707085822\nEND:VCARD`
    }
  }
};

module.exports = {
  name: 'ping',
  command: ['ping', 'pong', 'speed', 'ping2'],

  async execute({ socket, msg, sender }) {
    try {
      const start = Date.now();

      const emojis = ['🔥','⚡','🚀','💨','🎯','🌟','💥','💎','🏆','✨'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      await socket.sendMessage(sender, { react: { text: emoji, key: msg.key } });

      const ping = Date.now() - start;

      let badge = '🐢 Sʟᴏᴡ', color = '🔴';
      if (ping <= 150)      { badge = '🚀 Sᴜᴘᴇʀ Fᴀꜱᴛ'; color = '🟢'; }
      else if (ping <= 300) { badge = '⚡ Fᴀꜱᴛ';        color = '🟡'; }
      else if (ping <= 600) { badge = '⚠️ Mᴇᴅɪᴜᴍ';      color = '🟠'; }

      await socket.sendMessage(sender, {
        text: `> *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ ʀᴇꜱᴘᴏɴꜱᴇ: ${ping} ms ${emoji}*\n> *ꜱᴛᴀᴛᴜꜱ: ${color} ${badge}*\n> *ᴠᴇʀꜱɪᴏɴ: 1.0.0*`,
        contextInfo: {
          forwardingScore: 999, isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363405871120956@newsletter',
            newsletterName: 'Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ',
            serverMessageId: 143
          }
        }
      }, { quoted: fakevCard });

    } catch (e) {
      console.error('ping error:', e);
      await socket.sendMessage(sender, { text: `⚠️ Error: ${e.message}` });
    }
  }
};
