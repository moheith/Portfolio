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
let introWorkUntil = 0;
let introScrollCancel = null;
let introSceneUnits = [];
let introCompletedUnits = new Set();
let introProcessedCount = 0;
let introBatchNumber = 0;
let introPeakAgentCount = 0;
let introPreludeTimer = null;
let introFailSafe = null;
let swarmHideTimer = null;
let toastTimer = null;
let introAudio = null;
let introSound = false;
let introSpeed = 1;
let introTour = true;
let introActive = false;
let introStart = 0;
let introLayers = [];
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
}

function renderContent() {
  $('#marquee-track').innerHTML = [...SITE.stack, ...SITE.stack].map((item) => `<span class="stack-tile">${safeText(item)} <i>✳</i></span>`).join('');
  $('#skills-list').innerHTML = SITE.skills.map((group) => `<section class="skill-group"><h3>${safeText(group.title)}</h3><div class="skill-tags">${group.items.map((item) => `<span>${safeText(item)}</span>`).join('')}</div></section>`).join('');
  $('#process-list').innerHTML = SITE.process.map((item, index) => `<li class="layer" data-layer="text"><span class="step-number">0${index + 1}</span><div><h3>${safeText(item.title)}</h3><p>${safeText(item.text)}</p></div></li>`).join('');
  $('#journey-list').innerHTML = SITE.journey.map((item, index) => `<article class="journey-row layer" data-layer="card"><span>${safeText(item.phase)}</span><h3>${safeText(item.title)}</h3><p>${safeText(item.text)}</p><button type="button" aria-label="More about ${safeText(item.title)}" aria-expanded="false" data-journey="${index}">+</button></article>`).join('');
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
    });
  }, { rootMargin: '-35% 0px -50% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
  const pauseTour = () => {
    if (!introActive || !introTour) return;
    introTour = false;
    $('.hud-tour').textContent = 'TOUR OFF';
  };
  window.addEventListener('scroll', setProgress, { passive: true });
  window.addEventListener('wheel', pauseTour, { passive: true });
  window.addEventListener('touchstart', pauseTour, { passive: true });
  chapterLinks.forEach((link) => link.addEventListener('click', () => { if (introActive) { introTour = false; $('.hud-tour').textContent = 'TOUR OFF'; } }));
  window.addEventListener('resize', setProgress, { passive: true });
  setProgress();
  document.addEventListener('portfolio:tour-scroll', (event) => {
    const section = document.getElementById(event.detail.id);
    if (!section || !introActive || !introTour) return;
    const top = section.getBoundingClientRect().top + scrollY - innerHeight * .48;
    window.scrollTo({ top: Math.max(0, top), behavior: motionOff ? 'auto' : 'smooth' });
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
  if (off && introActive) finishIntro(false);
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
const introAgentTargets = { Home: 16, Work: 24, Stack: 16, 'Featured build': 24, About: 24, Process: 22, Journey: 22, Contact: 28, Footer: 12 };
const introAgentFloors = { Home: 9, Work: 13, Stack: 7, 'Featured build': 13, About: 12, Process: 12, Journey: 10, Contact: 14, Footer: 5 };
const introAgentRoles = ['writer', 'dragger', 'aligner', 'scout'];
const introActionTimers = new Set();
let introSectionRanges = new Map();

function clearIntroEffects() {
  introActionTimers.forEach(clearTimeout);
  introActionTimers.clear();
  $$('.intro-selection-frames').forEach((frames) => frames.remove());
  $$('.build-typing').forEach((element) => {
    element.classList.remove('build-typing');
    element.style.removeProperty('--typing-duration');
    element.style.removeProperty('--typing-delay');
    element.style.removeProperty('--typing-steps');
  });
}

function scheduleIntroAction(callback, delay) {
  const timer = setTimeout(() => {
    introActionTimers.delete(timer);
    if (introActive) callback();
  }, delay);
  introActionTimers.add(timer);
  return timer;
}

function drawIntroSelectionFrame(rect, role, duration = 420) {
  if (!rect || rect.right <= 0 || rect.bottom <= 0 || rect.left >= innerWidth || rect.top >= innerHeight) return;
  const swarm = $('#swarm');
  let frames = $('.intro-selection-frames', swarm);
  if (!frames) {
    frames = document.createElement('div');
    frames.className = 'intro-selection-frames';
    frames.setAttribute('aria-hidden', 'true');
    swarm.append(frames);
  }
  const frame = document.createElement('span');
  frame.className = `intro-selection-frame selection-${role}`;
  const padding = 4;
  const left = Math.max(3, rect.left - padding);
  const top = Math.max(3, rect.top - padding);
  const right = Math.min(innerWidth - 3, rect.right + padding);
  const bottom = Math.min(innerHeight - 3, rect.bottom + padding);
  Object.assign(frame.style, { left: `${left}px`, top: `${top}px`, width: `${Math.max(12, right - left)}px`, height: `${Math.max(12, bottom - top)}px` });
  frames.append(frame);
  scheduleIntroAction(() => {
    frame.classList.add('is-releasing');
    scheduleIntroAction(() => frame.remove(), 110);
  }, duration);
}

function cacheIntroSectionRanges(layers) {
  introSectionRanges = new Map();
  layers.forEach((layer, index) => {
    const section = layer.closest('[data-section]')?.dataset.section || 'Footer';
    const range = introSectionRanges.get(section) || { start: index, end: index + 1 };
    range.end = index + 1;
    introSectionRanges.set(section, range);
  });
}

function cacheIntroSceneUnits(layers) {
  const selector = [
    '.hero-topline', '.hero-open', '.hero-copy .script', '.hero-copy h1', '.hero-role', '.hero-intro', '.hero-actions .button', '.hero-actions .location',
    '.hero-portrait', '.aside-statement', '.hero-stats > div > strong', '.hero-stats > div > span', '.exploring-label', '.exploring', '.hero-aside .text-button', '.hero-bottom > *',
    '.work-heading .eyebrow', '.work-heading h2', '.work-heading .section-intro', '.work-toolbar .filter', '.work-toolbar .search-box',
    '.project-card-top > *', '.project-card h3', '.project-card p', '.project-stack > span', '.card-links > *', '.carousel-footer > *',
    '.stack-strip', '.stack-tile', '.featured-copy .eyebrow', '.featured-copy h2', '.featured-copy > p:not(.eyebrow)', '.featured-copy .button',
    '.system-top', '.system-node', '.system-log > *', '.visual-caption',
    '.about-head .eyebrow', '.about-head h2', '.about-bio > p', '.education-card', '.skills-top', '.skill-group h3', '.skill-group .skill-tags span',
    '.process-heading .eyebrow', '.process-heading h2', '.process-heading .section-intro', '.process-list .step-number', '.process-list li h3', '.process-list li p', '.process-quote > span', '.process-quote > p', '.process-quote cite',
    '.journey .section-heading .eyebrow', '.journey .section-heading h2', '.journey .section-intro', '.journey-row > span', '.journey-row h3', '.journey-row p', '.journey-row button',
    '.milestones article > span', '.milestones article > strong', '.milestones article > p',
    '.contact-kicker > *', '.contact h2', '.contact-intro', '.contact-email', '.contact-actions > *', '.social-links > *', '.poster-card',
    '.brief-form .form-heading', '.brief-form label', '.brief-form .form-note', '.brief-form > button', '.site-footer > *'
  ].join(',');
  const aliases = [
    ['.project-card', '.project-art .art-kicker'], ['.carousel-shell', '.project-track .project-art .art-kicker'], ['.project-art', '.art-kicker'], ['.stack-strip', '.stack-tile'],
    ['.work-toolbar', '.work-toolbar .filter'], ['.about-bio', '.about-bio > p'], ['.skills-panel', '.skills-top'],
    ['.process-quote', '.process-quote > p'], ['.journey-row', '.journey-row h3'], ['.milestones article', '.milestones article > strong'],
    ['.contact-kicker', '.contact-kicker > .eyebrow'], ['.contact-actions', '.contact-actions > *'], ['.social-links', '.social-links > *'],
    ['.site-footer', '.site-footer .wordmark']
  ];
  const targetForLayer = (layer) => {
    const alias = aliases.find(([wrapper]) => layer.matches(wrapper));
    const aliasTarget = alias ? layer.querySelector(alias[1]) : null;
    return aliasTarget || layer.closest(selector) || layer;
  };
  const grouped = new Map();
  layers.forEach((layer, index) => {
    const element = targetForLayer(layer);
    const unit = grouped.get(element) || { element, layers: [], firstLayerIndex: index };
    unit.layers.push(layer);
    unit.firstLayerIndex = Math.min(unit.firstLayerIndex, index);
    grouped.set(element, unit);
  });
  const illustrationTargets = [
    '.project-art .art-kicker', '.project-art .art-index',
    '.mock-top', '.mock-side > *', '.mock-code > span', '.mock-game > i', '.mock-game > b', '.mock-game > small', '.mock-game .pixel-sun', '.mock-game .pixel-hill',
    '.mock-desktop-bar', '.mock-mascot', '.mock-chat > small', '.mock-chat > p', '.mock-chat > div', '.mock-wave',
    '.mock-server', '.mock-channel > b', '.mock-channel > small', '.mock-channel > div', '.mock-convo > div:first-child > b', '.mock-convo > div:first-child > p', '.mock-command',
    '.learn-head > b', '.learn-head > span', '.learn-head > i', '.learn-title', '.learn-search', '.learn-cards > div'
  ].join(',');
  $$(illustrationTargets).forEach((element) => {
    if (grouped.has(element)) return;
    const art = element.closest('.project-art');
    const artIndex = layers.findIndex((layer) => layer === art);
    if (artIndex < 0) return;
    const rect = element.getBoundingClientRect();
    if (rect.width < 18 || rect.height < 10 || getComputedStyle(element).display === 'none') return;
    grouped.set(element, { element, layers: [], firstLayerIndex: artIndex });
  });
  introSceneUnits = [...grouped.values()].flatMap((unit) => {
    const element = unit.element;
    const text = (element.textContent || '').trim();
    if (!element.matches('p,h1,h2,h3,.hero-role,.contact-email') || text.length < 35) return [unit];
    const lines = introTextLineRects(element);
    if (lines.length < 2) return [unit];
    const segmentLines = lines.length > 2 ? [0, lines.length - 1] : lines.map((_, index) => index);
    return segmentLines.map((lineIndex, segmentIndex) => ({
      ...unit,
      layers: segmentIndex === 0 ? unit.layers : [],
      segmentIndex: lineIndex,
      segmentOrder: segmentIndex,
      segmentCount: segmentLines.length
    }));
  }).sort((a, b) => a.firstLayerIndex - b.firstLayerIndex || (a.segmentIndex ?? 0) - (b.segmentIndex ?? 0));
  introCompletedUnits = new Set();
  introProcessedCount = 0;
  introBatchNumber = 0;
}

function introAgentCountForStep(index, section) {
  const range = introSectionRanges.get(section);
  const ceiling = introAgentTargets[section] || 4;
  const floor = introAgentFloors[section] ?? ceiling;
  if (!range || ceiling <= floor) return ceiling;
  const progress = Math.max(0, Math.min(1, (index - range.start) / Math.max(1, range.end - range.start - 1)));
  const mobileScale = innerWidth <= 640 ? .58 : 1;
  return Math.max(innerWidth <= 640 ? 4 : floor, Math.round((floor + (ceiling - floor) * progress) * mobileScale));
}

function introSafeViewport() {
  const headerHeight = $('.site-header')?.getBoundingClientRect().height || 0;
  const hudHeight = $('.swarm-hud')?.getBoundingClientRect().height || 44;
  const safeTop = Math.max(70, headerHeight + 14);
  const safeBottom = Math.max(safeTop + 180, innerHeight - hudHeight - 38);
  return { safeTop, safeBottom };
}

function introScrollDestination(unit) {
  const rect = unit?.element ? introUnitRect(unit) : unit.getBoundingClientRect();
  const { safeTop, safeBottom } = introSafeViewport();
  const documentTop = rect.top + scrollY;
  let target = scrollY;
  if (rect.height > safeBottom - safeTop) {
    target = documentTop + rect.height / 2 - (safeTop + safeBottom) / 2;
  } else if (rect.top < safeTop) {
    target = documentTop - safeTop;
  } else if (rect.bottom > safeBottom) {
    target = documentTop + rect.height - safeBottom;
  }
  target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, target));
  return Math.abs(target - scrollY) > 28 ? target : null;
}

function introTrackScrollDestination(unit) {
  const element = unit.element;
  const track = element.closest('.project-track');
  if (!track) return null;
  const rect = introUnitRect(unit);
  const trackRect = track.getBoundingClientRect();
  const inset = 12;
  let target = track.scrollLeft;
  if (rect.left < trackRect.left + inset) target += rect.left - trackRect.left - inset;
  else if (rect.right > trackRect.right - inset) target += rect.right - trackRect.right + inset;
  target = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, target));
  return Math.abs(target - track.scrollLeft) > 12 ? { track, target } : null;
}

