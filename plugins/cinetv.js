// ─────────────────────────────────────────────
//  cinetv.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
//  Movie + TV Series downloader (CineSubz)
// ─────────────────────────────────────────────
const axios  = require('axios');
const sharp  = require('sharp');

const API_KEY  = 'edbcfabbca5a9750';
const BASE_URL = 'https://api-dark-shan-yt.koyeb.app';
const FOOTER   = '> © ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ 💎';
const THUMB    = 'https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg';

async function makeThumbnail(url) {
  try {
    const img = await axios.get(url || THUMB, { responseType: 'arraybuffer', timeout: 15000 });
    return await sharp(img.data).resize(300).jpeg({ quality: 65 }).toBuffer();
  } catch { return null; }
}

function waitReply(socket, sender, targetId, timeout = 600000) {
  return new Promise((resolve) => {
    let done = false;
    const h = (update) => {
      const m = update.messages[0];
      if (!m?.message) return;
      const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
      const isReply = m.message.extendedTextMessage?.contextInfo?.stanzaId === targetId;
      if (m.key.remoteJid === sender && isReply && !isNaN(text) && text !== '') {
        if (done) return; done = true;
        socket.ev.off('messages.upsert', h);
        resolve({ msg: m, text: text.trim() });
      }
    };
    socket.ev.on('messages.upsert', h);
    setTimeout(() => { if (done) return; socket.ev.off('messages.upsert', h); resolve(null); }, timeout);
  });
}

async function resolveDownloadLink(dlUrl) {
  try {
    const res   = await axios.get(`${BASE_URL}/movie/cinesubz-download?url=${encodeURIComponent(dlUrl)}&apikey=${API_KEY}`);
    const links = res.data?.data?.download || [];
    const pix   = links.find(d => d.name?.toLowerCase().includes('pix'));
    if (pix) {
      const id = pix.url.split('/').pop().split('?')[0];
      return { url: `https://pixeldrain.com/api/file/${id}?download`, mimetype: 'video/mp4' };
    }
    const direct = links.find(d => {
      const n = d.name?.toLowerCase() || '';
      return (n === 'unknown' || n === '') && d.url?.startsWith('http') && !d.url.includes('t.me');
    });
    if (direct) return { url: direct.url, mimetype: 'video/mp4' };
    return null;
  } catch { return null; }
}

