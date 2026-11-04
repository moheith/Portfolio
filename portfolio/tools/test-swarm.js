/* tools/test-swarm.js — runs the intro in headless Chromium at 6x speed and checks the result.
   Setup once:  npm init -y && npm i -D playwright && npx playwright install chromium
   Run:         node tools/test-swarm.js            (exit code 0 = OK; screenshots go to tools/shots/) */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..'); const shots = path.join(__dirname, 'shots'); fs.mkdirSync(shots, { recursive: true });
(async () => {
  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe') ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : undefined;
  const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
  const failures = []; const ok = (c, msg) => { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) failures.push(msg); };
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport: vp });
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'warning' && m.text().includes('[swarm]')) errors.push(m.text()); });
    await page.goto('file://' + path.join(root, 'index.html'));
    await page.waitForFunction(() => window.Swarm && Swarm.state !== undefined, null, { timeout: 15000 });
    await page.evaluate(() => { Swarm.setSpeed(6); if (Swarm.state === 'idle') Swarm.start(); });
    const marks = [2, 14, 30, 50]; let mi = 0;
    for (let i = 0; i < 3000; i++) {
      const s = await page.evaluate(() => ({ t: Swarm.t, st: Swarm.state }));
      if (mi < marks.length && s.t >= marks[mi]) { await page.screenshot({ path: path.join(shots, `${vp.width}-t${marks[mi]}.png`) }); mi++; }
      if (s.st === 'finale' || s.st === 'live') break; await page.waitForTimeout(40);
    }
    await page.waitForTimeout(800); await page.screenshot({ path: path.join(shots, `${vp.width}-finale.png`) });
    const r = await page.evaluate(() => ({
      built: Swarm.built, total: Swarm.total, state: Swarm.state, boxes: Swarm.boxes.size,
      notBuilt: [...document.querySelectorAll('[data-layer]')].filter((e) => !e.classList.contains('is-built')).length,
      textBad: [...document.querySelectorAll('[data-layer=text]')].filter((e) => e.textContent !== e.dataset.full).length,
      joined: Swarm.agents.filter((a) => a.joined).length, building: document.documentElement.classList.contains('is-building'),
      hscroll: document.documentElement.scrollWidth > innerWidth + 1, hud: document.querySelector('[data-bind=done]').textContent }));
    const tag = `[${vp.width}px] `;
    ok(r.built === 364 && r.total === 364, tag + `all 364 layers built (${r.built}/${r.total})`);
    ok(r.notBuilt === 0, tag + 'every [data-layer] has .is-built');
    ok(r.textBad === 0, tag + 'every text layer ends with its exact text');
    ok(r.boxes === 0, tag + 'no selection boxes left behind');
    ok(r.joined === 30, tag + `agents on screen: ${r.joined}`);
    ok(r.state === 'finale' && !r.building, tag + 'finale reached and .is-building removed');
    ok(!r.hscroll, tag + 'no horizontal scrollbar');
    ok(/^Rebuilt by \d+ agents in [\d.]+s$/.test(r.hud), tag + 'HUD done text: ' + r.hud);
    ok(errors.length === 0, tag + 'no page errors / missing layers ' + JSON.stringify(errors.slice(0, 3)));
    // Skip button must reveal everything instantly
    await page.evaluate(() => { document.querySelectorAll('[data-layer]').forEach((e) => e.classList.remove('is-built')); Swarm.states = []; document.documentElement.classList.add('is-building'); Swarm.start(); });
    await page.waitForTimeout(600); await page.evaluate(() => Swarm.finishAll());
    const sk = await page.evaluate(() => ({ nb: [...document.querySelectorAll('[data-layer]')].filter((e) => !e.classList.contains('is-built')).length, b: document.documentElement.classList.contains('is-building'), a: document.querySelectorAll('.agent-cursor').length }));
    ok(sk.nb === 0 && !sk.b && sk.a === 0, tag + 'finishAll() (✕ / reduced motion) reveals everything and removes the cursors');
    await page.close();
  }
  await browser.close();
  console.log(failures.length ? `\n${failures.length} FAILED` : '\nALL TESTS PASSED'); process.exit(failures.length ? 1 : 0);
})();
