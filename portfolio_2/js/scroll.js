/* js/scroll.js — Lenis smooth scroll, scroll spy, hash routing, nav behaviour, scroll playhead + timecode, scroll reveals.
   Every gsap / Lenis use is guarded: without the CDN scripts the page still scrolls and everything is visible. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SECTIONS = ['home', 'work', 'highlights', 'about', 'journey', 'contact'];
  const building = () => window.Swarm && Swarm.state === 'building';
  const motionOff = () => document.documentElement.dataset.motion === 'off';

  let lenis = null, started = false;

  const Scroll = {
    get lenis() { return lenis; },
    /* Create Lenis and stop it at once: window.scrollTo still works while stopped (the swarm uses it). */
    init() {
      if (window.gsap && window.ScrollTrigger) { try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* ignore */ } }
      if (window.Lenis && !motionOff()) {
        try {
          lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
          lenis.stop();
          if (window.gsap && window.ScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((t) => lenis.raf(t * 1000));
            gsap.ticker.lagSmoothing(0);
          } else {
            const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); };
            requestAnimationFrame(loop);
          }
        } catch (e) { lenis = null; }
      }
      Scroll.initNav(); Scroll.initSpy(); Scroll.initHash(); Scroll.initPlayhead();
    },
    stop() { if (lenis) lenis.stop(); },
    start() { if (lenis && !building()) lenis.start(); },
    /* Smooth-scroll to a selector / element / pixel offset. */
    to(target, opt = {}) {
      const offset = opt.offset === undefined ? -64 : opt.offset;
      const el = typeof target === 'string' ? $(target) : target;
      if (lenis && !opt.immediate && !building()) { lenis.scrollTo(el || target, { offset, duration: opt.duration || 1.3 }); return; }
      let y = typeof target === 'number' ? target : (el ? el.getBoundingClientRect().top + window.scrollY + offset : 0);
      y = Math.max(0, y);
      if (opt.immediate || motionOff()) window.scrollTo(0, y); else window.scrollTo({ top: y, behavior: 'smooth' });
    },
    /* ---------- nav: blurred bar, burger menu, focus trap ---------- */
    initNav() {
      const nav = $('#nav'); if (!nav) return;
      const burger = $('.nav__burger', nav);
      const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
      const setOpen = (open) => {
        nav.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) { const f = $('.nav__link', nav); f && f.focus(); } 
      };
      burger.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
      nav.addEventListener('keydown', (e) => {
        if (!nav.classList.contains('is-open')) return;
        if (e.key === 'Escape') { setOpen(false); burger.focus(); }
        if (e.key === 'Tab') {
          const f = $$('.nav__link, .nav__burger, .nav__talk, .nav__motion', nav).filter((x) => x.offsetParent !== null);
          if (!f.length) return;
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
      Scroll.closeMenu = () => { if (nav.classList.contains('is-open')) setOpen(false); };
    },
    /* ---------- scroll spy: active link + sliding underline ---------- */
    initSpy() {
      const links = $$('.nav__link'), line = $('.nav__underline'); if (!links.length || !line) return;
      const place = (id) => {
        const a = links.find((l) => l.getAttribute('href') === '#' + id);
        links.forEach((l) => l.classList.toggle('is-active', l === a));
        if (!a) { line.style.width = '0px'; return; }
        line.style.width = a.offsetWidth + 'px';
        line.style.transform = `translateX(${a.offsetLeft}px)`;
      };
      Scroll.spyPlace = place;
      if (!('IntersectionObserver' in window)) return;
      let current = '';
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { current = en.target.id; place(current); } });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      SECTIONS.forEach((id) => { const s = document.getElementById(id); s && io.observe(s); });
      window.addEventListener('resize', () => place(current));
    },
    /* ---------- hash routing: no jump, smooth scroll, pushState ---------- */
    initHash() {
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]'); if (!a || e.defaultPrevented) return;
        const h = a.getAttribute('href');
        if (h.length < 2 || h.startsWith('#work/')) return;      // project deep links belong to work.js
        const id = h.slice(1), el = document.getElementById(id); if (!el) return;
        e.preventDefault();
        if (building()) return;
        Scroll.closeMenu && Scroll.closeMenu();
        Scroll.to(el, { offset: id === 'home' ? 0 : -64 });
        try { history.pushState(null, '', h); } catch (err) { /* file:// may refuse */ }
      });
      const top = $('.footer__top');
      top && top.addEventListener('click', () => { if (!building()) Scroll.to(0, { offset: 0 }); });
    },
    /* the hash on first load (called by startSite) */
    gotoHash() {
      const h = location.hash.slice(1); if (!h || h.startsWith('work/')) return;
      const el = document.getElementById(h); if (el) Scroll.to(el, { immediate: true });
    },
    /* ---------- playhead + timecode (7.1) ---------- */
    initPlayhead() {
      const box = $('#scroll-playhead'); if (!box) return;
      const line = $('.ph-line', box), time = $('.ph-time', box);
      const marks = SECTIONS.map((id) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'ph-mark'; b.setAttribute('aria-label', 'Jump to ' + id);
        b.innerHTML = '<span>' + id + '</span>'; b.addEventListener('click', () => { if (!building()) Scroll.to(document.getElementById(id), { offset: id === 'home' ? 0 : -64 }); });
        box.appendChild(b); return b;
      });
      const max = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const layout = () => { SECTIONS.forEach((id, i) => { const s = document.getElementById(id); if (s) marks[i].style.top = Math.min(98, Math.max(2, (s.offsetTop / max()) * 100)) + '%'; }); };
      const pad = (n) => String(n).padStart(2, '0');
      const update = () => {
        const p = Math.min(1, Math.max(0, window.scrollY / max()));
        line.style.height = (p * 100) + '%';
        const f = Math.round(p * 120 * 24), ff = f % 24, s = Math.floor(f / 24), ss = s % 60, mm = Math.floor(s / 60) % 60, hh = Math.floor(s / 3600);
        time.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
      };
      window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', () => { layout(); update(); });
      Scroll.layoutPlayhead = layout; layout(); update();
      setTimeout(layout, 1200); window.addEventListener('load', layout);
    }
  };

  /* ================= scroll reveals ================= */
  const Reveals = {
    done: false,
    init() {
      if (Reveals.done || building() || motionOff() || !('IntersectionObserver' in window)) return;
      Reveals.done = true;
      const vh = window.innerHeight;
      const below = (el) => el.getBoundingClientRect().top > vh * 0.96;     // never hide anything already on screen
      const plan = [
        ['.eyebrow', 'scramble'], ['.h2-line, .h2-bold', 'line'],
        ['.work__filters, .hl__text, .raw__text, .about__text, .contact__text, .cta, .hl__live, .hl__listhead, .journey__resume, .work__controls, .raw__hint, .brief, .footer__mid, .footer__right', 'fade'],
        ['.card, .hl-row, .jr-row, .ms-row, .ct-row, .proc, .edu-row, .sw, .chip', 'fade'],
        ['.hl__panel, .quote, .poster, .raw__stage', 'fade']
      ];
      const io = new IntersectionObserver((entries) => {
        let n = 0;
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target; io.unobserve(el);
          el.style.transitionDelay = (n++ * 0.07) + 's';
          el.classList.add('is-in');
          if (el.dataset.rvKind === 'scramble') Reveals.scramble(el);
          setTimeout(() => { el.style.transitionDelay = ''; }, 1400);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      plan.forEach(([sel, kind]) => {
        $$(sel).forEach((el) => {
          if (el.dataset.rv || !below(el)) return;
          el.dataset.rv = '1'; el.dataset.rvKind = kind;
          el.classList.add(kind === 'line' ? 'rvl' : 'rv');
          io.observe(el);
        });
      });
      // laurels draw in when the big stat scrolls into view
      const big = $('.hl__big');
      if (big && below(big)) { big.classList.add('is-pre'); const lo = new IntersectionObserver((en) => { if (en[0].isIntersecting) { big.classList.add('is-in'); lo.disconnect(); } }, { threshold: 0.4 }); lo.observe(big); }
    },
    /* text scramble: random glyphs for 500 ms, then the real text. Only runs while the swarm is idle. */
    scramble(el) {
      const final = el.dataset.full !== undefined ? el.dataset.full : el.textContent;
      if (motionOff()) return;
      const glyphs = '▮#/\\', t0 = performance.now();
      const step = (now) => {
        if (building()) { el.textContent = final; return; }
        const p = Math.min(1, (now - t0) / 500);
        if (p >= 1) { el.textContent = final; return; }
        let out = ''; for (let i = 0; i < final.length; i++) out += (final[i] === ' ' || i < final.length * p * 0.6) ? final[i] : glyphs[(Math.random() * glyphs.length) | 0];
        el.textContent = out; requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  };

  window.Scroll = Scroll; window.Reveals = Reveals;
})();
