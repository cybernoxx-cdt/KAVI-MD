// ─────────────────────────────────────────────
//  getpp.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────

module.exports = {
  name: 'getpp',
  command: ['getpp', 'dp', 'profilepic'],

  async execute({ socket, msg, args, sender, isOwner }) {
    try {
      if (!isOwner) return socket.sendMessage(sender, { text: '🛑 Owner only!' }, { quoted: msg });

      const input = args[0];
      if (!input) return socket.sendMessage(sender, {
        text: `📱 Usage: .getpp 947XXXXXXXX`
      }, { quoted: msg });

      const cleanNumber = input.replace(/[^0-9]/g, '');
      if (cleanNumber.length < 5 || cleanNumber.length > 15)
        return socket.sendMessage(sender, { text: '❌ Invalid phone number!' }, { quoted: msg });

      const targetJid = `${cleanNumber}@s.whatsapp.net`;

      let ppUrl;
      try {
        ppUrl = await socket.profilePictureUrl(targetJid, 'image');
      } catch {
        return socket.sendMessage(sender, {
          text: '🖼️ No profile picture or privacy restricted!'
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        image: { url: ppUrl },
        caption: `✅ *Profile Picture*\n\n👤 Number: +${cleanNumber}`
      }, { quoted: msg });

    } catch (e) {
      console.error('getpp error:', e);
      await socket.sendMessage(sender, { text: `🛑 Error: ${e.message}` });
    }
  }
};
