// ─────────────────────────────────────────────
//  ytsong.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────
const axios = require('axios');
const yts   = require('yt-search');

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
  name: 'song',
  command: ['song', 'play', 'ytmp3'],

  async execute({ socket, msg, args, sender }) {
    try {
      let query = args.join(' ').trim();

      // Check if reply has text
      const quotedText =
        msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||
        msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
      if (!query && quotedText) query = quotedText;

      if (!query) return socket.sendMessage(sender, {
        text: '⚠️ Please provide a song name or YouTube link.\nExample: .song Shape of You'
      }, { quoted: msg });

      if (query.includes('youtube.com/shorts/')) {
        const id = query.split('/shorts/')[1].split(/[?&]/)[0];
        query = `https://www.youtube.com/watch?v=${id}`;
      }

      await socket.sendMessage(sender, { react: { text: '🎵', key: msg.key } });

      const search = await yts(query);
      if (!search.videos.length) return socket.sendMessage(sender, { text: '❌ Song not found.' }, { quoted: msg });

      const video = search.videos[0];

      const api = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${encodeURIComponent(video.url)}`;
      const { data } = await axios.get(api);
      if (!data?.status || !data?.data?.url)
        return socket.sendMessage(sender, { text: '*❌ Download error*' }, { quoted: msg });

      const songUrl = data.data.url;

      const sentMsg = await socket.sendMessage(sender, {
        image: { url: video.thumbnail },
        caption: `🎶 *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ SONG* 🎶

📑 *Title:* ${video.title}
⏱ *Duration:* ${video.timestamp}
📆 *Uploaded:* ${video.ago}
👁 *Views:* ${video.views}

🔽 *Reply with your choice:*

1️⃣ Audio 🎵
2️⃣ Document 📁

> © ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ 💎`
      }, { quoted: fakevCard });

      const messageID = sentMsg.key.id;

      // Reply listener
      const handler = async (update) => {
        const receivedMsg = update.messages[0];
        if (!receivedMsg?.message) return;
        const text     = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
        const isReply  = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
        const replyJid = receivedMsg.key.remoteJid;
        if (!isReply || replyJid !== sender) return;

        await socket.sendMessage(sender, { react: { text: '⬇️', key: receivedMsg.key } });

        if (text?.trim() === '1') {
          await socket.sendMessage(sender, { audio: { url: songUrl }, mimetype: 'audio/mpeg' }, { quoted: receivedMsg });
          await socket.sendMessage(sender, { react: { text: '✔️', key: receivedMsg.key } });
        } else if (text?.trim() === '2') {
          const buf = await axios.get(songUrl, { responseType: 'arraybuffer' });
          await socket.sendMessage(sender, {
            document: Buffer.from(buf.data),
            mimetype: 'audio/mpeg',
            fileName: `${video.title.replace(/[\\/:*?"<>|]/g, '')}.mp3`
          }, { quoted: receivedMsg });
          await socket.sendMessage(sender, { react: { text: '✔️', key: receivedMsg.key } });
        } else {
          await socket.sendMessage(sender, { react: { text: '😒', key: receivedMsg.key } });
        }
      };

      socket.ev.on('messages.upsert', handler);
      setTimeout(() => socket.ev.off('messages.upsert', handler), 300000); // 5 min timeout

    } catch (e) {
      console.error('song error:', e);
      await socket.sendMessage(sender, { text: `❌ Error: ${e.message}` });
    }
  }
};
