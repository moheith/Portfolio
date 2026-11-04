/* tools/check-layers.js — no browser needed. Verifies that index.html and js/swarm-script.js agree on all layers.
   Run:  node tools/check-layers.js        (exit code 0 = OK) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/swarm-script.js'), 'utf8') + ';SWARM_SCRIPT');
const re = /data-layer="([a-z]+)"\s+data-layer-id="([^"]+)"/g;
const inHtml = new Map(); let m, dup = [];
while ((m = re.exec(html))) { if (inHtml.has(m[2])) dup.push(m[2]); inHtml.set(m[2], m[1]); }
const inScript = new Map(script.layers.map((l) => [l.id, l.k]));
const missing = [...inScript.keys()].filter((id) => !inHtml.has(id));
const extra = [...inHtml.keys()].filter((id) => !inScript.has(id));
const wrongType = [...inScript.keys()].filter((id) => inHtml.has(id) && inHtml.get(id) !== inScript.get(id));
const badText = [];   // text layers must contain plain text only: no "<" before the closing tag
const reText = /<(\w+)[^>]*data-layer="text"[^>]*>([\s\S]*?)<\/\1>/g;
while ((m = reText.exec(html))) if (/</.test(m[2])) badText.push(m[0].slice(0, 80));
console.log(`layers in html: ${inHtml.size}, in script: ${inScript.size}, agents: ${script.agentCount}, duration: ${script.duration}s`);
const problems = { missingInHtml: missing, extraInHtml: extra, wrongType, duplicates: dup, textLayersWithChildren: badText };
let bad = 0; for (const [k, v] of Object.entries(problems)) if (v.length) { bad++; console.error('PROBLEM', k, v.slice(0, 10)); }
if (inHtml.size !== 364 || inScript.size !== 364) { bad++; console.error('PROBLEM expected exactly 364 layers'); }
process.exit(bad ? 1 : 0);
