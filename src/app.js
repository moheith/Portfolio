import { SITE } from './content.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const safeText = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const external = (url, label, extra = '') => `<a ${extra} href="${safeText(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;

const projectTrack = $('#project-track');
const filters = $$('.filter');
let currentFilter = 'ALL';
let currentQuery = '';
let modalProjectIndex = 0;
let modalReturnFocus = null;
let modalKeyHandler = null;
let paletteItems = [];
let paletteSelected = 0;
let introTimer = null;
let introFailSafe = null;
let swarmHideTimer = null;
let toastTimer = null;
let introAudio = null;
let introSound = false;
let introSpeed = 1;
let introTour = true;
let introActive = false;
let introStart = 0;
let motionOff = localStorage.getItem('mohieth-motion') === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;

function artMarkup(project) {
  const arts = {
    studio: `<div class="mock-studio"><div class="mock-top"><i></i><i></i><i></i><span>YULYA / STUDIO</span><b>VOICE READY</b></div><div class="mock-side"><span>FILES</span><i>▸ game.ts</i><i>▸ scene.css</i><i>▸ assets/</i></div><div class="mock-code"><span>01</span><span>const world = createGame({</span><span>02&nbsp; &nbsp; theme: <em>'night-garden'</em>,</span><span>03&nbsp; &nbsp; controls: <em>'keyboard'</em>,</span><span>04&nbsp; });</span><span>05&nbsp; world.start();</span></div><div class="mock-game"><i>PREVIEW / CANVAS</i><div class="pixel-sun"></div><div class="pixel-hill"></div><b>✦</b><small>PLAYING</small></div></div>`,
    desktop: `<div class="mock-desktop"><div class="mock-desktop-bar"><span>YULYA COMPANION</span><span>— □ ×</span></div><div class="mock-mascot"><span>M.</span><i>✳</i></div><div class="mock-chat"><small>YULYA / LOCAL MODEL</small><p>Hey! What are we building today?</p><div><i>◉</i> Voice input ready <b>•••</b></div></div><div class="mock-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`,
    discord: `<div class="mock-discord"><div class="mock-server"><span>Y</span><i>⌂</i><i>◎</i><i>◈</i></div><div class="mock-channel"><b>YULYA / COMMUNITY</b><small># general</small><small># research</small><small># voice-lounge</small><div>VOICE CONNECTED</div></div><div class="mock-convo"><div><b>YULYA</b><p>Here's a short summary of the topic you asked about.</p></div><div class="mock-command">/research <span>your question...</span></div></div></div>`,
    learnexa: `<div class="mock-learnexa"><div class="learn-head"><b>learnexa</b><span>EXPLORE &nbsp; MY SKILLS &nbsp; PROFILE</span><i>MM</i></div><div class="learn-title">Find your next<br><em>skill exchange.</em></div><div class="learn-search">⌕ &nbsp; Search skills or topics <b>FILTER</b></div><div class="learn-cards"><div><i>TEACH</i><b>UI DESIGN</b><span>with Aanya · 3 sessions</span></div><div><i>LEARN</i><b>PYTHON</b><span>with Rohan · flexible</span></div></div></div>`
  };
  return `<div class="project-art art-${project.visual}"><span class="art-kicker">ILLUSTRATIVE UI / NOT A PRODUCT SCREENSHOT</span><span class="art-index">${project.number} — 04</span>${arts[project.visual]}</div>`;
}

