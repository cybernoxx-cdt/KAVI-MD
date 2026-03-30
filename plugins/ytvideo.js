// ─────────────────────────────────────────────
//  ytvideo.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────
const axios = require('axios');
const yts   = require('yt-search');
const fs    = require('fs');
const path  = require('path');

const API_KEY = 'darkshan-75704c1b';
const TEMP_DIR = path.resolve(__dirname, '../temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

function safeName(name, max = 60) {
  return String(name || 'Video').replace(/[<>:"/\\|?*\x00-\x1F]/g, '').slice(0, max);
}

module.exports = {
  name: 'video',
  command: ['video', 'ytv', 'ytdown'],

  async execute({ socket, msg, args, sender }) {
    try {
      const query = args.join(' ').trim();
      if (!query) return socket.sendMessage(sender, {
        text: '❌ Provide a video name or YouTube link.\nExample: .video Shape of You'
      }, { quoted: msg });

      await socket.sendMessage(sender, { react: { text: '🔍', key: msg.key } });

      let videoUrl = query;

      if (!query.includes('youtu.be') && !query.includes('youtube.com')) {
        const search = await yts(query);
        const results = search.videos.slice(0, 10);
        if (!results.length) return socket.sendMessage(sender, { text: '❌ No results found.' }, { quoted: msg });

        let listText = '🎬 *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ VIDEO SEARCH*\n\n';
        results.forEach((v, i) => { listText += `*${i + 1}.* ${v.title}\n⏱️ ${v.timestamp}\n\n`; });
        listText += `🔢 *Reply with number (1-${results.length})*\n\n> © ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ`;

        const sentSearch = await socket.sendMessage(sender, { text: listText }, { quoted: msg });

        const searchId = sentSearch.key.id;
        const searchHandler = async (update) => {
          const m2 = update.messages[0];
          if (!m2?.message) return;
          const t2 = m2.message.conversation || m2.message.extendedTextMessage?.text;
          const isReply = m2.message.extendedTextMessage?.contextInfo?.stanzaId === searchId;
          if (!isReply || m2.key.remoteJid !== sender) return;

          const idx = parseInt(t2) - 1;
          if (isNaN(idx) || !results[idx]) return;
          socket.ev.off('messages.upsert', searchHandler);

          await socket.sendMessage(sender, { react: { text: '⏳', key: m2.key } });
          await processDownload(socket, sender, results[idx].url, m2);
        };

        socket.ev.on('messages.upsert', searchHandler);
        setTimeout(() => socket.ev.off('messages.upsert', searchHandler), 300000);
      } else {
        await processDownload(socket, sender, videoUrl, msg);
      }

    } catch (e) {
      console.error('video error:', e);
      await socket.sendMessage(sender, { text: `❌ Error: ${e.message}` });
    }
  }
};

async function processDownload(socket, sender, url, quotedMsg) {
  try {
    const res  = await axios.get(`https://sayuradark-api-two.vercel.app/api/download/ytdl?apikey=${API_KEY}&url=${encodeURIComponent(url)}`);
    const data = res.data?.result;
    if (!data) return;

    const selectMsg = `🎬 *${data.title}*\n\n*Select quality:*\n\n📺 Video\n1. 720p | 2. 480p | 3. 360p\n\n📁 Document\n4. 720p | 5. 480p | 6. 360p\n\n> © ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ`;

    const sentSel = await socket.sendMessage(sender, { text: selectMsg }, { quoted: quotedMsg });
    const selId   = sentSel.key.id;

    const selHandler = async (update) => {
      const m3 = update.messages[0];
      if (!m3?.message) return;
      const t3 = (m3.message.conversation || m3.message.extendedTextMessage?.text || '').trim();
      const isReply = m3.message.extendedTextMessage?.contextInfo?.stanzaId === selId;
      if (!isReply || m3.key.remoteJid !== sender) return;

      const options = {
        '1': { url: data.mp4?.p720, q: '720p', doc: false },
        '2': { url: data.mp4?.p480, q: '480p', doc: false },
        '3': { url: data.mp4?.p360, q: '360p', doc: false },
        '4': { url: data.mp4?.p720, q: '720p', doc: true  },
        '5': { url: data.mp4?.p480, q: '480p', doc: true  },
        '6': { url: data.mp4?.p360, q: '360p', doc: true  }
      };
      if (!options[t3]) return;
      const { url: dlUrl, q: qual, doc: isDoc } = options[t3];
      if (!dlUrl) {
        await socket.sendMessage(sender, { react: { text: '❌', key: m3.key } });
        return;
      }
      socket.ev.off('messages.upsert', selHandler);

      await socket.sendMessage(sender, { react: { text: '📥', key: m3.key } });

      const videoPath = path.join(TEMP_DIR, `yt_${Date.now()}.mp4`);
      const response  = await axios({ method: 'get', url: dlUrl, responseType: 'stream' });
      const writer    = fs.createWriteStream(videoPath);
      response.data.pipe(writer);
      writer.on('finish', async () => {
        const sizeMB = (fs.statSync(videoPath).size / (1024 * 1024)).toFixed(2);
        const caption = `✅ *Download Complete*\n🎬 *Title:* ${data.title}\n💎 *Quality:* ${qual}\n💾 *Size:* ${sizeMB} MB\n\n> © ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ`;
        const mediaConfig = isDoc ? {
          document: fs.readFileSync(videoPath), mimetype: 'video/mp4',
          fileName: `${safeName(data.title)}_${qual}.mp4`, caption
        } : {
          video: fs.readFileSync(videoPath), mimetype: 'video/mp4', caption
        };
        await socket.sendMessage(sender, mediaConfig, { quoted: m3 });
        await socket.sendMessage(sender, { react: { text: '✅', key: m3.key } });
        try { fs.unlinkSync(videoPath); } catch {}
      });
    };

    socket.ev.on('messages.upsert', selHandler);
    setTimeout(() => socket.ev.off('messages.upsert', selHandler), 300000);

  } catch (e) {
    console.error('video download error:', e);
    await socket.sendMessage(sender, { text: `❌ Error: ${e.message}` });
  }
}
