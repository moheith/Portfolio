/* js/extras.js — everything in Part 7 that is not covered elsewhere:
   toasts, clock, accent switcher, Motion-off toggle, copy-email, CV placeholders, quick-brief bar, GitHub stats,
   command palette, mini terminal, idle companions, Konami + replay keys, poster terminal loop, SwarmSound. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const building = () => window.Swarm && Swarm.state === 'building';
  const html = document.documentElement;
  const motionOff = () => html.dataset.motion === 'off';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  const typing = (t) => !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

  /* ============ SwarmSound (5.10): synthesized, default OFF ============ */
  const Snd = { on: false, ctx: null };
  function ac() { if (!Snd.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (C) { try { Snd.ctx = new C(); } catch (e) { /* ignore */ } } } return Snd.ctx; }
  window.SwarmSound = {
    set(on) {
      Snd.on = !!on; if (on) { const c = ac(); c && c.state === 'suspended' && c.resume(); }
      $$('[data-act="sound"]').forEach((b) => { b.setAttribute('aria-pressed', String(Snd.on)); b.textContent = Snd.on ? '🔊' : '🔇'; });
    },
    /* a 12 ms square tick at 1800 Hz, only on a space or when the text ends */
    tick(ch) {
      if (!Snd.on || (ch !== ' ' && ch !== '')) return; const c = ac(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain(); o.type = 'square'; o.frequency.value = 1800; g.gain.value = 0.03;
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.012);
    },
    /* filtered noise whoosh for the section-commit sweep */
    whoosh() {
      if (!Snd.on) return; const c = ac(); if (!c) return;
      const len = c.sampleRate * 0.45, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = c.createBufferSource(); src.buffer = buf;
      const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(300, c.currentTime); f.frequency.exponentialRampToValueAtTime(3200, c.currentTime + 0.4);
      const g = c.createGain(); g.gain.value = 0.05; src.connect(f); f.connect(g); g.connect(c.destination); src.start();
    },
    /* soft two-note chime on "Rebuilt" */
    chime() {
      if (!Snd.on) return; const c = ac(); if (!c) return;
      [659.25, 987.77].forEach((hz, i) => {
        const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + i * 0.16;
        o.type = 'sine'; o.frequency.value = hz; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.95);
      });
    }
  };

  /* ============ accent colours (7.13) ============ */
  const ACCENTS = {
    red: { '--red': '#ff3b30', '--red-deep': '#c8231f', '--accent': '#ff4d5a', '--btn': '#ef4337', '--guide': '#ff4d2d' },
    violet: { '--red': '#a893ff', '--red-deep': '#6f55ff', '--accent': '#b9a8ff', '--btn': '#8f74ff', '--guide': '#a893ff' },
    blue: { '--red': '#3b82ff', '--red-deep': '#1f56c8', '--accent': '#5b9bff', '--btn': '#2f6fe8', '--guide': '#3b82ff' },
    amber: { '--red': '#ffb020', '--red-deep': '#c87f0a', '--accent': '#ffc24d', '--btn': '#e89a10', '--guide': '#ffb020' }
  };
  function setAccent(name, save) {
    const a = ACCENTS[name]; if (!a) return false;
    Object.entries(a).forEach(([k, v]) => html.style.setProperty(k, v));
    $$('.accent-dot').forEach((d) => { const on = d.dataset.accent === name; d.classList.toggle('is-on', on); d.setAttribute('aria-pressed', String(on)); });
    if (save !== false) store.set('accent', name);
    return true;
  }

  /* ============ toast ============ */
  let toastT;
  function toast(msg) {
    const t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2300);
  }

  /* ============ clock (updates BOTH textContent and data-full) ============ */
  function tickClock() {
    const el = $('[data-clock]'); if (!el || building()) return;
    let hm = '';
    try { hm = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: CONTENT.meta.tz }).format(new Date()); } catch (e) { return; }
    const t = 'Bengaluru · ' + hm + ' ' + CONTENT.meta.tzLabel; el.textContent = t; el.dataset.full = t;
  }

  /* ============ motion toggle (7.9) ============ */
  function setMotion(off, save) {
    html.dataset.motion = off ? 'off' : 'on';
    const b = $('#motion-toggle'); if (b) b.setAttribute('aria-pressed', String(off));
    if (save !== false) store.set('motion', off ? 'off' : 'on');
    if (off) { if (building()) Swarm.finishAll(); html.classList.remove('has-cursor'); }
    else if (window.Cursor && Swarm.state !== 'building') Cursor.enable();
  }

  /* ============ copy email, CV placeholders, quick brief ============ */
  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
    return new Promise((res, rej) => { try { const x = document.createElement('textarea'); x.value = t; x.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(x); x.select(); document.execCommand('copy'); x.remove(); res(); } catch (e) { rej(e); } });
  }
  function bindActions() {
    document.addEventListener('click', (e) => {
      const m = e.target.closest('[data-copy-email]');
      if (m && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0 && !building()) { e.preventDefault(); copyText(CONTENT.meta.email).then(() => toast(CONTENT.en.toasts.emailCopied), () => toast(CONTENT.en.toasts.emailCopied)); }
      const cv = e.target.closest('.hero__cv, .journey__resume');
      if (cv) {
        e.preventDefault(); if (building()) return;
        const soon = cv.classList.contains('hero__cv') ? CONTENT.en.toasts.cvSoon : CONTENT.en.toasts.resumeSoon;
        if (location.protocol === 'file:') { toast(soon); return; }
        const href = cv.getAttribute('href');
        fetch(href, { method: 'HEAD' }).then((r) => {
          if (!r.ok) throw new Error('missing');
          const a = document.createElement('a'); a.href = href; a.download = ''; document.body.appendChild(a); a.click(); a.remove();
        }).catch(() => toast(soon));
      }
    });
    // quick-brief bar: Enter or the send icon opens WhatsApp with the text (plain chat when empty)
    const form = $('#brief'), inp = form && $('input', form);
    if (form && inp) {
      const wa = () => 'https://wa.me/' + CONTENT.meta.whatsapp + (inp.value.trim() ? '?text=' + encodeURIComponent(inp.value.trim()) : '');
      const send = () => { if (building()) return; window.open(wa(), '_blank', 'noopener'); };
      form.addEventListener('submit', (e) => { e.preventDefault(); send(); });
      inp.addEventListener('input', () => form.classList.toggle('has-text', !!inp.value));
      const icons = $$('.brief__icon', form);
      if (icons[0]) icons[0].addEventListener('click', () => inp.focus());
      if (icons[1]) icons[1].addEventListener('click', () => toast(inp.value.trim() ? 'Preview: ' + inp.value.trim().slice(0, 70) : 'Type a message first'));
      if (icons[2]) icons[2].addEventListener('click', send);
    }
    const mt = $('#motion-toggle'); mt && mt.addEventListener('click', () => setMotion(!motionOff()));
    $$('.accent-dot').forEach((d) => d.addEventListener('click', () => setAccent(d.dataset.accent)));
  }

  /* ============ GitHub stats (7.12): cached 10 min, silent fallback to 13 / 4 ============ */
  function paintStats(s) {
    const set = (k, v) => $$('[data-live="' + k + '"]').forEach((e) => { e.textContent = v; });
    set('repos', String(s.repos)); set('followers', String(s.followers)); if (s.latest) set('latest', s.latest);
    const mid = $('.footer__mid'); if (!mid) return;
    let f = $('[data-live-foot]', mid);
    if (!f) { f = document.createElement('p'); f.className = 'footer__time'; f.dataset.liveFoot = '1'; mid.appendChild(f); }
    f.textContent = 'GITHUB · ' + s.repos + ' REPOS · ' + s.followers + ' FOLLOWERS';
  }
  function githubStats() {
    const fallback = { repos: 13, followers: 4, latest: '' }; paintStats(fallback);
    try { const c = JSON.parse(sessionStorage.getItem('gh-stats') || 'null'); if (c && Date.now() - c.t < 600000) { paintStats(c.s); return; } } catch (e) { /* ignore */ }
    if (typeof fetch !== 'function' || location.protocol === 'file:' && false) return;
    const u = 'https://api.github.com/users/moheith';
    Promise.all([fetch(u).then((r) => (r.ok ? r.json() : Promise.reject())), fetch(u + '/repos?sort=pushed&per_page=3').then((r) => (r.ok ? r.json() : Promise.reject()))]).then(([a, b]) => {
      const d = b && b[0] && b[0].pushed_at ? new Date(b[0].pushed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : '';
      const s = { repos: a.public_repos || 13, followers: typeof a.followers === 'number' ? a.followers : 4, latest: d };
      try { sessionStorage.setItem('gh-stats', JSON.stringify({ t: Date.now(), s })); } catch (e) { /* ignore */ }
      paintStats(s);
    }).catch(() => { /* offline or rate-limited: keep the static numbers, show nothing */ });
  }

  /* ============ poster terminal loop (6.8): the output lines type themselves again and again ============ */
  function posterLoop() {
    const term = $('.poster__term'); if (!term || term.dataset.loop) return; term.dataset.loop = '1';
    const cmds = $$('.poster__line', term), outs = ['mayura — full stack dev & designer', 'yulya  studio  desktop-ai-companion'];
    if (cmds.length < 3) return;
    const o1 = document.createElement('span'), o2 = document.createElement('span'), caret = document.createElement('i');
    o1.className = o2.className = 'poster__line poster__out'; caret.className = 'poster__caret';
    cmds[0].insertAdjacentElement('afterend', o1); cmds[1].insertAdjacentElement('afterend', o2); cmds[2].appendChild(caret);
    const typeInto = (el, text) => new Promise((res) => { let i = 0; const id = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(id); res(); } }, 34); });
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    if (motionOff()) { o1.textContent = outs[0]; o2.textContent = outs[1]; return; }
    (async function run() {
      for (;;) {
        o1.textContent = ''; o2.textContent = '';
        await wait(700); if (building()) { await wait(1500); continue; }
        await typeInto(o1, outs[0]); await wait(500); await typeInto(o2, outs[1]); await wait(4200);
        if (motionOff()) { o1.textContent = outs[0]; o2.textContent = outs[1]; return; }
      }
    })();
  }

  /* ============ command palette (7.11) ============ */
  let pal = null, palItems = [], palSel = 0, palLast = null;
  function actionsList() {
    const go = (id) => () => window.Scroll && Scroll.to(document.getElementById(id), { offset: id === 'home' ? 0 : -64 });
    const items = [];
    [['Home', 'home'], ['Work', 'work'], ['Highlights', 'highlights'], ['About', 'about'], ['Journey', 'journey'], ['Contact', 'contact']].forEach(([l, id]) => items.push({ label: 'Go to ' + l, tag: 'SECTION', run: go(id) }));
    CONTENT.projects.forEach((p) => items.push({ label: p.title, tag: 'PROJECT', run: () => window.Work && Work.open(p.slug, true) }));
    CONTENT.highlights.forEach((h) => items.push({ label: h.t, tag: 'HIGHLIGHT', run: () => (h.url.startsWith('#') ? go(h.url.slice(1))() : window.open(h.url, '_blank', 'noopener')) }));
    items.push(
      { label: 'Download CV', tag: 'ACTION', run: () => { const a = $('.hero__cv'); a && a.click(); } },
      { label: 'Copy email', tag: 'ACTION', run: () => copyText(CONTENT.meta.email).then(() => toast(CONTENT.en.toasts.emailCopied), () => toast(CONTENT.en.toasts.emailCopied)) },
      { label: 'Open WhatsApp', tag: 'ACTION', run: () => window.open('https://wa.me/' + CONTENT.meta.whatsapp, '_blank', 'noopener') },
      { label: 'Open GitHub', tag: 'ACTION', run: () => window.open(CONTENT.links.github, '_blank', 'noopener') },
      { label: 'Toggle sound', tag: 'ACTION', run: () => SwarmSound.set(!Snd.on) },
      { label: 'Replay rebuild', tag: 'ACTION', run: () => { if (window.Swarm && Swarm.state !== 'building') Swarm.replay(); } },
      { label: 'Change accent', tag: 'ACTION', run: () => { const names = Object.keys(ACCENTS), cur = store.get('accent') || 'red'; setAccent(names[(names.indexOf(cur) + 1) % names.length]); } },
      { label: 'Open terminal', tag: 'ACTION', run: () => Term.open() }
    );
    return items;
  }
  function fuzzy(q, s) { q = q.toLowerCase(); s = s.toLowerCase(); let p = 0; for (const c of q) { if (c === ' ') continue; const k = s.indexOf(c, p); if (k < 0) return false; p = k + 1; } return true; }
  const Pal = {
    build() {
      if (pal) return;
      pal = document.createElement('div'); pal.className = 'palette'; pal.setAttribute('aria-hidden', 'true');
      pal.innerHTML = '<div class="palette__box" role="dialog" aria-modal="true" aria-label="Command palette"><input class="palette__input" type="text" placeholder="Type a command or search…" aria-label="Command palette search" autocomplete="off"><div class="palette__list" role="listbox"></div><div class="palette__foot"><span>↑↓ navigate</span><span>↵ run</span><span>esc close</span></div></div>';
      document.body.appendChild(pal);
      const inp = $('input', pal);
      inp.addEventListener('input', () => { palSel = 0; Pal.render(inp.value); });
      pal.addEventListener('click', (e) => { if (e.target === pal) Pal.close(); const b = e.target.closest('.palette__item'); if (b) Pal.run(+b.dataset.i); });
      pal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.preventDefault(); Pal.close(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); palSel = Math.min(palItems.length - 1, palSel + 1); Pal.mark(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = Math.max(0, palSel - 1); Pal.mark(); }
        else if (e.key === 'Enter') { e.preventDefault(); Pal.run(palSel); }
        else if (e.key === 'Tab') { e.preventDefault(); inp.focus(); }
      });
    },
    render(q) {
      const all = actionsList(); palItems = q ? all.filter((i) => fuzzy(q, i.label + ' ' + i.tag)) : all;
      const box = $('.palette__list', pal);
      box.innerHTML = palItems.length ? palItems.map((it, i) => '<button class="palette__item" type="button" role="option" data-i="' + i + '">' + it.label.replace(/</g, '&lt;') + '<small>' + it.tag + '</small></button>').join('') : '<p class="palette__empty">Nothing found</p>';
      Pal.mark();
    },
    mark() { $$('.palette__item', pal).forEach((b, i) => { const on = i === palSel; b.classList.toggle('is-sel', on); b.setAttribute('aria-selected', String(on)); if (on) b.scrollIntoView({ block: 'nearest' }); }); },
    open() {
      if (building() || (window.Work && Work.isOpen())) return;
      Pal.build(); palLast = document.activeElement; palSel = 0; const inp = $('input', pal); inp.value = ''; Pal.render('');
      pal.classList.add('is-open'); pal.setAttribute('aria-hidden', 'false'); setTimeout(() => inp.focus(), 30);
      window.Scroll && Scroll.stop();
    },
    close() { if (!pal) return; pal.classList.remove('is-open'); pal.setAttribute('aria-hidden', 'true'); window.Scroll && !building() && Scroll.start(); palLast && palLast.focus && palLast.focus(); },
    run(i) { const it = palItems[i]; if (!it) return; Pal.close(); setTimeout(() => it.run(), 60); },
    isOpen() { return !!(pal && pal.classList.contains('is-open')); }
  };

  /* ============ mini terminal (7.21) ============ */
  let termEl = null, termOut, termIn;
  const Term = {
    build() {
      if (termEl) return;
      termEl = document.createElement('div'); termEl.className = 'term'; termEl.setAttribute('role', 'dialog'); termEl.setAttribute('aria-label', 'Terminal'); termEl.setAttribute('aria-hidden', 'true');
      termEl.innerHTML = '<div class="term__out" aria-live="polite"></div><label class="term__row"><span class="term__prompt">mayura@portfolio:~$</span><input class="term__in" type="text" autocomplete="off" spellcheck="false" aria-label="Terminal command"></label>';
      document.body.appendChild(termEl); termOut = $('.term__out', termEl); termIn = $('.term__in', termEl);
      termEl.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); Term.close(); } e.stopPropagation(); });
      termIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const v = termIn.value; termIn.value = ''; Term.run(v); } });
      Term.print('Welcome. Type help to see the commands.');
    },
    print(t) { const d = document.createElement('div'); d.textContent = t; termOut.appendChild(d); termOut.scrollTop = termOut.scrollHeight; },
    open() { if (building()) return; Term.build(); termEl.classList.add('is-open'); termEl.setAttribute('aria-hidden', 'false'); setTimeout(() => termIn.focus(), 50); },
    close() { if (!termEl) return; termEl.classList.remove('is-open'); termEl.setAttribute('aria-hidden', 'true'); termIn.blur(); },
    isOpen() { return !!(termEl && termEl.classList.contains('is-open')); },
    run(line) {
      const raw = line.trim(); Term.print('mayura@portfolio:~$ ' + raw); if (!raw) return;
      const [cmd, ...args] = raw.split(/\s+/), a = args.join(' ').toLowerCase(), M = CONTENT.meta;
      switch (cmd.toLowerCase()) {
        case 'help': Term.print('help  whoami  about  projects  open <n>  skills  contact  github  yulya  theme red|violet|blue|amber  replay  clear  exit'); break;
        case 'whoami': Term.print(M.fullName + ' (' + M.name.charAt(0) + M.name.slice(1).toLowerCase() + ')\nFull Stack Developer & Designer\nBengaluru, India'); break;
        case 'about': Term.print(CONTENT.en.about.text); break;
        case 'projects': Term.print(CONTENT.projects.map((p, i) => (i + 1) + '. ' + p.title).join('\n') + '\n\ntype: open <number>'); break;
        case 'open': { const n = parseInt(args[0], 10), p = CONTENT.projects[n - 1]; if (!p) Term.print('open <1-' + CONTENT.projects.length + '>'); else { Term.print('opening ' + p.title + ' …'); Term.close(); setTimeout(() => window.Work && Work.open(p.slug, true), 450); } break; }
        case 'skills': Term.print(CONTENT.tools.join(' · ')); break;
        case 'contact': Term.print('email     ' + M.email + '\ninstagram ' + M.instagram + '\nwhatsapp  ' + M.phoneDisplay); break;
        case 'github': Term.print('opening ' + CONTENT.links.github); window.open(CONTENT.links.github, '_blank', 'noopener'); break;
        case 'yulya': Term.print('opening ' + CONTENT.links.yulyaBot); window.open(CONTENT.links.yulyaBot, '_blank', 'noopener'); break;
        case 'theme': if (ACCENTS[a]) { setAccent(a); Term.print('theme: ' + a); } else Term.print('theme red|violet|blue|amber'); break;
        case 'replay': Term.print('replaying the rebuild …'); Term.close(); setTimeout(() => { if (window.Swarm) Swarm.replay(); }, 450); break;
        case 'clear': termOut.textContent = ''; break;
        case 'exit': Term.close(); break;
        default: Term.print('command not found, try help');
      }
    }
  };

  /* ============ idle swarm companions (7.14) + Konami finale ============ */
  const ARROW = '<svg viewBox="0 0 22 22" width="20" height="20"><path d="M3 2 L3 19 L7.6 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.6 L16.6 13.6 Z" fill="COLOR" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  const PASTEL = ['#5eead4', '#fb923c', '#ffffff', '#a78bfa', '#7dd3fc', '#fda4af', '#fcd34d', '#86efac'];
  const Comp = {
    list: [], mouse: { x: 0, y: 0 }, rest: { x: 0, y: 0 }, lastMove: performance.now(), inHero: false, raf: 0, away: false, until: 0,
    spawn(n, until) {
      if (Comp.list.length || motionOff() || building()) return; Comp.away = false; Comp.until = until || 0; Comp.rest = { ...Comp.mouse };
      for (let i = 0; i < n; i++) {
        const el = document.createElement('div'); el.className = 'companion'; el.innerHTML = ARROW.replace('COLOR', PASTEL[i % PASTEL.length]); document.body.appendChild(el);
        Comp.list.push({ el, x: innerWidth - 30, y: -20, th: (i / n) * 6.283, r: 46 + (i % 3) * 18, sp: 0.02 + (i % 3) * 0.006, lag: 0.04 + i * 0.012 });
      }
      cancelAnimationFrame(Comp.raf); Comp.raf = requestAnimationFrame(Comp.step);
    },
    send() { if (!Comp.list.length || Comp.away) return; Comp.away = true; },
    step() {
      let alive = 0;
      Comp.list.forEach((c) => {
        c.th += c.sp;
        let tx = Comp.mouse.x + Math.cos(c.th) * c.r, ty = Comp.mouse.y + Math.sin(c.th) * c.r, k = c.lag;
        if (Comp.away) { tx = innerWidth + 80; ty = -80; k = 0.07; }
        c.x += (tx - c.x) * k; c.y += (ty - c.y) * k;
        const rot = Comp.away ? 40 : (c.th * 180) / Math.PI + 90;
        c.el.style.transform = `translate3d(${c.x}px,${c.y}px,0) rotate(${rot}deg)`;
        if (!(Comp.away && c.x > innerWidth + 20)) alive++;
      });
      if (Comp.until && performance.now() > Comp.until) Comp.away = true;
      if (Comp.away && !alive) { Comp.list.forEach((c) => c.el.remove()); Comp.list = []; Comp.until = 0; return; }
      Comp.raf = requestAnimationFrame(Comp.step);
    },
    init() {
      const hero = $('.hero'); if (!hero) return;
      document.addEventListener('mousemove', (e) => {
        Comp.mouse.x = e.clientX; Comp.mouse.y = e.clientY;
        const r = hero.getBoundingClientRect(); Comp.inHero = e.clientY > r.top && e.clientY < r.bottom;
        if (Comp.list.length && !Comp.until && Math.hypot(e.clientX - Comp.rest.x, e.clientY - Comp.rest.y) > 40) Comp.send();
        if (!Comp.list.length) { Comp.lastMove = performance.now(); Comp.rest = { x: e.clientX, y: e.clientY }; }
      }, { passive: true });
      document.addEventListener('click', () => { if (!Comp.until) Comp.send(); });
      setInterval(() => { if (Comp.inHero && !Comp.list.length && performance.now() - Comp.lastMove > 4000 && !building() && !motionOff()) Comp.spawn(6); }, 500);
    }
  };

  /* ============ keys: palette, terminal, replay, Konami ============ */
  function bindKeys() {
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']; let kpos = 0, word = '';
    document.addEventListener('keydown', (e) => {
      const k = e.key;
      if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'k') { e.preventDefault(); Pal.isOpen() ? Pal.close() : Pal.open(); return; }
      if (typing(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (k === '/') { e.preventDefault(); Pal.open(); return; }
      if (k === '`') { e.preventDefault(); Term.isOpen() ? Term.close() : Term.open(); return; }
      if (k === 'Escape') { if (Term.isOpen()) Term.close(); return; }
      if (building()) return;
      if (k === 'r' || k === 'R') { if (window.Swarm && !(window.Work && Work.isOpen()) && !Pal.isOpen()) Swarm.replay(); return; }
      // konami: up up down down left right left right b a
      kpos = (k.toLowerCase() === KONAMI[kpos].toLowerCase()) ? kpos + 1 : (k === KONAMI[0] ? 1 : 0);
      if (kpos === KONAMI.length) { kpos = 0; Comp.spawn(12, performance.now() + 4000); }
      // typing the word "replay" anywhere also replays
      if (k.length === 1) { word = (word + k.toLowerCase()).slice(-6); if (word === 'replay' && window.Swarm) { word = ''; Swarm.replay(); } }
    });
  }

  const Extras = {
    toast, setAccent, copyText,
    /* 4. everything static, before the swarm starts */
    initStatic() {
      tickClock(); setInterval(tickClock, 30000);
      setAccent(ACCENTS[store.get('accent')] ? store.get('accent') : 'red', false);
      const off = store.get('motion') === 'off' || (store.get('motion') === null && matchMedia('(prefers-reduced-motion: reduce)').matches);
      setMotion(off, false);
      bindActions(); bindKeys();
    },
    /* once the swarm is finished or skipped */
    startSite() { posterLoop(); Comp.init(); githubStats(); },
    palette: Pal, terminal: Term
  };
  window.Extras = Extras;
})();
