# Web Development Services Showcase SPA

## Project Overview
This repository contains a lightweight, single-page portfolio website built with **HTML5**, **CSS3**, and **vanilla JavaScript** to showcase premium web development and automation services.

It includes:
- Smooth section navigation (Home, Services, Portfolio, News, Contact)
- Dark/light/auto theme support
- Personalized user experience via an intro modal prompt
- Dynamic service recommendations based on input keywords
- Interactive dashboard simulation with live KPI changes
- Geolocation-aware tech news feed (with global fallback)
- Persuasive conversion elements (scarcity messaging, testimonials, floating CTA)
- Mobile-first responsive layout and SEO-ready metadata

## Services Showcased
- Building Python automation tools
- Creating WordPress sites
- Developing dynamic web applications
- Building static HTML websites
- Simplifying and automating Excel spreadsheets
- Digitizing Excel workflows into interactive dashboards
- Creating inventory and stock control tools

## Setup Instructions

### 1) Required files (root folder)
Make sure these files exist in the root of your repo:
- `index.html`
- `style.css`
- `script.js`
- `README.md`

### 2) Run locally
You can open `index.html` directly in a browser, but for best compatibility (especially fetch/geolocation), run a local server:

```bash
# Option A: Python
python3 -m http.server 8000

# Option B: Node (if installed)
npx serve .
```

Then visit:
- `http://localhost:8000` (Python)
- or the URL shown by `serve`

### 3) Deploy with GitHub Pages
1. Push files to your GitHub repository root.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: `main` (or your default branch), folder `/ (root)`
4. Save and wait for deployment.
5. Open the generated GitHub Pages URL.

### 4) News API / feed notes
This project works out-of-the-box using a free Hacker News JSON feed:
- `https://hnrss.org/frontpage.jsonfeed`

If you want localized or broader news categories from NewsAPI, replace the fetch in `script.js` with:
- `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=YOUR_KEY`

> You must create your own key at [https://newsapi.org](https://newsapi.org) and replace `YOUR_KEY`.

### 5) Browser permissions
- The app requests **geolocation permission** to tailor the news heading/location context.
- If denied, it automatically falls back to global tech headlines.

## Customization Tips
- Update brand text (`DevCraftStudio`) in `index.html`.
- Replace placeholder testimonials with real client feedback.
- Customize service cards in `script.js` (`services` array).
- Connect the contact form to your backend or form service (Formspree, Netlify Forms, custom API).
- Improve performance:
  - Minify `style.css` and `script.js` for production
  - Optimize/lazy-load any future images/media assets
  - Keep external dependencies minimal (currently only Google Fonts)
  - Use font-display defaults from Google Fonts and limit font weights

## License (MIT)
This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```