function cancelIntroScroll() {
  if (!introScrollCancel) return;
  introScrollCancel();
  window.scrollTo({ top: scrollY, behavior: 'instant' });
}

function scrollIntroToUnit(unit, target) {
  if (!unit || target === null || !introTour) return false;
  const sectionName = unit.element.closest('[data-section]')?.dataset.section || 'Footer';
  $('.hud-state').innerHTML = `<i></i> MOVING TO ${sectionName.toUpperCase()}…`;
  const distance = Math.abs(target - scrollY);
  const fallbackDelay = Math.min(560, Math.max(250, 200 + distance * .2));
  let settled = false;
  let fallbackTimer = null;
  const cleanup = () => {
    clearTimeout(fallbackTimer);
    window.removeEventListener('scrollend', finish);
    if (introScrollCancel === cancel) introScrollCancel = null;
  };
  const cancel = () => {
    if (settled) return;
    settled = true;
    cleanup();
  };
  const finish = () => {
    if (settled) return;
    settled = true;
    cleanup();
    if (introActive) runIntroBatch();
  };
  introScrollCancel = cancel;
  window.addEventListener('scrollend', finish, { once: true });
  fallbackTimer = setTimeout(finish, fallbackDelay);
  window.scrollTo({ top: target, behavior: motionOff ? 'instant' : 'smooth' });
  return true;
}

