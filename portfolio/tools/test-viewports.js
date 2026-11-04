const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox'] });
  const viewports = [360, 390, 768, 1024, 1280, 1440, 1920, 2560];
  let allPass = true;
  for (const w of viewports) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('file://' + path.resolve('index.html?intro=off'));
    await page.waitForTimeout(300);
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerW = await page.evaluate(() => window.innerWidth);
    const ok = scrollW <= innerW + 1;
    console.log(`Viewport ${w}px: scrollWidth = ${scrollW}, innerWidth = ${innerW} -> ${ok ? 'PASS' : 'FAIL'}`);
    if (!ok) allPass = false;
    await page.close();
  }
  await browser.close();
  if (!allPass) process.exit(1);
  console.log('ALL VIEWPORTS PASSED WITH ZERO HORIZONTAL SCROLL!');
})();
