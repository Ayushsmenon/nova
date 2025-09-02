# group4 — Web-based Torrent Player (demo)

**Quick summary**
A simple demo web app that lets you paste a magnet link or upload a `.torrent` file and stream playable files (video/audio) directly in the browser using **WebTorrent (browser)**. This repo is intended for learning and experimentation only. **Do not use it to access copyrighted content you don't have rights to.**

## What's included
- `public/index.html` — front-end UI (uses WebTorrent via CDN).
- `public/app.js` — front-end JavaScript logic.
- `public/styles.css` — minimal styling.
- `server.js` — tiny Express server to serve the static files (optional).
- `package.json` — for running the server.
- `.gitignore`

## How it works (simple)
1. The browser loads `index.html` and `app.js`. `app.js` uses the **WebTorrent** library (browser build) to create a client in the browser.
2. When you paste a magnet link or upload a `.torrent` file, the client adds it and starts finding peers (via WebRTC trackers).
3. When file pieces arrive, the browser can stream playable files by creating object URLs from the torrent file blobs and assigning them to `<video>` / `<audio>` elements.

**Limitations & notes**
- Browser WebTorrent relies on WebRTC-capable peers and websocket or WebRTC trackers — it may not find peers for many torrents.
- This is a demo; production apps require more error handling, security, and probably a server-side torrent gateway (e.g., WebTorrent-hybrid) to improve peer connectivity.
- Legal: only stream content you have the right to access.

## Run locally
Requirements: Node.js (for `server.js`) or any static file server.

1. Install dependencies (optional, only for server):
```bash
cd group4
npm install
```
2. Run the server:
```bash
npm start
```
3. Open http://localhost:3000 in your browser.

Alternatively, open `public/index.html` directly in a browser, but some browsers restrict file access — using a simple static server is recommended.

## Files explained (short)
- `public/index.html` — UI: input for magnet, torrent upload, file list, player area, logs.
- `public/app.js` — uses `WebTorrent()` to add magnet or torrent blob. Handles file selection and streaming to `<video>`/`<audio>`.
- `server.js` — serves `public/` on port 3000.

## Next steps / improvements
- Add a small server-side torrent gateway (webtorrent-hybrid) to improve peer connectivity and allow serving via HTTP range requests.
- Add subtitles, seek buffering info, better UI, and torrent metadata caching.

**Done for learning.** If you want, I can extend this into a full GitHub repo, add CI, or implement a server-side seeding gateway — tell me which next.
