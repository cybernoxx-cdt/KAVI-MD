// ─────────────────────────────────────────────
//  alive.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────
const os = require('os');
const axios = require('axios');
const moment = require('moment-timezone');

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
  name: 'alive',
  command: ['alive', 'online', 'status', 'a'],

  async execute({ socket, msg, sender, config }) {
    try {
      const pushname = msg.pushName || 'User';
      const date = moment().tz('Asia/Colombo').format('YYYY-MM-DD');
      const time = moment().tz('Asia/Colombo').format('HH:mm:ss');
      const hour = moment().tz('Asia/Colombo').hour();

      const greet =
        hour < 12 ? '🌄 සුභ උදෑසනක්!' :
        hour < 17 ? '🏞️ සුභ දහවලක්!' :
        hour < 20 ? '🌅 සුභ හැන්දෑවක්!' :
                    '🌌 සුභ රාත්‍රියක්!';

      const upSec = process.uptime();
      const h = Math.floor(upSec / 3600);
      const min = Math.floor((upSec % 3600) / 60);
      const sec = Math.floor(upSec % 60);
      const uptime = `${h}h ${min}m ${sec}s`;

      const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      const ramTotal = (os.totalmem() / 1024 / 1024).toFixed(2);

      const caption = `👋 *Hello ${pushname}!* ${greet}

*╭─〔 DATE & TIME 〕─◉*
*│* 📅 \`Date:\` ${date}
*│* ⏰ \`Time:\` ${time}
*╰────────────⊷*

*╭─〔 BOT STATUS 〕─◉*
*│*
*│* 🐼 \`Bot\`: Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
*│* 🤵 \`Owner\`: Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ
*│* 👤 \`User\`: ${pushname}
*│* 📟 \`Uptime\`: ${uptime}
*│* ⏳ \`Ram\`: ${ramUsed}MB / ${ramTotal}MB
*│* 🖊 \`Prefix\`: [ ${config.PREFIX} ]
*│* 🌀 \`Version\`: ${config.BOT_VERSION || '1.0.0'}
*╰────────────────⊷*

   ☘ ʙᴏᴛ ᴍᴇɴᴜ  - ${config.PREFIX}menu
   🔥 ʙᴏᴛ ꜱᴘᴇᴇᴅ - ${config.PREFIX}ping

> © ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ 💎`;

      await socket.sendMessage(sender, {
        image: { url: config.IMAGE_PATH },
        caption,
        contextInfo: { forwardingScore: 999, isForwarded: true }
      }, { quoted: msg });

      // Voice note
      try {
        const res = await axios.get('https://files.catbox.moe/w9r46m.mp3', {
          responseType: 'arraybuffer', timeout: 30000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        await socket.sendMessage(sender, {
          audio: Buffer.from(res.data),
          mimetype: 'audio/mpeg',
          ptt: true
        }, { quoted: fakevCard });
      } catch (e) {
        console.log('[ALIVE] Voice note skipped:', e.message);
      }

    } catch (e) {
      console.error('alive error:', e);
      await socket.sendMessage(sender, { text: `⚠️ Error: ${e.message}` });
    }
  }
};
