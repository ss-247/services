/* ═══════════════════════════════════════════════════════════════
   DEVCRAFT STUDIO — MASTER SCRIPT
   Cursor · Ticker · Counters · Typing · Services · KPIs
   Currency · ROI · Clock · News · Modals · Theme
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── DATA ────────────────────────────────────────────────────── */
const SERVICES = [
  { icon: '🐍', title: 'Python Automation', desc: 'Eliminate repetitive tasks. Scripts that run while you sleep — scraping, reporting, file processing.', tag: 'automation' },
  { icon: '🌐', title: 'WordPress Sites', desc: 'Performance-tuned WordPress with custom themes, plugins, and SEO built in from day one.', tag: 'cms' },
  { icon: '⚡', title: 'Dynamic Web Apps', desc: 'Feature-rich apps with custom APIs, real-time data, and interfaces your users will love.', tag: 'fullstack' },
  { icon: '🚀', title: 'Static Websites', desc: 'Blazing-fast, secure, SEO-ready static sites. No bloat, no CMS, just pure performance.', tag: 'frontend' },
  { icon: '📊', title: 'Excel Automation', desc: 'Transform spreadsheet chaos into clean, automated workflows with VBA macros and Python.', tag: 'excel' },
  { icon: '📈', title: 'Dashboard Digitization', desc: 'Convert static reports into live, interactive dashboards your team will actually use.', tag: 'analytics' },
  { icon: '📦', title: 'Inventory Systems', desc: 'Real-time stock tracking, demand forecasting, and loss prevention built for your scale.', tag: 'inventory' }
];

const WORLD_CLOCKS = [
  { city: 'Johannesburg', tz: 'Africa/Johannesburg' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'New York', tz: 'America/New_York' },
  { city: 'Dubai', tz: 'Asia/Dubai' },
  { city: 'Singapore', tz: 'Asia/Singapore' },
  { city: 'Sydney', tz: 'Australia/Sydney' }
];

// Simulated FX rates (ZAR base — production would use an API)
const FX_BASE = { USD: 18.64, EUR: 20.11, GBP: 23.82, ZAR: 1 };

/* ── STATE ───────────────────────────────────────────────────── */
const state = {
  theme: localStorage.getItem('theme') || 'dark',
  serviceIndex: 0,
  rangeVal: 45,
  industry: 'retail',
  fxRates: { ...FX_BASE }
};

/* ── HELPERS ─────────────────────────────────────────────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

function formatNum(n, prefix = '', suffix = '') {
  return prefix + Math.round(n).toLocaleString('en-ZA') + suffix;
}

/* ── THEME ───────────────────────────────────────────────────── */
function setTheme(t) {
  state.theme = t;
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  // update orb opacity on light mode
  $$('.orb').forEach(o => (o.style.opacity = t === 'light' ? '0.25' : '0.5'));
}

function toggleTheme() {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
}

