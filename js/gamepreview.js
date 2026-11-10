/* js/gamepreview.js — the live "game preview" viewport inside the Sketch → Shipped slider.
   ONE simulation (a neon-synthwave space shooter: an auto-piloted ship strafing between crystals) is drawn twice, every frame:
   the "shipped" canvas with lighting, glow and a sun; the "blueprint" canvas as pure wireframe with bounding boxes + dimension labels.
   Both are full-size and overlap exactly, so dragging the divider literally turns the wireframe game into the finished one. */
(() => {
  'use strict';
  const cvs = [...document.querySelectorAll('canvas.gp')];
  if (!cvs.length) return;
  const TAU = Math.PI * 2, mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  /* ---------- static scenery ---------- */
  const stars = Array.from({ length: 70 }, () => ({ x: rnd(), y: rnd() * 0.5, r: 0.4 + rnd() * 1.1, p: rnd() * TAU, s: 0.6 + rnd() * 1.6 }));
  const ridge = (n, amp, phase) => Array.from({ length: n + 1 }, (_, i) => {
    const x = i / n, d = Math.abs(x - 0.5) * 2;                                  // 0 centre … 1 edge: a valley in the middle so the sun shows
    const h = (Math.sin(i * 1.7 + phase) * 0.5 + 0.5) * 0.55 + (Math.sin(i * 4.1 + phase * 2) * 0.5 + 0.5) * 0.45;
    return { x, h: Math.pow(d, 1.35) * amp * (0.35 + h) };
  });
  const ridgeA = ridge(26, 0.30, 1.3), ridgeB = ridge(34, 0.19, 4.2);

  /* ---------- meshes (x right, y up, z forward) ---------- */
  const V = { nose: [0, 0, 1.25], top: [0, 0.34, -0.45], bot: [0, -0.2, -0.45], l: [-1.15, -0.02, -0.75], r: [1.15, -0.02, -0.75], fin: [0, 0.8, -0.85], fb: [0, 0.18, -0.85],
              el: [-0.38, 0.06, -0.55], er: [0.38, 0.06, -0.55] };
  const SHIP = [[V.nose, V.top, V.l, 0], [V.nose, V.r, V.top, 0], [V.nose, V.l, V.bot, 1], [V.nose, V.bot, V.r, 1], [V.top, V.l, V.bot, 2], [V.top, V.bot, V.r, 2], [V.top, V.fin, V.fb, 3]];
  const OCT = [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
  const OCT_F = [[0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2], [1, 4, 2], [1, 3, 4], [1, 5, 3], [1, 2, 5]];

  /* ---------- simulation ---------- */
  const S = { t: 0, scroll: 0, x: 0, vx: 0, roll: 0, enemies: [], bolts: [], parts: [], score: 4820, combo: 7, cool: 0, spawn: 0, shield: 0.82 };
  function spawn() { S.enemies.push({ x: (rnd() - 0.5) * 5.4, z: 30, rot: rnd() * TAU, spin: 1 + rnd() * 2, hue: Math.floor(rnd() * 3) }); }
  for (let i = 0; i < 6; i++) { spawn(); S.enemies[i].z = 8 + i * 4; }
  function step(dt) {
    S.t += dt; S.scroll = (S.scroll + dt * 7) % 2;
    S.spawn -= dt; if (S.spawn <= 0) { spawn(); S.spawn = 0.8 + rnd() * 0.7; }
    for (const e of S.enemies) { e.z -= dt * 6; e.rot += dt * e.spin; }
    S.enemies = S.enemies.filter((e) => e.z > 2.2);
    let tgt = null; for (const e of S.enemies) if (e.z > 7 && (!tgt || e.z < tgt.z)) tgt = e;
    const want = tgt ? clamp(tgt.x, -2.6, 2.6) : Math.sin(S.t * 0.7) * 2;
    const ax = (want - S.x) * 9 - S.vx * 4.5; S.vx += ax * dt; S.x += S.vx * dt;
    S.roll = lerp(S.roll, clamp(-S.vx * 0.16, -0.7, 0.7), clamp(dt * 8, 0, 1));
    S.cool -= dt;
    if (tgt && Math.abs(tgt.x - S.x) < 0.35 && S.cool <= 0) { S.bolts.push({ x: S.x - 0.55, z: 4.6 }, { x: S.x + 0.55, z: 4.6 }); S.cool = 0.28; }
    for (const b of S.bolts) b.z += dt * 46;
    for (const b of S.bolts) for (const e of S.enemies) if (!e.dead && !b.dead && b.z >= e.z - 0.4 && Math.abs(b.x - e.x) < 0.7) {
      e.dead = true; b.dead = true; S.score += 100; S.combo++;
      for (let i = 0; i < 16; i++) S.parts.push({ x: e.x, y: 0.9, z: e.z, vx: (rnd() - .5) * 5, vy: (rnd() - .2) * 4, vz: (rnd() - .5) * 5, l: 1, hue: e.hue });
    }
    S.enemies = S.enemies.filter((e) => !e.dead); S.bolts = S.bolts.filter((b) => !b.dead && b.z < 40);
    for (const p of S.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt - dt * 6; p.vy -= dt * 5; p.l -= dt * 1.6; }
    S.parts = S.parts.filter((p) => p.l > 0 && p.z > 1.6);
  }

  /* ---------- projection ---------- */
  function cam(w, h) { const f = w * 0.64, hy = h * 0.5; return { f, hy, cx: w / 2, ch: 1.25, P: (x, y, z) => [w / 2 + (x * f) / z, hy + ((1.25 - y) * f) / z] }; }
  function rotate([x, y, z], roll, yaw, pitch) {
    let c = Math.cos(roll), s = Math.sin(roll); [x, y] = [x * c - y * s, x * s + y * c];
    c = Math.cos(yaw); s = Math.sin(yaw); [x, z] = [x * c + z * s, -x * s + z * c];
    c = Math.cos(pitch); s = Math.sin(pitch); [y, z] = [y * c - z * s, y * s + z * c];
    return [x, y, z];
  }
  const shade = (n, hue) => { const l = clamp(n[1] * 0.55 + n[2] * -0.25 + n[0] * 0.2 + 0.5, 0, 1); return `hsl(${hue} ${70 + l * 25}% ${14 + l * 52}%)`; };
  const normal = (a, b, c) => { const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]; const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const m = Math.hypot(...n) || 1; return [n[0] / m, n[1] / m, n[2] / m]; };

  function skyAt(t) { /* t 0 top … 1 horizon */
    const stops = [[0, [5, 3, 18]], [0.55, [30, 8, 62]], [0.85, [120, 20, 108]], [1, [255, 77, 141]]];
    for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) { const [a, ca] = stops[i - 1], [b, cb] = stops[i], u = (t - a) / (b - a); return `rgb(${ca.map((v, k) => Math.round(lerp(v, cb[k], u))).join(',')})`; }
    return 'rgb(255,77,141)';
  }

  /* ---------- drawing ---------- */
  function draw(cv, mode) {
    const ctx = cv.getContext('2d'), W = cv.width, H = cv.height, k = W / 520, wire = mode === 'wire';
    const { f, hy, cx, P } = cam(W, H);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
    const INK = wire ? '#38bdf8' : '#00f0ff';

    /* sky / background */
    if (wire) { ctx.fillStyle = '#030814'; ctx.fillRect(0, 0, W, H); }
    else { const g = ctx.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, '#05030f'); g.addColorStop(.55, '#1a0638'); g.addColorStop(.88, '#78146a'); g.addColorStop(1, '#ff4d8d'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, hy); ctx.fillStyle = '#07040f'; ctx.fillRect(0, hy, W, H - hy); }

    /* stars */
    for (const s of stars) {
      const a = 0.35 + 0.65 * Math.abs(Math.sin(S.t * s.s + s.p)), x = s.x * W, y = s.y * H;
      if (wire) { ctx.strokeStyle = `rgba(56,189,248,${a * 0.55})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 3 * k, y); ctx.lineTo(x + 3 * k, y); ctx.moveTo(x, y - 3 * k); ctx.lineTo(x, y + 3 * k); ctx.stroke(); }
      else { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.arc(x, y, s.r * k, 0, TAU); ctx.fill(); }
    }

    /* sun */
    const sr = H * 0.23, sy = hy - sr * 0.28;
    if (wire) {
      ctx.strokeStyle = 'rgba(56,189,248,.8)'; ctx.lineWidth = 1.2 * k;
      for (const m of [1, 0.78, 0.56, 0.34]) { ctx.beginPath(); ctx.arc(cx, sy, sr * m, 0, TAU); ctx.stroke(); }
      ctx.setLineDash([4 * k, 4 * k]); ctx.beginPath(); ctx.moveTo(cx - sr * 1.25, sy); ctx.lineTo(cx + sr * 1.25, sy); ctx.moveTo(cx, sy - sr * 1.25); ctx.lineTo(cx, sy + sr * 1.1); ctx.stroke(); ctx.setLineDash([]);
    } else {
      const glow = ctx.createRadialGradient(cx, sy, sr * 0.6, cx, sy, sr * 2.1); glow.addColorStop(0, 'rgba(255,90,160,.45)'); glow.addColorStop(1, 'rgba(255,90,160,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, hy + 4);
      ctx.save(); ctx.beginPath(); ctx.arc(cx, sy, sr, 0, TAU); ctx.clip();
      const g = ctx.createLinearGradient(0, sy - sr, 0, sy + sr); g.addColorStop(0, '#ffe45e'); g.addColorStop(.5, '#ff7a45'); g.addColorStop(1, '#ff2d95'); ctx.fillStyle = g; ctx.fillRect(cx - sr, sy - sr, sr * 2, sr * 2);
      for (let i = 0; i < 7; i++) { const yy = sy + sr * (0.05 + i * 0.14), th = sr * (0.015 + i * 0.012); ctx.fillStyle = skyAt(clamp(yy / hy, 0, 1)); ctx.fillRect(cx - sr, yy, sr * 2, th); }
      ctx.restore();
    }

    /* mountains */
    for (const [r, col, line, alpha] of [[ridgeB, '#1b0a3d', '#b04cff', .55], [ridgeA, '#10061f', '#ff3df0', .9]]) {
      ctx.beginPath(); ctx.moveTo(0, hy);
      for (const p of r) ctx.lineTo(p.x * W, hy - p.h * H);
      ctx.lineTo(W, hy); ctx.closePath();
      if (!wire) { ctx.fillStyle = col; ctx.fill(); }
      ctx.strokeStyle = wire ? 'rgba(56,189,248,.75)' : line; ctx.globalAlpha = wire ? 1 : alpha; ctx.lineWidth = (wire ? 1 : 1.4) * k;
      if (!wire) { ctx.shadowColor = line; ctx.shadowBlur = 8 * k; }
      ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      if (wire) { ctx.strokeStyle = 'rgba(56,189,248,.22)'; ctx.beginPath(); for (let i = 1; i < r.length - 1; i += 2) { ctx.moveTo(r[i].x * W, hy - r[i].h * H); ctx.lineTo(r[i - 1].x * W, hy); ctx.moveTo(r[i].x * W, hy - r[i].h * H); ctx.lineTo(r[i + 1].x * W, hy); } ctx.stroke(); }
    }

    /* ground grid */
    if (!wire) { const g = ctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, 'rgba(255,77,141,.30)'); g.addColorStop(.25, 'rgba(60,10,90,.25)'); g.addColorStop(1, 'rgba(5,3,15,0)'); ctx.fillStyle = g; ctx.fillRect(0, hy, W, H - hy); }
    ctx.lineWidth = (wire ? 1 : 1.2) * k;
    if (!wire) { ctx.shadowColor = '#ff3df0'; ctx.shadowBlur = 5 * k; }
    for (let z = 1.6 - S.scroll; z < 46; z += 2) {
      if (z < 1.5) continue; const y = P(0, 0, z)[1]; if (y > H) continue;
      const a = clamp(1 - z / 46, 0, 1);
      ctx.strokeStyle = wire ? `rgba(56,189,248,${0.15 + a * 0.5})` : `rgba(255,61,240,${0.1 + a * 0.75})`;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let x = -24; x <= 24; x += 2) {
      const [x1, y1] = P(x, 0, 1.5), [x2, y2] = P(x, 0, 60);
      ctx.strokeStyle = wire ? 'rgba(56,189,248,.5)' : 'rgba(255,61,240,.62)'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.strokeStyle = wire ? 'rgba(56,189,248,.9)' : 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.2 * k; ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(W, hy); ctx.stroke();

    /* draw list (far → near) */
    const items = [];
    for (const e of S.enemies) items.push({ z: e.z, e }); for (const b of S.bolts) items.push({ z: b.z, b }); for (const p of S.parts) items.push({ z: p.z, p });
    items.push({ z: 4.2, ship: true }); items.sort((a, b) => b.z - a.z);

    const crystalHue = [172, 292, 36];
    function mesh(faces, verts, tx, ty, tz, sc, rot, hue, isShip) {
      const proj = (v) => { const r = rotate([v[0] * sc, v[1] * sc, v[2] * sc], rot[0], rot[1], rot[2]); return { w: r, s: P(tx + r[0], ty + r[1], tz + r[2]) }; };
      const list = [];
      for (const fc of faces) {
        const [a, b, c] = fc.slice(0, 3).map((v) => proj(isShip ? v : verts[v]));
        const n = normal(a.w, b.w, c.w); const cz = (a.w[2] + b.w[2] + c.w[2]) / 3;
        list.push({ a, b, c, n, cz, tag: fc[3] });
      }
      list.sort((p, q) => q.cz - p.cz);
      let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
      for (const t of list) {
        const pts = [t.a.s, t.b.s, t.c.s]; for (const [x, y] of pts) { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); ctx.lineTo(pts[2][0], pts[2][1]); ctx.closePath();
        if (wire) { ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 1.2 * k; ctx.stroke(); }
        else {
          ctx.fillStyle = shade(t.n, hue); ctx.fill();
          ctx.strokeStyle = `hsla(${hue},100%,${isShip ? 78 : 72}%,.9)`; ctx.lineWidth = 0.9 * k; ctx.shadowColor = `hsl(${hue},100%,60%)`; ctx.shadowBlur = 6 * k; ctx.stroke(); ctx.shadowBlur = 0;
        }
      }
      return [minx, miny, maxx, maxy];
    }
    function bbox(b, label) {
      const [x0, y0, x1, y1] = b, m = 5 * k, l = 7 * k; ctx.strokeStyle = 'rgba(125,211,252,.9)'; ctx.lineWidth = 1 * k;
      for (const [x, y, dx, dy] of [[x0 - m, y0 - m, 1, 1], [x1 + m, y0 - m, -1, 1], [x0 - m, y1 + m, 1, -1], [x1 + m, y1 + m, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x + dx * l, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * l); ctx.stroke(); }
      ctx.fillStyle = '#7dd3fc'; ctx.font = `${7 * k}px ${mono}`; ctx.fillText(label, x0 - m, y0 - m - 3 * k);
    }

    for (const it of items) {
      if (it.e) {
        const e = it.e, s = 0.55, hue = crystalHue[e.hue];
        const bb = mesh(OCT_F, OCT, e.x, 0.95, e.z, s, [e.rot * 0.4, e.rot, 0.35], hue, false);
        if (wire && e.z < 24) bbox(bb, 'CRYSTAL_' + String(Math.floor(e.rot * 10) % 90 + 10));
      } else if (it.b) {
        const [x1, y1] = P(it.b.x, 0.7, it.b.z), [x2, y2] = P(it.b.x, 0.7, it.b.z + 1.8);
        ctx.lineCap = 'round';
        if (wire) { ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 1.4 * k; ctx.setLineDash([3 * k, 3 * k]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); }
        else { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4 * k; ctx.shadowColor = '#00f0ff'; ctx.shadowBlur = 12 * k; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.shadowBlur = 0; }
      } else if (it.p) {
        const p = it.p, [x, y] = P(p.x, p.y, p.z), r = Math.max(0.5, (1.6 * k * 6) / p.z);
        if (wire) { ctx.strokeStyle = `rgba(125,211,252,${p.l})`; ctx.lineWidth = 1 * k; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); }
        else { ctx.fillStyle = `hsla(${crystalHue[p.hue]},100%,${55 + p.l * 25}%,${p.l})`; ctx.shadowColor = `hsl(${crystalHue[p.hue]},100%,60%)`; ctx.shadowBlur = 8 * k; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }
      } else {
        /* ship */
        const sx = S.x, bob = Math.sin(S.t * 2.4) * 0.05, yaw = -S.vx * 0.05;
        const [gx, gy] = P(sx, 0, 4.2);                                        // ground shadow
        if (!wire) { ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(gx, gy, 62 * k, 9 * k, 0, 0, TAU); ctx.fill(); }
        else { ctx.strokeStyle = 'rgba(125,211,252,.45)'; ctx.setLineDash([3 * k, 3 * k]); ctx.beginPath(); ctx.ellipse(gx, gy, 62 * k, 9 * k, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
        if (!wire) {                                                            // engine flames
          for (const ex of [-0.38, 0.38]) {
            const r = rotate([ex * 0.8, 0.05, -0.95 * 0.8], S.roll, yaw, -0.18), [fx, fy] = P(sx + r[0], 0.62 + bob + r[1], 4.2 + r[2]), fl = (9 + Math.sin(S.t * 40 + ex * 9) * 3) * k;
            const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fl * 2.2); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.25, 'rgba(0,240,255,.8)'); g.addColorStop(1, 'rgba(0,240,255,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx, fy, fl * 2.2, 0, TAU); ctx.fill();
          }
        }
        const bb = mesh(SHIP, null, sx, 0.62 + bob, 4.2, 0.8, [S.roll, yaw, -0.18], 188, true);
        if (wire) {
          bbox(bb, 'SHIP_01');
          ctx.fillStyle = '#38bdf8'; ctx.font = `${7 * k}px ${mono}`; ctx.fillText(`x:${sx.toFixed(2)}  y:0.62  z:4.20`, bb[0] - 5 * k, bb[3] + 15 * k);
        }
      }
    }

    /* HUD */
    ctx.textBaseline = 'alphabetic';
    if (wire) {
      ctx.fillStyle = '#38bdf8'; ctx.font = `700 ${8 * k}px ${mono}`;
      ctx.fillText('SCORE  ▒▒▒▒▒▒', 10 * k, 16 * k); ctx.fillText('COMBO  ▒▒', 10 * k, 28 * k);
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1 * k; ctx.strokeRect(W - 94 * k, 10 * k, 80 * k, 7 * k);
      ctx.setLineDash([2 * k, 2 * k]); ctx.strokeRect(10 * k, H - 22 * k, W - 20 * k, 0.1); ctx.setLineDash([]);
    } else {
      ctx.font = `800 ${9 * k}px ${mono}`; ctx.shadowColor = '#00f0ff'; ctx.shadowBlur = 6 * k;
      ctx.fillStyle = '#fff'; ctx.fillText('SCORE ' + String(S.score).padStart(6, '0'), 10 * k, 16 * k);
      ctx.fillStyle = '#ffe45e'; ctx.fillText('COMBO ×' + S.combo, 10 * k, 28 * k); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(W - 94 * k, 10 * k, 80 * k, 7 * k);
      const g = ctx.createLinearGradient(W - 94 * k, 0, W - 14 * k, 0); g.addColorStop(0, '#00f0ff'); g.addColorStop(1, '#a855f7'); ctx.fillStyle = g; ctx.fillRect(W - 94 * k, 10 * k, 80 * k * S.shield, 7 * k);
      ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = `700 ${6.5 * k}px ${mono}`; ctx.fillText('SHIELD', W - 94 * k, 26 * k);
    }
    /* final-only: scanlines + vignette keep it feeling like a real viewport */
    if (!wire) {
      ctx.fillStyle = 'rgba(0,0,0,.08)'; for (let y = 0; y < H; y += 3 * k) ctx.fillRect(0, y, W, 1);
      const v = ctx.createRadialGradient(W / 2, H * 0.55, H * 0.35, W / 2, H * 0.55, H * 0.95); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    }
  }

  /* ---------- sizing + loop ---------- */
  function size() { for (const cv of cvs) { const r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); const w = Math.max(2, Math.round(r.width * d)), h = Math.max(2, Math.round(r.height * d)); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } } }
  const still = () => document.documentElement.getAttribute('data-motion') === 'off' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  let run = false, last = 0, raf = 0, visible = false;
  function frame(now) {
    if (!run) return;
    const dt = clamp((now - last) / 1000, 0, 0.05); last = now;
    step(dt); for (const cv of cvs) draw(cv, cv.dataset.mode);
    raf = requestAnimationFrame(frame);
  }
  function update() {
    const want = visible && !document.hidden && !still();
    if (want && !run) { run = true; last = performance.now(); size(); raf = requestAnimationFrame(frame); }
    else if (!want && run) { run = false; cancelAnimationFrame(raf); }
    if (!want && visible) { size(); for (let i = 0; i < 90; i++) step(1 / 30); for (const cv of cvs) draw(cv, cv.dataset.mode); }   // one tidy static frame
  }
  if ('ResizeObserver' in window) new ResizeObserver(() => { size(); if (!run) for (const cv of cvs) draw(cv, cv.dataset.mode); }).observe(cvs[0].parentElement);
  if ('IntersectionObserver' in window) new IntersectionObserver((en) => { visible = en.some((x) => x.isIntersecting); update(); }, { threshold: 0.05 }).observe(document.getElementById('compare') || cvs[0]);
  else { visible = true; update(); }
  document.addEventListener('visibilitychange', update);
  window.addEventListener('portfolio:motion', update);
})();
