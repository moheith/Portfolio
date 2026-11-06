/* tests/css-coverage.js — every class used in index.html + render.js must be styled somewhere in css/*.css (except pure state/utility hooks).
   Usage: node tests/css-coverage.js   → prints classes with no CSS rule. Exit code 1 if any are missing. */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const read = (f) => { try { return fs.readFileSync(path.join(root, f), 'utf8'); } catch (e) { console.warn('missing file: ' + f); return ''; } };
const markup = read('index.html') + read('js/render.js');
const css = ['tokens', 'base', 'layout', 'components', 'swarm', 'polish'].map((n) => read(`css/${n}.css`)).join('\n');
const classes = new Set();
for (const m of markup.matchAll(/class="([^"$]*)"/g)) for (const c of m[1].split(/\s+/)) if (c && !/[${}]/.test(c)) classes.add(c);
const IGNORE = new Set(['is-active', 'is-building', 'is-open', 'is-now', 'is-lit', 'is-live', 'is-built', 'g-arrow', 'g-cross', 'g-ibeam']);
const missing = [...classes].filter((c) => !IGNORE.has(c) && !new RegExp('[.#\\[\\s,>+~(]\\.?' + c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?![\\w-])').test(css) && !css.includes('.' + c));
console.log(missing.length ? 'UNSTYLED CLASSES:\n  ' + missing.join('\n  ') : 'All ' + classes.size + ' classes have CSS.');
process.exit(missing.length ? 1 : 0);
