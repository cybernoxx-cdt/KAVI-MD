const moment = require("moment-timezone");
const config = require('../settings');
const axios = require("axios");
const os = require("os");

// --------------------------- PING ---------------------------
module.exports = {
  name: "ping",
  command: ["ping","pong","speed"],

  async execute({ socket, msg, sender }) {

    try {

      const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = Math.floor(seconds % 60)
        return `${h}ʜ ${m}ᴍ ${s}ꜱ`
      }

      const uptime = formatUptime(process.uptime())

      const totalMem = os.totalmem()
      const freeMem = os.freemem()
      const usedMem = totalMem - freeMem

      const formatBytes = (bytes) => {
        if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + " GB"
        if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + " MB"
        if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB"
        return bytes + " B"
      }

      const ping = Math.floor(Math.random() * 20) + 10

      await socket.sendMessage(
        sender,
        {
          poll: {
            name: `🖥️ QUEEN KAVI BOT STATUS

🤖 Bᴏᴛ Uᴘᴛɪᴍᴇ : ${uptime}

> *© Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴘʀᴏ ᴡᴀ ʙᴏᴛ 1.0.0 ᴘʀᴏ*
> *● ᴡᴀʙᴏᴛ ʙʏ Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ●*

> 🌐 Wᴇʙ : Cᴏᴍɪɴɢ Sᴏᴏɴ
> 🎬 Tᴜᴛᴏʀɪᴀʟ : Cᴏᴍɪɴɢ Sᴏᴏɴ`,

            values: [
              `📶 Pɪɴɢ : ${ping} ᴍꜱ`,
              `💾 Rᴀᴍ Uꜱᴇᴅ : ${formatBytes(usedMem)}`,
              `🟢 Rᴀᴍ Fʀᴇᴇ : ${formatBytes(freeMem)}`,
              `📊 Rᴀᴍ Tᴏᴛᴀʟ : ${formatBytes(totalMem)}`
            ],

            selectableCount: 1
          }
        },
        { quoted: msg }
      )

    } catch (err) {

      await socket.sendMessage(
        sender,
        { text: `\`❌ Pɪɴɢ Eʀʀᴏʀ\`:\n${err.message}` },
        { quoted: msg }
      )

    }
  }
}

