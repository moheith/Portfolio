/* js/swarm.js — Agent Swarm build engine, SCRIPTED mode with Multi-Agent Co-Construction Squads.
   Plays SWARM_SCRIPT with synchronized cursor squads: lead builder drags/types while companion agents
   lock bounding corners (TR, BL), read dimension pills, sweep alignment guides, and escort in tight formation. */
(function () {
  'use strict';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const S = SWARM_SCRIPT;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (() => { let s = 1234567; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })(); // seeded

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
                task: null, squadRole: null, tween: null, home: [0.5, 0.5], orbit: null };
    a.el.style.display = 'none';
    Swarm.root.appendChild(a.el);
    return a;
  }
  function drawAgent(a) {
    a.el.style.transform = `translate3d(${a.x}px,${a.y}px,0) rotate(${a.rot}deg)`;
    a.el.dataset.mode = a.mode;
  }
  function placeFlockStart(a) {          // 18 starting agents in two clusters
    const c = S.events.find((e) => e.e === 'flocks').clusters[a.i % 2];
    a.home = c;
    a.x = c[0] * innerWidth + (rand() - 0.5) * 220; a.y = c[1] * innerHeight + (rand() - 0.5) * 160;
    a.vx = (rand() - 0.5) * 1.4; a.vy = (rand() - 0.5) * 1.4;
  }

  /* Compute current center of activity across active construction layers */
  function getBuildFront() {
    if (Swarm.active.length > 0) {
      let sx = 0, sy = 0, n = 0;
      for (const act of Swarm.active) {
        if (act.el) {
          const r = act.el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            sx += r.left + r.width / 2;
            sy += r.top + r.height / 2;
            n++;
          }
        }
      }
      if (n > 0) return { x: sx / n, y: sy / n };
    }
    if (Swarm.layerIdx < Swarm.states.length) {
      const nx = Swarm.states[Swarm.layerIdx];
      if (nx && nx.el) {
        const r = nx.el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
    }
    return { x: innerWidth * 0.5, y: innerHeight * 0.45 };
  }

  /* Escort formation for free agents: dynamic perimeter surveillance around the build front */
  function escortPatrol(a, k, front, freeIdx, freeTotal) {
    const i = a.i;
    const ringRadius = 110 + (i % 6) * 32;
    const spd = (0.65 + (i % 3) * 0.15) * (i % 2 === 0 ? 1 : -1);
    const theta = Swarm.t * spd + (freeIdx * 2 * Math.PI) / Math.max(1, freeTotal);
    const tx = front.x + Math.cos(theta) * ringRadius;
    const ty = front.y + Math.sin(theta) * (ringRadius * 0.55);

    const cx = clamp(tx, 20, innerWidth - 24);
    const cy = clamp(ty, 20, innerHeight - 24);
    const dx = cx - a.x, dy = cy - a.y;

    a.vx = lerp(a.vx, dx * 0.09, 0.14 * k);
    a.vy = lerp(a.vy, dy * 0.09, 0.14 * k);
    const sp = Math.hypot(a.vx, a.vy), maxSpd = 3.6;
    if (sp > maxSpd) { a.vx *= maxSpd / sp; a.vy *= maxSpd / sp; }
    a.x = clamp(a.x + a.vx * k, 16, innerWidth - 20);
    a.y = clamp(a.y + a.vy * k, 16, innerHeight - 20);

    if (Math.hypot(a.vx, a.vy) > 0.08) {
      a.rot = (Math.atan2(a.vy, a.vx) * 180) / Math.PI + 135;
    }
    // Alternate modes among squad: crosshairs measuring, arrows sweeping
    a.mode = (i % 3 === 0) ? 'cross' : (i % 4 === 0) ? 'ibeam' : 'arrow';
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
      return { L, el, phase: 0, box: null, typedN: -1, squad: [], activatedAt: null };
    });
    Swarm.total = Swarm.states.length;
    Swarm.agents = Array.from({ length: S.agentCount }, (_, i) => makeAgent(i));
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
    else if (e.e === 'hud') { /* HUD state is derived in hud.js from Swarm.t */ }
    else if (e.e === 'scatter') {
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

  /* ------------------------------------------------------------ one layer, one frame with Co-Construction Squad */
  function activate(st) {
    let a = Swarm.agents[st.L.a];
    if (!a.joined) {
      a.joined = true; a.el.style.display = ''; a.x = innerWidth - 40; a.y = -20;
    } else if (a.task) {
      // If preferred agent is busy, recruit nearest available joined agent
      const freeAgents = Swarm.agents.filter((ag) => ag.joined && !ag.task);
      if (freeAgents.length > 0) {
        if (st.el) {
          const r = st.el.getBoundingClientRect();
          freeAgents.sort((p, q) => Math.hypot(p.x - r.left, p.y - r.top) - Math.hypot(q.x - r.left, q.y - r.top));
        }
        a = freeAgents[0];
      }
    }
    st.agent = a; a.task = st; a.squadRole = 'lead'; a.tween = null; a.mode = 'arrow';
    st.activatedAt = Swarm.t;
    st.fromX = a.x; st.fromY = a.y;
    st.cx = (a.x + innerWidth / 2) / 2 + (rand() - 0.5) * 140;
    st.cy = (a.y + innerHeight / 2) / 2 + (rand() - 0.5) * 120;

    // Recruit 2-3 companion squad agents for corner framing & dimension scanning
    st.squad = [];
    const available = Swarm.agents.filter((ag) => ag.joined && !ag.task && ag !== a);
    if (st.el && available.length >= 2) {
      const r = st.el.getBoundingClientRect();
      available.sort((p, q) => Math.hypot(p.x - r.left, p.y - r.top) - Math.hypot(q.x - r.left, q.y - r.top));
      const roles = ['tr', 'bl', 'scan'];
      for (let i = 0; i < Math.min(3, available.length); i++) {
        const helper = available[i];
        helper.task = st;
        helper.squadRole = roles[i];
        helper.tween = null;
        st.squad.push(helper);
      }
    }

    Swarm.active.push(st);
  }

  function stepLayer(st, t) {
    const [t0, t1, t2, t3, t4] = st.L.t, a = st.agent, el = st.el, kind = st.L.k;
    if (!el || (el.offsetParent === null && getComputedStyle(el).position !== 'fixed')) {
      if (!st.done) completeLayer(st, a); return true;
    }
    const r = el.getBoundingClientRect();
    const needBox = (t >= (st.L.tw ?? t1)) && t < t4;
    if (needBox && !st.box) { st.box = makeBox(kind); st.box.dataset.for = st.L.id; }

    const squadTR = st.squad ? st.squad.find(s => s.squadRole === 'tr') : null;
    const squadBL = st.squad ? st.squad.find(s => s.squadRole === 'bl') : null;
    const squadScan = st.squad ? st.squad.find(s => s.squadRole === 'scan') : null;

    // phase 1: flying to start corners
    if (t < t1) {
      const startT = st.activatedAt !== null ? Math.min(st.activatedAt, t0) : t0;
      const dur = Math.max(0.01, t1 - startT);
      const e = easeInOutCubic(clamp((t - startT) / dur, 0, 1)), u = 1 - e;
      const tx = r.left - 2, ty = r.top - 2;
      a.x = u * u * st.fromX + 2 * u * e * st.cx + e * e * tx; a.y = u * u * st.fromY + 2 * u * e * st.cy + e * e * ty;
      a.rot = 40 * Math.sin(Math.PI * Math.min(1, e * 1.1)) * (st.cx < st.fromX ? 1 : -1);
      a.mode = 'arrow';
      if (st.box && st.L.tw !== undefined) placeBox(st.box, r, 1);

      // Squad companions approach opposite corners
      if (squadTR) {
        squadTR.x = lerp(squadTR.x, r.right + 2, 0.18);
        squadTR.y = lerp(squadTR.y, r.top - 2, 0.18);
        squadTR.mode = 'cross'; squadTR.rot = 0;
      }
      if (squadBL) {
        squadBL.x = lerp(squadBL.x, r.left - 2, 0.18);
        squadBL.y = lerp(squadBL.y, r.bottom + 2, 0.18);
        squadBL.mode = 'cross'; squadBL.rot = 0;
      }
      if (squadScan) {
        squadScan.x = lerp(squadScan.x, r.left + r.width / 2, 0.18);
        squadScan.y = lerp(squadScan.y, r.top - 4, 0.18);
        squadScan.mode = 'cross'; squadScan.rot = 0;
      }
    } else if (t < t2) {                       // phase 2: drag the box from top-left to bottom-right corner
      const g = easeOutCubic((t - t1) / Math.max(0.01, t2 - t1));
      if (st.box) placeBox(st.box, r, st.L.tw !== undefined ? 1 : g);
      // Lead drags moving bottom-right corner
      a.x = r.left + r.width * g; a.y = r.top + r.height * g; a.rot = 0; a.mode = 'cross';

      // Companion 1 anchors top-right corner of expanding box
      if (squadTR) {
        squadTR.x = r.left + r.width * g; squadTR.y = r.top - 2;
        squadTR.mode = 'cross'; squadTR.rot = 0;
      }
      // Companion 2 anchors bottom-left corner of expanding box
      if (squadBL) {
        squadBL.x = r.left - 2; squadBL.y = r.top + r.height * g;
        squadBL.mode = 'cross'; squadBL.rot = 0;
      }
      // Companion 3 glides along bottom dimension pill
      if (squadScan) {
        squadScan.x = r.left + (r.width * g) / 2; squadScan.y = r.top + r.height * g + 14;
        squadScan.mode = 'ibeam'; squadScan.rot = 0;
      }
    } else if (t < t3) {                       // phase 3: type text / fill image / fill shape
      const p = clamp((t - t2) / Math.max(0.01, t3 - t2), 0, 1);
      if (st.box) placeBox(st.box, r, 1);
      if (kind === 'text') {
        el.classList.add('is-built');
        const n = setTyped(el, el.dataset.full, p);
        if (st.box) { st.box.classList.add('typing'); st.box.style.setProperty('--caret', `${Math.min(1, n / Math.max(1, el.dataset.full.length))}`); }
        if (n !== st.typedN) { st.typedN = n; const ch = el.dataset.full.slice(n - 1, n); Swarm.onType && Swarm.onType(ch); window.SwarmSound && SwarmSound.tick(ch); }
        a.mode = 'ibeam'; a.x = r.right + 6; a.y = r.top + Math.min(r.height - 18, 2); a.rot = 0;

        // Squad co-types & validates text boundaries
        if (squadBL) { squadBL.x = r.left - 4; squadBL.y = r.top + 2; squadBL.mode = 'ibeam'; squadBL.rot = 0; }
        if (squadTR) { squadTR.x = r.right + 2; squadTR.y = r.top - 2; squadTR.mode = 'cross'; squadTR.rot = 0; }
        if (squadScan) { squadScan.x = r.left + r.width * p; squadScan.y = r.bottom + 4; squadScan.mode = 'ibeam'; squadScan.rot = 0; }
      } else if (kind === 'image') {
        if (st.box) st.box.classList.add('is-placeholder');
        if (p > 0.37 && !el.classList.contains('is-built')) el.classList.add('is-built', 'reveal-blur');
        a.mode = 'arrow'; a.x = r.right - 6; a.y = r.bottom - 6;

        if (squadTR) { squadTR.x = r.right - 6; squadTR.y = r.top + 6; squadTR.mode = 'cross'; squadTR.rot = 0; }
        if (squadBL) { squadBL.x = r.left + 6; squadBL.y = r.bottom - 6; squadBL.mode = 'cross'; squadBL.rot = 0; }
        if (squadScan) { squadScan.x = r.left + r.width / 2; squadScan.y = r.top + r.height / 2; squadScan.mode = 'cross'; squadScan.rot = 0; }
      } else {                                 // shape, card, logo
        if (st.box) st.box.classList.add('is-filled');
        if (p > 0.65) el.classList.add('is-built');
        a.mode = 'arrow'; a.x = r.right - 4; a.y = r.bottom - 4;

        if (squadTR) { squadTR.x = r.right - 4; squadTR.y = r.top + 4; squadTR.mode = 'cross'; squadTR.rot = 0; }
        if (squadBL) { squadBL.x = r.left + 4; squadBL.y = r.bottom - 4; squadBL.mode = 'cross'; squadBL.rot = 0; }
        if (squadScan) { squadScan.x = r.left + r.width / 2; squadScan.y = r.top + 2; squadScan.mode = 'cross'; squadScan.rot = 0; }
      }
      el.dataset.phase = 'fill';
    } else {                                   // phase 4: release, agents free, box fades out
      if (!st.done) completeLayer(st, a);
      if (st.box) { placeBox(st.box, r, 1); st.box.classList.add('fade-out'); }
    }
    return t >= t4;
  }

  function completeLayer(st, a) {
    const el = st.el;
    if (el) { if (st.L.k === 'text') el.textContent = el.dataset.full; el.classList.add('is-built'); delete el.dataset.phase; }
    st.done = true; Swarm.built++;
    if (a && a.task === st) {
      a.task = null; a.squadRole = null; a.mode = 'arrow';
      a.vx = (rand() - 0.5) * 2; a.vy = (rand() - 0.5) * 2;
    }
    // Release squad companion agents with lively outward velocities
    if (st.squad && st.squad.length > 0) {
      st.squad.forEach((h) => {
        if (h && h.task === st) {
          h.task = null; h.squadRole = null; h.mode = 'arrow';
          h.vx = (rand() - 0.5) * 2.2; h.vy = (rand() - 0.5) * 2.2;
        }
      });
      st.squad = [];
    }
  }

  /* ------------------------------------------------------------ main loop */
  function frame(now) {
    const dtReal = Math.min(0.1, (now - Swarm._last) / 1000); Swarm._last = now;
    const dt = dtReal * Swarm.speed, k = dtReal * 60 * Math.min(Swarm.speed, 4);
    if (Swarm.state === 'building') {
      Swarm.t += dt;
      while (Swarm.eventIdx < Swarm.events.length && Swarm.events[Swarm.eventIdx].t <= Swarm.t) runEvent(Swarm.events[Swarm.eventIdx++]);

      // Concurrent squad activation: allow up to 5 concurrent layers within lookahead window
      const maxConcurrent = 5;
      while (Swarm.layerIdx < Swarm.states.length) {
        const nextSt = Swarm.states[Swarm.layerIdx];
        const canLookahead = (Swarm.active.length < maxConcurrent) && (nextSt.L.t[0] <= Swarm.t + 0.3) && (Swarm.active.length === 0 || nextSt.L.g === Swarm.active[0].L.g);
        if (nextSt.L.t[0] <= Swarm.t || canLookahead) {
          activate(Swarm.states[Swarm.layerIdx++]);
        } else {
          break;
        }
      }

      // hero wireframe boxes appear BEFORE their agent arrives
      for (const st of Swarm.states) if (st.L.tw !== undefined && !st.agent && Swarm.t >= st.L.tw && !st.wire) {
        st.wire = true; st.box = makeBox(st.L.k); st.box.dataset.for = st.L.id; if (st.el) placeBox(st.box, st.el.getBoundingClientRect(), 1);
      }
      Swarm.active = Swarm.active.filter((st) => { const fin = stepLayer(st, Swarm.t); if (fin) { if (st.box) removeBox(st.box); } return !fin; });
      for (const st of Swarm.states) if (st.wire && !st.agent && st.box && st.el) placeBox(st.box, st.el.getBoundingClientRect(), 1);

      // joined agents come online
      Swarm.agents.forEach((a) => { if (!a.joined && S.agentJoins[a.i] <= Swarm.t) { a.joined = true; a.el.style.display = ''; a.x = innerWidth - 40; a.y = -20; } });

      const buildFront = getBuildFront();
      const freeAgents = Swarm.agents.filter(a => a.joined && !a.task);
      const freeTotal = freeAgents.length;

      Swarm.agents.forEach((a) => {
        if (!a.joined) return;
        if (a.tween) {
          const e = easeOutCubic(clamp((Swarm.t - a.tween.t0) / a.tween.dur, 0, 1));
          a.x = lerp(a.tween.fx, a.tween.tx, e); a.y = lerp(a.tween.fy, a.tween.ty, e);
          if (e >= 1) a.tween = null;
        } else if (!a.task) {
          const freeIdx = freeAgents.indexOf(a);
          escortPatrol(a, k, buildFront, freeIdx >= 0 ? freeIdx : 0, freeTotal);
        }
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
  function tour(dtReal) {
    if (!Swarm.tour) return;
    let front = null;
    for (const st of Swarm.active) { if (!st.el) continue; const y = st.el.getBoundingClientRect().top + scrollY; if (front === null || y < front) front = y; }
    if (front === null) { const nx = Swarm.states[Swarm.layerIdx]; if (nx && nx.el) front = nx.el.getBoundingClientRect().top + scrollY; }
    if (front === null) return;
    const target = Math.max(0, front - innerHeight * 0.32);
    const t = Swarm.t; if (t < 3.9) { scrollTo(0, 0); return; }
    scrollTo(0, scrollY + (target - scrollY) * Math.min(1, dtReal * 3.2 * Math.min(Swarm.speed, 2)));
  }

  /* ------------------------------------------------------------ finale: cursors orbit featured card + top-right corner */
  function startFinale() {
    Swarm.elapsedWall = (performance.now() - Swarm.startedWall) / 1000;
    document.documentElement.classList.remove('is-building', 'show-rulers');
    Swarm.guides.forEach((o) => { o.el.classList.add('fade-out'); setTimeout(() => o.el.remove(), 400); }); Swarm.guides.clear();
    window.SwarmSound && SwarmSound.chime();
    Swarm.finaleT0 = Swarm.t; setState('finale');
    const card = document.querySelector(`[data-layer-id="${S.finale.target}"]`);
    Swarm.finaleCard = card;
    Swarm.agents.forEach((a, i) => {
      a.orbit = { which: i % 3 === 0 ? 'corner' : 'card', theta: rand() * 6.28, radius: 110 + (i % 4) * 38, spd: 0.03 + (i % 3) * 0.006 };
      a.task = null; a.squadRole = null; a.tween = null; a.mode = 'arrow';
    });
  }
  function finaleStep(dtReal) {
    const card = Swarm.finaleCard;
    if (card && Swarm.tour) {
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
      a.x += (tx - a.x) * Math.min(1, dtReal * 6); a.y += (ty - a.y) * Math.min(1, dtReal * 6);
      a.rot = (o.theta * 180) / Math.PI + 225;
      drawAgent(a);
    });
  }

  /* ------------------------------------------------------------ public controls */
  Swarm.setSpeed = (s) => { Swarm.speed = s; };
  Swarm.toggleTour = () => { Swarm.tour = !Swarm.tour; return Swarm.tour; };
  Swarm.finishAll = function () {
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
  Swarm.goLive = function () {
    Swarm.agents.forEach((a) => { a.el.style.transition = 'transform .8s cubic-bezier(.65,0,.35,1), opacity .8s'; a.el.style.transform = `translate3d(${innerWidth + 60}px,-60px,0)`; a.el.style.opacity = '0'; });
    setTimeout(() => { Swarm.finishAll(); }, 850);
  };
  Swarm.replay = function () {
    Swarm.states.forEach((st) => { if (st.el) { st.el.classList.remove('is-built', 'reveal-blur'); st.el.textContent = st.el.dataset.full; } });
    Swarm.finishAllReset && Swarm.finishAllReset();
    cancelAnimationFrame(Swarm._raf);
    [...Swarm.boxes].forEach(removeBox); Swarm.root.innerHTML = '';
    Swarm.states.forEach((st) => { st.box = null; st.agent = null; st.squad = []; st.done = false; st.wire = false; st.phase = 0; });
    Swarm.start();
  };
  window.Swarm = Swarm;
})();
