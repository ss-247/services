'use strict';
/* ═══════════════════════════════════════════════════════════
   DEVCRAFT STUDIO — script.js v3
   No localStorage. No welcome modal. GitHub Pages safe.
═══════════════════════════════════════════════════════════ */

/* ── DATA ────────────────────────────────────────────────── */
const SERVICES = [
  { emoji:'🐍', title:'Python Automation',        desc:'Eliminate repetitive tasks forever. Scripts that scrape, report, file-process, and alert — while you sleep.', tag:'automation' },
  { emoji:'🌐', title:'WordPress Sites',           desc:'Performance-tuned WordPress with custom themes, plugins, and SEO baked in from day one.', tag:'cms' },
  { emoji:'⚡', title:'Dynamic Web Apps',          desc:'Full-stack feature-rich applications with custom APIs, real-time data feeds, and UI people actually enjoy.', tag:'fullstack' },
  { emoji:'🚀', title:'Static Websites',           desc:'Blazing-fast, secure, SEO-optimised static sites. Zero bloat. Pure performance.', tag:'frontend' },
  { emoji:'📊', title:'Excel Automation',          desc:'Turn spreadsheet chaos into clean, automated workflows with VBA macros and Python integrations.', tag:'excel' },
  { emoji:'📈', title:'Dashboard Digitization',    desc:'Convert static monthly reports into live, interactive dashboards your team will actually open.', tag:'analytics' },
  { emoji:'📦', title:'Inventory & Stock Systems', desc:'Real-time stock tracking, low-stock alerts, demand forecasting, and loss prevention — built to scale.', tag:'inventory' },
];

const TESTIMONIALS = [
  { text: '"Manual reporting became a live dashboard in two weeks. I didn\'t believe it until I saw it."', who: '— Kagiso M., Operations Lead · JHB' },
  { text: '"Inventory errors dropped from 12% to under 1% after the automation system went live."', who: '— Priya N., Retail Manager · Sandton' },
  { text: '"The Python bot saves my team 40 hours every month. Absolutely game-changing."', who: '— André V., Data Analyst · Cape Town' },
];

const CLOCKS = [
  { city:'Johannesburg', tz:'Africa/Johannesburg' },
  { city:'London',       tz:'Europe/London' },
  { city:'New York',     tz:'America/New_York' },
  { city:'Dubai',        tz:'Asia/Dubai' },
  { city:'Singapore',    tz:'Asia/Singapore' },
  { city:'Sydney',       tz:'Australia/Sydney' },
];

const FX = { USD: 18.64, EUR: 20.11, GBP: 23.82, ZAR: 1 };
const IND_MUL = {
  retail:    { h:1.0,  e:1.0,  s:1.0 },
  logistics: { h:1.4,  e:0.85, s:1.2 },
  finance:   { h:0.75, e:1.35, s:0.9 },
};

const HEADER_FONTS = {
  space: "'Space Grotesk', system-ui, sans-serif",
  exo: "'Exo 2', system-ui, sans-serif",
  rajdhani: "'Rajdhani', system-ui, sans-serif",
  syne: "'Syne', system-ui, sans-serif",
};

const ACCENT_THEMES = {
  lime:   { dark:'#c8ff00', light:'#85b800' },
  cyan:   { dark:'#3ad8ff', light:'#0092cc' },
  violet: { dark:'#8b7bff', light:'#5540f6' },
  coral:  { dark:'#ff6b8f', light:'#cf2b58' },
};


/* ── STATE ───────────────────────────────────────────────── */
const S = {
  theme: 'dark',   // default — no localStorage
  industry: 'retail',
  quoteIdx: 0,
  font: 'space',
  accent: 'cyan',
  fx: { ...FX },
};

/* ── HELPERS ─────────────────────────────────────────────── */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const lerp  = (a,b,t) => a + (b-a)*t;
const clamp = (v,mn,mx) => Math.min(Math.max(v,mn),mx);

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function setHeaderFont(key) {
  const font = HEADER_FONTS[key] || HEADER_FONTS.space;
  S.font = HEADER_FONTS[key] ? key : 'space';
  document.documentElement.style.setProperty('--f-head', font);
}

