# DevCraft Studio — Portfolio Website v3

> Single-page portfolio. Pure HTML, CSS, vanilla JS.  
> No frameworks. No build step. No localStorage. Deploys to GitHub Pages in under a minute.

---

## What This Is

A premium services showcase built to sell web development and automation work. It opens immediately — no popups, no gates, no friction. Every section has a distinct visual personality. The dark and light modes look genuinely different from each other, not just colour-inverted. The site is designed to make a visitor feel something before they finish reading the headline.

It glows on purpose.

---

## File Structure

```
/
├── index.html    — All markup: sections, navbar, ticker, modal
├── style.css     — All styling: themes, layout, animations, components
├── script.js     — All logic: rendering, interactivity, APIs, in-memory state
└── README.md     — This file
```

No `package.json`. No `node_modules`. No build step. Three files, drop anywhere, done.

---

## Running Locally

Most features work by opening `index.html` directly in a browser. However, geolocation and the Hacker News fetch require a proper server origin — browsers block those APIs on `file://`. Use one of these:

```bash
# Python (zero install — already on your machine)
python3 -m http.server 8000
# Visit: http://localhost:8000

# Node
npx serve .
```

---

## Deploying to GitHub Pages

This is the primary hosting environment this site was built for.

1. Push `index.html`, `style.css`, `script.js`, and `README.md` to the **root** of your repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: `main` (or your default), folder: `/ (root)`
4. Click Save. GitHub builds and publishes within about 60 seconds.
5. Your live URL: `https://yourusername.github.io/your-repo-name/`

> The site uses no `localStorage`, no `sessionStorage`, no service workers, and no cookies. Entirely stateless between visits — a perfect fit for static hosting with zero configuration.

---

## Other Deploy Options

**Netlify** — recommended if you want real form handling without a backend.

1. Drag the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop)
2. You get HTTPS and a live URL instantly
3. For form submissions, add `data-netlify="true"` and `name="contact"` to the `<form>` element in `index.html` — Netlify handles the rest with no backend code

**Vercel**

```bash
npx vercel
# Follow the prompts — live in seconds
```

---

## Design System

### Theme

Two genuinely different modes, toggled by the `◑` button in the top-right of the navbar. Theme state lives entirely in memory (`S.theme` in `script.js`) and is never written to `localStorage`. Every visit starts fresh in dark mode. This is intentional — dark is the primary designed experience and the one that glows.

| Token | Dark mode | Light mode |
|---|---|---|
| `--bg` | `#05050a` — deep black | `#f2ede4` — warm parchment |
| `--bg2` | `#0b0b14` — dark navy | `#e8e1d6` — warm grey |
| `--surf` | `#111120` — dark slate | `#faf7f2` — off-white |
| `--acc` | `#c8ff00` — electric lime | `#1a0aff` — electric blue |
| `--acc2` | `#ff4060` — coral red | `#d4001a` — crimson |
| `--gold` | `#ffcc00` | `#b8860b` |
| `--green` | `#00e87a` | `#006b3c` |

Switching theme immediately redraws the canvas bar chart and updates particle colours.

### Typography

Three fonts, loaded from Google Fonts:

**Syne** (`--f-head`, `--f-body`) — geometric sans with strong character. All headings and body text. Weights 400, 700, 800.

**JetBrains Mono** (`--f-mono`) — the developer's monospace. Every label, nav link, badge, KPI name, stat, code line, and ticker item. Weights 300, 400, 700.

**Playfair Display italic** (`--f-serif`) — used only for the italic accent words within section headings: *broken*, *actually*, *today*, *right now*, *solving*. The visual tension between Syne's geometric weight and Playfair's calligraphic curves is the typographic signature of this design. One font alone wouldn't produce that contrast.

### Grain

A fixed `<div class="bg-grain">` at `z-index: 998` applies an inline SVG fractal noise data URI at 2.8% opacity across the entire page. It adds physical texture that stops the design from feeling too perfectly digital. Zero performance cost — no image file, no HTTP request, no paint layer.

---

## Feature Reference

### Live Ticker

