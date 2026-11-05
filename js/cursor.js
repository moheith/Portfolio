/* js/cursor.js — Site cursor + magnetic pull + letter-roll + 3D card tilt & parallax */
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

      const onMouseDown = () => {
        const d = dot();
        if (d) d.classList.add('is-click');
      };

      const onMouseUp = () => {
        const d = dot();
        if (d) d.classList.remove('is-click');
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mousedown', onMouseDown, { passive: true });
      window.addEventListener('mouseup', onMouseUp, { passive: true });

      this.setupMagnetics();
      this.setupCardTilt();
      this.setupHeroParallax();
      this.setupLetterRoll();
    },

    disable() {
      enabled = false;
      document.documentElement.classList.remove('has-cursor');
      if (rafId) cancelAnimationFrame(rafId);
    },

    setupMagnetics() {
      const magneticTargets = [...document.querySelectorAll('.btn, .nav__links a, .footer__social a, .cta, .poster__btn, .hero__live, .nav__motion, .compare__handle')];
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
          btn.style.transform = '';
        });
      });
    },

    setupCardTilt() {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          if (!enabled) return;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotX = -((y - centerY) / centerY) * 5;
          const rotY = ((x - centerX) / centerX) * 5;
          card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px) scale3d(1.015, 1.015, 1.015)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.removeProperty('--mouse-x');
          card.style.removeProperty('--mouse-y');
        });
      });
    },

    setupHeroParallax() {
      const hero = document.getElementById('home');
      const img = document.getElementById('heroImg');
      const glow = document.querySelector('.hero__glow');
      if (!hero || !img) return;

      hero.addEventListener('mousemove', (e) => {
        if (!enabled) return;
        const rect = hero.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        const shiftX = (relX * 12).toFixed(2);
        const shiftY = (relY * 8).toFixed(2);
        img.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) scale(1.02)`;
        img.style.transition = 'transform 0.15s ease-out';
        if (glow) {
          glow.style.transform = `translate(calc(-50% + ${shiftX * 1.5}px), calc(-50% + ${shiftY * 1.5}px))`;
          glow.style.transition = 'transform 0.2s ease-out';
        }
      });

      hero.addEventListener('mouseleave', () => {
        img.style.transform = '';
        img.style.transition = 'transform 0.5s ease-out';
        if (glow) {
          glow.style.transform = 'translate(-50%, -50%)';
          glow.style.transition = 'transform 0.5s ease-out';
        }
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
