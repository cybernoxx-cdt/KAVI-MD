// ─────────────────────────────────────────────
//  system.js — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ
// ─────────────────────────────────────────────
const os = require('os');

module.exports = {
  name: 'system',
  command: ['system', 'sys', 'sysinfo'],

  async execute({ socket, msg, sender, isOwner, config }) {
    try {
      if (!isOwner) return socket.sendMessage(sender, { text: '❌ Owner only!' }, { quoted: msg });

      const upSec = process.uptime();
      const h   = Math.floor(upSec / 3600);
      const min = Math.floor((upSec % 3600) / 60);
      const sec = Math.floor(upSec % 60);

      const memUsed  = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      const memTotal = (os.totalmem() / 1024 / 1024).toFixed(2);
      const memFree  = (os.freemem()  / 1024 / 1024).toFixed(2);
      const cpuLoad  = os.loadavg()[0].toFixed(2);
      const ramPct   = ((1 - os.freemem() / os.totalmem()) * 100).toFixed(1);

      await socket.sendMessage(sender, {
        text:
`🖥️ *SYSTEM INFO — Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ*
━━━━━━━━━━━━━━━━━━━━
⏱️ *Uptime:* ${h}h ${min}m ${sec}s
💾 *RAM Used:* ${memUsed}MB / ${memTotal}MB
🆓 *RAM Free:* ${memFree}MB
📊 *RAM Usage:* ${ramPct}%
⚡ *CPU Load:* ${cpuLoad}
🖥️ *Platform:* ${os.platform()}
🟢 *Node.js:* ${process.version}
🌐 *Hostname:* ${os.hostname()}
━━━━━━━━━━━━━━━━━━━━
> © ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ 💎`
      }, { quoted: msg });

    } catch (e) {
      console.error('system error:', e);
      await socket.sendMessage(sender, { text: `⚠️ Error: ${e.message}` });
    }
  }
};