A continuous scrolling banner pinned to the very top of the page, above the navbar. Runs on pure CSS `animation: tickScroll` with content duplicated in HTML for a seamless infinite loop. Hovering pauses it.

Updates every **5 seconds** via `tickerTick()` in `script.js`:
- USD/ZAR and EUR/ZAR rates — simulated jitter around base values in the `FX` object
- Johannesburg local time via `toLocaleTimeString` with `timeZone: 'Africa/Johannesburg'`
- Static metrics: sites built, hours automated, uptime, error reduction, ROI

**To connect real exchange rates**, find `tickerTick()` in `script.js` and replace the jitter block:

```js
// Free tier available — exchangerate-api.com
const res  = await fetch('https://v6.exchangerate-api.com/v6/YOUR_KEY/latest/ZAR');
const data = await res.json();
S.fx.USD = 1 / data.conversion_rates.USD;
S.fx.EUR = 1 / data.conversion_rates.EUR;
S.fx.GBP = 1 / data.conversion_rates.GBP;
```

The currency converter in the Tools section reads from `S.fx` directly, so real rates flow through automatically.

---

### Particle Canvas

A `<canvas class="bg-canvas">` element sits fixed behind all content. `initCanvas()` in `script.js` creates 70 slow-drifting points and draws faint connecting lines between any two within 120px of each other. Particle and line colour responds to the active theme. Resets cleanly on window resize. This is the background that makes the page feel alive without being distracting.

---

### Custom Cursor

Two elements replace the OS cursor on desktop:

- `.cur-dot` — 8px filled circle, tracks the mouse instantly via `mousemove`
- `.cur-ring` — 32px outline ring, follows with lerp-based lag at 11% per frame via `requestAnimationFrame`

When hovering a link, button, or interactive card, the dot expands to 48px and switches to coral red (`--acc2`). Both use `mix-blend-mode: difference` to stay visible on any background colour.

Hidden automatically on touch/mobile via `window.matchMedia('(max-width:768px)')`.

---

### Navigation

**Sticky with blur** — `position: sticky; top: 0` with `backdrop-filter: blur(18px) saturate(160%)`. Gains a drop shadow after the user scrolls 60px.

**Active section tracking** — `IntersectionObserver` with `rootMargin: '-40% 0px -55% 0px'` watches all `<section id>` elements and toggles `.active` on the matching `.nl` link.

**Mobile hamburger** — at ≤768px, `.nav-links` becomes `position: absolute` below the navbar and toggles `.open` via the burger button. Closes automatically when any link is tapped.

**Floating action button (FAB)** — fixed to the bottom-right, appears after 400px scroll. Glows with the current accent colour. Opens the contact modal.

---

### Home Section

**Layout** — CSS grid: a rotated vertical sidebar label on the left, the headline/stats column in the centre, and a Python terminal on the right. The sidebar (`DEVCRAFT · STUDIO · 2026 · JHB`) is purely decorative and hidden on mobile. The terminal column is also hidden on mobile to keep the focus on the headline.

**Headline** — three typographic layers stacked vertically:

1. `"We turn"` — JetBrains Mono, small, muted, all-caps label treatment
2. `"broken"` — Playfair Display italic, enormous, rendered in the accent colour in dark mode and as an outline stroke in light mode
3. `"workflows into weapons."` — Syne 800, large, in the primary text colour

**Stat counters** — three numbers count up from zero using a cubic ease-out when they enter the viewport. Triggered by `IntersectionObserver` watching `[data-count]` attributes.

**Typing terminal** — a macOS-style terminal window types out a Python automation script character by character. Each token type (keywords, functions, strings, comments, numbers) is tagged with a colour class mid-type. The blinking `▌` cursor is a step-end CSS animation. Three floating chips (`⚡ Runs 24/7`, `📦 Inventory sync`, `📊 Dashboard push`) bob with staggered CSS keyframe animations on independent timers.

**Scanline overlay** — a `::before` pseudo-element on `.s-home` applies a repeating horizontal line pattern at ~2.5% opacity. Subtle CRT effect that reinforces the technical character of the section.

---

### Services Section (01)

