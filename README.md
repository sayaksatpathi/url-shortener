<div align="center">

# 🔗 URL Shortener

### A fast, Bitly-style link shortener built with Node.js & Express.

[![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)

</div>

---

## Overview

A lightweight URL shortener: paste a long link, get a short code, and every visit to that code redirects to the original — while a tiny JSON store tracks click counts. No database server required; it persists to a local `db.json`.

## ✨ Features

- ✂️ **Shorten any URL** to a compact, collision-resistant code (`nanoid`)
- ↪️ **Instant redirects** from `/:code` to the original link
- 📊 **Per-link stats** — track how many times each short link was visited
- ✅ **URL validation** (`valid-url`) so only real links get shortened
- 🗂️ **Zero-infra persistence** via a local JSON file
- 🔧 Configurable via `.env` (`dotenv`)

## 🧩 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten` | Create a short code for a given URL |
| `GET`  | `/api/stats/:code` | Return visit stats for a short code |
| `GET`  | `/:code` | Redirect to the original URL |

## 🚀 Getting Started

```bash
npm install            # install dependencies

# optional: configure environment
cp .env.example .env   # if present — set PORT / BASE_URL

npm start              # run the server
npm run dev            # run with --watch (auto-restart)
```

The server serves a small front end from `public/` and the API above.

## 🧱 Tech Stack

**Node.js · Express · nanoid · valid-url · dotenv** — static front end in `public/`, data in `db.json`.

---

<div align="center">

Built by **[Sayak Satpathi](https://github.com/sayaksatpathi)**

</div>
