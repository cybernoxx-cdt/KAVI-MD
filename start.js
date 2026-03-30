const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const router = express.Router();
const pino = require('pino');
const moment = require('moment-timezone');
const Jimp = require('jimp');
const crypto = require('crypto');
const axios = require('axios');
const FileType = require('file-type');
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
const config = require('./settings')
  
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  getContentType,
  makeCacheableSignalKeyStore,
  Browsers,
  jidNormalizedUser,
  downloadContentFromMessage,
  DisconnectReason
} = require('supunmd-bail');

// Hᴇʟᴘᴇʀ ꜰᴜɴᴛɪᴏɴ ꜰᴏʀ ᴊꜱᴏɴ ꜰᴇᴛᴄʜ
async function fetchJson(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Fetch JSON error:', error);
    return null;
  }
}

// ===== DATABASE =====
//const MONGO_URI = config.MONGO_URI;
//const MONGO_DB = config.MONGO_DB;

// ===== BASIC =====
const PREFIX = config.PREFIX;
const MAX_RETRIES = Number(config.MAX_RETRIES);
const ADMIN_LIST_PATH = config.ADMIN_LIST_PATH;

// ===== AUTO FEATURES =====
const AUTO_AI = config.AUTO_AI === 'true';
const AUTO_VIEW_STATUS = config.AUTO_VIEW_STATUS === 'true';
const AUTO_LIKE_STATUS = config.AUTO_LIKE_STATUS === 'true';
const AUTO_RECORDING = config.AUTO_RECORDING === 'true';
const AUTO_LIKE_EMOJI = config.AUTO_LIKE_EMOJI;

// ===== MEDIA / LINKS =====
const IMAGE_PATH = config.IMAGE_PATH;
const CHANNEL_LINK = config.CHANNEL_LINK;
const GROUP_INVITE_LINK = config.GROUP_INVITE_LINK;

// ===== NEWSLETTER =====
const NEWSLETTER_JID = config.NEWSLETTER_JID;
const NEWSLETTER_MESSAGE_ID = config.NEWSLETTER_MESSAGE_ID;

// ===== OTP =====
const OTP_EXPIRY = Number(config.OTP_EXPIRY);

// ===== BOT INFO =====
const BOT_NAME = config.BOT_NAME;
const OWNER_NAME = config.OWNER_NAME;
const OWNER_NUMBER = config.OWNER_NUMBER;
const BOT_VERSION = config.BOT_VERSION;
const BOT_FOOTER = config.BOT_FOOTER;

const BOT_NAME_FANCY = 'Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ';
/*
const config = {
  AUTO_AI: true,           // ᴛʀᴜᴇ => ᴀᴜᴛᴏ AI ʀᴇᴘʟʏ ON, ꜰᴀʟꜱᴇ => OFF
  AUTO_VIEW_STATUS: 'true',
  AUTO_LIKE_STATUS: 'true',
  AUTO_RECORDING: 'false',
  AUTO_LIKE_EMOJI: ['☘️','💗','🫂','🙈','🍁','🙃','🧸','😘','🏴‍☠️','👀','❤️‍🔥'],
  PREFIX: '.',
  MAX_RETRIES: 3,
  GROUP_INVITE_LINK: 'https://chat.whatsapp.com/I6Lp7tGGtZE1aHvhtiy3KQ?mode=gi_t',
  RCD_IMAGE_PATH: 'https://files.catbox.moe/wumdu3.jpg',
  NEWSLETTER_JID: '120363405871120956@newsletter',
  OTP_EXPIRY: 300000,
  OWNER_NUMBER: process.env.OWNER_NUMBER || '94707085822',
  CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbCG0yxEwEk21tFzPT16',
  BOT_NAME: 'Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ',
  BOT_VERSION: '1.0.0',
  OWNER_NAME: 'Sᴀᴠᴇɴᴅʀᴀ Dᴀᴍᴘʀɪʏᴀ ❊',
  IMAGE_PATH: 'https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg',
  BOT_FOOTER: '> ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍɪɴɪ',
  BUTTON_IMAGES: { ALIVE: 'https://i.ibb.co/SzsVXwp/1bf2ea0ee756.jpg' }
};
*/


/* ===== ADD THIS HERE (ᴘʟᴜɢɪɴ ʟᴏᴀᴅᴇʀ) ===== */

const plugins = [];
const pluginPath = path.join(__dirname, "plugins");

if (fs.existsSync(pluginPath)) {
    fs.readdirSync(pluginPath)
        .filter(file => file.endsWith(".js"))
        .forEach(file => {
            try {
                const plugin = require(path.join(pluginPath, file));
                plugins.push(plugin);
                console.log("✅ Lᴏᴀᴅᴇᴅ ᴘʟᴜɢɪɴ:", plugin.name);
            } catch (e) {
                console.error("❌ Pʟᴜɢɪɴ ʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ:", file, e.message);
            }
        });
}

/* ===== END ===== */

// ---------------- MONGO SETUP ----------------

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://botmini:botmini@minibot.upglk0f.mongodb.net/?retryWrites=true&w=majority';
const MONGO_DB = process.env.MONGO_DB || 'KAVI-MD';

let mongoClient, mongoDB;
let sessionsCol, numbersCol, adminsCol, newsletterCol, configsCol, newsletterReactsCol;

async function initMongo() {
  try {
    if (mongoClient) { try { await mongoClient.db().command({ ping: 1 }); return; } catch(e) {} }
  } catch(e){}
  mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  mongoDB = mongoClient.db(MONGO_DB);

  sessionsCol = mongoDB.collection('sessions');
  numbersCol = mongoDB.collection('numbers');
  adminsCol = mongoDB.collection('admins');
  newsletterCol = mongoDB.collection('newsletter_list');
  configsCol = mongoDB.collection('configs');
  newsletterReactsCol = mongoDB.collection('newsletter_reacts');

  await sessionsCol.createIndex({ number: 1 }, { unique: true });
  await numbersCol.createIndex({ number: 1 }, { unique: true });
  await newsletterCol.createIndex({ jid: 1 }, { unique: true });
  await newsletterReactsCol.createIndex({ jid: 1 }, { unique: true });
  await configsCol.createIndex({ number: 1 }, { unique: true });
  console.log('✅ Mᴏɴɢᴏ ɪɴɪᴛɪᴀʟɪᴢᴇᴅ ᴀɴᴅ ᴄᴏʟʟᴇᴄᴛɪᴏɴꜱ ʀᴇᴀᴅʏ');
}

// ---------------- MONGO HELPERS ----------------

async function saveCredsToMongo(number, creds, keys = null) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    const doc = { number: sanitized, creds, keys, updatedAt: new Date() };
    await sessionsCol.updateOne({ number: sanitized }, { $set: doc }, { upsert: true });
    console.log(`Sᴀᴠᴇᴅ ᴄʀᴇᴅꜱ ᴛᴏ ᴍᴏɴɢᴏ ꜰᴏʀ ${sanitized}`);
  } catch (e) { console.error('saveCredsToMongo error:', e); }
}

async function loadCredsFromMongo(number) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    const doc = await sessionsCol.findOne({ number: sanitized });
    return doc || null;
  } catch (e) { console.error('loadCredsFromMongo error:', e); return null; }
}

async function removeSessionFromMongo(number) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    await sessionsCol.deleteOne({ number: sanitized });
    console.log(`Rᴇᴍᴏᴠᴇᴅ ꜱᴇꜱꜱɪᴏɴ ꜰʀᴏᴍ ᴍᴏɴɢᴏ ꜰᴏʀ ${sanitized}`);
  } catch (e) { console.error('removeSessionToMongo error:', e); }
}

async function addNumberToMongo(number) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    await numbersCol.updateOne({ number: sanitized }, { $set: { number: sanitized } }, { upsert: true });
    console.log(`Aᴅᴅᴇᴅ ɴᴜᴍʙᴇʀ ${sanitized} ᴛᴏ ᴍᴏɴɢᴏ ɴᴜᴍʙᴇʀꜱ`);
  } catch (e) { console.error('addNumberToMongo', e); }
}

async function removeNumberFromMongo(number) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    await numbersCol.deleteOne({ number: sanitized });
    console.log(`Rᴇᴍᴏᴠᴇᴅ ɴᴜᴍʙᴇʀ ${sanitized} ꜰʀᴏᴍ ᴍᴏɴɢᴏ ɴᴜᴍʙᴇʀꜱ`);
  } catch (e) { console.error('removeNumberFromMongo', e); }
}

async function getAllNumbersFromMongo() {
  try {
    await initMongo();
    const docs = await numbersCol.find({}).toArray();
    return docs.map(d => d.number);
  } catch (e) { console.error('getAllNumbersFromMongo', e); return []; }
}

async function loadAdminsFromMongo() {
  try {
    await initMongo();
    const docs = await adminsCol.find({}).toArray();
    return docs.map(d => d.jid || d.number).filter(Boolean);
  } catch (e) { console.error('loadAdminsFromMongo', e); return []; }
}

async function addAdminToMongo(jidOrNumber) {
  try {
    await initMongo();
    const doc = { jid: jidOrNumber };
    await adminsCol.updateOne({ jid: jidOrNumber }, { $set: doc }, { upsert: true });
    console.log(`Aᴅᴅᴇᴅ ᴀᴅᴍɪɴ ${jidOrNumber}`);
  } catch (e) { console.error('addAdminToMongo', e); }
}

async function removeAdminFromMongo(jidOrNumber) {
  try {
    await initMongo();
    await adminsCol.deleteOne({ jid: jidOrNumber });
    console.log(`Rᴇᴍᴏᴠᴇᴅ ᴀᴅᴍɪɴ ${jidOrNumber}`);
  } catch (e) { console.error('removeAdminFromMongo', e); }
}