Seven service cards rendered from the `SERVICES` array in `script.js`, laid out in a CSS grid with `repeat(auto-fill, minmax(240px, 1fr))`.

The grid uses a single shared background (`background: var(--brd)`) with card cells filled individually. The 1px gaps between cells become the natural grid lines — no borders are declared explicitly on the cards. This is the technique that makes it look like an editorial table rather than a card stack.

Each card has a `::after` pseudo-element that slides in a 2px accent-coloured underline from the left on hover.

**To add, remove, or edit a service**, update the `SERVICES` array at the top of `script.js`:

```js
{ emoji: '🔧', title: 'Your Service', desc: 'One-sentence description.', tag: 'keyword' }
```

---

### Work / Dashboard Section (02)

An interactive simulation showing the business impact of automation at different depths.

**Automation depth slider** — range 0–100. Triggers `updateKpis()` on every input event, which recalculates three values and animates the KPI displays using a lerp-based counter.

**Industry selector** — Retail / Logistics / Finance. Each applies multipliers from the `IND_MUL` object:

```js
const IND_MUL = {
  retail:    { h: 1.0,  e: 1.0,  s: 1.0 },
  logistics: { h: 1.4,  e: 0.85, s: 1.2 },
  finance:   { h: 0.75, e: 1.35, s: 0.9 },
};
```

**KPI sparklines** — each KPI card has an inline SVG sparkline generated by `sparkline()`. The line is regenerated with fresh noise on every slider move, so it always looks organic. Rendered as a `<polyline>` plus a fill polygon directly on the SVG element.

**Bar chart** — `<canvas id="barChart">` drawn via Canvas 2D API. Four bars represent manual, scripted, semi-automated, and fully automated states. The active bar is highlighted in the current accent colour. Redraws on slider input, theme toggle, and window resize.

**Testimonial rotator** — quotes from the `TESTIMONIALS` array in `script.js` cycle every 5 seconds. Dot indicators are clickable to jump directly.

**To add testimonials**, edit the `TESTIMONIALS` array:

```js
{ text: '"Your client quote here."', who: '— Name, Role · City' }
```

---

### Tools Section (03)

**Currency Converter** — converts between ZAR, USD, EUR, and GBP. Reads from `S.fx`, updated by the ticker every 5 seconds. The swap button (⇅) rotates 180° on hover and swaps the currency dropdowns. Rate line shows the exact conversion factor.

**Automation ROI Calculator** — three sliders:
- Hours wasted per week (1–80)
- Team size (1–50)
- Average hourly rate in ZAR (R100–R1,500)

Formula: `hours × team × rate × 4.33` (4.33 weeks per month average). The large gold result is deliberately confrontational — it shows the monthly financial cost of *not* automating.

**World Clock** — six cities, updated every second via `setInterval`. Defined in the `CLOCKS` array:

```js
const CLOCKS = [
  { city: 'Johannesburg', tz: 'Africa/Johannesburg' },
  { city: 'London',       tz: 'Europe/London' },
  // add or replace any entry with a valid IANA timezone string
];
```

---

### Feed Section (04)

Fetches from `https://hnrss.org/frontpage.jsonfeed` — Hacker News front page as a JSON Feed. Free, no API key, no rate limit for normal use. Displays 9 stories.

Geolocation is requested to personalise the heading. Denied or unavailable = silent fallback to "Global tech feed".

**To use a different source**, replace the fetch in `fetchNews()`:

```js
// NewsAPI (free tier — newsapi.org)
const res  = await fetch('https://newsapi.org/v2/top-headlines?category=technology&apiKey=YOUR_KEY');
const data = await res.json();
const items = data.articles.slice(0, 9);
// map: item.title, item.description, item.url, item.publishedAt
```

---

### Contact Section (05)

The section displays three pulsing concentric rings around a glowing envelope icon. The form itself lives inside a modal to keep the section visually clean.

The modal opens from any "Hire Me", "Open Project Brief", or FAB button. Fields: name, email, service selector, project brief. On submit: confirmation message, form reset, modal close after 2.8 seconds.

**To wire the form to a real backend**, replace the handler in `initContactForm()` in `script.js`:

