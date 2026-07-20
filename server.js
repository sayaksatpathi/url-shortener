require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');

const app = express();
const PORT = process.env.PORT || 3000;
// Base URL used to build the short links returned to the client.
// Change this (or set BASE_URL env var) to your server's public IP/domain, e.g. http://13.52.xx.xx
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const DB_FILE = path.join(__dirname, 'db.json');
const CODE_LENGTH = 6;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Tiny JSON "database" ----------
function loadDB() {
  if (!fs.existsSync(DB_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

let db = loadDB(); // { code: { url, created, clicks } }

// ---------- API: create a short URL ----------
app.post('/api/shorten', (req, res) => {
  const { url, customCode } = req.body;

  if (!url || !validUrl.isWebUri(url)) {
    return res.status(400).json({ error: 'Please provide a valid URL (including http:// or https://).' });
  }

  // Allow an optional custom short code
  let code = customCode && customCode.trim();
  if (code) {
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(code)) {
      return res.status(400).json({ error: 'Custom code must be 3-20 characters (letters, numbers, - or _).' });
    }
    if (db[code]) {
      return res.status(409).json({ error: 'That custom code is already taken.' });
    }
  } else {
    do {
      code = nanoid(CODE_LENGTH);
    } while (db[code]);
  }

  db[code] = { url, created: new Date().toISOString(), clicks: 0 };
  saveDB(db);

  res.json({
    shortUrl: `${BASE_URL}/${code}`,
    code,
    originalUrl: url
  });
});

// ---------- API: stats for a code ----------
app.get('/api/stats/:code', (req, res) => {
  const entry = db[req.params.code];
  if (!entry) return res.status(404).json({ error: 'Short code not found.' });
  res.json({ code: req.params.code, ...entry, shortUrl: `${BASE_URL}/${req.params.code}` });
});

// ---------- Redirect ----------
app.get('/:code', (req, res, next) => {
  const entry = db[req.params.code];
  if (!entry) return next(); // fall through to 404
  entry.clicks += 1;
  saveDB(db);
  res.redirect(302, entry.url);
});

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).send('Short URL not found.');
});

app.listen(PORT, () => {
  console.log(`URL Shortener running at ${BASE_URL} (listening on port ${PORT})`);
});