function renderProjects() {
  const visible = SITE.projects.filter((project) => {
    const matchesFilter = currentFilter === 'ALL' || project.category === currentFilter || (currentFilter === 'DEVELOPER TOOLS' && project.id === 'yulya-studio') || (currentFilter === 'EXPERIMENTS' && /prototype|demonstration|active/i.test(project.stage));
    const text = [project.title, project.summary, project.kind, project.category, ...project.stack].join(' ').toLowerCase();
    return matchesFilter && text.includes(currentQuery.toLowerCase());
  });
  projectTrack.innerHTML = visible.length ? visible.map((project) => `
    <article class="project-card" data-project="${project.id}" aria-label="${safeText(project.title)}">
      ${artMarkup(project)}
      <div class="project-card-content">
        <div class="project-card-top"><span class="category-chip">${safeText(project.kind)}</span><span class="stage-chip">${safeText(project.stage)}</span></div>
        <h3>${safeText(project.title)}</h3><p>${safeText(project.summary)}</p>
        <div class="project-stack">${project.stack.slice(0, 5).map((item) => `<span>${safeText(item)}</span>`).join('')}</div>
        <div class="card-links"><button class="details-link" data-open-project="${project.id}" aria-label="Open case study for ${safeText(project.title)}">CASE STUDY <span>↗</span></button><a href="${safeText(project.site || project.repo)}" target="_blank" rel="noopener noreferrer">${project.site ? 'PROJECT SITE' : 'GITHUB REPOSITORY'} ↗</a></div>
      </div>
    </article>`).join('') : '<div class="empty-results">NO PROJECTS MATCH THIS SEARCH. TRY A DIFFERENT TERM.</div>';
  $('#project-visible').textContent = String(visible.length).padStart(2, '0');
  $('#project-total').textContent = String(visible.length).padStart(2, '0');
  $$('.project-card').forEach((card) => card.addEventListener('click', (event) => {
    if (event.target.closest('a,button')) return;
    openProject(card.dataset.project);
  }));
  $$('.details-link').forEach((button) => button.addEventListener('click', () => openProject(button.dataset.openProject)));
  updateProjectCursor();
}

function renderContent() {
  $('#marquee-track').innerHTML = [...SITE.stack, ...SITE.stack].map((item) => `<span class="stack-tile">${safeText(item)} <i>✳</i></span>`).join('');
  $('#skills-list').innerHTML = SITE.skills.map((group) => `<section class="skill-group"><h3>${safeText(group.title)}</h3><div class="skill-tags">${group.items.map((item) => `<span>${safeText(item)}</span>`).join('')}</div></section>`).join('');
  $('#process-list').innerHTML = SITE.process.map((item, index) => `<li class="layer" data-layer="text"><span class="step-number">0${index + 1}</span><div><h3>${safeText(item.title)}</h3><p>${safeText(item.text)}</p></div></li>`).join('');
  $('#journey-list').innerHTML = SITE.journey.map((item, index) => `<article class="journey-row"><span>${safeText(item.phase)}</span><h3>${safeText(item.title)}</h3><p>${safeText(item.text)}</p><button type="button" aria-label="More about ${safeText(item.title)}" aria-expanded="false" data-journey="${index}">+</button></article>`).join('');
  $('#social-links').innerHTML = SITE.socials.map((item) => external(item.url, safeText(item.label))).join('');
  $('#year').textContent = String(new Date().getFullYear());
  renderProjects();
}

function announce(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function updateClock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-IN', { timeZone: SITE.person.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  $('#clock').textContent = time;
  $('.clock-short').textContent = time.slice(0, 5);
}

function closeMobileMenu() {
  const menu = $('#mobile-menu');
  menu.classList.remove('open');
  menu.inert = true;
  $('.menu-toggle').setAttribute('aria-expanded', 'false');
  $('.menu-toggle').setAttribute('aria-label', 'Open navigation');
  document.body.classList.remove('menu-open');
}

function initMenu() {
  const toggle = $('.menu-toggle');
  toggle.addEventListener('click', () => {
    const menu = $('#mobile-menu');
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    menu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);
    if (open) $('.menu-close').focus();
  });
  $('.menu-close').addEventListener('click', closeMobileMenu);
  $$('.mobile-menu a').forEach((link) => link.addEventListener('click', closeMobileMenu));
  $('#mobile-menu').addEventListener('click', (event) => { if (event.target === $('#mobile-menu')) closeMobileMenu(); });
}

function showModal(project) {
  const modal = $('#project-modal');
  const content = $('.modal-content', modal);
  const repoLink = !project.repoOwnerOnly ? external(project.repo, 'VIEW SOURCE ↗', 'class="secondary"') : '';
  const siteLink = project.site ? external(project.site, project.repoOwnerOnly ? 'VISIT PROJECT ↗' : 'OPEN PROJECT ↗') : '';
  content.innerHTML = `<p class="eyebrow">${safeText(project.number)} / ${safeText(project.kind)}</p><h2 id="modal-title">${safeText(project.title)}</h2><span class="stage-chip">${safeText(project.stage)}</span><p class="modal-summary">${safeText(project.summary)}</p>${artMarkup(project)}<p class="visual-caption">ORIGINAL CSS INTERFACE ILLUSTRATION — NOT A PRODUCT SCREENSHOT</p><div class="project-stack">${project.stack.map((item) => `<span>${safeText(item)}</span>`).join('')}</div><div class="modal-sections"><div><h3>THE CHALLENGE</h3><p>${safeText(project.challenge)}</p></div><div><h3>THE APPROACH</h3><p>${safeText(project.approach)}</p></div><div><h3>ENGINEERING NOTES</h3><p>${safeText(project.decisions)}</p></div><div><h3>DOCUMENTED FEATURES</h3><ul>${project.features.map((feature) => `<li>${safeText(feature)}</li>`).join('')}</ul></div><div class="modal-context"><h3>PROJECT CONTEXT</h3><p>${safeText(project.context)}</p></div></div><div class="modal-actions">${siteLink}${repoLink}</div>`;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  document.body.classList.add('modal-open');
  $('.modal-close', modal).focus();
}