function scrollIntroTrackToUnit(unit, destination) {
  const { track, target } = destination;
  if (!unit || !track || target === null) return false;
  const distance = Math.abs(target - track.scrollLeft);
  let settled = false;
  let fallbackTimer = null;
  const cleanup = () => {
    clearTimeout(fallbackTimer);
    track.removeEventListener('scrollend', finish);
    if (introScrollCancel === cancel) introScrollCancel = null;
  };
  const cancel = () => {
    if (settled) return;
    settled = true;
    cleanup();
    track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
  };
  const finish = () => {
    if (settled) return;
    settled = true;
    cleanup();
    if (introActive) runIntroBatch();
  };
  introScrollCancel = cancel;
  $('.hud-state').innerHTML = '<i></i> MOVING THROUGH BUILDS';
  track.addEventListener('scrollend', finish, { once: true });
  fallbackTimer = setTimeout(finish, Math.min(520, Math.max(240, 190 + distance * .34)));
  track.scrollTo({ left: target, behavior: motionOff ? 'instant' : 'smooth' });
  return true;
}

const introAgentIcons = {
  writer: 'M5 19 17.5 6.5l3 3L8 22H5v-3ZM15.8 8.2l3 3M4 22h17',
  dragger: 'M8 11V5.5a1.5 1.5 0 0 1 3 0V10 4.8a1.5 1.5 0 0 1 3 0V10 6.1a1.5 1.5 0 0 1 3 0v5.1l1.2-1.1a1.7 1.7 0 0 1 2.6 2.1l-3.1 5a4 4 0 0 1-3.4 1.9h-3a4 4 0 0 1-3.5-2l-3.2-5.2A1.7 1.7 0 0 1 9 10.2L11 12',
  grabber: 'M6.2 11.5V8.8a1.5 1.5 0 0 1 3 0v2.1V7.8a1.5 1.5 0 0 1 3 0v3.1V8.2a1.5 1.5 0 0 1 3 0v3.2V9.6a1.5 1.5 0 0 1 3 0v4.7a5 5 0 0 1-5 5h-2.4a4.3 4.3 0 0 1-3.8-2.3l-2.2-3.8a1.5 1.5 0 0 1 2.5-1.7l1.5 1.7',
  aligner: 'M12 3v18M3 12h18M12 3 9 6M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3',
  scout: 'M4 2.8v17l4.8-4.5 3.1 6.1 2.6-1.3-3-6.2h6.9L4 2.8Z'
};

