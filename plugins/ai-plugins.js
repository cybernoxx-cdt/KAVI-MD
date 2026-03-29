const axios = require('axios');

// --------------------------- ASKAI ---------------------------
module.exports = {
  name: "askai",
  command: ["ask", "askai"],

  async execute({ socket, msg, sender }) {
    try {
      const text = msg.message?.conversation ||
                   msg.message?.extendedTextMessage?.text;

      if (!text) {
        return await socket.sendMessage(sender, {
          text: "❌ Pʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴀ ᴘʀᴏᴍᴘᴛ.\n\nExᴀᴍᴘʟᴇ : .ᴀꜱᴋᴀɪ ʜᴇʟʟᴏ"
        }, { quoted: msg });
      }

      const q = text.replace(/^[.!\/](ask|askai|bot)\s*/i, "");

      if (!q) {
        return await socket.sendMessage(sender, {
          text: "Aꜱᴋ ꜱᴏᴍᴇᴛʜɪɴɢ 😒"
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        react: { text: "🤖", key: msg.key }
      });

      await socket.sendMessage(sender, {
        text: "> *Tʜɪɴᴋɪɴɢ... 🤖*"
      }, { quoted: msg });

      const url = `https://hiru-api-ai.vercel.app/api/askai?apikey=hiru&q=${encodeURIComponent(q)}`;

      const res = await axios.get(url);
      const data = res.data;

      const result = data.result || data.answer || data.data;

      if (!result) {
        return await socket.sendMessage(sender, {
          text: "❌ Nᴏ ʀᴇꜱᴘᴏɴᴄᴇ ꜰʀᴏᴍ ᴀɪ."
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        text: `\`🤖 Aꜱᴋ Aɪ Rᴇꜱᴘᴏɴꜱᴇ\`\n\n${result}`
      }, { quoted: msg });

    } catch (err) {
      console.error("AskAI Error:", err);

      await socket.sendMessage(sender, {
        text: `❌ ${err?.response?.data?.message || err.message}`
      }, { quoted: msg });
    }
  }
};

// --------------------------- GEMINI ---------------------------
module.exports = {
  name: "gemini",
  command: ["gemini", "gemi"],

  async execute({ socket, msg, sender }) {
    try {
      const text = msg.message?.conversation ||
                   msg.message?.extendedTextMessage?.text;

      if (!text) {
        return await socket.sendMessage(sender, {
          text: "❌ Pʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴀ ᴘʀᴏᴍᴘᴛ.\n\nExᴀᴍᴘʟᴇ : .ɢᴇᴍɪɴɪ ʜᴇʟʟᴏ"
        }, { quoted: msg });
      }

      const q = text.replace(/^[.!\/](gemini|gemi)\s*/i, "");

      if (!q) {
        return await socket.sendMessage(sender, {
          text: "Aꜱᴋ ꜱᴏᴍᴇᴛʜɪɴɢ 😒"
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        react: { text: "🧠", key: msg.key }
      });

      await socket.sendMessage(sender, {
        text: "> *Tʜɪɴᴋɪɴɢ... 🧠*"
      }, { quoted: msg });

      const url = `https://hiru-api-ai.vercel.app/api/gemini?apikey=hiru&q=${encodeURIComponent(q)}`;

      const res = await axios.get(url);
      const data = res.data;

      if (!data?.result && !data?.data) {
        return await socket.sendMessage(sender, {
          text: "❌ Nᴏ ʀᴇꜱᴘᴏɴꜱᴇ ꜰʀᴏᴍ ɢᴇᴍɪɴɪ."
        }, { quoted: msg });
      }

      const result = data.result || data.data;

      await socket.sendMessage(sender, {
        text: `\`🧠 Gᴇᴍɪɴɪ Aɪ Rᴇꜱᴘᴏɴꜱᴇ\`\n\n${result}`
      }, { quoted: msg });

    } catch (err) {
      console.error("Gemini Error:", err);

      await socket.sendMessage(sender, {
        text: `❌ ${err?.response?.data?.message || err.message}`
      }, { quoted: msg });
    }
  }
};

// --------------------------- NOTEGPT ---------------------------
module.exports = {
  name: "notegpt",
  command: ["notegpt", "note", "summary"],

  async execute({ socket, msg, sender }) {
    try {
      const text = msg.message?.conversation ||
                   msg.message?.extendedTextMessage?.text;

      if (!text) {
        return await socket.sendMessage(sender, {
          text: "❌ Pʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴛᴇxᴛ ᴛᴏ ꜱᴜᴍᴍᴀʀɪᴢᴇ.\n\nExᴀᴍᴘʟᴇ: .ɴᴏᴛᴇɢᴘᴛ ʟᴏɴɢ ᴛᴇxᴛ ʜᴇʀᴇ"
        }, { quoted: msg });
      }

      const q = text.replace(/^[.!\/](notegpt|note|summary)\s*/i, "");

      if (!q) {
        return await socket.sendMessage(sender, {
          text: "ɢɪᴠᴇ ꜱᴏᴍᴇᴛʜɪɴɢ ᴛᴏ ꜱᴜᴍᴍᴀʀɪᴢᴇ 😒"
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        react: { text: "📝", key: msg.key }
      });

      await socket.sendMessage(sender, {
        text: "> *Gᴇɴᴇʀᴀᴛɪɴɢ Nᴏᴛᴇꜱ... 📝*"
      }, { quoted: msg });

      const url = `https://hiru-api-ai.vercel.app/api/notegpt?apikey=hiru&q=${encodeURIComponent(q)}`;

      const res = await axios.get(url);
      const data = res.data;

      const result = data.result || data.data || data.answer;

      if (!result) {
        return await socket.sendMessage(sender, {
          text: "❌ Nᴏ ʀᴇꜱᴘᴏɴꜱᴇ ꜰʀᴏᴍ ɴᴏᴛᴇɢᴘᴛ."
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        text: `\`📝 Nᴏᴛᴇ Gᴘᴛ Sᴜᴍᴍᴀʀʏ\`\n\n${result}`
      }, { quoted: msg });

    } catch (err) {
      console.error("NoteGPT Error:", err);

      await socket.sendMessage(sender, {
        text: `❌ ${err?.response?.data?.message || err.message}`
      }, { quoted: msg });
    }
  }
};

// --------------------------- OPENAI ---------------------------
module.exports = {
  name: "openai",
  command: ["openai", "gpt4", "chatopenai"],

  async execute({ socket, msg, sender }) {
    try {
      const text = msg.message?.conversation ||
                   msg.message?.extendedTextMessage?.text;

      if (!text) {
        return await socket.sendMessage(sender, {
          text: "❌ Pʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴀ ᴘʀᴏᴍᴘᴛ.\n\nExᴀᴍᴘʟᴇ : .ᴏᴘᴇɴᴀɪ ʜᴇʟʟᴏ"
        }, { quoted: msg });
      }

      const q = text.replace(/^[.!\/](openai|gpt4|chatopenai)\s*/i, "");

      if (!q) {
        return await socket.sendMessage(sender, {
          text: "Aꜱᴋ ꜱᴏᴍᴇᴛʜɪɴɢ 😒"
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        react: { text: "🤖", key: msg.key }
      });

      await socket.sendMessage(sender, {
        text: "> *Tʜɪɴᴋɪɴɢ... 🤖*"
      }, { quoted: msg });

      const url = `https://hiru-api-ai.vercel.app/api/chatopenai?apikey=hiru&text=${encodeURIComponent(q)}`;

      const res = await axios.get(url);
      const data = res.data;

      const result = data.result || data.answer || data.data;

      if (!result) {
        return await socket.sendMessage(sender, {
          text: "❌ Nᴏ ʀᴇꜱᴘᴏɴꜱᴇ ꜰʀᴏᴍ ᴏᴘᴇɴᴀɪ."
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        text: `\`🤖 Oᴘᴇɴ Aɪ Rᴇꜱᴘᴏɴꜱᴇ\`\n\n${result}`
      }, { quoted: msg });

    } catch (err) {
      console.error("OpenAI Error:", err);

      await socket.sendMessage(sender, {
        text: `❌ ${err?.response?.data?.message || err.message}`
      }, { quoted: msg });
    }
  }
};

// --------------------------- WORMGPT ---------------------------
module.exports = {
  name: "wormgpt",
  command: ["wormgpt", "worm"],

  async execute({ socket, msg, sender }) {
    try {
      const text = msg.message?.conversation ||
                   msg.message?.extendedTextMessage?.text;

      if (!text) {
        return await socket.sendMessage(sender, {
          text: "❌ Pʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴀ ᴘʀᴏᴍᴘᴛ.\n\nExᴀᴍᴘʟᴇ : .ᴡᴏʀᴍɢᴘᴛ ʜᴇʟʟᴏ"
        }, { quoted: msg });
      }

      const q = text.replace(/^[.!\/](wormgpt|worm)\s*/i, "");

      if (!q) {
        return await socket.sendMessage(sender, {
          text: "Aꜱᴋ ꜱᴏᴍᴇᴛʜɪɴɢ 😒"
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        react: { text: "🪱", key: msg.key }
      });

      await socket.sendMessage(sender, {
        text: "> *Tʜɪɴᴋɪɴɢ... 🪱*"
      }, { quoted: msg });

      const url = `https://hiru-api-ai.vercel.app/api/wormgpt?apikey=hiru&q=${encodeURIComponent(q)}`;

      const res = await axios.get(url);
      const data = res.data;

      const result = data.result || data.data || data.answer;

      if (!result) {
        return await socket.sendMessage(sender, {
          text: "❌ Nᴏ ʀᴇꜱᴘᴏɴꜱᴇ ꜰʀᴏᴍ ᴡᴏʀᴍɢᴘᴛ."
        }, { quoted: msg });
      }

      await socket.sendMessage(sender, {
        text: `\`🪱 Wᴏʀᴍɢᴘᴛ Rᴇꜱᴘᴏɴꜱᴇ\`\n\n${result}`
      }, { quoted: msg });

    } catch (err) {
      console.error("WormGPT Error:", err);

      await socket.sendMessage(sender, {
        text: `❌ ${err?.response?.data?.message || err.message}`
      }, { quoted: msg });
    }
  }
};