async function addNewsletterToMongo(jid, emojis = []) {
  try {
    await initMongo();
    const doc = { jid, emojis: Array.isArray(emojis) ? emojis : [], addedAt: new Date() };
    await newsletterCol.updateOne({ jid }, { $set: doc }, { upsert: true });
    console.log(`Aᴅᴅᴇᴅ ɴᴇᴡꜱʟᴇᴛᴛᴇʀr ${jid} -> ᴇᴍᴏᴊɪᴇꜱ: ${doc.emojis.join(',')}`);
  } catch (e) { console.error('addNewsletterToMongo', e); throw e; }
}

async function removeNewsletterFromMongo(jid) {
  try {
    await initMongo();
    await newsletterCol.deleteOne({ jid });
    console.log(`Rᴇᴍᴏᴠᴇᴅ ɴᴇᴡꜱʟᴇᴛᴛᴇʀ ${jid}`);
  } catch (e) { console.error('removeNewsletterFromMongo', e); throw e; }
}

async function listNewslettersFromMongo() {
  try {
    await initMongo();
    const docs = await newsletterCol.find({}).toArray();
    return docs.map(d => ({ jid: d.jid, emojis: Array.isArray(d.emojis) ? d.emojis : [] }));
  } catch (e) { console.error('listNewslettersFromMongo', e); return []; }
}

async function saveNewsletterReaction(jid, messageId, emoji, sessionNumber) {
  try {
    await initMongo();
    const doc = { jid, messageId, emoji, sessionNumber, ts: new Date() };
    if (!mongoDB) await initMongo();
    const col = mongoDB.collection('newsletter_reactions_log');
    await col.insertOne(doc);
    console.log(`Sᴀᴠᴇᴅ ʀᴇᴀᴄᴛɪᴏɴ ${emoji} ꜰᴏʀ ${jid}#${messageId}`);
  } catch (e) { console.error('saveNewsletterReaction', e); }
}

async function setUserConfigInMongo(number, conf) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    await configsCol.updateOne({ number: sanitized }, { $set: { number: sanitized, config: conf, updatedAt: new Date() } }, { upsert: true });
  } catch (e) { console.error('setUserConfigInMongo', e); }
}

async function loadUserConfigFromMongo(number) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    const doc = await configsCol.findOne({ number: sanitized });
    return doc ? doc.config : null;
  } catch (e) { console.error('loadUserConfigFromMongo', e); return null; }
}

// -------------- NEWSLETTER REACT CONFIG HELPERS --------------

async function addNewsletterReactConfig(jid, emojis = []) {
  try {
    await initMongo();
    await newsletterReactsCol.updateOne({ jid }, { $set: { jid, emojis, addedAt: new Date() } }, { upsert: true });
    console.log(`Aᴅᴅᴇᴅ ʀᴇᴀᴄᴛ ᴄᴏɴꜰɪɢ ꜰᴏʀ ${jid} -> ${emojis.join(',')}`);
  } catch (e) { console.error('addNewsletterReactConfig', e); throw e; }
}

async function removeNewsletterReactConfig(jid) {
  try {
    await initMongo();
    await newsletterReactsCol.deleteOne({ jid });
    console.log(`Rᴇᴍᴏᴠᴇᴅ ʀᴇᴀᴄᴛ ᴄᴏɴꜰɪɢ ꜰᴏʀ ${jid}`);
  } catch (e) { console.error('removeNewsletterReactConfig', e); throw e; }
}

async function listNewsletterReactsFromMongo() {
  try {
    await initMongo();
    const docs = await newsletterReactsCol.find({}).toArray();
    return docs.map(d => ({ jid: d.jid, emojis: Array.isArray(d.emojis) ? d.emojis : [] }));
  } catch (e) { console.error('listNewsletterReactsFromMongo', e); return []; }
}

async function getReactConfigForJid(jid) {
  try {
    await initMongo();
    const doc = await newsletterReactsCol.findOne({ jid });
    return doc ? (Array.isArray(doc.emojis) ? doc.emojis : []) : null;
  } catch (e) { console.error('getReactConfigForJid', e); return null; }
}

// ---------------- BASIC UTILS ----------------

function formatMessage(title, content, footer) {
  return `${title}\n\n${content}\n\n${footer}`;
}
function generateOTP(){ return Math.floor(100000 + Math.random() * 900000).toString(); }
function getSriLankaTimestamp(){ return moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss'); }

const activeSockets = new Map();

const socketCreationTime = new Map();

const otpStore = new Map();

// ─── IN-MEMORY CACHE (eliminates per-message Mongo reads) ─────────────
const _cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
function cacheGet(key) {
  const e = _cache.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > CACHE_TTL) { _cache.delete(key); return null; }
  return e.val;
}
function cacheSet(key, val) { _cache.set(key, { val, ts: Date.now() }); }
function cacheDel(key) { _cache.delete(key); }
async function loadUserConfigCached(num) {
  const k = 'ucfg:' + num;
  const h = cacheGet(k); if (h !== null) return h;
  const v = await loadUserConfigFromMongo(num); cacheSet(k, v); return v;
}
async function listNewslettersCached() {
  const h = cacheGet('nls'); if (h !== null) return h;
  const v = await listNewslettersFromMongo(); cacheSet('nls', v); return v;
}
async function listNewsletterReactsCached() {
  const h = cacheGet('nlr'); if (h !== null) return h;
  const v = await listNewsletterReactsFromMongo(); cacheSet('nlr', v); return v;
}
async function loadAdminsCached() {
  const h = cacheGet('adm'); if (h !== null) return h;
  const v = await loadAdminsFromMongo(); cacheSet('adm', v); return v;
}
// ──────────────────────────────────────────────────────────────────────

// ---------------- HELPERS KEPT/ADAPTED ----------------

async function joinGroup(socket) {
  let retries = config.MAX_RETRIES;
  const inviteCodeMatch = (config.GROUP_INVITE_LINK || '').match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
  if (!inviteCodeMatch) return { status: 'failed', error: 'Nᴏ ɢʀᴏᴜᴘ ɪɴᴠɪᴛᴇ ᴄᴏɴꜰɪɢᴜʀᴇᴅ' };
  const inviteCode = inviteCodeMatch[1];
  while (retries > 0) {
    try {
      const response = await socket.groupAcceptInvite(inviteCode);
      if (response?.gid) return { status: 'success', gid: response.gid };
      throw new Error('Nᴏ ɢʀᴏᴜᴘ ɪᴅ ɪɴ ʀᴇꜱᴘᴏɴᴄᴇ');
    } catch (error) {
      retries--;
      let errorMessage = error.message || 'Unknown error';
      if (error.message && error.message.includes('not-authorized')) errorMessage = 'Bᴏᴛ ɴᴏᴛ ᴀᴜᴛʜᴏʀɪᴢᴇᴅ';
      else if (error.message && error.message.includes('conflict')) errorMessage = 'Aʟʀᴇᴀᴅʏ ᴀ ᴍᴇᴍʙᴇʀ';
      else if (error.message && error.message.includes('gone')) errorMessage = 'Iɴᴠɪᴛᴇ ɪɴᴠᴀʟɪᴅ/ᴇxᴘɪʀᴇᴅ';
      if (retries === 0) return { status: 'failed', error: errorMessage };
      await delay(2000 * (config.MAX_RETRIES - retries));
    }
  }
  return { status: 'failed', error: 'Mᴀx ʀᴇᴛʀɪᴇꜱ ʀᴇᴀᴄʜᴇᴅ' };
}

async function sendAdminConnectMessage(socket, number, groupResult, sessionConfig = {}) {
  const admins = await loadAdminsCached();
  const groupStatus = groupResult.status === 'success' ? `Joined (ID: ${groupResult.gid})` : `Fᴀɪʟᴇᴅ ᴛᴏ ᴊᴏɪɴ ɢʀᴏᴜᴘ: ${groupResult.error}`;
  const botName = sessionConfig.botName || BOT_NAME_FANCY;
  const image = sessionConfig.logo || config.IMAGE_PATH;
  const caption = formatMessage(botName, `Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴍɪɴɪ ʙᴏʏ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴛᴏ ᴛʜɪꜱ ɴᴜᴍʙᴇʀ 🌸.ᴀ ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱʜᴀᴠɪʏᴀ ᴛᴍ.\n*📞 Nᴜᴍʙᴇʀ :* ${number}\n*🍁 Sᴛᴀᴛᴜꜱ :* ${groupStatus}\n*🕒 Cᴏɴɴᴇᴄᴛᴇᴅ Aᴛ :* ${getSriLankaTimestamp()}`, config.BOT_FOOTER);
  for (const admin of admins) {
    try {
      const to = admin.includes('@') ? admin : `${admin}@s.whatsapp.net`;
      if (String(image).startsWith('http')) {
        await socket.sendMessage(to, { image: { url: image }, caption });
      } else {
        try {
          const buf = fs.readFileSync(image);
          await socket.sendMessage(to, { image: buf, caption });
        } catch (e) {
          await socket.sendMessage(to, { image: { url: config.IMAGE_PATH }, caption });
        }
      }
    } catch (err) {
      console.error('Fᴀɪʟᴇᴅ ᴛᴏ ꜱᴇɴᴅ ᴄᴏɴɴᴇᴄᴛ ᴍᴀꜱꜱᴇɢᴇ ᴛᴏ ᴀᴅᴅᴍɪɴ', admin, err?.message || err);
    }
  }
}

