const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const shotsDir = path.join(__dirname, 'section-shots');
  fs.mkdirSync(shotsDir, { recursive: true });

  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : undefined;

  const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('file://' + path.join(root, 'index.html'));
  await page.waitForTimeout(500);
  // Finish swarm instantly to reveal entire completed page
  await page.evaluate(() => {
    if (window.Swarm) Swarm.finishAll();
  });
  await page.waitForTimeout(600);

  // 1. Hero
  const hero = page.locator('#home');
  await hero.screenshot({ path: path.join(shotsDir, '01-hero.png') });

  // 2. Work
  const work = page.locator('#work');
  await work.screenshot({ path: path.join(shotsDir, '02-work.png') });

  // 3. Highlights
  const highlights = page.locator('#highlights');
  await highlights.screenshot({ path: path.join(shotsDir, '03-highlights.png') });

  // 4. Compare / Raw
  const raw = page.locator('#raw');
  await raw.screenshot({ path: path.join(shotsDir, '04-compare.png') });

  // 5. Journey
  const journey = page.locator('#journey');
  await journey.screenshot({ path: path.join(shotsDir, '05-journey.png') });

  // 6. Contact & Footer
  const contact = page.locator('#contact');
  await contact.screenshot({ path: path.join(shotsDir, '06-contact.png') });
  const footer = page.locator('#footer');
  await footer.screenshot({ path: path.join(shotsDir, '07-footer.png') });

  await browser.close();
  console.log('Section screenshots captured successfully!');
})();
