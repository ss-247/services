# DevCraft Studio — Portfolio Website

> A dramatic, interactive single-page portfolio built with pure HTML5, CSS3, and vanilla JavaScript.  
> No frameworks. No build tools. No dependencies beyond a Google Fonts import.

---

## What This Is

A premium services showcase site designed to sell web development and automation work. Every section has its own visual personality. Dark and light modes look completely different from each other — not just colour-inverted, but genuinely different moods. The site is built to make visitors feel something before they read a single word.

---

## What Was Built / What Changed

This is a ground-up redesign of the original portfolio. Here is a full account of every feature and why it exists.

### Visual System

**Two genuinely different themes**

Dark mode uses a deep black/midnight background (`#080810`) with neon cyan and magenta accents, animated glowing orbs, a CSS noise texture overlay, and a grid backdrop. It feels like a Bloomberg terminal crossed with a design studio — serious, technical, alive.

Light mode uses warm parchment/cream tones (`#f5f4ee`) with ink-blue and crimson accents. Same layout, completely different editorial mood — closer to a high-end print magazine. Switching between them is dramatic on purpose.

The theme preference is saved to `localStorage` so it persists across visits.

**Typography stack**

Three fonts are loaded from Google Fonts:
- `Bebas Neue` — display/headline font. All-caps, industrial, high-impact.
- `Space Mono` — monospace for labels, nav links, badges, and code. Gives a technical/terminal feel.
- `DM Sans` — clean humanist sans for body copy and descriptions.

**Animated background orbs**

Three blurred radial gradient blobs float slowly behind every section using CSS `@keyframes`. Their colours shift per section as you scroll — teal/magenta on Home, gold/green on Services, pink on Portfolio, blue on Tools, green on News, gold on Contact. This is handled by an `IntersectionObserver` in `script.js` that watches each `<section>` and updates the orb gradients.

**Noise texture overlay**

A fixed SVG fractal noise element sits at `z-index: 999` at 2.2% opacity across the entire page. It adds subtle grain that prevents the design from feeling too digital and flat. It has no performance cost — it is a single SVG data URI, not an image file.

---

### Navigation

**Sticky navbar with blur**

The navbar uses `position: sticky` with `backdrop-filter: blur(20px) saturate(180%)`. It gains a drop shadow once the user scrolls past 60px. On mobile it collapses to a hamburger menu.

**Active section tracking**

An `IntersectionObserver` watches all `<section>` elements and adds an `.active` class to the matching nav link as sections enter the viewport. The rootMargin is tuned so the active state changes slightly before a section fully enters, which feels natural.

**Floating CTA button**

A fixed button appears in the bottom-right corner after the user scrolls 400px. It opens the contact modal. It has a neon glow and lifts slightly on hover.

---

### Live Ticker Tape

A scrolling financial-ticker banner sits between the browser edge and the navbar. It runs on pure CSS `animation: tickerScroll` with the content duplicated in HTML for a seamless infinite loop.

It shows:
- Sites built (static count)
- Hours automated (static count)
- USD/ZAR exchange rate (simulated live — jitters every 5 seconds)
- EUR/ZAR exchange rate (simulated live)
- Error elimination percentage
- Client uptime
- Automation ROI
- Current Johannesburg time (updates every 5 seconds from `Date` + `toLocaleTimeString`)

Hovering the ticker pauses it.

