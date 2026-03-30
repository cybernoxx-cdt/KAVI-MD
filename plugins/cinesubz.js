// ─────────────────────────────────────────────
//  cinesubz.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────
const axios = require('axios');
const sharp = require('sharp');

const API_KEY  = 'edbcfabbca5a9750';
const BASE_URL = 'https://api-dark-shan-yt.koyeb.app';
const FOOTER   = '> © ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ 💎';
const THUMB_URL = 'https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg';

async function makeThumbnail(posterUrl) {
  try {
    const url = posterUrl || THUMB_URL;
    const img = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    return await sharp(img.data).resize(300).jpeg({ quality: 65 }).toBuffer();
  } catch { return null; }
}

function waitReply(socket, sender, targetId, timeout = 120000) {
  return new Promise((resolve) => {
    let done = false;
    const handler = (update) => {
      const m = update.messages[0];
      if (!m?.message) return;
      const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
      const isReply = m.message.extendedTextMessage?.contextInfo?.stanzaId === targetId;
      if (m.key.remoteJid === sender && isReply && !isNaN(text) && text !== '') {
        if (done) return;
        done = true;
        socket.ev.off('messages.upsert', handler);
        resolve({ msg: m, text: text.trim() });
      }
    };
    socket.ev.on('messages.upsert', handler);
    setTimeout(() => {
      if (done) return;
      socket.ev.off('messages.upsert', handler);
      resolve(null);
    }, timeout);
  });
}

module.exports = {
  name: 'cinesubz',
  command: ['cinesubz', 'movie', 'film'],

  async execute({ socket, msg, args, sender }) {
    try {
      const q = args.join(' ').trim();
      if (!q) return socket.sendMessage(sender, {
        text: `🎬 *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ Movie*\n\nUsage: .cinesubz <movie name>\nExample: .cinesubz Avengers\n\n${FOOTER}`
      }, { quoted: msg });

      await socket.sendMessage(sender, { react: { text: '🔍', key: msg.key } });

      const searchRes = await axios.get(`${BASE_URL}/movie/cinesubz-search?q=${encodeURIComponent(q)}&apikey=${API_KEY}`);
      const results = searchRes.data?.data;
      if (!results?.length) return socket.sendMessage(sender, { text: `❌ No results found for: ${q}` }, { quoted: msg });

      let listText = `🎬 *SEARCH RESULTS*\n🔍 *Query:* ${q}\n\n`;
      results.slice(0, 15).forEach((v, i) => {
        const icon = v.type === 'tvshows' ? '📺' : '🎬';
        listText += `*${i + 1}.* ${icon} ${v.title}\n`;
      });
      listText += `\n📝 Reply with number\n${FOOTER}`;

      const sentSearch = await socket.sendMessage(sender, { text: listText }, { quoted: msg });

      const sel1 = await waitReply(socket, sender, sentSearch.key.id, 120000);
      if (!sel1) return;

      const idx = parseInt(sel1.text) - 1;
      const selected = results[idx];
      if (!selected) return socket.sendMessage(sender, { text: '❌ Invalid selection.' }, { quoted: sel1.msg });

      await socket.sendMessage(sender, { react: { text: '⏳', key: sel1.msg.key } });

      const infoRes = await axios.get(`${BASE_URL}/movie/cinesubz-info?url=${encodeURIComponent(selected.link)}&apikey=${API_KEY}`);
      const info = infoRes.data?.data;
      if (!info) return socket.sendMessage(sender, { text: '❌ Failed to get movie info.' }, { quoted: sel1.msg });

      let infoText = `🎬 *${info.title}*\n\n`;
      if (info.year)      infoText += `📅 *Year:* ${info.year}\n`;
      if (info.rating)    infoText += `⭐ *Rating:* ${info.rating}\n`;
      if (info.duration)  infoText += `⏱️ *Duration:* ${info.duration}\n`;
      if (info.country)   infoText += `🌍 *Country:* ${info.country}\n`;
      infoText += `\n*Available Qualities:*`;
      info.downloads.forEach((d, i) => { infoText += `\n*${i + 1}.* ${d.quality} ${d.size ? `(${d.size})` : ''}`; });
      infoText += `\n\n📝 Reply with download number\n${FOOTER}`;

      const sentInfo = await socket.sendMessage(sender, {
        image: { url: info.image || THUMB_URL }, caption: infoText
      }, { quoted: sel1.msg });

      const sel2 = await waitReply(socket, sender, sentInfo.key.id, 120000);
      if (!sel2) return;

      const dIdx = parseInt(sel2.text) - 1;
      const chosen = info.downloads[dIdx];
      if (!chosen) return socket.sendMessage(sender, { text: '❌ Invalid download number.' }, { quoted: sel2.msg });

      await socket.sendMessage(sender, { react: { text: '⬇️', key: sel2.msg.key } });

      const dlRes = await axios.get(`${BASE_URL}/movie/cinesubz-download?url=${encodeURIComponent(chosen.link)}&apikey=${API_KEY}`);
      const links = dlRes.data?.data?.download || [];

      const pix = links.find(v => v.name?.toLowerCase() === 'pix');
      const direct = links.find(v => v.name?.toLowerCase() === 'unknown' || (v.url?.startsWith('http') && !v.url?.includes('t.me')));
      const selected_link = pix || direct;

      if (!selected_link) return socket.sendMessage(sender, { text: '❌ No downloadable link found.' }, { quoted: sel2.msg });

      const thumb = await makeThumbnail(info.image);
      const caption = `🎬 *${info.title}*\n💎 *Quality:* ${chosen.quality}\n\n${FOOTER}`;

      const docMsg = await socket.sendMessage(sender, {
        document: { url: selected_link.url },
        fileName: `${info.title} (${chosen.quality}).mp4`.replace(/[/\\:*?"<>|]/g, ''),
        mimetype: 'video/mp4',
        jpegThumbnail: thumb || undefined,
        caption
      }, { quoted: sel2.msg });

      await socket.sendMessage(sender, { react: { text: '✅', key: docMsg.key } });

    } catch (e) {
      console.error('cinesubz error:', e);
      await socket.sendMessage(sender, { text: `❌ Error: ${e.message}` });
    }
  }
};
