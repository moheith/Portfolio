const vm = require('vm'), fs = require('fs'), path = require('path');
const s = fs.readFileSync(path.join(__dirname, '../js/content.js'), 'utf8') + ';CONTENT;';
const CONTENT = vm.runInNewContext(s);
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

function resolve(p) {
  const parts = p.split('.');
  let cur = CONTENT;
  for (const part of parts) {
    if (cur === undefined || cur === null) return undefined;
    cur = cur[part];
  }
  return cur;
}

const re = /data-c="([^"]+)"/g;
let m, missing = [], count = 0;
while ((m = re.exec(html))) {
  count++;
  const val = resolve(m[1]);
  if (val === undefined) missing.push(m[1]);
}
console.log(`Checked ${count} data-c attributes. Missing: ${missing.length}`);
if (missing.length) {
  console.log('Missing paths:', missing);
  process.exit(1);
}
console.log('ALL data-c paths resolved perfectly!');