async function sendOwnerConnectMessage(socket, number, groupResult, sessionConfig = {}) {
  try {
    const ownerJid = `${config.OWNER_NUMBER.replace(/[^0-9]/g,'')}@s.whatsapp.net`;
    const activeCount = activeSockets.size;
    const botName = sessionConfig.botName || BOT_NAME_FANCY;
    const image = sessionConfig.logo || config.IMAGE_PATH;
    const groupStatus = groupResult.status === 'success' ? `Joined (ID: ${groupResult.gid})` : `Fᴀɪʟᴇᴅ ᴛᴏ ᴊᴏɪɴ ɢʀᴏᴜᴘ: ${groupResult.error}`;
    const caption = formatMessage(`Qᴜᴇᴇɴ ᴋᴀᴠɪ ᴍᴅ ᴍɪɴɪ ʙᴏʏ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴛᴏ ᴛʜɪꜱ ɴᴜᴍʙᴇʀ 🌸.ᴀ ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱʜᴀᴠɪʏᴀ ᴛᴍ.\n👨‍💻 Oᴡɴᴇʀ Nᴀᴍᴇ :* ${config.OWNER_NAME}`, `*📞 Nᴜᴍʙᴇʀ :* ${number}\n*🍁 Sᴛᴀᴛᴜꜱ :* ${groupStatus}\n*🕒 Cᴏɴɴᴇᴄᴛᴇᴅ Aᴛ :* ${getSriLankaTimestamp()}\n\n*🔢 Aᴄᴛɪᴠᴇ Sᴇꜱꜱɪᴏɴꜱ :* ${activeCount}`, config.BOT_FOOTER);
    if (String(image).startsWith('http')) {
      await socket.sendMessage(ownerJid, { image: { url: image }, caption });
    } else {
      try {
        const buf = fs.readFileSync(image);
        await socket.sendMessage(ownerJid, { image: buf, caption });
      } catch (e) {
        await socket.sendMessage(ownerJid, { image: { url: config.IMAGE_PATH }, caption });
      }
    }
  } catch (err) { console.error('Fᴀɪʟᴇᴅ ᴛᴏ ꜱᴇɴᴅ ᴡᴏɴᴇʀ ᴄᴏɴɴᴇᴄᴛ ᴍᴀꜱꜱᴇɢᴇ:', err); }
}

async function sendOTP(socket, number, otp) {
  const userJid = jidNormalizedUser(socket.user.id);
  const message = formatMessage(`*🔐 Oᴛᴘ Vᴇʀʏꜰɪᴄᴀᴛɪᴏɴ — ${BOT_NAME_FANCY}*`, `*𝐘ᴏᴜʀ 𝐎ᴛᴘ 𝐅ᴏʀ 𝐂ᴏɴꜰɪɢ 𝐔ᴘᴅᴀᴛᴇ 𝐈ꜱ:* *${otp}*\n𝐓ʜɪꜱ 𝐎ᴛᴘ 𝐖ɪʟʟ 𝐄xᴘɪʀᴇ 𝐈ɴ 5 𝐌ɪɴᴜᴛᴇꜱ.\n\n*𝐍ᴜᴍʙᴇʀ :* ${number}`, BOT_NAME_FANCY);
  try { await socket.sendMessage(userJid, { text: message }); console.log(`OTP ${otp} ꜱᴇɴᴛ ᴛᴏ ${number}`); }
  catch (error) { console.error(`Fᴀɪʟᴇᴅ ᴛᴏ ꜱᴇɴᴅ ᴏᴛᴘ ᴛᴏ ${number}:`, error); throw error; }
}

// ---------------- HANDLERS (NEWSLETTER + REACTIONS) ----------------

async function setupNewsletterHandlers(socket, sessionNumber) {
  const rrPointers = new Map();

  socket.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0];
    if (!message?.key) return;
    const jid = message.key.remoteJid;

    try {
      const followedDocs = await listNewslettersCached();
      const reactConfigs = await listNewsletterReactsCached();
      const reactMap = new Map();
      for (const r of reactConfigs) reactMap.set(r.jid, r.emojis || []);

      const followedJids = followedDocs.map(d => d.jid);
      if (!followedJids.includes(jid) && !reactMap.has(jid)) return;

      let emojis = reactMap.get(jid) || null;
      if ((!emojis || emojis.length === 0) && followedDocs.find(d => d.jid === jid)) {
        emojis = (followedDocs.find(d => d.jid === jid).emojis || []);
      }
      if (!emojis || emojis.length === 0) emojis = config.AUTO_LIKE_EMOJI;

      let idx = rrPointers.get(jid) || 0;
      const emoji = emojis[idx % emojis.length];
      rrPointers.set(jid, (idx + 1) % emojis.length);

      const messageId = message.newsletterServerId || message.key.id;
      if (!messageId) return;

      let retries = 3;
      while (retries-- > 0) {
        try {
          if (typeof socket.newsletterReactMessage === 'function') {
            await socket.newsletterReactMessage(jid, messageId.toString(), emoji);
          } else {
            await socket.sendMessage(jid, { react: { text: emoji, key: message.key } });
          }
          console.log(`Rᴇᴀᴄᴛᴇᴅ ᴛᴏ ${jid} ${messageId} ᴡɪᴛʜ ${emoji}`);
          await saveNewsletterReaction(jid, messageId.toString(), emoji, sessionNumber || null);
          break;
        } catch (err) {
          console.warn(`Rᴇᴀᴄᴛɪᴏɴ ᴀᴛᴛᴇᴍᴘᴛ ꜰᴀɪʟᴇᴅ (${3 - retries}/3):`, err?.message || err);
          await delay(1200);
        }
      }

    } catch (error) {
      console.error('Nᴇᴡꜱʟᴇᴛᴛᴇʀ ʀᴇᴀᴄᴛɪᴏɴ ʜᴀɴᴅʟᴇʀ ᴇʀʀᴏʀ:', error?.message || error);
    }
  });
}


// ---------------- STATUS + REVOCATION + RESIZING ----------------

async function setupStatusHandlers(socket, sessionNumber) {
  socket.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0];
    if (!message?.key || message.key.remoteJid !== 'status@broadcast' || !message.key.participant) return;
    
    try {
      // Lᴏᴀᴅ ᴜꜱᴇʀ-ꜱᴘᴇᴄɪꜰɪᴄ ᴄᴏɴꜰɪɢ ꜰʀᴏᴍ ᴍᴏɴɢᴏᴅʙ
      let userEmojis = config.AUTO_LIKE_EMOJI; // Dᴇꜰᴀᴜʟᴛ ᴇᴍᴏᴊɪꜱ
      let autoViewStatus = config.AUTO_VIEW_STATUS; // Dᴇꜰᴀᴜʟᴛ ꜰʀᴏᴍ ɢʟᴏʙᴀʟ ᴄᴏɴꜰɪɢ
      let autoLikeStatus = config.AUTO_LIKE_STATUS; // Dᴇꜰᴀᴜʟᴛ ꜰʀᴏᴍ ɢʟᴏʙᴀʟ ᴄᴏɴꜰɪɢ
      let autoRecording = config.AUTO_RECORDING; // Dᴇꜰᴀᴜʟᴛ ꜰʀᴏᴍ ɢʟᴏʙᴀʟ ᴄᴏɴꜰɪɢ
      
      if (sessionNumber) {
        const userConfig = await loadUserConfigCached(sessionNumber) || {};
        
        // Cʜᴇᴄᴋ ꜰᴏʀ ᴇᴍᴏᴊɪꜱ ɪɴ ᴜꜱᴇʀ ᴄᴏɴꜰɪɢ
        if (userConfig.AUTO_LIKE_EMOJI && Array.isArray(userConfig.AUTO_LIKE_EMOJI) && userConfig.AUTO_LIKE_EMOJI.length > 0) {
          userEmojis = userConfig.AUTO_LIKE_EMOJI;
        }
        
        // Cʜᴇᴄᴋ ꜰᴏʀ ᴀᴜᴛᴏ ᴠɪᴇᴡ ꜱᴛᴀᴛᴜꜱ ɪɴ ᴜꜱᴇʀ ᴄᴏɴꜰɪɢ
        if (userConfig.AUTO_VIEW_STATUS !== undefined) {
          autoViewStatus = userConfig.AUTO_VIEW_STATUS;
        }
        
        // Cʜᴇᴄᴋ ꜰᴏʀ ᴀᴜᴛᴏ ʟɪᴋᴇ ꜱᴛᴀᴛᴜꜱ ɪɴ ᴜꜱᴇʀ ᴄᴏɴꜰɪɢ
        if (userConfig.AUTO_LIKE_STATUS !== undefined) {
          autoLikeStatus = userConfig.AUTO_LIKE_STATUS;
        }
        
        // Cʜᴇᴄᴋ ꜰᴏʀ ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅɪɴɢ ɪɴ ᴜꜱᴇʀ ᴄᴏɴꜰɪɢ
        if (userConfig.AUTO_RECORDING !== undefined) {
          autoRecording = userConfig.AUTO_RECORDING;
        }
      }

      // Uꜱᴇ ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅɪɴɢ ꜱᴇᴛᴛɪɴɢ (ꜰʀᴏᴍ ᴜꜱᴇʀ ᴄᴏɴꜰɪɢ ᴏʀ ɢʟᴏʙᴀʟ)
      if (autoRecording === 'true') {
        await socket.sendPresenceUpdate("recording", message.key.remoteJid);
      }
      
      // Uꜱᴇ ᴀᴜᴛᴏ ᴠɪᴇᴡ ꜱᴛᴀᴛᴜꜱ ꜱᴇᴛᴛɪɴɢ (ꜰʀᴏᴍ ᴜꜱᴇʀ ᴄᴏɴꜰɪɢ ᴏʀ ɢʟᴏʙᴀʟ)
      if (autoViewStatus === 'true') {
        let retries = config.MAX_RETRIES;
        while (retries > 0) {
          try { 
            await socket.readMessages([message.key]); 
            break; 
          } catch (error) { 
            retries--; 
            await delay(1000 * (config.MAX_RETRIES - retries)); 
            if (retries===0) throw error; 
          }
        }
      }
      
      // Uꜱᴇ ᴀᴜᴛᴏ ʟɪᴋᴇ ꜱᴛᴀᴛᴜꜱ ꜱᴇᴛᴛɪɴɢ (ꜰʀᴏᴍ ᴜꜱᴇʀ ᴄᴏɴꜰɪɢ ᴏʀ ɢʟᴏʙᴀʟ)
      if (autoLikeStatus === 'true') {
        const randomEmoji = userEmojis[Math.floor(Math.random() * userEmojis.length)];
        let retries = config.MAX_RETRIES;
        while (retries > 0) {
          try {
            await socket.sendMessage(message.key.remoteJid, { 
              react: { text: randomEmoji, key: message.key } 
            }, { statusJidList: [message.key.participant] });
            break;
          } catch (error) { 
            retries--; 
            await delay(1000 * (config.MAX_RETRIES - retries)); 
            if (retries===0) throw error; 
          }
        }
      }

    } catch (error) { 
      console.error('Sᴛᴀᴛᴜꜱ ʜᴀᴍᴅʟᴇʀ ᴇʀʀᴏʀ:', error); 
    }
  });
}


