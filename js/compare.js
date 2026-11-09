/* js/compare.js — "From sketch to shipped": drag / keyboard / touch slider between the blueprint and the real Yulya Studio UI.
   Extras: a cinematic auto-sweep the first time it scrolls into view, annotation pins that pop as the divider passes them,
   and a gentle 3D tilt + glare that follows the pointer (fine pointers only, never during the swarm build). */
(() => {
  'use strict';

  let touched = false;
  let demoPlayed = false;
  let raf = 0;
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const motionOff = () => document.documentElement.getAttribute('data-motion') === 'off' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const Compare = {
    init() {
      const el = document.getElementById('compare');
      if (!el || el._ready) return;
      el._ready = true;
      this.el = el;
      this.pins = [...el.querySelectorAll('.pin')];
      this.set(50);

      let isDown = false;
      const posFrom = (e) => { const r = el.getBoundingClientRect(); return (Math.min(r.width, Math.max(0, e.clientX - r.left)) / r.width) * 100; };

      el.addEventListener('pointerdown', (e) => {
        touched = true; cancelAnimationFrame(raf);
        isDown = true; el.classList.add('is-drag');
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
        this.set(posFrom(e));
      });
      el.addEventListener('pointermove', (e) => {
        if (isDown) this.set(posFrom(e));
        else if (e.pointerType === 'mouse') this.tilt(e);
      });
      const up = (e) => { if (!isDown) return; isDown = false; el.classList.remove('is-drag'); try { el.releasePointerCapture(e.pointerId); } catch (err) {} };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });

      el.addEventListener('keydown', (e) => {
        const cur = parseFloat(el.getAttribute('aria-valuenow')) || 50;
        const k = e.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'Home' || k === 'End') {
          touched = true; cancelAnimationFrame(raf); e.preventDefault();
          this.set(k === 'Home' ? 0 : k === 'End' ? 100 : Math.min(100, Math.max(0, cur + (k === 'ArrowLeft' ? -5 : 5))));
        }
      });

      /* start the sweep the first time the section is really on screen (covers ?swarm=off, "Go live" and reloads) */
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((en) => {
          if (en.some((x) => x.isIntersecting) && !document.documentElement.classList.contains('is-building')) { io.disconnect(); this.demo(); }
        }, { threshold: 0.5 });
        io.observe(el);
      }
    },

    tilt(e) {
      const el = this.el; if (!el || motionOff()) return;
      const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', ((px - .5) * 5).toFixed(2) + 'deg');
      el.style.setProperty('--ry', ((.5 - py) * 3.5).toFixed(2) + 'deg');
      el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    },

    set(pct) {
      const el = this.el || document.getElementById('compare');
      if (!el) return;
      const v = Math.min(100, Math.max(0, pct));
      el.style.setProperty('--pos', `${v}%`);
      el.setAttribute('aria-valuenow', Math.round(v));
      const pins = this.pins || [];
      for (let i = 0; i < pins.length; i++) pins[i].classList.toggle('is-on', +pins[i].dataset.x > v + 1.5);
    },

    /* blueprint → shipped: starts fully drawn, sweeps right-to-left revealing the real UI (pins pop in as it passes), then settles in the middle */
    demo() {
      if (demoPlayed || touched) return;
      demoPlayed = true;
      if (!this.el) this.init();
      if (motionOff()) { this.set(30); return; }
      const t0 = performance.now(), D1 = 3600, D2 = 900;
      this.set(100);
      const tick = (now) => {
        if (touched) return;
        const t = now - t0;
        if (t < D1) this.set(100 - 100 * ease(t / D1));
        else if (t < D1 + D2) this.set(0 + 52 * ease((t - D1) / D2));
        else { this.set(52); return; }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
  };

  window.Compare = Compare;
})();