**To connect to a real FX API**, find the `FX_BASE` object in `script.js` and the `updateTicker()` function. Replace the jitter logic with a fetch call to a provider such as [exchangerate-api.com](https://www.exchangerate-api.com) (free tier available) or [Open Exchange Rates](https://openexchangerates.org).

```js
// In script.js — replace this block inside updateTicker():
const res = await fetch('https://v6.exchangerate-api.com/v6/YOUR_KEY/latest/ZAR');
const data = await res.json();
state.fxRates.USD = 1 / data.conversion_rates.USD;
state.fxRates.EUR = 1 / data.conversion_rates.EUR;
```

---

### Custom Cursor

On desktop, the default OS cursor is hidden (`cursor: none` on `body`) and replaced with two elements: a small filled dot that follows the mouse instantly, and a larger ring that follows with a lerp-based lag (12% per frame). When hovering interactive elements the dot expands and changes colour.

This is disabled automatically on touch/mobile devices via a media query check.

---

### Hero Section

**Staggered text reveal**

The three headline words animate in with a `translateY` + `opacity` transition, each delayed by 0.15s using a CSS custom property `--d` set inline.

**Typing code window**

A fake terminal window displays a Python automation script that types itself out character by character using a recursive `setTimeout` chain. The syntax highlighting (keywords, function names, strings, comments, numbers) uses `<span>` tags with colour classes injected as HTML. The blinking cursor is a `▌` character inside a `.cm` (comment-coloured) span.

**Animated stat counters**

Three numbers (projects, hours saved, satisfaction %) count up from zero using a cubic ease-out curve when they first enter the viewport, detected by `IntersectionObserver`.

**Floating chips**

Four label chips float around the code window using staggered CSS `@keyframes chipFloat` animations with different durations and delays.

---

### Services Section

Seven service cards rendered from the `SERVICES` array in `script.js`. The track is a horizontally scrolling flex container with `scrollbar-width: none` to hide the scrollbar.

Cards can be navigated by:
- Clicking the left/right arrow buttons
- Clicking the dot indicators
- Click-dragging with the mouse (drag-to-scroll implemented with `mousedown`/`mousemove` events)

Each card has a gradient line that slides in from left on hover using a CSS `::before` pseudo-element with `transform: scaleX(0)` → `scaleX(1)`.

**To add or remove services**, edit the `SERVICES` array at the top of `script.js`. Each entry needs `icon` (emoji), `title`, `desc`, and `tag` (used for keyword matching from the welcome modal).

---

### Portfolio / Dashboard Section

**KPI board with sparklines**

Three KPI cards show Hours Saved, Error Reduction, and Decision Speed. Each updates when the Automation Level range slider moves. The numbers animate using a lerp-based counter. Each card has a mini sparkline chart drawn with an inline SVG polyline — the data is randomly generated around the current ratio so it looks plausible without needing real data.

**Bar chart**

A fourth KPI card contains an HTML5 `<canvas>` element. The bar chart is drawn directly using the Canvas 2D API with `ctx.roundRect` for rounded bars and `createLinearGradient` for the fills. The active bar (matching the current automation level) is highlighted in the accent colour. The chart redraws on slider input and on window resize.

**Industry selector**

Three segmented buttons (Retail / Logistics / Finance) apply multipliers to the KPI calculations, stored in the `INDUSTRY_MULTIPLIERS` object in `script.js`. Switching industry changes the numbers immediately.

**Scrolling testimonial strip**

Three testimonial cards duplicate themselves in JavaScript and scroll continuously using CSS `animation: testimonialScroll`. Hovering pauses the animation.

**To add testimonials**, edit the `.testimonial-card` HTML blocks in `index.html` — they are cloned automatically.

---

### Tools Section

Three interactive tools sit side by side (stacking on mobile).

**Currency Converter**

Converts between USD, EUR, GBP, and ZAR. Rates come from the same `state.fxRates` object used by the ticker, so they update every 5 seconds with the same simulated jitter. The swap button rotates 180° on hover and swaps the from/to selectors. A rate line shows the exact conversion factor.

**Automation ROI Calculator**

Three range sliders: hours wasted per week, team size, and average hourly rate in ZAR. The formula is `hours × team × rate × 4.33` (4.33 = average weeks per month). The result updates live and displays in the large gold `Bebas Neue` typeface. This is intentionally confrontational — it shows the visitor the monthly financial cost of *not* automating.

**World Clock**

Six cities render with live times updated every second via `setInterval`. Times use `toLocaleTimeString` with the `timeZone` option.

**To change cities**, edit the `WORLD_CLOCKS` array in `script.js`. Each entry needs a `city` display name and a valid IANA timezone string (e.g. `"America/Chicago"`).

---

### News Section

Fetches the Hacker News front page via the free `hnrss.org` JSON Feed API. No API key required. Displays up to 9 stories in a responsive masonry-style grid.

Geolocation is requested to personalise the section heading and the sub-copy on each card. If permission is denied or geolocation is unavailable, it falls back silently to a global feed message.

**To switch to a different news source**, replace the fetch inside `fetchNews()` in `script.js`:

```js
// NewsAPI example (requires free key from newsapi.org)
const res = await fetch(
  `https://newsapi.org/v2/top-headlines?category=technology&apiKey=YOUR_KEY`
);
const data = await res.json();
const items = data.articles.slice(0, 9);
// Then map item.title, item.description, item.url
```

---

### Contact Section

The contact section itself is a visual teaser — three pulsing concentric rings around a glowing envelope icon — designed to draw the eye and prompt the user to open the modal.

The actual form lives inside a modal overlay to keep the section uncluttered.

---

### Modals

Two modals:

**Welcome modal** — opens automatically 1.2 seconds after page load. The user types a keyword or their name. On submit, `personalize()` runs: it matches the keyword against service tags and scrolls the services carousel to the best match. It also pre-fills the contact form message field.

**Contact modal** — opens from any "Start Project" / "Get a Proposal" button. Contains name, email, service selector, and project brief fields. On submit it shows a confirmation message, resets the form, and closes the modal after 2.5 seconds.

Both modals close on backdrop click and on `Escape` key.

**To connect the contact form to a real backend**, replace the submit handler in `initForms()` in `script.js`:

```js
// Using Formspree (free tier — formspree.io)
const form = document.getElementById('contactForm');
form.setAttribute('action', 'https://formspree.io/f/YOUR_FORM_ID');
form.setAttribute('method', 'POST');
// Then remove the e.preventDefault() call, or use their AJAX approach
```

```js
// Using Netlify Forms — just add these attributes to the <form> in index.html:
// data-netlify="true" name="contact"
// Netlify detects this at deploy time automatically
```

---

## File Structure

```
/
├── index.html      — All markup, section structure, modal HTML
├── style.css       — All styling: themes, layout, animations, components
├── script.js       — All logic: rendering, interactivity, APIs, state
└── README.md       — This file
```

No build step. No `package.json`. No `node_modules`. Drop the three files anywhere and it works.

---

## Running Locally

Opening `index.html` directly in a browser will work for most features, but geolocation and the Hacker News fetch require a server context (browsers block some APIs on `file://` origins).

