/* tests/layout-check.js — static layout contract. Usage: node tests/layout-check.js   [PAGE=index.html BASE=http://localhost:8765]
   Loads the page with the intro skipped (?swarm=off) at 8 widths and checks: no horizontal scroll, layer geometry, display rules. Writes tests-out-w<width>.png. */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765', PAGE = process.env.PAGE || 'index.html';
let fails = 0; const ok = (n, c, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : '')); if (!c) fails++; };
(async () => {
  const chromePath = process.env.CHROME_BIN || (process.platform === "win32" && require("fs").existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe") ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined);
  const b = await chromium.launch({ executablePath: chromePath });
  for (const w of [360, 390, 768, 1024, 1280, 1440, 1920, 2560]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } }); await p.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());
    await p.goto(`${BASE}/${PAGE}?swarm=off`); await p.waitForTimeout(700);
    const r = await p.evaluate(() => {
      const ls = [...document.querySelectorAll('[data-layer]')]; const zero = ls.filter((e) => { const b = e.getBoundingClientRect(); return getComputedStyle(e).display !== 'none' && b.width < 0.5 && b.height < 0.5; }).length;
      const inline = ls.filter((e) => ['text', 'chip'].includes(e.dataset.layer) && getComputedStyle(e).display === 'inline').map((e) => e.className || e.tagName);
      const withKids = ls.filter((e) => ['text', 'chip'].includes(e.dataset.layer) && e.children.length && e.dataset.swarm !== 'wipe').map((e) => e.className || e.tagName);
      return { sw: document.documentElement.scrollWidth, iw: innerWidth, n: ls.length, zero, inline, withKids };
    });
    ok(`${w}px: no horizontal scroll`, r.sw <= r.iw + 1, `(scrollWidth ${r.sw} / ${r.iw})`);
    if (w === 1440) { ok('layer count 300-450', r.n >= 300 && r.n <= 450, `(${r.n})`); ok('text/chip layers are never display:inline', r.inline.length === 0, r.inline.slice(0, 6).join(',')); ok('text/chip layers have no child elements', r.withKids.length === 0, r.withKids.slice(0, 6).join(',')); }
    await p.screenshot({ path: `tests-out-w${w}.png`, fullPage: false }); await p.close();
  }
  await b.close(); console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\nALL CHECKS PASSED'); process.exit(fails ? 1 : 0);
})();
