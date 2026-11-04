/* js/main.js — boot order (Part 10.1). Fills the page from CONTENT, builds the dynamic parts, then starts the swarm intro.
   The order matters: the swarm reads every text layer ONCE when it starts, so all text must be final before Swarm.start(). */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const safeGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* "en.hero.intro" style paths: dot separated, numbers index arrays, resolved inside CONTENT */
  function get(path) { return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), CONTENT); }

  /* 1. hydrate: every [data-c] element gets its text (prefix + value + suffix); data-full is kept in sync */
  function hydrate() {
    $$('[data-c]').forEach((el) => {
      const v = get(el.dataset.c); if (v === undefined || v === null) return;
      const s = String(v);
      const text = (el.dataset.cPrefix || '') + (el.dataset.cUpper ? s.toUpperCase() : s) + (el.dataset.cSuffix || '');
      el.textContent = text;
      if (el.dataset.full !== undefined) el.dataset.full = text;
    });
    const hw = $('.hero__word'); if (hw) hw.textContent = CONTENT.meta.heroWord;
    wireLinks(); wireSeo();
  }

  /* hrefs that come from CONTENT (so the owner edits one file) */
  function wireLinks() {
    const L = CONTENT.links, M = CONTENT.meta;
    const set = (sel, href, newTab) => { $$(sel).forEach((a) => { a.setAttribute('href', href); if (newTab) { a.target = '_blank'; a.rel = 'noopener'; } }); };
    set('.hero__demo', L.yulyaBot, true); set('.poster', L.yulyaBot, true);
    set('.work__all', L.github, true); set('.hl__link', L.github, true);
    set('.hero__cv', L.cv); set('.journey__resume', L.resume);
    const wa = 'https://wa.me/' + M.whatsapp;
    set('.cta', wa + '?text=' + encodeURIComponent('Hi Mayura, I saw your portfolio and would like to talk.'), true);
    const rows = $$('.ct-row a');
    if (rows[0]) rows[0].setAttribute('href', 'mailto:' + M.email);
    if (rows[1]) { rows[1].setAttribute('href', L.instagram); rows[1].target = '_blank'; rows[1].rel = 'noopener'; }
    if (rows[2]) { rows[2].setAttribute('href', wa); rows[2].target = '_blank'; rows[2].rel = 'noopener'; }
    if (rows[3]) { rows[3].setAttribute('href', 'https://www.google.com/maps/search/Bengaluru'); rows[3].target = '_blank'; rows[3].rel = 'noopener'; }
    const vals = $$('.ct-row__value'); if (vals[0]) vals[0].textContent = M.email, vals[0].dataset.full = M.email;
    if (vals[1]) vals[1].textContent = M.instagram, vals[1].dataset.full = M.instagram;
    if (vals[2]) vals[2].textContent = M.phoneDisplay, vals[2].dataset.full = M.phoneDisplay;
    $$('.footer__link').forEach((a, i) => { if (CONTENT.social[i]) a.setAttribute('href', CONTENT.social[i][1]); });
    const ms = $$('.ms-row a'), msLinks = [L.yulyaStudio, L.yulyaBot, L.huggingface, L.githubRepos];
    ms.forEach((a, i) => { a.setAttribute('href', msLinks[i] || L.github); a.target = '_blank'; a.rel = 'noopener'; });
  }

  /* canonical + Open Graph + JSON-LD all come from CONTENT.meta.siteUrl */
  function wireSeo() {
    const base = CONTENT.meta.siteUrl.replace(/\/$/, '');
    const can = $('link[rel="canonical"]'); if (can) can.href = base + '/';
    const ou = $('meta[property="og:url"]'); if (ou) ou.content = base + '/';
    const oi = $('meta[property="og:image"]'); if (oi) oi.content = base + '/assets/img/og.jpg';
    const ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Person', name: CONTENT.meta.fullName, alternateName: 'Mayura',
      jobTitle: 'Full Stack Developer and Designer', address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
      url: base + '/', sameAs: CONTENT.social.map((s) => s[1])
    });
    document.head.appendChild(ld);
  }

  let siteStarted = false;
  /* startSite(): safe to call many times, the one-time work runs once */
  function startSite() {
    window.Scroll && Scroll.start();
    if (siteStarted) return; siteStarted = true;
    window.Cursor && Cursor.enable();
    window.Hero && Hero.startCounters();
    window.Reveals && Reveals.init();
    window.Work && Work.afterBuild();
    window.Compare && Compare.startSite();
    window.Journey && Journey.startSite();
    window.Extras && Extras.startSite();
    if (window.ScrollTrigger) { try { ScrollTrigger.refresh(); } catch (e) { /* ignore */ } }
    window.Scroll && Scroll.gotoHash();
    window.Work && Work.openFromHash();
    window.Scroll && Scroll.layoutPlayhead && Scroll.layoutPlayhead();
  }

  async function boot() {
    // 1-4: everything that changes text or markup runs BEFORE the swarm
    hydrate();
    window.Work && Work.init();
    window.Compare && Compare.build();
    window.Extras && Extras.initStatic();
    // 5: fonts, so the giant word and every box has its final size
    await Promise.race([document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(), wait(1500)]);
    // 6
    window.Hero && Hero.fitText();
    window.Work && Work.layout();
    // 7
    window.Scroll && Scroll.init();
    window.Hero && Hero.initMotion();
    // 8: skip rules (reduced motion, the Motion-off toggle, ?intro=off). Never start twice (the test runner may already have started it).
    const skip = safeGet('motion') === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('intro=off');
    // 9
    document.addEventListener('swarmstate', (e) => {
      if (e.detail === 'building') { window.Scroll && Scroll.stop(); }
      if (e.detail === 'finale' || e.detail === 'live') startSite();
    });
    if (!window.Swarm) { document.documentElement.classList.remove('is-building'); startSite(); return; }
    if (skip) { Swarm.finishAll(); startSite(); }
    else if (Swarm.state === 'idle') Swarm.start();
    // fonts that arrive late: re-fit the word and refresh measurements
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { window.Hero && Hero.fitText(); window.ScrollTrigger && ScrollTrigger.refresh(); });
  }

  window.Site = { hydrate, startSite, get };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
