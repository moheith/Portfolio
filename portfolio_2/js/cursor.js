/* js/cursor.js — custom site cursor (dot + ring), magnetic buttons, letter-roll link hover, RGB-split glitch.
   Cursor.enable() is called only by startSite(); before that the normal OS cursor is used. Plain rAF maths, no gsap needed. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const building = () => window.Swarm && Swarm.state === 'building';
  const motionOff = () => document.documentElement.dataset.motion === 'off';
  const canHover = () => matchMedia('(hover:hover) and (pointer:fine)').matches;

  const LABELS = { view: 'VIEW', open: 'OPEN', drag: 'DRAG', close: '×' };
  const MAGNETIC = '.btn, .nav__link, .nav__talk, .nav__motion, .footer__link, .footer__top, .cta__circle, .hero__demo-btn, .slider__btn, .brief__icon, .accent-dot, .poster__btn, .work__all, .journey__resume, .hl__link';
  const ROLL = '.nav__link, .nav__talk, .footer__link, .work__all, .hl__link, .journey__resume';

  let dot, ring, label, on = false, x = -100, y = -100, rx = -100, ry = -100, state = '';
  let mags = [], magRaf = 0, lastMouse = null;

  function setState(s) {
    if (s === state) return; state = s;
    if (s) { ring.dataset.state = s; label.textContent = LABELS[s] || ''; } else { delete ring.dataset.state; label.textContent = ''; }
  }

  function stateFor(t) {
    if (!t || !t.closest) return '';
    const el = t.closest('[data-cursor], input, textarea');
    if (!el) return '';
    if (el.matches('input, textarea')) return 'text';
    return el.dataset.cursor || '';
  }

  const Cursor = {
    /* elements opt in with data-cursor="view|open|drag|close" */
    tag() {
      $$('.card__link').forEach((e) => { e.dataset.cursor = 'view'; });
      $$('.hero__demo, .poster').forEach((e) => { e.dataset.cursor = 'open'; });
      $$('.work__slider, .raw__stage').forEach((e) => { e.dataset.cursor = 'drag'; });
      $$('.cinema__close').forEach((e) => { e.dataset.cursor = 'close'; });
    },
    enable() {
      Cursor.refreshRoll(); Cursor.initGlitch();
      if (on || !canHover() || motionOff()) return;
      on = true;
      dot = document.createElement('div'); dot.className = 'cur-dot'; dot.setAttribute('aria-hidden', 'true');
      ring = document.createElement('div'); ring.className = 'cur-ring'; ring.setAttribute('aria-hidden', 'true');
      label = document.createElement('span'); ring.appendChild(label);
      document.body.append(dot, ring);
      Cursor.tag();
      document.documentElement.classList.add('has-cursor');
      window.addEventListener('mousemove', (e) => {
        x = e.clientX; y = e.clientY; lastMouse = e;
        dot.style.transform = `translate3d(${x}px,${y}px,0)`;
        setState(stateFor(e.target));
        Cursor.magnet(e);
      }, { passive: true });
      document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
      document.addEventListener('mouseenter', () => { dot.style.opacity = ''; ring.style.opacity = ''; });
      const loop = () => {
        rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
        ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      // the OS cursor comes back while the swarm builds again (replay)
      document.addEventListener('swarmstate', (e) => { document.documentElement.classList.toggle('has-cursor', e.detail !== 'building' && !motionOff()); });
    },
    refresh() { if (on) Cursor.tag(); },
    /* ---------- magnetic buttons: pulled up to 10px toward the pointer inside a 90px radius ---------- */
    magnet(e) {
      if (!canHover() || motionOff() || building()) return;
      if (magRaf) return;
      magRaf = requestAnimationFrame(() => {
        magRaf = 0;
        if (!mags.length) mags = $$(MAGNETIC);
        mags.forEach((el) => {
          if (!el.isConnected) return;
          const r = el.getBoundingClientRect();
          // undo our own offset so the centre is stable
          const ox = parseFloat(el.dataset.mx || 0), oy = parseFloat(el.dataset.my || 0);
          const cx = r.left + r.width / 2 - ox, cy = r.top + r.height / 2 - oy;
          const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy);
          const reach = 90 + Math.max(r.width, r.height) / 2;
          let nx = 0, ny = 0;
          if (d < reach) { const f = (1 - d / reach) * 0.4; nx = Math.max(-10, Math.min(10, dx * f)); ny = Math.max(-10, Math.min(10, dy * f)); }
          if (Math.abs(nx - ox) > 0.05 || Math.abs(ny - oy) > 0.05 || (nx === 0 && ox !== 0)) {
            el.dataset.mx = nx.toFixed(2); el.dataset.my = ny.toFixed(2);
            el.style.translate = nx || ny ? `${nx.toFixed(1)}px ${ny.toFixed(1)}px` : '';
            el.style.transition = 'translate .25s var(--ease)';
          }
        });
      });
    },
    /* ---------- letter-roll hover (wraps letters AFTER the build; textContent stays identical) ---------- */
    refreshRoll() {
      if (building() || motionOff() || !canHover()) return;
      $$(ROLL).forEach((el) => {
        if (el.querySelector('.roll-l')) return;
        const txt = el.textContent; if (!txt) return;
        const frag = document.createDocumentFragment();
        [...txt].forEach((ch, i) => {
          const w = document.createElement('span'); w.className = 'roll-l'; w.style.whiteSpace = 'pre';
          const g = document.createElement('i'); g.dataset.c = ch; g.style.setProperty('--i', i); g.textContent = ch;
          w.appendChild(g); frag.appendChild(w);
        });
        el.textContent = ''; el.appendChild(frag);
      });
    },
    /* ---------- RGB-split glitch on display headings (220 ms) ---------- */
    initGlitch() {
      if (Cursor._glitch) return; Cursor._glitch = true;
      document.addEventListener('mouseover', (e) => {
        const h = e.target.closest && e.target.closest('.h2-display .h2-line, .hero__name span, .h2-bold');
        if (!h || h.classList.contains('glitch-on') || motionOff() || building() || h.dataset.full === undefined) return;
        h.classList.add('glitch-on'); setTimeout(() => h.classList.remove('glitch-on'), 240);
      });
    }
  };
  window.Cursor = Cursor;
})();
