/* js/work.js — filters, FLIP, search, slider, modal, marquee */
(() => {
  'use strict';

  let currentCategory = 'All';
  let searchQuery = '';
  let activeFilteredList = [];
  let lastFocusedEl = null;

  const Work = {
    init() {
      activeFilteredList = [...CONTENT.projects];
      this.wireTabs();
      this.wireSearch();
      this.wireSlider();
      this.wireCardClicks();
      this.wireTilt();
      this.checkHash();
      window.addEventListener('hashchange', () => this.checkHash());
    },

    wireTabs() {
      const tabs = document.querySelectorAll('.tab[data-filter]');
      const underline = document.querySelector('.tabs__underline');
      const tabsContainer = document.querySelector('.tabs');

      const updateUnderline = (tab) => {
        if (!tab || !underline || !tabsContainer) return;
        const cRect = tabsContainer.getBoundingClientRect();
        const tRect = tab.getBoundingClientRect();
        tabsContainer.style.setProperty('--ul-x', `${tRect.left - cRect.left + tabsContainer.scrollLeft}px`);
        tabsContainer.style.setProperty('--ul-w', `${tRect.width}px`);
      };

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          if (document.documentElement.classList.contains('is-building')) return;
          tabs.forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');
          currentCategory = tab.getAttribute('data-filter') || 'All';
          updateUnderline(tab);
          this.filter();
        });
      });

      const initialActive = document.querySelector('.tab.is-active') || tabs[0];
      if (initialActive) updateUnderline(initialActive);
    },

    wireSearch() {
      const input = document.getElementById('search') || document.querySelector('.search input, #search');
      if (!input) return;
      input.addEventListener('input', (e) => {
        if (document.documentElement.classList.contains('is-building')) return;
        searchQuery = e.target.value.trim().toLowerCase();
        this.filter();
      });
    },

    filter() {
      const q = searchQuery;
      activeFilteredList = CONTENT.projects.filter(p => {
        const matchesCat = (currentCategory === 'All') || (p.cats && p.cats.includes(currentCategory));
        if (!matchesCat) return false;
        if (!q) return true;
        const haystack = `${p.title} ${p.stack} ${(p.cats || []).join(' ')} ${p.desc}`.toLowerCase();
        return haystack.includes(q);
      });

      // Render cards with FLIP animation
      Render.cards(activeFilteredList);
      this.wireCardClicks();
      this.wireTilt();

      // empty state
      const host = document.getElementById('cards');
      if (host && !activeFilteredList.length) {
        host.innerHTML = `<div class="work__empty" role="status"><b>No projects match${q ? ' “' + Render.esc(searchQuery) + '”' : ''}.</b><span>Try another word, or clear the filters.</span><button type="button" class="work__clear">Clear filters</button></div>`;
        host.querySelector('.work__clear').addEventListener('click', () => {
          const inp = document.querySelector('#search, .work__search input, input[type=search]');
          if (inp) inp.value = '';
          searchQuery = '';
          const all = document.querySelector('.tab[data-filter="All"]');
          if (all) all.click(); else this.filter();
          if (inp) inp.focus();
        });
      }

      // Highlight matched letters in card titles if search query is active
      if (q) {
        document.querySelectorAll('.card__title').forEach(titleEl => {
          const raw = titleEl.textContent;
          const idx = raw.toLowerCase().indexOf(q);
          if (idx !== -1) {
            const before = raw.slice(0, idx);
            const match = raw.slice(idx, idx + q.length);
            const after = raw.slice(idx + q.length);
            titleEl.innerHTML = `${Render.esc(before)}<mark>${Render.esc(match)}</mark>${Render.esc(after)}`;
          }
        });
      }
    },

    wireSlider() {
      const slider = document.getElementById('slider');
      const prevBtn = document.getElementById('prev');
      const nextBtn = document.getElementById('next');
      if (!slider) return;

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const card = slider.querySelector('.card');
          const step = card ? card.offsetWidth + 24 : 340;
          slider.scrollBy({ left: -step, behavior: 'smooth' });
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const card = slider.querySelector('.card');
          const step = card ? card.offsetWidth + 24 : 340;
          slider.scrollBy({ left: step, behavior: 'smooth' });
        });
      }

      // Pointer drag scrolling with inertia
      let isDown = false;
      let startX = 0, scrollLeft = 0;
      let velX = 0, lastX = 0, lastTime = 0;

      slider.addEventListener('pointerdown', (e) => {
        if (document.documentElement.classList.contains('is-building')) return;
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        lastX = e.pageX;
        lastTime = performance.now();
        velX = 0;
      });

      slider.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX);
        slider.scrollLeft = scrollLeft - walk;

        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) {
          velX = (e.pageX - lastX) / dt;
          lastX = e.pageX;
          lastTime = now;
        }
      });

      const stopDrag = () => {
        if (!isDown) return;
        isDown = false;
        // inertia glide
        let momentum = velX * 180;
        if (Math.abs(momentum) > 20) {
          slider.scrollBy({ left: -momentum, behavior: 'smooth' });
        }
      };

      slider.addEventListener('pointerup', stopDrag);
      slider.addEventListener('pointerleave', stopDrag);
    },

    wireCardClicks() {
      document.querySelectorAll('.card[data-slug]').forEach(card => {
        card.addEventListener('click', () => {
          if (document.documentElement.classList.contains('is-building')) return;
          const slug = card.getAttribute('data-slug');
          this.open(slug);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const slug = card.getAttribute('data-slug');
            this.open(slug);
          }
        });
      });
    },

    wireTilt() {
      document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          if (document.documentElement.classList.contains('is-building')) return;
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty('--rx', `${-y * 8}deg`);
          card.style.setProperty('--ry', `${x * 8}deg`);
        });
        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        });
      });
    },

    checkHash() {
      const q = new URLSearchParams(location.search);
      const paramSlug = q.get('work') || q.get('project');
      const hash = location.hash;
      if (paramSlug) {
        this.open(paramSlug);
      } else if (hash && hash.startsWith('#work/')) {
        const slug = hash.replace('#work/', '');
        this.open(slug);
      } else {
        const m = document.getElementById('modal');
        if (m && m.classList.contains('is-open') && m._close) m._close(true);
      }
    },

    open(slug) {
      const p = CONTENT.projects.find(item => item.slug === slug);
      if (!p) return;

      lastFocusedEl = document.activeElement;
      const modal = document.getElementById('modal');
      if (!modal) return;

      const mediaHtml = p.video
        ? `<video src="${p.video}" controls playsinline autoplay loop></video>`
        : p.img
          ? `<img src="${p.img}" alt="${Render.esc(p.title)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'modal__poster',innerHTML:'<span class=card__initials>${p.n}</span>'}))">`
          : `<div class="modal__poster card__media--inline">${Render.posterHTML(p)}</div>`;

      const liveBtn = p.url
        ? `<a class="btn btn--primary" href="${p.url}" target="_blank" rel="noopener"><span>Live Project ↗</span></a>`
        : '';
      const codeBtn = p.repo
        ? `<a class="btn" style="border:1px solid var(--line-strong)" href="${p.repo}" target="_blank" rel="noopener"><span>Code Repo ↗</span></a>`
        : '';

      const stackChips = (p.stack || '').split('·').map(s => `<span>${Render.esc(s.trim())}</span>`).join('');

      modal.innerHTML = `
        <div class="modal__backdrop" aria-hidden="true"></div>
        <div class="modal__box" role="document">
          <button class="modal__close" type="button" aria-label="Close modal">✕</button>
          <div class="modal__media">${mediaHtml}</div>
          <div class="modal__content">
            <span class="modal__meta">${Render.esc(p.meta)} · ${Render.esc(p.tag || '')}</span>
            <h2 class="modal__title">${Render.esc(p.title)}</h2>
            <p class="modal__desc">${Render.esc(p.desc || '')}</p>
            <div class="modal__stack">${stackChips}</div>
            <div class="modal__actions">${liveBtn} ${codeBtn}</div>
          </div>
        </div>
      `;

      const wasOpen = modal.classList.contains('is-open');
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (location.hash !== `#work/${slug}`) { if (wasOpen && history.replaceState) history.replaceState(null, '', `#work/${slug}`); else if (history.pushState) history.pushState(null, '', `#work/${slug}`); }

      const close = (fromHistory) => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = '';
        document.body.style.overflow = '';
        if (fromHistory !== true && history.replaceState) history.replaceState(null, '', '#work');
        if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
      };

      modal._close = close;
      modal.querySelector('.modal__close').addEventListener('click', () => close());
      modal.querySelector('.modal__backdrop').addEventListener('click', close);

      const onKeyDown = (e) => {
        if (!modal.classList.contains('is-open')) {
          window.removeEventListener('keydown', onKeyDown);
          return;
        }
        if (e.key === 'Escape') close();
      };
      window.addEventListener('keydown', onKeyDown);
    }
  };

  const Marquee = {
    init() {
      const row = document.getElementById('stackRow');
      if (!row) return;
      if (document.documentElement.getAttribute('data-motion') === 'off') return;

      // Clone children once for seamless infinite scrolling
      const children = [...row.children];
      children.forEach(c => {
        const clone = c.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('data-layer');
        row.appendChild(clone);
      });

      row.style.width = 'max-content';

      let pos = 0;
      let isPaused = false;
      const speed = 40; // px per second
      let lastTime = performance.now();

      row.addEventListener('mouseenter', () => { isPaused = true; });
      row.addEventListener('mouseleave', () => { isPaused = false; });

      const animate = (now) => {
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        if (!isPaused) {
          pos += speed * dt;
          const halfWidth = row.scrollWidth / 2;
          if (pos >= halfWidth) {
            pos -= halfWidth;
          }
          row.style.transform = `translate3d(${-pos}px, 0, 0)`;
        }
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  };

  window.Work = Work;
  window.Marquee = Marquee;
})();
