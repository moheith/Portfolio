/* js/gallery.js — each project opens on ONE clean preview image; clicking it opens the full gallery in a lightbox.
   Gallery.html(project) returns the preview markup for the modal; behaviour is delegated from #modal so it survives re-renders. */
const Gallery = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  let shots = [], idx = 0, lb = null, lbFocus = null;

  function html(p) {
    const s = p.shots; if (!s || !s.length) return '';
    const src = p.preview || p.img || s[0].src;
    return `<div class="gal" data-gal>
      <button class="gal__preview" type="button" data-act="zoom" aria-label="Open the ${esc(p.title)} gallery, ${s.length} screenshot${s.length > 1 ? 's' : ''}">
        <img class="gal__pimg" src="${esc(src)}" width="1600" height="900" alt="Preview of ${esc(p.title)}" decoding="async">
        <span class="gal__pill" aria-hidden="true"><i>▦</i><span>View gallery</span><b>${s.length}</b></span>
      </button>
    </div>`;
  }

  function current() {
    const m = location.hash.match(/^#work\/(.+)$/);
    const p = m && typeof CONTENT !== 'undefined' ? CONTENT.projects.find((x) => x.slug === decodeURIComponent(m[1])) : null;
    return p ? (p.shots || []) : [];
  }

  /* ---- lightbox ---- */
  function buildLB() {
    const el = document.createElement('div');
    el.id = 'lightbox'; el.className = 'lb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Project gallery');
    el.innerHTML = `<div class="lb__bg" data-lb="close"></div>
      <figure class="lb__fig"><img class="lb__img" alt=""><figcaption class="lb__cap"></figcaption><div class="lb__thumbs" role="group" aria-label="Screenshots"></div></figure>
      <button class="lb__btn lb__close" type="button" data-lb="close" aria-label="Close gallery">✕</button>
      <button class="lb__btn lb__prev" type="button" data-lb="prev" aria-label="Previous screenshot">‹</button>
      <button class="lb__btn lb__next" type="button" data-lb="next" aria-label="Next screenshot">›</button>
      <span class="lb__count" aria-hidden="true"></span>`;
    el.addEventListener('click', (e) => {
      const a = e.target.closest('[data-lb]'); if (!a) return;
      const k = a.dataset.lb;
      if (k === 'close') closeLB(); else if (k === 'go') lbSet(+a.dataset.i); else lbGo(k === 'next' ? 1 : -1);
    });
    let sx = null;
    el.addEventListener('touchstart', (e) => { sx = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    el.addEventListener('touchend', (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 48 && shots.length > 1) lbGo(dx < 0 ? 1 : -1); }, { passive: true });
    document.body.appendChild(el);
    return el;
  }
  function lbRender(first) {
    const x = shots[idx]; if (!x) return;
    const img = lb.querySelector('.lb__img');
    if (!first) img.classList.add('is-swap');
    const pre = new Image(); const done = () => { img.src = x.src; img.alt = x.cap; requestAnimationFrame(() => img.classList.remove('is-swap')); };
    pre.onload = done; pre.onerror = done; pre.src = x.src;
    lb.querySelector('.lb__cap').textContent = x.cap;
    lb.querySelector('.lb__count').textContent = `${pad(idx + 1)} / ${pad(shots.length)}`;
    lb.querySelectorAll('.lb__t').forEach((b, k) => { b.classList.toggle('is-on', k === idx); b.setAttribute('aria-current', String(k === idx)); });
    const on = lb.querySelector('.lb__t.is-on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: first ? 'auto' : 'smooth' });
    const multi = shots.length > 1;
    lb.querySelector('.lb__prev').hidden = !multi; lb.querySelector('.lb__next').hidden = !multi; lb.querySelector('.lb__thumbs').hidden = !multi;
  }
  function lbSet(i) { idx = (i + shots.length) % shots.length; lbRender(); if (window.SoundFX && SoundFX.playTab) SoundFX.playTab(); }
  function lbGo(d) { lbSet(idx + d); }
  function openLB(i) {
    shots = current(); if (!shots.length) return;
    lb = lb || buildLB();
    lbFocus = document.activeElement; idx = i || 0;
    lb.querySelector('.lb__thumbs').innerHTML = shots.map((x, k) =>
      `<button class="lb__t" type="button" data-lb="go" data-i="${k}" aria-label="Screenshot ${k + 1} of ${shots.length}: ${esc(x.cap)}"><img src="${esc(x.thumb || x.src)}" alt="" decoding="async"></button>`).join('');
    lbRender(true);
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

  /* capture-phase keys so Esc / arrows / Tab are owned by the lightbox and never reach the project modal */
  function onKey(e) {
    if (!lbOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeLB(); }
    else if (e.key === 'ArrowRight' && shots.length > 1) { e.preventDefault(); e.stopPropagation(); lbGo(1); }
    else if (e.key === 'ArrowLeft' && shots.length > 1) { e.preventDefault(); e.stopPropagation(); lbGo(-1); }
    else if (e.key === 'Tab') {
      e.stopPropagation();
      const f = [...lb.querySelectorAll('button')].filter((b) => !b.hidden && b.offsetParent !== null);
      if (!f.length) return; const a = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(a + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  }

  function init() {
    const modal = document.getElementById('modal'); if (!modal) return;
    window.addEventListener('keydown', onKey, true);
    modal.addEventListener('click', (e) => { if (e.target.closest('[data-gal] [data-act="zoom"]')) openLB(0); });
    new MutationObserver(() => { if (!modal.classList.contains('is-open') && lbOpen()) closeLB(); }).observe(modal, { childList: true, attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  return { html };
})();
if (typeof module !== 'undefined') module.exports = Gallery;
