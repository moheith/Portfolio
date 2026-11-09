/* js/hero.js — fitText, parallax, spotlight, countUp, laurel */
(() => {
  'use strict';

  let parallaxActive = false;
  let mouseParallaxX = 0, mouseParallaxY = 0;
  let targetParallaxX = 0, targetParallaxY = 0;

  const Hero = {
    init() {
      this.fit();
      window.addEventListener('resize', () => {
        clearTimeout(this._resizeTimer);
        this._resizeTimer = setTimeout(() => this.fit(), 100);
      }, { passive: true });

      const heroImg = document.getElementById('heroImg');
      const fallback = document.querySelector('.hero__fallback');
      if (heroImg) {
        heroImg.addEventListener('error', () => {
          heroImg.style.display = 'none';
          if (fallback) fallback.style.display = 'block';
        });
        heroImg.addEventListener('load', () => {
          heroImg.classList.add('is-loaded');
        });
      }
    },

    fit() {
      const giant = document.getElementById('giant');
      if (!giant) return;
      const targetWidth = window.innerWidth * 0.94;
      
      // Binary search for exact font-size
      let low = 40, high = 600, best = 160;
      for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2;
        giant.style.fontSize = `${mid}px`;
        const w = giant.scrollWidth;
        if (w <= targetWidth) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }
      giant.style.fontSize = `${best}px`;
    },

    afterIntro(how) {
      if (document.documentElement.getAttribute('data-motion') === 'off') return;
      this.setupParallaxAndSpotlight();
    },

    setupParallaxAndSpotlight() {
      if (parallaxActive) return;
      parallaxActive = true;

      const giant = document.getElementById('giant');
      const photo = document.querySelector('.hero__photo');

      // Mouse Parallax & Spotlight
      window.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        targetParallaxX = ((e.clientX - cx) / cx) * 26;
        targetParallaxY = ((e.clientY - cy) / cy) * 14;
      }, { passive: true });

      const loop = () => {
        if (!parallaxActive) return;
        mouseParallaxX += (targetParallaxX - mouseParallaxX) * 0.08;
        mouseParallaxY += (targetParallaxY - mouseParallaxY) * 0.08;

        const scrollY = window.scrollY;
        if (giant) {
          giant.style.transform = `translate3d(${mouseParallaxX}px, ${mouseParallaxY + scrollY * 0.15}px, 0)`;
        }
        if (photo) {
          const base = window.innerWidth <= 640 ? '0px' : '-50%'; /* centred on desktop, in-flow on phones */
          photo.style.transform = `translate3d(calc(${base} + ${mouseParallaxX * 0.5}px), ${scrollY * 0.05}px, 0)`;
        }

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },

    countUp(el, to) {
      if (!el || el.dataset.counted) return;
      el.dataset.counted = 'true';

      const raw = to !== undefined ? String(to) : (el.dataset.count || el.textContent || '0');
      const targetNum = parseFloat(raw.replace(/[^\d.]/g, '')) || 0;
      const suffix = raw.includes('+') ? '+' : (raw.includes('%') ? '%' : '');

      if (document.documentElement.getAttribute('data-motion') === 'off') {
        el.textContent = targetNum + suffix;
        return;
      }

      const duration = 1400;
      const start = performance.now();
      const isDecimal = raw.includes('.');

      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
        const current = isDecimal ? (targetNum * ease).toFixed(1) : Math.round(targetNum * ease);
        el.textContent = current + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
      }
      requestAnimationFrame(tick);
    },

    laurel() {
      if (document.documentElement.getAttribute('data-motion') === 'off') return;
      const laurels = document.querySelectorAll('.laurel path');
      laurels.forEach(p => {
        try {
          const len = p.getTotalLength();
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
          p.getBoundingClientRect(); // force reflow
          p.style.transition = 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)';
          p.style.strokeDashoffset = '0';
        } catch (e) {}
      });
    }
  };

  window.Hero = Hero;
})();