```bash
# Python (built in — no install needed)
python3 -m http.server 8000
# Then open: http://localhost:8000

# Node (if installed)
npx serve .
```

---

## Deploying

**GitHub Pages**

1. Push all three files to the root of a GitHub repository.
2. Go to **Settings → Pages**.
3. Set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save. GitHub builds and publishes in under a minute.
5. Your site URL will be `https://yourusername.github.io/your-repo-name/`.

**Netlify (recommended — supports form handling natively)**

1. Drag the project folder onto [app.netlify.com](https://app.netlify.com/drop).
2. Done. Netlify gives you HTTPS and a live URL immediately.
3. For form handling, add `data-netlify="true"` to the `<form>` tag and Netlify will capture submissions without any backend code.

**Vercel**

```bash
npx vercel
# Follow the prompts — deploys in seconds
```

---

## Customisation Reference

| What to change | Where |
|---|---|
| Brand name | `index.html` — `.brand` elements; update `DevCraft` / `CRAFT` text |
| Accent colour (neon cyan) | `style.css` — `--accent` in `:root` and `[data-theme="light"]` |
| Services list | `script.js` — `SERVICES` array at the top |
| Ticker stats (static numbers) | `index.html` — `.tick-item` spans; `script.js` — `FX_BASE` object |
| World clock cities | `script.js` — `WORLD_CLOCKS` array |
| Testimonials | `index.html` — `.testimonial-card` article blocks |
| Hero headline | `index.html` — `.hero-headline` span elements |
| Hero sub-copy | `index.html` — `.hero-sub` paragraph |
| Contact perks | `index.html` — `.perk` div elements |
| ROI calculator currency | `script.js` — `updateROI()` function; change `R` prefix and adjust formula |
| FX rates (live) | `script.js` — `updateTicker()` function; replace jitter with real API call |
| News source | `script.js` — `fetchNews()` function; replace the HN fetch |
| Contact form backend | `script.js` — `initForms()` submit handler |
| Font choices | `index.html` — Google Fonts `<link>` tag; `style.css` — `--font-display`, `--font-mono`, `--font-body` |
| SEO metadata | `index.html` — `<meta>` tags in `<head>` |

---

## Third-Party Services Used

| Service | Purpose | Cost | API Key Required |
|---|---|---|---|
| Google Fonts | Bebas Neue, Space Mono, DM Sans | Free | No |
| hnrss.org | Hacker News JSON Feed | Free | No |
| Nominatim (OpenStreetMap) | Reverse geocoding for news localisation | Free | No |
| Browser Geolocation API | User location (with permission) | Free | No |

Everything runs with zero paid services and zero API keys out of the box.

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). The following features degrade gracefully in older environments:

- `backdrop-filter` blur on the navbar — falls back to a solid background
- `color-mix()` — not used in this version
- `roundRect` on Canvas — polyfilled by the browser on Safari 15.4+; on older Safari the bar corners will be square
- CSS `@property` — not used
- Custom cursor — hidden on touch devices automatically

Minimum recommended: Chrome 90+, Firefox 88+, Safari 15+.

---

## Performance Notes

- No JavaScript framework, no bundler, no tree-shaking needed — the JS file is under 10 KB
- Google Fonts loads two display weights only; `font-display: swap` is handled by Google's default
- The canvas bar chart redraws on resize but is debounce-free — add a debounce if you add heavy resize logic
- The `IntersectionObserver` is used instead of scroll event listeners everywhere, which keeps the main thread free
- For production, minify `style.css` and `script.js` — this will cut load time noticeably on slow connections

---

## License

MIT License

Copyright (c) 2026 DevCraft Studio

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

*Built with intention. No bloat. Just craft.*