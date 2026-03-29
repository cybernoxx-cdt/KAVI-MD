const fs = require('fs');
try {
    if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
} catch (e) {
    console.warn('Dotenv not configured');
}

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {

    // ===== DATABASE =====
    MONGO_URI: process.env.MONGO_URI || '',
    MONGO_DB: process.env.MONGO_DB || 'KAVI-MD',

    // ===== BASIC =====
    PREFIX: process.env.PREFIX || '.',
    MAX_RETRIES: process.env.MAX_RETRIES || '3',
    ADMIN_LIST_PATH: process.env.ADMIN_LIST_PATH || './admin.json',

    // ===== AUTO FEATURES =====
    AUTO_AI: process.env.AUTO_AI || 'true',
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || 'true',
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'true',
    AUTO_RECORDING: process.env.AUTO_RECORDING || 'false',
    AUTO_TYPING: process.env.AUTO_TYPING || 'false',
    AUTO_READ_MESSAGE: process.env.AUTO_READ_MESSAGE || 'off',

    AUTO_LIKE_EMOJI: process.env.AUTO_LIKE_EMOJI
        ? JSON.parse(process.env.AUTO_LIKE_EMOJI)
        : ['🧩','🍉','💜','🌸','🪴','💊','💫','🍂','🌟','🎋','😶‍🌫️','🫀','🧿','👀','🤖','🚩','🥰','🗿','💙','🌝','🖤','💚'],

    // ===== MEDIA / LINKS =====
    IMAGE_PATH: process.env.IMAGE_PATH || 'https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg',
    CHANNEL_LINK: process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/0029VbCG0yxEwEk21tFzPT16',
    GROUP_INVITE_LINK: process.env.GROUP_INVITE_LINK || 'https://chat.whatsapp.com/I6Lp7tGGtZE1aHvhtiy3KQ?mode=gi_t',

    // ===== NEWSLETTER =====
    NEWSLETTER_JID: process.env.NEWSLETTER_JID || '120363405871120956@newsletter',
    NEWSLETTER_MESSAGE_ID: process.env.NEWSLETTER_MESSAGE_ID || '428',

    // ===== OTP =====
    OTP_EXPIRY: process.env.OTP_EXPIRY || '300000',

    // ===== BOT INFO =====
    BOT_NAME: process.env.BOT_NAME || 'Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ',
    OWNER_NAME: process.env.OWNER_NAME || 'Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ❊',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '94707085822',
    BOT_VERSION: process.env.BOT_VERSION || '1.0.0',
    BOT_FOOTER: process.env.BOT_FOOTER || '> ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ',

    // ===== ADDITIONAL CONFIG =====
    WORK_TYPE: process.env.WORK_TYPE || 'public', // ᴘᴜʙʟɪᴄ , ᴘʀɪᴠᴀᴛᴇ , ɪɴʙᴏx , ɢʀᴏᴜᴘꜱ.
    ANTI_CALL: process.env.ANTI_CALL || 'off',
};





    