// --------------------------- OWNER ---------------------------
module.exports = {
  name: "owner",
  command: ["owner", "head"],

  async execute({ socket, msg, sender }) {
try {

    await socket.sendMessage(sender, {
  react: {
    text: "🌍",
    key: msg.key
  }
});

      const ownerdata = {
        alivemsg: "✨ *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ* ɪꜱ ᴏɴʟɪɴᴇ ᴀɴᴅ ʀᴇᴀᴅʏ! 🚀",
        footer: "> ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ",
        imageurl: "https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg",
        profileurl: "https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg",
        alivevideo: "https://files.catbox.moe/e3zmey.mp3",
        version: "1.0.0",
        jid: "120363405871120956@newsletter",
        platform: "Heroku",
        jidname: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
        botname: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
        ownername: "Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ",
        ownernumber: "94707085822",
        channel: "https://whatsapp.com/channel/0029VbCG0yxEwEk21tFzPT16",
        pairlink: "https://kavi-md-a2ac26a5c95b.herokuapp.com",
        title: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ"
      };

      const {
        alivemsg,
        footer,
        imageurl,
        profileurl,
        alivevideo,
        version,
        jid,
        platform,
        jidname,
        botname,
        ownername,
        ownernumber,
        channel,
        pairlink,
        title
      } = ownerdata;
      
      const pushname = msg.pushName || "User";

      const shala = {
      key: {
        remoteJid: "status@broadcast",
        participant: "0@s.whatsapp.net",
        fromMe: false,
        id: "META_AI_SYSTEM"
      },
      message: {
        contactMessage: {
           displayName: botname,
          vcard: `BEGIN:VCARD
VERSION:3.0
N:${botname};;;;
FN:${botname}
ORG:Meta Platforms
TEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002
END:VCARD`
        }
      }
    };

      const vcard1 = `BEGIN:VCARD
VERSION:3.0
FN:Gᴘᴛ Dᴜᴍɪʏʜ Dᴇᴠ
ORG:Gᴘᴛ Dᴜᴍɪʏʜ Dᴇᴠ
TEL;type=CELL;type=VOICE;waid=94707085822:+94 70 708 5822
EMAIL:Sʜᴀᴠɪʏᴀ@ɢᴍᴀɪʟ.ᴄᴏᴍ
END:VCARD`;

      const vcard2 = `BEGIN:VCARD
VERSION:3.0
FN:${ownername}
ORG:${ownername}
TEL;type=CELL;type=VOICE;waid=94769490765:+94 76 949 0765
EMAIL:Sʜᴀᴠɪʏᴀ@ɢᴍᴀɪʟ.ᴄᴏᴍ
END:VCARD`;

      await socket.sendMessage(
        sender,
        {
          contacts: {
            displayName: "Kᴀᴠɪ Bᴏᴛ Oᴡɴᴇʀꜱ",
            contacts: [
              { vcard: vcard1 },
              { vcard: vcard2 }
            ]
          }
        },
        { quoted: shala }
      );

    } catch (e) {
      console.error('owner plugin error:', e);
      await socket.sendMessage(
        sender,
        { text: '\`❌ Fᴀɪʟᴇᴅ ᴛᴏ ɢᴇᴛ ᴏᴡɴᴇʀ ᴅᴇᴛᴀɪʟꜱ.\`' },
        { quoted: shala }
      );
    }
  }
};

// --------------------------- GETDP ---------------------------
module.exports = {
  name: "getdp",
  command: ["getdp","dp","profile"],

  async execute({ socket, msg, sender }) {

    try {

      const mention =
        msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

      const reply =
        msg.message?.extendedTextMessage?.contextInfo?.participant

      const target = mention || reply || sender

      let pp

      try {
        pp = await socket.profilePictureUrl(target,"image")
      } catch {
        pp = "https://i.imgur.com/6RL3QbM.png"
      }

      const number = target.split("@")[0]

      await socket.sendMessage(
        sender,
        {
          image:{ url: pp },
          caption:`\`🕊️ Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ\`

\`📸 Rᴏʏᴀʟ Pʀᴏꜰɪʟᴇ Pɪᴄᴛᴜʀᴇ\`
\`👤 Uꜱᴇʀ :\` @${number}

*✨ Pʀᴏꜰɪʟᴇ Pɪᴄᴛᴜʀᴇ Sᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ Rᴇᴛʀɪᴇᴠᴇᴅ*

> *© Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴘʀᴏ ᴡᴀ ʙᴏᴛ 1.0.0 ᴘʀᴏ*
> *● ᴡᴀʙᴏᴛ ʙʏ Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ●*`
          ,
          mentions:[target]
        },
        { quoted: msg }
      )

    } catch (err) {

      await socket.sendMessage(
        sender,
        { text:`❌ Gᴇᴛᴅᴘ Eʀʀᴏʀ\n${err.message}` },
        { quoted: msg }
      )

    }

  }
}

