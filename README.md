# MESH-TECH MD BOT

A WhatsApp automation bot built on Baileys, with a web dashboard for pairing (no Telegram needed).

## Features

- Web dashboard (`/`) to pair your WhatsApp number and get a live status badge
- 500+ menu commands (song, video, ytmp3/ytmp4, antilink, anticall, antidelete, welcome, kick, autoreacts, status auto-react, AI chatbot, etc.)
- Auto-reconnect on disconnect, multi-session support (sessions stored per WhatsApp number)

## Before you deploy anywhere: what this bot needs

This is a **long-running process**, not a serverless function — it holds an open WebSocket connection to WhatsApp 24/7, and it reads/writes local session files (`sessions/`, `data/`) that must persist between restarts.

That rules out **Vercel**: it only runs short-lived serverless functions with no persistent filesystem, so it can't keep a WhatsApp connection alive or remember your pairing between requests. **Render, Koyeb, and Railway** all support always-on Node/Docker services and are good fits — pick whichever you prefer, the code doesn't change.

The repo includes both a `Dockerfile` (works on any Docker-based host) and a `Procfile` (works on buildpack-based hosts like Render/Heroku-style deploys), so you're not locked into one platform.

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 2. Deploy — pick one

### Render
1. [render.com](https://render.com) → **New** → **Web Service** → connect your GitHub repo
2. Render auto-detects the `Dockerfile`. If asked, set start command to `node index.js`
3. Add a **Persistent Disk** mounted at `/app/sessions` and another at `/app/data`, so you don't have to re-pair after every deploy
4. Add environment variables (see below)

### Koyeb
1. [koyeb.com](https://www.koyeb.com) → **Create App** → **GitHub** → select your repo
2. Koyeb builds from the `Dockerfile` automatically
3. Add a **Volume** for `/app/sessions` and `/app/data`
4. Add environment variables (see below)

### Railway
1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Railway detects `railway.json`/`Procfile` and runs `node index.js`
3. Add a **Volume** mounted at `/app/sessions` and `/app/data`
4. Add environment variables (see below)

## 3. Environment variables

Copy the keys from `.env.example`. At minimum set `OWNER_NUMBER` to your WhatsApp number. You don't need to set `PORT` — most hosts inject it automatically.

## 4. Pair your WhatsApp

Once deployed, open the platform's public URL in your browser:
- Enter your WhatsApp number (with country code, no `+` or spaces, e.g. `254700000000`)
- Click **Get Pairing Code**, then in WhatsApp: **Settings → Linked Devices → Link with phone number** and enter the code
- The dashboard's status badge turns green once connected

## Running locally

```bash
npm install
cp .env.example .env   # fill in OWNER_NUMBER etc.
npm start
```

Then open `http://localhost:3000` and pair the same way as above.

Or with Docker:

```bash
docker build -t mesh-tech-md-bot .
docker run -p 3000:3000 -v $(pwd)/sessions:/app/sessions -v $(pwd)/data:/app/data mesh-tech-md-bot
```

## Notes

- Commands are triggered with a `.` prefix in WhatsApp chats (e.g. `.menu`, `.song`, `.antilink on`).
- Session credentials are stored locally under `sessions/<your-number>/` — never commit this folder (it's already in `.gitignore`).
- Whichever host you pick, make sure it doesn't spin the service down when idle (some free tiers do) — that would drop the WhatsApp connection.