function setAccent(key) {
  const palette = ACCENT_THEMES[key] || ACCENT_THEMES.cyan;
  S.accent = ACCENT_THEMES[key] ? key : 'cyan';
  const hex = palette[S.theme] || palette.dark;
  document.documentElement.style.setProperty('--acc', hex);
  document.documentElement.style.setProperty('--acc-rgb', hexToRgb(hex));
}


/* ── THEME (in-memory only, no localStorage) ─────────────── */
function setTheme(t) {
  S.theme = t;
  document.documentElement.setAttribute('data-theme', t);
  const icon = $('#themeBtn');
  if (icon) icon.textContent = t === 'dark' ? '◑' : '◐';
  setAccent(S.accent);
  // redraw chart with correct colours
  const rv = $('#autoRange');
  if (rv) drawBar(+rv.value);
}

function toggleTheme() { setTheme(S.theme === 'dark' ? 'light' : 'dark'); }

/* ── PARTICLE CANVAS ─────────────────────────────────────── */
function initCanvas() {
  const canvas = $('#bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, pts;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function mkPt() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + .3,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      a: Math.random(),
    };
  }

  function initPts() { pts = Array.from({length: 70}, mkPt); }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const col = getComputedStyle(document.documentElement).getPropertyValue('--acc-rgb').trim() || '58,216,255';
    
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${col},${p.a * .35})`;
      ctx.fill();
    });

    // draw faint connecting lines
    for (let i=0; i<pts.length; i++) {
      for (let j=i+1; j<pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${col},${(1 - dist/120) * .06})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  initPts();
  draw();
  window.addEventListener('resize', () => { resize(); initPts(); });
}

/* ── CURSOR ──────────────────────────────────────────────── */
function initCursor() {
  const dot  = $('#curDot');
  const ring = $('#curRing');
  if (!dot || window.matchMedia('(max-width:768px)').matches) return;

  let mx=0, my=0, rx=0, ry=0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px';
    dot.style.top  = my+'px';
  });

  (function moveRing() {
    rx = lerp(rx, mx, .11);
    ry = lerp(ry, my, .11);
    ring.style.left = rx+'px';
    ring.style.top  = ry+'px';
    requestAnimationFrame(moveRing);
  })();

  document.addEventListener('mouseover', e => {
    const h = e.target.closest('a,button,.srv-card,.kpi-card,.tool-card,.news-card,.seg,.swap-btn');
    dot.classList.toggle('big', !!h);
  });
}

/* ── TICKER ──────────────────────────────────────────────── */
function tickerTick() {
  // jitter FX
  ['USD','EUR','GBP'].forEach(c => {
    S.fx[c] = FX[c] + (Math.random()-.5)*.14;
  });
  ['t-usd','t-usd2'].forEach(id => { const el=$(id); if(el) el.textContent = S.fx.USD.toFixed(2); });
  ['t-eur','t-eur2'].forEach(id => { const el=$(id); if(el) el.textContent = S.fx.EUR.toFixed(2); });

  // JHB time
  const jhb = new Date().toLocaleTimeString('en-ZA', {timeZone:'Africa/Johannesburg', hour:'2-digit', minute:'2-digit', second:'2-digit'});
  ['t-time','t-time2'].forEach(id => { const el=$(id); if(el) el.textContent = jhb; });

  // update converter quietly
  runConverter();
}

/* ── COUNTERS ────────────────────────────────────────────── */
function countUp(el, target, dur=1800) {
  const t0 = performance.now();
  (function tick(now) {
    const p = clamp((now-t0)/dur, 0, 1);
    const e = 1 - Math.pow(1-p, 3);
    el.textContent = Math.round(lerp(0, target, e)).toLocaleString('en-ZA');
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const el = en.target;
        countUp(el, +el.dataset.count);
        io.unobserve(el);
      }
    });
  }, { threshold:.5 });
  $$('[data-count]').forEach(el => io.observe(el));
}

/* ── TYPING ANIMATION ────────────────────────────────────── */
const CODE = [
  ['cm','# DevCraft Studio — automation engine '],
  ['',''],
  ['kw','import'], ['',' pandas '], ['kw','as'], ['',' pd'],
  ['',''],
  ['kw','import'], ['',' schedule, smtplib'],
  ['',''],
  ['cm','# --- core job ---'],
  ['kw','def'], ['',' '], ['fn','sync_inventory'], ['','():'],
  ['',"    df = pd.read_excel("], ['str','"stock.xlsx"'], ['',')\n'],
  ['','    low = df[df['], ['str','"qty"'], ['',']\n'],
  ['','          < '], ['num','10'], ['',']\n'],
  ['','    '], ['fn','send_alert'], ['','(low)\n'],
  ['','    '], ['fn','push_dashboard'], ['','(df)\n'],
  ['',''],
  ['cm','# run every weekday at 07:30'],
  ['','schedule.every().monday_to_friday'],
  ['','         .at('], ['str','"07:30"'], ['',')'],
  ['','         .do('], ['fn','sync_inventory'], ['',')'],
  ['',''],
  ['kw','while'], ['',' '], ['num','True'], ['',':\n'],
  ['','    schedule.run_pending()'],
];

function initTyping() {
  const pre = $('#termCode');
  if (!pre) return;

  // flatten to a sequence of {cls, chars[]}
  const segments = [];
  for (const [cls, text] of CODE) {
    if (!text) continue;
    segments.push({ cls, text });
  }

  let si = 0, ci = 0;
  let rendered = '';

  function rebuild() {
    // Build current partial display
    let out = rendered;
    if (si < segments.length) {
      const seg = segments[si];
      const partial = seg.text.slice(0, ci);
      if (seg.cls) out += `<span class="tc-${seg.cls}">${esc(partial)}</span>`;
      else         out += esc(partial);
    }
    pre.innerHTML = out + '<span class="tc-cursor">▌</span>';
  }

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function step() {
    if (si >= segments.length) return; // done

    const seg = segments[si];
    ci++;

    if (ci > seg.text.length) {
      // commit this segment
      if (seg.cls) rendered += `<span class="tc-${seg.cls}">${esc(seg.text)}</span>`;
      else         rendered += esc(seg.text);
      si++; ci = 0;
      rebuild();
      setTimeout(step, seg.text.endsWith('\n') ? 120 : 60);
      return;
    }

    rebuild();
    setTimeout(step, seg.cls === 'cm' ? 18 : 28);
  }

  setTimeout(step, 600);
}

/* ── SERVICES ────────────────────────────────────────────── */
function renderServices() {
  const grid = $('#srvGrid');
  if (!grid) return;
  grid.innerHTML = SERVICES.map((s, i) => `
    <article class="srv-card reveal">
      <div class="sc-idx">${String(i+1).padStart(2,'0')} / ${String(SERVICES.length).padStart(2,'0')}</div>
      <span class="sc-emoji">${s.emoji}</span>
      <h3 class="sc-title">${s.title}</h3>
      <p class="sc-desc">${s.desc}</p>
      <span class="sc-tag">${s.tag}</span>
    </article>
  `).join('');
  initReveal();
}

/* ── QUOTES ──────────────────────────────────────────────── */
function renderQuoteDots() {
  const d = $('#qDots');
  if (!d) return;
  d.innerHTML = TESTIMONIALS.map((_,i) =>
    `<span class="q-dot${i===0?' on':''}" data-q="${i}"></span>`
  ).join('');
  d.addEventListener('click', e => {
    const btn = e.target.closest('.q-dot');
    if (btn) showQuote(+btn.dataset.q);
  });
}

function showQuote(idx) {
  S.quoteIdx = idx;
  const qt = $('#qText');
  const qw = $('#qWho');
  if (qt) qt.textContent = TESTIMONIALS[idx].text;
  if (qw) qw.textContent = TESTIMONIALS[idx].who;
  $$('.q-dot').forEach((d,i) => d.classList.toggle('on', i===idx));
}

function initQuotes() {
  renderQuoteDots();
  // auto-rotate
  setInterval(() => showQuote((S.quoteIdx+1) % TESTIMONIALS.length), 5000);
}

/* ── KPI DASHBOARD ───────────────────────────────────────── */
function kpiVal(level) {
  const m = IND_MUL[S.industry];
  return {
    h: Math.round((level/100)*40*m.h),
    e: Math.round((level/100)*70*m.e),
    s: (1+(level/100)*m.s).toFixed(1),
  };
}

function animKpi(id, to) {
  const el = $(id);
  if (!el) return;
  const from = parseFloat(el.textContent)||0;
  const t0 = performance.now();
  (function t(now) {
    const p = clamp((now-t0)/350, 0, 1);
    el.textContent = parseFloat(lerp(from,to,p)).toFixed(to%1?1:0);
    if(p<1) requestAnimationFrame(t);
  })(t0);
}

function sparkline(id, ratio, color) {
  const svg = $(id);
  if (!svg) return;
  const N = 14;
  const pts = Array.from({length:N}, (_,i) => {
    const noise = (Math.random()-.5)*.3;
    return clamp((i/(N-1))*ratio+noise, 0, 1);
  });
  pts[N-1] = ratio;

  const W=120, H=40;
  const coords = pts.map((v,i) => `${(i/(N-1))*W},${H - v*H}`).join(' ');
  svg.innerHTML = `
    <polyline points="${coords}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
    <polyline points="0,${H} ${coords} ${W},${H}" fill="${color}" fill-opacity="0.12" stroke="none"/>
  `;
}

function drawBar(level) {
  const canvas = $('#barChart');
  if (!canvas||!canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400;
  canvas.width  = W * window.devicePixelRatio;
  canvas.height = 110 * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const isDark = S.theme === 'dark';
   const accentCol = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#3ad8ff';
  
  const mutedCol  = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const textCol   = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)';

  const cats = ['Manual','Scripted','Semi-Auto','Full Auto'];
  const vals = [100, Math.round(100-level*.3), Math.round(100-level*.6), Math.round(100-level*.9)];
  const bW = (W/cats.length)*.55;
  const gap = W/cats.length;
  const activeIdx = Math.min(3, Math.floor(level/33));

  ctx.clearRect(0,0,W,110);

  cats.forEach((cat,i) => {
    const x = i*gap + gap*.225;
    const barH = (vals[i]/100)*72;
    const y = 72 - barH;

    const g = ctx.createLinearGradient(0,y,0,72);
    if (i===activeIdx) {
      g.addColorStop(0, accentCol);
      g.addColorStop(1, accentCol+'44');
    } else {
      g.addColorStop(0, mutedCol);
      g.addColorStop(1, mutedCol.replace('.12','.04').replace('.1','.04'));
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, bW, barH, 3);
    else ctx.rect(x, y, bW, barH);
    ctx.fill();

    ctx.fillStyle = textCol;
    ctx.font = `9px JetBrains Mono, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(cat, x+bW/2, 95);
    ctx.fillStyle = i===activeIdx ? accentCol : textCol;
    ctx.fillText(vals[i]+'%', x+bW/2, y-4);
  });
}

