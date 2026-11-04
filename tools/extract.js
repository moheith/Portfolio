const fs = require('fs');
const path = require('path');

const promptPath = path.join(__dirname, '..', 'PORTFOLIO_BUILD_PROMPT_MAYURA_V2.md');
const text = fs.readFileSync(promptPath, 'utf8');

// Normalize line endings to \n
const normText = text.replace(/\r\n/g, '\n');

// Extract swarm-script.js
const scriptMarker = '**FILE: js/swarm-script.js**\n```js\n';
const scriptStart = normText.indexOf(scriptMarker);
if (scriptStart === -1) throw new Error('script marker not found');
const scriptEnd = normText.indexOf('\n```\n\n### 5.9 STORYBOARD', scriptStart);
if (scriptEnd === -1) throw new Error('script end not found');
const scriptCode = normText.slice(scriptStart + scriptMarker.length, scriptEnd);
fs.writeFileSync(path.join(__dirname, '..', 'js', 'swarm-script.js'), scriptCode, 'utf8');
console.log('Written js/swarm-script.js, length:', scriptCode.length);

// Extract index.html
const htmlMarker = '**FILE: index.html**\n```html\n';
const htmlStart = normText.indexOf(htmlMarker);
if (htmlStart === -1) throw new Error('html marker not found');
const htmlEnd = normText.indexOf('\n```\n\n---------------------------------------------------------------------', htmlStart);
if (htmlEnd === -1) throw new Error('html end not found');
const htmlCode = normText.slice(htmlStart + htmlMarker.length, htmlEnd);
fs.writeFileSync(path.join(__dirname, '..', 'index.html'), htmlCode, 'utf8');
console.log('Written index.html, length:', htmlCode.length);