/* ── CURSOR ──────────────────────────────────────────────────── */
function initCursor() {
  const cursor = $('#cursor');
  const trail = $('#cursorTrail');
  if (!cursor || window.matchMedia('(max-width:768px)').matches) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animTrail() {
    tx = lerp(tx, mx, 0.12);
    ty = lerp(ty, my, 0.12);
    trail.style.left = tx + 'px';
    trail.style.top = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  document.addEventListener('mouseover', e => {
    const hov = e.target.closest('a,button,.service-card,.kpi-card,.tool-card,.news-item,.seg,.s-arrow');
    cursor.classList.toggle('hovering', !!hov);
  });
}

/* ── LIVE TICKER ─────────────────────────────────────────────── */
function updateTicker() {
  const now = new Date();
  const jhb = now.toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const t1 = $('#t-time'); if (t1) t1.textContent = jhb;

  // Jitter FX rates slightly for "live" feel
  ['USD', 'EUR'].forEach(cur => {
    state.fxRates[cur] = FX_BASE[cur] + (Math.random() - 0.5) * 0.12;
  });
  const usdEl = $('#t-usd');  if (usdEl) usdEl.textContent = state.fxRates.USD.toFixed(2);
  const eurEl = $('#t-eur');  if (eurEl) eurEl.textContent = state.fxRates.EUR.toFixed(2);
  const usd2 = $('#t-usd2'); if (usd2) usd2.textContent = state.fxRates.USD.toFixed(2);
  const eur2 = $('#t-eur2'); if (eur2) eur2.textContent = state.fxRates.EUR.toFixed(2);

  // Re-run currency converter with updated rates
  runConverter();
}

/* ── ANIMATED COUNTERS ───────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  const suffix = el.nextElementSibling?.classList.contains('stat-suf') ? '' : '';
  const start = performance.now();
  const startVal = 0;

  function tick(now) {
    const elapsed = now - start;
    const progress = clamp(elapsed / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(lerp(startVal, target, eased));
    el.textContent = current.toLocaleString('en-ZA');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  $$('.stat-num').forEach(el => observer.observe(el));
}

/* ── TYPING CODE ANIMATION ───────────────────────────────────── */
const CODE_LINES = [
  '<span class="cm"># DevCraft automation engine</span>',
  '<span class="kw">import</span> pandas <span class="kw">as</span> pd',
  '<span class="kw">import</span> schedule, requests',
  '',
  '<span class="kw">def</span> <span class="fn">sync_inventory</span>():',
  '    df = pd.read_excel(<span class="str">"stock.xlsx"</span>)',
  '    low = df[df[<span class="str">"qty"</span>] < <span class="num">10</span>]',
  '    <span class="fn">send_alert</span>(low.to_dict())',
  '    <span class="fn">update_dashboard</span>(df)',
  '',
  '<span class="cm"># Run every morning at 08:00</span>',
  'schedule.every().day.at(<span class="str">"08:00"</span>)',
  '        .do(<span class="fn">sync_inventory</span>)',
  '',
  '<span class="kw">while</span> <span class="num">True</span>:',
  '    schedule.run_pending() <span class="cm">▌</span>',
];

function initTyping() {
  const el = $('#typingCode');
  if (!el) return;

  let lineIdx = 0, charIdx = 0;
  let html = '';

  function typeNext() {
    if (lineIdx >= CODE_LINES.length) return;

    const line = CODE_LINES[lineIdx];

    // Strip tags for typing — we'll inject the full tagged line at once
    if (charIdx === 0 && line === '') {
      html += '\n';
      el.innerHTML = html + '<span class="cm">▌</span>';
      lineIdx++;
      setTimeout(typeNext, 120);
      return;
    }

    // Type the full HTML line character by character using text length
    const stripped = line.replace(/<[^>]+>/g, '');
    charIdx++;
    if (charIdx >= stripped.length + 1) {
      html += line + '\n';
      el.innerHTML = html + '<span class="cm">▌</span>';
      lineIdx++;
      charIdx = 0;
      setTimeout(typeNext, 150);
    } else {
      // partial approach: type the whole line at once for simplicity (HTML tags complicate partial typing)
      const partial = stripped.slice(0, charIdx);
      el.innerHTML = html + partial + '<span class="cm">▌</span>';
      setTimeout(typeNext, 30);
    }
  }

  setTimeout(typeNext, 800);
}

/* ── SERVICES CAROUSEL ───────────────────────────────────────── */
function renderServices() {
  const track = $('#servicesTrack');
  const dotsEl = $('#srvDots');
  if (!track) return;

  track.innerHTML = SERVICES.map((s, i) => `
    <article class="service-card fade-up" style="transition-delay:${i * 0.07}s">
      <div class="sc-num">0${i + 1}</div>
      <span class="sc-icon">${s.icon}</span>
      <h3 class="sc-title">${s.title}</h3>
      <p class="sc-desc">${s.desc}</p>
      <span class="sc-tag">${s.tag}</span>
    </article>
  `).join('');

  // Dots
  if (dotsEl) {
    dotsEl.innerHTML = SERVICES.map((_, i) => `<button class="s-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('');
    dotsEl.addEventListener('click', e => {
      const btn = e.target.closest('.s-dot');
      if (btn) scrollToService(parseInt(btn.dataset.i));
    });
  }

  // Drag scroll
  let isDown = false, startX, scrollL;
  track.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - track.offsetLeft; scrollL = track.scrollLeft; track.style.cursor = 'grabbing'; });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollL - (x - startX) * 1.5;
  });

  // Arrow buttons
  $('#srvPrev')?.addEventListener('click', () => scrollToService(state.serviceIndex - 1));
  $('#srvNext')?.addEventListener('click', () => scrollToService(state.serviceIndex + 1));

  track.addEventListener('scroll', () => {
    const cardWidth = track.querySelector('.service-card')?.offsetWidth + 19 || 300;
    state.serviceIndex = Math.round(track.scrollLeft / cardWidth);
    $$('.s-dot').forEach((d, i) => d.classList.toggle('active', i === state.serviceIndex));
  });
}

function scrollToService(idx) {
  const track = $('#servicesTrack');
  if (!track) return;
  const cards = $$('.service-card', track);
  state.serviceIndex = clamp(idx, 0, cards.length - 1);
  cards[state.serviceIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  $$('.s-dot').forEach((d, i) => d.classList.toggle('active', i === state.serviceIndex));
}

/* ── KPI DASHBOARD ───────────────────────────────────────────── */
const INDUSTRY_MULTIPLIERS = {
  retail:    { hours: 1.0, errors: 1.0, speed: 1.0 },
  logistics: { hours: 1.4, errors: 0.85, speed: 1.2 },
  finance:   { hours: 0.75, errors: 1.35, speed: 0.9 }
};

function updateKpis(value) {
  const level = Number(value);
  const m = INDUSTRY_MULTIPLIERS[state.industry];
  const hours = Math.round((level / 100) * 40 * m.hours);
  const errors = Math.round((level / 100) * 70 * m.errors);
  const speed = (1 + (level / 100) * m.speed).toFixed(1);

  animKpi('kpiHours', hours);
  animKpi('kpiErrors', errors);
  $('#kpiSpeed').textContent = speed;
  $('#rangeVal').textContent = level + '%';

  drawSparkline('spark1', hours, 40, '#00ffe0');
  drawSparkline('spark2', errors, 70, '#ff3cac');
  drawSparkline('spark3', parseFloat(speed), 2, '#f5c518');
  drawBarChart(level);
}

function animKpi(id, target) {
  const el = $('#' + id);
  if (!el) return;
  const start = parseFloat(el.textContent) || 0;
  const dur = 400;
  const t0 = performance.now();
  function tick(now) {
    const p = clamp((now - t0) / dur, 0, 1);
    el.textContent = Math.round(lerp(start, target, p));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function drawSparkline(id, val, max, color) {
  const el = $('#' + id);
  if (!el) return;
  const pts = 12;
  const ratio = val / max;
  const data = Array.from({ length: pts }, (_, i) => {
    const noise = (Math.random() - 0.5) * 0.3;
    return clamp((i / pts) * ratio + noise, 0, 1);
  });
  data[pts - 1] = ratio;

  const w = el.offsetWidth || 200;
  const h = 40;
  const step = w / (pts - 1);
  const points = data.map((v, i) => `${i * step},${h - v * h}`).join(' ');

  el.innerHTML = `<svg width="100%" height="${h}" preserveAspectRatio="none" viewBox="0 0 ${w} ${h}">
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <polyline points="0,${h} ${points} ${w},${h}" fill="${color}" fill-opacity="0.12" stroke="none"/>
  </svg>`;
}

function drawBarChart(level) {
  const canvas = $('#barChart');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.offsetWidth;
  canvas.width = w;
  canvas.height = 100;

  const isDark = state.theme === 'dark';
  const categories = ['Manual', 'Scripted', 'Semi-Auto', 'Fully Auto'];
  const values = [100, Math.round(100 - level * 0.3), Math.round(100 - level * 0.6), Math.round(100 - level * 0.9)];
  const barW = (w / categories.length) * 0.55;
  const gap = (w / categories.length);

  ctx.clearRect(0, 0, w, 100);

  categories.forEach((cat, i) => {
    const x = i * gap + gap * 0.225;
    const barH = (values[i] / 100) * 70;
    const y = 70 - barH;
    const active = i === Math.min(3, Math.floor(level / 33));

    // Bar
    const grad = ctx.createLinearGradient(0, y, 0, 70);
    if (active) {
      grad.addColorStop(0, isDark ? '#00ffe0' : '#0066ff');
      grad.addColorStop(1, isDark ? 'rgba(0,255,224,0.3)' : 'rgba(0,102,255,0.3)');
    } else {
      grad.addColorStop(0, isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)');
      grad.addColorStop(1, isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 3);
    ctx.fill();

    // Label
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)';
    ctx.font = '9px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(cat, x + barW / 2, 90);
    ctx.fillText(values[i] + '%', x + barW / 2, y - 4);
  });
}

/* ── CURRENCY CONVERTER ──────────────────────────────────────── */
function runConverter() {
  const amount = parseFloat($('#convAmount')?.value) || 0;
  const from = $('#convFrom')?.value;
  const to = $('#convTo')?.value;
  if (!from || !to) return;

  const zarAmount = from === 'ZAR' ? amount : amount * state.fxRates[from];
  const result = to === 'ZAR' ? zarAmount : zarAmount / state.fxRates[to];

  const resultEl = $('#convResult');
  if (resultEl) resultEl.value = result.toFixed(2);

  const rateEl = $('#convRateText');
  const rate = from === to ? 1 : (zarAmount / amount) / (to === 'ZAR' ? 1 : state.fxRates[to]);
  if (rateEl) rateEl.textContent = `1 ${from} = ${(from === to ? 1 : result / amount).toFixed(4)} ${to} · Updated live`;
}

function initConverter() {
  ['convAmount', 'convFrom', 'convTo'].forEach(id => {
    $('#' + id)?.addEventListener('input', runConverter);
  });

  $('#swapBtn')?.addEventListener('click', () => {
    const fromEl = $('#convFrom');
    const toEl = $('#convTo');
    const tmp = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = tmp;
    runConverter();
  });

  runConverter();
}

/* ── ROI CALCULATOR ──────────────────────────────────────────── */
function updateROI() {
  const hours = parseInt($('#roiHours')?.value) || 0;
  const team = parseInt($('#roiTeam')?.value) || 0;
  const rate = parseInt($('#roiRate')?.value) || 0;
  const monthly = hours * team * rate * 4.33;

  $('#roiHoursVal').textContent = hours + 'h';
  $('#roiTeamVal').textContent = team;
  $('#roiRateVal').textContent = 'R' + rate;
  $('#roiResult').textContent = 'R' + Math.round(monthly).toLocaleString('en-ZA');
}

function initROI() {
  ['roiHours', 'roiTeam', 'roiRate'].forEach(id => {
    $('#' + id)?.addEventListener('input', updateROI);
  });
  updateROI();
}

/* ── WORLD CLOCK ─────────────────────────────────────────────── */
function renderClocks() {
  const grid = $('#clockGrid');
  if (!grid) return;
  grid.innerHTML = WORLD_CLOCKS.map(c => `
    <div class="clock-city">
      <div class="clock-name">${c.city}</div>
      <div class="clock-time" data-tz="${c.tz}">--:--</div>
      <div class="clock-tz">${c.tz.split('/')[1] || c.tz}</div>
    </div>
  `).join('');
}

function tickClocks() {
  const now = new Date();
  $$('.clock-time').forEach(el => {
    const tz = el.dataset.tz;
    try {
      el.textContent = now.toLocaleTimeString('en-ZA', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch { el.textContent = '--:--'; }
  });
}

/* ── NEWS FEED ───────────────────────────────────────────────── */
async function fetchNews(country = '') {
  const list = $('#newsList');
  if (!list) return;
  list.innerHTML = '<p style="color:var(--muted);padding:1rem;grid-column:1/-1;font-family:var(--font-mono);font-size:0.8rem;">Fetching latest stories...</p>';

  try {
    const res = await fetch('https://hnrss.org/frontpage.jsonfeed');
    const feed = await res.json();
    const items = (feed.items || []).slice(0, 9);

    list.innerHTML = items.map((item, i) => `
      <article class="news-item fade-up" style="transition-delay:${i * 0.06}s">
        <span class="news-meta">HN · ${new Date(item.date_published || Date.now()).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}</span>
        <h3>${item.title || 'Untitled'}</h3>
        <p>${country ? `Trending with developers in ${country}.` : 'Global developer headline.'}</p>
        <a class="news-link" href="${item.url || item.external_url || '#'}" target="_blank" rel="noopener noreferrer">
          Read Story <span>→</span>
        </a>
      </article>
    `).join('');

    // Trigger fade-up for new items
    requestAnimationFrame(() => $$('.news-item').forEach(el => el.classList.add('visible')));

  } catch {
    list.innerHTML = '<p style="color:var(--muted);padding:1rem;grid-column:1/-1;font-family:var(--font-mono);">Could not load live news. Check your connection.</p>';
  }
}

async function geoNews() {
  const locEl = $('#locationInfo');
  if (!locEl) return;

  if (!('geolocation' in navigator)) {
    locEl.textContent = 'Showing global tech feed.';
    fetchNews();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async pos => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        const data = await res.json();
        const country = data.address?.country || 'your region';
        locEl.textContent = `Showing stories popular with developers in ${country}.`;
        $('#newsEyebrow').textContent = `HN Feed · ${country}`;
        fetchNews(country);
      } catch {
        locEl.textContent = 'Showing global feed.';
        fetchNews();
      }
    },
    () => { locEl.textContent = 'Location denied · Global feed.'; fetchNews(); },
    { timeout: 6000 }
  );
}

/* ── MODALS ──────────────────────────────────────────────────── */
window.openModal = function (id) {
  const m = $('#' + id);
  if (!m) return;
  m.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function (id) {
  const m = $('#' + id);
  if (!m) return;
  m.classList.remove('active');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $$('.modal.active').forEach(m => {
      m.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

/* ── CONTACT FORM ────────────────────────────────────────────── */
function initForms() {
  // Welcome modal personalization
  $('#userInputForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const val = $('#userInput')?.value?.trim();
    if (val) personalize(val);
    closeModal('welcomeModal');
  });

  // Contact form
  $('#contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const statusEl = $('#formStatus');
    if (statusEl) {
      statusEl.textContent = '✓ Proposal request sent! I'll reply within 24 hours.';
      statusEl.style.color = 'var(--green)';
    }
    setTimeout(() => {
      $('#contactForm').reset();
      if (statusEl) statusEl.textContent = '';
      closeModal('contactModal');
    }, 2500);
  });
}

function personalize(input) {
  const kw = input.toLowerCase();
  const matching = SERVICES.filter(s => s.tag.includes(kw) || s.title.toLowerCase().includes(kw));
  if (matching.length > 0) {
    const idx = SERVICES.findIndex(s => s === matching[0]);
    if (idx >= 0) setTimeout(() => scrollToService(idx), 500);
  }

  const msg = $('#message');
  if (msg) msg.value = `Hi, I'm interested in solutions related to "${input}". Please share next steps.`;
}

/* ── NAVBAR SCROLL ───────────────────────────────────────────── */
function initNavbar() {
  const nav = $('#navbar');
  const fCta = $('#floatingCta');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    fCta.classList.toggle('visible', y > 400);
    lastY = y;
  });

  // Hamburger
  $('#menuToggle')?.addEventListener('click', () => {
    const nl = $('#navLinks');
    nl.classList.toggle('open');
  });

  // Active nav links on scroll
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
}

/* ── SCROLL FADE ─────────────────────────────────────────────── */
function initScrollFade() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.fade-up').forEach(el => io.observe(el));
}

