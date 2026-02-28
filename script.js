const services = [
  {
    title: 'Python Automation Tools',
    desc: 'Automate repetitive business processes with robust Python scripts and integrations.',
    tags: ['automation', 'python', 'efficiency']
  },
  {
    title: 'WordPress Site Creation',
    desc: 'Design and build performant WordPress websites tailored to your brand and goals.',
    tags: ['wordpress', 'site', 'cms']
  },
  {
    title: 'Dynamic Web Applications',
    desc: 'Develop feature-rich web apps with custom logic, APIs, and interactive UX.',
    tags: ['app', 'dynamic', 'web']
  },
  {
    title: 'Static HTML Websites',
    desc: 'Fast, secure, and SEO-friendly static websites with handcrafted code.',
    tags: ['static', 'html', 'seo']
  },
  {
    title: 'Excel Spreadsheet Automation',
    desc: 'Simplify spreadsheets with formulas, macros, and process automation.',
    tags: ['excel', 'automation', 'spreadsheet']
  },
  {
    title: 'Dashboard Digitization',
    desc: 'Transform Excel workflows into interactive dashboards for clear decision-making.',
    tags: ['dashboard', 'excel', 'analytics']
  },
  {
    title: 'Inventory & Stock Control Tools',
    desc: 'Build reliable inventory systems to track stock, forecast demand, and reduce loss.',
    tags: ['inventory', 'stock', 'control']
  }
];

const els = {
  modal: document.getElementById('welcomeModal'),
  form: document.getElementById('userInputForm'),
  input: document.getElementById('userInput'),
  heroTitle: document.getElementById('heroTitle'),
  servicesHeading: document.getElementById('servicesHeading'),
  serviceGrid: document.getElementById('serviceGrid'),
  newsHeading: document.getElementById('newsHeading'),
  locationInfo: document.getElementById('locationInfo'),
  themeToggle: document.getElementById('themeToggle'),
  menuToggle: document.getElementById('menuToggle'),
  navLinks: document.getElementById('navLinks'),
  floatingCta: document.getElementById('floatingCta'),
  contactForm: document.getElementById('contactForm'),
  year: document.getElementById('year'),
  rangeInput: document.getElementById('rangeInput'),
  kpiHours: document.getElementById('kpiHours'),
  kpiErrors: document.getElementById('kpiErrors'),
  kpiSpeed: document.getElementById('kpiSpeed'),
  tiltCard: document.getElementById('tiltCard'),
  nameInput: document.getElementById('name'),
  messageInput: document.getElementById('message'),
  newsList: document.getElementById('newsList')
};

const state = {
  userInput: '',
  countryCode: '',
  theme: localStorage.getItem('theme') || 'auto'
};

function setTheme(theme) {
  if (theme === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  state.theme = theme;
  localStorage.setItem('theme', theme);
}

function cycleTheme() {
  const order = ['auto', 'light', 'dark'];
  const currentIndex = order.indexOf(state.theme);
  const next = order[(currentIndex + 1) % order.length];
  setTheme(next);
}

function renderServices(filterText = '') {
  const keyword = filterText.toLowerCase();
  const filtered = services.filter((service) =>
    keyword ? service.tags.some((tag) => tag.includes(keyword)) || service.title.toLowerCase().includes(keyword) : true
  );

  els.serviceGrid.innerHTML = filtered
    .map(
      (service) => `
      <article class="service-card">
        <h3>${service.title}</h3>
        <p>${service.desc}</p>
      </article>
    `
    )
    .join('');
}

function personalize(input) {
  const clean = input.trim();
  state.userInput = clean;
  const label = clean || 'Your Business';

  els.heroTitle.textContent = `Tailored Automation for ${label}`;
  els.servicesHeading.textContent = `Recommended Services for ${label}`;
  els.floatingCta.textContent = `Get ${label}'s Custom Site`;
  els.nameInput.value = /^[a-zA-Z\s]+$/.test(label) ? label : '';
  els.messageInput.value = `Hi, I'm interested in solutions related to "${label}". Please share next steps.`;

  renderServices(clean.toLowerCase());
}

function updateKpis(value) {
  const level = Number(value);
  const hours = Math.round((level / 100) * 40);
  const errors = Math.round((level / 100) * 70);
  const speed = (1 + level / 100).toFixed(1);

  els.kpiHours.textContent = `${hours}h/mo`;
  els.kpiErrors.textContent = `${errors}%`;
  els.kpiSpeed.textContent = `${speed}x`;
}

function setupFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}

async function fetchNews(country = '') {
  els.newsList.innerHTML = '<p>Loading latest stories...</p>';

  try {
    const topStories = await fetch('https://hnrss.org/frontpage.jsonfeed');
    const feed = await topStories.json();
    const items = feed.items?.slice(0, 6) || [];

    els.newsList.innerHTML = items
      .map(
        (item) => `
        <article class="news-item">
          <h3>${item.title}</h3>
          <p>${country ? `Popular with developers near ${country}.` : 'Global developer headline.'}</p>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer">Read more</a>
        </article>
      `
      )
      .join('');
  } catch (error) {
    els.newsList.innerHTML = '<p>Unable to load live news right now. Please try again later.</p>';
  }
}

async function getCountryFromCoordinates(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    const country = data.address?.country || 'your region';
    state.countryCode = country;
    els.locationInfo.textContent = `Showing tech news for ${country}.`;
    els.newsHeading.textContent = `Tech News in ${country}`;
    await fetchNews(country);
  } catch {
    els.locationInfo.textContent = 'Using global tech feed.';
    await fetchNews();
  }
}

function getLocation() {
  if (!('geolocation' in navigator)) {
    els.locationInfo.textContent = 'Geolocation unavailable. Using global tech feed.';
    fetchNews();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      getCountryFromCoordinates(position.coords.latitude, position.coords.longitude);
    },
    () => {
      els.locationInfo.textContent = 'Location access denied. Showing global tech feed.';
      fetchNews();
    },
    { timeout: 8000 }
  );
}

function setupTilt() {
  const card = els.tiltCard;
  card?.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = -((y / rect.height) - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card?.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
  });
}

function setupEvents() {
  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    personalize(els.input.value);
    els.modal.classList.add('hidden');
  });

  els.themeToggle.addEventListener('click', cycleTheme);
  els.menuToggle.addEventListener('click', () => els.navLinks.classList.toggle('open'));

  els.rangeInput.addEventListener('input', (e) => updateKpis(e.target.value));

  els.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks! Your request has been captured. This demo form can be connected to your backend.');
    els.contactForm.reset();
  });
}

function init() {
  setTheme(state.theme);
  renderServices();
  updateKpis(els.rangeInput.value);
  setupFadeIn();
  setupEvents();
  setupTilt();
  getLocation();

  els.year.textContent = new Date().getFullYear().toString();
}

init();