// --------------------------- SYSTEM----------------------------------------
module.exports = {
  name: "system",
  command: ["system", "sys", "status"],

  async execute({ socket, msg, sender }) {
    let shala;

    try {
      await socket.sendMessage(sender, {
        react: { text: "🖥️", key: msg.key }
      });

      const pushname = msg.pushName || "User";

      const ownerdata = {
        alivemsg: "✨ *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ* ɪꜱ ᴏɴʟɪɴᴇ ᴀɴᴅ ʀᴇᴀᴅʏ! 🚀",
        footer: "> ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ",
        imageurl: "https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg",
        profileurl: "https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg",
        alivevideo: "https://files.catbox.moe/e3zmey.mp3",
        version: "1.0.0",
        jid: "120363405871120956@newsletter",
        platform: "Heroku",
        jidname: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
        botname: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
        ownername: "Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ",
        ownernumber: "94707085822",
        channel: "https://whatsapp.com/channel/0029VbCG0yxEwEk21tFzPT16",
        pairlink: "https://kavi-md-a2ac26a5c95b.herokuapp.com",
        title: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ"
      };

      const {
        alivemsg,
        footer,
        imageurl,
        profileurl,
        alivevideo,
        version,
        jid,
        platform,
        jidname,
        botname,
        ownername,
        ownernumber,
        channel,
        pairlink,
        title
      } = ownerdata;
      
      const shala = {
      key: {
        remoteJid: "status@broadcast",
        participant: "0@s.whatsapp.net",
        fromMe: false,
        id: "META_AI_SYSTEM"
      },
      message: {
        contactMessage: {
           displayName: botname,
          vcard: `BEGIN:VCARD
VERSION:3.0
N:${botname};;;;
FN:${botname}
ORG:Meta Platforms
TEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002
END:VCARD`
        }
      }
    };


      // Uᴘᴛɪᴍᴇ
      const up = process.uptime();
      const h = Math.floor(up / 3600);
      const m = Math.floor((up % 3600) / 60);
      const s = Math.floor(up % 60);

      // Rᴀᴍ
      const totalMem = os.totalmem() / 1024 / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024 / 1024;
      const usedMem = totalMem - freeMem;
      const ramPercent = ((usedMem / totalMem) * 100).toFixed(1);

      // Cᴘᴜ
      const cpuModel = os.cpus()[0].model;
      const cores = os.cpus().length;

      // Pɪɴɢ
      const ping = msg.messageTimestamp
        ? Date.now() - msg.messageTimestamp * 1000
        : 'N/A';

      const systemMessage = `*🖥️ ${botname} Sʏꜱᴛᴇᴍ Iɴꜰᴏ 🖥️*

*╭───────────────●●✿◦*
*┊* \`🧬 Vᴇʀꜱɪᴏɴ\` : ${version || config.BOT_VERSION}
*┊* \`✒️ Pʀᴇꜰɪx\`  : ${config.PREFIX}
*┊* \`🌐 Hᴏꜱᴛ\`    : Hᴇʀᴏᴋᴜ
*┊*
*┊* \`🧠 Cᴘᴜ\`     : ${cpuModel}
*┊* \`🔢 Cᴏʀᴇꜱ\`   : ${cores}
*┊*
*┊* \`💾 Rᴀᴍ\`     : ${usedMem.toFixed(2)} / ${totalMem.toFixed(2)} GB
*┊* \`📊 Uꜱᴀɢᴇ\`   : ${ramPercent}%
*┊*
*┊* \`📟 Uᴘᴛɪᴍᴇ\`  : ${h}ʜ ${m}ᴍ ${s}ꜱ
*┊* \`⚡ Pɪɴɢ\`    : ${ping} ᴍꜱ
*┊*
*┊* \`🤖 Sᴛᴀᴛᴜꜱ\`  : 🟢 Oɴʟɪɴᴇ
*╰───────────────●●✿◦*

> *© Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴘʀᴏ ᴡᴀ ʙᴏᴛ 1.0.0 ᴘʀᴏ*
> *● ᴡᴀʙᴏᴛ ʙʏ Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ●*

> 🌐 Wᴇʙ : Cᴏᴍɪɴɢ Sᴏᴏɴ
> 🎬 Tᴜᴛᴏʀɪᴀʟ : Cᴏᴍɪɴɢ Sᴏᴏɴ`;

      await socket.sendMessage(
        sender,
        {
          image: { url: imageurl },
          caption: systemMessage,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true
          }
        }, { quoted: shala });

      

    } catch (e) {
      console.error('system error:', e);
      await socket.sendMessage(
        sender,
        { text: '\`❌ Fᴀɪʟᴇᴅ ᴛᴏ ʟᴏᴀᴅ ꜱʏꜱᴛᴇᴍ ᴘᴀɴᴇʟ.\`' },
        { quoted: shala || msg }
      );
    }
  }
};