async function handleMessageRevocation(socket, number) {
  socket.ev.on('messages.delete', async ({ keys }) => {
    if (!keys || keys.length === 0) return;
    const messageKey = keys[0];
    const userJid = jidNormalizedUser(socket.user.id);
    const deletionTime = getSriLankaTimestamp();
    const message = formatMessage('*🗑️ Mᴇꜱꜱᴀɢᴇ Dᴇʟᴇᴛᴇᴅ*', `A ᴍᴇꜱꜱᴀɢᴇ ᴡᴀꜱ ᴅᴇʟᴇᴛᴇᴅ ꜰʀᴏᴍ ʏᴏᴜʀ ᴄʜᴀᴛ.\n\n*📋 Fʀᴏᴍ :* ${messageKey.remoteJid}\n*🍁 Dᴇʟᴇᴛɪᴏɴ Tɪᴍᴇ :* ${deletionTime}`, BOT_NAME_FANCY);
    try { await socket.sendMessage(userJid, { image: { url: config.IMAGE_PATH }, caption: message }); }
    catch (error) { console.error('Fᴀɪʟᴇᴅ ᴛᴏ ꜱᴇᴍᴅ ᴅᴇʟᴇᴛɪᴏɴ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ:', error); }
  });
}


async function resize(image, width, height) {
  let oyy = await Jimp.read(image);
  return await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG);
}


//----------


async function handleMessage(msg) {
    try {
        const sender = msg.key.remoteJid;
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
        if (!text || msg.key.fromMe) return; // ɪɢɴᴏʀᴇ ᴏᴡɴ ᴍᴇꜱꜱᴀɢᴇꜱ

        // AUTO_AI CHECK
        if (!config.AUTO_AI) return; // FLASE නම් SKIP කරන්න

        const botName = config.BOT_NAME || 'Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ';

        const metaQuote = {
            key: {
                remoteJid: sender,
                participant: sender,
                fromMe: false
            },
            message: {
                contactMessage: {
                    displayName: botName,
                    vcard: `BEGIN:VCARD
VERSION:3.0
FN:${botName}
ORG:META AI
END:VCARD`
                }
            }
        };

        await socket.sendMessage(sender, { react: { text: '🤖', key: msg.key } });

        const prompt = `
ඔයා සැබෑ ගැහැනු ළමයෙක් වගේ හැසිරෙන්න.
ඔයාගේ නම ${botName}.
Sinhala විතරක් භාවිතා කරන්න.

"ඔයාව හැදුවේ කවුද?" කියලා ඇහුවොත් විතරක්
"මාව හැදුවේ හංසි මැණික අනේ" කියන්න.

Uꜱᴇʀ Mᴇꜱꜱᴀɢᴇ:
${text}
`;

        const url = `https://delirius-apiofc.vercel.app/ia/chatgpt?q=${encodeURIComponent(prompt)}`;
        const res = await fetchJson(url);
        const aiReply = res?.result;
        if (!aiReply) return;

        // Sᴇɴᴅ ʀᴇᴘʟʏ ᴏɴʟʏ ɪꜰ AUTO_AI ɪꜱ ON
        if (config.AUTO_AI) {
            await socket.sendMessage(sender, { text: aiReply, quoted: metaQuote });
        }

    } catch (e) {
        console.error('AUTO AI ERROR:', e);
    }
}
// ---------------- COMMAND HANDLERS ----------------

