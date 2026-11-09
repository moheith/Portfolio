/* js/gallery.js — project screenshot gallery inside the work modal + a full-screen lightbox.
   Gallery.html(project) returns the markup; behaviour is delegated from #modal so it survives re-renders. */
const Gallery = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  let shots = [], idx = 0, title = '', lb = null, lbFocus = null;

  function html(p) {
    const s = p.shots; if (!s || !s.length) return '';
    const many = s.length > 1;
    const first = s[0];
    return `<div class="gal" data-gal data-i="0">
      <div class="gal__view" style="--gal-bg:url('${esc(first.src)}')">
        <button class="gal__stage" type="button" data-act="zoom" aria-label="Open screenshot full size">
          <img class="gal__img" src="${esc(first.src)}" width="${first.w}" height="${first.h}" alt="${esc(first.cap)}" decoding="async">
          <span class="gal__zoom" aria-hidden="true">⤢</span>
        </button>
        ${many ? `<button class="gal__nav gal__nav--prev" type="button" data-act="prev" aria-label="Previous screenshot">‹</button>
        <button class="gal__nav gal__nav--next" type="button" data-act="next" aria-label="Next screenshot">›</button>
        <span class="gal__count" aria-hidden="true">${pad(1)} / ${pad(s.length)}</span>` : ''}
      </div>
      <div class="gal__bar">
        <p class="gal__cap" aria-live="polite">${esc(first.cap)}</p>
        ${many ? `<div class="gal__thumbs" role="group" aria-label="${esc(p.title)} screenshots">${s.map((x, i) => `
          <button class="gal__t${i === 0 ? ' is-on' : ''}" type="button" data-act="go" data-i="${i}" aria-label="Screenshot ${i + 1} of ${s.length}: ${esc(x.cap)}" aria-current="${i === 0}">
            <img src="${esc(x.thumb || x.src)}" alt="" loading="lazy" decoding="async">
          </button>`).join('')}</div>` : ''}
      </div>
    </div>`;
  }

  function slugShots() {
    const m = location.hash.match(/^#work\/(.+)$/);
    const p = m && typeof CONTENT !== 'undefined' ? CONTENT.projects.find((x) => x.slug === decodeURIComponent(m[1])) : null;
    return p ? { shots: p.shots || [], title: p.title } : { shots: [], title: '' };
  }

  /* ---- inline gallery ---- */
  function show(root, i) {
    const s = shots; if (!s.length) return;
    idx = (i + s.length) % s.length;
    const x = s[idx];
    const view = root.querySelector('.gal__view'), img = root.querySelector('.gal__img');
    img.classList.add('is-swap');
    const pre = new Image();
    const apply = () => {
      img.src = x.src; img.width = x.w; img.height = x.h; img.alt = x.cap;
      view.style.setProperty('--gal-bg', `url('${x.src}')`);
      requestAnimationFrame(() => img.classList.remove('is-swap'));
    };
    pre.onload = apply; pre.onerror = apply; pre.src = x.src;
    const cap = root.querySelector('.gal__cap'); if (cap) cap.textContent = x.cap;
    const cnt = root.querySelector('.gal__count'); if (cnt) cnt.textContent = `${pad(idx + 1)} / ${pad(s.length)}`;
    root.querySelectorAll('.gal__t').forEach((b, k) => { b.classList.toggle('is-on', k === idx); b.setAttribute('aria-current', String(k === idx)); });
    const on = root.querySelector('.gal__t.is-on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    if (window.SoundFX && SoundFX.playTab) SoundFX.playTab();
  }

  /* ---- lightbox ---- */
  function buildLB() {
    const el = document.createElement('div');
    el.id = 'lightbox'; el.className = 'lb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Screenshot viewer');
    el.innerHTML = `<div class="lb__bg" data-lb="close"></div>
      <figure class="lb__fig"><img class="lb__img" alt=""><figcaption class="lb__cap"></figcaption></figure>
      <button class="lb__btn lb__close" type="button" data-lb="close" aria-label="Close viewer">✕</button>
      <button class="lb__btn lb__prev" type="button" data-lb="prev" aria-label="Previous screenshot">‹</button>
      <button class="lb__btn lb__next" type="button" data-lb="next" aria-label="Next screenshot">›</button>
      <span class="lb__count" aria-hidden="true"></span>`;
    el.addEventListener('click', (e) => {
      const a = e.target.closest('[data-lb]'); if (!a) return;
      const k = a.dataset.lb;
      if (k === 'close') closeLB(); else lbGo(k === 'next' ? 1 : -1);
    });
    document.body.appendChild(el);
    return el;
  }
  function lbRender() {
    const x = shots[idx]; if (!x) return;
    const img = lb.querySelector('.lb__img');
    img.classList.add('is-swap');
    const pre = new Image(); const done = () => { img.src = x.src; img.alt = x.cap; requestAnimationFrame(() => img.classList.remove('is-swap')); };
    pre.onload = done; pre.onerror = done; pre.src = x.src;
    lb.querySelector('.lb__cap').textContent = x.cap;
    lb.querySelector('.lb__count').textContent = `${pad(idx + 1)} / ${pad(shots.length)}`;
    const multi = shots.length > 1;
    lb.querySelector('.lb__prev').hidden = !multi; lb.querySelector('.lb__next').hidden = !multi;
  }
  function lbGo(d) { idx = (idx + d + shots.length) % shots.length; lbRender(); syncInline(); if (window.SoundFX && SoundFX.playTab) SoundFX.playTab(); }
  function syncInline() {
    const root = document.querySelector('#modal [data-gal]'); if (!root) return;
    const x = shots[idx]; const img = root.querySelector('.gal__img');
    img.src = x.src; img.width = x.w; img.height = x.h; img.alt = x.cap;
    root.querySelector('.gal__view').style.setProperty('--gal-bg', `url('${x.src}')`);
    const cap = root.querySelector('.gal__cap'); if (cap) cap.textContent = x.cap;
    const cnt = root.querySelector('.gal__count'); if (cnt) cnt.textContent = `${pad(idx + 1)} / ${pad(shots.length)}`;
    root.querySelectorAll('.gal__t').forEach((b, k) => { b.classList.toggle('is-on', k === idx); b.setAttribute('aria-current', String(k === idx)); });
  }
  function openLB() {
    if (!shots.length) return;
    lb = lb || buildLB();
    lbFocus = document.activeElement;
    lbRender();
    lb.classList.add('is-open');
    const c = lb.querySelector('.lb__close'); if (c) c.focus({ preventScroll: true });
    if (window.SoundFX && SoundFX.playModalOpen) SoundFX.playModalOpen();
  }
  function closeLB() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    if (window.SoundFX && SoundFX.playModalClose) SoundFX.playModalClose();
    if (lbFocus && lbFocus.focus && document.contains(lbFocus)) lbFocus.focus({ preventScroll: true });
  }
  const lbOpen = () => lb && lb.classList.contains('is-open');

  /* capture-phase keys so Esc / arrows / Tab are handled by the lightbox and never reach the project modal */
  function onKey(e) {
    if (!lbOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeLB(); }
    else if (e.key === 'ArrowRight' && shots.length > 1) { e.preventDefault(); e.stopPropagation(); lbGo(1); }
    else if (e.key === 'ArrowLeft' && shots.length > 1) { e.preventDefault(); e.stopPropagation(); lbGo(-1); }
    else if (e.key === 'Tab') {
      e.stopPropagation();
      const f = [...lb.querySelectorAll('button')].filter((b) => !b.hidden);
      if (!f.length) return; const a = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(a + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  }

  function init() {
    const modal = document.getElementById('modal'); if (!modal) return;
    window.addEventListener('keydown', onKey, true);
    modal.addEventListener('click', (e) => {
      const root = e.target.closest('[data-gal]'); if (!root) return;
      const b = e.target.closest('[data-act]'); if (!b) return;
      const cur = slugShots(); shots = cur.shots; title = cur.title;
      if (!shots.length) return;
      const act = b.dataset.act;
      if (act === 'zoom') openLB();
      else if (act === 'go') show(root, +b.dataset.i);
      else if (act === 'next') show(root, idx + 1);
      else if (act === 'prev') show(root, idx - 1);
    });
    /* a fresh modal always starts on shot 0 */
    new MutationObserver(() => { if (modal.classList.contains('is-open')) { idx = 0; const c = slugShots(); shots = c.shots; title = c.title; } else if (lbOpen()) closeLB(); }).observe(modal, { childList: true });
    /* swipe on the inline stage (touch) */
    let sx = null;
    modal.addEventListener('touchstart', (e) => { const v = e.target.closest('.gal__view'); sx = v && e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    modal.addEventListener('touchend', (e) => {
      if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) < 48) return;
      const root = modal.querySelector('[data-gal]'); if (root) { const c = slugShots(); shots = c.shots; show(root, idx + (dx < 0 ? 1 : -1)); }
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  return { html };
})();
if (typeof module !== 'undefined') module.exports = Gallery;