function updateKpis(level) {
  const v = kpiVal(level);
  animKpi('#kv0', v.h);
  animKpi('#kv1', v.e);
  animKpi('#kv2', parseFloat(v.s));
  $('#autoVal').textContent = level+'%';
    const accentCol = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#3ad8ff';
  sparkline('#sp0', v.h/40,            accentCol);
  sparkline('#sp1', v.e/70,            S.theme==='dark'?'#ff4060':'#d4001a');
  sparkline('#sp2', parseFloat(v.s)/2, S.theme==='dark'?'#ffcc00':'#b8860b');
  
  drawBar(level);
}

function initDashboard() {
  const slider = $('#autoRange');
  if (!slider) return;
  slider.addEventListener('input', e => updateKpis(+e.target.value));
  updateKpis(45);

  // segments
  $$('.seg').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.seg').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      S.industry = btn.dataset.ind;
      updateKpis(+slider.value);
    });
  });

  window.addEventListener('resize', () => drawBar(+slider.value));
}

/* ── CURRENCY ────────────────────────────────────────────── */
function runConverter() {
  const amt  = parseFloat($('#cAmt')?.value)||0;
  const from = $('#cFrom')?.value;
  const to   = $('#cTo')?.value;
  if (!from||!to) return;

  const zarAmt = from==='ZAR' ? amt : amt*S.fx[from];
  const result = to==='ZAR'   ? zarAmt : zarAmt/S.fx[to];

  const res = $('#cRes');
  if (res) res.value = result.toFixed(2);

  const rt = $('#cRate');
  if (rt) {
    const factor = from===to ? 1 : result/amt;
    rt.textContent = `1 ${from} = ${factor.toFixed(4)} ${to} · refreshes live`;
  }
}