```js
// Option A: Formspree (free tier — formspree.io)
// Add to <form> in index.html: action="https://formspree.io/f/YOUR_ID" method="POST"
// Remove e.preventDefault() from initContactForm()

// Option B: Netlify Forms (zero backend)
// Add to <form> in index.html: data-netlify="true" name="contact"
// Remove e.preventDefault()

// Option C: Custom API endpoint
const data = new FormData(e.target);
await fetch('https://your-api.com/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(data)),
});
```

**Modal API** — both `openModal(id)` and `closeModal(id)` are attached to `window` so inline HTML `onclick` attributes work. The `Escape` key and backdrop click both close any open modal.

---

## Customisation Quick Reference

| What to change | Where |
|---|---|
| Brand name | `index.html` — `.nav-logo` and `.foot-brand` |
| Dark accent colour | `style.css` — `--acc` inside `:root` |
| Light accent colour | `style.css` — `--acc` inside `[data-theme="light"]` |
| Background colours | `style.css` — `--bg`, `--bg2`, `--surf`, `--surf2` |
| Services | `script.js` — `SERVICES` array |
| Testimonials | `script.js` — `TESTIMONIALS` array |
| World clock cities | `script.js` — `CLOCKS` array |
| FX base rates | `script.js` — `FX` object |
| Ticker static figures | `index.html` — `.ti` span elements |
| Hero headline layers | `index.html` — `.h1a`, `.h1b`, `.h1c` |
| Hero sub-copy | `index.html` — `.home-p` paragraph |
| Contact badges | `index.html` — `.c-badges` spans |
| Section eyebrow numbers | `index.html` — `.sec-num` divs |
| Fonts | `index.html` Google Fonts link · `style.css` `--f-head`, `--f-mono`, `--f-serif` |
| SEO metadata | `index.html` — `<title>` and `<meta name="description">` |
| News source | `script.js` — `fetchNews()` |
| Contact form backend | `script.js` — `initContactForm()` |
| ROI currency symbol | `script.js` — `updateROI()` — change the `R` prefix strings |
| Particle count | `script.js` — `initCanvas()` — `length: 70` |
| Particle speed | `script.js` — `initCanvas()` — `vx/vy` multipliers (currently `0.18`) |

---

## Third-Party Services

| Service | Purpose | Cost | Key required |
|---|---|---|---|
| Google Fonts | Syne, JetBrains Mono, Playfair Display | Free | No |
| hnrss.org | Hacker News front page as JSON Feed | Free | No |
| Nominatim (OpenStreetMap) | Reverse geocoding — coordinates to country name | Free | No |
| Browser Geolocation API | User coordinates, with permission prompt | Free | No |

Everything works out of the box with zero paid services and zero API keys.

---

## Browser Support

| Feature | Behaviour if unsupported |
|---|---|
| `backdrop-filter` blur | Navbar and modal render with opaque background |
| `canvas.roundRect()` | Bar chart corners are square (Safari < 15.4) |
| `IntersectionObserver` | Supported everywhere since 2019 |
| Custom cursor | Hidden on touch/mobile automatically |
| CSS `clamp()` | Supported everywhere since 2020 |
| `toLocaleTimeString` + `timeZone` | Works in all modern browsers — IANA tz data is built-in |

Tested in: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+.

---

## Performance Notes

- Zero frameworks, zero bundler — JS is ~675 lines, under 15 KB raw
- Particle canvas runs a `requestAnimationFrame` loop with 70 dots and ~2,450 distance checks per frame — comfortably within budget on any modern device
- All scroll triggers use `IntersectionObserver` — no `scroll` event listeners on the main thread
- Google Fonts loads three families at selected weights — acceptable for a portfolio; consider subsetting if mobile load time is a priority
- For production: minify with `npx terser script.js -o script.min.js` and `npx clean-css-cli style.css -o style.min.css`, then update the `<link>` and `<script>` tags in `index.html`

---

## License

MIT License

Copyright (c) 2026 DevCraft Studio

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

*Three files. Zero dependencies. Deploys in 60 seconds. Built with intention.*# DevCraft Studio — Portfolio Website v3

