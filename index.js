const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

__path = process.cwd();

const PORT = process.env.PORT || 8000;
let code = require('./start');

require('events').EventEmitter.defaultMaxListeners = 500;

/* ---------- MIDDLEWARES ---------- */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PUBLIC FOLDER SERVER
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- ROUTES ---------- */
app.use('/code', code);

app.get('/start', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pair.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

/* ---------- ERROR HANDLING ---------- */
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ status: 'error', message: err.message || 'Internal Server Error' });
});

/* ---------- SERVER ---------- */
app.listen(PORT, () => {
    console.log(`
╔─ Qᴜᴇᴇɴ Kᴀᴠɪ Mᴅ Mɪɴɪ Bᴏᴛ ─╗
║ Dᴏɴ'ᴛ Fᴏʀɢᴇᴛ Gɪᴠᴇ A Sᴛᴀʀ⭐
║
║ Server running on http://localhost:${PORT}
╚──────────────────────╝
`);
});

module.exports = app;
