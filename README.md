# group4 — Web-based Torrent Player (GitHub Pages version)

This is a static web app that streams torrents directly in the browser using [WebTorrent](https://webtorrent.io/).

## Live site
Once deployed with GitHub Pages, it will be accessible at:

```
https://ayushsmenon.github.io/group4/
```

## How to deploy (already set up for GitHub Pages)
1. Create a repo named `group4` in your GitHub account.
2. Upload these files into the repo root.
3. Commit and push.
4. Go to **Settings → Pages** → enable "Deploy from branch".
5. Select `main` branch, `/ (root)` folder.
6. Save. Your site will be live in ~1 minute.

## Files
- `index.html` → UI
- `app.js` → torrent logic
- `styles.css` → styling

## Notes
- Only works with WebRTC-capable torrent peers (browser limitation).
- Use only for legal content you have rights to access.
