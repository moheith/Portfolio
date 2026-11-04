/* js/swarm.js — Agent Swarm build engine, SCRIPTED mode (reference implementation, tested in headless Chromium).
   It plays SWARM_SCRIPT (js/swarm-script.js): a fixed, deterministic choreography. Every layer has an agent and 5 timestamps:
   t0 agent leaves its previous spot and starts flying · t1 arrives at the element's top-left · t2 finished dragging the box
   · t3 finished typing / filling (agent is free) · t4 box fully faded out. Times are virtual seconds at 1x. */
(function () {
  'use strict';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const S = SWARM_SCRIPT;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (() => { let s = 1234567; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })(); // seeded, so every run looks the same

  const Swarm = {
    speed: 1, tour: true, state: 'idle',          // idle | building | finale | live
    t: 0, built: 0, total: S.layers.length, agents: [], states: [], events: [], eventIdx: 0, layerIdx: 0,
    active: [], boxes: new Set(), sweeps: [], guides: new Map(), root: null, startedWall: 0, elapsedWall: 0,
    finaleT0: 0, onTick: null, onState: null, onType: null, _raf: 0, _last: 0,
  };

  /* ------------------------------------------------------------ agents */
  function arrowSVG(color) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', '22'); svg.setAttribute('height', '22');
    svg.classList.add('agent-cursor');
    svg.innerHTML =
      `<g class="m-arrow"><path d="M3 2 L3 19 L7.6 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.6 L16.6 13.6 Z" fill="${color}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></g>` +
      `<g class="m-cross"><path d="M12 4 V20 M4 12 H20" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></g>` +
      `<g class="m-ibeam"><path d="M9 4 H15 M12 4 V20 M9 20 H15" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none"/></g>`;
    return svg;
  }
  function makeAgent(i) {
    const color = S.colors[i % S.colors.length];
    const a = { i, color, el: arrowSVG(color), x: 0, y: 0, rot: 0, vx: 0, vy: 0, mode: 'arrow', joined: false,
                task: null, tween: null, home: [0.5, 0.5], orbit: null };
    a.el.style.display = 'none';
    Swarm.root.appendChild(a.el);
    return a;
  }
  function drawAgent(a) {
    a.el.style.transform = `translate3d(${a.x}px,${a.y}px,0) rotate(${a.rot}deg)`;
    a.el.dataset.mode = a.mode;
  }
  function placeFlockStart(a) {          // 18 starting agents: two flocks, around 35%/60% and 65%/45% of the viewport
    const c = S.events.find((e) => e.e === 'flocks').clusters[a.i % 2];
    a.home = c;
    a.x = c[0] * innerWidth + (rand() - 0.5) * 220; a.y = c[1] * innerHeight + (rand() - 0.5) * 160;
    a.vx = (rand() - 0.5) * 1.4; a.vy = (rand() - 0.5) * 1.4;
  }
  function idleDrift(a, k) {              // murmuration: random acceleration + weak pull toward the flock's home, speed capped at 1.6 px/frame
    const hx = a.home[0] * innerWidth, hy = a.home[1] * innerHeight;
    a.vx += ((rand() - 0.5) * 0.35 + (hx - a.x) * 0.0006) * k;
    a.vy += ((rand() - 0.5) * 0.35 + (hy - a.y) * 0.0006) * k;
    const sp = Math.hypot(a.vx, a.vy), max = 1.6;
    if (sp > max) { a.vx *= max / sp; a.vy *= max / sp; }
    a.x = clamp(a.x + a.vx * k, 16, innerWidth - 16); a.y = clamp(a.y + a.vy * k, 16, innerHeight - 16);
    a.rot = (Math.atan2(a.vy, a.vx) * 180) / Math.PI + 135;   // arrow points along its velocity
  }

  /* ------------------------------------------------------------ boxes (blue/red selection boxes) */
  function makeBox(kind) {
    const box = document.createElement('div');
    box.className = `ghost-box ghost-${kind}`;
    box.innerHTML = '<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i><b class="pill"></b><u class="caret"></u>';
    Swarm.root.appendChild(box); Swarm.boxes.add(box);
    return box;
  }
  function placeBox(box, r, grow) {
    box.style.transform = `translate3d(${r.left}px,${r.top}px,0)`;
    box.style.width = `${r.width * grow}px`; box.style.height = `${r.height * grow}px`;
    const pill = box.firstChild && box.querySelector('.pill');
    const txt = `${Math.round(r.width)} × ${Math.round(r.height)}`;
    if (pill.textContent !== txt) pill.textContent = txt;
  }
  function removeBox(box) { box.remove(); Swarm.boxes.delete(box); }

  /* ------------------------------------------------------------ text typing without reflow */
  function setTyped(el, full, p) {
    let n = Math.ceil(full.length * p);
    if (full.length > 60) {               // long paragraphs: reveal word by word so the total stays under ~1.8 s
      const next = full.indexOf(' ', n); n = next === -1 ? full.length : next;
    }
    const a = document.createElement('span'); a.className = 'typed'; a.textContent = full.slice(0, n);
    const b = document.createElement('span'); b.className = 'untyped'; b.textContent = full.slice(n);   // keeps the final layout, so nothing jumps
    el.textContent = ''; el.append(a, b);
    return n;
  }

  /* ------------------------------------------------------------ setup */
  Swarm.init = function () {
    Swarm.root = document.getElementById('swarm-root');
    Swarm.root.innerHTML = '';
    Swarm.events = S.events;
    Swarm.states = S.layers.map((L) => {
      const el = document.querySelector(`[data-layer-id="${L.id}"]`);
      if (el && el.dataset.full === undefined) el.dataset.full = el.textContent;
      return { L, el, phase: 0, box: null, typedN: -1 };
    });
    Swarm.total = Swarm.states.length;
    Swarm.agents = Array.from({ length: S.agentCount }, (_, i) => makeAgent(i));
    // layers that are missing in the DOM are reported once so the builder can fix the markup
    const missing = Swarm.states.filter((s) => !s.el).map((s) => s.L.id);
    if (missing.length) console.warn('[swarm] layers without a DOM element:', missing.join(', '));
  };

  Swarm.start = function () {
    document.documentElement.classList.add('is-building');
    scrollTo(0, 0);
    Swarm.init();
    Swarm.t = 0; Swarm.built = 0; Swarm.eventIdx = 0; Swarm.layerIdx = 0; Swarm.active = [];
    Swarm.sweeps = []; Swarm.state = 'building'; Swarm.tour = true;
    Swarm.startedWall = performance.now(); Swarm._last = performance.now();
    Swarm.agents.forEach((a) => { if (S.agentJoins[a.i] === 0) { a.joined = true; a.el.style.display = ''; placeFlockStart(a); drawAgent(a); } });
    setState('building');
    cancelAnimationFrame(Swarm._raf); Swarm._raf = requestAnimationFrame(frame);
  };

  function setState(s) { Swarm.state = s; document.documentElement.dataset.swarm = s; Swarm.onState && Swarm.onState(s); document.dispatchEvent(new CustomEvent('swarmstate', { detail: s })); }

  /* ------------------------------------------------------------ timed events (rulers, guides, scatter, sweeps, topbar flash) */
  function runEvent(e) {
    const html = document.documentElement;
    if (e.e === 'rulers') html.classList.toggle('show-rulers', !!e.on);
    else if (e.e === 'topbar-flash') { html.classList.add('flash-bars'); setTimeout(() => html.classList.remove('flash-bars'), e.ms / Swarm.speed); }
    else if (e.e === 'hud') { /* HUD state is derived in hud.js from Swarm.t, nothing to do here */ }
    else if (e.e === 'scatter') {          // flocks scatter to the page edges and turn into "+" crosshairs and I-beams
      const pts = [];
      Swarm.agents.filter((a) => a.joined).forEach((a, k) => {
        const side = k % 4, f = ((k * 0.137) % 1);
        const tx = side === 0 ? 14 : side === 1 ? innerWidth - 28 : f * innerWidth, ty = side === 2 ? 14 : side === 3 ? innerHeight - 28 : f * innerHeight;
        a.tween = { t0: Swarm.t, dur: 0.5, fx: a.x, fy: a.y, tx, ty };
        a.mode = k % 2 ? 'cross' : 'ibeam';
        setTimeout(() => { if (!a.task) a.mode = 'arrow'; }, 700 / Swarm.speed);
        a.home = [clamp(tx / innerWidth, 0.1, 0.9), clamp(ty / innerHeight, 0.2, 0.8)];
      });
    } else if (e.e === 'guide') {
      const sec = document.querySelector(e.sel);
      if (e.on) {
        const g = document.createElement('div'); g.className = 'swarm-guide'; Swarm.root.appendChild(g);
        Swarm.guides.set(e.sel, { el: g, sec });
      } else {
        const o = Swarm.guides.get(e.sel); if (o) { o.el.classList.add('fade-out'); setTimeout(() => o.el.remove(), 400 / Swarm.speed); Swarm.guides.delete(e.sel); }
      }
    } else if (e.e === 'sweep') {
      const el = document.createElement('div'); el.className = 'swarm-sweep'; el.innerHTML = '<i></i>'; Swarm.root.appendChild(el);
      Swarm.sweeps.push({ el, sec: document.querySelector(e.sel), t0: Swarm.t, dur: 0.7 });
      window.SwarmSound && SwarmSound.whoosh();
    }
  }

  /* ------------------------------------------------------------ one layer, one frame */
  function activate(st) {
    const a = Swarm.agents[st.L.a];
    if (!a.joined) { a.joined = true; a.el.style.display = ''; a.x = innerWidth - 40; a.y = -20; }   // newly joined agents fly in from the top-right
    st.agent = a; a.task = st; a.tween = null; a.mode = 'arrow';
    st.fromX = a.x; st.fromY = a.y;
    st.cx = (a.x + innerWidth / 2) / 2 + (rand() - 0.5) * 180;     // bezier control point
    st.cy = (a.y + innerHeight / 2) / 2 + (rand() - 0.5) * 160;
    Swarm.active.push(st);
  }

  function stepLayer(st, t) {
    const [t0, t1, t2, t3, t4] = st.L.t, a = st.agent, el = st.el, kind = st.L.k;
    if (!el || el.offsetParent === null && getComputedStyle(el).position !== 'fixed') {      // hidden or missing element: finish instantly
      if (!st.done) completeLayer(st, a); return true;
    }
    const r = el.getBoundingClientRect();
    const needBox = (t >= (st.L.tw ?? t1)) && t < t4;
    if (needBox && !st.box) { st.box = makeBox(kind); st.box.dataset.for = st.L.id; }
    // phase 1: flying to the top-left corner
    if (t < t1) {
      const e = easeInOutCubic(clamp((t - t0) / (t1 - t0), 0, 1)), u = 1 - e;
      const tx = r.left - 2, ty = r.top - 2;
      a.x = u * u * st.fromX + 2 * u * e * st.cx + e * e * tx; a.y = u * u * st.fromY + 2 * u * e * st.cy + e * e * ty;
      a.rot = 40 * Math.sin(Math.PI * Math.min(1, e * 1.1)) * (st.cx < st.fromX ? 1 : -1);
      a.mode = 'arrow';
      if (st.box && st.L.tw !== undefined) placeBox(st.box, r, 1);            // hero wireframe: box already exists at full size
    } else if (t < t2) {                       // phase 2: drag the box from the top-left to the bottom-right corner
      const g = easeOutCubic((t - t1) / (t2 - t1));
      if (st.box) placeBox(st.box, r, st.L.tw !== undefined ? 1 : g);
      a.x = r.left + r.width * g; a.y = r.top + r.height * g; a.rot = 0; a.mode = 'cross';
    } else if (t < t3) {                       // phase 3: type the text / fill the image / fill the shape
      const p = clamp((t - t2) / (t3 - t2), 0, 1);
      if (st.box) placeBox(st.box, r, 1);
      if (kind === 'text') {
        el.classList.add('is-built');
        const n = setTyped(el, el.dataset.full, p);
        if (st.box) { st.box.classList.add('typing'); st.box.style.setProperty('--caret', `${Math.min(1, n / Math.max(1, el.dataset.full.length))}`); }
        if (n !== st.typedN) { st.typedN = n; const ch = el.dataset.full.slice(n - 1, n); Swarm.onType && Swarm.onType(ch); window.SwarmSound && SwarmSound.tick(ch); }
        a.mode = 'ibeam'; a.x = r.right + 6; a.y = r.top + Math.min(r.height - 18, 2); a.rot = 0;
      } else if (kind === 'image') {
        if (st.box) st.box.classList.add('is-placeholder');
        if (p > 0.37 && !el.classList.contains('is-built')) el.classList.add('is-built', 'reveal-blur');
        a.mode = 'arrow'; a.x = r.right - 6; a.y = r.bottom - 6;
      } else {                                 // shape, card, logo
        if (st.box) st.box.classList.add('is-filled');
        if (p > 0.65) el.classList.add('is-built');
        a.mode = 'arrow'; a.x = r.right - 4; a.y = r.bottom - 4;
      }
      el.dataset.phase = 'fill';
    } else {                                   // phase 4: release, agent is free (it goes back to idle drifting), the box fades out
      if (!st.done) completeLayer(st, a);
      if (st.box) { placeBox(st.box, r, 1); st.box.classList.add('fade-out'); }
    }
    return t >= t4;
  }

  function completeLayer(st, a) {
    const el = st.el;
    if (el) { if (st.L.k === 'text') el.textContent = el.dataset.full; el.classList.add('is-built'); delete el.dataset.phase; }
    st.done = true; Swarm.built++;
    if (a && a.task === st) { a.task = null; a.mode = 'arrow'; a.vx = (rand() - 0.5) * 2; a.vy = (rand() - 0.5) * 2; a.home = [clamp(a.x / innerWidth, 0.1, 0.9), clamp(a.y / innerHeight, 0.15, 0.85)]; }
  }

  /* ------------------------------------------------------------ main loop */
  function frame(now) {
    const dtReal = Math.min(0.1, (now - Swarm._last) / 1000); Swarm._last = now;
    const dt = dtReal * Swarm.speed, k = dtReal * 60 * Math.min(Swarm.speed, 4);
    if (Swarm.state === 'building') {
      Swarm.t += dt;
      while (Swarm.eventIdx < Swarm.events.length && Swarm.events[Swarm.eventIdx].t <= Swarm.t) runEvent(Swarm.events[Swarm.eventIdx++]);
      while (Swarm.layerIdx < Swarm.states.length && Swarm.states[Swarm.layerIdx].L.t[0] <= Swarm.t) activate(Swarm.states[Swarm.layerIdx++]);
      // hero wireframe boxes appear BEFORE their agent arrives, so also step layers whose "tw" has passed
      for (const st of Swarm.states) if (st.L.tw !== undefined && !st.agent && Swarm.t >= st.L.tw && !st.wire) {
        st.wire = true; st.box = makeBox(st.L.k); st.box.dataset.for = st.L.id; if (st.el) placeBox(st.box, st.el.getBoundingClientRect(), 1);
      }
      Swarm.active = Swarm.active.filter((st) => { const fin = stepLayer(st, Swarm.t); if (fin) { if (st.box) removeBox(st.box); } return !fin; });
      for (const st of Swarm.states) if (st.wire && !st.agent && st.box && st.el) placeBox(st.box, st.el.getBoundingClientRect(), 1);   // keep wire boxes glued to their element
      // joined agents come online
      Swarm.agents.forEach((a) => { if (!a.joined && S.agentJoins[a.i] <= Swarm.t) { a.joined = true; a.el.style.display = ''; a.x = innerWidth - 40; a.y = -20; a.home = [0.75, 0.2]; } });
      Swarm.agents.forEach((a) => {
        if (!a.joined) return;
        if (a.tween) { const e = easeOutCubic(clamp((Swarm.t - a.tween.t0) / a.tween.dur, 0, 1)); a.x = lerp(a.tween.fx, a.tween.tx, e); a.y = lerp(a.tween.fy, a.tween.ty, e); if (e >= 1) a.tween = null; }
        else if (!a.task) idleDrift(a, k);
        drawAgent(a);
      });
      guides(); sweeps(); tour(dtReal);
      if (Swarm.eventIdx >= Swarm.events.length && Swarm.layerIdx >= Swarm.states.length && Swarm.active.length === 0 && Swarm.built >= Swarm.total) startFinale();
    } else if (Swarm.state === 'finale') {
      Swarm.t += dt; finaleStep(dtReal);
    }
    Swarm.onTick && Swarm.onTick(Swarm);
    if (Swarm.state === 'building' || Swarm.state === 'finale') Swarm._raf = requestAnimationFrame(frame);
  }

  function guides() {
    Swarm.guides.forEach((o) => {
      const anchor = o.sec && (o.sec.querySelector('[data-guide-anchor]') || o.sec);
      const x = anchor ? anchor.getBoundingClientRect().left : 40;
      o.el.style.transform = `translate3d(${Math.round(x)}px,0,0)`;
    });
  }
  function sweeps() {
    Swarm.sweeps = Swarm.sweeps.filter((s) => {
      const p = clamp((Swarm.t - s.t0) / s.dur, 0, 1);
      const r = s.sec.getBoundingClientRect();
      s.el.style.transform = `translate3d(0,${clamp(r.bottom - 2, 0, innerHeight - 2)}px,0)`;
      s.el.firstChild.style.transform = `translate3d(${p * innerWidth}px,0,0)`;
      s.el.style.opacity = p < 1 ? '1' : '0';
      if (p >= 1 && Swarm.t - s.t0 > s.dur + 0.3) { s.el.remove(); return false; }
      return true;
    });
  }
  function tour(dtReal) {                      // auto-scroll ("Touring"): keep the build front in the upper third of the screen
    if (!Swarm.tour) return;
    let front = null;
    for (const st of Swarm.active) { if (!st.el) continue; const y = st.el.getBoundingClientRect().top + scrollY; if (front === null || y < front) front = y; }
    if (front === null) { const nx = Swarm.states[Swarm.layerIdx]; if (nx && nx.el) front = nx.el.getBoundingClientRect().top + scrollY; }
    if (front === null) return;
    const target = Math.max(0, front - innerHeight * 0.32);
    const t = Swarm.t; if (t < 3.9) { scrollTo(0, 0); return; }            // the hero is built without scrolling
    scrollTo(0, scrollY + (target - scrollY) * Math.min(1, dtReal * 3.2 * Math.min(Swarm.speed, 2)));
  }

  /* ------------------------------------------------------------ finale: cursors lift off and orbit the featured card + the top-right corner */
  function startFinale() {
    Swarm.elapsedWall = (performance.now() - Swarm.startedWall) / 1000;
    document.documentElement.classList.remove('is-building', 'show-rulers');
    Swarm.guides.forEach((o) => { o.el.classList.add('fade-out'); setTimeout(() => o.el.remove(), 400); }); Swarm.guides.clear();
    window.SwarmSound && SwarmSound.chime();
    Swarm.finaleT0 = Swarm.t; setState('finale');
    const card = document.querySelector(`[data-layer-id="${S.finale.target}"]`);
    Swarm.finaleCard = card;
    Swarm.agents.forEach((a, i) => { a.orbit = { which: i % 3 === 0 ? 'corner' : 'card', theta: rand() * 6.28, radius: 110 + (i % 4) * 38, spd: 0.03 + (i % 3) * 0.006 }; a.task = null; a.tween = null; a.mode = 'arrow'; });
  }
  function finaleStep(dtReal) {
    const card = Swarm.finaleCard;
    if (card && Swarm.tour) {                    // bring the card into view
      const r = card.getBoundingClientRect(); const target = scrollY + r.top + r.height / 2 - innerHeight / 2;
      scrollTo(0, scrollY + (target - scrollY) * Math.min(1, dtReal * 2.5));
    }
    const r = card ? card.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const ccx = r.left + r.width / 2, ccy = r.top + r.height / 2, tcx = innerWidth - 70, tcy = 80;
    const breathe = 1 + 0.25 * Math.sin((Swarm.t - Swarm.finaleT0) * 1.4);
    Swarm.agents.forEach((a) => {
      const o = a.orbit; if (!o) return;
      o.theta += o.spd * dtReal * 60;
      const cx = o.which === 'card' ? ccx : tcx, cy = o.which === 'card' ? ccy : tcy, rad = o.radius * (o.which === 'card' ? breathe : 0.55);
      const tx = cx + Math.cos(o.theta) * rad, ty = cy + Math.sin(o.theta) * rad * 0.7;
      a.x += (tx - a.x) * Math.min(1, dtReal * 6); a.y += (ty - a.y) * Math.min(1, dtReal * 6);   // glide onto the ring, then follow it
      a.rot = (o.theta * 180) / Math.PI + 225;                                                   // arrow tangent to the circle
      drawAgent(a);
    });
  }

  /* ------------------------------------------------------------ public controls (used by hud.js) */
  Swarm.setSpeed = (s) => { Swarm.speed = s; };
  Swarm.toggleTour = () => { Swarm.tour = !Swarm.tour; return Swarm.tour; };
  Swarm.finishAll = function () {              // instantly show everything (✕ / skip / reduced motion)
    cancelAnimationFrame(Swarm._raf);
    (Swarm.states.length ? Swarm.states : (Swarm.init(), Swarm.states)).forEach((st) => {
      if (st.el) { if (st.L.k === 'text') st.el.textContent = st.el.dataset.full; st.el.classList.add('is-built'); delete st.el.dataset.phase; }
      if (st.box) removeBox(st.box);
    });
    [...Swarm.boxes].forEach(removeBox);
    document.querySelectorAll('.swarm-guide,.swarm-sweep').forEach((n) => n.remove());
    document.documentElement.classList.remove('is-building', 'show-rulers', 'flash-bars');
    Swarm.agents.forEach((a) => a.el.remove()); Swarm.agents = [];
    Swarm.built = Swarm.total; setState('live');
  };
  Swarm.goLive = function () {                 // "Go live": cursors fly off to the top-right and disappear
    Swarm.agents.forEach((a) => { a.el.style.transition = 'transform .8s cubic-bezier(.65,0,.35,1), opacity .8s'; a.el.style.transform = `translate3d(${innerWidth + 60}px,-60px,0)`; a.el.style.opacity = '0'; });
    setTimeout(() => { Swarm.finishAll(); }, 850);
  };
  Swarm.replay = function () {
    Swarm.states.forEach((st) => { if (st.el) { st.el.classList.remove('is-built', 'reveal-blur'); st.el.textContent = st.el.dataset.full; } });
    Swarm.finishAllReset && Swarm.finishAllReset();
    cancelAnimationFrame(Swarm._raf);
    [...Swarm.boxes].forEach(removeBox); Swarm.root.innerHTML = '';
    Swarm.states.forEach((st) => { st.box = null; st.agent = null; st.done = false; st.wire = false; st.phase = 0; });
    Swarm.start();
  };
  window.Swarm = Swarm;
})();
