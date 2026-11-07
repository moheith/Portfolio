/* js/scroll.js — Lenis + ScrollTrigger + spy + playhead + Reveals */
(() => {
  'use strict';

  let lenisInstance = null;
  let isStopped = false;

  const Scroll = {
    init() {
      // 1. Initialize Lenis if available
      if (typeof window.Lenis !== 'undefined') {
        try {
          lenisInstance = new Lenis({
            lerp: 0.09,
            smoothWheel: true
          });
          if (window.gsap && window.ScrollTrigger) {
            lenisInstance.on('scroll', window.ScrollTrigger.update);
            window.gsap.ticker.add((time) => {
              lenisInstance.raf(time * 1000);
            });
            window.gsap.ticker.lagSmoothing(0);
          } else {
            function raf(time) {
              lenisInstance.raf(time);
              requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
          }
        } catch (e) {
          console.warn('[Scroll] Lenis init failed, using native:', e);
        }
      }

      this.setupSpyAndPlayhead();
      this.setupAnchors();
      this.setupMenu();
    },

    start() {
      isStopped = false;
      if (lenisInstance) {
        try { lenisInstance.start(); } catch (e) {}
      }
    },

    stop() {
      isStopped = true;
      if (lenisInstance) {
        try { lenisInstance.stop(); } catch (e) {}
      }
    },

    to(target, opts = {}) {
      const offset = opts.offset !== undefined ? opts.offset : -64;
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;

      if (opts.immediate) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'auto' });
        return;
      }

      if (lenisInstance && !isStopped) {
        lenisInstance.scrollTo(el, { offset });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    },

    toHash(hash, immediate = false) {
      if (!hash) return;
      if (hash.startsWith('#work/') && window.Work) {
        const slug = hash.replace('#work/', '');
        this.to('#work', { immediate });
        setTimeout(() => window.Work.open && window.Work.open(slug), 100);
        return;
      }
      this.to(hash, { immediate });
    },

    setupSpyAndPlayhead() {
      const sections = ['#home', '#work', '#logos', '#proof', '#raw', '#about', '#journey', '#contact']
        .map(id => document.querySelector(id))
        .filter(Boolean);

      const navLinks = [...document.querySelectorAll('.nav__links a[data-spy]')];
      const navUnderline = document.querySelector('.nav__underline');
      const navLinksContainer = document.querySelector('.nav__links');
      const playheadFill = document.getElementById('playheadFill');
      const playheadReadout = document.getElementById('playheadReadout');

      function updateUnderline(activeLink) {
        if (!activeLink || !navUnderline || !navLinksContainer) return;
        const cRect = navLinksContainer.getBoundingClientRect();
        const lRect = activeLink.getBoundingClientRect();
        const x = lRect.left - cRect.left;
        const w = lRect.width;
        navLinksContainer.style.setProperty('--ul-x', `${x}px`);
        navLinksContainer.style.setProperty('--ul-w', `${w}px`);
      }

      function update() {
        const scrollY = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docH > 0 ? Math.min(100, Math.max(0, (scrollY / docH) * 100)) : 0;

        if (playheadFill) {
          playheadFill.style.height = `${progress}%`;
        }

        // Determine active section
        let currentSec = sections[0];
        const vpH = window.innerHeight;
        for (const sec of sections) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= vpH * 0.45 && rect.bottom >= 0) {
            currentSec = sec;
          }
        }

        if (currentSec) {
          const id = currentSec.id;
          const name = id.toUpperCase();
          if (playheadReadout) {
            const pctStr = String(Math.round(progress)).padStart(3, '0');
            playheadReadout.textContent = `${pctStr}% · ${name === 'HOME' ? 'HOME' : name}`;
          }

          // Active nav link
          let activeLink = null;
          navLinks.forEach(link => {
            const match = link.getAttribute('data-spy') === id;
            link.classList.toggle('is-active', match);
            if (match) activeLink = link;
          });
          if (activeLink) updateUnderline(activeLink);
        }
      }

      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      setTimeout(update, 200);
    },

    setupAnchors() {
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (href === '#' || href === '') return;
        if (href.startsWith('#work/')) return; // handled by work.js
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          this.to(target);
          if (history.pushState) history.pushState(null, '', href);
        }
      });
    },

    setupMenu() {
      const burger = document.getElementById('burger');
      const menu = document.getElementById('menu');
      if (!burger || !menu) return;

      function openMenu() {
        burger.setAttribute('aria-expanded', 'true');
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false'); menu.removeAttribute('inert');
      }
      function closeMenu() {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true'); menu.setAttribute('inert', '');
      }

      burger.addEventListener('click', () => {
        const isOpen = menu.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
      });

      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
      });
    }
  };

  const Reveals = {
    init() {
      if (document.documentElement.getAttribute('data-motion') === 'off') {
        this.initQuiet();
        return;
      }
      this.initQuiet();
    },

    initQuiet() {
      // Wire spines and step nodes without hiding content
      const processSpine = document.querySelector('.process__spine');
      const journeySpine = document.querySelector('.tl__spine');
      const stepNodes = [...document.querySelectorAll('.step__node')];

      function updateSpines() {
        if (processSpine) {
          const rect = processSpine.parentElement.getBoundingClientRect();
          const vh = window.innerHeight;
          const prog = Math.min(1, Math.max(0, (vh * 0.7 - rect.top) / rect.height));
          processSpine.style.transform = `scaleY(${prog})`;
        }
        if (journeySpine) {
          const rect = journeySpine.parentElement.getBoundingClientRect();
          const vh = window.innerHeight;
          const prog = Math.min(1, Math.max(0, (vh * 0.7 - rect.top) / rect.height));
          journeySpine.style.transform = `scaleY(${prog})`;
        }
        stepNodes.forEach(node => {
          const r = node.getBoundingClientRect();
          if (r.top <= window.innerHeight * 0.75) {
            node.classList.add('is-lit');
          }
        });
      }

      window.addEventListener('scroll', updateSpines, { passive: true });
      updateSpines();
    }
  };

  window.Scroll = Scroll;
  window.Reveals = Reveals;
})();
