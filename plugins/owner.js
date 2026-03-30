// ─────────────────────────────────────────────
//  owner.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────
const axios = require('axios');

const secretvCard = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
  message: {
    contactMessage: {
      displayName: 'Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ',
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ\nORG:Sʜᴀᴠɪʏᴀ Tᴇᴄʜ;\nTEL;type=CELL;type=VOICE;waid=94707085822:+94707085822\nEND:VCARD`
    }
  }
};

module.exports = {
  name: 'owner',
  command: ['owner', 'dev', 'developer'],

  async execute({ socket, msg, sender, config }) {
    try {
      const ownerNumber = (config.OWNER_NUMBER || '94707085822').replace(/[^0-9]/g, '');
      const ownerName   = config.OWNER_NAME || 'Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ';

      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nTEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\nEND:VCARD`;

      // 1. vCard contact
      await socket.sendMessage(sender, {
        contacts: { displayName: ownerName, contacts: [{ vcard }] }
      });

      // 2. Owner info image
      await socket.sendMessage(sender, {
        image: { url: config.IMAGE_PATH },
        caption: `╭━━━〔 *🤵 OWNER INFO* 〕━━━⬣
┃
┃ 👤 *Name* : ${ownerName}
┃ 📱 *Number* : +${ownerNumber}
┃ 🤖 *Bot* : Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
┃ 🌀 *Version* : ${config.BOT_VERSION || '1.0.0'}
┃
╰━━━━━━━━━━━━━━━━━━━━━⬣
> © ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ 💎`,
        contextInfo: {
          mentionedJid: [`${ownerNumber}@s.whatsapp.net`],
          forwardingScore: 999, isForwarded: false
        }
      }, { quoted: secretvCard });

      // 3. Voice note
      try {
        const res = await axios.get('https://files.catbox.moe/0l6o8f.mp3', {
          responseType: 'arraybuffer', timeout: 30000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        await socket.sendMessage(sender, {
          audio: Buffer.from(res.data),
          mimetype: 'audio/mpeg',
          ptt: true
        }, { quoted: msg });
      } catch (e) {
        console.log('[OWNER] Voice note skipped:', e.message);
      }

    } catch (e) {
      console.error('owner error:', e);
    }
  }
};