function openProject(id, returnFocus = document.activeElement) {
  const index = SITE.projects.findIndex((project) => project.id === id);
  if (index < 0) return;
  modalProjectIndex = index;
  modalReturnFocus = returnFocus;
  showModal(SITE.projects[index]);
}

function closeModal() {
  const modal = $('#project-modal');
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalReturnFocus?.focus?.();
}

function moveModal(direction) {
  modalProjectIndex = (modalProjectIndex + direction + SITE.projects.length) % SITE.projects.length;
  showModal(SITE.projects[modalProjectIndex]);
}

function initModal() {
  const modal = $('#project-modal');
  $('.modal-close', modal).addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  modalKeyHandler = (event) => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowRight') moveModal(1);
    if (event.key === 'ArrowLeft') moveModal(-1);
    if (event.key === 'Tab') {
      const focusable = $$('a[href],button:not([disabled])', modal);
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener('keydown', modalKeyHandler);
}

function initFilters() {
  filters.forEach((button) => button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle('active', item === button));
    renderProjects();
    projectTrack.scrollTo({ left: 0, behavior: motionOff ? 'auto' : 'smooth' });
  }));
  $('#project-search').addEventListener('input', (event) => { currentQuery = event.currentTarget.value.trim(); renderProjects(); });
  $('.carousel-next').addEventListener('click', () => projectTrack.scrollBy({ left: projectTrack.clientWidth * .85, behavior: 'smooth' }));
  $('.carousel-prev').addEventListener('click', () => projectTrack.scrollBy({ left: -projectTrack.clientWidth * .85, behavior: 'smooth' }));
  projectTrack.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); projectTrack.scrollBy({ left: projectTrack.clientWidth * .8, behavior: 'smooth' }); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); projectTrack.scrollBy({ left: -projectTrack.clientWidth * .8, behavior: 'smooth' }); }
  });
  let down = false; let startX = 0; let startScroll = 0; let dragged = false;
  projectTrack.addEventListener('pointerdown', (event) => { if (event.target.closest('button,a')) return; down = true; dragged = false; startX = event.clientX; startScroll = projectTrack.scrollLeft; projectTrack.classList.add('dragging'); projectTrack.setPointerCapture(event.pointerId); });
  projectTrack.addEventListener('pointermove', (event) => { if (!down) return; const diff = event.clientX - startX; if (Math.abs(diff) > 4) dragged = true; projectTrack.scrollLeft = startScroll - diff; });
  const stopDrag = () => { down = false; projectTrack.classList.remove('dragging'); setTimeout(() => { dragged = false; }, 0); };
  projectTrack.addEventListener('pointerup', stopDrag); projectTrack.addEventListener('pointercancel', stopDrag);
  projectTrack.addEventListener('click', (event) => { if (dragged) event.stopPropagation(); }, true);
}

function initContact() {
  $('#copy-email').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(SITE.person.email); announce('Email copied to clipboard'); }
    catch { const field = document.createElement('textarea'); field.value = SITE.person.email; field.style.position = 'fixed'; field.style.opacity = '0'; document.body.append(field); field.select(); const ok = document.execCommand('copy'); field.remove(); announce(ok ? 'Email copied to clipboard' : SITE.person.email); }
  });
  $('#brief-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const greeting = `Hi Mohieth! I'm ${data.get('name') || 'interested in working together'}.\nProject type: ${data.get('type')}\n${data.get('email') ? `Email: ${data.get('email')}\n` : ''}\n${data.get('message')}`;
    window.open(`https://wa.me/${SITE.person.whatsapp}?text=${encodeURIComponent(greeting)}`, '_blank', 'noopener,noreferrer');
  });
  $$('[data-notice]').forEach((button) => button.addEventListener('click', () => announce(button.dataset.notice)));
  $$('.journey-row button').forEach((button) => button.addEventListener('click', () => {
    const row = button.closest('.journey-row');
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    let detail = $('.journey-detail', row);
    if (expanded) detail?.remove();
    else { detail = document.createElement('p'); detail.className = 'journey-detail'; detail.textContent = `${SITE.journey[Number(button.dataset.journey)].title} is an ongoing area of learning and building; no date or employment history is implied.`; row.append(detail); }
  }));
}

