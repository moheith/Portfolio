/* js/cursor.js — Site cursor + magnetic pull + letter-roll */
(() => {
  'use strict';

  let enabled = false;
  let rafId = null;
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let currentLabel = '';

  const dot = () => document.getElementById('cursorDot');
  const ring = () => document.getElementById('cursorRing');
  const ringSpan = () => ring() ? ring().querySelector('span') : null;

  const SiteCursor = {
    init() {
      // Intentionally do nothing visible before intro completes
    },

    enable() {
      if (enabled) return;
      if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
      if (document.documentElement.getAttribute('data-motion') === 'off') return;

      enabled = true;
      document.documentElement.classList.add('has-cursor');

      const onMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        const d = dot();
        if (d) {
          d.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
      };

      const loop = () => {
        if (!enabled) return;
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        const r = ring();
        if (r) {
          r.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        }
        rafId = requestAnimationFrame(loop);
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      rafId = requestAnimationFrame(loop);

      // Context labels
      document.addEventListener('mouseover', (e) => {
        if (!enabled) return;
        const card = e.target.closest('.card');
        const openLink = e.target.closest('a[href^="http"], .hero__live, .poster__btn, .cta');
        const dragArea = e.target.closest('.slider, .compare');
        const closeBtn = e.target.closest('.modal__close');

        const r = ring();
        const span = ringSpan();
        if (!r || !span) return;

        if (card) {
          currentLabel = 'VIEW';
          r.style.width = '80px';
          r.style.height = '80px';
          r.style.margin = '-40px 0 0 -40px';
          r.style.background = 'rgba(255, 59, 48, .2)';
          r.style.borderColor = 'var(--red)';
          span.textContent = currentLabel;
          span.style.opacity = '1';
        } else if (openLink) {
          currentLabel = 'OPEN';
          r.style.width = '56px';
          r.style.height = '56px';
          r.style.margin = '-28px 0 0 -28px';
          r.style.background = 'rgba(255, 59, 48, .15)';
          r.style.borderColor = 'var(--red)';
          span.textContent = currentLabel;
          span.style.opacity = '1';
        } else if (dragArea) {
          currentLabel = 'DRAG';
          r.style.width = '56px';
          r.style.height = '56px';
          r.style.margin = '-28px 0 0 -28px';
          r.style.background = 'rgba(47, 140, 255, .2)';
          r.style.borderColor = 'var(--blue)';
          span.textContent = currentLabel;
          span.style.opacity = '1';
        } else if (closeBtn) {
          currentLabel = '✕';
          r.style.width = '44px';
          r.style.height = '44px';
          r.style.margin = '-22px 0 0 -22px';
          r.style.background = 'rgba(255, 59, 48, .3)';
          r.style.borderColor = 'var(--red)';
          span.textContent = currentLabel;
          span.style.opacity = '1';
        } else {
          currentLabel = '';
          r.style.width = '36px';
          r.style.height = '36px';
          r.style.margin = '-18px 0 0 -18px';
          r.style.background = 'transparent';
          r.style.borderColor = 'rgba(255, 255, 255, .5)';
          span.textContent = '';
          span.style.opacity = '0';
        }
      });

      this.setupMagnetics();
      this.setupLetterRoll();
    },

    disable() {
      enabled = false;
      document.documentElement.classList.remove('has-cursor');
      if (rafId) cancelAnimationFrame(rafId);
    },

    setupMagnetics() {
      const magneticTargets = [...document.querySelectorAll('.btn, .nav__links a, .footer__social a, .cta, .poster__btn')];
      magneticTargets.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          if (!enabled) return;
          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
          if (dist < 90) {
            const pullX = ((e.clientX - centerX) / 90) * 8;
            const pullY = ((e.clientY - centerY) / 90) * 8;
            btn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
          }
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate3d(0, 0, 0)';
        });
      });
    },

    setupLetterRoll() {
      // Nav links letter-roll hover
      const links = document.querySelectorAll('.nav__links a > span');
      links.forEach(span => {
        span.setAttribute('data-text', span.textContent);
      });
    }
  };

  window.SiteCursor = SiteCursor;
})();