function initConverter() {
  ['cAmt','cFrom','cTo'].forEach(id => {
    $(id)?.addEventListener('input', runConverter);
  });
  $('#swapBtn')?.addEventListener('click', () => {
    const a=$('#cFrom'), b=$('#cTo'), t=a.value;
    a.value=b.value; b.value=t;
    runConverter();
  });
  runConverter();
}

/* ── ROI ─────────────────────────────────────────────────── */

function initROI() {
  const sliders = [
    document.getElementById('rH'),
    document.getElementById('rT'),
    document.getElementById('rR')
  ];

  sliders.forEach(slider => {
    if (slider) {
      slider.addEventListener('input', updateROI);
      slider.addEventListener('change', updateROI);   // fallback for some older browsers/touch
    } else {
      console.warn('ROI slider missing:', slider);
    }
  });

  // Initial calculation
  updateROI();
}

function updateROI() {
  const h = +$('#rH').value;
  const t = +$('#rT').value;
  const r = +$('#rR').value;
  const monthly = h*t*r*4.33;
  $('#rvH').textContent = h+'h';
  $('#rvT').textContent = t;
  $('#rvR').textContent = 'R'+r;
  $('#roiBig').textContent = 'R'+Math.round(monthly).toLocaleString('en-ZA');
}



/* ── CLOCKS ──────────────────────────────────────────────── */
function renderClocks() {
  const g = $('#clocksGrid');
  if (!g) return;
  g.innerHTML = CLOCKS.map(c=>`
    <div class="clock-item">
      <div class="clock-city">${c.city}</div>
      <div class="clock-time" data-tz="${c.tz}">--:--:--</div>
      <div class="clock-tz">${c.tz.split('/')[1]||c.tz}</div>
    </div>
  `).join('');
}