function initFeatureToggle() {
  const button = $('#stack-toggle'); const panel = $('#stack-explainer');
  const explanations = [
    ['USER INTERFACE', 'The browser or desktop surface where people interact with a product.'],
    ['API / BACKEND', 'Application logic and services that connect user actions to data and tools.'],
    ['DATA / STORAGE', 'Files, records and state that a product needs to keep and retrieve.'],
    ['AI / MODEL LAYER', 'Optional local or cloud models and the integrations around them.'],
    ['PREVIEW / OUTPUT', 'A result someone can inspect, use or continue iterating on.']
  ];
  panel.innerHTML = explanations.map(([title, text]) => `<div><b>${title}</b> — ${text}</div>`).join('');
  button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(open)); panel.hidden = !open; button.querySelector('span').textContent = open ? '−' : '+'; });
}

function initScroll() {
  const sections = $$('[data-section]');
  const chapterNames = ['Home', 'Work', 'Stack', 'Featured build', 'About', 'Process', 'Journey', 'Contact'];
  const chapterMap = chapterNames.map((label) => {
    const element = sections.find((section) => section.dataset.section === label);
    return element ? { label, id: element.id } : null;
  }).filter(Boolean);
  $('.chapters').innerHTML = chapterMap.map(({ label, id }) => `<a href="#${id}" aria-label="Go to ${label}"><span>${label.toUpperCase()}</span></a>`).join('');
  const chapterLinks = $$('.chapters a');
  const navLinks = $$('.desktop-nav a');
  const setProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? scrollY / max : 0;
    $('.playhead-fill').style.height = `${Math.min(100, Math.max(0, progress * 100))}%`;
    const frames = Math.round(progress * 120 * 24);
    const hh = String(Math.floor(frames / 86400)).padStart(2, '0');
    const mm = String(Math.floor((frames % 86400) / 1440)).padStart(2, '0');
    const ss = String(Math.floor((frames % 1440) / 24)).padStart(2, '0');
    const ff = String(frames % 24).padStart(2, '0');
    $('.playhead-time').textContent = `${hh}:${mm}:${ss}:${ff}`;
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${id}`));
      chapterLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${id}`));
      if (introActive && introTour && !introProgrammaticScroll) { introTour = false; $('.hud-tour').textContent = 'TOUR OFF'; }
    });
  }, { rootMargin: '-35% 0px -50% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
  let introProgrammaticScroll = false;
  window.addEventListener('scroll', () => {
    setProgress();
    if (introActive && !introProgrammaticScroll && introTour && performance.now() - introStart > 900) {
      introTour = false;
      $('.hud-tour').textContent = 'TOUR OFF';
    }
  }, { passive: true });
  chapterLinks.forEach((link) => link.addEventListener('click', () => { if (introActive) { introTour = false; $('.hud-tour').textContent = 'TOUR OFF'; } }));
  window.addEventListener('resize', setProgress, { passive: true });
  setProgress();
  document.addEventListener('portfolio:tour-scroll', (event) => {
    const section = document.getElementById(event.detail.id);
    if (!section || !introActive || !introTour) return;
    introProgrammaticScroll = true;
    section.scrollIntoView({ behavior: motionOff ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => { introProgrammaticScroll = false; }, 850);
  });
}

function initVisuals() {
  const portrait = $('.hero-portrait'); const word = $('.hero-word'); const glow = $('.hero-glow');
  const finePointer = matchMedia('(pointer: fine)').matches;
  if (finePointer) {
    const dot = $('.cursor-dot'); const ring = $('.cursor-ring');
    let mx = 0; let my = 0; let rx = 0; let ry = 0;
    window.addEventListener('pointermove', (event) => {
      mx = event.clientX; my = event.clientY;
      dot.style.left = `${mx}px`; dot.style.top = `${my}px`;
      ring.style.opacity = '1'; ring.style.left = `${rx || mx}px`; ring.style.top = `${ry || my}px`;
      const hero = $('.hero').getBoundingClientRect();
      if (hero.top < innerHeight && hero.bottom > 0 && !motionOff) {
        const x = (event.clientX / innerWidth - .5) * 20; const y = (event.clientY / innerHeight - .5) * 18;
        portrait.style.transform = `translate(${x * .7}px,${y * .7}px)`;
        word.style.transform = `translate(${x}px,${y}px)`;
        glow.style.transform = `translate(${event.clientX - innerWidth * .53}px,${event.clientY - innerHeight * .4}px)`;
      }
    }, { passive: true });
    const follow = () => { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.left = `${rx}px`; ring.style.top = `${ry}px`; requestAnimationFrame(follow); };
    requestAnimationFrame(follow);
    document.addEventListener('pointerover', (event) => {
      const target = event.target;
      ring.classList.toggle('copy', Boolean(target.closest('#copy-email,.contact-email')));
      ring.classList.toggle('view', Boolean(target.closest('.project-card')) && !target.closest('#copy-email,.contact-email'));
    });
    const dragTrack = $('#project-track');
    dragTrack.addEventListener('pointerdown', () => ring.classList.add('drag'));
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((type) => dragTrack.addEventListener(type, () => ring.classList.remove('drag')));
    document.addEventListener('pointerleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('pointerenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    $$('.magnetic').forEach((button) => button.addEventListener('pointermove', (event) => {
      if (motionOff) return;
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * .06;
      const y = (event.clientY - bounds.top - bounds.height / 2) * .08;
      button.style.transform = `translate(${Math.max(-8, Math.min(8, x))}px,${Math.max(-8, Math.min(8, y))}px)`;
    }));
    $$('.magnetic').forEach((button) => button.addEventListener('pointerleave', () => { button.style.transform = ''; }));
  }
  $('#project-track').addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || motionOff) return;
    const card = event.target.closest('.project-card'); if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--tilt-x', `${((event.clientY - rect.top) / rect.height - .5) * -1.5}deg`);
    card.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - .5) * 1.5}deg`);
  });
  $('#project-track').addEventListener('pointerleave', () => $$('.project-card').forEach((card) => { card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y'); }));
  const portraitImage = $('.hero-portrait img');
  portraitImage.src = SITE.person.portrait;
  portraitImage.addEventListener('error', () => { portraitImage.style.display = 'none'; $('.portrait-fallback').style.display = 'flex'; });
  if (portraitImage.complete && portraitImage.naturalWidth === 0) { portraitImage.style.display = 'none'; $('.portrait-fallback').style.display = 'flex'; }
  $$('.eyebrow').forEach((label) => { label.dataset.original = label.textContent; });
  const scrambleObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting || motionOff) return;
    const el = entry.target; if (el.dataset.scrambled) return; el.dataset.scrambled = 'true';
    const original = el.dataset.original; const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let frame = 0;
    const tick = () => { const resolved = Math.floor(frame / 2); el.textContent = original.split('').map((char, index) => char === ' ' || index < resolved ? char : chars[Math.floor(Math.random() * chars.length)]).join(''); frame += 1; if (resolved < original.length) requestAnimationFrame(tick); else el.textContent = original; };
    tick();
  }), { threshold: .8 });
  $$('.eyebrow').forEach((label) => scrambleObserver.observe(label));
}

const commandDefinitions = () => [
  ...[['Home', '#home'], ['Work', '#work'], ['Stack', '#stack'], ['Featured build', '#featured'], ['About', '#about'], ['Process', '#process'], ['Journey', '#journey'], ['Contact', '#contact']].map(([title, href]) => ({ title: `Go to ${title}`, type: 'section', target: href, hint: 'SECTION' })),
  ...SITE.projects.map((project) => ({ title: `Open ${project.title}`, type: 'project', target: project.id, hint: 'PROJECT' })),
  { title: 'Copy email address', type: 'copy', target: SITE.person.email, hint: 'ACTION' },
  { title: 'Start a WhatsApp message', type: 'whatsapp', target: SITE.person.whatsapp, hint: 'ACTION' },
  { title: `${motionOff ? 'Turn motion on' : 'Turn motion off'}`, type: 'motion', hint: 'PREFERENCE' },
  { title: 'Replay the portfolio build', type: 'replay', hint: 'EXPERIENCE' }
];

function openPalette() {
  const palette = $('#palette');
  palette.classList.add('open'); palette.setAttribute('aria-hidden', 'false');
  $('.palette-search input', palette).value = '';
  renderPalette('');
  $('.palette-search input', palette).focus();
}

function closePalette() { const palette = $('#palette'); palette.classList.remove('open'); palette.setAttribute('aria-hidden', 'true'); }

function renderPalette(query) {
  paletteItems = commandDefinitions().filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  paletteSelected = Math.min(paletteSelected, Math.max(0, paletteItems.length - 1));
  $('.palette-results').innerHTML = paletteItems.length ? paletteItems.map((item, index) => `<button class="palette-item${index === paletteSelected ? ' selected' : ''}" data-command-index="${index}"><small>${String(index + 1).padStart(2, '0')}</small><span>${safeText(item.title)}</span><em>${item.hint}</em></button>`).join('') : '<p class="empty-results">NO MATCHES</p>';
  $$('.palette-item').forEach((button) => button.addEventListener('click', () => executeCommand(paletteItems[Number(button.dataset.commandIndex)])));
}

function executeCommand(command) {
  if (!command) return;
  closePalette();
  if (command.type === 'section') document.querySelector(command.target)?.scrollIntoView({ behavior: motionOff ? 'auto' : 'smooth' });
  if (command.type === 'project') openProject(command.target, document.activeElement);
  if (command.type === 'copy') $('#copy-email').click();
  if (command.type === 'whatsapp') window.open(`https://wa.me/${command.target}`, '_blank', 'noopener,noreferrer');
  if (command.type === 'motion') setMotion(!motionOff);
  if (command.type === 'replay') startIntro(true);
}

