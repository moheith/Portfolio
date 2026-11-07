/* js/fx.js — cursor states + hover plumbing (loaded after cursor.js; works with the existing #cursorDot glass arrow).
   What it adds
   • The system cursor is hidden EVERYWHERE the custom one is active (no more hand / grab icon under the arrow).
   • Context tags next to the arrow: VIEW on project cards, DRAG puck on sliders, OPEN ↗ on external links, EMAIL, CHAT, TOP…
   • Click ripple, press-scale, hides over text fields and when the mouse leaves the window.
   • Pointer-tracking CSS variables (--mx / --my / --px / --py) for spotlight, liquid-fill and tilt hovers (css/hover.css).
   • Tooltips for the tech tiles (data-tip), staggered entrance index (--i) for chips / tiles.
   Public: window.FX { enabled }                                                                                       */
(() => {
  'use strict';
  const root = document.documentElement;
  const fine = !(window.matchMedia && window.matchMedia('(hover: none)').matches);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* -------------------------------------------------- tag rules: first match wins */
  const RULES = [
    ['[data-cursor]',                  (el) => el.dataset.cursor],
    ['.compare__handle, .compare',     () => 'DRAG', 'grab'],
    ['.card',                          () => 'VIEW'],
    ['.slider',                        () => 'DRAG', 'grab'],
    ['#emailRow, a[href^="mailto:"]',  () => 'COPY'],
    ['a[href*="wa.me"], .cta',         () => 'CHAT'],
    ['#cvLink',                        () => 'CV'],
    ['.footer__top, #toTop',           () => 'TOP'],
    ['.tl__item',                      () => 'MORE'],
    ['.accent-dot',                    () => 'ACCENT'],
    ['.modal__close',                  () => 'CLOSE'],
    ['a[target="_blank"]',             () => 'OPEN ↗'],
  ];
  const HOT = 'a, button, [role="button"], .card, .tab, .tile, .chip, .crow, .hl, .tl__item, .accent-dot, .compare, .slider, .poster, .stat, summary, label';

  let dot, tag, ripple, cur = null, curKind = '', ready = false;

  function mount() {
    dot = document.getElementById('cursorDot'); if (!dot || ready) return false;
    tag = document.createElement('span'); tag.className = 'cur-tag'; tag.setAttribute('aria-hidden', 'true'); dot.appendChild(tag);
    const puck = document.createElement('span'); puck.className = 'cur-puck'; puck.setAttribute('aria-hidden', 'true'); puck.innerHTML = '<i>◂</i><i>▸</i>'; dot.appendChild(puck);
    ripple = document.createElement('div'); ripple.className = 'cur-ripple-layer'; ripple.setAttribute('aria-hidden', 'true'); document.body.appendChild(ripple);
    ready = true; return true;
  }

  function resolve(el) {
    for (const [sel, fn, kind] of RULES) {
      const m = el.closest(sel);
      if (m) return { el: m, text: fn(m) || '', kind: kind || '' };
    }
    return { el: el.closest(HOT), text: '', kind: '' };
  }

  function setState(t) {
    if (!ready) return;
    const r = t ? resolve(t) : { el: null, text: '', kind: '' };
    const hot = !!r.el, grab = r.kind === 'grab';
    dot.classList.toggle('is-hot', hot && !grab);
    dot.classList.toggle('is-grab', grab);
    dot.classList.toggle('is-text', !!(t && t.closest('input, textarea, [contenteditable="true"]')));
    if (r.text !== tag.dataset.t) { tag.dataset.t = r.text; tag.textContent = r.text; }
    dot.classList.toggle('has-tag', !!r.text && !grab);
    cur = r.el;
  }

  function flip(x) { dot.classList.toggle('is-flip', x > innerWidth - 150); }

  function onMove(e) {
    if (!ready) return;
    dot.classList.remove('is-away');
    flip(e.clientX);
  }

  function bindCursor() {
    if (!fine) return;
    document.addEventListener('pointerover', (e) => { if (e.pointerType === 'touch') return; if (!ready && !mount()) return; setState(e.target); }, { passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || !ready) return;
      dot.classList.add('is-down');
      if (reduce) return;
      const s = document.createElement('i'); s.className = 'cur-ripple'; s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      ripple.appendChild(s); setTimeout(() => s.remove(), 700);
    }, { passive: true });
    addEventListener('pointerup', () => ready && dot.classList.remove('is-down'), { passive: true });
    document.documentElement.addEventListener('mouseleave', () => ready && dot.classList.add('is-away'));
    document.documentElement.addEventListener('mouseenter', () => ready && dot.classList.remove('is-away'));
  }

  /* -------------------------------------------------- pointer variables for hover effects */
  function bindPointerVars() {
    if (!fine) return;
    let raf = 0, ev = null;
    const SEL = '.btn, .hero__live, .hero__cv, .cta, .poster, .poster__btn, .brief__send, .crow, .hl, .quote, .step, .tl__item, .stat, .chip, .tile, .card, .footer__social a, .tab, .compare';
    const apply = () => {
      raf = 0; if (!ev) return;
      const el = ev.target.closest && ev.target.closest(SEL); if (!el) return;
      const r = el.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
      el.style.setProperty('--px', (x / r.width).toFixed(3)); el.style.setProperty('--py', (y / r.height).toFixed(3));
    };
    document.addEventListener('pointermove', (e) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
    document.addEventListener('pointerenter', (e) => { ev = e; apply(); }, { capture: true, passive: true });
  }

  /* -------------------------------------------------- small content helpers */
  function decorate() {
    $$('.tile').forEach((t, i) => { t.style.setProperty('--i', i); if (!t.dataset.tip) t.dataset.tip = t.getAttribute('title') || (t.querySelector('img') && t.querySelector('img').alt) || ''; t.removeAttribute('title'); });
    $$('.chip').forEach((c, i) => c.style.setProperty('--i', i));
    $$('.logo').forEach((c, i) => c.style.setProperty('--i', i));
    $$('.footer__social a').forEach((a, i) => { a.style.setProperty('--i', i); });
    $$('.hl').forEach((a, i) => a.style.setProperty('--i', i));
    $$('.crow').forEach((a, i) => a.style.setProperty('--i', i));
  }

  function init() {
    mount(); bindCursor(); bindPointerVars();
    decorate();
    /* the layers are re-rendered once on boot; decorate again when idle so late nodes are covered */
    setTimeout(decorate, 1500);
  }

  window.FX = { get enabled() { return ready; } };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
