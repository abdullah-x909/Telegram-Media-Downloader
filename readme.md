# Telegram Media Downloader (Web)

<p align="center">
  <img src="https://img.shields.io/badge/Telegram%20Media%20Downloader-v3.5.2-blue?style=for-the-badge&logo=telegram" alt="Version">
  <a href="https://github.com/abdullah-x909/Telegram-Media-Downloader/releases">
    <img src="https://img.shields.io/github/v/release/abdullah-x909/Telegram-Media-Downloader?style=for-the-badge&color=green&logo=github" alt="Latest Release">
  </a>
  <a href="https://github.com/abdullah-x909/Telegram-Media-Downloader/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/abdullah-x909/Telegram-Media-Downloader?style=for-the-badge&color=important" alt="License: GPL v3">
  </a>
  <a href="https://github.com/abdullah-x909/Telegram-Media-Downloader/stargazers">
    <img src="https://img.shields.io/github/stars/abdullah-x909/Telegram-Media-Downloader?style=for-the-badge&color=yellow" alt="Stars">
  </a>
</p>

A lightweight userscript for Telegram Web that lets you download images, videos, GIFs, voice messages, stories, and profile photos — including from some restricted/no-save channels when Telegram exposes the media stream.

Important: This userscript does NOT bypass end-to-end encryption, DRM, or grant access to content your account cannot already view. It only works when Telegram provides an accessible media stream.

---

## ✨ Features

- 📸 Download images, GIFs, videos, and voice messages  
- 🖼️ Download profile photos and stories  
- 🔓 Works in restricted/protected/no-save channels when a media stream is available  
- 📥 Attempts to preserve original filenames from Telegram metadata  
- 📊 Real-time progress bar with percentage  
- ⚡ Bulk-download visible media in the current chat (via console helper)  
- 🌐 Compatible with Telegram Web, WebK, and WebZ  
- 🧩 Pure client-side userscript — no external servers or proxies

---

## 🚀 Quick Installation (≈30 seconds)

1. Install a userscript manager:
   - Tampermonkey (Chrome/Edge/Firefox/Safari) — https://www.tampermonkey.net/  
   - Violentmonkey (Chrome/Firefox/Edge/Opera) — https://violentmonkey.github.io/

2. Install the script:
   - [Click to install](https://github.com/abdullah-x909/Telegram-Media-Downloader/main/telegram-media-downloader.user.js)

3. Confirm installation in your userscript manager.

4. Open Telegram Web (web, webk, or webz) — download buttons will appear automatically on media viewers.

---

## 📖 Usage

### Download single media
1. Open an image, video, GIF, voice message, story, or profile photo in the Telegram viewer.  
2. Click the "⬇ Download" button in the viewer's top bar.  
3. The file will download (original filename when available).

### Bulk download visible media
1. Scroll in the chat so the media you want are loaded/visible.  
2. Open browser console (F12 → Console).  
3. Run:
```js
TGDL.bulkDownloadVisible();
```
All visible media will download sequentially with progress tracking.

### Download profile photos / avatars
```js
TGDL.downloadProfilePhotos();
```

---

## 🛠️ Supported Platforms

| Platform     | URL                               | Status |
|--------------|-----------------------------------|:------:|
| Telegram Web | https://web.telegram.org          | ✅ Full |
| WebK         | https://webk.telegram.org         | ✅ Full |
| WebZ         | https://webz.telegram.org         | ✅ Full |

Works on modern Chrome, Edge, and Firefox.

---

## ⚠️ Limitations

- ❌ Cannot download truly end-to-end encrypted or DRM-protected content.  
- ❌ Bulk download only covers currently visible/loaded media. No automatic scrolling or history scraping.  
- ⚡ Download speed is limited by Telegram's CDN and your network.  
- Telegram UI changes may require script updates; please report issues.

---

## 🙌 Contributing

Contributions welcome!

1. Star the repo.  
2. Fork and create a feature branch.  
3. Open a pull request with a clear description.

Ideas:
- Improved filename extraction
- Queue/pause/resume for bulk downloads
- Auto-adaptation to Telegram UI changes
- Additional media support

---

## 📜 License

Licensed under GNU GPL v3 — see LICENSE for details.

---

## ❤️ Author & Credits

Nestor Qin / Custom Fork  
GitHub: [Link](https://github.com/abdullah-x909/Telegram-Media-Downloader)

Disclaimer: This tool only accesses media your Telegram account is authorized to view. It does not bypass encryption, enable access to unauthorized content, or violate Telegram's Terms of Service. Use responsibly and at your own risk.