function initPalette() {
  const palette = $('#palette');
  palette.addEventListener('click', (event) => { if (event.target === palette) closePalette(); });
  $('.palette-search input').addEventListener('input', (event) => { paletteSelected = 0; renderPalette(event.target.value); });
  $('.palette-search input').addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); paletteSelected = (paletteSelected + 1) % Math.max(paletteItems.length, 1); renderPalette(event.target.value); $('.palette-item.selected')?.scrollIntoView({ block: 'nearest' }); }
    if (event.key === 'ArrowUp') { event.preventDefault(); paletteSelected = (paletteSelected - 1 + paletteItems.length) % Math.max(paletteItems.length, 1); renderPalette(event.target.value); $('.palette-item.selected')?.scrollIntoView({ block: 'nearest' }); }
    if (event.key === 'Enter') { event.preventDefault(); executeCommand(paletteItems[paletteSelected]); }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closePalette(); closeMobileMenu(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openPalette(); }
    if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey) { event.preventDefault(); openPalette(); }
    if (event.key.toLowerCase() === 'm' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey) runEasterEgg();
  });
}

function setMotion(off) {
  motionOff = off;
  document.body.classList.toggle('motion-off', off);
  localStorage.setItem('mohieth-motion', off ? 'off' : 'on');
  const button = $('#motion-toggle');
  if (button) button.textContent = `MOTION: ${off ? 'OFF' : 'ON'}`;
  if (off && introActive) finishIntro();
  announce(`Motion ${off ? 'off' : 'on'}`);
}