/* ── SECTION REACTIVE BG ─────────────────────────────────────── */
function initSectionReactivity() {
  const orb1 = $('.orb-1');
  const orb2 = $('.orb-2');
  if (!orb1 || !orb2) return;

  const colorMap = {
    home:      ['rgba(0,255,224,0.18)', 'rgba(255,60,172,0.15)'],
    services:  ['rgba(245,197,24,0.18)', 'rgba(0,255,136,0.12)'],
    portfolio: ['rgba(255,60,172,0.2)',  'rgba(0,255,224,0.1)'],
    converter: ['rgba(0,102,255,0.18)',  'rgba(245,197,24,0.15)'],
    news:      ['rgba(0,255,136,0.18)',  'rgba(0,255,224,0.1)'],
    contact:   ['rgba(245,197,24,0.2)',  'rgba(255,60,172,0.12)'],
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        const colors = colorMap[id];
        if (colors) {
          orb1.style.background = `radial-gradient(circle, ${colors[0]}, transparent 70%)`;
          orb2.style.background = `radial-gradient(circle, ${colors[1]}, transparent 70%)`;
        }
      }
    });
  }, { threshold: 0.3 });

  $$('section[id]').forEach(s => io.observe(s));
}

/* ── INDUSTRY SEGMENTS ───────────────────────────────────────── */
function initSegments() {
  $$('.seg').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.seg').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.industry = btn.dataset.industry;
      updateKpis($('#rangeInput')?.value || 45);
    });
  });
}

