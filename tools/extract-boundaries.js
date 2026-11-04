const fs = require('fs');
const content = fs.readFileSync('PORTFOLIO_BUILD_PROMPT_V3.md', 'utf8');
const lines = content.split('\n');

const targets = [
  { name: 'css/tokens.css', pattern: '### 3.1 `css/tokens.css`' },
  { name: 'favicon.svg', pattern: '`assets/icons/favicon.svg`' },
  { name: 'manifest.webmanifest', pattern: '`manifest.webmanifest`' },
  { name: 'css/swarm.css', pattern: '**css/swarm.css**' },
  { name: 'js/swarm.js', pattern: '**js/swarm.js**' },
  { name: 'js/hud.js', pattern: '**js/hud.js**' },
  { name: 'js/main.js', pattern: '### 8.1 `js/main.js`' },
  { name: 'js/content.js', pattern: '### 9.1 `js/content.js`' },
  { name: 'js/render.js', pattern: '### 9.2 `js/render.js`' },
  { name: 'index.html', pattern: '### 9.3 `index.html`' },
  { name: 'tests/swarm-check.js', pattern: '### 10.1 `tests/swarm-check.js`' },
  { name: 'tests/layout-check.js', pattern: '### 10.2 `tests/layout-check.js`' },
  { name: 'tests/css-coverage.js', pattern: '### 10.3 `tests/css-coverage.js`' },
];

for (const t of targets) {
  const lineIdx = lines.findIndex(l => l.includes(t.pattern));
  if (lineIdx === -1) {
    console.log('NOT FOUND: ' + t.name);
    continue;
  }
  let blockStart = -1, blockEnd = -1;
  for (let i = lineIdx; i < lines.length; i++) {
    if (lines[i].trim().startsWith('```')) {
      if (blockStart === -1) {
        blockStart = i;
      } else {
        blockEnd = i;
        break;
      }
    }
  }
  console.log(t.name + ': line ' + (blockStart + 2) + ' to ' + (blockEnd + 1) + ' (' + (blockEnd - blockStart - 1) + ' lines)');
}