function initPreferences() {
  document.body.classList.toggle('motion-off', motionOff);
  const footer = $('.site-footer');
  const controls = document.createElement('div'); controls.className = 'footer-preferences'; controls.innerHTML = '<button id="motion-toggle" type="button">MOTION: ON</button><label for="accent-select">ACCENT</label><select id="accent-select" aria-label="Accent colour"><option value="red">RED</option><option value="blue">BLUE</option><option value="amber">AMBER</option></select>';
  footer.insertBefore(controls, $('.back-top'));
  $('#motion-toggle').textContent = `MOTION: ${motionOff ? 'OFF' : 'ON'}`;
  $('#motion-toggle').addEventListener('click', () => setMotion(!motionOff));
  const accent = localStorage.getItem('mohieth-accent') || 'red';
  document.body.classList.toggle('accent-blue', accent === 'blue');
  document.body.classList.toggle('accent-amber', accent === 'amber');
  $('#accent-select').value = accent;
  $('#accent-select').addEventListener('change', (event) => {
    const selected = event.target.value;
    document.body.classList.toggle('accent-blue', selected === 'blue');
    document.body.classList.toggle('accent-amber', selected === 'amber');
    localStorage.setItem('mohieth-accent', selected);
  });
}

const introColors = ['#5eead4', '#fb923c', '#ffffff', '#a78bfa', '#7dd3fc', '#fda4af', '#fcd34d', '#86efac'];
function setAgentsAt(x, y, orbit = false) {
  $$('.agent').forEach((agent, index) => {
    const angle = (Math.PI * 2 * index / 8) + (performance.now() / (orbit ? 500 : 1400));
    const radius = orbit ? 42 : 10 + index * 2;
    agent.style.left = `${Math.max(20, Math.min(innerWidth - 28, x + Math.cos(angle) * radius))}px`;
    agent.style.top = `${Math.max(20, Math.min(innerHeight - 75, y + Math.sin(angle) * radius))}px`;
    agent.style.transform = `rotate(${angle * 45}deg)`;
  });
}

