/* js/compare.js — "From raw. To real.": builds the Yulya Studio UI mock and its wireframe twin (same grid), and the drag slider. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const building = () => window.Swarm && Swarm.state === 'building';
  const motionOff = () => document.documentElement.dataset.motion === 'off';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let stage, wire, divider, handle, pos = 50, demoDone = false, userTouched = false;

  /* the finished UI: a miniature of Yulya Studio, the browser game maker */
  function finalHTML() {
    const code = [
      '<span class="m-k">const</span> canvas = document.<span class="m-f">querySelector</span>(<span class="m-s">\'#game\'</span>);',
      '<span class="m-k">const</span> ctx = canvas.<span class="m-f">getContext</span>(<span class="m-s">\'2d\'</span>);',
      '<span class="m-k">let</span> score = <span class="m-s">0</span>;',
      '<span class="m-c">// move the ship with the arrow keys</span>',
      '<span class="m-k">function</span> <span class="m-f">update</span>(dt) {',
      '  ship.x += input.dir * <span class="m-s">240</span> * dt;',
      '  <span class="m-k">if</span> (input.fire) <span class="m-f">spawnBullet</span>(ship);',
      '}',
      '<span class="m-f">requestAnimationFrame</span>(loop);<span class="m-caret"></span>'
    ].map((l, i) => '<span class="ln">' + (i + 1) + '</span>' + l).join('\n');
    let stars = ''; for (let i = 0; i < 14; i++) stars += '<i class="m-star" style="left:' + ((i * 37) % 97) + '%;animation-delay:-' + ((i * 0.37) % 2.4).toFixed(2) + 's;animation-duration:' + (1.8 + (i % 4) * 0.5) + 's"></i>';
    return '<div class="mock mock--final" aria-hidden="true">' +
      '<div class="mock__top"><span class="m-brand">YULYA <b>STUDIO</b></span><span class="m-tabs"><span class="is-on">Editor</span><span>Preview</span><span>Arcade</span></span><span class="m-run">RUN ▶</span></div>' +
      '<div class="mock__tree"><div class="m-file">index.html</div><div class="m-file is-on">game.js</div><div class="m-file dir">sprites/</div><div class="m-file dir">sounds/</div></div>' +
      '<div class="mock__editor"><div class="m-code">' + code + '</div></div>' +
      '<div class="mock__preview"><div class="m-game">' + stars + '<i class="m-bullet"></i><i class="m-ship"></i><span class="m-score">SCORE 1280</span></div></div>' +
      '<div class="mock__chat"><span class="m-ask">Ask Gemini to add a power-up…</span><span class="m-send">↗</span></div></div>';
  }
  /* the wireframe twin: the same grid, dashed boxes, grey bars, monospace labels, no colour */
  function wireHTML() {
    const bars = (n, widths) => Array.from({ length: n }, (_, i) => '<i class="w-bar" style="width:' + widths[i % widths.length] + '%"></i>').join('');
    return '<div class="mock mock--wire" aria-hidden="true">' +
      '<div class="mock__top"><span class="w-label">top bar</span><i class="w-bar" style="width:14%;margin-left:12%"></i><i class="w-bar" style="width:22%"></i><i class="w-bar" style="width:8%;margin-left:auto"></i></div>' +
      '<div class="mock__tree"><span class="w-label">file tree</span><div style="margin-top:3.2cqw">' + bars(4, [70, 55, 62, 50]) + '</div></div>' +
      '<div class="mock__editor"><span class="w-label">editor</span><div style="margin-top:3cqw">' + bars(9, [78, 52, 40, 66, 58, 72, 46, 30, 62]) + '</div></div>' +
      '<div class="mock__preview"><span class="w-label">preview</span><i class="w-x"></i></div>' +
      '<div class="mock__chat"><span class="w-label">chat</span><i class="w-bar" style="width:62%;margin-left:7%"></i><i class="w-bar" style="width:6%;margin-left:auto"></i></div></div>';
  }

  function render() {
    wire.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
    divider.style.left = pos + '%'; handle.style.left = pos + '%';
    stage.setAttribute('aria-valuenow', String(Math.round(pos)));
  }
  function setPos(v) { pos = clamp(v, 0, 100); render(); }
  function fromEvent(e) { const r = stage.getBoundingClientRect(); setPos(((e.clientX - r.left) / r.width) * 100); }

  /* 15% -> 85% -> 50% over 2.4 s, once, when the slider is first 60% visible */
  function demo() {
    if (demoDone || userTouched || motionOff()) return; demoDone = true;
    const keys = [50, 15, 85, 50], t0 = performance.now(), dur = 2400, ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => {
      if (userTouched) return;
      const p = Math.min(1, (now - t0) / dur), seg = Math.min(2, Math.floor(p * 3)), lp = ease(p * 3 - seg);
      setPos(keys[seg] + (keys[seg + 1] - keys[seg]) * lp);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const Compare = {
    build() {
      stage = $('#compare'); if (!stage) return;
      const fin = $('.raw__layer--final', stage); wire = $('.raw__layer--wire', stage);
      divider = $('.raw__divider', stage); handle = $('.raw__handle', stage);
      fin.innerHTML = finalHTML(); wire.innerHTML = wireHTML();
      // real screenshots win if they exist
      [['assets/img/raw-final.jpg', fin], ['assets/img/raw-wire.jpg', wire]].forEach(([src, host]) => {
        const im = new Image(); im.alt = ''; im.onload = () => { host.textContent = ''; im.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover'; host.appendChild(im); }; im.onerror = () => {}; im.src = src;
      });
      let down = false;
      stage.addEventListener('pointerdown', (e) => { if (building()) return; down = true; userTouched = true; stage.setPointerCapture && stage.setPointerCapture(e.pointerId); fromEvent(e); stage.focus({ preventScroll: true }); });
      stage.addEventListener('pointermove', (e) => { if (down) fromEvent(e); });
      const up = () => { down = false; }; stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up); stage.addEventListener('lostpointercapture', up);
      stage.addEventListener('keydown', (e) => {
        const k = e.key; let v = pos;
        if (k === 'ArrowLeft') v -= 2; else if (k === 'ArrowRight') v += 2; else if (k === 'Home') v = 0; else if (k === 'End') v = 100; else return;
        e.preventDefault(); userTouched = true; setPos(v);
      });
      render();
    },
    startSite() {
      if (!stage || !('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver((en) => { if (en[0].isIntersecting && !building()) { io.disconnect(); demo(); } }, { threshold: 0.6 });
      io.observe(stage);
    },
    set: setPos
  };
  window.Compare = Compare;
})();
