/* js/swarm.js — AGENT SWARM BUILD ENGINE v2 (TESTED in Chromium via Playwright).
   A swarm of arrow cursors ("agents") visibly builds every [data-layer] element of the page:
   fly -> drag a selection box (crosshair) -> resize / move it -> type text (I-beam) -> select + retype / fix typos ->
   fill placeholders -> reveal the real element. Plus rulers, snap guide, section sweeps, HUD events, finale orbit.
   Public API: window.Swarm  (start, abort, goLive, replay, setSpeed, setTour, setSound, on, state, stats)
   Events (Swarm.on): state(s) progress(built,total) agents(n) tour(bool) speed(x) sound(bool) pace(p) layer(el,type) section(name) replay() end('live'|'abort')   */
(() => {
  'use strict';

  /* ======================================================================= 0. CONFIG + STATE */
  const COLORS = ['#5eead4', '#fb923c', '#ffffff', '#a78bfa', '#7dd3fc', '#fda4af', '#fcd34d', '#86efac'];
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const ABORT = { abort: true };

  const S = window.Swarm = {
    cfg: {
      startAgents: 18, maxAgents: 30,
      targetSeconds: 51.4,                                   // total run time at 1x (the pace controller steers to this)
      joins: [[6, 19], [12, 23], [17, 24], [31, 28], [39, 29], [48, 30]],   // [seconds at 1x, agent count] (measured from the reference)
      editRate: 0.34,                                        // share of long text layers that get a select-and-retype / typo-fix pass
      resizeRate: 0.5,                                       // share of images/cards that are first drawn too small, then resized
      moveRate: 0.35,                                        // share of cards/shapes first drawn off-position, then dragged into place
      swatchRate: 0.6,                                       // share of buttons that get a colour-swatch pick
      previewSections: ['nav', 'hero'],                      // sections that get the "all wireframes at once" stage
      finaleTarget: '#poster',                               // element the cursors orbit at the end
      seed: 7, speed: 1,
      scanMs: 800, scatterMs: 420, previewMs: 700
    },
    speed: 1, pace: 1, tour: true, sound: false,
    t: 0, real: 0,                                           // virtual ms (speed-scaled) and real ms (clamped), since the engine started
    state: 'idle',                                           // idle | scan | build | finale | live | abort
    agents: [], layers: [], sections: new Map(),
    built: 0, total: 0, run: 0, stop: false,
    doneSeconds: 0, userScrolled: false
  };

  /* ---- tiny event emitter ---- */
  const handlers = {};
  S.on = (ev, fn) => { (handlers[ev] = handlers[ev] || []).push(fn); return S; };
  const emit = (ev, a, b) => { (handlers[ev] || []).forEach((fn) => { try { fn(a, b); } catch (e) { console.error(e); } }); };

  /* ======================================================================= 1. UTILITIES */
  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function mulberry(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  let R = mulberry(7);                                       // global rng (reseeded every run so replays look identical)

  /* reference progress curve: fraction of layers built after u = elapsed / target (from the measured video) */
  const CURVE = [[0, 0], [0.035, 0], [0.078, 0.113], [0.175, 0.255], [0.321, 0.379], [0.545, 0.516], [0.72, 0.72], [0.944, 0.937], [1, 1]];
  function curve(u) {
    if (u <= 0) return 0; if (u >= 1) return 1;
    for (let i = 1; i < CURVE.length; i++) if (u <= CURVE[i][0]) { const [u0, f0] = CURVE[i - 1], [u1, f1] = CURVE[i]; return lerp(f0, f1, (u - u0) / (u1 - u0)); }
    return 1;
  }

  /* ======================================================================= 2. CLOCK: ONE rAF LOOP, VIRTUAL TIME */
  const tasks = new Set();          // (dt) => true when finished       (tweens, sleeps)
  const followers = new Set();      // () => void, every frame, AFTER tasks (boxes, agents tracking things, scroll)
  const pending = new Set();        // resolvers to flush on abort
  let rafId = 0, lastNow = 0;

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    const dtReal = Math.min(100, now - (lastNow || now)); lastNow = now;
    S.real += dtReal;
    const dt = dtReal * S.speed; S.t += dt;
    for (const k of [...tasks]) if (k(dt)) tasks.delete(k);
    for (const f of [...followers]) f(dt);
  }
  const startClock = () => { if (!rafId) { lastNow = 0; rafId = requestAnimationFrame(frame); } };
  const stopClock = () => { cancelAnimationFrame(rafId); rafId = 0; };

  /* tween(ms, step): durations are in "1x milliseconds" and are multiplied by S.pace (pace controller) */
  function tween(ms, step) {
    return new Promise((resolve) => {
      /* pace stretches an action, but never beyond ~2.2 s */
      const dur = Math.max(1, Math.min(ms * S.pace, Math.max(ms, 2200))); let el = 0; const rec = () => resolve();
      pending.add(rec);
      tasks.add((dt) => { el += dt; const t = clamp(el / dur, 0, 1); if (step) step(t); if (t >= 1) { pending.delete(rec); resolve(); return true; } return false; });
    });
  }
  const sleep = (ms) => tween(ms, null);
  const flush = () => { const p = [...pending]; pending.clear(); tasks.clear(); p.forEach((r) => r()); };

  /* ======================================================================= 3. SOUND (default OFF) */
  const Sound = {
    ctx: null, last: 0,
    enable() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; } } if (this.ctx.state === 'suspended') this.ctx.resume(); },
    tone(freq, dur, type, gain, when = 0) {
      if (!S.sound || !this.ctx) return; const c = this.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = gain; o.connect(g); g.connect(c.destination);
      const t0 = c.currentTime + when; g.gain.setValueAtTime(gain, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.start(t0); o.stop(t0 + dur + 0.02);
    },
    tick() { const n = performance.now(); if (n - this.last < 70) return; this.last = n; this.tone(1800, 0.012, 'square', 0.03); },
    whoosh() {
      if (!S.sound || !this.ctx) return; const c = this.ctx, len = c.sampleRate * 0.4, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = buf; f.type = 'bandpass'; f.frequency.value = 900; g.gain.value = 0.05;
      s.connect(f); f.connect(g); g.connect(c.destination); s.start();
    },
    chime() { this.tone(659, 0.35, 'sine', 0.06); this.tone(988, 0.5, 'sine', 0.06, 0.16); }
  };
  S.setSound = (on) => { S.sound = !!on; if (on) Sound.enable(); emit('sound', S.sound); };

  /* ======================================================================= 4. DOM HELPERS */
  const layerEl = () => $('#sw-layer'), agentsEl = () => $('#sw-agents');
  function mk(tag, cls, parent, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  function ripple(x, y) { const r = mk('div', 'sw-ripple', layerEl()); r.style.left = x + 'px'; r.style.top = y + 'px'; setTimeout(() => r.remove(), 600); }

  /* ======================================================================= 5. LAYERS: collect, measure, claim */
  const isFixedChain = (el) => { for (let n = el; n && n !== document.documentElement; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };

  function measure(L) {
    const r = L.el.getBoundingClientRect();
    L.w = r.width; L.h = r.height;
    if (L.fixed) { L.x = r.left; L.y = r.top; } else { L.x = r.left + scrollX; L.y = r.top + scrollY; }
  }
  /* viewport rect of a layer, live (follows page scroll) */
  function vr(L) { return L.fixed ? { x: L.x, y: L.y, w: L.w, h: L.h } : { x: L.x - scrollX, y: L.y - scrollY, w: L.w, h: L.h }; }
  const isOff = (v) => v.x > innerWidth + 4 || v.x + v.w < -4 || v.y > innerHeight + 260 || v.y + v.h < -260;

  const secName = (el) => { const s = el.closest('[data-swarm-section]'); return s ? s.dataset.swarmSection : 'page'; };
  function collect() {
    const out = []; let i = 0;
    S.sections = new Map();
    document.querySelectorAll('[data-layer]').forEach((el) => {
      const cs = getComputedStyle(el);
      el.classList.remove('is-built');
      const r = el.getBoundingClientRect();
      if (cs.display === 'none' || (r.width < 0.5 && r.height < 0.5)) { el.classList.add('is-built'); return; }   // collapsed / hidden: never part of the show
      const type = el.dataset.layer;
      const L = { el, type, i: i++, claimed: false, done: false, fixed: isFixedChain(el), section: secName(el), mode: null, full: null };
      if ((type === 'text' || type === 'chip')) {
        if (el.children.length) { L.mode = 'wipe'; console.warn('[swarm] text layer has child elements; using wipe instead of typing:', el); }
        else { L.full = el.textContent; if (cs.display === 'inline') { el.style.display = 'inline-block'; console.warn('[swarm] text layer was display:inline; forced inline-block: <' + el.tagName.toLowerCase() + ' class="' + el.className + '">'); } }
        if (el.dataset.swarm === 'wipe') L.mode = 'wipe';
      }
      measure(L); out.push(L);
    });
    out.sort((a, b) => (a.y - b.y) || (a.x - b.x) || (a.i - b.i));
    out.forEach((L, k) => { L.k = k; L.rnd = mulberry(S.cfg.seed * 977 + L.i * 31 + 5); });
    S.layers = out; S.total = out.length; S.built = 0; S.firstFree = 0;
    out.forEach((L) => {
      let s = S.sections.get(L.section); if (!s) { s = { name: L.section, el: L.el.closest('[data-swarm-section]'), total: 0, built: 0, started: false, committed: false }; S.sections.set(L.section, s); }
      s.total++;
    });
  }
  const remeasureFree = () => { for (const L of S.layers) if (!L.claimed) measure(L); };

  /* next layer for an agent: reading order inside the visible window, biased to the agent's position */
  function claim(a) {
    const L0 = S.layers, n = L0.length;
    while (S.firstFree < n && L0[S.firstFree].claimed) S.firstFree++;
    if (S.firstFree >= n) return null;
    const lo = scrollY - 90, hi = scrollY + innerHeight + 60;
    let best = null, bestScore = 1e12, seen = 0;
    for (let k = S.firstFree; k < n && seen < 44; k++) {
      const L = L0[k]; if (L.claimed) continue;
      const top = L.fixed ? scrollY + L.y : L.y;
      if (top > hi) break; // never claim offscreen layers: wait for camera to arrive
      seen++;
      const v = vr(L); const score = (top - lo) * 1 + Math.hypot(v.x - a.x, v.y - a.y) * 0.32 + L.k * 0.01;
      if (score < bestScore) { bestScore = score; best = L; }
    }
    if (best) { best.claimed = true; S.lastClaim = S.t; }
    return best;
  }

  /* ======================================================================= 6. AGENT (cursor) */
  class Agent {
    constructor(id, x, y) {
      this.id = id; this.color = COLORS[id % COLORS.length]; this.x = x; this.y = y; this.rot = 0; this.mode = 'arrow';
      this.vx = (R() - 0.5) * 2; this.vy = (R() - 0.5) * 2; this.track = null; this.idle = true; this.run = S.run; this.theta = 0; this.radius = 100; this.flock = null;
      const el = this.el = mk('div', 'sw-cursor', agentsEl()); el.dataset.mode = 'arrow';
      el.innerHTML =
        `<svg class="g-arrow" viewBox="0 0 24 24"><path d="M3 2 L3 19 L7.6 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.6 L16.6 13.6 Z" fill="${this.color}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>` +
        `<svg class="g-cross" viewBox="0 0 24 24"><g transform="translate(-9 -10)"><path d="M12 5V19M5 12H19" stroke="#fff" stroke-width="1.6" stroke-linecap="square"/><path d="M12 5V19M5 12H19" stroke="${this.color}" stroke-width=".6" opacity=".9"/></g></svg>` +
        `<svg class="g-ibeam" viewBox="0 0 24 24"><g transform="translate(-9 -10)"><path d="M9.5 4H14.5M9.5 20H14.5M12 4V20" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none"/></g></svg>`;
      this.draw();
    }
    setMode(m) { this.mode = m; this.el.dataset.mode = m; }
    draw() { this.el.style.transform = `translate(${this.x.toFixed(1)}px,${this.y.toFixed(1)}px) rotate(${this.mode === 'arrow' || this.mode === 'grab' ? this.rot.toFixed(1) : 0}deg)`; }
    click() { this.el.classList.add('is-click'); setTimeout(() => this.el.classList.remove('is-click'), 140 / Math.max(1, S.speed)); ripple(this.x, this.y); }
    /* curved flight (quadratic bezier); the target is a function so it can follow a scrolling page */
    async flyTo(getT, ms) {
      this.track = null; this.setMode('arrow'); this.idle = false;
      const sx = this.x, sy = this.y; let [tx, ty] = getT();
      const cx = (sx + tx) / 2 + (R() - 0.5) * 220, cy = (sy + ty) / 2 + (R() - 0.5) * 220;
      const heading = (Math.atan2(ty - sy, tx - sx) * 180) / Math.PI + 135;
      await tween(ms, (t) => {
        [tx, ty] = getT(); const e = easeInOut(t), u = 1 - e;
        this.x = u * u * sx + 2 * u * e * cx + e * e * tx; this.y = u * u * sy + 2 * u * e * cy + e * e * ty;
        this.rot = heading * Math.sin(Math.PI * Math.min(1, t * 1.1)) * 0.3; this.draw();
      });
      this.rot = 0; this.draw();
    }
  }

  /* idle flock: random acceleration + pull to a centre, speed capped, arrow points along velocity */
  function flockStep(a, dt, cx, cy, pull) {
    const k = dt / 16.7;
    a.vx += ((R() - 0.5) * 0.35 + (cx - a.x) * pull) * k; a.vy += ((R() - 0.5) * 0.35 + (cy - a.y) * pull) * k;
    const sp = Math.hypot(a.vx, a.vy), mx = 1.6; if (sp > mx) { a.vx *= mx / sp; a.vy *= mx / sp; }
    a.x = clamp(a.x + a.vx * k, 20, innerWidth - 20); a.y = clamp(a.y + a.vy * k, 24, innerHeight - 70);
    a.rot = (Math.atan2(a.vy, a.vx) * 180) / Math.PI + 135; a.draw();
  }

  /* ======================================================================= 7. GHOST BOX */
  class Box {
    constructor(kind, L) {
      this.L = L; this.gx = 0; this.gy = 0; this.ox = 0; this.oy = 0; this.kind = kind; this.lastPill = '';
      const el = this.el = mk('div', `sw-box sw-box--${kind}`, layerEl(), '<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><b></b>');
      this.pill = el.querySelector('b'); this.f = () => this.update(); followers.add(this.f); this.update();
    }
    update() {
      const r = vr(this.L); const w = Math.max(0, r.w * this.gx), h = Math.max(0, r.h * this.gy);
      this.el.style.transform = `translate(${(r.x + this.ox).toFixed(1)}px,${(r.y + this.oy).toFixed(1)}px)`;
      this.el.style.width = w.toFixed(1) + 'px'; this.el.style.height = h.toFixed(1) + 'px';
      const p = w < 4 && h < 4 ? '' : `${Math.round(w)} × ${Math.round(h)}`; if (p !== this.lastPill) { this.pill.textContent = p; this.pill.style.display = p ? '' : 'none'; this.lastPill = p; }
    }
    corner() { const r = vr(this.L); return { x: r.x + this.ox + r.w * this.gx, y: r.y + this.oy + r.h * this.gy }; }
    fade() { followers.delete(this.f); this.el.classList.add('is-out'); setTimeout(() => this.el.remove(), 280); }
    kill() { followers.delete(this.f); this.el.remove(); }
  }

  /* static wireframe previews (the "everything outlined at once" stage of the hero) */
  const previews = new Map();
  function makePreview(L) {
    const e = mk('div', `sw-pre ${L.type === 'image' ? 'fill' : ''} ${L.type === 'card' ? 'card' : ''}`, layerEl(), '<b></b>');
    const f = () => { const r = vr(L); e.style.transform = `translate(${r.x.toFixed(1)}px,${r.y.toFixed(1)}px)`; e.style.width = r.w + 'px'; e.style.height = r.h + 'px'; };
    e.querySelector('b').textContent = `${Math.round(L.w)} × ${Math.round(L.h)}`; f(); followers.add(f); previews.set(L, { e, f });
    requestAnimationFrame(() => e.classList.add('in'));
  }
  function dropPreview(L) { const p = previews.get(L); if (!p) return; followers.delete(p.f); p.e.style.opacity = 0; setTimeout(() => p.e.remove(), 250); previews.delete(L); }

  /* ======================================================================= 8. EFFECTS: rulers, scan, guide, sweep */
  let rulerTimer = 0;
  function buildRulers() {
    const top = $('#sw-ruler-top'), left = $('#sw-ruler-left'); top.innerHTML = ''; left.innerHTML = '';
    for (let x = 100; x < innerWidth; x += 100) { const s = mk('span', '', top, String(x)); s.style.left = x + 'px'; }
    for (let k = 1; k * 100 < innerHeight; k++) { const s = mk('span', '', left); s.style.top = k * 100 + 'px'; s.dataset.k = k; s.textContent = String(k * 100); }
  }
  function updateRulerLabels() { const base = Math.floor(scrollY / 100) * 100, off = scrollY - base; $('#sw-ruler-left').querySelectorAll('span').forEach((s) => { const k = +s.dataset.k; s.style.top = (k * 100 - off) + 'px'; s.textContent = String(base + k * 100); }); }
  async function showRulers(ms, run) {
    const t = $('#sw-ruler-top'), l = $('#sw-ruler-left'); t.classList.add('on'); l.classList.add('on'); updateRulerLabels();
    const key = ++rulerTimer; await sleep(ms); if (key === rulerTimer && S.run === run) { t.classList.remove('on'); l.classList.remove('on'); }
  }
  function scanFlash() { const a = $('#sw-scan-top'), b = $('#sw-scan-left'); [a, b].forEach((e) => { e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); }); }

  function guideFor(sec) {
    const g = $('#sw-guide'); let x = Infinity; S.layers.forEach((L) => { if (L.section === sec.name && !L.fixed && L.w > 4) x = Math.min(x, L.x - scrollX); });
    if (!isFinite(x)) return; g.style.left = Math.round(x) + 'px'; g.classList.remove('slow'); g.classList.add('on'); S.guideOwner = sec.name;
  }
  function sectionStart(L) {
    const s = S.sections.get(L.section); if (!s || s.started) return; s.started = true;
    if (L.section !== 'nav' && L.section !== 'hero') { showRulers(1200, S.run); }
    if (s.el && s.el.dataset.guide) guideFor(s);
  }
  function sectionDone(L) {
    const s = S.sections.get(L.section); if (!s) return; s.built++;
    if (s.built >= s.total && !s.committed) { s.committed = true; emit('section', s.name); commitSweep(s); if (S.guideOwner === s.name) { const g = $('#sw-guide'); g.classList.add('slow'); setTimeout(() => g.classList.remove('on'), 400 / S.speed); } }
  }
  async function commitSweep(s) {
    if (!s.el || s.name === 'nav') return; const run = S.run;
    const sw = mk('div', 'sw-sweep', layerEl()); Sound.whoosh();
    const left = Math.max(0, s.el.getBoundingClientRect().left);
    await tween(700, (t) => { if (!sw.isConnected) return; const r = s.el.getBoundingClientRect(); const y = clamp(r.bottom - 2, 2, innerHeight - 2); sw.style.top = y + 'px'; sw.style.left = left + 'px'; sw.style.width = (easeOut(t) * (r.width)) + 'px'; });
    if (S.run !== run) return; sw.classList.add('is-out'); setTimeout(() => sw.remove(), 400);
  }

  /* ======================================================================= 9. THE BUILD CHOREOGRAPHY */
  function finish(L, anim, dur) {
    if (L.done) return; L.done = true; L.claimed = true; const el = L.el;
    if (L.full != null && L.mode !== 'wipe') { el.textContent = L.full; el.style.minWidth = el.style.minHeight = ''; }
    el.classList.add('is-built'); if (anim) el.classList.add(anim);
    dropPreview(L); S.built++; emit('progress', S.built, S.total); emit('layer', el, L.type); sectionDone(L);
  }

  /* ---- text engine: typed span + hidden rest span + inline caret (zero layout shift) ---- */
  function paint(L, segs, rest) {
    L.el.innerHTML = segs.map((s) => `<span${s.c ? ` class="${s.c}"` : ''}>${esc(s.t)}</span>`).join('') + '<i class="sw-caret"></i>' + `<span class="sw-rest">${esc(rest)}</span>`;
    L.caret = L.el.querySelector('.sw-caret');
  }
  function caretPos(L) {
    const c = L.caret; if (!c || !c.isConnected) return null; const r = c.getBoundingClientRect();
    if (!r.height) { const e = L.el.getBoundingClientRect(); return { x: e.left + 4, y: e.top + e.height / 2 }; }
    return { x: r.left + 8, y: r.top + r.height / 2 };
  }
  /* type `str` after `prefix` segments; `restAfter(n)` gives the hidden remainder so the layout is final from the first character */
  async function typeStr(a, L, prefix, str, restAfter, msPerChar, chk) {
    const ch = Array.from(str), n = ch.length; if (!n) { paint(L, prefix, restAfter(0)); return; }
    const total = clamp(n * msPerChar, 180, 1900); let last = -1;
    await tween(total, (t) => {
      const k = Math.min(n, Math.floor(t * n + 0.999)); if (k === last) return; last = k;
      paint(L, prefix.concat([{ t: ch.slice(0, k).join('') }]), restAfter(k));
      if (ch[k - 1] === ' ') Sound.tick();
    });
    chk();
  }
  function makeDraft(full) {
    const pool = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor'; const ch = Array.from(full); const len = Math.max(5, Math.floor(ch.length * 0.55));
    return ch.length <= 12 ? 'Title here'.slice(0, Math.max(4, ch.length - 2)) : pool.slice(0, len).trim();
  }
  function makeTypo(full) {
    const words = []; const re = /[A-Za-z]{5,}/g; let m; while ((m = re.exec(full))) words.push([m.index, m[0]]); if (!words.length) return null;
    const [idx, w] = words[Math.floor(words.length / 2)]; const c = Array.from(w); const j = Math.min(2, c.length - 2); [c[j], c[j + 1]] = [c[j + 1], c[j]];
    if (c.join('') === w) return null; return { a: idx, b: idx + w.length, wrong: c.join(''), right: w };
  }

  async function typeLayer(a, L, box, chk) {
    const el = L.el, full = L.full, ch = Array.from(full), n = ch.length, isChip = L.type === 'chip', mpc = isChip ? 22 : 32;
    const b = el.getBoundingClientRect(); el.style.minWidth = b.width + 'px'; el.style.minHeight = b.height + 'px';
    el.classList.add('is-built');
    a.setMode('ibeam'); a.track = () => { const p = caretPos(L); if (!p) return null; return { x: lerp(a.x, p.x, 0.55), y: lerp(a.y, p.y, 0.55) }; };
    paint(L, [], full);
    const mode = L.rnd() < S.cfg.editRate && !isChip && n >= 10 ? (n >= 16 && L.rnd() < 0.5 ? 'replace' : 'fix') : 'plain';
    const typo = mode === 'fix' ? makeTypo(full) : null;
    if (mode === 'replace') {
      const draft = makeDraft(full);
      await typeStr(a, L, [], draft, () => '', mpc * 0.8, chk);
      await sleep(180); chk();
      a.click(); await sleep(70); a.click();                                   // double-click = select
      paint(L, [{ t: draft, c: 'sw-sel' }], ''); await sleep(280); chk();
      paint(L, [], ''); await sleep(170); chk();                                // Delete
      await typeStr(a, L, [], full, (k) => ch.slice(k).join(''), mpc, chk);
    } else if (mode === 'fix' && typo) {
      const wrongFull = full.slice(0, typo.a) + typo.wrong + full.slice(typo.b), wch = Array.from(wrongFull);
      await typeStr(a, L, [], wrongFull, (k) => wch.slice(k).join(''), mpc, chk);
      await sleep(240); chk();
      paint(L, [{ t: wrongFull.slice(0, typo.a) }, { t: typo.wrong, c: 'sw-sel' }, { t: wrongFull.slice(typo.b) }], '');      // select the bad word
      const sel = el.querySelector('.sw-sel');
      a.track = () => { const sr = sel.getBoundingClientRect(); return { x: lerp(a.x, sr.left + sr.width / 2, 0.4), y: lerp(a.y, sr.top + sr.height / 2, 0.4) }; };
      await sleep(120); chk(); a.click(); await sleep(70); a.click(); await sleep(260); chk();
      paint(L, [{ t: full.slice(0, typo.a) }], full.slice(typo.b));            // Delete the word, then retype it correctly
      a.track = () => { const p = caretPos(L); return p ? { x: lerp(a.x, p.x, 0.55), y: lerp(a.y, p.y, 0.55) } : null; };
      await sleep(150); chk();
      await typeStr(a, L, [{ t: full.slice(0, typo.a) }], typo.right, (k) => Array.from(typo.right).slice(k).join('') + full.slice(typo.b), 60, chk);
    } else {
      await typeStr(a, L, [], full, (k) => ch.slice(k).join(''), mpc, chk);
    }
    await sleep(90); chk();
  }

  /* ---- box drawing: drag from the top-left corner to the bottom-right, optionally resize/move afterwards ---- */
  async function drawBox(a, L, box, variant, chk) {
    a.setMode('cross'); a.track = () => box.corner(); a.idle = false;
    const tgtX = variant === 'resize' ? 0.6 + L.rnd() * 0.12 : 1, tgtY = variant === 'resize' ? 0.62 + L.rnd() * 0.12 : 1;
    if (variant === 'move') { box.ox = 22 + L.rnd() * 20; box.oy = 14 + L.rnd() * 14; }
    const vert = variant === 'line' && L.h > L.w * 3;                      // vertical hairlines are dragged top -> bottom
    await tween(variant === 'line' ? 240 : 300, (t) => { const e = easeOut(t); if (variant === 'line') { box.gx = vert ? 1 : e; box.gy = vert ? e : 1; } else { box.gx = e * tgtX; box.gy = e * tgtY; } }); chk();
    if (variant === 'resize') {                                           // grab the bottom-right handle and drag it to the right size
      await sleep(150); chk(); a.click();
      await tween(280, (t) => { const e = easeInOut(t); box.gx = lerp(tgtX, 1, e); box.gy = lerp(tgtY, 1, e); }); chk();
    }
    if (variant === 'move') {                                             // grab the box by its middle and drag it into place
      await sleep(110); chk();
      const ox0 = box.ox, oy0 = box.oy;
      a.setMode('grab'); a.track = () => { const r = vr(L); return { x: r.x + box.ox + r.w / 2, y: r.y + box.oy + r.h / 2 }; };
      await sleep(80); chk(); a.click();
      await tween(300, (t) => { const e = easeInOut(t); box.ox = lerp(ox0, 0, e); box.oy = lerp(oy0, 0, e); }); chk();
    }
    box.gx = box.gy = 1;
  }

  const boxKind = (L) => ({ text: 'text', chip: 'text', image: 'image', card: 'card', shape: 'shape', button: 'button', icon: 'icon', line: 'line', input: 'input', logo: 'logo' }[L.type] || 'text');
  const flightMs = (a, L) => { const v = vr(L); return clamp(260 + Math.hypot(v.x - a.x, v.y - a.y) * 0.5, 320, 950); };

  async function build(a, L) {
    const run = a.run, chk = () => { if (S.stop || S.run !== run) throw ABORT; };
    const W = async (p) => { await p; chk(); };
    sectionStart(L); dropPreview(L);
    let v = vr(L);
    if (isOff(v)) { await W(sleep(50)); finish(L, null); return; }                          // far off-screen (slider overflow etc.): just appear

    if (L.type === 'logo') return buildLogoRow(a, L, chk);

    await W(a.flyTo(() => { const r = vr(L); return [r.x, r.y]; }, flightMs(a, L)));
    const bigPanel = L.type === 'shape' && L.w > 280 && L.h > 160;
    const kind = bigPanel ? 'card' : boxKind(L);
    const box = new Box(kind, L);
    const big = L.w * L.h > 30000;

    try {
      /* ------------- images ------------- */
      if (L.type === 'image') {
        await drawBox(a, L, box, L.rnd() < S.cfg.resizeRate && big ? 'resize' : 'drag', chk);
        box.el.classList.add('is-placeholder'); const prog = mk('div', 'prog', box.el); a.setMode('arrow');
        await W(tween(340, (t) => { prog.style.width = (t * 100) + '%'; }));
        L.el.classList.add('is-built'); L.el.style.animationDuration = ''; finish(L, 'sw-in-blur'); await W(sleep(170)); box.fade();
      }
      /* ------------- text + chips ------------- */
      else if ((L.type === 'text' || L.type === 'chip') && L.mode !== 'wipe') {
        await drawBox(a, L, box, 'drag', chk);
        await typeLayer(a, L, box, chk); finish(L, null); box.fade();
      } else if (L.type === 'text' || L.type === 'chip') {                                   // wipe (giant gradient word / text with child nodes)
        await drawBox(a, L, box, big ? 'resize' : 'drag', chk); a.setMode('arrow'); finish(L, 'sw-in-wipe'); await W(sleep(300)); box.fade();
      }
      /* ------------- buttons (colour swatch, red fill) ------------- */
      else if (L.type === 'button') {
        await drawBox(a, L, box, 'drag', chk); a.setMode('arrow');
        if (L.rnd() < S.cfg.swatchRate) {
          const r = vr(L); const sw = mk('div', 'sw-swatches', layerEl(), '<i style="background:#2f8cff"></i><i style="background:#ffffff"></i><i style="background:#ef4337"></i><i style="background:#fcd34d"></i>');
          sw.style.left = (r.x) + 'px'; sw.style.top = (r.y - 34) + 'px'; const dots = sw.querySelectorAll('i');
          const f = () => { const q = vr(L); sw.style.left = q.x + 'px'; sw.style.top = (q.y - 34) + 'px'; }; followers.add(f);
          await W(sleep(140)); a.track = () => { const d = dots[2].getBoundingClientRect(); return { x: lerp(a.x, d.left + 7, 0.4), y: lerp(a.y, d.top + 7, 0.4) }; };
          await W(sleep(300)); a.click(); dots[2].classList.add('pick'); await W(sleep(180)); followers.delete(f); sw.classList.add('is-out'); setTimeout(() => sw.remove(), 250); a.track = null;
        }
        box.el.classList.add('is-filled'); await W(sleep(220)); finish(L, 'sw-in-fade'); await W(sleep(120)); box.fade();
      }
      /* ------------- cards & big panels: red outline, optionally dragged into place ------------- */
      else if (L.type === 'card' || bigPanel) {
        await drawBox(a, L, box, L.rnd() < S.cfg.moveRate ? 'move' : (L.rnd() < S.cfg.resizeRate ? 'resize' : 'drag'), chk); a.setMode('arrow');
        await W(sleep(180)); finish(L, 'sw-in-rise'); await W(sleep(160)); box.fade();
      }
      /* ------------- icons ------------- */
      else if (L.type === 'icon') {
        await drawBox(a, L, box, 'drag', chk); a.setMode('arrow'); a.click(); finish(L, 'sw-in-pop'); await W(sleep(140)); box.fade();
      }
      /* ------------- hairlines ------------- */
      else if (L.type === 'line') {
        await drawBox(a, L, box, 'line', chk); a.setMode('arrow'); finish(L, L.h > L.w * 3 ? 'sw-in-wipey' : 'sw-in-wipe'); await W(sleep(120)); box.fade();
      }
      /* ------------- inputs: draw the field, click in, type the placeholder ------------- */
      else if (L.type === 'input') {
        await drawBox(a, L, box, 'drag', chk);
        const inp = L.el.querySelector('input'), ph = (inp && inp.placeholder) || ''; const r0 = vr(L);
        a.setMode('ibeam'); const span = mk('span', 'sw-ph', box.el); span.style.left = '38px'; span.style.top = (r0.h / 2 - 7) + 'px';
        a.track = () => { const q = span.getBoundingClientRect(); return { x: lerp(a.x, q.right + 6, 0.5), y: lerp(a.y, q.top + q.height / 2, 0.5) }; }; a.click();
        const pch = Array.from(ph); await W(tween(Math.max(300, pch.length * 40), (t) => { span.textContent = pch.slice(0, Math.ceil(t * pch.length)).join(''); }));
        await W(sleep(120)); finish(L, 'sw-in-fade'); box.fade();
      }
      /* ------------- shapes (dots, nodes, bars, panels) ------------- */
      else {
        await drawBox(a, L, box, L.rnd() < S.cfg.moveRate ? 'move' : 'drag', chk); a.setMode('arrow');
        box.el.classList.add('is-filled'); await W(sleep(160)); finish(L, 'sw-in-fade'); await W(sleep(100)); box.fade();
      }
    } catch (e) { box.kill(); throw e; }
    a.track = null; a.setMode('arrow');
  }

  /* logo chains: a long row of small RED boxes sweeping left -> right, ~120 ms apart, logos pop in colour */
  async function buildLogoRow(a, L, chk) {
    const row = [L].concat(S.layers.filter((x) => !x.claimed && x.type === 'logo' && x.section === L.section && Math.abs(x.y - L.y) < 40));
    row.forEach((x) => { x.claimed = true; }); row.sort((p, q) => p.x - q.x);
    const first = vr(row[0]); await a.flyTo(() => { const r = vr(row[0]); return [r.x, r.y]; }, flightMs(a, row[0])); chk();
    a.setMode('cross');
    for (const X of row) {
      chk(); const r = vr(X); if (isOff(r)) { finish(X, null); continue; }
      const box = new Box('logo', X); box.gx = box.gy = 1; box.update();
      a.track = () => { const q = vr(X); return { x: q.x + q.w, y: q.y + q.h }; };
      tween(150, null).then(() => { if (S.run === a.run && !S.stop) { finish(X, 'sw-in-pop'); box.fade(); } else box.kill(); });
      await tween(120, null); chk();
    }
    a.track = null; a.setMode('arrow'); await tween(160, null); chk();
  }

  /* ======================================================================= 10. LOOPS */
  async function agentLoop(a) {
    while (!S.stop && S.run === a.run) {
      const L = claim(a);
      if (!L) { if (S.layers.every((l) => l.claimed)) break; if (!a.idle) { a.cx = a.x; a.cy = a.y; } a.idle = true; a.track = null; await sleep(110); continue; }
      a.idle = false;
      try { await build(a, L); } catch (e) { if (e !== ABORT) { console.error('[swarm] build failed, forcing layer visible', e, L.el); finish(L, null); } else break; }
    }
    a.idle = true; a.track = null; a.setMode('arrow'); a.draw();
  }

  /* one follower: agents tracking things, idle flocks, auto-scroll tour, orbit, pace controller, joins, HUD progress */
  let ctlAcc = 0, loops = [];
  function mainFollower(dt) {
    /* agents */
    S.agents.forEach((a, i) => {
      if (S.orbit) return;
      if (a.track) { const p = a.track(); if (p) { a.x = p.x; a.y = p.y; } a.draw(); }
      else if (a.idle && S.state !== 'scan' && S.state !== 'live') flockStep(a, dt, a.cx || innerWidth / 2, a.cy || innerHeight / 2, 0.00012);
      else if (S.state === 'scan' && a.flock) flockStep(a, dt, a.flock.x * innerWidth, a.flock.y * innerHeight, 0.0007);
    });
    if (S.state === 'build' || S.state === 'finale') tourStep(dt);
    if (S.orbit) orbitStep(dt);
    if (S.state === 'build') controller(dt);
    if ($('#sw-ruler-left') && $('#sw-ruler-left').classList.contains('on')) updateRulerLabels();
  }

  function controller(dt) {
    /* join schedule */
    const scale = S.cfg.targetSeconds / 51.4, tsec = S.t / 1000;
    for (const [sec, count] of S.cfg.joins) while (S.agents.length < Math.min(count, S.cfg.maxAgents) && tsec >= sec * scale) spawn(true);
    /* pace controller: steer the layer count toward the reference curve so the run lasts ~targetSeconds */
    ctlAcc += dt; if (ctlAcc < 300) return; ctlAcc = 0;
    const u = S.t / (S.cfg.targetSeconds * 1000); const want = curve(u), have = S.total ? S.built / S.total : 1;
    S.pace = lerp(S.pace, clamp(2.15 * Math.exp(-4 * (want - have)), 0.3, 3.6), 0.4);   // behind schedule -> faster actions, ahead -> slower
    if (u > 1.0 || have > 0.97) S.pace = Math.min(S.pace, 0.55);           // final sprint
    emit('pace', S.pace);
  }

  function tourStep(dt) {
    if (S.stop) return; let target = null;
    if (S.tourOverride) target = S.tourOverride();
    else if (S.tour && !S.userScrolled) {
      // Guide camera by first unbuilt layer: keeps camera steady at top until hero layers finish
      let idx = 0, n = S.layers.length;
      while (idx < n && (S.layers[idx].done || S.layers[idx].fixed)) idx++;
      const L = S.layers[idx];
      if (L) target = Math.max(0, L.y - innerHeight * 0.38);
    }
    if (target == null) return;
    const max = document.documentElement.scrollHeight - innerHeight; target = clamp(target, 0, Math.max(0, max));
    const d = target - scrollY; if (Math.abs(d) < 0.6) return;
    const step = clamp(d * (1 - Math.exp(-dt / 480)), -1.1 * dt, 1.1 * dt); window.scrollTo(0, scrollY + step);
  }

  function orbitStep(dt) {
    const o = S.orbit, el = $(S.cfg.finaleTarget) || document.body, r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    S.agents.forEach((a, i) => {
      if (a.peel) { return; }
      a.theta += (0.0018 + (i % 3) * 0.0005) * dt;
      const rad = a.radius * (1 + 0.14 * Math.sin(S.t / 650 + i)); a.setMode('arrow');
      const k = 1 - Math.exp(-dt / 160), tx = cx + Math.cos(a.theta) * rad * 1.25, ty = cy + Math.sin(a.theta) * rad * 0.8;
      a.x += (tx - a.x) * k; a.y += (ty - a.y) * k;
      a.rot = ((a.theta + Math.PI / 2) * 180) / Math.PI + 135; a.draw();
    });
  }

  /* ======================================================================= 11. LIFECYCLE */
  function spawn(fromEdge) {
    const id = S.agents.length; let x = R() * innerWidth, y = R() * innerHeight;
    if (fromEdge) { const side = Math.floor(R() * 4); if (side === 0) { x = -20; } else if (side === 1) { x = innerWidth + 20; } else if (side === 2) { y = -20; } else { y = innerHeight + 20; } }
    const a = new Agent(id, x, y); a.flock = { x: 0.5, y: 0.5 }; a.cx = x; a.cy = y; S.agents.push(a); emit('agents', S.agents.length);
    if (S.state === 'build') loops.push(agentLoop(a)); return a;
  }
  function setState(s) { S.state = s; emit('state', s); }

  async function start(opts = {}) {
    Object.assign(S.cfg, opts); await teardown(true);
    const root = $('#swarm-root'); const html = document.documentElement;
    if (!root) { console.error('[swarm] #swarm-root missing'); html.classList.remove('is-building'); return; }
    window.__swarmStarted = true; html.classList.add('is-building'); S.stop = false; const run = ++S.run;
    R = mulberry(S.cfg.seed); S.speed = S.cfg.speed || 1; document.documentElement.style.setProperty('--sw-speed', S.speed);
    S.pace = 1.8; S.t = 0; S.real = 0; S.userScrolled = false; S.tourOverride = null; S.orbit = null; S.tour = true; S.agents = []; loops = []; S.guideOwner = null; S.lastClaim = 0;
    try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* ignore */ }
    window.scrollTo(0, 0);
    collect(); buildRulers(); root.classList.add('on'); layerEl().innerHTML = ''; agentsEl().innerHTML = '';
    $('#sw-watermark').classList.remove('off'); const wm = $('#sw-watermark'); if (opts.initial) wm.textContent = opts.initial;
    startClock(); followers.add(mainFollower);
    window.addEventListener('wheel', onUserScroll, { passive: true }); window.addEventListener('touchmove', onUserScroll, { passive: true }); window.addEventListener('keydown', onKey);
    remeasureTimer = setInterval(() => { if (S.state === 'build') remeasureFree(); }, 900);
    window.addEventListener('resize', onResize);

    /* ---- phase A: scan — two flocks drift around ---- */
    setState('scan'); emit('progress', 0, S.total);
    for (let i = 0; i < S.cfg.startAgents; i++) { const A = i < Math.ceil(S.cfg.startAgents / 2); const a = new Agent(i, (A ? 0.35 : 0.65) * innerWidth + (R() - 0.5) * 160, (A ? 0.6 : 0.45) * innerHeight + (R() - 0.5) * 160); a.flock = A ? { x: 0.35, y: 0.6 } : { x: 0.65, y: 0.45 }; S.agents.push(a); }
    emit('agents', S.agents.length);
    await sleep(S.cfg.scanMs); if (S.run !== run) return;

    /* ---- phase B: scatter to the edges as crosshairs / I-beams, rulers + scan bars flash ---- */
    scanFlash(); showRulers(2600, run);
    const n = S.agents.length; const ps = [];
    S.agents.forEach((a, i) => {
      a.flock = null; a.setMode(i % 2 ? 'ibeam' : 'cross'); a.idle = false;
      const tx = i < 12 ? 16 : (i % 2 ? innerWidth - 22 : 40 + (i - 12) * 30), ty = i < 12 ? 70 + i * ((innerHeight - 160) / 12) : (i % 2 ? 70 + i * 24 : innerHeight - 90);
      ps.push(a.flyTo(() => [tx, ty], S.cfg.scatterMs + R() * 160).then(() => { a.setMode(i % 2 ? 'ibeam' : 'cross'); }));
    });
    await Promise.all(ps); if (S.run !== run) return;

    /* ---- phase C: build ---- */
    S.buildT0 = S.t; setState('build');
    S.agents.forEach((a) => { a.idle = true; a.setMode('arrow'); });
    S.cfg.previewSections.forEach((sec) => S.layers.filter((L) => L.section === sec).forEach((L, k) => { tween(k * 14, null).then(() => { if (S.run === run && !L.claimed) makePreview(L); }); }));
    setTimeout(() => { if (S.run === run) $('#sw-watermark').classList.add('off'); }, 2200 / S.speed);
    await sleep(S.cfg.previewMs); if (S.run !== run) return;
    loops = S.agents.map((a) => agentLoop(a));
    for (;;) { const cur = loops.slice(); await Promise.all(cur); if (S.run !== run || S.stop) return; if (loops.length === cur.length) break; }   // agents may join while we wait
    S.layers.forEach((L) => { if (!L.done) finish(L, null); });
    await finale(run);
  }

  async function finale(run) {
    document.querySelectorAll('.sw-box, .sw-pre, .sw-sweep, .sw-swatches, .sw-ripple').forEach((e) => e.remove());
    S.doneSeconds = Math.round(S.real / 100) / 10;                          // wall-clock seconds from the first frame to the last layer
    while (S.agents.length < S.cfg.maxAgents) spawn(true);                   // the last agents always arrive before "Rebuilt by 30 agents"
    emit('agents', S.agents.length);
    S.tourOverride = () => { const el = $(S.cfg.finaleTarget); if (!el) return null; const r = el.getBoundingClientRect(); return scrollY + r.top - (innerHeight - r.height) / 2; };
    setState('finale'); Sound.chime();
    const r0 = ($(S.cfg.finaleTarget) || document.body).getBoundingClientRect(); const cx = r0.left + r0.width / 2, cy = r0.top + r0.height / 2;
    S.agents.forEach((a, i) => { a.theta = Math.atan2(a.y - cy, a.x - cx); a.radius = 105 + (i % 4) * 36; a.peel = false; a.track = null; a.idle = false; });
    S.orbit = { t0: S.t };
    /* a few agents peel off to the top-right corner, staggered */
    const peelers = S.agents.slice(-5);
    peelers.forEach((a, k) => { sleep(1400 + k * 380).then(async () => { if (S.run !== run || S.state !== 'finale') return; a.peel = true; await a.flyTo(() => [innerWidth + 40, -40], 900); }); });
  }

  const onResize = () => { clearTimeout(S.rz); S.rz = setTimeout(() => { remeasureFree(); buildRulers(); }, 150); };
  const onUserScroll = () => { if (S.state === 'build' && S.tour) { S.userScrolled = true; S.tour = false; emit('tour', false); } };
  const onKey = (e) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key) && S.state === 'build' && S.tour) onUserScroll(); };
  let remeasureTimer = 0;

  /* ---- reset every layer to its pre-build state (used by replay / abort) ---- */
  function restoreAll(markBuilt) {
    S.layers.forEach((L) => {
      const el = L.el; el.classList.remove('sw-in-fade', 'sw-in-blur', 'sw-in-pop', 'sw-in-wipe', 'sw-in-wipey', 'sw-in-rise');
      if (L.full != null && L.mode !== 'wipe') el.textContent = L.full; el.style.minWidth = el.style.minHeight = '';
      if (markBuilt) el.classList.add('is-built'); else el.classList.remove('is-built');
    });
  }

  async function teardown(forRestart) {
    S.stop = true; S.run++; flush(); await new Promise((r) => setTimeout(r, 0));
    followers.clear(); tasks.clear(); pending.clear(); previews.clear(); clearInterval(remeasureTimer);
    window.removeEventListener('wheel', onUserScroll); window.removeEventListener('touchmove', onUserScroll); window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize);
    const l = layerEl(), g = agentsEl(); if (l) l.innerHTML = ''; if (g) g.innerHTML = '';
    ['#sw-ruler-top', '#sw-ruler-left'].forEach((s) => { const e = $(s); if (e) e.classList.remove('on'); });
    const gd = $('#sw-guide'); if (gd) gd.classList.remove('on');
    S.agents = []; S.orbit = null; S.tourOverride = null; loops = [];
    if (!forRestart) { stopClock(); const root = $('#swarm-root'); if (root) root.classList.remove('on'); }
  }

  /* ---- public controls ---- */
  S.start = start;
  S.abort = async () => {                                                  // the ✕ button: reveal everything instantly
    if (S.state === 'live' || S.state === 'abort' || S.state === 'idle') return; const had = S.layers.length;
    await teardown(false); if (had) restoreAll(true); document.documentElement.classList.remove('is-building'); setState('abort'); emit('end', 'abort');
  };
  S.goLive = async () => {                                                 // "Go live" after the finale
    if (S.state !== 'finale') return; const run = S.run; S.orbit = null; setState('live');
    S.agents.forEach((a, i) => { sleep(i * 25).then(() => a.flyTo(() => [innerWidth + 60, -60], 700 + (i % 5) * 80)); });
    window.scrollTo({ top: 0, behavior: 'smooth' }); await sleep(1100); if (S.run !== run) return;
    await teardown(false); document.documentElement.classList.remove('is-building'); emit('end', 'live');
  };
  S.replay = async () => {
    const wasLive = S.state === 'live' || S.state === 'abort' || S.state === 'idle';
    if (!wasLive) { await teardown(true); restoreAll(false); } else { restoreAll(false); }
    document.documentElement.classList.add('is-building'); emit('replay'); await start({});
  };
  S.setSpeed = (v) => { S.speed = v; S.cfg.speed = v; document.documentElement.style.setProperty('--sw-speed', v); emit('speed', v); };
  S.setTour = (on) => { S.tour = !!on; S.userScrolled = !on; emit('tour', S.tour); };
  S.stats = () => ({ agents: S.agents.length, built: S.built, total: S.total, seconds: S.doneSeconds, state: S.state });
})();
