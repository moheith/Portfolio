/* tools/qa.js — functional QA for V3 architecture in headless Chromium. */
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const chromePath = process.env.CHROME_BIN || (process.platform === 'win32' && require('fs').existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe') ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : undefined);
  const b = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
  let fail = 0;
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++; };
  const url = (process.env.BASE || 'http://localhost:8765') + '/index.html?swarm=off';

  // 1. Horizontal scroll test across 8 viewports
  for (const w of [360, 390, 768, 1024, 1280, 1440, 1920, 2560]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(url);
    await p.waitForTimeout(600);
    ok(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `no horizontal scroll at ${w}px`);
    await p.close();
  }

  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(url);
  await p.waitForTimeout(1000);

  // 2. Project cards and tabs
  ok(await p.evaluate(() => document.querySelectorAll('.card').length === 11), '11 project cards rendered');
  ok(await p.evaluate(() => document.querySelectorAll('.tab').length === 7), '7 filter tabs in V3');

  // Filter tabs
  await p.click('.tab[data-filter="Discord"]');
  await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.querySelectorAll('.card').length === 1), 'Discord filter shows 1 card');
  ok(await p.evaluate(() => document.querySelector('#seeAllLabel').textContent === 'SEE ALL (1) •'), 'count text updates to (1)');

  // Search filter
  await p.click('.tab[data-filter="All"]');
  await p.fill('#search', 'yulya');
  await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.querySelectorAll('.card').length >= 4 && document.querySelector('.card mark') !== null), 'search filters and highlights with <mark>');
  await p.fill('#search', '');
  await p.waitForTimeout(400);

  // 3. Project detail modal
  await p.evaluate(() => window.Work && Work.open('yulya-studio'));
  await p.waitForTimeout(600);
  ok(await p.evaluate(() => document.querySelector('#modal.is-open') !== null && location.hash === '#work/yulya-studio'), 'cinema modal opens with deep-link hash');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.querySelector('#modal.is-open') === null), 'Esc closes the modal');

  // 4. Compare slider
  await p.evaluate(() => { document.querySelector('#compare').scrollIntoView(); });
  await p.focus('#compare');
  await p.keyboard.press('Home');
  ok(await p.evaluate(() => document.querySelector('#compare').getAttribute('aria-valuenow') === '0'), 'compare slider: Home key sets 0');
  await p.keyboard.press('End');
  ok(await p.evaluate(() => document.querySelector('#compare').getAttribute('aria-valuenow') === '100'), 'compare slider: End key sets 100');

  // 5. Command palette
  await p.keyboard.press('Control+k');
  await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelector('#palette.is-open') !== null), 'command palette opens (Ctrl+K)');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelector('#palette.is-open') === null), 'command palette closes (Esc)');

  // 6. Accent dot switcher
  await p.evaluate(() => document.querySelector('.accent-dot[data-accent="#ffb020"]').click());
  ok(await p.evaluate(() => localStorage.getItem('accent') === '#ffb020'), 'accent dot persists in localStorage');

  // 7. Journey accordion
  await p.evaluate(() => document.querySelectorAll('.tl__head')[1].click());
  ok(await p.evaluate(() => document.querySelectorAll('.tl__item.is-open').length === 1 && document.querySelectorAll('.tl__head')[1].getAttribute('aria-expanded') === 'true'), 'journey accordion: single item open at a time');

  // 8. Motion toggle
  await p.evaluate(() => document.querySelector('#motionToggle').click());
  ok(await p.evaluate(() => document.documentElement.getAttribute('data-motion') === 'off' && localStorage.getItem('motion') === 'off'), 'motion-off toggle persists');
  await p.evaluate(() => document.querySelector('#motionToggle').click());

  // 9. CV placeholder toast
  await p.evaluate(() => { document.querySelector('#cvLink').click(); });
  await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelector('#toast').textContent === 'CV coming soon'), 'CV link triggers "CV coming soon" toast');

  // 10. WhatsApp CTA
  const ctaHref = await p.evaluate(() => document.querySelector('.cta').href || document.querySelector('.hero__cta').href);
  ok(ctaHref.length > 0, 'CTA link valid');

  // 11. Forbidden words check
  const txt = await p.evaluate(() => document.body.innerText.toLowerCase());
  ok(!/\b(award|certificate|client|showreel|figma|photoshop)s?\b/.test(txt), 'zero forbidden words in visible text');

  // 12. Zero page errors
  ok(errs.length === 0, 'no page errors: ' + JSON.stringify(errs));

  await b.close();
  console.log(fail ? `\n${fail} QA CHECK(S) FAILED` : '\nALL QA CHECKS PASSED');
  process.exit(fail ? 1 : 0);
})();
