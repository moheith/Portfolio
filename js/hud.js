/* js/hud.js — bottom control bar for the swarm. 3 states: scanning · building · done.
   Subscribes to Swarm events; owns NO build logic. Buttons: Tour/Touring, 1x cycle, speaker, ✕, Go live, Replay. */
(() => {
  const S = window.Swarm; if (!S) return;
  const hud = document.getElementById('sw-hud'); if (!hud) return;
  const SPEEDS = [1, 2, 4, 0.5];
  const COLORS = ['#5eead4', '#fb923c', '#ffffff', '#a78bfa', '#7dd3fc', '#fda4af', '#fcd34d', '#86efac'];
  const ICON_ON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const ICON_OFF = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';
  const X = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>';
  let mode = null, refs = {};

  const stack = () => `<span class="stack">${COLORS.slice(0, 5).map((c) => `<i style="background:${c}"></i>`).join('')}</span>`;
  const unlocked = () => !!(window.SoundFX && window.SoundFX.isUnlocked && window.SoundFX.isUnlocked());
  /* Sound is on by default, but browsers need one click before audio can play: until then this button is that click.
     After that it is a real mute / unmute toggle (the choice is remembered). */
  const isMuted = () => !!(window.SoundFX && window.SoundFX.isEnabled && !window.SoundFX.isEnabled());
  const speaker = () => {
    if (isMuted()) return `<button type="button" data-a="sound" class="spk is-muted" aria-pressed="true" aria-label="Sound is off. Turn sound on" title="Sound off. Click to turn on">${ICON_OFF}<span class="spk__txt">Muted</span></button>`;
    if (!unlocked()) return `<button type="button" data-a="sound" class="spk is-off" aria-label="Turn sound on" title="Click to turn sound on">${ICON_OFF}<span class="spk__txt">Sound</span></button>`;
    return `<button type="button" data-a="sound" class="spk is-on" aria-pressed="false" aria-label="Sound is on. Mute" title="Sound on. Click to mute">${ICON_ON}<span class="spk__bars" aria-hidden="true"><i></i><i></i><i></i></span></button>`;
  };
  const close = () => `<button type="button" data-a="close" aria-label="Skip the intro" title="Skip">${X}</button>`;

  function render(next) {
    if (next === mode) return; mode = next; hud.classList.add('on');
    if (next === 'scan') hud.innerHTML = `<span class="txt">Scanning page…</span><span class="track indet"><i></i></span><button type="button" data-a="tour" class="ghost">Tour</button><button type="button" data-a="speed">${S.speed}x</button>${speaker()}${close()}`;
    else if (next === 'build') hud.innerHTML = `${stack()}<span class="txt"><b id="hAg">${S.agents.length}</b> agents</span><span class="div"></span><span class="txt"><b id="hBu">0</b> / <span id="hTo">${S.total}</span> layers</span><span class="track"><i id="hBar"></i></span><button type="button" data-a="tour" id="hTour" class="${S.tour ? 'pill' : 'ghost'}">${S.tour ? 'Touring' : 'Tour'}</button><button type="button" data-a="speed" id="hSp">${S.speed}x</button>${speaker()}${close()}`;
    else if (next === 'done') hud.innerHTML = `<span class="txt">Rebuilt by <b>${S.agents.length} agents</b> in <b>${S.doneSeconds.toFixed(1)}s</b></span><span class="track wide"><i style="width:100%"></i></span><button type="button" data-a="live" class="pill">Go live</button><button type="button" data-a="replay" class="ghost">Replay</button>${speaker()}${close()}`;
    refs = { ag: hud.querySelector('#hAg'), bu: hud.querySelector('#hBu'), to: hud.querySelector('#hTo'), bar: hud.querySelector('#hBar'), tour: hud.querySelector('#hTour'), sp: hud.querySelector('#hSp') };
    const first = hud.querySelector('button'); /* keep keyboard focus predictable */
  }

  S.on('state', (s) => {
    if (s === 'scan') render('scan'); else if (s === 'build') render('build'); else if (s === 'finale') render('done');
    else if (s === 'live' || s === 'abort') { hud.classList.remove('on'); hud.innerHTML = ''; mode = null; }
  });
  let lastDraw = 0;
  S.on('progress', (b, t) => {
    const n = performance.now(); if (mode !== 'build' || (n - lastDraw < 90 && b < t)) return; lastDraw = n;
    if (refs.bu) refs.bu.textContent = b; if (refs.to) refs.to.textContent = t; if (refs.bar) refs.bar.style.width = (t ? (b / t) * 100 : 0) + '%';
  });
  S.on('agents', (n) => { if (refs.ag) refs.ag.textContent = n; });
  S.on('tour', (on) => { if (refs.tour) { refs.tour.textContent = on ? 'Touring' : 'Tour'; refs.tour.className = on ? 'pill' : 'ghost'; } });
  S.on('speed', (v) => { if (refs.sp) refs.sp.textContent = v + 'x'; hud.querySelectorAll('[data-a="speed"]').forEach((b) => { b.textContent = v + 'x'; }); });
  const refreshSpeaker = () => hud.querySelectorAll('[data-a="sound"]').forEach((b) => { b.outerHTML = speaker(); });
  window.addEventListener('sfx:unlock', refreshSpeaker);
  window.addEventListener('sfx:mute', refreshSpeaker);

  hud.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return; const a = b.dataset.a;
    if (a === 'tour') S.setTour(!S.tour);
    else if (a === 'speed') S.setSpeed(SPEEDS[(SPEEDS.indexOf(S.speed) + 1) % SPEEDS.length]);
    else if (a === 'sound') { if (window.SoundFX) { if (isMuted() || !unlocked()) SoundFX.enable(); else SoundFX.disable(); } }
    else if (a === 'close') S.abort();
    else if (a === 'live') S.goLive();
    else if (a === 'replay') S.replay();
  });
})();