/* ── TESTIMONIAL DUPLICATE FOR SEAMLESS LOOP ─────────────────── */
function initTestimonials() {
  const track = $('#testimonialTrack');
  if (!track) return;
  track.innerHTML += track.innerHTML; // duplicate for seamless scroll
}

/* ── MAIN INIT ───────────────────────────────────────────────── */
function init() {
  // Theme
  setTheme(state.theme);
  $('#themeToggle')?.addEventListener('click', () => {
    toggleTheme();
    drawBarChart($('#rangeInput')?.value || 45);
  });

  // Render
  renderServices();
  initTyping();
  initCounters();
  initForms();
  initNavbar();
  initCursor();
  initScrollFade();
  initSectionReactivity();
  initSegments();
  initTestimonials();
  renderClocks();
  initConverter();
  initROI();
  geoNews();

  // KPI range
  $('#rangeInput')?.addEventListener('input', e => updateKpis(e.target.value));
  updateKpis(45);

  // Footer year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Ticker & clock intervals
  updateTicker();
  setInterval(updateTicker, 5000);
  setInterval(tickClocks, 1000);
  tickClocks();

  // Show welcome modal after slight delay
  setTimeout(() => openModal('welcomeModal'), 1200);

  // Re-observe fade-up after service render
  setTimeout(initScrollFade, 300);

  // Redraw chart on resize
  window.addEventListener('resize', () => drawBarChart($('#rangeInput')?.value || 45));
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}