function layerElements() { return $$('.layer[data-layer]'); }
function introStepDelay() { return Math.max(650, (innerWidth <= 640 ? 1250 : 2300) / introSpeed); }

function renderIntroStep(index, total) {
  const layers = layerElements();
  const element = layers[index % layers.length];
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const x = Math.max(22, Math.min(innerWidth - 30, rect.left + rect.width / 2));
  const y = Math.max(22, Math.min(innerHeight - 100, rect.top + rect.height / 2));
  setAgentsAt(x, y);
  const box = $('.selection-box');
  box.style.left = `${Math.max(19, rect.left)}px`;
  box.style.top = `${Math.max(19, rect.top)}px`;
  box.style.width = `${Math.max(10, Math.min(rect.width, innerWidth - rect.left - 10))}px`;
  box.style.height = `${Math.max(10, Math.min(rect.height, innerHeight - rect.top - 55))}px`;
  box.style.opacity = rect.bottom < 18 || rect.top > innerHeight ? '0' : '1';
  $('.selection-size').textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
  $$('.agent').forEach((agent, agentIndex) => { agent.textContent = element.dataset.layer === 'text' ? 'I' : element.dataset.layer === 'image' ? '⌖' : '↗'; agent.style.color = introColors[agentIndex]; });
  element.classList.add('build-flash');
  setTimeout(() => element.classList.remove('build-flash'), 450);
  $('.hud-progress').textContent = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')} LAYERS`;
  $('.hud-meter i').style.width = `${((index + 1) / total) * 100}%`;
  $('.hud-state').innerHTML = `<i></i> BUILDING ${element.dataset.layer.toUpperCase()}…`;
  if (introSound && introAudio) {
    const oscillator = introAudio.createOscillator(); const gain = introAudio.createGain();
    oscillator.frequency.value = 430 + (index % 5) * 75; gain.gain.value = .018;
    oscillator.connect(gain); gain.connect(introAudio.destination); oscillator.start(); oscillator.stop(introAudio.currentTime + .045);
  }
  if (index % 3 === 0) {
    const section = element.closest('[data-section]');
    if (section && introTour) document.dispatchEvent(new CustomEvent('portfolio:tour-scroll', { detail: { id: section.id } }));
  }
}

function finishIntro() {
  if (!introActive) return;
  introActive = false; clearInterval(introTimer); introTimer = null;
  clearTimeout(introFailSafe); introFailSafe = null;
  clearTimeout(swarmHideTimer); swarmHideTimer = null;
  const swarm = $('#swarm'); swarm.classList.add('done');
  $('.hud-state').innerHTML = '<i></i> BUILD COMPLETE';
  $('.hud-progress').textContent = `${String(layerElements().length).padStart(2, '0')} / ${String(layerElements().length).padStart(2, '0')} LAYERS`;
  $('.hud-meter i').style.width = '100%';
  $('.hud-skip').hidden = true; $('.hud-replay').hidden = false;
  $('.hud-live').hidden = false;
  const duration = ((performance.now() - introStart) / 1000).toFixed(1);
  $('.hud-agents').textContent = `08 AGENTS · ${duration}S`;
  setAgentsAt(innerWidth * .5, innerHeight * .43, true);
  const orbitUntil = performance.now() + 6200;
  const orbit = () => { if (!introActive && $('#swarm').classList.contains('active') && performance.now() < orbitUntil) { setAgentsAt(innerWidth * .5, innerHeight * .43, true); requestAnimationFrame(orbit); } };
  requestAnimationFrame(orbit);
  sessionStorage.setItem('mohieth-swarm-seen', '1');
  $('#build-replay').hidden = false;
  swarmHideTimer = setTimeout(() => { swarm.classList.remove('active'); swarmHideTimer = null; }, 6500);
}