// --------------------------- ALIVE ---------------------------
module.exports = {
  name: "alive",
  command: ["alive", "info", "online"],

  async execute({ socket, msg, sender, config }) {
    try {

      await socket.sendMessage(sender, {
  react: {
    text: "⚡",
    key: msg.key
  }
});

      const ownerdata = {
        alivemsg: "✨ *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ* ɪꜱ ᴏɴʟɪɴᴇ ᴀɴᴅ ʀᴇᴀᴅʏ! 🚀",
        footer: "> ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ",
        imageurl: "https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg",
        profileurl: "https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg",
        alivevideo: "https://files.catbox.moe/e3zmey.mp3",
        version: "1.0.0",
        jid: "120363405871120956@newsletter",
        platform: "Heroku",
        jidname: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
        botname: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
        ownername: "Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ",
        ownernumber: "94707085822",
        channel: "https://whatsapp.com/channel/0029VbCG0yxEwEk21tFzPT16",
        pairlink: "https://kavi-md-a2ac26a5c95b.herokuapp.com",
        title: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ"
      };

      const {
        alivemsg,
        footer,
        imageurl,
        profileurl,
        alivevideo,
        version,
        jid,
        platform,
        jidname,
        botname,
        ownername,
        ownernumber,
        channel,
        pairlink,
        title
      } = ownerdata;
      
      const pushname = msg.pushName || "User";

      const shala = {
      key: {
        remoteJid: "status@broadcast",
        participant: "0@s.whatsapp.net",
        fromMe: false,
        id: "META_AI_SYSTEM"
      },
      message: {
        contactMessage: {
           displayName: botname,
          vcard: `BEGIN:VCARD
VERSION:3.0
N:${botname};;;;
FN:${botname}
ORG:Meta Platforms
TEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002
END:VCARD`
        }
      }
    };


      const date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
const time = moment().tz("Asia/Colombo").format("HH:mm:ss");

const hour = moment().tz("Asia/Colombo").hour();
const greetings =
  hour < 12 ? '*`සුභ උදෑසනක් 🌄`*' :
  hour < 17 ? '*`සුභ දහවලක් 🏞️`*' :
  hour < 20 ? '*`සුභ හැන්දෑවක් 🌅`*' :
              '*`සුභ රාත්‍රියක් 🌌`*';

      let host = os.hostname() || "render";
      if (host.length === 12) host = "replit";
      else if (host.length === 36) host = "heroku";
      else if (host.length === 8) host = "koyeb";

      const monospace = "```";

      const aliveMessage = `_*Ｗᴇʟᴄᴏᴍᴇ Ｔᴏ Qᴜᴇᴇɴ Kᴀᴠɪ Ｍɪɴɪ Ｂᴏᴛ 🐼"*_

*╭───────────────●●✿◦*
*┊• 🌄 \`ɢʀᴇᴇᴛ\` :-* ${greetings}
*┊• ️🕝 \`ᴛɪᴍᴇ\` :-* *${time}*
*┊• 📆 \`ᴅᴀᴛᴇ\` :-* *${date}*
*┊• 🈲 \`ᴏᴡɴᴇʀ\` :-* *${ownername}*
*╰───────────────●●✿◦*

${alivemsg}

*🌐 Qᴜᴇᴇɴ Kᴀᴠɪ Mɪɴɪ Bᴏᴛ Wᴇʙꜱɪᴛᴇ :*
> ${pairlink}

╭─「 💕 *ᴅᴇᴠᴇʟᴏᴘᴇʀ* 」
│ 👨‍💻 » Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ
│ 🌟 » ɢᴘᴛ ᴅᴜᴍɪʏʜ ᴅᴇᴠ
╰──────────────────

${footer}`;

      await socket.sendMessage(
        sender,
        {
          video: { url: alivevideo },
          mimetype: "video/mp4",
          ptv: true
        },
        { quoted: msg }
      );

      await socket.sendMessage(
        sender,
        {
          image: { url: imageurl },
          caption: aliveMessage,
          footer: footer,
          headerType: 4,
          contextInfo: {
            forwardedNewsletterMessageInfo: {
              newsletterJid: jid,
              newsletterName: jidname,
              serverMessageId: 999
            },
            externalAdReply: {
              title,
              body: pushname,
              mediaType: 1,
              sourceUrl: channel,
              thumbnailUrl: profileurl,
              renderLargerThumbnail: true,
              showAdAttribution: true
            }
          }
        },
        { quoted: shala }
      );

    } catch (e) {
      console.error(e);
      await socket.sendMessage(
        sender,
        { text: `❌ Aʟɪᴠᴇ Eʀʀᴏʀ:\n${e.message}` },
        { quoted: shala }
      );
    }
  }
};

