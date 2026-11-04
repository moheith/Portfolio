/* js/main.js — boot order + swarm integration. Every module call is guarded, so a missing/failed module can never leave the page invisible. */
(() => {
  'use strict';
  const html = document.documentElement;
  const q = new URLSearchParams(location.search);
  const call = (obj, fn, ...args) => { try { const o = window[obj]; if (o && typeof o[fn] === 'function') return o[fn](...args); } catch (e) { console.error(`[${obj}.${fn}]`, e); } };
  const small = () => matchMedia('(max-width: 640px)').matches;
  /* deep links (#proof, #work/yulya …) skip the intro so a shared link lands on content; ?swarm=off also skips; ?swarmForce keeps it */
  const skipIntro = () => html.getAttribute('data-motion') === 'off' || q.get('swarm') === 'off' ||
    (!!location.hash && !['#', '#home'].includes(location.hash) && !q.has('swarmForce'));
  let introHow = null;

  /* runs exactly once when the intro is finished ('live'), aborted ('abort') or never ran ('skip') */
  function afterIntro(how) {
    if (introHow) return; introHow = how;
    html.classList.remove('is-building'); html.classList.add('is-ready');
    call('Scroll', 'start');                       // Lenis start (it was stopped during the intro)
    call('SiteCursor', 'enable');                  // custom red cursor + magnetic buttons
    call('Hero', 'afterIntro', how);               // mouse parallax + spotlight
    call('Marquee', 'init');                       // clones the logo row ONLY now, then starts the infinite scroll
    call('Reveals', how === 'live' ? 'initQuiet' : 'init');          // 'live': everything was already seen, so nothing is re-hidden
    call('Extras', 'afterIntro', how);             // live stats, idle companions, clock, command palette hint
    window.dispatchEvent(new CustomEvent('portfolio:ready', { detail: { how } }));
    if (location.hash && how !== 'live') call('Scroll', 'toHash', location.hash, true);
  }

  /* small per-layer flourishes that fire the instant an agent finishes a layer */
  function wireSwarm() {
    Swarm.on('end', afterIntro);
    Swarm.on('layer', (el) => {
      if (el.matches('[data-count]')) call('Hero', 'countUp', el);                // 4+ / 10+ / 8 count up from 0 the moment they appear
      if (el.id === 'compare') call('Compare', 'demo');                           // wireframe <-> final auto demo
      if (el.matches('.step__node')) el.classList.add('is-lit');                  // process nodes light up as they are dropped in
      if (el.matches('.hero__pulse,.hero__dot')) el.classList.add('is-live');
    });
    Swarm.on('section', (name) => { if (name === 'proof') call('Hero', 'laurel'); });   // laurel branches draw in when the proof section commits
  }

  async function decodeHero() {
    const img = document.getElementById('heroImg'); if (!img) return;
    try { await Promise.race([img.decode(), new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* fallback SVG is shown by hero.js onerror */ }
  }

  async function boot() {
    try {
      Render.all();                                                  // 1. cards, logos, highlights, timeline … (with data-layer tags)
      call('Hero', 'init');                                          // 2. fitText + static layout (needs fonts: re-run on fonts.ready)
      call('Work', 'init'); call('Compare', 'init'); call('Journey', 'init');
      call('Scroll', 'init'); call('SiteCursor', 'init'); call('Extras', 'init');
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => call('Hero', 'fit'));
    } catch (e) { console.error('[boot]', e); }

    if (skipIntro() || !window.Swarm) { afterIntro('skip'); return; }
    window.__swarmStarted = true;
    call('Scroll', 'stop');                                          // Lenis off; the swarm drives window.scrollTo itself
    wireSwarm();
    await decodeHero();
    const cfg = { initial: CONTENT.meta.initial, speed: +q.get('swarmSpeed') || 1 };
    if (small()) Object.assign(cfg, { startAgents: 8, maxAgents: 12, joins: [[6, 9], [17, 10], [31, 11], [48, 12]] });
    try { await Swarm.start(cfg); } catch (e) { console.error('[swarm]', e); afterIntro('abort'); }
  }

  window.PortfolioBoot = { afterIntro, replay: () => { introHow = null; call('Scroll', 'stop'); Swarm.replay(); } };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();
