/* js/cursor.js — Custom Site Cursor, Context States & Magnetic Pull */

(function () {
  'use strict';

  let isEnabled = false;
  let dotEl = null;
  let ringEl = null;
  let labelEl = null;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  const Cursor = {
    enable() {
      // Check reduced motion or no hover
      if (
        isEnabled ||
        window.matchMedia('(hover: none)').matches ||
        document.documentElement.getAttribute('data-motion') === 'off' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      isEnabled = true;
      document.body.classList.add('cursor-active');

      // Create cursor elements if missing
      if (!dotEl) {
        dotEl = document.createElement('div');
        dotEl.className = 'cursor-dot';
        document.body.appendChild(dotEl);

        ringEl = document.createElement('div');
        ringEl.className = 'cursor-ring';
        labelEl = document.createElement('span');
        labelEl.className = 'cursor-ring-label';
        ringEl.appendChild(labelEl);
        document.body.appendChild(ringEl);
      }

      this.tagElements();
      this.bindEvents();
      this.initMagnetics();
      this.loop();
    },

    tagElements() {
      // Opt-in elements per Part 10.3
      document.querySelectorAll('.card__link').forEach((el) => el.setAttribute('data-cursor', 'view'));
      document.querySelectorAll('.hero__demo, .poster').forEach((el) => el.setAttribute('data-cursor', 'open'));
      document.querySelectorAll('.work__slider, .raw__stage').forEach((el) => el.setAttribute('data-cursor', 'drag'));
      document.querySelectorAll('.modal-close').forEach((el) => el.setAttribute('data-cursor', 'close'));
    },

    bindEvents() {
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (dotEl) {
          dotEl.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        }

        // Context state lookup
        const target = e.target.closest('[data-cursor]');
        if (target) {
          const mode = target.getAttribute('data-cursor');
          document.body.setAttribute('data-cursor-state', mode);
          if (labelEl) {
            labelEl.textContent = mode === 'close' ? '×' : mode.toUpperCase();
          }
        } else {
          document.body.removeAttribute('data-cursor-state');
          if (labelEl) labelEl.textContent = '';
        }
      });

      window.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
      });

      window.addEventListener('mouseenter', () => {
        if (isEnabled) document.body.classList.add('cursor-active');
      });
    },

    loop() {
      if (!isEnabled) return;
      // Lerp ring towards mouse (.18)
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringEl) {
        ringEl.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }

      requestAnimationFrame(() => Cursor.loop());
    },

    /* =====================================================================
       Magnetic Buttons Pull (GSAP quickTo / lerp within 90px radius)
    ===================================================================== */
    initMagnetics() {
      const magneticTargets = document.querySelectorAll(
        '.hero__cta, .cta, .nav__talk, .nav__logo, .slider__btn, .accent-dot, .brief__icon, .footer__top'
      );

      magneticTargets.forEach((target) => {
        let xTo = null;
        let yTo = null;

        if (window.gsap) {
          xTo = window.gsap.quickTo(target, 'x', { duration: 0.35, ease: 'power2.out' });
          yTo = window.gsap.quickTo(target, 'y', { duration: 0.35, ease: 'power2.out' });
        }

        const handleMove = (e) => {
          const rect = target.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

          if (dist < 90) {
            const pullFactor = (1 - dist / 90) * 8; // max 8-10px
            const dx = (e.clientX - centerX) * (pullFactor / 90);
            const dy = (e.clientY - centerY) * (pullFactor / 90);

            if (xTo && yTo) {
              xTo(dx);
              yTo(dy);
            } else {
              target.style.transform = `translate(${dx}px, ${dy}px)`;
            }
          }
        };

        const handleLeave = () => {
          if (xTo && yTo) {
            xTo(0);
            yTo(0);
          } else {
            target.style.transform = 'translate(0, 0)';
          }
        };

        window.addEventListener('mousemove', handleMove);
        target.addEventListener('mouseleave', handleLeave);
      });
    },
  };

  window.Cursor = Cursor;
})();