function setupCommandHandlers(socket, number) {
  socket.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg || !msg.message || msg.key.remoteJid === 'status@broadcast' || msg.key.remoteJid === config.NEWSLETTER_JID) return;

    const type = getContentType(msg.message);
    if (!msg.message) return;
    msg.message = (getContentType(msg.message) === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message;

    const from = msg.key.remoteJid;
    const sender = from;
    const nowsender = msg.key.fromMe ? (socket.user.id.split(':')[0] + '@s.whatsapp.net' || socket.user.id) : (msg.key.participant || msg.key.remoteJid);
    const senderNumber = (nowsender || '').split('@')[0];
    const developers = `${config.OWNER_NUMBER}`;
    const botNumber = socket.user.id.split(':')[0];
    const isbot = botNumber.includes(senderNumber);
    const isOwner = isbot ? isbot : developers.includes(senderNumber);
    const isGroup = from.endsWith("@g.us");


    const body = (type === 'conversation') ? msg.message.conversation
      : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text
      : (type === 'imageMessage' && msg.message.imageMessage.caption) ? msg.message.imageMessage.caption
      : (type === 'videoMessage' && msg.message.videoMessage.caption) ? msg.message.videoMessage.caption
      : (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage?.selectedButtonId
      : (type === 'listResponseMessage') ? msg.message.listResponseMessage?.singleSelectReply?.selectedRowId
      : (type === 'viewOnceMessage') ? (msg.message.viewOnceMessage?.message?.imageMessage?.caption || '') : '';

    if (!body || typeof body !== 'string') return;

    const prefix = config.PREFIX;
    const isCmd = body && body.startsWith && body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : null;
    const args = isCmd
  ? body.slice(prefix.length).trim().split(/ +/).slice(1)
  : [];

    // HELPER: DOWNLOAD QUOTED MEDIA INTO BUFFER
    async function downloadQuotedMedia(quoted) {
      if (!quoted) return null;
      const qTypes = ['imageMessage','videoMessage','audioMessage','documentMessage','stickerMessage'];
      const qType = qTypes.find(t => quoted[t]);
      if (!qType) return null;
      const messageType = qType.replace(/Message$/i, '').toLowerCase();
      const stream = await downloadContentFromMessage(quoted[qType], messageType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      return {
        buffer,
        mime: quoted[qType].mimetype || '',
        caption: quoted[qType].caption || quoted[qType].fileName || '',
        ptt: quoted[qType].ptt || false,
        fileName: quoted[qType].fileName || ''
      };
    }

    if (!command) return;

    /* =================================================
       🔌 PLUGIN EXECUTION LOGIC — ADD HERE
       ================================================= */

    for (const plugin of plugins) {
      if (
        plugin.command &&
        Array.isArray(plugin.command) &&
        plugin.command.includes(command)
      ) {
        try {
          await plugin.execute({
  socket,
  msg,
  args,
  command,
  config,
  isOwner,
  isGroup,
  sender
});
        } catch (err) {
          console.error(`❌ Pʟᴜɢɪɴ ᴇʀʀᴏʀ [${plugin.name}]`, err);
        }
        return; // ꜱᴛᴏᴘ ꜰᴜʀᴛʜᴇʀ ᴘʀᴏᴄᴇꜱꜱɪɴɢ
      }
    }


    /* =================================================
       🔽 BUILT-IN COMMANDS
       ================================================= */


    try {

      // Lᴏᴀᴅ ᴜꜱᴇʀ ᴄᴏɴꜰɪɢ ꜰᴏʀ ᴡᴏʀᴋ ᴛʏᴘᴇ ʀᴇꜱᴛʀɪᴄᴛɪᴏɴꜱ
      const sanitized = (number || '').replace(/[^0-9]/g, '');
      const userConfig = await loadUserConfigCached(sanitized) || {};
      
// ========== ADD WORK TYPE RESTRICTIONS HERE ==========
// Aᴘᴘʟʏ ᴡᴏʀᴋ ᴛʏᴘᴇ ʀᴇꜱᴛʀɪᴄᴛɪᴏɴꜱ ꜰᴏʀ ɴᴏɴ ᴏᴡɴᴇʀ ᴜꜱᴇʀꜱ
if (!isOwner) {
  // Gᴇᴛ ᴡᴏʀᴋ ᴛʏᴘᴇ ꜰʀᴏᴍ ᴜꜱᴇʀ ᴄᴏɴꜰɪɢ ᴏʀ ꜰᴀʟʟʙᴀᴄᴋ ᴛᴏ ɢᴏʙᴀʟ ᴄᴏɴꜰɪɢ
  const workType = userConfig.WORK_TYPE || 'public'; // Dᴇꜰᴀᴜʟᴛ ᴛᴏ ᴘᴜʙʟɪᴄ ɪꜰ ɴᴏᴛ ꜱᴇᴛ
  
  // Iꜰ ᴡᴏʀᴋ ᴛʏᴘᴇ ɪꜱ "ᴘʀɪᴠᴀᴛᴇ" ᴏɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜꜱᴇ ᴄᴏᴍᴍᴀɴᴅꜱ
  if (workType === "private") {
    console.log(`Cᴏᴍᴍᴀɴᴅ ʙʟᴏᴄᴋᴇᴅ: WORK_TYPE ɪꜱ ᴘʀɪᴠᴀᴛᴇ ꜰᴏʀ ${sanitized}`);
    return;
  }
  
  // Iꜰ ᴡᴏʀᴋ ᴛʏᴘᴇ ɪꜱ "ɪɴʙᴏx" ʙʟᴏᴄᴋ ᴄᴏᴍᴍᴀɴᴅꜱ ɪɴ ɢʀᴏᴜᴘꜱ
  if (isGroup && workType === "inbox") {
    console.log(`ᴄᴏᴍᴍᴀɴᴅ ʙʟᴏᴄᴋᴇᴅ: WORK_TYPE ɪꜱ ɪɴʙᴏx ʙᴜᴛ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ꜰʀᴏᴍ ɢʀᴏᴜᴘ ꜰᴏʀ ${sanitized}`);
    return;
  }
  
  // Iꜰ ᴡᴏʀᴋ ᴛʏᴘᴇ ɪꜱ "ɢʀᴏᴜᴘꜱ" ʙʟᴏᴄᴋ ᴄᴏᴍᴍᴀɴᴅꜱ ɪɴ ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛꜱ
  if (!isGroup && workType === "groups") {
    console.log(`Cᴏᴍᴍᴀɴᴅ ʙʟᴏᴄᴋᴇᴅ: WORK_TYPE ɪꜱ ɢʀᴏᴜᴘꜱ ʙᴜᴛ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ꜰʀᴏᴍ ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ ꜰᴏʀ ${sanitized}`);
    return;
  }
  
  // ɪꜰ ᴡᴏʀᴋ ᴛʏᴘᴇ ɪꜱ "ᴘᴜʙʟɪᴄ" ᴀʟʟᴏᴡ ᴀʟʟ
}
// ========== END WORK TYPE RESTRICTIONS ==========



      switch (command) {

case 'pair': {
	await socket.sendMessage(sender, {
      react: {
        text: "✅",
        key: msg.key
      }
    });
    const fetch = (...args) =>
        import('node-fetch').then(({ default: fetch }) => fetch(...args));

    // Fᴀᴋᴇ Qᴜᴀᴛᴇᴅ ᴄᴏɴᴛᴀᴄᴛ (ꜱᴛʏʟᴇ)
    const shala = {
        key: {
            remoteJid: "status@broadcast",
            participant: "0@s.whatsapp.net",
            fromMe: false,
            id: "MENU_FAKE_CONTACT"
        },
        message: {
            contactMessage: {
                displayName: config.BOT_NAME,
                vcard: `BEGIN:VCARD
VERSION:3.0
N:${config.BOT_NAME};;;;
FN:${config.BOT_NAME}
ORG:${config.BOT_NAME}
TEL;type=CELL;type=VOICE;waid=${botNumber}:${botNumber}
END:VCARD`
            }
        }
    };

    const q =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        '';

    const number = q.replace(/^[.\/!]pair\s*/i, '').trim();

    if (!number) {
        return await socket.sendMessage(sender, {
            text: '*📌 Uꜱᴀɢᴇ:* `.ᴘᴀɪʀ 947XXXXXXXX`'
        }, { quoted: shala });
    }

    try {
        const url = `https://queen-kavi-md-mini.onrender.com/code?number=${encodeURIComponent(number)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data || !data.code) {
            return await socket.sendMessage(sender, {
                text: '❌ Pᴀɪʀ ᴄᴏᴅᴇ ɢᴇɴᴇʀᴀᴛᴇ ꜰᴀɪʟᴇᴅ.'
            }, { quoted: shala });
        }

        // Rᴇᴀᴄᴛ ᴇᴍᴏᴊɪ
        await socket.sendMessage(sender, {
            react: { text: '🔑', key: msg.key }
        });

        const caption = 
`✅ *PAIR CODE GENERATED*

👤 *Uꜱᴇʀ :* ${number}
🔑 *Cᴏᴅᴇ :* ${data.code}

⚡ ᴄᴏᴘʏ ᴛʜᴇ ᴄᴏᴅᴇ ⚡

🎀 *${config.BOT_NAME}* 🎀`;


        await socket.sendMessage(sender, {
            text: caption,
            footer: config.BOT_FOOTER,
            buttons: [
        {
          buttonId: `${config.PREFIX}menu`,
          buttonText: { displayText: "🏷️ Mᴇɴᴜ" },
          type: 1
        },
        {
          buttonId: `${config.PREFIX}ping`,
          buttonText: { displayText: "⚡ Sᴘᴇᴇᴅ" },
          type: 1
        }
      ],
            headerType: 4
        }, { quoted: shala });

await socket.sendMessage(sender, {
        text:`${data.code}`
    }, { quoted: shala });


    } catch (err) {
        console.error(err);
        await socket.sendMessage(sender, {
            text: '❌ Sᴇʀᴠᴇʀ ᴇʀʀᴏʀ. Tʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.'
        }, { quoted: shala });
    }

    break;
}
        default:
          break;
      }
    } catch (err) {
      console.error('Cᴏᴍᴍᴀɴᴅ ʜᴀɴᴅʟᴇʀ ᴇʀʀᴏʀ:', err);
      try { await socket.sendMessage(sender, { image: { url: config.IMAGE_PATH }, caption: formatMessage('❌ ERROR', 'Aɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪᴏᴇ ᴘʀᴏᴄᴇꜱꜱɪɴɢ ʏᴏᴜʀ ᴄᴏᴍᴍᴀɴᴅ. ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ.', BOT_NAME_FANCY) }); } catch(e){}
    }

  });
}



// ---------------- SIMPLE CALL REJECTION HANDLER ----------------

async function setupCallRejection(socket, sessionNumber) {
    socket.ev.on('call', async (calls) => {
        try {
            // Lᴏᴀᴅ ᴜꜱᴇʀ ꜱᴘᴇᴄɪꜰɪx ᴄᴏɴꜰɪɢ ꜰʀᴏᴍ ᴍᴏɴᴏᴅʙ
            const sanitized = (sessionNumber || '').replace(/[^0-9]/g, '');
            const userConfig = await loadUserConfigCached(sanitized) || {};
            if (userConfig.ANTI_CALL !== 'on') return;

            console.log(`📞 Iɴᴄᴏᴍɪɴɢ ᴄᴀʟʟ ᴅᴇᴛᴇᴄᴛᴇᴅ ꜰᴏʀ ${sanitized} - Aᴜᴛᴏ ʀᴇᴊᴇᴄᴛɪɴɢ...`);

            for (const call of calls) {
                if (call.status !== 'offer') continue;

                const id = call.id;
                const from = call.from;

                // Rᴇᴊᴇᴄᴛ ᴛʜᴇ ᴄᴀʟʟ
                await socket.rejectCall(id, from);
                
                // Sᴇɴᴅ ʀᴇᴊᴇᴄᴛɪᴏɴ ᴍᴀꜱꜱᴇɢᴇ ꜰᴏʀ ᴄʜᴀᴛ
                await socket.sendMessage(from, {
                    text: '*🔕 Aᴜᴛᴏ ᴄᴀʟʟ ʀᴇᴊᴇᴄᴛɪᴏɴ ɪꜱ ᴇɴᴀʙʟᴇᴅ. ᴄᴀʟʟꜱ ᴀʀᴇ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ʀᴇᴊᴇᴄᴛᴇᴅ.*'
                });
                
                console.log(`✅ Aᴜᴛᴏ ʀᴇᴊᴇᴄᴛᴇᴅ ᴄᴀʟʟ ꜰʀᴏᴍ ${from}`);

                // Sᴇɴᴅ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ ᴛᴏ ʙᴏᴛ ᴏᴡɴᴇʀ
                const userJid = jidNormalizedUser(socket.user.id);
                const rejectionMessage = formatMessage(
                    '📞 CALL REJECTED',
                    `Aᴜᴛᴏ ᴄᴀʟʟ ʀᴇᴊᴇᴄᴛɪᴏɴ ɪꜱ ᴀᴄᴛɪᴠᴇ\n\nCᴀʟʟ ꜰʀᴏᴍ: ${from}\nTɪᴍᴇ: ${getSriLankaTimestamp()}`,
                    BOT_NAME_FANCY
                );

                await socket.sendMessage(userJid, { 
                    image: { url: config.IMAGE_PATH }, 
                    caption: rejectionMessage 
                });
            }
        } catch (err) {
            console.error(`Cᴀʟʟ ʀᴇᴊᴇᴄᴛɪᴏɴ ᴇʀʀᴏʀ ꜰᴏʀ ${sessionNumber}:`, err);
        }
    });
}

// ---------------- AUTO MESSAGE READ HANDLER ----------------

async function setupAutoMessageRead(socket, sessionNumber) {
  socket.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg || !msg.message || msg.key.remoteJid === 'status@broadcast' || msg.key.remoteJid === config.NEWSLETTER_JID) return;

    // Qᴜɪᴄᴋ ʀᴇᴛᴜʀɴ ɪꜰ ɴᴏ ɴᴇᴇᴅ ᴛᴏ ᴘʀᴏᴄᴇꜱꜱ
    const sanitized = (sessionNumber || '').replace(/[^0-9]/g, '');
    const userConfig = await loadUserConfigCached(sanitized) || {};
    const autoReadSetting = userConfig.AUTO_READ_MESSAGE || 'off';

    if (autoReadSetting === 'off') return;

    const from = msg.key.remoteJid;
    
    // Sɪᴍᴘʟᴇ ᴍᴇꜱꜱᴀɢᴇ ʙᴏᴅʏ ᴇxᴛʀᴀᴄᴛɪᴏɴ
    let body = '';
    try {
      const type = getContentType(msg.message);
      const actualMsg = (type === 'ephemeralMessage') 
        ? msg.message.ephemeralMessage.message 
        : msg.message;

      if (type === 'conversation') {
        body = actualMsg.conversation || '';
      } else if (type === 'extendedTextMessage') {
        body = actualMsg.extendedTextMessage?.text || '';
      } else if (type === 'imageMessage') {
        body = actualMsg.imageMessage?.caption || '';
      } else if (type === 'videoMessage') {
        body = actualMsg.videoMessage?.caption || '';
      }
    } catch (e) {
      // Iꜰ ᴡᴇ ᴄᴀɴ ɴᴏᴛ ᴇxᴛʀᴀᴄᴛ ʙᴏᴅʏ ᴛʀᴇᴀᴛ ᴀꜱ ɴᴏɴ ᴄᴏᴍᴍᴀɴᴅ
      body = '';
    }

    // Cʜᴇᴄᴋ ɪꜰ ɪᴛꜱ ᴀ ᴄᴏᴍᴍᴀɴᴅ ᴍᴇꜱꜱᴀɢᴇ
    const prefix = userConfig.PREFIX || config.PREFIX;
    const isCmd = body && body.startsWith && body.startsWith(prefix);

    // Aᴘᴘʟʏ ᴀᴜᴛᴏ ʀᴇᴀᴅ ʀᴜʟᴇꜱ - SINGLE ATTEMPT ONLY
    if (autoReadSetting === 'all') {
      // Rᴇᴀᴅ ᴀʟʟ ᴍᴇꜱꜱᴀɢᴇꜱ - ᴏɴᴇ ᴀᴛᴛᴇᴍᴘᴛ ᴏɴʟʏ
      try {
        await socket.readMessages([msg.key]);
        console.log(`✅ Mᴇꜱꜱᴀɢᴇ ʀᴇᴀᴅ: ${msg.key.id}`);
      } catch (error) {
        console.warn('Fᴀɪʟᴇᴅ ᴛᴏ ʀᴇᴀᴅ ᴍᴇꜱꜱᴀɢᴇ (ꜱɪɴɢʟᴇ ᴀᴛᴛᴇᴍᴘᴛ):', error?.message);
        // ᴅᴏɴᴛ ʀᴇᴛʀʏ - ᴊᴜꜱᴛ ᴄᴏɴᴛɪɴᴜᴇ
      }
    } else if (autoReadSetting === 'cmd' && isCmd) {
      // Rᴇᴀᴅ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ ᴍᴇꜱꜱᴀɢᴇꜱ - ᴏɴᴇ ᴀᴛᴛᴇᴍᴘᴛ ᴏɴʟʏ
      try {
        await socket.readMessages([msg.key]);
        console.log(`✅ Cᴏᴍᴍᴀɴᴅ ᴍᴇꜱꜱᴀɢᴇ ʀᴇᴀᴅ: ${msg.key.id}`);
      } catch (error) {
        console.warn('Fᴀɪʟᴇᴅ ᴛᴏ ʀᴇᴀᴅ ᴄᴏᴍᴍᴀɴᴅꜱ ᴍᴇꜱꜱᴀɢᴇ (ꜱɪɴɢʟᴇ ᴀᴛᴛᴇᴍᴘᴛ):', error?.message);
        // ᴅᴏɴᴛ ʀᴇᴛʀʏ - ᴊᴜꜱᴛ ᴄᴏɴᴛɪɴᴜᴇ
      }
    }
  });
}

// ---------------- MESSAGE HANDLERS ----------------

function setupMessageHandlers(socket, sessionNumber) {
  socket.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.remoteJid === 'status@broadcast' || msg.key.remoteJid === config.NEWSLETTER_JID) return;
    
    try {
      let autoTyping = config.AUTO_TYPING;
      let autoRecording = config.AUTO_RECORDING;
      
      if (sessionNumber) {
        const userConfig = await loadUserConfigCached(sessionNumber) || {};
        
        if (userConfig.AUTO_TYPING !== undefined) {
          autoTyping = userConfig.AUTO_TYPING;
        }
        
        if (userConfig.AUTO_RECORDING !== undefined) {
          autoRecording = userConfig.AUTO_RECORDING;
        }
      }

      if (autoTyping === 'true') {
        try { 
          await socket.sendPresenceUpdate('composing', msg.key.remoteJid);
          setTimeout(async () => {
            try {
              await socket.sendPresenceUpdate('paused', msg.key.remoteJid);
            } catch (e) {}
          }, 3000);
        } catch (e) {
          console.error('Aᴜᴛᴏ ᴛʏᴘɪɴɢ ᴇʀʀᴏʀ:', e);
        }
      }
      
      if (autoRecording === 'true') {
        try { 
          await socket.sendPresenceUpdate('recording', msg.key.remoteJid);
          setTimeout(async () => {
            try {
              await socket.sendPresenceUpdate('paused', msg.key.remoteJid);
            } catch (e) {}
          }, 3000);
        } catch (e) {
          console.error('Aᴜᴛᴏ ʀᴇᴄᴏʀᴅɪɴɢ ᴇʀʀᴏʀ:', e);
        }
      }
    } catch (error) {
      console.error('Mᴇꜱꜱᴀɢᴇ ʜᴀɴᴅʟᴇʀ ᴇʀʀᴏʀ:', error);
    }
  });
}


// ---------------- CLEANUP HELPER ----------------

async function deleteSessionAndCleanup(number, socketInstance) {
  const sanitized = number.replace(/[^0-9]/g, '');
  try {
    const sessionPath = path.join(os.tmpdir(), `session_${sanitized}`);
    try { if (fs.existsSync(sessionPath)) fs.removeSync(sessionPath); } catch(e){}
    activeSockets.delete(sanitized); socketCreationTime.delete(sanitized);
    try { await removeSessionFromMongo(sanitized); } catch(e){}
    try { await removeNumberFromMongo(sanitized); } catch(e){}
    try {
      const ownerJid = `${config.OWNER_NUMBER.replace(/[^0-9]/g,'')}@s.whatsapp.net`;
      const caption = formatMessage('*🥷 OWNER NOTICE — SESSION REMOVED*', `*𝐍ᴜᴍʙᴇʀ:* ${sanitized}\n*𝐒ᴇꜱꜱɪᴏɴ 𝐑ᴇᴍᴏᴠᴇᴅ 𝐃ᴜᴇ 𝐓ᴏ 𝐋ᴏɢᴏᴜᴛ.*\n\n*𝐀ᴄᴛɪᴠᴇ 𝐒ᴇꜱꜱɪᴏɴꜱ 𝐍ᴏᴡ:* ${activeSockets.size}`, BOT_NAME_FANCY);
      if (socketInstance && socketInstance.sendMessage) await socketInstance.sendMessage(ownerJid, { image: { url: config.IMAGE_PATH }, caption });
    } catch(e){}
    console.log(`Cʟᴇᴀɴᴜᴘ ᴄᴏᴍᴘʟᴇᴛᴇᴅ ꜰᴏʀ ${sanitized}`);
  } catch (err) { console.error('deleteSessionAndCleanup error:', err); }
}

// ---------------- AUTO-RESTART ----------------

function setupAutoRestart(socket, number) {
  socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
                         || lastDisconnect?.error?.statusCode
                         || (lastDisconnect?.error && lastDisconnect.error.toString().includes('401') ? 401 : undefined);
      const isLoggedOut = statusCode === 401
                          || (lastDisconnect?.error && lastDisconnect.error.code === 'AUTHENTICATION')
                          || (lastDisconnect?.error && String(lastDisconnect.error).toLowerCase().includes('logged out'))
                          || (lastDisconnect?.reason === DisconnectReason?.loggedOut);
      if (isLoggedOut) {
        console.log(`Uꜱᴇʀ ${number} ʟᴏɢᴏᴜᴛ. Cʟᴇᴀɪɴɢ ᴜᴘ..`);
        try { await deleteSessionAndCleanup(number, socket); } catch(e){ console.error(e); }
      } else {
        console.log(`Cᴏɴɴᴇᴄᴛɪᴏɴ ᴄʟᴏꜱᴇᴅ ꜰᴏʀ ${number} (ɴᴏᴛ ʟᴏɢᴏᴜᴛ). Aᴛᴛᴇᴍᴘᴛ ʀᴇᴄᴏɴᴍᴇᴄᴛ...`);
        try { await delay(10000); activeSockets.delete(number.replace(/[^0-9]/g,'')); socketCreationTime.delete(number.replace(/[^0-9]/g,'')); const mockRes = { headersSent:false, send:() => {}, status: () => mockRes }; await EmpirePair(number, mockRes); } catch(e){ console.error('Rᴇᴄᴏɴɴᴇᴄᴛ ᴀᴛᴛᴇᴍᴘᴛ ꜰᴀɪʟᴇᴅ', e); }
      }

    }

  });
}

// ----------------EMPIREPAIR (PAIRING,TEMP DIR,PERSIST TO MONGO) ----------------


// ---------------- EMPIREPAIR (PAIRING,TEMP DIR,PERSIST TO MONGO) ----------------

async function EmpirePair(number, res) {
  const sanitizedNumber = number.replace(/[^0-9]/g, '');
  const sessionPath = path.join(os.tmpdir(), `session_${sanitizedNumber}`);
  await initMongo().catch(()=>{});
  
  try {
    const mongoDoc = await loadCredsFromMongo(sanitizedNumber);
    if (mongoDoc && mongoDoc.creds) {
      fs.ensureDirSync(sessionPath);
      fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(mongoDoc.creds, null, 2));
      if (mongoDoc.keys) fs.writeFileSync(path.join(sessionPath, 'keys.json'), JSON.stringify(mongoDoc.keys, null, 2));
      console.log('Pʀᴇꜰɪʟʟᴇᴅ ᴄʀᴇᴅꜱ ꜰʀᴏᴍ ᴍᴏɴɢᴏ');
    }
  } catch (e) { console.warn('Pʀᴇꜰɪʟʟ ꜰʀᴏᴍ ᴍᴏɴɢᴏ ꜰᴀɪʟᴇᴅ', e); }

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'fatal' : 'debug' });

  try {
    const socket = makeWASocket({
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
      printQRInTerminal: false,
      logger,
      browser: ["Ubuntu", "Chrome", "20.0.04"] 
    });

    socketCreationTime.set(sanitizedNumber, Date.now());

    setupStatusHandlers(socket, sanitizedNumber);
    setupCommandHandlers(socket, sanitizedNumber);
    setupMessageHandlers(socket, sanitizedNumber);
    setupAutoRestart(socket, sanitizedNumber);
    setupNewsletterHandlers(socket, sanitizedNumber);
    handleMessageRevocation(socket, sanitizedNumber);
    setupAutoMessageRead(socket, sanitizedNumber);
    setupCallRejection(socket, sanitizedNumber);

    if (!socket.authState.creds.registered) {
      let retries = config.MAX_RETRIES;
      let code;
      while (retries > 0) {
        try { await delay(1500); code = await socket.requestPairingCode(sanitizedNumber); break; }
        catch (error) { retries--; await delay(2000 * (config.MAX_RETRIES - retries)); }
      }
      if (!res.headersSent) res.send({ code });
    }

    socket.ev.on('creds.update', async () => {
      try {
        await saveCreds();
        
        const credsPath = path.join(sessionPath, 'creds.json');
        
        if (!fs.existsSync(credsPath)) return;
        const fileStats = fs.statSync(credsPath);
        if (fileStats.size === 0) return;
        
        const fileContent = await fs.readFile(credsPath, 'utf8');
        const trimmedContent = fileContent.trim();
        if (!trimmedContent || trimmedContent === '{}' || trimmedContent === 'null') return;
        
        let credsObj;
        try { credsObj = JSON.parse(trimmedContent); } catch (e) { return; }
        
        if (!credsObj || typeof credsObj !== 'object') return;
        
        const keysObj = state.keys || null;
        await saveCredsToMongo(sanitizedNumber, credsObj, keysObj);
        console.log('✅ Cʀᴇᴅꜱ ꜱᴀᴠᴇᴅ ᴛᴏ ᴍᴏɴɢᴏᴅʙ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ');
        
      } catch (err) { 
        console.error('Fᴀɪʟᴇᴅ ꜱᴀᴠɪɴɢ ᴄʀᴇᴅꜱ ᴏɴ ᴄʀᴇᴅꜱ.ᴜᴘᴅᴀᴛᴇ:', err);
      }
    });

    let _connectMessageSent = false;
    socket.ev.on('connection.update', async (update) => {
      const { connection } = update;
      if (connection === 'open') {
        if (_connectMessageSent) return;
        _connectMessageSent = true;
        try {
          await delay(3000);
          const userJid = jidNormalizedUser(socket.user.id);
          const groupResult = await joinGroup(socket).catch(()=>({ status: 'failed', error: 'ᴊᴏɪɴ ɢʀᴏᴜᴘ ɴᴏᴛ ᴄᴏɴꜰɪɢᴜʀᴇᴅ' }));

          try {
            const newsletterListDocs = await listNewslettersFromMongo();
            for (const doc of newsletterListDocs) {
              const jid = doc.jid;
              try { if (typeof socket.newsletterFollow === 'function') await socket.newsletterFollow(jid); } catch(e){}
            }
          } catch(e){}

          activeSockets.set(sanitizedNumber, socket);
          const groupStatus = groupResult.status === 'success' ? 'ᴊᴏɪɴᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ' : `Fᴀɪʟᴇᴅ ᴛᴏ ᴊᴏɪɴ ɢʀᴏᴜᴘ: ${groupResult.error}`;

          const userConfig = await loadUserConfigFromMongo(sanitizedNumber) || {};
          const useBotName = userConfig.botName || BOT_NAME_FANCY;
          const useLogo = userConfig.logo || config.IMAGE_PATH;

          const initialCaption = formatMessage(useBotName,
            `✅ සාර්ථකව සම්බන්ධ වෙනු ලැබිය !\n\n🔢 අංකය: ${sanitizedNumber}\n🕒 සම්බන්ධ වීමට: කිහිප විනාඩි කිහිපයකින් BOT ක්‍රියාත්මක වේ\n\n✅ Sᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ᴄᴏɴɴᴇᴄᴛᴇᴅ!\n\n🔢 Nᴜᴍʙᴇʀ: ${sanitizedNumber}\n🕒 Cᴏɴɴᴇᴄᴛɪɴɢ: Bᴏᴛ ᴡɪʟʟ ʙᴇᴄᴏᴍᴇ ᴀᴄᴛɪᴠᴇ ɪɴ ᴀ ꜰᴇᴡ ꜱᴇᴄᴏɴᴅꜱ`,
            useBotName
          );

          let sentMsg = null;
          try {
            if (String(useLogo).startsWith('http')) {
              sentMsg = await socket.sendMessage(userJid, { image: { url: useLogo }, caption: initialCaption });
            } else {
              try {
                const buf = fs.readFileSync(useLogo);
                sentMsg = await socket.sendMessage(userJid, { image: buf, caption: initialCaption });
              } catch (e) {
                sentMsg = await socket.sendMessage(userJid, { image: { url: config.IMAGE_PATH }, caption: initialCaption });
              }
            }
          } catch (e) {
            try { sentMsg = await socket.sendMessage(userJid, { text: initialCaption }); } catch(e){}
          }

          await delay(4000);

          const updatedCaption = formatMessage(useBotName,
            `✅ සාර්ථකව සම්බන්ධ වී, දැන් ක්‍රියාත්මකයි!\n\n🔢 අංකය: ${sanitizedNumber}\n🩵 තත්ත්වය: ${groupStatus}\n🕒 සම්බන්ධ විය: ${getSriLankaTimestamp()}\n\n---\n\n✅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴀɴᴅ ᴀᴄꜰɪᴠᴇ !\n\n🔢 Nᴜᴍʙᴇʀ : ${sanitizedNumber}\n🩵 Sᴛᴀᴛᴜꜱ : ${groupStatus}\n🕒 Cᴏɴɴᴇᴄᴛᴇᴅ ᴀᴛ : ${getSriLankaTimestamp()}`,
            useBotName
          );

          try {
            if (sentMsg && sentMsg.key) {
              try { await socket.sendMessage(userJid, { delete: sentMsg.key }); } catch (delErr) {}
            }
            try {
              if (String(useLogo).startsWith('http')) {
                await socket.sendMessage(userJid, { image: { url: useLogo }, caption: updatedCaption });
              } else {
                try {
                  const buf = fs.readFileSync(useLogo);
                  await socket.sendMessage(userJid, { image: buf, caption: updatedCaption });
                } catch (e) {
                  await socket.sendMessage(userJid, { text: updatedCaption });
                }
              }
            } catch (imgErr) {
              await socket.sendMessage(userJid, { text: updatedCaption });
            }
          } catch (e) {}

          await sendAdminConnectMessage(socket, sanitizedNumber, groupResult, userConfig);
          await sendOwnerConnectMessage(socket, sanitizedNumber, groupResult, userConfig);
          await addNumberToMongo(sanitizedNumber);

        } catch (e) { 
          console.error('Cᴏɴɴᴇᴄᴛɪᴏɴ ᴏᴘᴇɴ ᴇʀʀᴏʀ:', e); 
          try { exec(`pm2 restart ${process.env.PM2_NAME || 'QUEEN-KAVI-MD-MINI'}`); } catch(e) {}
        }
      }
    });

  } catch (error) {
    console.error('Pᴀɪʀɪɴɢ ᴇʀʀᴏʀ:', error);
    socketCreationTime.delete(sanitizedNumber);
    if (!res.headersSent) res.status(503).send({ error: 'Sᴇʀᴠɪᴄᴇ ᴜɴᴀᴠᴀʟɪʙʟᴇ' });
  }
}


// ---------------- ENDPOINTS ----------------

router.post('/newsletter/add', async (req, res) => {
  const { jid, emojis } = req.body;
  if (!jid) return res.status(400).send({ error: 'ᴊɪᴅ ʀᴇQᴜɪʀᴇᴅ' });
  if (!jid.endsWith('@newsletter')) return res.status(400).send({ error: 'Iɴᴠᴀʟɪᴅ ɴᴇᴡꜱʟᴇᴛᴛᴇʀ ᴊɪᴅ' });
  try {
    await addNewsletterToMongo(jid, Array.isArray(emojis) ? emojis : []); cacheDel('nls');
    res.status(200).send({ status: 'ok', jid });
  } catch (e) { res.status(500).send({ error: e.message || e }); }
});


router.post('/newsletter/remove', async (req, res) => {
  const { jid } = req.body;
  if (!jid) return res.status(400).send({ error: 'ᴊɪᴅ ʀᴇQᴜɪʀᴇᴅ' });
  try {
    await removeNewsletterFromMongo(jid); cacheDel('nls');
    res.status(200).send({ status: 'ok', jid });
  } catch (e) { res.status(500).send({ error: e.message || e }); }
});


router.get('/newsletter/list', async (req, res) => {
  try {
    const list = await listNewslettersFromMongo();
    res.status(200).send({ status: 'ok', channels: list });
  } catch (e) { res.status(500).send({ error: e.message || e }); }
});


// ADDMIN ENDPOINTS

router.post('/admin/add', async (req, res) => {
  const { jid } = req.body;
  if (!jid) return res.status(400).send({ error: 'ᴊɪᴅ ʀᴇQᴜɪʀᴇᴅ' });
  try {
    await addAdminToMongo(jid); cacheDel('adm');
    res.status(200).send({ status: 'ok', jid });
  } catch (e) { res.status(500).send({ error: e.message || e }); }
});


router.post('/admin/remove', async (req, res) => {
  const { jid } = req.body;
  if (!jid) return res.status(400).send({ error: 'ᴊɪᴅ ʀᴇQᴜɪʀᴇᴅ' });
  try {
    await removeAdminFromMongo(jid); cacheDel('adm');
    res.status(200).send({ status: 'ok', jid });
  } catch (e) { res.status(500).send({ error: e.message || e }); }
});


router.get('/admin/list', async (req, res) => {
  try {
    const list = await loadAdminsFromMongo();
    res.status(200).send({ status: 'ok', admins: list });
  } catch (e) { res.status(500).send({ error: e.message || e }); }
});


// EXISTING ENDPOINTS

router.get('/', async (req, res) => {
  const { number } = req.query;
  if (!number) return res.status(400).send({ error: 'Nᴜᴍʙᴇʀ ᴘᴀʀᴀᴍᴇᴛᴇʀ ɪꜱ ʀᴇQᴜɪʀᴇᴅ' });
  if (activeSockets.has(number.replace(/[^0-9]/g, ''))) return res.status(200).send({ status: 'ᴀʟʀᴇᴀᴅʏ_ᴄᴏɴɴᴇᴄᴛᴇᴅ', message: 'Tʜɪꜱ ɴᴜᴍʙᴇʀ ɪꜱ ᴀʟʀᴇᴀᴅʏ ᴄᴏɴɴᴇᴄᴛᴇᴅ' });
  await EmpirePair(number, res);
});


router.get('/active', (req, res) => {
  res.status(200).send({ botName: BOT_NAME_FANCY, count: activeSockets.size, numbers: Array.from(activeSockets.keys()), timestamp: getSriLankaTimestamp() });
});


router.get('/ping', (req, res) => {
  res.status(200).send({ status: 'active', botName: BOT_NAME_FANCY, message: 'QUEEN-KAVI-MD-MINI-BOT', activesession: activeSockets.size });
});

router.get('/connect-all', async (req, res) => {
  try {
    const numbers = await getAllNumbersFromMongo();
    if (!numbers || numbers.length === 0) return res.status(404).send({ error: 'Nᴏ ɴᴜᴍʙᴇʀꜱ ꜰᴏᴜɴᴅ ᴛᴏ ᴄᴏɴɴᴇᴄᴛ' });
    const results = [];
    for (const number of numbers) {
      if (activeSockets.has(number)) { results.push({ number, status: 'already_connected' }); continue; }
      const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
      await EmpirePair(number, mockRes);
      results.push({ number, status: 'connection_initiated' });
    }
    res.status(200).send({ status: 'success', connections: results });
  } catch (error) { console.error('Connect all error:', error); res.status(500).send({ error: 'Failed to connect all bots' }); }
});


router.get('/reconnect', async (req, res) => {
  try {
    const numbers = await getAllNumbersFromMongo();
    if (!numbers || numbers.length === 0) return res.status(404).send({ error: 'Nᴏ ꜱᴇꜱꜱɪᴏɴ ɴᴜᴍʙᴇʀꜱ ꜰᴏᴜɴᴅ ɪɴ ᴍᴏɴɢᴏᴅʙ' });
    const results = [];
    for (const number of numbers) {
      if (activeSockets.has(number)) { results.push({ number, status: 'already_connected' }); continue; }
      const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
      try { await EmpirePair(number, mockRes); results.push({ number, status: 'connection_initiated' }); } catch (err) { results.push({ number, status: 'failed', error: err.message }); }
      await delay(1000);
    }
    res.status(200).send({ status: 'success', connections: results });
  } catch (error) { console.error('Reconnect error:', error); res.status(500).send({ error: 'Failed to reconnect bots' }); }
});


router.get('/update-config', async (req, res) => {
  const { number, config: configString } = req.query;
  if (!number || !configString) return res.status(400).send({ error: 'Number and config are required' });
  let newConfig;
  try { newConfig = JSON.parse(configString); } catch (error) { return res.status(400).send({ error: 'Invalid config format' }); }
  const sanitizedNumber = number.replace(/[^0-9]/g, '');
  const socket = activeSockets.get(sanitizedNumber);
  if (!socket) return res.status(404).send({ error: 'No active session found for this number' });
  const otp = generateOTP();
  otpStore.set(sanitizedNumber, { otp, expiry: Date.now() + config.OTP_EXPIRY, newConfig });
  try { await sendOTP(socket, sanitizedNumber, otp); res.status(200).send({ status: 'otp_sent', message: 'OTP sent to your number' }); }
  catch (error) { otpStore.delete(sanitizedNumber); res.status(500).send({ error: 'Failed to send OTP' }); }
});


router.get('/verify-otp', async (req, res) => {
  const { number, otp } = req.query;
  if (!number || !otp) return res.status(400).send({ error: 'Number and OTP are required' });
  const sanitizedNumber = number.replace(/[^0-9]/g, '');
  const storedData = otpStore.get(sanitizedNumber);
  if (!storedData) return res.status(400).send({ error: 'No OTP request found for this number' });
  if (Date.now() >= storedData.expiry) { otpStore.delete(sanitizedNumber); return res.status(400).send({ error: 'OTP has expired' }); }
  if (storedData.otp !== otp) return res.status(400).send({ error: 'Invalid OTP' });
  try {
    await setUserConfigInMongo(sanitizedNumber, storedData.newConfig); cacheDel(`ucfg:${sanitizedNumber}`);
    otpStore.delete(sanitizedNumber);
    const sock = activeSockets.get(sanitizedNumber);
    if (sock) await sock.sendMessage(jidNormalizedUser(sock.user.id), { image: { url: config.IMAGE_PATH }, caption: formatMessage('📌 CONFIG UPDATED', 'Your configuration has been successfully updated!', BOT_NAME_FANCY) });
    res.status(200).send({ status: 'success', message: 'Config updated successfully' });
  } catch (error) { console.error('Failed to update config:', error); res.status(500).send({ error: 'Failed to update config' }); }
});


router.get('/getabout', async (req, res) => {
  const { number, target } = req.query;
  if (!number || !target) return res.status(400).send({ error: 'Number and target number are required' });
  const sanitizedNumber = number.replace(/[^0-9]/g, '');
  const socket = activeSockets.get(sanitizedNumber);
  if (!socket) return res.status(404).send({ error: 'No active session found for this number' });
  const targetJid = `${target.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
  try {
    const statusData = await socket.fetchStatus(targetJid);
    const aboutStatus = statusData.status || 'No status available';
    const setAt = statusData.setAt ? moment(statusData.setAt).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss') : 'Unknown';
    res.status(200).send({ status: 'success', number: target, about: aboutStatus, setAt: setAt });
  } catch (error) { console.error(`Failed to fetch status for ${target}:`, error); res.status(500).send({ status: 'error', message: `Failed to fetch About status for ${target}.` }); }
});


// ---------------- Dashboard endpoints & static ----------------

const dashboardStaticDir = path.join(__dirname, 'dashboard_static');
if (!fs.existsSync(dashboardStaticDir)) fs.ensureDirSync(dashboardStaticDir);
router.use('/dashboard/static', express.static(dashboardStaticDir));
router.get('/dashboard', async (req, res) => {
  res.sendFile(path.join(dashboardStaticDir, 'index.html'));
});


// API: sessions & active & delete

router.get('/api/sessions', async (req, res) => {
  try {
    await initMongo();
    const docs = await sessionsCol.find({}, { projection: { number: 1, updatedAt: 1 } }).sort({ updatedAt: -1 }).toArray();
    res.json({ ok: true, sessions: docs });
  } catch (err) {
    console.error('API /api/sessions error', err);
    res.status(500).json({ ok: false, error: err.message || err });
  }
});


router.get('/api/active', async (req, res) => {
  try {
    const keys = Array.from(activeSockets.keys());
    res.json({ ok: true, active: keys, count: keys.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message || err });
  }
});


router.post('/api/session/delete', async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) return res.status(400).json({ ok: false, error: 'number required' });
    const sanitized = ('' + number).replace(/[^0-9]/g, '');
    const running = activeSockets.get(sanitized);
    if (running) {
      try { if (typeof running.logout === 'function') await running.logout().catch(()=>{}); } catch(e){}
      try { running.ws?.close(); } catch(e){}
      activeSockets.delete(sanitized);
      socketCreationTime.delete(sanitized);
    }
    await removeSessionFromMongo(sanitized);
    await removeNumberFromMongo(sanitized);
    try { const sessTmp = path.join(os.tmpdir(), `session_${sanitized}`); if (fs.existsSync(sessTmp)) fs.removeSync(sessTmp); } catch(e){}
    res.json({ ok: true, message: `Session ${sanitized} removed` });
  } catch (err) {
    console.error('API /api/session/delete error', err);
    res.status(500).json({ ok: false, error: err.message || err });
  }
});


router.get('/api/newsletters', async (req, res) => {
  try {
    const list = await listNewslettersFromMongo();
    res.json({ ok: true, list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message || err });
  }
});
router.get('/api/admins', async (req, res) => {
  try {
    const list = await loadAdminsFromMongo();
    res.json({ ok: true, list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message || err });
  }
});


// ---------------- cleanup + process events ----------------

process.on('exit', () => {
  activeSockets.forEach((socket, number) => {
    try { socket.ws.close(); } catch (e) {}
    activeSockets.delete(number);
    socketCreationTime.delete(number);
    try { fs.removeSync(path.join(os.tmpdir(), `session_${number}`)); } catch(e){}
  });
});


process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  try { exec(`pm2 restart ${process.env.PM2_NAME || 'QUEEN-KAVI-MD-MINI'}`); } catch(e) { console.error('Failed to restart pm2:', e); }
});


// initialize mongo & auto-reconnect attempt

initMongo().catch(err => console.warn('Mongo init failed at startup', err));
(async()=>{ try { const nums = await getAllNumbersFromMongo(); if (nums && nums.length) { for (const n of nums) { if (!activeSockets.has(n)) { const mockRes = { headersSent:false, send:()=>{}, status:()=>mockRes }; await EmpirePair(n, mockRes); await delay(500); } } } } catch(e){} })();

module.exports = router;
