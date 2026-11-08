/* js/polish.js — extra features layered on top of the existing modules (nothing here replaces them).
   1. Project modal: prev / next buttons, ← → keys, "03 / 11" counter, focus moves into the dialog and is trapped there
   2. "Save contact" (.vcf) — one tap adds Mayura to a phone's address book (also in the Ctrl+K palette)
   3. Back-to-top button (appears after the hero, hidden while the swarm is building)
   4. Tab title changes when the visitor switches away, restores on return
   5. Offline-ready PWA service worker (https only)
   Public: window.Polish { vcard, nav }   */
const Polish = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  /* the other modules are top-level `const`s (not window properties), so reach them with typeof-guarded lookups */
  const C = () => (typeof CONTENT !== 'undefined' ? CONTENT : null);
  const M = () => (C() && C().meta) || {};

  /* ---------------------------------------------------------------- 2. vCard */
  function vcard() {
    const m = M();
    const lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      'N:S Y;Mohieth Mayura;;;', 'FN:' + (m.name || 'Mohieth Mayura S Y'), 'NICKNAME:Mayura',
      'TITLE:' + (m.role || 'Full Stack Developer & Designer'),
      'EMAIL;TYPE=INTERNET:' + (m.email || ''), 'TEL;TYPE=CELL:' + (m.phone || '+918660227877'),
      'ADR;TYPE=HOME:;;;Bengaluru;Karnataka;;India',
      'URL:' + ((m.links && m.links.github) || ''),
      'X-SOCIALPROFILE;TYPE=instagram:' + ((m.links && m.links.instagram) || ''),
      'X-SOCIALPROFILE;TYPE=linkedin:' + ((m.links && m.links.linkedin) || ''),
      'END:VCARD'
    ].filter((l) => !/:$/.test(l));
    const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'mohieth-mayura.vcf';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    if (typeof Extras !== 'undefined' && Extras.toast) Extras.toast('Contact card saved ✓');
  }

  /* ---------------------------------------------------------------- 1. modal navigation + focus trap */
  function slugs() { return (C() ? C().projects : []).map((p) => p.slug); }
  function currentSlug() { const m = location.hash.match(/^#work\/(.+)$/); return m ? decodeURIComponent(m[1]) : null; }
  function step(dir) {
    const list = slugs(), i = list.indexOf(currentSlug()); if (i < 0 || typeof Work === 'undefined') return;
    Work.open(list[(i + dir + list.length) % list.length]);
  }
  function decorateModal(modal) {
    const box = $('.modal__box', modal); if (!box || $('.modal__pager', box)) return;
    const list = slugs(), i = list.indexOf(currentSlug()); if (i < 0) return;
    const nav = document.createElement('div'); nav.className = 'modal__pager';
    nav.innerHTML = '<button type="button" class="modal__pstep" data-dir="-1" aria-label="Previous project">←</button>' +
      '<span class="modal__pcount" aria-live="polite">' + String(i + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0') + '</span>' +
      '<button type="button" class="modal__pstep" data-dir="1" aria-label="Next project">→</button>';
    nav.addEventListener('click', (e) => { const b = e.target.closest('[data-dir]'); if (b) step(+b.dataset.dir); });
    const actions = $('.modal__actions', box); (actions && actions.parentNode ? actions.parentNode : box).appendChild(nav);
    const close = $('.modal__close', box); if (close) close.focus({ preventScroll: true });
  }
  function modalKeys() {
    const modal = document.getElementById('modal'); if (!modal) return;
    new MutationObserver(() => { if (modal.classList.contains('is-open')) decorateModal(modal); }).observe(modal, { childList: true, attributes: true, attributeFilter: ['class'] });
    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'Tab') {
        const f = [...modal.querySelectorAll('a[href],button:not([disabled])')].filter((x) => x.offsetParent !== null);
        if (!f.length) return; const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!modal.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------------------------------------------------------------- 3. back to top */
  function toTop() {
    const b = document.createElement('button'); b.type = 'button'; b.id = 'toTop'; b.setAttribute('aria-label', 'Back to top'); b.innerHTML = '↑';
    b.addEventListener('click', () => { if (typeof Scroll !== 'undefined' && Scroll.to) Scroll.to(0); else window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.body.appendChild(b);
    let tick = false;
    const ft = document.getElementById('footer');
    const upd = () => { tick = false; b.classList.toggle('is-on', scrollY > innerHeight * 0.9 && !document.documentElement.classList.contains('is-building')); const r = ft && ft.getBoundingClientRect(); b.classList.toggle('is-hidden-by-footer', !!r && r.top < innerHeight - 80); };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    if (typeof Swarm !== 'undefined' && Swarm.on) Swarm.on('state', upd);
    upd();
  }

  /* ---------------------------------------------------------------- 4. away title */
  function awayTitle() {
    const home = document.title, away = 'Come back — Mayura ✦';
    document.addEventListener('visibilitychange', () => { document.title = document.hidden ? away : home; });
  }

  /* ---------------------------------------------------------------- 6. service worker */
  function worker() {
    if (!('serviceWorker' in navigator) || location.protocol !== 'https:') return;
    const had = !!navigator.serviceWorker.controller; let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !reloaded && !document.documentElement.classList.contains('is-building')) { reloaded = true; location.reload(); } });
    addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {}));
  }

  function init() {
    try { modalKeys(); toTop(); awayTitle(); worker(); } catch (e) { console.error('[polish]', e); }
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
  return { vcard, nav: step };
})();
window.Polish = Polish;