> Single-page portfolio. Pure HTML, CSS, vanilla JS.  
> No frameworks. No build step. No localStorage. Deploys to GitHub Pages in under a minute.

---

## What This Is

A premium services showcase built to sell web development and automation work. It opens immediately — no popups, no gates, no friction. Every section has a distinct visual personality. The dark and light modes look genuinely different from each other, not just colour-inverted. The site is designed to make a visitor feel something before they finish reading the headline.

It glows on purpose.

---

## File Structure

```
/
├── index.html    — All markup: sections, navbar, ticker, modal
├── style.css     — All styling: themes, layout, animations, components
├── script.js     — All logic: rendering, interactivity, APIs, in-memory state
└── README.md     — This file
```

No `package.json`. No `node_modules`. No build step. Three files, drop anywhere, done.

---

## Running Locally

Most features work by opening `index.html` directly in a browser. However, geolocation and the Hacker News fetch require a proper server origin — browsers block those APIs on `file://`. Use one of these:

```bash
# Python (zero install — already on your machine)
python3 -m http.server 8000
# Visit: http://localhost:8000

# Node
npx serve .
```

---

## Deploying to GitHub Pages

This is the primary hosting environment this site was built for.

1. Push `index.html`, `style.css`, `script.js`, and `README.md` to the **root** of your repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: `main` (or your default), folder: `/ (root)`
4. Click Save. GitHub builds and publishes within about 60 seconds.
5. Your live URL: `https://yourusername.github.io/your-repo-name/`

> The site uses no `localStorage`, no `sessionStorage`, no service workers, and no cookies. Entirely stateless between visits — a perfect fit for static hosting with zero configuration.

---

## Other Deploy Options

**Netlify** — recommended if you want real form handling without a backend.

1. Drag the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop)
2. You get HTTPS and a live URL instantly
3. For form submissions, add `data-netlify="true"` and `name="contact"` to the `<form>` element in `index.html` — Netlify handles the rest with no backend code

**Vercel**

```bash
npx vercel
# Follow the prompts — live in seconds
```

---

## Design System

### Theme

Two genuinely different modes, toggled by the `◑` button in the top-right of the navbar. Theme state lives entirely in memory (`S.theme` in `script.js`) and is never written to `localStorage`. Every visit starts fresh in dark mode. This is intentional — dark is the primary designed experience and the one that glows.

| Token | Dark mode | Light mode |
|---|---|---|
| `--bg` | `#05050a` — deep black | `#f2ede4` — warm parchment |
| `--bg2` | `#0b0b14` — dark navy | `#e8e1d6` — warm grey |
| `--surf` | `#111120` — dark slate | `#faf7f2` — off-white |
| `--acc` | `#c8ff00` — electric lime | `#1a0aff` — electric blue |
| `--acc2` | `#ff4060` — coral red | `#d4001a` — crimson |
| `--gold` | `#ffcc00` | `#b8860b` |
| `--green` | `#00e87a` | `#006b3c` |

Switching theme immediately redraws the canvas bar chart and updates particle colours.

### Typography

Three fonts, loaded from Google Fonts:

**Syne** (`--f-head`, `--f-body`) — geometric sans with strong character. All headings and body text. Weights 400, 700, 800.

**JetBrains Mono** (`--f-mono`) — the developer's monospace. Every label, nav link, badge, KPI name, stat, code line, and ticker item. Weights 300, 400, 700.

**Playfair Display italic** (`--f-serif`) — used only for the italic accent words within section headings: *broken*, *actually*, *today*, *right now*, *solving*. The visual tension between Syne's geometric weight and Playfair's calligraphic curves is the typographic signature of this design. One font alone wouldn't produce that contrast.

### Grain

A fixed `<div class="bg-grain">` at `z-index: 998` applies an inline SVG fractal noise data URI at 2.8% opacity across the entire page. It adds physical texture that stops the design from feeling too perfectly digital. Zero performance cost — no image file, no HTTP request, no paint layer.

---

## Feature Reference

### Live Ticker

