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

      if (this.sliderRefresh) this.sliderRefresh(true);

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

    /* ------------------------------------------------------------------
       Project slider — drag / flick with inertia, snapping and edge give.
       • Mouse + pen: pointer drag (6px threshold so plain clicks still open a card), velocity-based
         flick → a critically-damped spring glides to the nearest card; past either end the rail
         stretches with resistance and springs back.
       • Touch keeps the browser's native momentum scrolling + CSS snap (best feel on phones).
       • Buttons, ← / → on a focused card, and the progress bar all use the same spring.
       • While JS is moving the rail, CSS scroll-snap is switched off (.is-js) so the two never fight.
       ------------------------------------------------------------------ */
    wireSlider() {
      const slider = document.getElementById('slider');
      if (!slider || slider.dataset.wired) return;
      slider.dataset.wired = '1';
      const track = slider.querySelector('.slider__track');
      const prevBtn = document.getElementById('prev');
      const nextBtn = document.getElementById('next');
      const prog = document.querySelector('.slider__prog');
      const thumb = prog && prog.firstElementChild;
      const root = document.documentElement;
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
      const building = () => root.classList.contains('is-building');

      let x = 0;            // virtual scroll position (may overshoot 0..max while stretching)
      let max = 0;          // furthest scroll position
      let snaps = [0];      // card start positions (clamped to max)
      let busy = false;     // JS owns the position (dragging or gliding)
      let raf = 0, vel = 0; // spring state (px / s)
      let down = false, dragging = false, sx = 0, sx0 = 0, pid = null, samples = [];
      let suppress = false, interrupted = false, wasGliding = false;

      const measure = () => {
        max = Math.max(0, track.offsetWidth - slider.clientWidth);
        const cards = [...track.querySelectorAll('.card')];
        const s = cards.map((c) => clamp(c.offsetLeft, 0, max));
        if (max > 0) s.push(max);
        snaps = [...new Set(s.map((n) => Math.round(n)))].sort((a, b) => a - b);
        if (!snaps.length) snaps = [0];
      };

      // diminishing-returns stretch: approaches ~35% of the viewport however far you pull
      const rubber = (o) => {
        const d = slider.clientWidth * 0.35;
        return Math.sign(o) * d * (1 - 1 / (Math.abs(o) / d * 0.6 + 1));
      };

      const progress = () => {
        const p = max > 0 ? clamp(x / max, 0, 1) : 0;
        if (thumb) {
          const ratio = track.offsetWidth > 0 ? clamp(slider.clientWidth / track.offsetWidth, 0.08, 1) : 1;
          thumb.style.width = (ratio * 100).toFixed(2) + '%';
          thumb.style.transform = `translate3d(${(p * (1 / ratio - 1) * 100).toFixed(2)}%,0,0)`;
          if (prog) prog.classList.toggle('is-off', max <= 1);
        }
        const atStart = x <= 2, atEnd = x >= max - 2;
        [[prevBtn, atStart], [nextBtn, atEnd]].forEach(([b, off]) => {
          if (!b) return;
          b.disabled = off;
          b.setAttribute('aria-disabled', off ? 'true' : 'false');
        });
      };

      const render = () => {
        const sl = clamp(x, 0, max);
        slider.scrollLeft = sl;
        const over = x - sl;
        track.style.transform = over ? `translate3d(${(-rubber(over)).toFixed(2)}px,0,0)` : '';
        progress();
      };

      const finish = () => {
        busy = false;
        slider.classList.remove('is-js');
        track.style.transform = '';
        x = clamp(x, 0, max);
        progress();
      };

      const stopAnim = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

      const glide = (to, v0 = 0) => {
        stopAnim();
        to = clamp(to, 0, max);
        busy = true;
        slider.classList.add('is-js');
        if (reduce || building()) { x = to; render(); finish(); return; }
        vel = v0;
        let last = performance.now();
        const K = 185, C = 2 * Math.sqrt(K) * 0.96; // a touch under critical damping → tiny, soft settle
        const tick = (now) => {
          const dt = Math.min(0.032, (now - last) / 1000); last = now;
          vel += (-K * (x - to) - C * vel) * dt;
          x += vel * dt;
          render();
          if (Math.abs(x - to) < 0.35 && Math.abs(vel) < 10) { x = to; render(); raf = 0; finish(); return; }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };

      const nearest = (list, v) => list.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), list[0]);

      const release = (sv) => {
        const over = x < 0 || x > max;
        const proj = x + sv * 0.24;
        let target;
        const ahead = sv > 0 ? snaps.filter((s) => s > x + 1) : snaps.filter((s) => s < x - 1);
        if (!over && Math.abs(sv) > 260 && ahead.length) target = nearest(ahead, proj); // a flick always advances
        else target = nearest(snaps, clamp(proj, 0, max));
        glide(target, over ? 0 : sv);
      };

      const step = (dir) => {
        if (building()) return;
        measure();
        const cur = busy ? x : slider.scrollLeft;
        x = cur;
        const list = dir > 0 ? snaps.filter((s) => s > cur + 4) : snaps.filter((s) => s < cur - 4).reverse();
        if (list.length) glide(list[0], 0);
      };

      /* ---- buttons ---- */
      if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
      if (nextBtn) nextBtn.addEventListener('click', () => step(1));

      /* ---- progress bar: click / drag to scrub ---- */
      if (prog) {
        const scrub = (e) => {
          const r = prog.getBoundingClientRect();
          const p = clamp((e.clientX - r.left) / r.width, 0, 1);
          measure(); glide(nearest(snaps, p * max), 0);
        };
        prog.addEventListener('pointerdown', (e) => { if (building()) return; e.preventDefault(); scrub(e); });
      }

      /* ---- mouse / pen drag ---- */
      slider.addEventListener('dragstart', (e) => e.preventDefault()); // no ghost-image drags of the cover art

      slider.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch' || e.button !== 0 || building()) return;
        measure();
        interrupted = false; wasGliding = !!raf;
        if (raf) { interrupted = Math.abs(vel) > 60; stopAnim(); }
        else if (!busy) x = slider.scrollLeft;
        down = true; dragging = false; pid = e.pointerId;
        sx = e.clientX; sx0 = x;
        samples = [{ t: e.timeStamp, x: e.clientX }];
      });

      slider.addEventListener('pointermove', (e) => {
        if (!down || e.pointerId !== pid) return;
        if (!dragging) {
          if (Math.abs(e.clientX - sx) < 6) return;
          dragging = true; busy = true; interrupted = false;
          slider.classList.add('is-js', 'is-dragging');
          root.classList.add('is-slider-drag');
          try { slider.setPointerCapture(pid); } catch (_) { /* ignore */ }
          sx = e.clientX; sx0 = x; // start from here so there is no jump when the threshold is crossed
        }
        x = sx0 - (e.clientX - sx);
        render();
        samples.push({ t: e.timeStamp, x: e.clientX });
        while (samples.length > 2 && e.timeStamp - samples[0].t > 100) samples.shift();
      });

      const end = (e) => {
        if (!down || (e && e.pointerId !== pid)) return;
        down = false;
        if (!dragging) {
          if (interrupted) { suppress = true; setTimeout(() => { suppress = false; }, 80); }
          if (wasGliding) glide(nearest(snaps, clamp(x, 0, max)), vel); // let the interrupted glide settle
          return;
        }
        dragging = false;
        slider.classList.remove('is-dragging');
        root.classList.remove('is-slider-drag');
        try { slider.releasePointerCapture(pid); } catch (_) { /* ignore */ }
        suppress = true; setTimeout(() => { suppress = false; }, 80);
        const a = samples[0], b = samples[samples.length - 1];
        const idle = (e ? e.timeStamp : b.t) - b.t;
        let pv = 0;
        if (b.t > a.t && idle < 80) pv = (b.x - a.x) / (b.t - a.t) * 1000; // pointer px/s
        release(clamp(-pv, -4200, 4200));
      };
      slider.addEventListener('pointerup', end);
      slider.addEventListener('pointercancel', end);
      slider.addEventListener('lostpointercapture', end);

      // a drag must never open a project
      slider.addEventListener('click', (e) => {
        if (!suppress) return;
        e.preventDefault(); e.stopPropagation(); suppress = false;
      }, true);

      /* ---- keyboard: ← / → on a focused card ---- */
      slider.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const card = e.target.closest && e.target.closest('.card');
        if (!card) return;
        const cards = [...track.querySelectorAll('.card')];
        const j = clamp(cards.indexOf(card) + (e.key === 'ArrowRight' ? 1 : -1), 0, cards.length - 1);
        if (cards[j] === card) return;
        e.preventDefault();
        measure();
        const c = cards[j];
        cards[j].focus({ preventScroll: true });
        const cur = busy ? x : slider.scrollLeft; x = cur;
        if (c.offsetLeft < cur - 1 || c.offsetLeft + c.offsetWidth > cur + slider.clientWidth + 1) glide(c.offsetLeft, 0);
      });

      /* ---- native scroll (touch, trackpad, focus-into-view) keeps the model in sync ---- */
      slider.addEventListener('scroll', () => { if (!busy) { x = slider.scrollLeft; progress(); } }, { passive: true });

      const refresh = (reset) => {
        stopAnim(); finish();
        measure();
        x = reset ? 0 : clamp(x, 0, max);
        slider.scrollLeft = x;
        progress();
      };
      this.sliderRefresh = refresh;
      if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => { if (!busy) refresh(false); }); ro.observe(slider); ro.observe(track); }
      refresh(false);
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

      const gallery = (typeof Gallery !== 'undefined' && p.shots && p.shots.length) ? Gallery.html(p) : '';
      const mediaHtml = gallery || (p.video
        ? `<video src="${p.video}" controls playsinline autoplay loop></video>`
        : p.img
          ? `<img src="${p.preview || p.img}" alt="${Render.esc(p.title)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'modal__poster',innerHTML:'<span class=card__initials>${p.n}</span>'}))">`
          : `<div class="modal__poster card__media--inline">${Render.posterHTML(p)}</div>`);

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
          <div class="modal__media${gallery ? ' modal__media--gal' : ''}">${mediaHtml}</div>
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
        if (modal.classList.contains('is-open') && window.SoundFX) SoundFX.playModalClose();
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