function agentIconMarkup(role, grabbing = false) {
  const fill = role === 'scout' ? 'currentColor' : 'none';
  const icon = role === 'dragger' && grabbing ? introAgentIcons.grabber : introAgentIcons[role] || introAgentIcons.scout;
  return `<svg viewBox="0 0 24 24" focusable="false"><path d="${icon}" fill="${fill}" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}

function setAgentGrabState(agent, grabbing) {
  if (!agent?.classList.contains('mode-dragger')) return;
  agent.classList.toggle('is-grabbing', grabbing);
  agent.innerHTML = agentIconMarkup('dragger', grabbing);
}

function agentMarkup(index) {
  const role = introAgentRoles[index % introAgentRoles.length];
  return `<span class="agent mode-${role}" aria-hidden="true" style="color:${introColors[index % introColors.length]}">${agentIconMarkup(role)}</span>`;
}

function setAgentRole(agent, role, index) {
  agent.className = `agent mode-${role}`;
  agent.style.color = introColors[index % introColors.length];
  agent.innerHTML = agentIconMarkup(role);
}

function ensureAgentCount(count) {
  const container = $('.agents');
  const requested = innerWidth <= 640 ? Math.min(10, count) : Math.min(30, count);
  if (introActive) introPeakAgentCount = Math.max(introPeakAgentCount, requested);
  let agents = $$('.agent:not(.retiring)', container);
  while (agents.length < requested) {
    const index = agents.length;
    container.insertAdjacentHTML('beforeend', agentMarkup(index));
    const agent = container.lastElementChild;
    const side = index % 4;
    const point = side === 0 ? { x: 12, y: innerHeight * (.28 + (index % 3) * .17) }
      : side === 1 ? { x: innerWidth - 30, y: innerHeight * (.24 + (index % 4) * .15) }
        : side === 2 ? { x: innerWidth * (.24 + (index % 4) * .15), y: 24 }
          : { x: innerWidth * (.28 + (index % 4) * .14), y: innerHeight - 86 };
    agent._point = point;
    agent._fresh = true;
    agent.style.transform = `translate3d(${point.x}px,${point.y}px,0)`;
    agents = $$('.agent:not(.retiring)', container);
  }
  while (agents.length > requested) {
    const agent = agents.pop();
    agent.classList.add('retiring');
    const point = agent._point || { x: innerWidth / 2, y: innerHeight / 2 };
    const fade = agent.animate([
      { transform: `translate3d(${point.x}px,${point.y}px,0) scale(1)`, opacity: 1 },
      { transform: `translate3d(${point.x}px,${point.y - 8}px,0) scale(.55)`, opacity: 0 }
    ], { duration: 180, easing: 'ease-in', fill: 'forwards' });
    fade.onfinish = () => agent.remove();
  }
  $('.hud-agents').textContent = `${String(requested).padStart(2, '0')} AGENTS`;
}

function setAgentPoint(agent, x, y, rotation = 0) {
  const point = { x: Math.max(20, Math.min(innerWidth - 24, x)), y: Math.max(20, Math.min(innerHeight - 72, y)) };
  agent._point = point;
  agent.style.left = '0px';
  agent.style.top = '0px';
  agent.style.transform = `translate3d(${point.x}px,${point.y}px,0) rotate(${rotation}deg)`;
}

function setAgentsAt(x, y, orbit = false) {
  const agents = $$('.agent:not(.retiring)');
  agents.forEach((agent, index) => {
    const angle = (Math.PI * 2 * index / Math.max(agents.length, 1)) + (performance.now() / (orbit ? 750 : 1600));
    const radius = orbit ? Math.min(78, Math.min(innerWidth, innerHeight) * .12) : 16 + (index % 5) * 9;
    setAgentPoint(agent, x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, orbit ? (angle * 180 / Math.PI) + 90 : angle * 180 / Math.PI);
  });
}

function flyAgentsTo(rect, kind, textRect = null, moveDuration = 240, agentGroup = null) {
  const agents = agentGroup || $$('.agent:not(.retiring)');
  const bounds = rect || { left: innerWidth / 2, top: innerHeight / 2, width: 1, height: 1 };
  const left = bounds.left + 8;
  const right = bounds.left + Math.max(12, bounds.width - 8);
  const top = bounds.top + 8;
  const bottom = bounds.top + Math.max(12, bounds.height - 8);
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const textBounds = textRect || bounds;
  const writerLeft = textBounds.left + 6;
  const writerWidth = Math.max(22, Math.min(textBounds.width - 14, innerWidth * .8));
  const roleCounts = { writer: 0, dragger: 0, aligner: 0, scout: 0 };
  const clampX = (value) => Math.max(24, Math.min(innerWidth - 28, value));
  const clampY = (value) => Math.max(24, Math.min(innerHeight - 76, value));
  const corners = [[left, top], [right, top], [right, bottom], [left, bottom]];
  const edges = [[centerX, top], [right, centerY], [centerX, bottom], [left, centerY]];
  const radius = Math.min(104, Math.max(34, Math.min(innerWidth, innerHeight) * .14));
  agents.forEach((agent, index) => {
    const roleClass = [...agent.classList].find((className) => className.startsWith('mode-'));
    const role = roleClass?.slice(5) || introAgentRoles[index % introAgentRoles.length];
    const roleIndex = roleCounts[role]++;
    const from = agent._point || { x: innerWidth / 2, y: innerHeight / 2 };
    const angle = (Math.PI * 2 * index / Math.max(agents.length, 1)) + (performance.now() / 1200);
    let target;
    if (role === 'writer' && kind === 'text') {
      const ratio = Math.min(.94, .14 + roleIndex * .19);
      target = [writerLeft + writerWidth * ratio, textBounds.top + Math.min(30, textBounds.height * .68)];
    } else if (role === 'dragger') {
      const corner = corners[roleIndex % corners.length];
      target = [corner[0] + (roleIndex % 2 ? -4 : 4), corner[1] + (roleIndex % 2 ? -4 : 4)];
    } else if (role === 'aligner') {
      const edge = edges[roleIndex % edges.length];
      target = [edge[0] + ((roleIndex % 3) - 1) * 4, edge[1] + ((roleIndex % 2) ? 3 : -3)];
    } else {
      const side = roleIndex % 4;
      const offset = 18 + (roleIndex % 3) * 12;
      target = side === 0 ? [centerX + Math.cos(angle) * radius * .38, top - offset]
        : side === 1 ? [right + offset, centerY + Math.sin(angle) * radius * .42]
          : side === 2 ? [centerX + Math.cos(angle) * radius * .4, bottom + offset]
            : [left - offset, centerY + Math.sin(angle) * radius * .42];
    }
    const toX = clampX(target[0]);
    const toY = clampY(target[1]);
    const dx = toX - from.x;
    const dy = toY - from.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const bend = (index % 2 ? 1 : -1) * (16 + (index % 5) * 8);
    const controlX = (from.x + toX) / 2 - (dy / distance) * bend;
    const controlY = (from.y + toY) / 2 + (dx / distance) * bend;
    const startRotation = Math.atan2(dy, dx) * 180 / Math.PI + 45;
    const endRotation = role === 'scout' ? startRotation + ((index % 3) - 1) * 9 : 0;
    const endTransform = `translate3d(${toX}px,${toY}px,0) rotate(${endRotation}deg)`;
    agent.className = `agent mode-${role}`;
    agent.style.color = introColors[index % introColors.length];
    agent.getAnimations().forEach((animation) => animation.cancel());
    agent.style.left = '0px';
    agent.style.top = '0px';
    agent.style.transform = `translate3d(${from.x}px,${from.y}px,0) rotate(${startRotation}deg)`;
    const animation = agent.animate([
      { transform: `translate3d(${from.x}px,${from.y}px,0) rotate(${startRotation}deg) scale(${agent._fresh ? .7 : 1})`, opacity: agent._fresh ? .25 : 1 },
      { transform: `translate3d(${controlX}px,${controlY}px,0) rotate(${(startRotation + endRotation) / 2}deg)`, offset: .55, opacity: 1 },
      { transform: endTransform, opacity: 1 }
    ], { duration: Math.min(480, Math.max(135, moveDuration * 1.5)) + (index % 4) * 18, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
    agent._fresh = false;
    agent._point = { x: toX, y: toY };
    animation.onfinish = () => {
      agent.style.transform = endTransform;
      animation.cancel();
    };
  });
}

function layerElements() {
  const selector = [
    'main h1', 'main h2', 'main h3', 'main p', 'main button', 'main a', 'main img', 'main li', 'main article',
    'main span', 'main strong', 'main b', 'main em', 'main small', 'main label', 'main input', 'main select', 'main textarea',
    'footer h1', 'footer h2', 'footer h3', 'footer p', 'footer a', 'footer button', 'footer span', 'footer strong', 'footer b', 'footer em', 'footer small'
  ].join(',');
  const isVisible = (element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const hasText = Boolean((element.textContent || '').trim());
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
      && (element.tagName !== 'SPAN' || (hasText && !element.closest('.project-art')));
  };
  const targets = new Set($$(selector).filter(isVisible));
  $$('.hero-portrait, .stack-strip, .process-quote, .contact-kicker, .contact-actions, .social-links, .site-footer, .project-art')
    .filter(isVisible)
    .forEach((element) => targets.add(element));
  return [...targets].sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
}

function introLayerKind(element) {
  if (element.dataset.layer) return element.dataset.layer;
  if (element.matches('img,.project-art')) return 'image';
  if (element.matches('article,blockquote,form,.journey-list')) return 'card';
  if (element.matches('button,input,select,textarea')) return 'shape';
  if (element.matches('svg') || element.classList.contains('stack-tile')) return 'logo';
  return 'text';
}

const introTextSelector = 'h1,h2,h3,p,a,button,span,.eyebrow,.step-number,.category-chip,.stage-chip,strong,b,em,small,label';

function introTextLineRects(element) {
  if (!element) return [];
  const range = document.createRange();
  range.selectNodeContents(element);
  const lines = [];
  [...range.getClientRects()].forEach((rect) => {
    if (rect.width < 1 || rect.height < 1) return;
    let line = lines.find((item) => Math.abs(item.top - rect.top) <= 2);
    if (!line) {
      line = { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      lines.push(line);
    } else {
      line.left = Math.min(line.left, rect.left);
      line.right = Math.max(line.right, rect.right);
      line.top = Math.min(line.top, rect.top);
      line.bottom = Math.max(line.bottom, rect.bottom);
    }
  });
  return lines.sort((a, b) => a.top - b.top).map((line) => ({ ...line, width: line.right - line.left, height: line.bottom - line.top }));
}

function introUnitRect(unit) {
  if (Number.isInteger(unit.segmentIndex)) {
    const line = introTextLineRects(unit.element)[unit.segmentIndex];
    if (line) return line;
  }
  return unit.element.getBoundingClientRect();
}

function introTextTargets(element) {
  if (!element || element.matches('input,select,textarea,img,svg')) return [];
  if (element.matches('label')) {
    const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (textNode && !element.querySelector('.intro-type-text')) {
      const text = document.createElement('span');
      text.className = 'intro-type-text';
      text.textContent = textNode.textContent;
      textNode.replaceWith(text);
    }
  }
  const candidates = element.matches('label') ? $$('.intro-type-text', element)
    : element.matches(introTextSelector) ? [element] : $$(introTextSelector, element);
  return candidates.filter((target) => {
    const rect = target.getBoundingClientRect();
    return (target.textContent || '').trim() && rect.width > 0 && rect.height > 0
      && !target.closest('[hidden],.project-art .mock-code,.project-art .mock-chat,.project-art .mock-game');
  }).filter((target, index, all) => !all.some((other, otherIndex) => otherIndex < index && other.contains(target)))
    .slice(0, 3);
}

function introPreferredRole(element) {
  if (element.matches('.brief-form label')) return 'writer';
  if (element.matches('.project-art,.hero-portrait,.system-node,.education-card,.poster-card,.milestones article,.hero-stats > div,.mock-game .pixel-sun,.mock-game .pixel-hill,.mock-mascot,.mock-chat > div,.learn-cards > div')) return 'dragger';
  if (element.matches('.stack-strip,.stack-tile,.skill-group .skill-tags span,.site-footer > *, .social-links > *, .hero-actions .button,.work-toolbar .filter,.contact-actions > *, .carousel-footer > *, .project-stack > span,.mock-top,.mock-wave,.mock-channel > small,.mock-server,.learn-head > span')) return 'aligner';
  if (element.matches('.system-top,.system-log > *, .process-list .step-number,.journey-row > span,.project-card-top > *, .art-kicker,.art-index,.mock-side > *, .mock-game > i,.mock-game > b,.mock-game > small,.mock-channel > b,.mock-channel > div,.mock-command,.learn-search,.learn-head > i,.mock-chat > small')) return 'scout';
  if (element.matches('.mock-code > span,.mock-chat > p,.mock-convo > div:first-child > p,.mock-convo > div:first-child > b,.learn-title,.learn-head > b')) return 'writer';
  return introTextTargets(element).length ? 'writer' : 'scout';
}

function introUnitVisible(unit) {
  const rect = introUnitRect(unit);
  const { safeTop, safeBottom } = introSafeViewport();
  const safeHeight = safeBottom - safeTop;
  const track = unit.element.closest('.project-track');
  if (track) {
    const trackRect = track.getBoundingClientRect();
    const visibleWidth = Math.max(0, Math.min(rect.right, trackRect.right) - Math.max(rect.left, trackRect.left));
    if (visibleWidth / Math.max(1, rect.width) < .72) return false;
  }
  return rect.width >= 16 && rect.height >= 8 && rect.height <= safeHeight * .94
    && rect.top >= safeTop - 2 && rect.bottom <= safeBottom + 2
    && rect.right > 4 && rect.left < innerWidth - 4;
}

function introUnitsSeparated(unit, chosen) {
  const rect = introUnitRect(unit);
  const area = Math.max(1, rect.width * rect.height);
  return chosen.every((other) => {
    const otherRect = introUnitRect(other);
    if (other.element === unit.element && other.segmentIndex === unit.segmentIndex) return false;
    if (other.element !== unit.element && (other.element.contains(unit.element) || unit.element.contains(other.element))) return false;
    const overlapWidth = Math.max(0, Math.min(rect.right, otherRect.right) - Math.max(rect.left, otherRect.left));
    const overlapHeight = Math.max(0, Math.min(rect.bottom, otherRect.bottom) - Math.max(rect.top, otherRect.top));
    const overlap = overlapWidth * overlapHeight;
    const distance = Math.hypot(rect.left + rect.width / 2 - otherRect.left - otherRect.width / 2,
      rect.top + rect.height / 2 - otherRect.top - otherRect.height / 2);
    const sameTextBlock = other.element === unit.element && Number.isInteger(unit.segmentIndex) && Number.isInteger(other.segmentIndex);
    const minDistance = sameTextBlock ? 15 : 38;
    return overlap / Math.max(1, Math.min(area, otherRect.width * otherRect.height)) < .22 && distance >= minDistance;
  });
}

function chooseIntroUnits(candidates, count) {
  if (!candidates.length) return [];
  const chosen = [candidates[0]];
  const groupSelector = '.project-card,.skill-group,.process-list li,.journey-row,.milestones article,.brief-form,.contact-links';
  const groupLimits = new Map([
    ['project-card', 8], ['skill-group', 4], ['process-list li', 2], ['journey-row', 3],
    ['milestones article', 3], ['brief-form', 10], ['contact-links', 10]
  ]);
  const groupFor = (unit) => unit.element.closest(groupSelector);
  const groupLimit = (group) => {
    if (!group) return Infinity;
    const rule = [...groupLimits.keys()].find((selector) => group.matches(`.${selector}`) || group.matches(selector));
    return rule ? groupLimits.get(rule) : Infinity;
  };
  while (chosen.length < count) {
    const counts = new Map();
    chosen.forEach((unit) => {
      const group = groupFor(unit);
      if (group) counts.set(group, (counts.get(group) || 0) + 1);
    });
    const available = candidates.filter((candidate) => {
      if (chosen.includes(candidate) || !introUnitsSeparated(candidate, chosen)) return false;
      const group = groupFor(candidate);
      return !group || (counts.get(group) || 0) < groupLimit(group);
    });
    if (!available.length) break;
    available.sort((a, b) => {
      const rectA = introUnitRect(a);
      const rectB = introUnitRect(b);
      const spread = (rect) => Math.min(...chosen.map((item) => {
        const other = introUnitRect(item);
        return Math.hypot(rect.left + rect.width / 2 - other.left - other.width / 2,
          rect.top + rect.height / 2 - other.top - other.height / 2);
      }));
      return spread(rectB) - spread(rectA) || a.firstLayerIndex - b.firstLayerIndex;
    });
    chosen.push(available[0]);
  }
  return chosen.sort((a, b) => a.firstLayerIndex - b.firstLayerIndex);
}

function animateAgentPath(agent, points, duration) {
  if (!agent || !points.length) return;
  const clampX = (x) => Math.max(24, Math.min(innerWidth - 28, x));
  const clampY = (y) => Math.max(24, Math.min(innerHeight - 76, y));
  const start = agent._point || { x: innerWidth / 2, y: innerHeight / 2 };
  const path = [start, ...points].map((point) => ({ x: clampX(point.x), y: clampY(point.y), rotation: point.rotation || 0 }));
  const frames = path.map((point, index) => ({
    transform: `translate3d(${point.x}px,${point.y}px,0) rotate(${point.rotation}deg)`,
    opacity: 1,
    offset: index / Math.max(1, path.length - 1)
  }));
  const destination = path[path.length - 1];
  const animation = agent.animate(frames, { duration, easing: 'linear', fill: 'forwards' });
  animation.onfinish = () => {
    agent._point = { x: destination.x, y: destination.y };
    agent.style.transform = `translate3d(${destination.x}px,${destination.y}px,0) rotate(${destination.rotation}deg)`;
    animation.cancel();
  };
}

function animateIntroTyping(element, agent, workDuration, task) {
  const targets = introTextTargets(element).slice(0, 2);
  if (!targets.length) return;
  const segmented = Number.isInteger(task.segmentIndex);
  const lineRect = segmented ? introUnitRect({ element, segmentIndex: task.segmentIndex }) : targets[0].getBoundingClientRect();
  const lineCount = segmented ? introTextLineRects(element).length : 1;
  const textLength = segmented ? (element.textContent || '').trim().length / Math.max(1, lineCount) : (targets[0].textContent || '').trim().length;
  const selectionDuration = Math.min(520, Math.max(320, textLength * 6));
  if (task.showFrame !== false) drawIntroSelectionFrame(lineRect, 'writer', selectionDuration + 180);

  const revealTargets = !segmented || task.segmentOrder === 0 ? targets : [];
  revealTargets.forEach((target, index) => {
    const textLength = (target.textContent || '').trim().length;
    const duration = Math.min(560, Math.max(360, textLength * 5));
    const delay = index * 45;
    target.style.setProperty('--typing-duration', `${duration}ms`);
    target.style.setProperty('--typing-delay', `${delay}ms`);
    target.style.setProperty('--typing-steps', `${Math.min(48, Math.max(8, textLength))}`);
    target.classList.remove('build-typing');
    void target.offsetWidth;
    target.classList.add('build-typing');
    scheduleIntroAction(() => {
      target.classList.remove('build-typing');
      target.style.removeProperty('--typing-duration');
      target.style.removeProperty('--typing-delay');
      target.style.removeProperty('--typing-steps');
    }, delay + duration + 120);
  });

  const y = lineRect.top + Math.min(lineRect.height * .68, 20);
  const points = [0, .28, .56, .82, 1].map((progress) => ({
    x: lineRect.left + 4 + Math.max(0, lineRect.width - 8) * progress, y, rotation: -18
  }));
  animateAgentPath(agent, points, Math.min(workDuration + 180, selectionDuration));
}

function animateIntroTask(task, agent, workDuration) {
  const { element, role } = task;
  const rect = introUnitRect(task.unit);
  if (role === 'writer') {
    animateIntroTyping(element, agent, workDuration, task);
    return;
  }
  if (task.showFrame !== false) drawIntroSelectionFrame(rect, role, role === 'dragger' ? 440 : 360);
  const point = (x, y, rotation = 0) => ({ x: rect.left + rect.width * x, y: rect.top + rect.height * y, rotation });
  const motion = role === 'dragger' ? ['build-drag-settle', 440]
    : role === 'aligner' ? ['build-align-settle', 280] : role === 'scout' ? ['build-scan-settle', 360] : null;
  if (motion) {
    element.classList.remove(motion[0]);
    void element.offsetWidth;
    element.classList.add(motion[0]);
    scheduleIntroAction(() => element.classList.remove(motion[0]), motion[1]);
  }
  if (role === 'dragger') {
    setAgentGrabState(agent, true);
    scheduleIntroAction(() => setAgentGrabState(agent, false), 380);
  }
  const paths = {
    dragger: [point(.12, .16, -15), point(.54, .52, 8), point(.84, .78, 0)],
    aligner: [point(.08, .18, 0), point(.91, .18, 0), point(.91, .82, 90)],
    scout: [point(.08, .34, 0), point(.9, .34, 0), point(.08, .68, 0), point(.9, .68, 0)]
  };
  animateAgentPath(agent, paths[role], Math.min(workDuration + 140, role === 'scout' ? 300 : 360));
}

function runIntroBatch() {
  if (!introActive) return;
  clearTimeout(introTimer);
  introTimer = null;
  const pending = introSceneUnits.filter((unit) => !introCompletedUnits.has(unit));
  if (!pending.length) { finishIntro(true); return; }

  const visible = pending.filter(introUnitVisible);
  if (!visible.length) {
    const activeWork = introWorkUntil - performance.now();
    if (activeWork > 24) {
      introTimer = setTimeout(runIntroBatch, activeWork + 28);
      return;
    }
    const next = pending[0];
    const rect = introUnitRect(next);
    if (!introTour) { finishIntro(false); return; }
    const trackDestination = introTrackScrollDestination(next);
    if (trackDestination && scrollIntroTrackToUnit(next, trackDestination)) return;
    let target = introScrollDestination(next);
    if (target === null && (rect.bottom <= 0 || rect.top >= innerHeight)) {
      target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight,
        scrollY + rect.top - introSafeViewport().safeTop));
    }
    if (target !== null && scrollIntroToUnit(next, target)) return;
    visible.push(next);
  }

  const first = visible[0];
  const section = first.element.closest('[data-section]')?.dataset.section || 'Footer';
  const desiredCount = Math.min(innerWidth <= 640 ? 10 : 28, introAgentCountForStep(first.firstLayerIndex, section));
  const selectedUnits = chooseIntroUnits(visible, Math.max(1, desiredCount));
  const roleOrder = [...introAgentRoles.slice(introBatchNumber % introAgentRoles.length), ...introAgentRoles.slice(0, introBatchNumber % introAgentRoles.length)];
  const assignments = selectedUnits.map((unit) => ({ unit, primary: true }));
  if (assignments.length === 1) {
    const soleRole = introPreferredRole(assignments[0].unit.element);
    roleOrder.filter((role) => role !== soleRole).slice(0, 3).forEach((helperRole) => assignments.push({ unit: assignments[0].unit, primary: false, helperRole }));
  }
  const usedRoles = new Set();
  const tasks = assignments.map(({ unit, primary, helperRole }, index) => {
    const preferred = introPreferredRole(unit.element);
    const assignedRole = helperRole || (Number.isInteger(unit.segmentIndex) ? 'writer' : !usedRoles.has(preferred) ? preferred
      : roleOrder.find((candidate) => !usedRoles.has(candidate)) || roleOrder[index % roleOrder.length]);
    usedRoles.add(assignedRole);
    return { unit, element: unit.element, layers: primary ? unit.layers : [], firstLayerIndex: unit.firstLayerIndex,
      segmentIndex: unit.segmentIndex, segmentOrder: unit.segmentOrder, segmentCount: unit.segmentCount,
      showFrame: primary, role: assignedRole, kind: assignedRole === 'writer' ? 'text' : introLayerKind(unit.element) };
  });
  if (!tasks.length) { finishIntro(false); return; }
  ensureAgentCount(tasks.length);
  const agents = $$('.agent:not(.retiring)');
  const actionLabels = { writer: 'TYPE', dragger: 'MOVE', aligner: 'ALIGN', scout: 'SCAN' };
  const activeActions = [...new Set(tasks.map((task) => actionLabels[task.role]))];
  $('.hud-state').innerHTML = `<i></i> ${activeActions.join(' \u00b7 ')}`;
  const workDuration = 360 / introSpeed;
  tasks.forEach((task, index) => {
    const agent = agents[index];
    const rect = introUnitRect(task.unit);
    const textRect = task.role === 'writer' ? rect : introTextTargets(task.element)[0]?.getBoundingClientRect() || null;
    setAgentRole(agent, task.role, index + introBatchNumber);
    flyAgentsTo(rect, task.kind, textRect, 120 / introSpeed, [agent]);
    const actionDelay = 105 / introSpeed;
    const actionLength = task.role === 'writer' ? Math.min(700, Math.max(480, (task.element.textContent || '').trim().length * 5 + 160))
      : task.role === 'dragger' ? 440 : task.role === 'aligner' ? 280 : 360;
    introWorkUntil = Math.max(introWorkUntil, performance.now() + actionDelay + actionLength);
    scheduleIntroAction(() => animateIntroTask(task, agent, workDuration), actionDelay);
  });
  if (introSound && introAudio) {
    const oscillator = introAudio.createOscillator(); const gain = introAudio.createGain();
    oscillator.frequency.value = 430 + (introBatchNumber % 5) * 65; gain.gain.value = .016;
    oscillator.connect(gain); gain.connect(introAudio.destination); oscillator.start(); oscillator.stop(introAudio.currentTime + .045);
  }

  const batchDelay = (250 + tasks.length * 3.5) / introSpeed;
  introTimer = setTimeout(() => {
    if (!introActive) return;
    tasks.forEach((task) => {
      introCompletedUnits.add(task.unit);
      introProcessedCount += task.layers.length;
    });
    $('.hud-progress').textContent = `${String(introProcessedCount).padStart(2, '0')} / ${String(introLayers.length).padStart(2, '0')} LAYERS`;
    $('.hud-meter i').style.width = `${(introProcessedCount / Math.max(1, introLayers.length)) * 100}%`;
    introBatchNumber += 1;
    runIntroBatch();
  }, batchDelay);
}

function syncReplayButtonVisibility() {
  if (innerWidth > 640) return;
  const replay = $('#build-replay');
  const swarm = $('#swarm');
  const homeRange = Math.max(120, innerHeight * .35);
  replay.hidden = introActive || swarm.classList.contains('active') || scrollY > homeRange;
}

function finishIntro(timelineComplete = false) {
  if (!introActive) return;
  cancelIntroScroll();
  introActive = false; clearTimeout(introTimer); introTimer = null;
  clearTimeout(introPreludeTimer); introPreludeTimer = null;
  clearTimeout(introFailSafe); introFailSafe = null;
  clearTimeout(swarmHideTimer); swarmHideTimer = null;
  clearIntroEffects();
  $$('.agent.is-grabbing').forEach((agent) => setAgentGrabState(agent, false));
  $$('.build-drag-settle,.build-align-settle,.build-scan-settle').forEach((element) => {
    element.classList.remove('build-drag-settle', 'build-align-settle', 'build-scan-settle');
  });
  const swarm = $('#swarm'); swarm.classList.remove('prelude');
  document.body.classList.remove('build-intro-active');
  sessionStorage.setItem('mohieth-swarm-seen', '1');
  $('#build-replay').hidden = false;
  if (!timelineComplete) {
    swarm.classList.remove('active', 'done');
    syncReplayButtonVisibility();
    return;
  }
  $('#build-replay').hidden = true;
  swarm.classList.add('done');
  const finalAgentCount = innerWidth <= 640 ? 2 : 3;
  ensureAgentCount(finalAgentCount);
  $('.hud-progress').textContent = `${String(introLayers.length).padStart(2, '0')} / ${String(introLayers.length).padStart(2, '0')} LAYERS`;
  $('.hud-meter i').style.width = '100%';
  $('.hud-skip').hidden = true; $('.hud-replay').hidden = false;
  $('.hud-live').hidden = false;
  const duration = ((performance.now() - introStart) / 1000).toFixed(1);
  $('.hud-state').innerHTML = `<i></i> REBUILT BY ${String(Math.max(finalAgentCount, introPeakAgentCount)).padStart(2, '0')} AGENTS IN ${duration}S`;
  swarmHideTimer = setTimeout(() => { swarm.classList.remove('active'); $('#build-replay').hidden = false; syncReplayButtonVisibility(); swarmHideTimer = null; }, 3100);
}

function startIntro(force = false) {
  if (motionOff) { $('#build-replay').hidden = false; syncReplayButtonVisibility(); return; }
  if (!force && sessionStorage.getItem('mohieth-swarm-seen')) { $('#build-replay').hidden = false; syncReplayButtonVisibility(); return; }
  cancelIntroScroll();
  clearIntroEffects();
  introWorkUntil = 0;
  window.scrollTo({ top: 0, behavior: 'instant' });
  $('.project-track')?.scrollTo({ left: 0, behavior: 'instant' });
  const swarm = $('#swarm'); introLayers = layerElements(); const layers = introLayers;
  cacheIntroSectionRanges(layers);
  cacheIntroSceneUnits(layers);
  if (!layers.length) return;
  clearTimeout(swarmHideTimer); swarmHideTimer = null;
  clearTimeout(introPreludeTimer); clearTimeout(introFailSafe); clearTimeout(introTimer);
  introActive = true; introStart = performance.now(); introTour = true; introSpeed = 3;
  document.body.classList.add('build-intro-active');
  swarm.classList.remove('done'); swarm.classList.add('active', 'prelude');
  const openingCount = 2;
  introPeakAgentCount = openingCount;
  $('.agents').innerHTML = Array.from({ length: openingCount }, (_, index) => agentMarkup(index)).join('');
  $('.hud-agents').textContent = `${String(openingCount).padStart(2, '0')} AGENTS`; $('.hud-progress').textContent = `00 / ${String(layers.length).padStart(2, '0')} LAYERS`;
  $('.hud-meter i').style.width = '0%'; $('.hud-state').innerHTML = '<i></i> SCANNING PAGE\u2026'; $('.hud-skip').hidden = false; $('.hud-replay').hidden = true; $('.hud-live').hidden = true; $('.hud-skip').textContent = 'SKIP INTRO \u00d7'; $('.hud-speed').textContent = '3\u00d7'; $('.hud-tour').textContent = 'TOUR ON';
  setAgentsAt(innerWidth / 2, innerHeight / 2);
  introPreludeTimer = setTimeout(() => {
    if (!introActive) return;
    swarm.classList.remove('prelude');
    runIntroBatch();
  }, 500);
  introFailSafe = setTimeout(() => { if (introActive) finishIntro(false); }, 130000);
  $('#build-replay').hidden = true;
}

function initSwarm() {
  $('.hud-skip').addEventListener('click', () => finishIntro(false));
  $('.hud-live').addEventListener('click', () => { $('#swarm').classList.remove('active'); $('#build-replay').hidden = false; syncReplayButtonVisibility(); });
  $('.hud-replay').addEventListener('click', () => startIntro(true));
  $('#build-replay').addEventListener('click', () => startIntro(true));
  $('.hud-tour').addEventListener('click', (event) => { introTour = !introTour; event.currentTarget.textContent = introTour ? 'TOUR ON' : 'TOUR OFF'; });
  $('.hud-speed').addEventListener('click', (event) => { const speeds = [1, 2, 3, 4, .5]; introSpeed = speeds[(speeds.indexOf(introSpeed) + 1) % speeds.length]; event.currentTarget.textContent = `${introSpeed}\u00d7`; });
  $('.hud-sound').addEventListener('click', async (event) => {
    introSound = !introSound; event.currentTarget.textContent = `SOUND ${introSound ? 'ON' : 'OFF'}`;
    if (introSound && !introAudio) { const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (AudioContextClass) { introAudio = new AudioContextClass(); await introAudio.resume(); } else { introSound = false; event.currentTarget.textContent = 'SOUND OFF'; announce('Web Audio is unavailable'); } }
  });
  window.addEventListener('scroll', syncReplayButtonVisibility, { passive: true });
  window.addEventListener('resize', syncReplayButtonVisibility);
  window.addEventListener('error', () => { if (introActive) finishIntro(false); });
  window.addEventListener('unhandledrejection', () => { if (introActive) finishIntro(false); });
  window.addEventListener('keydown', (event) => { if (introActive && !introKeyboardUsed && event.key !== 'Tab') { introKeyboardUsed = true; finishIntro(false); } });
  let introKeyboardUsed = false;
  setTimeout(() => startIntro(false), 500);
}

function runEasterEgg() {
  const count = innerWidth <= 640 ? 8 : 19;
  $('.agents').innerHTML = Array.from({ length: count }, (_, index) => agentMarkup(index)).join('');
  ensureAgentCount(count);
  $('#swarm').classList.add('active');
  setAgentsAt(innerWidth * .5, innerHeight * .45, true);
  setTimeout(() => { if (!introActive) $('#swarm').classList.remove('active'); }, 1800);
}

function init() {
  renderContent(); initMenu(); initFilters(); initModal(); initContact(); initFeatureToggle(); initScroll(); initVisuals(); initPalette(); initPreferences(); initSwarm();
  updateClock(); setInterval(updateClock, 30000);
}

init();