A continuous scrolling banner pinned to the very top of the page, above the navbar. Runs on pure CSS `animation: tickScroll` with content duplicated in HTML for a seamless infinite loop. Hovering pauses it.

Updates every **5 seconds** via `tickerTick()` in `script.js`:
- USD/ZAR and EUR/ZAR rates — simulated jitter around base values in the `FX` object
- Johannesburg local time via `toLocaleTimeString` with `timeZone: 'Africa/Johannesburg'`
- Static metrics: sites built, hours automated, uptime, error reduction, ROI

**To connect real exchange rates**, find `tickerTick()` in `script.js` and replace the jitter block:

```js
// Free tier available — exchangerate-api.com
const res  = await fetch('https://v6.exchangerate-api.com/v6/YOUR_KEY/latest/ZAR');
const data = await res.json();
S.fx.USD = 1 / data.conversion_rates.USD;
S.fx.EUR = 1 / data.conversion_rates.EUR;
S.fx.GBP = 1 / data.conversion_rates.GBP;
```

The currency converter in the Tools section reads from `S.fx` directly, so real rates flow through automatically.

---

### Particle Canvas

A `<canvas class="bg-canvas">` element sits fixed behind all content. `initCanvas()` in `script.js` creates 70 slow-drifting points and draws faint connecting lines between any two within 120px of each other. Particle and line colour responds to the active theme. Resets cleanly on window resize. This is the background that makes the page feel alive without being distracting.

---

### Custom Cursor

Two elements replace the OS cursor on desktop:

- `.cur-dot` — 8px filled circle, tracks the mouse instantly via `mousemove`
- `.cur-ring` — 32px outline ring, follows with lerp-based lag at 11% per frame via `requestAnimationFrame`

When hovering a link, button, or interactive card, the dot expands to 48px and switches to coral red (`--acc2`). Both use `mix-blend-mode: difference` to stay visible on any background colour.

Hidden automatically on touch/mobile via `window.matchMedia('(max-width:768px)')`.

---

### Navigation

**Sticky with blur** — `position: sticky; top: 0` with `backdrop-filter: blur(18px) saturate(160%)`. Gains a drop shadow after the user scrolls 60px.

**Active section tracking** — `IntersectionObserver` with `rootMargin: '-40% 0px -55% 0px'` watches all `<section id>` elements and toggles `.active` on the matching `.nl` link.

**Mobile hamburger** — at ≤768px, `.nav-links` becomes `position: absolute` below the navbar and toggles `.open` via the burger button. Closes automatically when any link is tapped.

**Floating action button (FAB)** — fixed to the bottom-right, appears after 400px scroll. Glows with the current accent colour. Opens the contact modal.

---

### Home Section

**Layout** — CSS grid: a rotated vertical sidebar label on the left, the headline/stats column in the centre, and a Python terminal on the right. The sidebar (`DEVCRAFT · STUDIO · 2026 · JHB`) is purely decorative and hidden on mobile. The terminal column is also hidden on mobile to keep the focus on the headline.

**Headline** — three typographic layers stacked vertically:

1. `"We turn"` — JetBrains Mono, small, muted, all-caps label treatment
2. `"broken"` — Playfair Display italic, enormous, rendered in the accent colour in dark mode and as an outline stroke in light mode
3. `"workflows into weapons."` — Syne 800, large, in the primary text colour

**Stat counters** — three numbers count up from zero using a cubic ease-out when they enter the viewport. Triggered by `IntersectionObserver` watching `[data-count]` attributes.

**Typing terminal** — a macOS-style terminal window types out a Python automation script character by character. Each token type (keywords, functions, strings, comments, numbers) is tagged with a colour class mid-type. The blinking `▌` cursor is a step-end CSS animation. Three floating chips (`⚡ Runs 24/7`, `📦 Inventory sync`, `📊 Dashboard push`) bob with staggered CSS keyframe animations on independent timers.

**Scanline overlay** — a `::before` pseudo-element on `.s-home` applies a repeating horizontal line pattern at ~2.5% opacity. Subtle CRT effect that reinforces the technical character of the section.

---

### Services Section (01)