function tickClocks() {
  const now = new Date();
  $$('.clock-time').forEach(el => {
    try {
      el.textContent = now.toLocaleTimeString('en-ZA', {timeZone:el.dataset.tz, hour:'2-digit', minute:'2-digit', second:'2-digit'});
    } catch { el.textContent='--:--'; }
  });
}

/* ── NEWS ────────────────────────────────────────────────── */
/* ── DURBAN & KZN LOCAL FEED (replaces Hacker News) ───────────── */
async function fetchDurbanNews() {
  const g = $('#newsGrid');
  if (!g) return;

  g.innerHTML = `<p style="color:var(--muted);font-family:var(--f-mono);font-size:.8rem;padding:1rem;grid-column:1/-1;">Loading Durban & KZN feed…</p>`;

  try {
    const feedUrl = 'https://unfolddurban.co.za/feed';
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(feedUrl);

    const res = await fetch(proxyUrl);
    const text = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const items = xml.querySelectorAll('item');

    let html = '';
    Array.from(items).slice(0, 9).forEach((item, i) => {
      const title   = item.querySelector('title')?.textContent?.trim() || 'Untitled';
      const link    = item.querySelector('link')?.textContent?.trim() || '#';
      const pubDate = item.querySelector('pubDate')?.textContent;
      const date    = pubDate ? new Date(pubDate).toLocaleDateString('en-ZA', {month:'short', day:'numeric'}) : '';

      html += `
        <article class="news-card reveal" style="transition-delay:${i * 0.05}s">
          <span class="nc-meta">Durban · ${date}</span>
          <h3 class="nc-title">${title}</h3>
          <p class="nc-sub">Local Durban & KZN lifestyle, events & business.</p>
          <a class="nc-link" href="${link}" target="_blank" rel="noopener noreferrer">Read full story →</a>
        </article>
      `;
    });

    g.innerHTML = html || `<p>No stories right now.</p>`;
    setTimeout(initReveal, 50);

  } catch (err) {
    console.error(err);
    g.innerHTML = `<p style="color:var(--muted);font-family:var(--f-mono);font-size:.8rem;padding:1rem;grid-column:1/-1;">Local feed temporarily unavailable.<br>Try refreshing.</p>`;
  }
}

