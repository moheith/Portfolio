/* js/journey.js — Accordion Timeline Toggles, Accessible ARIA & Scroll Spine Scrub */

(function () {
  'use strict';

  const Journey = {
    init() {
      this.initAccordion();
      this.initSpineScrub();
    },

    /* =====================================================================
       Accordion Interactivity (Single Open, Grid Transition, ARIA Sync)
    ===================================================================== */
    initAccordion() {
      const rows = Array.from(document.querySelectorAll('.jr-rows .jr-row'));
      if (!rows.length) return;

      rows.forEach((row) => {
        const btn = row.querySelector('.jr-row__btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
          const wasOpen = row.classList.contains('is-open');

          // Close all rows
          rows.forEach((r) => {
            r.classList.remove('is-open');
            const b = r.querySelector('.jr-row__btn');
            if (b) b.setAttribute('aria-expanded', 'false');
          });

          // If was closed, open this one
          if (!wasOpen) {
            row.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    },

    /* =====================================================================
       Scroll Spine Progress Scrub
    ===================================================================== */
    initSpineScrub() {
      const spine = document.querySelector('.jr__spine');
      const journeySec = document.getElementById('journey');
      if (!spine || !journeySec) return;

      const updateSpine = () => {
        if (window.Swarm && window.Swarm.state === 'building') return;

        const rect = journeySec.getBoundingClientRect();
        const winH = window.innerHeight;
        // Progress through journey section
        const totalDist = rect.height;
        const currentDist = winH * 0.7 - rect.top;
        const progress = Math.min(1, Math.max(0, currentDist / totalDist));

        spine.style.transform = `scaleY(${progress.toFixed(3)})`;
        spine.style.transformOrigin = 'top center';
      };

      window.addEventListener('scroll', updateSpine, { passive: true });
      updateSpine();
    },
  };

  window.Journey = Journey;
})();