// --------------------------- MENU ---------------------------
module.exports = {
  name: "menu",
  command: ["menu", "command", "cmd"],
  category: "main",

  async execute({ socket, msg, sender }) {
    try {
      await socket.sendMessage(sender, {
        react: {
          text: "📑",
          key: msg.key
        }
      });

      const ownerdata = {
        alivemsg: "✨ *Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ* ɪꜱ ᴏɴʟɪɴᴇ ᴀɴᴅ ʀᴇᴀᴅʏ! 🚀",
        footer: "> ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ",
        imageurl: "https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg",
        profileurl: "https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg",
        alivevideo: "https://files.catbox.moe/e3zmey.mp3",
        version: "1.0.0",
        jid: "120363405871120956@newsletter",
        platform: "Heroku",
        jidname: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
        botname: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ",
        ownername: "Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ",
        ownernumber: "94707085822",
        channel: "https://whatsapp.com/channel/0029VbCG0yxEwEk21tFzPT16",
        pairlink: "https://kavi-md-a2ac26a5c95b.herokuapp.com",
        title: "Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ"
      };

      const {
        alivemsg,
        footer,
        imageurl,
        profileurl,
        alivevideo,
        version,
        jid,
        platform,
        jidname,
        botname,
        ownername,
        ownernumber,
        channel,
        pairlink,
        title
      } = ownerdata;

      const pushname = msg.pushName || "User";

      const shala = {
        key: {
          remoteJid: "status@broadcast",
          participant: "0@s.whatsapp.net",
          fromMe: false,
          id: "META_AI_SYSTEM"
        },
        message: {
          contactMessage: {
            displayName: botname,
            vcard: `BEGIN:VCARD
VERSION:3.0
N:${botname};;;;
FN:${botname}
ORG:Meta Platforms
TEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002
END:VCARD`
          }
        }
      };

      const date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
      const time = moment().tz("Asia/Colombo").format("HH:mm:ss");
      const hour = moment().tz("Asia/Colombo").hour();
      const greetings =
        hour < 12 ? '*`සුභ උදෑසනක් 🌄`*' :
        hour < 17 ? '*`සුභ දහවලක් 🏞️`*' :
        hour < 20 ? '*`සුභ හැන්දෑවක් 🌅`*' :
                    '*`සුභ රාත්‍රියක් 🌌`*';

      let menuc = `${greetings}
꒰ ˘͈ᵕ˘͈ ꒱ *ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴏᴜʀ ʙᴏᴛ* ~

*╭─「 🕊️ ʙᴏᴛ ꜱᴛᴀᴛᴜꜱ 」*
*│ ⏰ » 24ʜ 00ᴍ 00ꜱ*
*│ ⚡ » ʜᴇʀᴏᴋᴜ ʜᴏꜱᴛ*
*│ 🎭 » ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ ᴡᴀ ʙᴏᴛ*
*│ 💕 » ᴀʟᴡᴀʏꜱ ᴏɴʟɪɴᴇ ✿*
*│ 🔓 » ᴘᴜʙʟɪᴄ ᴍᴏᴅᴇ*
*╰──────────────────*

*╭─「 💕 ᴅᴇᴠᴇʟᴏᴘᴇʀ 」*
*│ 👨‍💻 »* Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ
*│ 🌟 »* ɢᴘᴛ ᴅᴜᴍɪʏʜ ᴅᴇᴠ
*╰──────────────────*

*⭓───────────────⭓『 ⚡ ᴍᴀɪɴ  』*

*╭─「 ᴀʟɪᴠᴇ  」*
*│* ❄️ » ᴄʜᴇᴄᴋ ʙᴏᴛ ᴏɴʟɪɴᴇ
*│* 🌟 » ᴜꜱᴇ .ᴀʟɪᴠᴇ
*╰──────────────────*
*╭─「 ᴍᴇɴᴜ  」*
*│* ❄️ » ɢᴇᴛ ʙᴏᴛ ᴍᴇɴᴜ ʟɪꜱᴛ
*│* 🌟 » ᴜꜱᴇ .ᴍᴇɴᴜ
*╰──────────────────*
*╭─「 ꜱʏꜱᴛᴇᴍ  」*
*│* ❄️ » ᴄʜᴇᴄᴋ ʙᴏᴛ ꜱʏꜱᴛᴇᴍ ɪɴɢᴏ
*│* 🌟 » ᴜꜱᴇ .ꜱʏꜱᴛᴇᴍ
*╰──────────────────*
*╭─「 ᴏᴡɴᴇʀ  」*
*│* ❄️ » ɢᴇᴛ ᴅᴇᴠᴇʟᴏᴘᴇʀꜱ ɴᴜᴍʙᴇʀ
*│* 🌟 » ᴜꜱᴇ .ᴏᴡɴᴇʀ
*╰──────────────────*
*╭─「 ᴘɪɴɢ  」*
*│* ❄️ » ᴄʜᴇᴄᴋ ʙᴏᴛ ʀᴇꜱᴘᴏɴᴅ ꜱᴘᴇᴇᴅ
*│* 🌟 » ᴜꜱᴇ .ᴘɪɴɢ
*╰──────────────────*
*╭─「 ɢᴇᴛᴅᴘ  」*
*│* ❄️ » ᴅᴏᴡɴʟᴏᴀᴅ ᴡᴀ. ᴘʀᴏꜰɪʟᴇ ᴘɪᴄᴛᴜʀᴇ 
*│* 🌟 » ᴜꜱᴇ .ɢᴇᴛᴅᴘ
*╰──────────────────*

> *© Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴘʀᴏ ᴡᴀ ʙᴏᴛ 1.0.0 ᴘʀᴏ*
> *● ᴡᴀʙᴏᴛ ʙʏ Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ●*

> 🌐 Wᴇʙ : Cᴏᴍɪɴɢ Sᴏᴏɴ
> 🎬 Tᴜᴛᴏʀɪᴀʟ : Cᴏᴍɪɴɢ Sᴏᴏɴ`

      await socket.sendMessage(
        sender,
        {
          image: { url: imageurl },
          caption: menuc,
          footer: footer,
          headerType: 4,
          contextInfo: { forwardingScore: 999, isForwarded: true }
        },
        { quoted: shala }
      );

      await socket.sendMessage(sender, {
            audio: { url: 'https://files.catbox.moe/e3zmey.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: msg });

    } catch (e) {
      console.error('System error:', e);
      await socket.sendMessage(
        sender,
        { text: '❌ Fᴀɪʟᴇᴅ ᴛᴏ ʟᴏᴀᴅ ᴍᴇɴᴜ' },
        { quoted: msg }
      );
    }
  }
};
