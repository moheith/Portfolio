/* js/hud.js — bottom control bar. Reads Swarm state every tick, wires the buttons to the Swarm controls. */
(function () {
  const hud = document.getElementById('hud'); if (!hud) return;
  const $ = (s) => hud.querySelector(s);
  const agentsEl = $('[data-bind="agents"]'), layersEl = $('[data-bind="layers"]'), fill = $('.track b'), doneEl = $('[data-bind="done"]');
  const tourBtns = hud.querySelectorAll('[data-act="tour"]'), speedBtns = hud.querySelectorAll('[data-act="speed"]');
  const speeds = [1, 2, 4, 0.5];
  Swarm.onTick = (s) => {
    const joined = s.agents.filter((a) => a.joined).length;
    if (s.state === 'building') {
      hud.dataset.state = s.t < 0.8 ? 'scanning' : 'building';
      agentsEl.textContent = `${joined} agents`;
      layersEl.textContent = `${s.built} / ${s.total} layers`;
      fill.style.width = `${(s.built / s.total) * 100}%`;
      tourBtns.forEach((b) => { b.textContent = s.tour ? 'Touring' : 'Tour'; b.classList.toggle('pill-blue', s.tour); b.classList.toggle('ghost', !s.tour); });
    } else if (s.state === 'finale') {
      hud.dataset.state = 'done';
      doneEl.textContent = `Rebuilt by ${joined} agents in ${s.elapsedWall.toFixed(1)}s`;
    }
  };
  document.addEventListener('swarmstate', (e) => { if (e.detail === 'live') hud.dataset.state = 'gone'; });   // main.js listens to the same event
  hud.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act;
    if (act === 'tour') Swarm.toggleTour();
    else if (act === 'speed') { const i = (speeds.indexOf(Swarm.speed) + 1) % speeds.length; Swarm.setSpeed(speeds[i]); speedBtns.forEach((x) => { x.textContent = speeds[i] + 'x'; }); }
    else if (act === 'sound') { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '🔊' : '🔇'; window.SwarmSound && SwarmSound.set(on); }
    else if (act === 'close') Swarm.finishAll();
    else if (act === 'live') Swarm.goLive();
    else if (act === 'replay') Swarm.replay();
  });
  // a manual wheel / touch / key scroll pauses the auto tour (the pill turns into the ghost "Tour" button)
  ['wheel', 'touchstart', 'keydown'].forEach((ev) => addEventListener(ev, (e) => { if (Swarm.state === 'building' && (ev !== 'keydown' || ['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))) Swarm.tour = false; }, { passive: true }));
})();
