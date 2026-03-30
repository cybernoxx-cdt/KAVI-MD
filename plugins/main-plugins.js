// ─────────────────────────────────────────────
//  main-plugins.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
//  ✅ Fixed: All commands as separate named exports in an array
// ─────────────────────────────────────────────

const moment = require("moment-timezone");
const config = require('../settings');
const axios = require("axios");
const os = require("os");

// ─── Shared bot data ───────────────────────────────────────────────────────
const BOT = {
  name: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
  owner: "Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ",
  ownerNum: "94707085822",
  image: "https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg",
  video: "https://files.catbox.moe/e3zmey.mp3",
  version: "1.0.0",
  footer: "> ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ",
  jid: "120363405871120956@newsletter",
  jidname: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
  channel: "https://whatsapp.com/channel/0029VbCG0yxEwEk21tFzPT16",
  pairlink: "https://kavi-md-a2ac26a5c95b.herokuapp.com",
  alivemsg: "✨ *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ* ɪꜱ ᴏɴʟɪɴᴇ ᴀɴᴅ ʀᴇᴀᴅʏ! 🚀"
};

// ─── Fake vCard quoted style ────────────────────────────────────────────────
function makeShala(botName) {
  return {
    key: {
      remoteJid: "status@broadcast",
      participant: "0@s.whatsapp.net",
      fromMe: false,
      id: "META_AI_SYSTEM"
    },
    message: {
      contactMessage: {
        displayName: botName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${botName};;;;\nFN:${botName}\nORG:Meta Platforms\nTEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002\nEND:VCARD`
      }
    }
  };
}

// ─── RAM / Uptime helpers ───────────────────────────────────────────────────
function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}ʜ ${m}ᴍ ${s}ꜱ`;
}

function formatBytes(bytes) {
  if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + " GB";
  if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
  return bytes + " B";
}

// ═══════════════════════════════════════════════════════════════════════════
//  CASE 1 — PING
// ═══════════════════════════════════════════════════════════════════════════
const pingPlugin = {
  name: "ping",
  command: ["ping", "pong", "speed"],

  async execute({ socket, msg, sender }) {
    try {
      const uptime = formatUptime(process.uptime());
      const totalMem = os.totalmem();
      const freeMem  = os.freemem();
      const usedMem  = totalMem - freeMem;
      const ping = Math.floor(Math.random() * 20) + 10;

      await socket.sendMessage(sender, {
        poll: {
          name: `🖥️ QUEEN KAVI BOT STATUS\n\n🤖 Bᴏᴛ Uᴘᴛɪᴍᴇ : ${uptime}\n\n> *© Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴘʀᴏ ᴡᴀ ʙᴏᴛ 1.0.0 ᴘʀᴏ*\n> *● ᴡᴀʙᴏᴛ ʙʏ Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ●*\n\n> 🌐 Wᴇʙ : Cᴏᴍɪɴɢ Sᴏᴏɴ\n> 🎬 Tᴜᴛᴏʀɪᴀʟ : Cᴏᴍɪɴɢ Sᴏᴏɴ`,
          values: [
            `📶 Pɪɴɢ : ${ping} ᴍꜱ`,
            `💾 Rᴀᴍ Uꜱᴇᴅ : ${formatBytes(usedMem)}`,
            `🟢 Rᴀᴍ Fʀᴇᴇ : ${formatBytes(freeMem)}`,
            `📊 Rᴀᴍ Tᴏᴛᴀʟ : ${formatBytes(totalMem)}`
          ],
          selectableCount: 1
        }
      }, { quoted: msg });

    } catch (err) {
      await socket.sendMessage(sender, {
        text: `\`❌ Pɪɴɢ Eʀʀᴏʀ\`:\n${err.message}`
      }, { quoted: msg });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  CASE 2 — OWNER
// ═══════════════════════════════════════════════════════════════════════════
const ownerPlugin = {
  name: "owner",
  command: ["owner", "head"],

  async execute({ socket, msg, sender }) {
    const shala = makeShala(BOT.name);
    try {
      await socket.sendMessage(sender, { react: { text: "🌍", key: msg.key } });

      const vcard1 = `BEGIN:VCARD\nVERSION:3.0\nFN:Gᴘᴛ Dᴜᴍɪʏʜ Dᴇᴠ\nORG:Gᴘᴛ Dᴜᴍɪʏʜ Dᴇᴠ\nTEL;type=CELL;type=VOICE;waid=94707085822:+94 70 708 5822\nEMAIL:Sʜᴀᴠɪʏᴀ@ɢᴍᴀɪʟ.ᴄᴏᴍ\nEND:VCARD`;
      const vcard2 = `BEGIN:VCARD\nVERSION:3.0\nFN:${BOT.owner}\nORG:${BOT.owner}\nTEL;type=CELL;type=VOICE;waid=94769490765:+94 76 949 0765\nEMAIL:Sʜᴀᴠɪʏᴀ@ɢᴍᴀɪʟ.ᴄᴏᴍ\nEND:VCARD`;

      await socket.sendMessage(sender, {
        contacts: {
          displayName: "Kᴀᴠɪ Bᴏᴛ Oᴡɴᴇʀꜱ",
          contacts: [{ vcard: vcard1 }, { vcard: vcard2 }]
        }
      }, { quoted: shala });

    } catch (e) {
      console.error('owner plugin error:', e);
      await socket.sendMessage(sender, {
        text: '\`❌ Fᴀɪʟᴇᴅ ᴛᴏ ɢᴇᴛ ᴏᴡɴᴇʀ ᴅᴇᴛᴀɪʟꜱ.\`'
      }, { quoted: shala });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  CASE 3 — GETDP
// ═══════════════════════════════════════════════════════════════════════════
const getdpPlugin = {
  name: "getdp",
  command: ["getdp", "dp", "profile"],

  async execute({ socket, msg, sender }) {
    try {
      const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const reply   = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const target  = mention || reply || sender;

      let pp;
      try {
        pp = await socket.profilePictureUrl(target, "image");
      } catch {
        pp = "https://i.imgur.com/6RL3QbM.png";
      }

      const number = target.split("@")[0];

      await socket.sendMessage(sender, {
        image: { url: pp },
        caption: `\`🕊️ Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ\`\n\n\`📸 Rᴏʏᴀʟ Pʀᴏꜰɪʟᴇ Pɪᴄᴛᴜʀᴇ\`\n\`👤 Uꜱᴇʀ :\` @${number}\n\n*✨ Pʀᴏꜰɪʟᴇ Pɪᴄᴛᴜʀᴇ Sᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ Rᴇᴛʀɪᴇᴠᴇᴅ*\n\n> *© Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴘʀᴏ ᴡᴀ ʙᴏᴛ 1.0.0 ᴘʀᴏ*\n> *● ᴡᴀʙᴏᴛ ʙʏ Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ●*`,
        mentions: [target]
      }, { quoted: msg });

    } catch (err) {
      await socket.sendMessage(sender, {
        text: `❌ Gᴇᴛᴅᴘ Eʀʀᴏʀ\n${err.message}`
      }, { quoted: msg });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  CASE 4 — SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
const systemPlugin = {
  name: "system",
  command: ["system", "sys", "status"],

  async execute({ socket, msg, sender }) {
    const shala = makeShala(BOT.name);
    try {
      await socket.sendMessage(sender, { react: { text: "🖥️", key: msg.key } });

      const up = process.uptime();
      const h  = Math.floor(up / 3600);
      const m  = Math.floor((up % 3600) / 60);
      const s  = Math.floor(up % 60);

      const totalMem  = os.totalmem() / 1024 / 1024 / 1024;
      const freeMem   = os.freemem()  / 1024 / 1024 / 1024;
      const usedMem   = totalMem - freeMem;
      const ramPercent = ((usedMem / totalMem) * 100).toFixed(1);

      const cpuModel = os.cpus()[0].model;
      const cores    = os.cpus().length;
      const ping     = msg.messageTimestamp ? Date.now() - msg.messageTimestamp * 1000 : 'N/A';

      const text = `*🖥️ ${BOT.name} Sʏꜱᴛᴇᴍ Iɴꜰᴏ 🖥️*\n\n*╭───────────────●●✿◦*\n*┊* \`🧬 Vᴇʀꜱɪᴏɴ\` : ${BOT.version}\n*┊* \`✒️ Pʀᴇꜰɪx\`  : ${config.PREFIX}\n*┊* \`🌐 Hᴏꜱᴛ\`    : Hᴇʀᴏᴋᴜ\n*┊*\n*┊* \`🧠 Cᴘᴜ\`     : ${cpuModel}\n*┊* \`🔢 Cᴏʀᴇꜱ\`   : ${cores}\n*┊*\n*┊* \`💾 Rᴀᴍ\`     : ${usedMem.toFixed(2)} / ${totalMem.toFixed(2)} GB\n*┊* \`📊 Uꜱᴀɢᴇ\`   : ${ramPercent}%\n*┊*\n*┊* \`📟 Uᴘᴛɪᴍᴇ\`  : ${h}ʜ ${m}ᴍ ${s}ꜱ\n*┊* \`⚡ Pɪɴɢ\`    : ${ping} ᴍꜱ\n*┊*\n*┊* \`🤖 Sᴛᴀᴛᴜꜱ\`  : 🟢 Oɴʟɪɴᴇ\n*╰───────────────●●✿◦*\n\n> *© Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴘʀᴏ ᴡᴀ ʙᴏᴛ 1.0.0 ᴘʀᴏ*\n> *● ᴡᴀʙᴏᴛ ʙʏ Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ●*`;

      await socket.sendMessage(sender, {
        image: { url: BOT.image },
        caption: text,
        contextInfo: { forwardingScore: 999, isForwarded: true }
      }, { quoted: shala });

    } catch (e) {
      console.error('system error:', e);
      await socket.sendMessage(sender, {
        text: '\`❌ Fᴀɪʟᴇᴅ ᴛᴏ ʟᴏᴀᴅ ꜱʏꜱᴛᴇᴍ ᴘᴀɴᴇʟ.\`'
      }, { quoted: shala });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  CASE 5 — ALIVE
// ═══════════════════════════════════════════════════════════════════════════
const alivePlugin = {
  name: "alive",
  command: ["alive", "info", "online"],

  async execute({ socket, msg, sender }) {
    const shala = makeShala(BOT.name);
    try {
      await socket.sendMessage(sender, { react: { text: "⚡", key: msg.key } });

      const date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
      const time = moment().tz("Asia/Colombo").format("HH:mm:ss");
      const hour = moment().tz("Asia/Colombo").hour();
      const greetings =
        hour < 12 ? '*`සුභ උදෑසනක් 🌄`*' :
        hour < 17 ? '*`සුභ දහවලක් 🏞️`*' :
        hour < 20 ? '*`සුභ හැන්දෑවක් 🌅`*' :
                    '*`සුභ රාත්‍රියක් 🌌`*';

      const pushname = msg.pushName || "User";

      const aliveMessage = `_*Ｗᴇʟᴄᴏᴍᴇ Ｔᴏ Qᴜᴇᴇɴ Kᴀᴠɪ Ｍɪɴɪ Ｂᴏᴛ 🐼"*_\n\n*╭───────────────●●✿◦*\n*┊• 🌄 \`ɢʀᴇᴇᴛ\` :-* ${greetings}\n*┊• ️🕝 \`ᴛɪᴍᴇ\` :-* *${time}*\n*┊• 📆 \`ᴅᴀᴛᴇ\` :-* *${date}*\n*┊• 🈲 \`ᴏᴡɴᴇʀ\` :-* *${BOT.owner}*\n*╰───────────────●●✿◦*\n\n${BOT.alivemsg}\n\n*🌐 Qᴜᴇᴇɴ Kᴀᴠɪ Mɪɴɪ Bᴏᴛ Wᴇʙꜱɪᴛᴇ :*\n> ${BOT.pairlink}\n\n╭─「 💕 *ᴅᴇᴠᴇʟᴏᴘᴇʀ* 」\n│ 👨‍💻 » Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ\n│ 🌟 » ɢᴘᴛ ᴅᴜᴍɪʏʜ ᴅᴇᴠ\n╰──────────────────\n\n${BOT.footer}`;

      await socket.sendMessage(sender, {
        video: { url: BOT.video },
        mimetype: "video/mp4",
        ptv: true
      }, { quoted: msg });

      await socket.sendMessage(sender, {
        image: { url: BOT.image },
        caption: aliveMessage,
        footer: BOT.footer,
        headerType: 4,
        contextInfo: {
          forwardedNewsletterMessageInfo: {
            newsletterJid: BOT.jid,
            newsletterName: BOT.jidname,
            serverMessageId: 999
          },
          externalAdReply: {
            title: BOT.name,
            body: pushname,
            mediaType: 1,
            sourceUrl: BOT.channel,
            thumbnailUrl: BOT.image,
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      }, { quoted: shala });

    } catch (e) {
      console.error(e);
      await socket.sendMessage(sender, {
        text: `❌ Aʟɪᴠᴇ Eʀʀᴏʀ:\n${e.message}`
      }, { quoted: shala });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  CASE 6 — MENU
// ═══════════════════════════════════════════════════════════════════════════
const menuPlugin = {
  name: "menu",
  command: ["menu", "command", "cmd"],
  category: "main",

  async execute({ socket, msg, sender }) {
    const shala = makeShala(BOT.name);
    try {
      await socket.sendMessage(sender, { react: { text: "📑", key: msg.key } });

      const hour = moment().tz("Asia/Colombo").hour();
      const greetings =
        hour < 12 ? '*`සුභ උදෑසනක් 🌄`*' :
        hour < 17 ? '*`සුභ දහවලක් 🏞️`*' :
        hour < 20 ? '*`සුභ හැන්දෑවක් 🌅`*' :
                    '*`සුභ රාත්‍රියක් 🌌`*';

      const menuc = `${greetings}\n꒰ ˘͈ᵕ˘͈ ꒱ *ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴏᴜʀ ʙᴏᴛ* ~\n\n*╭─「 🕊️ ʙᴏᴛ ꜱᴛᴀᴛᴜꜱ 」*\n*│ ⏰ » 24ʜ 00ᴍ 00ꜱ*\n*│ ⚡ » ʜᴇʀᴏᴋᴜ ʜᴏꜱᴛ*\n*│ 🎭 » ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ ᴡᴀ ʙᴏᴛ*\n*│ 💕 » ᴀʟᴡᴀʏꜱ ᴏɴʟɪɴᴇ ✿*\n*│ 🔓 » ᴘᴜʙʟɪᴄ ᴍᴏᴅᴇ*\n*╰──────────────────*\n\n*╭─「 💕 ᴅᴇᴠᴇʟᴏᴘᴇʀ 」*\n*│ 👨‍💻 »* Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ\n*│ 🌟 »* ɢᴘᴛ ᴅᴜᴍɪʏʜ ᴅᴇᴠ\n*╰──────────────────*\n\n*⭓───────────────⭓『 ⚡ ᴍᴀɪɴ  』*\n\n*╭─「 ᴀʟɪᴠᴇ  」*\n*│* ❄️ » ᴄʜᴇᴄᴋ ʙᴏᴛ ᴏɴʟɪɴᴇ\n*│* 🌟 » ᴜꜱᴇ .ᴀʟɪᴠᴇ\n*╰──────────────────*\n*╭─「 ᴍᴇɴᴜ  」*\n*│* ❄️ » ɢᴇᴛ ʙᴏᴛ ᴍᴇɴᴜ ʟɪꜱᴛ\n*│* 🌟 » ᴜꜱᴇ .ᴍᴇɴᴜ\n*╰──────────────────*\n*╭─「 ꜱʏꜱᴛᴇᴍ  」*\n*│* ❄️ » ᴄʜᴇᴄᴋ ʙᴏᴛ ꜱʏꜱᴛᴇᴍ ɪɴɢᴏ\n*│* 🌟 » ᴜꜱᴇ .ꜱʏꜱᴛᴇᴍ\n*╰──────────────────*\n*╭─「 ᴏᴡɴᴇʀ  」*\n*│* ❄️ » ɢᴇᴛ ᴅᴇᴠᴇʟᴏᴘᴇʀꜱ ɴᴜᴍʙᴇʀ\n*│* 🌟 » ᴜꜱᴇ .ᴏᴡɴᴇʀ\n*╰──────────────────*\n*╭─「 ᴘɪɴɢ  」*\n*│* ❄️ » ᴄʜᴇᴄᴋ ʙᴏᴛ ʀᴇꜱᴘᴏɴᴅ ꜱᴘᴇᴇᴅ\n*│* 🌟 » ᴜꜱᴇ .ᴘɪɴɢ\n*╰──────────────────*\n*╭─「 ɢᴇᴛᴅᴘ  」*\n*│* ❄️ » ᴅᴏᴡɴʟᴏᴀᴅ ᴡᴀ. ᴘʀᴏꜰɪʟᴇ ᴘɪᴄᴛᴜʀᴇ \n*│* 🌟 » ᴜꜱᴇ .ɢᴇᴛᴅᴘ\n*╰──────────────────*\n*╭─「 .ᴠᴠ  」*\n*│* ❄️ » ʀᴇᴛʀɪᴇᴠᴇ ᴠɪᴇᴡ ᴏɴᴄᴇ ᴍᴇꜱꜱᴀɢᴇ\n*│* 🌟 » ʀᴇᴘʟʏ ᴛᴏ ᴠɪᴇᴡᴏɴᴄᴇ + .ᴠᴠ\n*╰──────────────────*\n\n> *© Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴘʀᴏ ᴡᴀ ʙᴏᴛ 1.0.0 ᴘʀᴏ*\n> *● ᴡᴀʙᴏᴛ ʙʏ Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ●*\n\n> 🌐 Wᴇʙ : Cᴏᴍɪɴɢ Sᴏᴏɴ\n> 🎬 Tᴜᴛᴏʀɪᴀʟ : Cᴏᴍɪɴɢ Sᴏᴏɴ`;

      await socket.sendMessage(sender, {
        image: { url: BOT.image },
        caption: menuc,
        footer: BOT.footer,
        headerType: 4,
        contextInfo: { forwardingScore: 999, isForwarded: true }
      }, { quoted: shala });

      await socket.sendMessage(sender, {
        audio: { url: BOT.video },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: msg });

    } catch (e) {
      console.error('menu error:', e);
      await socket.sendMessage(sender, {
        text: '❌ Fᴀɪʟᴇᴅ ᴛᴏ ʟᴏᴀᴅ ᴍᴇɴᴜ'
      }, { quoted: msg });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  CASE 7 — VV (View Once Retrieve)  ← from vv.js, converted to case style
// ═══════════════════════════════════════════════════════════════════════════
const vvPlugin = {
  name: "vv",
  command: ["vv", "viewonce", "retrieve"],

  async execute({ socket, msg, sender }) {
    try {
      // Get quoted message
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const quotedKey = msg.message?.extendedTextMessage?.contextInfo;

      if (!quoted) {
        return await socket.sendMessage(sender, {
          text: "🍁 Rᴇᴘʟʏ ᴛᴏ ᴀ ᴠɪᴇᴡ ᴏɴᴄᴇ ᴍᴇꜱꜱᴀɢᴇ!"
        }, { quoted: msg });
      }

      // Detect message type
      const viewOnceKey = Object.keys(quoted).find(k =>
        k === 'viewOnceMessage' || k === 'viewOnceMessageV2' || k === 'viewOnceMessageV2Extension'
      );

      let innerMsg = quoted;
      if (viewOnceKey) {
        innerMsg = quoted[viewOnceKey]?.message || quoted;
      }

      const imageMsg = innerMsg.imageMessage;
      const videoMsg = innerMsg.videoMessage;
      const audioMsg = innerMsg.audioMessage;

      if (!imageMsg && !videoMsg && !audioMsg) {
        return await socket.sendMessage(sender, {
          text: "❌ Tʜɪꜱ ɪꜱ ɴᴏᴛ ᴀ ᴠɪᴇᴡ ᴏɴᴄᴇ ᴍᴇꜱꜱᴀɢᴇ."
        }, { quoted: msg });
      }

      // Build a fake full message to download from
      const fakeMsg = {
        key: {
          remoteJid: msg.key.remoteJid,
          fromMe: false,
          id: quotedKey?.stanzaId || msg.key.id,
          participant: quotedKey?.participant
        },
        message: quoted
      };

      const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

      let stream, buffer, mimeType;

      if (imageMsg) {
        stream = await downloadContentFromMessage(imageMsg, 'image');
        mimeType = 'image';
      } else if (videoMsg) {
        stream = await downloadContentFromMessage(videoMsg, 'video');
        mimeType = 'video';
      } else {
        stream = await downloadContentFromMessage(audioMsg, 'audio');
        mimeType = 'audio';
      }

      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      buffer = Buffer.concat(chunks);

      if (mimeType === 'image') {
        return await socket.sendMessage(sender, {
          image: buffer,
          caption: imageMsg.caption || ""
        }, { quoted: msg });
      }

      if (mimeType === 'video') {
        return await socket.sendMessage(sender, {
          video: buffer,
          caption: videoMsg.caption || ""
        }, { quoted: msg });
      }

      if (mimeType === 'audio') {
        return await socket.sendMessage(sender, {
          audio: buffer,
          mimetype: "audio/mpeg",
          ptt: false
        }, { quoted: msg });
      }

    } catch (err) {
      console.error('vv error:', err);
      await socket.sendMessage(sender, {
        text: "❌ Fᴀɪʟᴇᴅ ᴛᴏ ʀᴇᴛʀɪᴇᴠᴇ ᴍᴇꜱꜱᴀɢᴇ."
      }, { quoted: msg });
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  ✅ EXPORT ALL PLUGINS AS ARRAY — loader in start.js does: plugins.push(plugin)
//     Each plugin needs { name, command[], execute() }
// ═══════════════════════════════════════════════════════════════════════════
module.exports = [
  pingPlugin,
  ownerPlugin,
  getdpPlugin,
  systemPlugin,
  alivePlugin,
  menuPlugin,
  vvPlugin
];
