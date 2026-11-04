/* js/journey.js — accordion timeline (one open at a time) + the red spine that draws with scroll. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const building = () => window.Swarm && Swarm.state === 'building';
  const motionOff = () => document.documentElement.dataset.motion === 'off';

  function open(row, on) {
    row.classList.toggle('is-open', on);
    const b = $('.jr-row__btn', row); b && b.setAttribute('aria-expanded', String(on));
  }
  /* scaleY of a spine follows how far its container has been scrolled through (scrub) */
  function scrub(spine, box, startFrac, endFrac) {
    if (!spine || !box) return;
    const upd = () => {
      if (building() || motionOff()) { spine.style.removeProperty('--p'); return; }
      const r = box.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * startFrac - r.top) / Math.max(1, r.height + vh * (startFrac - endFrac))));
      spine.style.setProperty('--p', p.toFixed(3));
    };
    window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    return upd;
  }

  const Journey = {
    init() {
      if (Journey._init) return; Journey._init = true;
      const rows = $$('.jr-row'); if (!rows.length) return;
      rows.forEach((row) => {
        const b = $('.jr-row__btn', row);
        b.addEventListener('click', () => {
          if (building()) return;
          const was = row.classList.contains('is-open');
          rows.forEach((r) => open(r, false));
          open(row, !was);
        });
      });
    },
    startSite() {
      // the journey spine and the process spine draw in with scroll, and each process node lights up when reached
      const upd1 = scrub($('.jr__spine'), $('.journey__list'), 0.85, 0.35);
      const upd2 = scrub($('.proc__spine'), $('.procs'), 0.85, 0.35);
      const procs = $$('.proc');
      const lit = () => { const vh = window.innerHeight; procs.forEach((p) => { p.classList.toggle('is-lit', p.getBoundingClientRect().top < vh * 0.78); }); };
      window.addEventListener('scroll', lit, { passive: true }); lit();
      document.addEventListener('swarmstate', (e) => { if (e.detail === 'building') { [upd1, upd2].forEach((f) => f && f()); } });
    }
  };
  document.addEventListener('DOMContentLoaded', Journey.init); if (document.readyState !== 'loading') Journey.init();
  window.Journey = Journey;
})();