function startIntro(force = false) {
  if (motionOff) { $('#build-replay').hidden = false; return; }
  if (!force && sessionStorage.getItem('mohieth-swarm-seen')) { $('#build-replay').hidden = false; return; }
  const swarm = $('#swarm'); const layers = layerElements();
  if (!layers.length) return;
  clearTimeout(swarmHideTimer); swarmHideTimer = null;
  clearTimeout(introFailSafe); introFailSafe = null;
  clearInterval(introTimer); introActive = true; introStart = performance.now(); introTour = true; introSpeed = 1;
  swarm.classList.remove('done'); swarm.classList.add('active');
  $('.agents').innerHTML = Array.from({ length: innerWidth <= 640 ? 8 : 8 }, (_, index) => `<span class="agent" aria-hidden="true" style="color:${introColors[index]}">↗</span>`).join('');
  $('.hud-agents').textContent = '08 AGENTS'; $('.hud-progress').textContent = `00 / ${String(layers.length).padStart(2, '0')} LAYERS`;
  $('.hud-meter i').style.width = '0%'; $('.hud-state').innerHTML = '<i></i> SCANNING PAGE…'; $('.hud-skip').hidden = false; $('.hud-replay').hidden = true; $('.hud-skip').textContent = 'SKIP INTRO ×'; $('.hud-speed').textContent = '1×'; $('.hud-tour').textContent = 'TOUR ON';
  $('.selection-box').style.opacity = '0'; setAgentsAt(innerWidth / 2, innerHeight / 2);
  let index = 0; renderIntroStep(index, layers.length);
  introTimer = setInterval(() => {
    index += 1;
    if (index >= layers.length) { finishIntro(); return; }
    renderIntroStep(index, layers.length);
  }, introStepDelay());
  // Fail-safe for stalled timers, a hidden tab, or unexpected runtime failures.
  introFailSafe = setTimeout(() => { if (introActive) finishIntro(); }, 56000);
  $('#build-replay').hidden = true;
}

function initSwarm() {
  $('.hud-skip').addEventListener('click', finishIntro);
  $('.hud-live').addEventListener('click', () => { $('#swarm').classList.remove('active'); $('#build-replay').hidden = false; });
  $('.hud-replay').addEventListener('click', () => startIntro(true));
  $('#build-replay').addEventListener('click', () => startIntro(true));
  $('.hud-tour').addEventListener('click', (event) => { introTour = !introTour; event.currentTarget.textContent = introTour ? 'TOUR ON' : 'TOUR OFF'; });
  $('.hud-speed').addEventListener('click', (event) => { const speeds = [1, 2, 4, .5]; introSpeed = speeds[(speeds.indexOf(introSpeed) + 1) % speeds.length]; event.currentTarget.textContent = `${introSpeed}×`; if (introActive) { clearInterval(introTimer); let index = Number($('.hud-progress').textContent.split(' ')[0]); introTimer = setInterval(() => { index += 1; if (index >= layerElements().length) finishIntro(); else renderIntroStep(index, layerElements().length); }, introStepDelay()); } });
  $('.hud-sound').addEventListener('click', async (event) => {
    introSound = !introSound; event.currentTarget.textContent = `SOUND ${introSound ? 'ON' : 'OFF'}`;
    if (introSound && !introAudio) { const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (AudioContextClass) { introAudio = new AudioContextClass(); await introAudio.resume(); } else { introSound = false; event.currentTarget.textContent = 'SOUND OFF'; announce('Web Audio is unavailable'); } }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && introActive) finishIntro(); });
  window.addEventListener('error', () => { if (introActive) finishIntro(); });
  window.addEventListener('unhandledrejection', () => { if (introActive) finishIntro(); });
  window.addEventListener('keydown', (event) => { if (introActive && !introKeyboardUsed && event.key !== 'Tab') { introKeyboardUsed = true; finishIntro(); } });
  let introKeyboardUsed = false;
  setTimeout(() => startIntro(false), 500);
}

function runEasterEgg() {
  const agents = $('.agents');
  agents.innerHTML = Array.from({ length: 8 }, (_, index) => `<span class="agent" style="color:${introColors[index]};left:50%;top:45%">↗</span>`).join('');
  $('#swarm').classList.add('active');
  setAgentsAt(innerWidth * .5, innerHeight * .45, true);
  setTimeout(() => { if (!introActive) $('#swarm').classList.remove('active'); }, 1800);
}

function init() {
  renderContent(); initMenu(); initFilters(); initModal(); initContact(); initFeatureToggle(); initScroll(); initVisuals(); initPalette(); initPreferences(); initSwarm();
  updateClock(); setInterval(updateClock, 30000);
}

init();

