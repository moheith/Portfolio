/* js/journey.js — Single-open accordion with keyboard navigation */
(() => {
  'use strict';

  const Journey = {
    init() {
      const items = [...document.querySelectorAll('.tl__item')];
      const heads = items.map(it => it.querySelector('.tl__head')).filter(Boolean);

      heads.forEach((head, index) => {
        head.addEventListener('click', () => {
          const item = items[index];
          const isOpen = item.classList.contains('is-open');

          // Close all items
          items.forEach(it => {
            it.classList.remove('is-open');
            const h = it.querySelector('.tl__head');
            if (h) h.setAttribute('aria-expanded', 'false');
          });

          // If was not open, open this one (single-open behavior)
          if (!isOpen) {
            item.classList.add('is-open');
            head.setAttribute('aria-expanded', 'true');
          }
        });

        head.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = heads[(index + 1) % heads.length];
            if (next) next.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = heads[(index - 1 + heads.length) % heads.length];
            if (prev) prev.focus();
          }
        });
      });
    }
  };

  window.Journey = Journey;
})();