module.exports = {
  name: 'cinetv',
  command: ['cinetv', 'tvseries', 'series'],

  async execute({ socket, msg, args, sender }) {
    try {
      const q = args.join(' ').trim();
      if (!q) return socket.sendMessage(sender, {
        text: `🎬 *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ Movie & TV*\n\nUsage: .cinetv <name>\nExample: .cinetv game of thrones\n\n${FOOTER}`
      }, { quoted: msg });

      await socket.sendMessage(sender, { react: { text: '🔍', key: msg.key } });

      const searchRes = await axios.get(`${BASE_URL}/movie/cinesubz-search?q=${encodeURIComponent(q)}&apikey=${API_KEY}`);
      const results = searchRes.data?.data;
      if (!results?.length) return socket.sendMessage(sender, { text: `❌ No results found for: ${q}` }, { quoted: msg });

      let listText = `🎬 *SEARCH RESULTS*\n🔍 *Query:* ${q}\n\n`;
      results.slice(0, 15).forEach((v, i) => {
        listText += `*${i + 1}.* ${v.type === 'tvshows' ? '📺' : '🎬'} *${v.title}*\n`;
      });
      listText += `\n📝 Reply with number\n${FOOTER}`;

      const sentSearch = await socket.sendMessage(sender, { text: listText }, { quoted: msg });
      const sel1 = await waitReply(socket, sender, sentSearch.key.id);
      if (!sel1) return;

      const selected = results[parseInt(sel1.text) - 1];
      if (!selected) return socket.sendMessage(sender, { text: '❌ Invalid selection.' }, { quoted: sel1.msg });
      await socket.sendMessage(sender, { react: { text: '⏳', key: sel1.msg.key } });

      if (selected.type === 'tvshows') {
        // ── TV SERIES ──
        const tvRes = await axios.get(`${BASE_URL}/tv/cinesubz-info?url=${encodeURIComponent(selected.link)}&apikey=${API_KEY}`);
        const tv = tvRes.data.data;

        let seasonText = `📺 *${tv.title}*\n📅 ${tv.year || 'N/A'} | ⭐ ${tv.rating || 'N/A'}\n\n*Select Season:*\n`;
        tv.seasons.forEach((s, i) => { seasonText += `\n${i + 1}. Season ${s.s_no} (${s.episodes?.length || 0} eps)`; });
        seasonText += `\n\n${FOOTER}`;

        const sentSeason = await socket.sendMessage(sender, {
          image: { url: tv.image || THUMB }, caption: seasonText
        }, { quoted: sel1.msg });

        const selSeason = await waitReply(socket, sender, sentSeason.key.id);
        if (!selSeason) return;
        const chosenSeason = tv.seasons[parseInt(selSeason.text) - 1];
        if (!chosenSeason) return;

        let epText = `📺 *${tv.title}*\n🎬 *Season ${chosenSeason.s_no}*\n\n*Select Episode:*\n\n0. 🎬 DOWNLOAD ALL`;
        chosenSeason.episodes.forEach((ep, i) => { epText += `\n${i + 1}. Episode ${ep.e_no}`; });
        epText += `\n\n${FOOTER}`;

        const sentEp = await socket.sendMessage(sender, { text: epText }, { quoted: selSeason.msg });
        const selEp  = await waitReply(socket, sender, sentEp.key.id);
        if (!selEp) return;

        const epNum = parseInt(selEp.text);
        await socket.sendMessage(sender, { react: { text: '📥', key: selEp.msg.key } });

        if (epNum === 0) {
          // Download all episodes — get quality from first ep
          const firstEpInfo = await axios.get(`${BASE_URL}/episode/cinesubz-info?url=${encodeURIComponent(chosenSeason.episodes[0].link)}&apikey=${API_KEY}`);
          const dlLinks = firstEpInfo.data.data.download;
          let qualText = `📺 *${tv.title}* S${chosenSeason.s_no}\n\n*Select Quality for ALL:*\n`;
          dlLinks.forEach((d, i) => { qualText += `\n${i + 1}. ${d.quality} ${d.size ? `(${d.size})` : ''}`; });
          const sentQual = await socket.sendMessage(sender, { text: qualText }, { quoted: selEp.msg });
          const selQ = await waitReply(socket, sender, sentQual.key.id);
          if (!selQ) return;
          const qIdx = parseInt(selQ.text) - 1;

          for (const ep of chosenSeason.episodes) {
            try {
              const epI = await axios.get(`${BASE_URL}/episode/cinesubz-info?url=${encodeURIComponent(ep.link)}&apikey=${API_KEY}`);
              const dl  = epI.data.data.download[qIdx] || epI.data.data.download[0];
              const dlResult = await resolveDownloadLink(dl.link);
              if (!dlResult) continue;
              const thumb = await makeThumbnail(tv.image);
              await socket.sendMessage(sender, {
                document: { url: dlResult.url },
                fileName: `${tv.title} S${chosenSeason.s_no}E${ep.e_no} (${dl.quality}).mp4`.replace(/[/\\:*?"<>|]/g, ''),
                mimetype: 'video/mp4', jpegThumbnail: thumb || undefined,
                caption: `📺 *${tv.title}* S${chosenSeason.s_no} E${ep.e_no}\n💎 ${dl.quality}\n${FOOTER}`
              });
            } catch (err) { console.log(`[CINETV] E${ep.e_no} failed:`, err.message); }
          }
          await socket.sendMessage(sender, { text: `✅ All episodes done!\n\n📺 *${tv.title}* S${chosenSeason.s_no}\n${FOOTER}` }, { quoted: selQ.msg });

        } else {
          const selectedEp = chosenSeason.episodes[epNum - 1];
          if (!selectedEp) return;
          const epI = await axios.get(`${BASE_URL}/episode/cinesubz-info?url=${encodeURIComponent(selectedEp.link)}&apikey=${API_KEY}`);
          const dlLinks = epI.data.data.download;
          let qualText = `📺 *${tv.title}* S${chosenSeason.s_no} E${selectedEp.e_no}\n\n*Select Quality:*\n`;
          dlLinks.forEach((d, i) => { qualText += `\n${i + 1}. ${d.quality} ${d.size ? `(${d.size})` : ''}`; });
          const sentQ2 = await socket.sendMessage(sender, { text: qualText }, { quoted: selEp.msg });
          const selQ2  = await waitReply(socket, sender, sentQ2.key.id);
          if (!selQ2) return;
          const chosen = dlLinks[parseInt(selQ2.text) - 1];
          if (!chosen) return;
          await socket.sendMessage(sender, { react: { text: '📥', key: selQ2.msg.key } });
          const dlResult = await resolveDownloadLink(chosen.link);
          if (!dlResult) return socket.sendMessage(sender, { text: '❌ No download link found.' });
          const thumb = await makeThumbnail(tv.image);
          const docMsg = await socket.sendMessage(sender, {
            document: { url: dlResult.url },
            fileName: `${tv.title} S${chosenSeason.s_no}E${selectedEp.e_no} (${chosen.quality}).mp4`.replace(/[/\\:*?"<>|]/g, ''),
            mimetype: 'video/mp4', jpegThumbnail: thumb || undefined,
            caption: `📺 *${tv.title}* S${chosenSeason.s_no} E${selectedEp.e_no}\n💎 ${chosen.quality}\n${FOOTER}`
          }, { quoted: selQ2.msg });
          await socket.sendMessage(sender, { react: { text: '✅', key: docMsg.key } });
        }

      } else {
        // ── MOVIE ──
        const movieRes = await axios.get(`${BASE_URL}/movie/cinesubz-info?url=${encodeURIComponent(selected.link)}&apikey=${API_KEY}`);
        const movie = movieRes.data.data;
        let qualText = `🎬 *${movie.title}*\n\n📥 *Select Quality:*\n`;
        movie.download.forEach((d, i) => { qualText += `\n${i + 1}. *${d.quality}* ${d.size ? `(${d.size})` : ''}`; });
        qualText += `\n\n${FOOTER}`;

        const sentQ = await socket.sendMessage(sender, {
          image: { url: movie.image || THUMB }, caption: qualText
        }, { quoted: sel1.msg });

        const selQ = await waitReply(socket, sender, sentQ.key.id);
        if (!selQ) return;
        const chosen = movie.download[parseInt(selQ.text) - 1];
        if (!chosen) return socket.sendMessage(sender, { text: '❌ Invalid choice.' });

        await socket.sendMessage(sender, { react: { text: '📥', key: selQ.msg.key } });
        const dlResult = await resolveDownloadLink(chosen.link);
        if (!dlResult) return socket.sendMessage(sender, { text: '❌ No download link found.' });

        const thumb = await makeThumbnail(movie.image);
        const docMsg = await socket.sendMessage(sender, {
          document: { url: dlResult.url },
          fileName: `${movie.title} (${chosen.quality}).mp4`.replace(/[/\\:*?"<>|]/g, ''),
          mimetype: 'video/mp4', jpegThumbnail: thumb || undefined,
          caption: `🎬 *${movie.title}*\n💎 *Quality:* ${chosen.quality}\n${FOOTER}`
        }, { quoted: selQ.msg });
        await socket.sendMessage(sender, { react: { text: '✅', key: docMsg.key } });
      }

    } catch (e) {
      console.error('cinetv error:', e);
      await socket.sendMessage(sender, { text: `❌ Error: ${e.message}` });
    }
  }
};
