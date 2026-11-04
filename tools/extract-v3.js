const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('PORTFOLIO_BUILD_PROMPT_V3.md', 'utf8');
const lines = content.split('\n');

function getBlock(pattern, fileType) {
  const lineIdx = lines.findIndex(l => l.includes(pattern));
  if (lineIdx === -1) throw new Error('Pattern not found: ' + pattern);
  let start = -1, end = -1;
  for (let i = lineIdx; i < lines.length; i++) {
    if (lines[i].trim().startsWith('```')) {
      if (start === -1) start = i + 1;
      else { end = i; break; }
    }
  }
  if (start === -1 || end === -1) throw new Error('Block not found for ' + pattern);
  return lines.slice(start, end).join('\n');
}

// 1. tokens.css
const tokensCss = getBlock('### 3.1 `css/tokens.css`');
fs.writeFileSync('css/tokens.css', tokensCss.trim() + '\n', 'utf8');
console.log('Wrote css/tokens.css');

// 2. swarm.css - customize watermark for MAYURA●
let swarmCss = getBlock('**css/swarm.css**');
swarmCss = swarmCss.replace(
  'font:400 min(52vh,60vw)/1 var(--f-display,Anton,Impact,sans-serif)',
  'font:400 min(18vh,16vw)/1 var(--f-display,Anton,Impact,sans-serif);letter-spacing:0.04em;white-space:nowrap'
);
fs.writeFileSync('css/swarm.css', swarmCss.trim() + '\n', 'utf8');
console.log('Wrote css/swarm.css');

// 3. swarm.js
const swarmJs = getBlock('**js/swarm.js**');
fs.writeFileSync('js/swarm.js', swarmJs.trim() + '\n', 'utf8');
console.log('Wrote js/swarm.js');

// 4. hud.js
const hudJs = getBlock('**js/hud.js**');
fs.writeFileSync('js/hud.js', hudJs.trim() + '\n', 'utf8');
console.log('Wrote js/hud.js');

// 5. main.js
const mainJs = getBlock('### 8.1 `js/main.js`');
fs.writeFileSync('js/main.js', mainJs.trim() + '\n', 'utf8');
console.log('Wrote js/main.js');

// 6. content.js - customize initial to MAYURA●
let contentJs = getBlock('### 9.1 `js/content.js`');
contentJs = contentJs.replace('initial: "M"', 'initial: "MAYURA●"');
fs.writeFileSync('js/content.js', contentJs.trim() + '\n', 'utf8');
console.log('Wrote js/content.js');

// 7. render.js
const renderJs = getBlock('### 9.2 `js/render.js`');
fs.writeFileSync('js/render.js', renderJs.trim() + '\n', 'utf8');
console.log('Wrote js/render.js');

// 8. index.html - customize watermark to MAYURA●
let indexHtml = getBlock('### 9.3 `index.html`');
indexHtml = indexHtml.replace('<div id="sw-watermark">M</div>', '<div id="sw-watermark">MAYURA●</div>');
fs.writeFileSync('index.html', indexHtml.trim() + '\n', 'utf8');
console.log('Wrote index.html');

// 9. manifest.webmanifest
const manifest = getBlock('`manifest.webmanifest`');
fs.writeFileSync('manifest.webmanifest', manifest.trim() + '\n', 'utf8');
console.log('Wrote manifest.webmanifest');

// 10. tests/swarm-check.js with Windows Chrome fallback
let swarmCheck = getBlock('### 10.1 `tests/swarm-check.js`');
swarmCheck = swarmCheck.replace(
  'const browser = await chromium.launch();',
  'const chromePath = process.env.CHROME_BIN || (process.platform === "win32" && require("fs").existsSync("C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe") ? "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe" : undefined);\n  const browser = await chromium.launch({ executablePath: chromePath });'
);
if (!fs.existsSync('tests')) fs.mkdirSync('tests', { recursive: true });
fs.writeFileSync('tests/swarm-check.js', swarmCheck.trim() + '\n', 'utf8');
console.log('Wrote tests/swarm-check.js');

// 11. tests/layout-check.js with Windows Chrome fallback
let layoutCheck = getBlock('### 10.2 `tests/layout-check.js`');
layoutCheck = layoutCheck.replace(
  'const b = await chromium.launch();',
  'const chromePath = process.env.CHROME_BIN || (process.platform === "win32" && require("fs").existsSync("C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe") ? "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe" : undefined);\n  const b = await chromium.launch({ executablePath: chromePath });'
);
fs.writeFileSync('tests/layout-check.js', layoutCheck.trim() + '\n', 'utf8');
console.log('Wrote tests/layout-check.js');

// 12. tests/css-coverage.js
const cssCoverage = getBlock('### 10.3 `tests/css-coverage.js`');
fs.writeFileSync('tests/css-coverage.js', cssCoverage.trim() + '\n', 'utf8');
console.log('Wrote tests/css-coverage.js');

console.log('ALL VERBATIM FILES EXTRACTED SUCCESSFULLY!');