Seven service cards rendered from the `SERVICES` array in `script.js`, laid out in a CSS grid with `repeat(auto-fill, minmax(240px, 1fr))`.

The grid uses a single shared background (`background: var(--brd)`) with card cells filled individually. The 1px gaps between cells become the natural grid lines — no borders are declared explicitly on the cards. This is the technique that makes it look like an editorial table rather than a card stack.

Each card has a `::after` pseudo-element that slides in a 2px accent-coloured underline from the left on hover.

**To add, remove, or edit a service**, update the `SERVICES` array at the top of `script.js`:

```js
{ emoji: '🔧', title: 'Your Service', desc: 'One-sentence description.', tag: 'keyword' }
```

---

### Work / Dashboard Section (02)

An interactive simulation showing the business impact of automation at different depths.

**Automation depth slider** — range 0–100. Triggers `updateKpis()` on every input event, which recalculates three values and animates the KPI displays using a lerp-based counter.

**Industry selector** — Retail / Logistics / Finance. Each applies multipliers from the `IND_MUL` object:

```js
const IND_MUL = {
  retail:    { h: 1.0,  e: 1.0,  s: 1.0 },
  logistics: { h: 1.4,  e: 0.85, s: 1.2 },
  finance:   { h: 0.75, e: 1.35, s: 0.9 },
};
```

**KPI sparklines** — each KPI card has an inline SVG sparkline generated by `sparkline()`. The line is regenerated with fresh noise on every slider move, so it always looks organic. Rendered as a `<polyline>` plus a fill polygon directly on the SVG element.

**Bar chart** — `<canvas id="barChart">` drawn via Canvas 2D API. Four bars represent manual, scripted, semi-automated, and fully automated states. The active bar is highlighted in the current accent colour. Redraws on slider input, theme toggle, and window resize.

**Testimonial rotator** — quotes from the `TESTIMONIALS` array in `script.js` cycle every 5 seconds. Dot indicators are clickable to jump directly.

**To add testimonials**, edit the `TESTIMONIALS` array:

```js
{ text: '"Your client quote here."', who: '— Name, Role · City' }
```

---

### Tools Section (03)

**Currency Converter** — converts between ZAR, USD, EUR, and GBP. Reads from `S.fx`, updated by the ticker every 5 seconds. The swap button (⇅) rotates 180° on hover and swaps the currency dropdowns. Rate line shows the exact conversion factor.

**Automation ROI Calculator** — three sliders:
- Hours wasted per week (1–80)
- Team size (1–50)
- Average hourly rate in ZAR (R100–R1,500)

Formula: `hours × team × rate × 4.33` (4.33 weeks per month average). The large gold result is deliberately confrontational — it shows the monthly financial cost of *not* automating.

**World Clock** — six cities, updated every second via `setInterval`. Defined in the `CLOCKS` array:

```js
const CLOCKS = [
  { city: 'Johannesburg', tz: 'Africa/Johannesburg' },
  { city: 'London',       tz: 'Europe/London' },
  // add or replace any entry with a valid IANA timezone string
];
```

---

### Feed Section (04)

Fetches from `https://hnrss.org/frontpage.jsonfeed` — Hacker News front page as a JSON Feed. Free, no API key, no rate limit for normal use. Displays 9 stories.

Geolocation is requested to personalise the heading. Denied or unavailable = silent fallback to "Global tech feed".

**To use a different source**, replace the fetch in `fetchNews()`:

```js
// NewsAPI (free tier — newsapi.org)
const res  = await fetch('https://newsapi.org/v2/top-headlines?category=technology&apiKey=YOUR_KEY');
const data = await res.json();
const items = data.articles.slice(0, 9);
// map: item.title, item.description, item.url, item.publishedAt
```

---

### Contact Section (05)

The section displays three pulsing concentric rings around a glowing envelope icon. The form itself lives inside a modal to keep the section visually clean.

The modal opens from any "Hire Me", "Open Project Brief", or FAB button. Fields: name, email, service selector, project brief. On submit: confirmation message, form reset, modal close after 2.8 seconds.

**To wire the form to a real backend**, replace the handler in `initContactForm()` in `script.js`:

```js
// Option A: Formspree (free tier — formspree.io)
// Add to <form> in index.html: action="https://formspree.io/f/YOUR_ID" method="POST"
// Remove e.preventDefault() from initContactForm()

// Option B: Netlify Forms (zero backend)
// Add to <form> in index.html: data-netlify="true" name="contact"
// Remove e.preventDefault()

// Option C: Custom API endpoint
const data = new FormData(e.target);
await fetch('https://your-api.com/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(data)),
});
```

**Modal API** — both `openModal(id)` and `closeModal(id)` are attached to `window` so inline HTML `onclick` attributes work. The `Escape` key and backdrop click both close any open modal.

---

## Customisation Quick Reference

| What to change | Where |
|---|---|
| Brand name | `index.html` — `.nav-logo` and `.foot-brand` |
| Dark accent colour | `style.css` — `--acc` inside `:root` |
| Light accent colour | `style.css` — `--acc` inside `[data-theme="light"]` |
| Background colours | `style.css` — `--bg`, `--bg2`, `--surf`, `--surf2` |
| Services | `script.js` — `SERVICES` array |
| Testimonials | `script.js` — `TESTIMONIALS` array |
| World clock cities | `script.js` — `CLOCKS` array |
| FX base rates | `script.js` — `FX` object |
| Ticker static figures | `index.html` — `.ti` span elements |
| Hero headline layers | `index.html` — `.h1a`, `.h1b`, `.h1c` |
| Hero sub-copy | `index.html` — `.home-p` paragraph |
| Contact badges | `index.html` — `.c-badges` spans |
| Section eyebrow numbers | `index.html` — `.sec-num` divs |
| Fonts | `index.html` Google Fonts link · `style.css` `--f-head`, `--f-mono`, `--f-serif` |
| SEO metadata | `index.html` — `<title>` and `<meta name="description">` |
| News source | `script.js` — `fetchNews()` |
| Contact form backend | `script.js` — `initContactForm()` |
| ROI currency symbol | `script.js` — `updateROI()` — change the `R` prefix strings |
| Particle count | `script.js` — `initCanvas()` — `length: 70` |
| Particle speed | `script.js` — `initCanvas()` — `vx/vy` multipliers (currently `0.18`) |

---

## Third-Party Services

| Service | Purpose | Cost | Key required |
|---|---|---|---|
| Google Fonts | Syne, JetBrains Mono, Playfair Display | Free | No |
| hnrss.org | Hacker News front page as JSON Feed | Free | No |
| Nominatim (OpenStreetMap) | Reverse geocoding — coordinates to country name | Free | No |
| Browser Geolocation API | User coordinates, with permission prompt | Free | No |

Everything works out of the box with zero paid services and zero API keys.

---

## Browser Support

| Feature | Behaviour if unsupported |
|---|---|
| `backdrop-filter` blur | Navbar and modal render with opaque background |
| `canvas.roundRect()` | Bar chart corners are square (Safari < 15.4) |
| `IntersectionObserver` | Supported everywhere since 2019 |
| Custom cursor | Hidden on touch/mobile automatically |
| CSS `clamp()` | Supported everywhere since 2020 |
| `toLocaleTimeString` + `timeZone` | Works in all modern browsers — IANA tz data is built-in |

Tested in: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+.

---

## Performance Notes

- Zero frameworks, zero bundler — JS is ~675 lines, under 15 KB raw
- Particle canvas runs a `requestAnimationFrame` loop with 70 dots and ~2,450 distance checks per frame — comfortably within budget on any modern device
- All scroll triggers use `IntersectionObserver` — no `scroll` event listeners on the main thread
- Google Fonts loads three families at selected weights — acceptable for a portfolio; consider subsetting if mobile load time is a priority
- For production: minify with `npx terser script.js -o script.min.js` and `npx clean-css-cli style.css -o style.min.css`, then update the `<link>` and `<script>` tags in `index.html`

---

## License

MIT License

Copyright (c) 2026 DevCraft Studio

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

*Three files. Zero dependencies. Deploys in 60 seconds. Built with intention.*