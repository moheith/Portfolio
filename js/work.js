/* js/work.js — project cards (code posters), filters with FLIP, fuzzy search, slider (drag + inertia), 3D tilt, cinema modal. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const building = () => window.Swarm && Swarm.state === 'building';
  const motionOff = () => document.documentElement.dataset.motion === 'off';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let list, cardsEl, empty, input, searchBox, tabsEl, line;
  let filter = 'All', query = '';
  let cinema = null, current = -1, lastFocus = null;

  /* the generated "code poster": hue per project, dot grid, giant initials, up to three tech chips */
    const getPosterVisual = (slug, p) => {
        switch (slug) {
          case 'yulya-discord-bot':
            return `
              <div class="p-vis p-vis--discord">
                <div class="p-vis__bar">
                  <span class="p-vis__badge">● Yulya#0001 [BOT]</span>
                  <span class="p-vis__voice">🎙️ Voice WebRTC</span>
                </div>
                <div class="p-vis__chat">
                  <div class="p-chat-bubble p-chat-user"><span class="p-cmd">/research</span> quantum computing</div>
                  <div class="p-chat-bubble p-chat-bot"><span class="p-bot-name">Yulya:</span> 4 papers synthesized · 8-qubit coherent state.</div>
                </div>
                <div class="p-vis__market">
                  <span class="p-coin">YULYA/COIN $4.20</span>
                  <span class="p-gain">+18.4% ▲</span>
                </div>
              </div>
            `;
          case 'yulya-studio':
            return `
              <div class="p-vis p-vis--studio">
                <div class="p-vis__bar">
                  <span class="p-vis__dots"><i class="r"></i><i class="y"></i><i class="g"></i></span>
                  <span class="p-vis__title">YULYA STUDIO · MONACO IDE</span>
                  <span class="p-vis__run">RUN ▶</span>
                </div>
                <div class="p-studio-split">
                  <div class="p-code-block">
                    <code><span class="kw">import</span> { Engine } <span class="kw">from</span> <span class="str">'@yulya'</span>;</code>
                    <code><span class="kw">const</span> game = <span class="kw">new</span> <span class="fn">Engine</span>();</code>
                    <code>game.<span class="fn">spawnPlayer</span>({ x: 120 });</code>
                  </div>
                  <div class="p-canvas-preview">
                    <div class="p-preview-stars"></div>
                    <div class="p-preview-ship"></div>
                  </div>
                </div>
              </div>
            `;
          case 'yulya-model-family':
            return `
              <div class="p-vis p-vis--model">
                <div class="p-vis__bar">
                  <span class="p-vis__hf">🤗 HUGGING FACE · GGUF</span>
                  <span class="p-vis__tag">8B MODEL</span>
                </div>
                <div class="p-model-name">Llama-3-Yulya-8B-Instruct</div>
                <div class="p-model-bars">
                  <span style="height:45%"></span>
                  <span style="height:70%"></span>
                  <span style="height:90%"></span>
                  <span style="height:60%"></span>
                  <span style="height:85%"></span>
                  <span style="height:75%"></span>
                  <span style="height:100%"></span>
                </div>
                <div class="p-model-log">llama.cpp: 33 layers offloaded to GPU · 128 tok/s</div>
              </div>
            `;
          case 'desktop-ai-companion':
            return `
              <div class="p-vis p-vis--companion">
                <div class="p-vis__bar">
                  <span class="p-vis__title">● DESKTOP COMPANION</span>
                  <span class="p-vis__pill">TRANSPARENT</span>
                </div>
                <div class="p-companion-body">
                  <div class="p-avatar-holo">
                    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
                      <circle cx="24" cy="20" r="14" fill="none" stroke="#7dd3fc" stroke-width="1.8"/>
                      <circle cx="20" cy="18" r="2" fill="#7dd3fc"/>
                      <circle cx="28" cy="18" r="2" fill="#7dd3fc"/>
                      <path d="M21 24 Q24 27 27 24" fill="none" stroke="#7dd3fc" stroke-width="1.5"/>
                      <path d="M12 38 Q24 30 36 38" fill="none" stroke="#7dd3fc" stroke-width="1.8"/>
                    </svg>
                  </div>
                  <div class="p-companion-wave">
                    <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                  </div>
                </div>
                <div class="p-vis__meta">● Ollama (llama3:8b local) · whisper.cpp STT</div>
              </div>
            `;
          case 'yulya-api':
            return `
              <div class="p-vis p-vis--api">
                <div class="p-vis__bar">
                  <span class="p-api-endpoint">POST /v1/embeddings</span>
                  <span class="p-api-status">200 OK</span>
                </div>
                <div class="p-api-nodes">
                  <div class="p-grid-mesh">
                    <i class="p-n"></i><i class="p-n act"></i><i class="p-n"></i><i class="p-n act"></i>
                    <i class="p-n act"></i><i class="p-n"></i><i class="p-n act"></i><i class="p-n"></i>
                    <i class="p-n"></i><i class="p-n act"></i><i class="p-n"></i><i class="p-n act"></i>
                  </div>
                </div>
                <div class="p-vis__meta">1536 dims float32 · 12ms latency · FastAPI</div>
              </div>
            `;
          case 'neural-deck':
            return `
              <div class="p-vis p-vis--deck">
                <div class="p-vis__bar">
                  <span class="p-vis__title">NEURAL DASHBOARD</span>
                  <span class="p-vis__pill">12 SHARDS</span>
                </div>
                <div class="p-deck-chart">
                  <span class="c-bar g" style="height:60%"></span>
                  <span class="c-bar r" style="height:40%"></span>
                  <span class="c-bar g" style="height:75%"></span>
                  <span class="c-bar g" style="height:90%"></span>
                  <span class="c-bar r" style="height:50%"></span>
                  <span class="c-bar g" style="height:85%"></span>
                </div>
                <div class="p-vis__meta">Live command ledger · 99.98% uptime</div>
              </div>
            `;
          case 'mascot-live2d-art':
            return `
              <div class="p-vis p-vis--art">
                <div class="p-vis__bar">
                  <span class="p-vis__title">KRITA & LIVE2D CUBISM</span>
                  <span class="p-vis__pill">RIGGED</span>
                </div>
                <div class="p-art-mesh">
                  <div class="p-mesh-box">
                    <span class="p-dot"></span><span class="p-dot"></span><span class="p-dot"></span>
                    <span class="p-dot"></span><span class="p-dot"></span><span class="p-dot"></span>
                  </div>
                </div>
                <div class="p-vis__meta">Angle X: +12° · EyeOpen: 1.0 · Physics applied</div>
              </div>
            `;
          case 'mascot-website':
            return `
              <div class="p-vis p-vis--web">
                <div class="p-vis__bar">
                  <span class="p-url">https://mascot.yulya.me</span>
                </div>
                <div class="p-web-hero">
                  <span class="p-web-title">MEET THE MASCOT</span>
                  <span class="p-web-btn">DOWNLOAD FREE ↗</span>
                </div>
                <div class="p-vis__meta">Responsive showcase template</div>
              </div>
            `;
          case 'unity-blender':
            return `
              <div class="p-vis p-vis--unity">
                <div class="p-vis__bar">
                  <span class="p-vis__title">UNITY & BLENDER VIEWPORT</span>
                  <span class="p-vis__pill">3D</span>
                </div>
                <div class="p-unity-gizmo">
                  <div class="p-axis"><span class="ax-x">X</span><span class="ax-y">Y</span><span class="ax-z">Z</span></div>
                  <div class="p-isometric-box"></div>
                </div>
                <div class="p-vis__meta">DirectX 12 / PBR shaders / Low-poly assets</div>
              </div>
            `;
          case 'yulya-space':
            return `
              <div class="p-vis p-vis--space">
                <div class="p-vis__bar">
                  <span class="p-vis__hf">🤗 LIVE SPACE</span>
                  <span class="p-vis__pill">T4 GPU</span>
                </div>
                <div class="p-space-content">
                  <span class="p-space-sub">Hugging Face Live Interactive Demo</span>
                  <span class="p-space-action">TRY IN BROWSER ↗</span>
                </div>
                <div class="p-vis__meta">Zero-install browser execution · 114 tok/s</div>
              </div>
            `;
          case 'college-project':
          default:
            return `
              <div class="p-vis p-vis--college">
                <div class="p-vis__bar">
                  <span class="p-vis__title">LEARNEXA 2.0</span>
                  <span class="p-vis__pill">FULL STACK</span>
                </div>
                <div class="p-college-arch">
                  <span>Next.js Frontend</span>
                  <i>➔</i>
                  <span>Flask API</span>
                  <i>➔</i>
                  <span>SQLite</span>
                </div>
                <div class="p-vis__meta">BCA Capstone · TF-IDF skill recommendation</div>
              </div>
            `;
        }
      };

  function decoratePoster(poster, p, i) {
    poster.style.setProperty('--h', (i * 47) % 360);
    poster.dataset.ini = p.title.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
    poster.textContent = '';
    const visual = getPosterVisual(p.slug, p);
    if (visual) {
      poster.innerHTML = visual;
    }
    const chips = document.createElement('span'); chips.className = 'card__chips';
    p.tech.slice(0, 3).forEach((t) => { const c = document.createElement('i'); c.textContent = t.toUpperCase(); chips.appendChild(c); });
    poster.appendChild(chips);
  }
  /* if assets/img/work-NN.jpg exists and loads, it replaces the poster (never a broken-image icon) */
  function tryImage(media, p, poster) {
    if (!p.img) return;
    const im = new Image(); im.decoding = 'async'; im.alt = p.title; im.loading = 'lazy';
    im.onload = () => { if (!media.isConnected) return; media.appendChild(im); if (poster && poster.parentNode === media) poster.remove(); };
    im.onerror = () => { /* keep the code poster */ };
    im.src = p.img;
  }
  function buildCard(p, i) {
    const li = document.createElement('li'); li.className = 'card'; li.dataset.slug = p.slug; li.dataset.cats = p.cats.join('|');
    li.innerHTML = '<a class="card__link" href="#work/' + esc(p.slug) + '"><figure class="card__media"><span class="card__poster" aria-hidden="true"></span></figure>' +
      '<span class="card__tagwrap"><i class="card__chip-rule"></i><span class="card__tag">' + esc(p.tag) + '</span></span>' +
      '<div class="card__row"><b class="card__num">' + esc(p.n) + '</b><div class="card__titles"><h3 class="card__title">' + esc(p.title) + '</h3><p class="card__meta">' + esc(p.meta) + '</p></div><i class="card__arrow">↗</i></div></a>';
    return li;
  }

  const Work = {
    /* 2. rebuild cards 4..N from CONTENT.projects; decorate the first three (they keep their swarm layers) */
    init() {
      cardsEl = $('#cards'); if (!cardsEl) return;
      const P = CONTENT.projects;
      $$('.card:not([data-layer])', cardsEl).forEach((c) => c.remove());
      P.forEach((p, i) => { if (i >= 3) cardsEl.appendChild(buildCard(p, i)); });
      list = $$('.card', cardsEl);
      list.forEach((li, i) => {
        const p = P[i]; if (!p) return;
        const media = $('.card__media', li), poster = $('.card__poster', li);
        decoratePoster(poster, p, i); tryImage(media, p, poster);
      });
      empty = document.createElement('p'); empty.className = 'work__empty'; empty.textContent = 'No projects match.'; empty.hidden = true;
      cardsEl.insertAdjacentElement('afterend', empty);
      tabsEl = $('.tabs'); line = $('.tabs__line'); input = $('.work__search input'); searchBox = $('.work__search');
      Work.bindTabs(); Work.bindSearch(); Work.bindSlider(); Work.bindTilt();
      Work.buildDots(); Work.layout();
      window.addEventListener('resize', () => { Work.layout(); Work.buildDots(); });
    },
    /* put the red tab line under the active tab (called after fonts are ready too) */
    layout() {
      if (!tabsEl || !line) return;
      const a = $('.tab.is-active', tabsEl); if (!a) return;
      line.style.width = a.offsetWidth + 'px'; line.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    },
    afterBuild() { Work.layout(); Work.buildDots(); Work.updateCount(); Work.updateButtons(); },
    visibleCards() { return list.filter((c) => !c.hidden); },
    updateCount() {
      const el = $('.work__count'); if (!el || building()) return;
      const t = 'SEE ALL (' + Work.visibleCards().length + ') •'; el.textContent = t; el.dataset.full = t;
    },
    /* ---------- filters (FLIP) ---------- */
    bindTabs() {
      $$('.tab', tabsEl).forEach((tab) => tab.addEventListener('click', () => {
        if (building()) return;
        $$('.tab', tabsEl).forEach((t) => { const on = t === tab; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
        filter = tab.dataset.filter; Work.layout(); Work.apply();
      }));
      tabsEl.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const t = $$('.tab', tabsEl), i = t.indexOf(document.activeElement); if (i < 0) return;
        const n = t[(i + (e.key === 'ArrowRight' ? 1 : -1) + t.length) % t.length]; n.focus(); n.click();
      });
    },
    matches(li, i) {
      const p = CONTENT.projects[i];
      const catOk = filter === 'All' || li.dataset.cats.split('|').includes(filter);
      return catOk && (!query || Work.fuzzy(p, query).ok);
    },
    /* fuzzy: the letters of the query must appear in order in title + tag + tech */
    fuzzy(p, q) {
      const hay = (p.title + ' ' + p.tag + ' ' + p.tech.join(' ') + ' ' + p.cats.join(' ')).toLowerCase();
      const ql = q.toLowerCase().replace(/\s+/g, ' ').trim(); let pos = 0;
      for (const ch of ql) { const k = hay.indexOf(ch, pos); if (k < 0) return { ok: false }; pos = k + 1; }
      // letters to highlight inside the title only
      const t = p.title.toLowerCase(), marks = []; let j = 0;
      for (const ch of ql) { if (ch === ' ') continue; const k = t.indexOf(ch, j); if (k < 0) break; marks.push(k); j = k + 1; }
      return { ok: true, marks };
    },
    apply() {
      const first = new Map();
      list.forEach((li) => { if (!li.hidden) first.set(li, li.getBoundingClientRect()); });
      const next = list.map((li, i) => Work.matches(li, i));
      list.forEach((li, i) => { li.hidden = !next[i]; });
      empty.hidden = next.some(Boolean);
      // FLIP: remaining cards glide to their new place, new ones fade in (0.5 s)
      if (!motionOff() && li0().animate) {
        list.forEach((li) => {
          if (li.hidden) return;
          const a = first.get(li), b = li.getBoundingClientRect();
          if (a) { const dx = a.left - b.left, dy = a.top - b.top; if (dx || dy) li.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' }); }
          else li.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' });
        });
      }
      cardsEl.scrollTo({ left: 0 });
      Work.highlight(); Work.updateCount(); Work.buildDots(); Work.updateButtons();
    },
    /* matched letters of the title turn red (only after the build; the title is restored when the search is cleared) */
    highlight() {
      if (building()) return;
      list.forEach((li, i) => {
        const h = $('.card__title', li), p = CONTENT.projects[i]; if (!h || !p) return;
        const r = query ? Work.fuzzy(p, query) : null;
        if (r && r.ok && r.marks.length) {
          const s = new Set(r.marks);
          h.innerHTML = [...p.title].map((ch, k) => (s.has(k) ? '<mark>' + esc(ch) + '</mark>' : esc(ch))).join('');
        } else if (h.querySelector('mark')) h.textContent = p.title;
      });
    },
    bindSearch() {
      if (!input) return;
      input.addEventListener('input', () => {
        if (building()) { input.value = ''; return; }
        query = input.value.trim(); searchBox.classList.toggle('has-text', !!input.value); Work.apply();
      });
      input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { input.value = ''; input.dispatchEvent(new Event('input')); } });
    },
    /* ---------- slider: scroll-snap + mouse drag with inertia + arrows + dots ---------- */
    perView() { const c = Work.visibleCards()[0]; if (!c) return 1; return Math.max(1, Math.round(cardsEl.offsetWidth / (c.offsetWidth + 24))); },
    step() { const c = Work.visibleCards()[0]; return c ? c.offsetWidth + (parseFloat(getComputedStyle(cardsEl).columnGap) || 24) : 300; },
    buildDots() {
      const box = $('.slider__dots'); if (!box || !cardsEl) return;
      const pages = Math.max(1, Math.ceil(Work.visibleCards().length / Work.perView()));
      if (box.children.length !== pages) {
        box.textContent = '';
        for (let i = 0; i < pages; i++) { const d = document.createElement('i'); d.addEventListener('click', () => { if (!building()) cardsEl.scrollTo({ left: i * Work.perView() * Work.step(), behavior: motionOff() ? 'auto' : 'smooth' }); }); box.appendChild(d); }
      }
      Work.updateButtons();
    },
    updateButtons() {
      if (!cardsEl) return;
      const prev = $('[data-layer-id="work.prev"]'), next = $('[data-layer-id="work.next"]');
      const max = cardsEl.scrollWidth - cardsEl.offsetWidth - 2;
      if (prev) prev.disabled = cardsEl.scrollLeft <= 2; if (next) next.disabled = cardsEl.scrollLeft >= max;
      const dots = $$('.slider__dots i'), pg = Math.round(cardsEl.scrollLeft / (Work.step() * Work.perView()));
      dots.forEach((d, i) => d.classList.toggle('is-on', i === Math.min(pg, dots.length - 1)));
    },
    bindSlider() {
      const prev = $('[data-layer-id="work.prev"]'), next = $('[data-layer-id="work.next"]');
      const go = (dir) => { if (building()) return; cardsEl.scrollBy({ left: dir * Work.step(), behavior: motionOff() ? 'auto' : 'smooth' }); };
      prev && prev.addEventListener('click', () => go(-1)); next && next.addEventListener('click', () => go(1));
      cardsEl.addEventListener('scroll', () => Work.updateButtons(), { passive: true });
      // mouse drag with inertia (touch uses native scrolling)
      let down = false, sx = 0, sl = 0, moved = 0, vx = 0, lx = 0, raf = 0;
      cardsEl.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button !== 0 || building()) return; down = true; moved = 0; sx = e.clientX; sl = cardsEl.scrollLeft; lx = e.clientX; vx = 0; cancelAnimationFrame(raf); });
      window.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
        if (moved > 5) cardsEl.classList.add('is-dragging');
        cardsEl.scrollLeft = sl - dx; vx = e.clientX - lx; lx = e.clientX;
      });
      const end = () => {
        if (!down) return; down = false;
        const glide = () => { if (Math.abs(vx) < 0.5) { cardsEl.classList.remove('is-dragging'); return; } cardsEl.scrollLeft -= vx; vx *= 0.93; raf = requestAnimationFrame(glide); };
        if (moved > 5) glide(); else cardsEl.classList.remove('is-dragging');
      };
      window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
      cardsEl.addEventListener('click', (e) => { if (moved > 5) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
      // card links open the cinema modal
      cardsEl.addEventListener('click', (e) => {
        const a = e.target.closest('.card__link'); if (!a || e.defaultPrevented) return;
        e.preventDefault(); if (building()) return;
        Work.open(a.parentElement.dataset.slug, true);
      });
    },
    /* ---------- 3D tilt ±6° following the mouse ---------- */
    bindTilt() {
      if (!matchMedia('(hover:hover)').matches) return;
      cardsEl.addEventListener('mousemove', (e) => {
        if (motionOff() || building()) return;
        const a = e.target.closest('.card__link'); if (!a) return;
        const r = a.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        a.style.transition = 'transform .12s linear';
        a.style.transform = `perspective(900px) rotateY(${(px * 12).toFixed(2)}deg) rotateX(${(-py * 12).toFixed(2)}deg)`;
      });
      cardsEl.addEventListener('mouseout', (e) => { const a = e.target.closest('.card__link'); if (a && !a.contains(e.relatedTarget)) { a.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)'; a.style.transform = ''; } });
    },
    /* ---------- cinema modal (project modal) ---------- */
    buildModal() {
      if (cinema) return cinema;
      const el = document.createElement('div'); el.className = 'cinema'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Project details'); el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<i class="cinema__bar cinema__bar--t"></i><i class="cinema__bar cinema__bar--b"></i>' +
        '<span class="cinema__count" aria-hidden="true"></span><button class="cinema__close" type="button" aria-label="Close project">×</button>' +
        '<button class="cinema__nav cinema__nav--p" type="button" aria-label="Previous project">‹</button><button class="cinema__nav cinema__nav--n" type="button" aria-label="Next project">›</button>' +
        '<div class="cinema__stage"><div class="cinema__media"></div><div class="cinema__info"><p class="eyebrow"></p><h2 class="cinema__title"></h2><p class="cinema__meta"></p><p class="cinema__desc"></p><div class="cinema__tech"></div><div class="cinema__links"></div></div></div>';
      document.body.appendChild(el);
      $('.cinema__close', el).addEventListener('click', () => Work.close());
      $('.cinema__nav--p', el).addEventListener('click', () => Work.go(-1));
      $('.cinema__nav--n', el).addEventListener('click', () => Work.go(1));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.preventDefault(); Work.close(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); Work.go(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); Work.go(-1); }
        else if (e.key === ' ' && !e.target.closest('button, a, input')) { const v = $('video', el); if (v) { e.preventDefault(); v.paused ? v.play() : v.pause(); } }
        else if (e.key === 'Tab') {
          const f = $$('button, a[href], input, video[controls]', el).filter((x) => !x.disabled && x.offsetParent !== null); if (!f.length) return;
          const a = f[0], b = f[f.length - 1];
          if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); } else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
        }
      });
      Cursor && Cursor.refresh && Cursor.refresh();
      cinema = el; return el;
    },
    fill(i) {
      const p = CONTENT.projects[i]; if (!p) return; current = i;
      const el = cinema;
      $('.cinema__count', el).textContent = p.n + ' / ' + String(CONTENT.projects.length).padStart(2, '0');
      $('.eyebrow', el).textContent = p.tag; $('.cinema__title', el).textContent = p.title;
      $('.cinema__meta', el).textContent = p.meta; $('.cinema__desc', el).textContent = p.desc;
      const tech = $('.cinema__tech', el); tech.textContent = '';
      p.tech.forEach((t) => { const c = document.createElement('span'); c.className = 'chip'; c.textContent = t; tech.appendChild(c); });
      const links = $('.cinema__links', el); links.textContent = '';
      if (p.live) { const a = document.createElement('a'); a.className = 'btn'; a.href = p.live; a.target = '_blank'; a.rel = 'noopener'; a.innerHTML = 'LIVE <span class="arr">↗</span>'; links.appendChild(a); }
      if (p.repo) { const a = document.createElement('a'); a.className = 'btn btn--ghost'; a.href = p.repo; a.target = '_blank'; a.rel = 'noopener'; a.innerHTML = 'GITHUB <span class="arr">↗</span>'; links.appendChild(a); }
      // media: a video if the project has one, else the image if it loads, else the generated code poster
      const media = $('.cinema__media', el); media.textContent = '';
      if (p.video && /\.(mp4|webm)$/i.test(p.video)) {
        const v = document.createElement('video'); v.src = p.video; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none'; media.appendChild(v);
        const ctl = document.createElement('div'); ctl.className = 'vctl'; ctl.innerHTML = '<button type="button" aria-label="Play or pause">▶</button><input type="range" min="0" max="100" value="0" aria-label="Seek">';
        media.appendChild(ctl); const b = $('button', ctl), r = $('input', ctl);
        b.addEventListener('click', () => { v.paused ? v.play() : v.pause(); }); v.addEventListener('timeupdate', () => { r.value = (v.currentTime / (v.duration || 1)) * 100; }); r.addEventListener('input', () => { v.currentTime = (r.value / 100) * (v.duration || 0); });
      } else if (p.video && /(youtube\.com|youtu\.be|vimeo\.com)/.test(p.video)) {
        const f = document.createElement('iframe'); f.src = p.video; f.allow = 'fullscreen'; f.loading = 'lazy'; f.title = p.title; media.appendChild(f);
      } else {
        const poster = document.createElement('span'); poster.className = 'card__poster'; decoratePoster(poster, p, i); media.appendChild(poster); tryImage(media, p, poster);
      }
      const pv = $('.cinema__nav--p', el), nx = $('.cinema__nav--n', el); pv.disabled = false; nx.disabled = false;
    },
    open(slug, push) {
      const i = CONTENT.projects.findIndex((p) => p.slug === slug); if (i < 0) return;
      lastFocus = document.activeElement; Work.buildModal(); Work.fill(i);
      cinema.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
      window.Scroll && Scroll.stop();
      requestAnimationFrame(() => { cinema.classList.add('is-open'); setTimeout(() => { const c = $('.cinema__close', cinema); c && c.focus(); }, 60); });
      if (push) { try { history.pushState(null, '', '#work/' + slug); } catch (e) { /* ignore */ } }
    },
    go(d) {
      const n = CONTENT.projects.length, i = (current + d + n) % n;
      Work.fill(i); try { history.replaceState(null, '', '#work/' + CONTENT.projects[i].slug); } catch (e) { /* ignore */ }
    },
    close() {
      if (!cinema || !cinema.classList.contains('is-open')) return;
      cinema.classList.remove('is-open'); cinema.setAttribute('aria-hidden', 'true');
      const v = $('video', cinema); v && v.pause();
      document.body.style.overflow = ''; window.Scroll && !building() && Scroll.start();
      try { history.replaceState(null, '', '#work'); } catch (e) { /* ignore */ }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    },
    /* deep link #work/<slug> opens the modal on load */
    openFromHash() {
      const m = location.hash.match(/^#work\/([\w-]+)/); if (m) Work.open(m[1], false);
    },
    isOpen() { return !!(cinema && cinema.classList.contains('is-open')); }
  };
  window.addEventListener('hashchange', () => { const m = location.hash.match(/^#work\/([\w-]+)/); if (m && !building()) Work.open(m[1], false); else if (Work.isOpen() && !m) Work.close(); });
  window.Work = Work;
  function li0() { return list && list[0] ? list[0] : document.body; }
})();