/* ── MODALS ──────────────────────────────────────────────── */
window.openModal = function(id) {
  const m = $(`#${id}`);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeModal = function(id) {
  const m = $(`#${id}`);
  if (!m) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
};
document.addEventListener('keydown', e => {
  if (e.key==='Escape') {
    $$('.modal.open').forEach(m=>{ m.classList.remove('open'); document.body.style.overflow=''; });
  }
});

/* ── CONTACT FORM ────────────────────────────────────────── */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const s = $('#mStatus');
    if (s) { s.textContent='✓ Sent! I\'ll reply within 24 hours.'; s.style.color='var(--green)'; }
    setTimeout(()=>{ form.reset(); if(s) s.textContent=''; closeModal('contactModal'); }, 2800);
  });
}

/* ── NAV ─────────────────────────────────────────────────── */
function initNav() {
  const nav = $('#mainNav');
  const fab = $('#fab');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y>60);
    fab?.classList.toggle('show', y>400);
  }, { passive:true });

  $('#burger')?.addEventListener('click', () => {
    $('#navLinks')?.classList.toggle('open');
  });

  // close mobile nav on link click
  $$('.nl').forEach(a => a.addEventListener('click', () => {
    $('#navLinks')?.classList.remove('open');
  }));

  // active link tracking
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = en.target.id;
        $$('.nl').forEach(l => l.classList.toggle('active', l.dataset.sec===id));
      }
    });
  }, { rootMargin:'-40% 0px -55% 0px' });
  $$('section[id]').forEach(s=>io.observe(s));
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold:.1 });
  $$('.reveal').forEach(el => { if (!el.classList.contains('in')) io.observe(el); });
}

/* ── YEAR ────────────────────────────────────────────────── */
function setYear() {
  const el = $('#yr');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── INIT ────────────────────────────────────────────────── */
function init() {
  setTheme('dark');   // always start dark — no localStorage
  setYear();
  console.log('init() started');

   // theme + personalization controls
  $('#themeBtn')?.addEventListener('click', () => { toggleTheme(); });

  const fontSelect = $('#fontSelect');
  if (fontSelect) {
    fontSelect.value = S.font;
    fontSelect.addEventListener('change', e => setHeaderFont(e.target.value));
  }

  const accentSelect = $('#accentSelect');
  if (accentSelect) {
    accentSelect.value = S.accent;
    accentSelect.addEventListener('change', e => {
      setAccent(e.target.value);
      const rv = $('#autoRange');
      if (rv) drawBar(+rv.value);
    });
  }

  setHeaderFont(S.font);
  initCanvas();
  initCursor();
  initCounters();
  initTyping();
  renderServices();
  initDashboard();
  initConverter();
  initROI();
  renderClocks();
  initQuotes();
  initNav();
  initReveal();
  initContactForm();
  fetchDurbanNews();

  // tickers
  tickerTick();
  setInterval(tickerTick, 5000);
  tickClocks();
  setInterval(tickClocks, 1000);
  console.log('init() finished');
}

let isPlaying = false;
function toggleECR() {
  const audio = document.getElementById('ecrPlayer');
  const btn = document.getElementById('ecrPlayBtn');
  if (isPlaying) {
    audio.pause();
    btn.textContent = '▶ PLAY LIVE';
  } else {
    audio.play();
    btn.textContent = '❚❚ PAUSE';
  }
  isPlaying = !isPlaying;
}

if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
else init();

