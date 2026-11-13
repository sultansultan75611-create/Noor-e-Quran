# Noor-e-Quran

A beginner-friendly, responsive Quran reading website built with HTML, CSS and vanilla JavaScript.

## Features
- Browse all 114 Surahs
- Arabic Quran text
- English and Urdu translation choices
- Audio recitation (Mishary Rashid Alafasy)
- Search Surahs by name or number
- Increase/decrease Arabic font size
- Light and dark themes
- Responsive layout for phones and computers

## Run on your device
1. Download and extract `noor-e-quran.zip`.
2. Open the `noor-e-quran` folder.
3. Open `index.html` in a modern browser while connected to the internet.

For best results, use a local development server (for example, VS Code Live Server). The Quran text, translations and Surah list are fetched from AlQuran Cloud API, so an internet connection is required.

## Publish free with GitHub Pages
1. Sign in to GitHub and create a new **public** repository named `noor-e-quran`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish. Your website URL will appear in the Pages section.

## API and content notes
- Surah list and Arabic text: `https://api.alquran.cloud/v1`
- Translations: AlQuran Cloud edition identifiers (including `en.sahih` and `ur.jalandhry`).
- Audio: Islamic Network CDN, Alafasy recitation.
- This demo does not use a private API key. Never place secret keys in frontend JavaScript.
- Translation availability, licensing and audio hosting can change. Check the provider's current terms before public/commercial use. Verify Quran text and translation with trusted Quran editions before relying on it.

## Customization
- Change the site name in `index.html`.
- Change colors in the `:root` section at the top of `style.css`.
- Add supported translation edition IDs to the selector in `index.html`.
