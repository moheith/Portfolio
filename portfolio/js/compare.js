/* js/compare.js — Raw vs Real Interactive Comparison Slider (Yulya Studio UI Mockup vs Wireframe) */

(function () {
  'use strict';

  let currentPct = 50;
  let hasAutoDemoed = false;

  const Compare = {
    build() {
      const finalLayer = document.querySelector('.raw__layer--final');
      const wireLayer = document.querySelector('.raw__layer--wire');
      if (!finalLayer || !wireLayer) return;

      // 1. Build Wireframe CAD Mock
      wireLayer.innerHTML = `
        <div class="mock-wire">
          <div class="mock-wire__blueprint-grid"></div>
          <div class="mock-wire__topbar">
            <div class="mock-wire__cad-tag"><span class="cad-cross">+</span> CAD_SPEC // YULYA_STUDIO_v2.4</div>
            <div class="mock-wire__cad-dim">DIM: 960 × 540 DP · SCALE 1:1</div>
            <div class="mock-wire__cad-actions">
              <span class="mock-wire__btn-wire">[AST_TREE]</span>
              <span class="mock-wire__btn-wire">[CANVAS_2D]</span>
              <span class="mock-wire__btn-wire is-accent">[RUN_SYS ▶]</span>
            </div>
          </div>
          <div class="mock-wire__body">
            <div class="mock-wire__panel mock-wire__tree">
              <div class="mock-wire__panel-head"><span class="cad-cross">+</span> [AST_NAV: 140px]</div>
              <div class="mock-wire__tree-lines">
                <span class="mock-wire__line" style="width:75%"></span>
                <span class="mock-wire__line" style="width:60%"></span>
                <span class="mock-wire__line" style="width:85%"></span>
                <span class="mock-wire__line" style="width:50%"></span>
                <span class="mock-wire__line" style="width:70%"></span>
              </div>
              <div class="mock-wire__dim-v">◄ 140px ►</div>
            </div>
            <div class="mock-wire__panel mock-wire__editor">
              <div class="mock-wire__panel-head"><span class="cad-cross">+</span> [MONACO_BUFFER: 520px] · UTF-8</div>
              <div class="mock-wire__code-wires">
                <div class="mock-wire__c-line"><span class="mock-wire__num">01</span><span class="mock-wire__code-block" style="width:35%"></span></div>
                <div class="mock-wire__c-line"><span class="mock-wire__num">02</span><span class="mock-wire__code-block" style="width:70%"></span></div>
                <div class="mock-wire__c-line"><span class="mock-wire__num">03</span><span class="mock-wire__code-block" style="width:55%"></span></div>
                <div class="mock-wire__c-line"><span class="mock-wire__num">04</span><span class="mock-wire__code-block" style="width:80%"></span></div>
                <div class="mock-wire__c-line"><span class="mock-wire__num">05</span><span class="mock-wire__code-block" style="width:65%"></span><span class="mock-wire__caret"></span></div>
                <div class="mock-wire__c-line"><span class="mock-wire__num">06</span><span class="mock-wire__code-block" style="width:40%"></span></div>
                <div class="mock-wire__c-line"><span class="mock-wire__num">07</span><span class="mock-wire__code-block" style="width:60%"></span></div>
              </div>
              <div class="mock-wire__dim-h">◄──────── 520px ────────►</div>
            </div>
            <div class="mock-wire__panel mock-wire__canvas">
              <div class="mock-wire__panel-head"><span class="cad-cross">+</span> [RENDER_TARGET: 260px] · 60Hz</div>
              <div class="mock-wire__viewport-schematic">
                <div class="mock-wire__crosshair"></div>
                <div class="mock-wire__ship-schematic">
                  <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
                    <polygon points="20,4 36,32 20,24 4,32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
                    <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity="0.6"/>
                  </svg>
                </div>
                <span class="mock-wire__hud-box">[VECTOR_RADAR]</span>
              </div>
              <div class="mock-wire__dim-v">◄ 260px ►</div>
            </div>
          </div>
          <div class="mock-wire__bottombar">
            <span class="mock-wire__io-pipe"><span class="cad-cross">+</span> [IO_PIPE: GEMINI_STREAM_API]</span>
            <span class="mock-wire__status-badge">[STATUS: AWAITING_PROMPT]</span>
          </div>
        </div>
      `;

      // 2. Build Final UI Mock (Yulya Studio)
      finalLayer.innerHTML = `
        <div class="mock-final">
          <div class="mock-final__topbar">
            <div class="mock-final__dots" aria-hidden="true">
              <span class="dot dot--red"></span>
              <span class="dot dot--yellow"></span>
              <span class="dot dot--green"></span>
            </div>
            <div class="mock-final__title">
              <span class="mock-final__status-dot"></span>
              <span class="mock-final__logo">YULYA STUDIO</span>
              <span class="mock-final__ver">v2.4</span>
            </div>
            <div class="mock-final__tabs">
              <span class="mock-final__tab is-active"><i class="ts-icon">TS</i> game.ts <i class="close-x">×</i></span>
              <span class="mock-final__tab"><i class="ts-icon">TS</i> ship.ts</span>
              <span class="mock-final__tab"><i class="json-icon">{}</i> assets.json</span>
            </div>
            <div class="mock-final__actions">
              <span class="mock-final__fps">● 60 FPS</span>
              <button class="mock-final__run" type="button">RUN GAME ▶</button>
            </div>
          </div>
          <div class="mock-final__body">
            <div class="mock-final__tree">
              <div class="mock-final__tree-header">EXPLORER</div>
              <div class="mock-final__tree-group">
                <div class="mock-final__tree-dir">▼ <span>src</span></div>
                <div class="mock-final__tree-item is-active"><span class="file-icon ts">TS</span> game.ts</div>
                <div class="mock-final__tree-item"><span class="file-icon ts">TS</span> ship.ts</div>
                <div class="mock-final__tree-item"><span class="file-icon ts">TS</span> particles.ts</div>
              </div>
              <div class="mock-final__tree-group">
                <div class="mock-final__tree-dir">▶ <span>sprites</span></div>
                <div class="mock-final__tree-dir">▶ <span>audio</span></div>
              </div>
              <div class="mock-final__git"><span class="git-branch">⎇ main*</span> <span class="git-count">+2</span></div>
            </div>
            <div class="mock-final__code">
              <div class="mock-final__lines">
                <div class="code-line"><span class="ln">01</span><span class="cmt">// 🚀 Yulya Game Engine v2.4</span></div>
                <div class="code-line"><span class="ln">02</span><span class="kw">import</span> { Ship, Starfield } <span class="kw">from</span> <span class="str">'@yulya/core'</span>;</div>
                <div class="code-line"><span class="ln">03</span><span class="kw">const</span> canvas = document.<span class="fn">getElementById</span>(<span class="str">'viewport'</span>);</div>
                <div class="code-line"><span class="ln">04</span><span class="kw">const</span> engine = <span class="kw">new</span> <span class="fn">Engine</span>(canvas, { fps: <span class="num">60</span> });</div>
                <div class="code-line is-active-line"><span class="ln">05</span><span class="kw">const</span> player = <span class="kw">new</span> <span class="fn">Ship</span>({ x: <span class="num">160</span>, y: <span class="num">120</span>, thruster: <span class="kw">true</span> });<span class="caret"></span></div>
                <div class="code-line"><span class="ln">06</span>engine.<span class="fn">onUpdate</span>((delta) =&gt; {</div>
                <div class="code-line"><span class="ln">07</span>&nbsp;&nbsp;player.<span class="fn">update</span>(delta);</div>
                <div class="code-line"><span class="ln">08</span>&nbsp;&nbsp;Starfield.<span class="fn">emit</span>(player.velocity);</div>
                <div class="code-line"><span class="ln">09</span>});</div>
                <div class="code-line"><span class="ln">10</span>engine.<span class="fn">start</span>();</div>
              </div>
              <div class="mock-final__minimap" aria-hidden="true">
                <div class="minimap-line" style="width:60%"></div>
                <div class="minimap-line" style="width:85%"></div>
                <div class="minimap-line" style="width:70%"></div>
                <div class="minimap-line" style="width:90%"></div>
                <div class="minimap-line is-active" style="width:75%"></div>
                <div class="minimap-line" style="width:50%"></div>
                <div class="minimap-line" style="width:65%"></div>
              </div>
            </div>
            <div class="mock-final__preview">
              <div class="mock-final__stars"></div>
              <div class="mock-final__crt-lines"></div>
              <div class="mock-final__hud">
                <div class="hud-score">SCORE: 04,820</div>
                <div class="hud-shields">SHIELD <span class="hud-bar"><i style="width:92%"></i></span> 92%</div>
                <div class="hud-radar">RADAR [●]</div>
              </div>
              <div class="mock-final__ship-wrap">
                <div class="mock-final__thruster-flame"></div>
                <div class="mock-final__ship-body"></div>
              </div>
            </div>
          </div>
          <div class="mock-final__chat">
            <div class="mock-final__copilot-pill">
              <span class="copilot-sparkle">✨</span>
              <span class="copilot-label">Gemini Copilot:</span>
              <span class="copilot-text">"Spawn enemy boss fleet with homing lasers on wave 5"</span>
            </div>
            <button class="mock-final__chat-send" type="button">GENERATE ↵</button>
          </div>
        </div>
      `;

      this.initEvents();
      this.initAutoDemo();
    },

    setDivider(pct) {
      currentPct = Math.min(100, Math.max(0, pct));
      const stage = document.querySelector('.raw__stage');
      const wire = document.querySelector('.raw__layer--wire');
      const divider = document.querySelector('.raw__divider');
      const handle = document.querySelector('.raw__handle');

      if (!stage || !wire || !divider || !handle) return;

      stage.setAttribute('aria-valuenow', Math.round(currentPct));
      wire.style.clipPath = `inset(0 ${100 - currentPct}% 0 0)`;
      divider.style.left = `${currentPct}%`;
      handle.style.left = `${currentPct}%`;
    },

    initEvents() {
      const stage = document.querySelector('.raw__stage');
      if (!stage) return;

      let isDragging = false;

      const updatePos = (clientX) => {
        const rect = stage.getBoundingClientRect();
        const x = clientX - rect.left;
        const pct = (x / rect.width) * 100;
        Compare.setDivider(pct);
      };

      // Pointer / Mouse events
      stage.addEventListener('mousedown', (e) => {
        isDragging = true;
        updatePos(e.clientX);
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updatePos(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Touch events
      stage.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          isDragging = true;
          updatePos(e.touches[0].clientX);
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!isDragging || !e.touches || !e.touches[0]) return;
        updatePos(e.touches[0].clientX);
      }, { passive: true });

      window.addEventListener('touchend', () => {
        isDragging = false;
      });

      // Keyboard Accessibility (←, →, Home, End)
      stage.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          Compare.setDivider(currentPct - 2);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          Compare.setDivider(currentPct + 2);
        } else if (e.key === 'Home') {
          e.preventDefault();
          Compare.setDivider(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          Compare.setDivider(100);
        }
      });
    },

    /* =====================================================================
       Auto-Demo on First View: 15% -> 85% -> 50% over 2.4s
    ===================================================================== */
    initAutoDemo() {
      const stage = document.querySelector('.raw__stage');
      if (!stage) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !hasAutoDemoed &&
            (!window.Swarm || window.Swarm.state === 'finale' || window.Swarm.state === 'live')
          ) {
            hasAutoDemoed = true;
            observer.disconnect();

            // Run smooth auto-demo
            const startTime = performance.now();
            const duration = 2400; // 2.4s

            const step = (now) => {
              const t = (now - startTime) / duration;
              if (t >= 1) {
                Compare.setDivider(50);
                return;
              }

              let p = 50;
              if (t < 0.35) {
                // 50 -> 15
                const sub = t / 0.35;
                p = 50 - 35 * Math.sin(sub * Math.PI / 2);
              } else if (t < 0.75) {
                // 15 -> 85
                const sub = (t - 0.35) / 0.4;
                p = 15 + 70 * (0.5 - 0.5 * Math.cos(sub * Math.PI));
              } else {
                // 85 -> 50
                const sub = (t - 0.75) / 0.25;
                p = 85 - 35 * Math.sin(sub * Math.PI / 2);
              }

              Compare.setDivider(p);
              requestAnimationFrame(step);
            };

            requestAnimationFrame(step);
          }
        });
      }, { threshold: 0.6 });

      observer.observe(stage);
    },
  };

  window.Compare = Compare;
})();
