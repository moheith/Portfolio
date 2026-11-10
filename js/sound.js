/* js/sound.js — procedural audio for the whole site (no audio files, everything is synthesised with Web Audio).

   Always on. Browsers only allow audio after a first click / key press / tap: the speaker button in the build bar (js/hud.js)
   is that click, and any other click or key press works too — the first gesture unlocks everything (the build soundtrack joins in at the right place when that happens).

   Design
   • One shared signal chain: voices → master → soft limiter → speakers, plus a short synthetic room reverb on a send.
   • Everything is a plucked / bell-like sine voice or a filtered noise burst with a smooth envelope — no square or saw waves,
     so nothing buzzes or clicks. All notes come from one major-pentatonic scale, so any combination of sounds stays musical.
   • UI sounds: hover (airy tick), click (soft thump + tick), tabs (rising notes), modals (swell), slider (scale ticks),
     terminal keys (mechanical tick), confirm / error.
   • Build soundtrack (the cursor swarm): a quiet evolving pad that rises with progress, a pluck for every layer that is built
     (pitch climbs with progress, panned to where it appears on screen), typing ticks, drag whispers, join blips,
     a swell when a section completes and a resolving chord at the end.
   Public: window.SoundFX { enable, disable, toggle, isEnabled, playHover, playClick, playTab, playModalOpen, playModalClose,
                            playSlider, playKey, playConfirm, playError, build }   */
