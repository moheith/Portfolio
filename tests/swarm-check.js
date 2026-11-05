/* tests/swarm-check.js — end-to-end check of the Agent Swarm intro.
   Usage:  (terminal 1) python3 -m http.server 8765      (in the portfolio/ folder)
           (terminal 2) node tests/swarm-check.js          [PAGE=index.html BASE=http://localhost:8765]
   Needs Playwright (`npm i -D playwright` + `npx playwright install chromium`, or the pre-installed one). Exit code 0 = all PASS. */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765', PAGE = process.env.PAGE || 'index.html';
let fails = 0; const ok = (name, cond, extra = '') => { console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); if (!cond) fails++; };
const snap = (p) => p.evaluate(() => ({
  st: Swarm.state, built: Swarm.built, total: Swarm.total, agents: Swarm.agents.length, secs: Swarm.doneSeconds,
  building: document.documentElement.classList.contains('is-building'),
  unbuilt: document.querySelectorAll('[data-layer]:not(.is-built)').length,
  strays: document.querySelectorAll('.sw-box,.sw-pre,.sw-sweep,.sw-swatches,.sw-ripple').length,
  cursors: document.querySelectorAll('.sw-cursor').length, hudOn: document.getElementById('sw-hud').classList.contains('on'),
  hud: document.getElementById('sw-hud').innerText.replace(/\n/g, ' | '),
  dirtyText: [...document.querySelectorAll('[data-layer=text],[data-layer=chip]')].filter((e) => e.querySelector('.sw-caret,.sw-rest,.sw-sel')).length
}));
(async () => {
  const chromePath = process.env.CHROME_BIN || (process.platform === "win32" && require("fs").existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe") ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined);
  const browser = await chromium.launch({ executablePath: chromePath });
  const open = async (vp, qs) => {
    const p = await browser.newPage({ viewport: vp }); p.errs = [];
    await p.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());               // offline-safe: external fonts/CDNs are blocked, the page must still work
    p.on('pageerror', (e) => p.errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) p.errs.push(m.text()); });
    await p.goto(`${BASE}/${PAGE}?${qs}`); return p;
  };
  /* 1. full run at 4x */
  let p = await open({ width: 1440, height: 900 }, 'swarmSpeed=4');
  await p.waitForFunction(() => window.Swarm && Swarm.state === 'scan', null, { timeout: 15000 }).catch(() => {});
  ok('swarm starts (scan state)', (await p.evaluate(() => Swarm.state)) !== 'idle');
  await p.waitForTimeout(500); ok('scan: HUD says Scanning', /Scanning/.test((await snap(p)).hud));
  await p.waitForFunction(() => Swarm.state === 'build', null, { timeout: 15000 }); await p.screenshot({ path: 'tests-out-build-start.png' });
  await p.waitForFunction(() => Swarm.state === 'finale', null, { timeout: 120000 }); await p.waitForTimeout(800);
  let s = await snap(p);
  ok('layer count between 300 and 450', s.total >= 300 && s.total <= 450, `(${s.total})`);
  ok('every layer built', s.built === s.total && s.unbuilt === 0);
  ok('agents at the finale', s.agents >= 14 && s.agents <= 20, `(${s.agents})`);
  ok('no stray boxes/previews/sweeps', s.strays === 0, `(${s.strays})`);
  ok('no half-typed text left (caret/rest/selection spans)', s.dirtyText === 0, `(${s.dirtyText})`);
  ok('HUD shows "Rebuilt by … agents in …s" + Go live + Replay', /Rebuilt by \d+ agents in [\d.]+s/.test(s.hud) && /Go live/.test(s.hud) && /Replay/.test(s.hud), s.hud);
  await p.screenshot({ path: 'tests-out-finale.png' });
  try { await p.click('#sw-hud [data-a=live]', { timeout: 4000 }); } catch (e) { /* auto-clicked by finale agent */ }
  await p.waitForFunction(() => Swarm.state === 'live', null, { timeout: 8000 }); await p.waitForTimeout(2200); s = await snap(p);
  ok('Go live: overlay gone, is-building removed, cursors removed', !s.building && !s.hudOn && s.cursors === 0 && s.unbuilt === 0);
  ok('no page errors during the run', p.errs.length === 0, p.errs.join(' | '));
  /* 2. replay then abort mid-run (via the HUD buttons) */
  await p.evaluate(() => { window.PortfolioBoot ? PortfolioBoot.replay() : Swarm.replay(); }); await p.waitForTimeout(4000);
  s = await snap(p); ok('replay restarts the build (building, partial progress)', s.st === 'build' && s.built > 0 && s.built < s.total, `(${s.built}/${s.total})`);
  await p.click('#sw-hud [data-a=close]'); await p.waitForTimeout(700); s = await snap(p);
  ok('✕ aborts: everything visible, overlay removed, no strays, no half-typed text', !s.building && s.unbuilt === 0 && s.strays === 0 && s.cursors === 0 && s.dirtyText === 0);
  ok('no page errors after replay/abort', p.errs.length === 0, p.errs.join(' | ')); await p.close();
  /* 3. HUD controls + manual scroll pauses the tour (1x) */
  p = await open({ width: 1440, height: 900 }, 'swarmSpeed=1');
  await p.waitForFunction(() => Swarm.state === 'build', null, { timeout: 20000 }); await p.waitForTimeout(1500);
  await p.mouse.move(700, 400); await p.mouse.wheel(0, 300); await p.waitForTimeout(300);
  ok('manual scroll pauses the tour (HUD pill becomes "Tour")', await p.evaluate(() => !Swarm.tour && /^Tour$/.test(document.querySelector('[data-a=tour]').innerText.trim())));
  await p.click('#sw-hud [data-a=speed]'); ok('1x button cycles to 2x', (await p.evaluate(() => Swarm.speed)) === 2);
  await p.click('#sw-hud [data-a=tour]'); ok('Tour button re-enables the tour', await p.evaluate(() => Swarm.tour));
  await p.close();
  /* 4. skip paths */
  p = await open({ width: 1440, height: 900 }, 'swarm=off'); await p.waitForTimeout(800);
  ok('?swarm=off skips the intro and shows the page', await p.evaluate(() => !document.documentElement.classList.contains('is-building') && document.querySelectorAll('[data-layer]:not(.is-built)').length >= 0)); await p.close();
  p = await open({ width: 1440, height: 900 }, 'swarmSpeed=4'); await p.emulateMedia({ reducedMotion: 'reduce' }); await p.reload(); await p.waitForTimeout(800);
  ok('prefers-reduced-motion skips the intro', await p.evaluate(() => !document.documentElement.classList.contains('is-building'))); await p.close();
  /* 5. phone */
  p = await open({ width: 390, height: 844 }, 'swarmSpeed=4'); await p.waitForFunction(() => Swarm.state === 'finale', null, { timeout: 120000 }); await p.waitForTimeout(600); s = await snap(p);
  ok('phone: finishes with 12 agents max, no errors', s.built === s.total && s.agents <= 12 && p.errs.length === 0, `(${s.agents} agents, errs: ${p.errs.join('|')})`); await p.screenshot({ path: 'tests-out-phone.png' }); await p.close();
  await browser.close(); console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\nALL CHECKS PASSED'); process.exit(fails ? 1 : 0);
})();
