const { chromium } = require('playwright');

(async () => {
  const chromePath = process.env.CHROME_BIN || (process.platform === 'win32' && require('fs').existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe') ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : undefined);
  const browser = await chromium.launch({ executablePath: chromePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Watermark snapshot during scan phase (at 0.4s)
  await page.goto('http://localhost:8765/index.html?swarmSpeed=1');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'ss-01-watermark-scan.png' });
  console.log('Saved ss-01-watermark-scan.png');

  // 2. Swarm building in progress (at 4s)
  await page.waitForTimeout(3600);
  await page.screenshot({ path: 'ss-02-swarm-building.png' });
  console.log('Saved ss-02-swarm-building.png');

  // 3. Fully completed page (using ?swarm=off)
  await page.goto('http://localhost:8765/index.html?swarm=off');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'ss-03-fullpage-hero.png' });

  // Scroll to work
  await page.evaluate(() => window.Scroll && Scroll.to('#work', { immediate: true }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ss-04-section-work.png' });

  // Scroll to proof
  await page.evaluate(() => window.Scroll && Scroll.to('#proof', { immediate: true }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ss-05-section-proof.png' });

  // Scroll to compare
  await page.evaluate(() => window.Scroll && Scroll.to('#raw', { immediate: true }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ss-06-section-compare.png' });

  // Scroll to contact
  await page.evaluate(() => window.Scroll && Scroll.to('#contact', { immediate: true }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ss-07-section-contact.png' });

  console.log('All screenshots captured!');
  await browser.close();
})();