(() => {
  'use strict';

  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, master = null, dry = null, send = null, noiseBuf = null;
  let muted = false, unlocked = false, voices = 0;
  let lastHover = 0, lastHoverEl = null, lastSlider = 0, lastKey = 0;
  const MAX_VOICES = 28;

  /* ------------------------------------------------------------------ scale: A major pentatonic */
  const ROOT = 220;                                  // A3
  const PENTA = [0, 2, 4, 7, 9];
  const note = (step, root = ROOT) => root * Math.pow(2, (PENTA[((step % 5) + 5) % 5] + 12 * Math.floor(step / 5)) / 12);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ------------------------------------------------------------------ audio graph */
  function impulse(c, seconds, decay) {
    const len = Math.floor(c.sampleRate * seconds), buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }
  function graph() {
    if (ctx || !AC) return ctx;
    try { ctx = new AC({ latencyHint: 'interactive' }); } catch (e) { ctx = null; return null; }
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9;
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -14; lim.knee.value = 18; lim.ratio.value = 6; lim.attack.value = 0.004; lim.release.value = 0.18;
    master.connect(lim); lim.connect(ctx.destination);
    dry = ctx.createGain(); dry.gain.value = 1; dry.connect(master);
    const conv = ctx.createConvolver(); conv.buffer = impulse(ctx, 1.9, 3.2);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 220;
    send = ctx.createGain(); send.gain.value = 1; send.connect(hp); hp.connect(conv);
    const wet = ctx.createGain(); wet.gain.value = 0.34; conv.connect(wet); wet.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    return ctx;
  }
  const ready = () => !!ctx && ctx.state === 'running' && !muted;
  function out(pan, wet) {
    const g = ctx.createGain();
    let tail = g;
    if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = clamp(pan || 0, -1, 1); g.connect(p); tail = p; }
    tail.connect(dry);
    if (wet) { const s = ctx.createGain(); s.gain.value = wet; tail.connect(s); s.connect(send); }
    return g;
  }
  function done(node, stopAt, ...extra) {
    voices++;
    node.onended = () => { voices--; try { extra.forEach((n) => n.disconnect()); } catch (e) {} };
    node.stop(stopAt);
  }

  /* a plucked / bell voice: sine fundamental + softer upper partials, lowpassed, smooth attack, exponential decay */
  function pluck(freq, o = {}) {
    if (!ready() || voices > MAX_VOICES) return;
    const t = ctx.currentTime + (o.when || 0), dur = o.dur || 0.35, vol = o.gain || 0.05, att = o.attack || 0.004;
    const g = out(o.pan, o.wet == null ? 0.5 : o.wet);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.bright || 5200; lp.Q.value = 0.4; lp.connect(g);
    const parts = o.parts || [[1, 1], [2, 0.28], [3, 0.1]];
    parts.forEach(([mult, amp], i) => {
      const osc = ctx.createOscillator(), pg = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq * mult; if (o.detune) osc.detune.value = o.detune * (i ? 1 : 0);
      pg.gain.setValueAtTime(amp, t); pg.gain.exponentialRampToValueAtTime(0.0001, t + dur * (i ? 0.7 : 1));
      osc.connect(pg); pg.connect(lp); osc.start(t);
      if (i === 0) done(osc, t + dur + 0.05, pg, lp, g); else osc.stop(t + dur + 0.05);
    });
  }
  /* a filtered noise burst (clicks, air, whooshes) */
  function burst(o = {}) {
    if (!ready() || voices > MAX_VOICES) return;
    const t = ctx.currentTime + (o.when || 0), dur = o.dur || 0.03;
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = dur > 0.9;
    const f = ctx.createBiquadFilter(); f.type = o.type || 'bandpass'; f.Q.value = o.q || 1.2;
    f.frequency.setValueAtTime(o.from || 3000, t);
    if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    const g = out(o.pan, o.wet || 0);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.gain || 0.04, t + (o.attack || 0.003));
    if (o.swell) { g.gain.linearRampToValueAtTime((o.gain || 0.04) * 0.9, t + dur * 0.55); }
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); src.start(t, Math.random() * 0.5); done(src, t + dur + 0.04, f, g);
  }
  /* a soft low thump (pitch drops) */
  function thump(from, to, dur, vol, pan) {
    if (!ready() || voices > MAX_VOICES) return;
    const t = ctx.currentTime, osc = ctx.createOscillator(), g = out(pan, 0.12);
    osc.type = 'sine'; osc.frequency.setValueAtTime(from, t); osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); osc.start(t); done(osc, t + dur + 0.03, g);
  }

  /* ------------------------------------------------------------------ UI sounds */
  /* UI sounds are short, so they are scaled up relative to the (long, layered) build soundtrack */
  const UK = 2.5;
  const upluck = (f, o = {}) => pluck(f, Object.assign({}, o, { gain: (o.gain || 0.05) * UK }));
  const uburst = (o = {}) => burst(Object.assign({}, o, { gain: (o.gain || 0.04) * UK }));
  const uthump = (from, to, dur, vol, pan) => thump(from, to, dur, vol * UK, pan);
  const UI = {
    hover(el) {
      const n = performance.now();
      if (n - lastHover < 70 || el === lastHoverEl) return; lastHover = n; lastHoverEl = el;
      upluck(note(10 + Math.floor(rnd(0, 3))), { dur: 0.09, gain: 0.016, bright: 6000, parts: [[1, 1], [2, 0.12]], wet: 0.25 });
    },
    click() {
      uthump(210, 95, 0.07, 0.07);
      uburst({ from: 3400, dur: 0.016, gain: 0.035, q: 0.9 });
    },
    tab(i) {
      const s = 5 + ((i == null ? Math.floor(rnd(0, 5)) : i) % 6);
      upluck(note(s), { dur: 0.32, gain: 0.05, wet: 0.5 });
      upluck(note(s + 2), { dur: 0.28, gain: 0.022, when: 0.045, wet: 0.5 });
    },
    modalOpen() {
      uburst({ type: 'bandpass', from: 380, to: 2600, dur: 0.28, gain: 0.05, q: 0.7, swell: true, wet: 0.35 });
      [0, 4, 7].forEach((s, i) => upluck(note(s + 5), { dur: 0.7, gain: 0.04, when: 0.06 + i * 0.05, wet: 0.7, bright: 3600 }));
      uthump(120, 60, 0.2, 0.05);
    },
    modalClose() {
      uburst({ type: 'bandpass', from: 2200, to: 320, dur: 0.22, gain: 0.04, q: 0.7, swell: true, wet: 0.3 });
      upluck(note(2), { dur: 0.4, gain: 0.04, wet: 0.6, bright: 2600 });
    },
    slider(val) {
      const n = performance.now(); if (n - lastSlider < 55) return; lastSlider = n;
      const step = Math.round(clamp(val == null ? 50 : val, 0, 100) / 100 * 14);
      upluck(note(step + 5), { dur: 0.12, gain: 0.025, wet: 0.2, parts: [[1, 1], [2, 0.18]] });
    },
    key() {
      const n = performance.now(); if (n - lastKey < 22) return; lastKey = n;
      uburst({ from: rnd(1900, 3200), dur: 0.012, gain: 0.03, q: 1.6 });
      uthump(rnd(150, 190), 90, 0.03, 0.025);
    },
    confirm() {
      [0, 2, 4, 7].forEach((s, i) => upluck(note(s + 10), { dur: 0.45, gain: 0.04, when: i * 0.055, wet: 0.65 }));
    },
    error() {
      uthump(190, 120, 0.16, 0.05);
      uthump(150, 96, 0.2, 0.04);
      uburst({ from: 600, dur: 0.05, gain: 0.02, q: 0.8, type: 'lowpass' });
    },
    unlock() { [0, 4].forEach((s, i) => upluck(note(s + 10), { dur: 0.5, gain: 0.04, when: i * 0.07, wet: 0.7 })); }
  };

  /* ------------------------------------------------------------------ build soundtrack */
  const B = {
    progress: 0, section: 0, pad: null, lastLayer: 0, lastType: 0, lastDrag: 0, lastJoin: 0, lastClick: 0, density: 0,
    startPad() {
      if (!ready() || B.pad) return;
      const t = ctx.currentTime, g = ctx.createGain(), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lfoG = ctx.createGain();
      lp.type = 'lowpass'; lp.frequency.value = 320; lp.Q.value = 0.6;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.045, t + 3.2);
      const oscs = [[ROOT / 2, 'sine', 0], [ROOT / 2, 'triangle', 7], [ROOT * 0.75, 'sine', -5]].map(([f, type, det]) => {
        const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det; o.connect(lp); o.start(t); return o;
      });
      lfo.frequency.value = 0.18; lfoG.gain.value = 90; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start(t);
      lp.connect(g); g.connect(dry); const s = ctx.createGain(); s.gain.value = 0.5; g.connect(s); s.connect(send);
      B.pad = { g, lp, oscs, lfo };
      B.padProgress(B.progress);
    },
    padProgress(p) {
      B.progress = p;
      if (!B.pad || !ctx) return; const t = ctx.currentTime;
      B.pad.lp.frequency.setTargetAtTime(320 + p * 1500, t, 0.8);
      B.pad.oscs.forEach((o, i) => o.frequency.setTargetAtTime((ROOT / 2) * [1, 1, 1.5][i] * Math.pow(2, p * 0.25), t, 1.2));
    },
    stopPad(sec = 1.6) {
      const p = B.pad; if (!p || !ctx) return; B.pad = null; const t = ctx.currentTime;
      p.g.gain.cancelScheduledValues(t); p.g.gain.setValueAtTime(Math.max(0.0001, p.g.gain.value), t); p.g.gain.exponentialRampToValueAtTime(0.0001, t + sec);
      setTimeout(() => { try { p.oscs.forEach((o) => o.stop()); p.lfo.stop(); p.g.disconnect(); } catch (e) {} }, sec * 1000 + 120);
    },
    /* one layer finished building: a pluck that climbs the scale as the page fills in, panned to where it appeared */
    layer(el, type) {
      if (!ready()) return;
      const n = performance.now(); B.density = Math.max(0, B.density * Math.pow(0.5, (n - B.lastLayer) / 400)) + 1; B.lastLayer = n;
      if (B.density > 7 && Math.random() < 0.6) return;                      // thin out bursts
      const r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      const pan = r ? clamp(((r.left + r.width / 2) / innerWidth) * 2 - 1, -1, 1) * 0.7 : 0;
      const base = 3 + Math.floor(B.progress * 12) + Math.floor(rnd(0, 3));
      const vol = 0.05 / Math.sqrt(Math.max(1, B.density * 0.7));
      switch (type) {
        case 'image': case 'card': case 'logo':
          pluck(note(base + 2), { dur: 0.7, gain: vol * 1.1, pan, wet: 0.7, parts: [[1, 1], [2.76, 0.18], [5.4, 0.06]], bright: 6500 }); break;
        case 'shape': case 'line':
          thump(rnd(260, 340), 150, 0.09, vol * 1.2, pan); break;
        case 'button': case 'icon': case 'input':
          pluck(note(base + 4), { dur: 0.16, gain: vol * 0.9, pan, wet: 0.4, parts: [[1, 1], [2, 0.2]] }); break;
        default:
          pluck(note(base), { dur: 0.3, gain: vol, pan, wet: 0.5 });
      }
    },
    type() {
      const n = performance.now(); if (n - B.lastType < 80) return; B.lastType = n;
      burst({ from: rnd(2200, 3600), dur: 0.01, gain: 0.014, q: 1.8, pan: rnd(-0.5, 0.5) });
    },
    click(x) {
      const n = performance.now(); if (n - B.lastClick < 120) return; B.lastClick = n;
      const pan = x == null ? 0 : clamp((x / innerWidth) * 2 - 1, -1, 1) * 0.6;
      thump(240, 120, 0.05, 0.028, pan); burst({ from: 3600, dur: 0.012, gain: 0.014, pan });
    },
    drag(x) {
      const n = performance.now(); if (n - B.lastDrag < 150) return; B.lastDrag = n;
      const pan = x == null ? 0 : clamp((x / innerWidth) * 2 - 1, -1, 1) * 0.6;
      burst({ type: 'bandpass', from: 700, to: 2200, dur: 0.2, gain: 0.011, q: 0.9, pan, swell: true, wet: 0.2 });
    },
    join() {
      const n = performance.now(); if (n - B.lastJoin < 110) return; B.lastJoin = n;
      const s = 8 + Math.floor(B.progress * 6);
      pluck(note(s), { dur: 0.25, gain: 0.03, wet: 0.6 }); pluck(note(s + 2), { dur: 0.3, gain: 0.025, when: 0.06, wet: 0.6 });
    },
    sweep() { burst({ type: 'bandpass', from: 420, to: 3400, dur: 0.6, gain: 0.032, q: 0.6, swell: true, wet: 0.5 }); },
    sectionDone() {
      const k = B.section++ % 4, root = [0, 2, 4, 2][k];
      [0, 2, 4].forEach((s, i) => pluck(note(root + s + 5), { dur: 0.9, gain: 0.032, when: i * 0.07, wet: 0.8, bright: 4200 }));
    },
    finale() {
      B.stopPad(2.4);
      [0, 2, 4, 7, 9, 14].forEach((s, i) => pluck(note(s + 5), { dur: 2.6, gain: 0.04, when: i * 0.09, wet: 0.9, bright: 5000 }));
      thump(110, 55, 0.5, 0.08);
      burst({ type: 'bandpass', from: 500, to: 5200, dur: 0.9, gain: 0.03, q: 0.5, swell: true, wet: 0.6 });
    },
    reset() { B.stopPad(0.4); B.progress = 0; B.section = 0; B.density = 0; }
  };

  /* ------------------------------------------------------------------ mute state (remembered) */
  const KEY = 'mayura-sfx';
  const remember = (m) => { try { if (m) localStorage.setItem(KEY, 'off'); else localStorage.removeItem(KEY); } catch (e) {} };
  const announce = () => { try { window.dispatchEvent(new Event('sfx:mute')); } catch (e) {} };

  /* ------------------------------------------------------------------ unlock (browsers need one user gesture) */
  let wired = false;
  function unlock() {
    if (unlocked) return;
    if (!graph()) return;
    const go = () => {
      if (ctx.state !== 'running') return;
      unlocked = true;
      try { window.dispatchEvent(new Event('sfx:unlock')); } catch (e) {}
      ['pointerdown', 'keydown', 'touchend'].forEach((ev) => removeEventListener(ev, unlock, true));
      UI.unlock();
      const st = window.Swarm && Swarm.state;
      if (st === 'scan' || st === 'build') B.startPad();
    };
    if (ctx.state === 'running') go(); else ctx.resume().then(go).catch(() => {});
  }

  function wireSwarm() {
    if (wired) return true; const S = window.Swarm; if (!S || !S.on) return false; wired = true;
    S.on('state', (s) => {
      if (s === 'scan') { B.reset(); if (unlocked) B.startPad(); }
      else if (s === 'build') { if (unlocked) B.startPad(); }
      else if (s === 'finale') B.finale();
      else if (s === 'live' || s === 'abort') { B.stopPad(0.8); }
    });
    S.on('progress', (b, t) => { if (t) B.padProgress(b / t); });
    S.on('layer', (el, type) => B.layer(el, type));
    S.on('section', () => B.sectionDone());
    let agents = 0; S.on('agents', (n) => { if (n > agents && ready() && S.state === 'build') B.join(); agents = n; });
    S.on('replay', () => { B.reset(); });
    return true;
  }

  /* ------------------------------------------------------------------ public API */
  const SoundFX = {
    init() {
      try { muted = localStorage.getItem(KEY) === 'off'; } catch (e) {}
      if (!AC) return;
      ['pointerdown', 'keydown', 'touchend'].forEach((ev) => addEventListener(ev, unlock, true));
      document.addEventListener('visibilitychange', () => {
        if (!ctx) return;
        if (document.hidden) ctx.suspend().catch(() => {}); else if (unlocked) ctx.resume().catch(() => {});
      });
      this.attach();
      if (!wireSwarm()) { let tries = 0; const iv = setInterval(() => { if (wireSwarm() || ++tries > 40) clearInterval(iv); }, 100); }
      window.SoundFX = this;
    },
    isEnabled() { return !muted; },
    isUnlocked() { return unlocked; },
    unlock,
    /* mute / unmute (HUD speaker, terminal `sound on|off`, Ctrl+K). The choice is remembered on this device. */
    enable() {
      muted = false; remember(false);
      if (master) master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.03);
      unlock();
      if (unlocked) { const st = window.Swarm && Swarm.state; if (st === 'scan' || st === 'build') B.startPad(); UI.confirm(); }
      announce();
    },
    disable() {
      muted = true; remember(true);
      if (master && ctx) master.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
      B.stopPad(0.2);
      announce();
    },
    toggle() { muted ? this.enable() : this.disable(); },
    playHover(el) { UI.hover(el); },
    playClick() { UI.click(); },
    playTab(i) { UI.tab(i); },
    playModalOpen() { UI.modalOpen(); },
    playModalClose() { UI.modalClose(); },
    playSlider(v) { UI.slider(v); },
    playKey() { UI.key(); },
    playConfirm() { UI.confirm(); },
    playError() { UI.error(); },
    build: B,

    attach() {
      const CLICK = 'button, a, .tab, .card, .accent-dot, .sbtn, .modal__pstep, .chip, [role="button"]';
      document.addEventListener('click', (e) => {
        if (e.target.closest('#sw-hud')) return;                      // the HUD buttons sit inside the swarm intro
        const t = e.target.closest(CLICK); if (!t) return;
        if (t.classList.contains('tab')) UI.tab([...t.parentNode.children].indexOf(t));
        else if (t.classList.contains('card')) UI.modalOpen();
        else if (t.classList.contains('modal__close')) { /* Work.close() plays it */ }
        else if (t.closest('#terminalDrawer')) { /* the terminal plays its own sounds */ }
        else UI.click();
      }, true);
      document.addEventListener('pointerover', (e) => {
        if (e.pointerType === 'touch' || document.documentElement.classList.contains('is-building')) return;
        const t = e.target.closest('button, a, .tab, .card, .accent-dot, .sbtn, .modal__pstep, .crow, .hl, .tile, .chip');
        if (t) UI.hover(t);
      }, { passive: true });
      /* compare slider: a scale tick for every step of the handle */
      const watch = () => {
        const c = document.getElementById('compare'); if (!c) return false;
        new MutationObserver(() => { UI.slider(parseFloat(c.getAttribute('aria-valuenow'))); }).observe(c, { attributes: true, attributeFilter: ['aria-valuenow'] });
        return true;
      };
      if (!watch()) document.addEventListener('DOMContentLoaded', watch);
    }
  };

  window.SoundFX = SoundFX;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => SoundFX.init());
  else SoundFX.init();
})();
