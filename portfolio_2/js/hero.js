/* js/hero.js — giant word fitting, portrait fallback, stat counters, parallax + spotlight. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const building = () => window.Swarm && Swarm.state === 'building';
  const motionOff = () => document.documentElement.dataset.motion === 'off';
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  /* a head-and-shoulders silhouette used only when assets/img/hero-cutout.png is missing */
  const SILHOUETTE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200"><defs><radialGradient id="g" cx="50%" cy="58%" r="55%"><stop offset="0" stop-color="#7a1414" stop-opacity=".75"/><stop offset="1" stop-color="#7a1414" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="900" height="1200" fill="url(#g)"/><ellipse cx="450" cy="430" rx="150" ry="185" fill="#0b0b0e"/><path d="M130 1200 C130 880 250 780 450 760 C650 780 770 880 770 1200 Z" fill="#0b0b0e"/></svg>');

  let mx = 0, my = 0, tx = 0, ty = 0, running = false, spot = null;

  const Hero = {
    /* the giant word gets font-size so its rendered width = 94% of the page width (measure at 100px, scale linearly) */
    fitText() {
      const w = $('.hero__word'); if (!w) return;
      const target = document.body.offsetWidth * 0.94;
      w.style.fontSize = '100px';
      const w100 = w.getBoundingClientRect().width || 1;
      w.style.fontSize = (100 * target / w100).toFixed(2) + 'px';
      Hero.fitPlus();
    },
    /* the "+" of the big 10+ stat is red: measure the width of the last character and feed it to the gradient */
    fitPlus() {
      $$('.hl__bignum').forEach((el) => {
        const node = el.firstChild; if (!node || node.nodeType !== 3 || !node.length) return;
        try {
          const r = document.createRange(); r.setStart(node, node.length - 1); r.setEnd(node, node.length);
          const w = r.getBoundingClientRect().width; if (w > 0) el.style.setProperty('--plus-w', w.toFixed(1) + 'px');
        } catch (e) { /* ignore */ }
      });
    },
    /* portrait fallback: same element, same size, a silhouette instead of a broken image */
    initPhoto() {
      const img = $('.hero__photo'); if (!img) return;
      const fb = () => { if (img.dataset.fallback) return; img.dataset.fallback = '1'; img.src = SILHOUETTE; };
      img.addEventListener('error', fb);
      if (img.complete && img.naturalWidth === 0) fb();
    },
    /* count the numerals up from 0 (1.4 s, ease-out), keep the "+", restore the exact text at the end */
    countUp(el, dur = 1400) {
      const full = el.textContent, m = full.match(/^(\D*)(\d+)(.*)$/); if (!m || motionOff()) return;
      const pre = m[1], end = parseInt(m[2], 10), post = m[3], t0 = performance.now();
      const step = (now) => {
        if (building()) { el.textContent = full; return; }
        const p = Math.min(1, (now - t0) / dur);
        if (p >= 1) { el.textContent = full; return; }
        el.textContent = pre + Math.round(end * ease(p)) + post;
        requestAnimationFrame(step);
      };
      el.textContent = pre + '0' + post; requestAnimationFrame(step);
    },
    startCounters() {
      // count up when the stats are first visible (1.4 s, ease-out)
      const stats = $('.hero__stats'), run = () => $$('.stat__num').forEach((el, i) => setTimeout(() => Hero.countUp(el), i * 120));
      if (stats && 'IntersectionObserver' in window) {
        const so = new IntersectionObserver((en) => { if (en[0].isIntersecting) { so.disconnect(); run(); } }, { threshold: 0.6 });
        so.observe(stats);
      } else run();
      const big = $('.hl__bignum');
      if (big && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { io.disconnect(); Hero.countUp(big, 1600); } }, { threshold: 0.5 });
        if (big.getBoundingClientRect().top > window.innerHeight) io.observe(big);
      }
      Hero.startMotion();
    },
    initMotion() { Hero.initPhoto(); },
    /* parallax on scroll (word .15, portrait .05) + lerped mouse parallax (word ±26px, portrait ±14px) + spotlight */
    startMotion() {
      if (running || motionOff()) return; running = true;
      const hero = $('.hero'), word = $('.hero__word'), wrap = $('.hero__photo-wrap'); if (!hero || !word || !wrap) return;
      spot = document.createElement('div'); spot.className = 'hero__spot'; spot.setAttribute('aria-hidden', 'true');
      word.insertAdjacentElement('afterend', spot);
      let sy = window.scrollY, cx = 0, cy = 0;
      window.addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });
      hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5;
        spot.style.setProperty('--mx', (e.clientX - r.left) + 'px'); spot.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      hero.addEventListener('mouseleave', () => { mx = 0; my = 0; });
      const loop = () => {
        if (motionOff()) { word.style.removeProperty('--wx'); word.style.removeProperty('--wy'); wrap.style.removeProperty('--px'); wrap.style.removeProperty('--py'); requestAnimationFrame(loop); return; }
        cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08;
        if (sy < window.innerHeight * 1.3 && !building()) {
          word.style.setProperty('--wx', (cx * 52).toFixed(2) + 'px'); word.style.setProperty('--wy', (sy * 0.15 + cy * 52).toFixed(2) + 'px');
          wrap.style.setProperty('--px', (cx * 28).toFixed(2) + 'px'); wrap.style.setProperty('--py', (sy * 0.05 + cy * 28).toFixed(2) + 'px');
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(Hero.fitText, 120); });
    }
  };
  // re-fit on resize even before the intro ends (debounced 120 ms)
  let rt0; window.addEventListener('resize', () => { clearTimeout(rt0); rt0 = setTimeout(() => { if (!running) Hero.fitText(); }, 120); });
  window.Hero = Hero;
})();
