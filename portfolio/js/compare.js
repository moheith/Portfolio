/* js/compare.js — Before/After slider with pointer + keyboard + auto-demo */
(() => {
  'use strict';

  let touched = false;
  let demoPlayed = false;

  const Compare = {
    init() {
      const el = document.getElementById('compare');
      if (!el) return;

      this.set(50);
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'slider');
      el.setAttribute('aria-valuemin', '0');
      el.setAttribute('aria-valuemax', '100');
      el.setAttribute('aria-valuenow', '50');
      el.setAttribute('aria-label', 'Compare wireframe and final UI');

      let isDown = false;

      const onPointerMove = (e) => {
        if (!isDown) return;
        const rect = el.getBoundingClientRect();
        const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
        const pct = (x / rect.width) * 100;
        this.set(pct);
      };

      const onPointerUp = (e) => {
        if (!isDown) return;
        isDown = false;
        try { el.releasePointerCapture(e.pointerId); } catch (err) {}
      };

      el.addEventListener('pointerdown', (e) => {
        touched = true;
        isDown = true;
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
        onPointerMove(e);
      });

      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);

      el.addEventListener('keydown', (e) => {
        const cur = parseFloat(el.getAttribute('aria-valuenow')) || 50;
        if (e.key === 'ArrowLeft') {
          touched = true;
          this.set(Math.max(0, cur - 5));
        } else if (e.key === 'ArrowRight') {
          touched = true;
          this.set(Math.min(100, cur + 5));
        } else if (e.key === 'Home') {
          touched = true;
          this.set(0);
        } else if (e.key === 'End') {
          touched = true;
          this.set(100);
        }
      });
    },

    set(pct) {
      const el = document.getElementById('compare');
      if (!el) return;
      const clamped = Math.min(100, Math.max(0, pct));
      el.style.setProperty('--pos', `${clamped}%`);
      el.setAttribute('aria-valuenow', Math.round(clamped));
    },

    demo() {
      if (demoPlayed || touched) return;
      if (document.documentElement.getAttribute('data-motion') === 'off') return;
      demoPlayed = true;

      const duration = 2400;
      const start = performance.now();

      const tick = (now) => {
        if (touched) return;
        const t = Math.min(1, (now - start) / duration);
        // sinusoidal wave 50 -> 15 -> 85 -> 50
        const wave = Math.sin(t * Math.PI * 2);
        const val = 50 + wave * 35;
        this.set(val);
        if (t < 1) requestAnimationFrame(tick);
        else this.set(50);
      };
      requestAnimationFrame(tick);
    }
  };

  window.Compare = Compare;
})();
