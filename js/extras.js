/* js/extras.js — Command Palette, Mini Terminal, Web Audio Sound, Live Clock, GitHub Stats, Accent Switcher, Idle Companions, Easter Eggs & Contact Utilities */

(function () {
  'use strict';

  let audioCtx = null;
  let soundEnabled = false;

  /* =====================================================================
     1. WEB AUDIO SYNTHESIZER (SwarmSound)
  ===================================================================== */
  const SwarmSound = {
    set(on) {
      soundEnabled = Boolean(on);
      if (soundEnabled && !audioCtx) {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
          }
        } catch (e) {
          console.warn('[sound] Web Audio not available', e);
        }
      }
      if (audioCtx && audioCtx.state === 'suspended' && soundEnabled) {
        audioCtx.resume();
      }

      // Update speaker buttons in HUD
      document.querySelectorAll('[data-act="sound"]').forEach((btn) => {
        btn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
        btn.textContent = soundEnabled ? '🔊' : '🔇';
      });
    },

    tick(ch) {
      if (!soundEnabled || !audioCtx) return;
      // Play tick only on space or text end
      if (ch !== ' ' && ch !== undefined) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.012);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.012);
      } catch (_) {}
    },

    whoosh() {
      if (!soundEnabled || !audioCtx) return;
      try {
        const bufferSize = audioCtx.sampleRate * 0.25;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.25);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
      } catch (_) {}
    },

    chime() {
      if (!soundEnabled || !audioCtx) return;
      try {
        // Two-note soft chime (C6 -> G6)
        [1046.5, 1567.98].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.14);
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime + idx * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.14 + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + idx * 0.14);
          osc.stop(audioCtx.currentTime + idx * 0.14 + 0.6);
        });
      } catch (_) {}
    },
  };
  window.SwarmSound = SwarmSound;

  /* =====================================================================
     2. EXTRAS CONTROLLER
  ===================================================================== */
  const Extras = {
    initStatic() {
      this.initClock();
      this.initAccent();
      this.initMotionToggle();
      this.initCopyEmail();
      this.initCVLinks();
      this.initQuickBrief();
      this.initTerminalLoop();
      this.initCommandPalette();
      this.initMiniTerminal();
      this.initIdleCompanions();
      this.initKonamiAndReplay();
      this.initGitHubStats();
      this.initHeadingGlitch();
    },

    /* =====================================================================
       Toast Notifications
    ===================================================================== */
    toast(msg) {
      let toastEl = document.getElementById('toast');
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.id = 'toast';
        toastEl.className = 'toast';
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = msg;
      toastEl.classList.add('is-show');
      clearTimeout(toastEl._timer);
      toastEl._timer = setTimeout(() => {
        toastEl.classList.remove('is-show');
      }, 3000);
    },

    /* =====================================================================
       Live Clock: Bengaluru IST, updates [data-clock] text & dataset.full
    ===================================================================== */
    initClock() {
      const update = () => {
        const now = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };
        const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
        const fullText = `Bengaluru · ${timeStr} IST`;

        document.querySelectorAll('[data-clock]').forEach((el) => {
          el.textContent = fullText;
          el.dataset.full = fullText;
        });
      };

      update();
      setInterval(update, 30000);
    },

    /* =====================================================================
       Accent Switcher (Red, Violet, Blue, Amber)
    ===================================================================== */
    initAccent() {
      const accents = {
        red: { red: '#ff3b30', accent: '#ff4d5a', btn: '#ff3b30', guide: '#ff3b30', maroon: '#7a141e' },
        violet: { red: '#a893ff', accent: '#c4b5fd', btn: '#8b5cf6', guide: '#a893ff', maroon: '#4c1d95' },
        blue: { red: '#3b82ff', accent: '#60a5fa', btn: '#2563eb', guide: '#3b82ff', maroon: '#1e3a8a' },
        amber: { red: '#ffb020', accent: '#fcd34d', btn: '#d97706', guide: '#ffb020', maroon: '#78350f' },
      };

      const setAccent = (name) => {
        const theme = accents[name] || accents.red;
        const root = document.documentElement;
        root.style.setProperty('--red', theme.red);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--btn', theme.btn);
        root.style.setProperty('--guide', theme.guide);
        root.style.setProperty('--maroon', theme.maroon);
        localStorage.setItem('mayura_accent', name);
      };

      const saved = localStorage.getItem('mayura_accent') || 'red';
      setAccent(saved);

      document.querySelectorAll('.accent-dot').forEach((dot) => {
        dot.addEventListener('click', () => {
          const acc = dot.getAttribute('data-accent');
          setAccent(acc);
          Extras.toast(`Accent set to ${acc}`);
        });
      });

      this.setAccent = setAccent;
    },

    /* =====================================================================
       Motion-off Toggle
    ===================================================================== */
    initMotionToggle() {
      const toggleBtn = document.querySelector('.nav__motion');
      const root = document.documentElement;

      const setMotion = (isOff) => {
        if (isOff) {
          root.setAttribute('data-motion', 'off');
          localStorage.setItem('motion', 'off');
        } else {
          root.removeAttribute('data-motion');
          localStorage.setItem('motion', 'on');
        }
      };

      const savedMotion = localStorage.getItem('motion');
      if (savedMotion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setMotion(true);
      } else {
        setMotion(false);
      }

      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const isCurrentlyOff = root.getAttribute('data-motion') === 'off';
          setMotion(!isCurrentlyOff);
          Extras.toast(isCurrentlyOff ? 'Motion enabled' : 'Motion reduced');
        });
      }
    },

    /* =====================================================================
       Copy Email & Feedback Toast
    ===================================================================== */
    initCopyEmail() {
      document.querySelectorAll('[data-copy-email]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const email = 'moheithmayura@gmail.com';
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(email).then(() => {
                Extras.toast('Email copied ✓');
              });
            } else {
              Extras.toast('moheithmayura@gmail.com');
            }
          }
        });
      });
    },

    /* =====================================================================
       CV & Resume Placeholders
    ===================================================================== */
    initCVLinks() {
      const checkAndDownload = (e, msg) => {
        const href = e.currentTarget.getAttribute('href');
        if (!href || href === '#' || window.location.protocol === 'file:') {
          e.preventDefault();
          Extras.toast(msg);
          return;
        }

        e.preventDefault();
        fetch(href, { method: 'HEAD' })
          .then((res) => {
            if (res.ok) {
              window.open(href, '_blank');
            } else {
              Extras.toast(msg);
            }
          })
          .catch(() => {
            Extras.toast(msg);
          });
      };

      const cvLink = document.querySelector('.hero__cv');
      if (cvLink) {
        cvLink.addEventListener('click', (e) => checkAndDownload(e, 'CV coming soon'));
      }

      const resumeLink = document.querySelector('.journey__resume');
      if (resumeLink) {
        resumeLink.addEventListener('click', (e) => checkAndDownload(e, 'Resume coming soon'));
      }
    },

    /* =====================================================================
       Quick Brief Form (WhatsApp Dispatch)
    ===================================================================== */
    initQuickBrief() {
      const briefForm = document.getElementById('brief');
      if (!briefForm) return;

      const input = briefForm.querySelector('input');
      const submit = () => {
        const text = input ? input.value.trim() : '';
        const phone = '918660227877';
        const url = text
          ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
          : `https://wa.me/${phone}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      };

      briefForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submit();
      });

      const sendBtn = briefForm.querySelector('[data-layer-id="ct.brief.icon.3"]');
      if (sendBtn) {
        sendBtn.addEventListener('click', (e) => {
          e.preventDefault();
          submit();
        });
      }
    },

    /* =====================================================================
       Contact Poster Card Typing Loop (Part 6.8)
    ===================================================================== */
    initTerminalLoop() {
      const term = document.querySelector('.poster__term');
      if (!term) return;

      const lines = [
        ['$ whoami', 'mayura — full stack dev & designer'],
        ['$ ls projects/', 'yulya  studio  desktop-ai-companion'],
        ['$ ./ship --now', '🚀 shipped to production'],
      ];

      let lineIdx = 0;
      setInterval(() => {
        const item = lines[lineIdx % lines.length];
        lineIdx++;
        const p1 = document.querySelector('[data-layer-id="ct.card.term.1"]');
        const p2 = document.querySelector('[data-layer-id="ct.card.term.2"]');
        const p3 = document.querySelector('[data-layer-id="ct.card.term.3"]');
        if (p1 && p2 && p3 && (!window.Swarm || window.Swarm.state === 'finale' || window.Swarm.state === 'live')) {
          p1.textContent = item[0];
          p2.textContent = item[1];
          p3.textContent = '$ ./ship --now';
        }
      }, 4000);
    },

    /* =====================================================================
       RGB Glitch Effect on Headings
    ===================================================================== */
    initHeadingGlitch() {
      document.querySelectorAll('.h2-display, .h2-bold').forEach((h) => {
        h.classList.add('glitch-text');
        h.setAttribute('data-text', h.textContent.trim());
      });
    },

    /* =====================================================================
       3. COMMAND PALETTE (Ctrl+K / /)
    ===================================================================== */
    initCommandPalette() {
      let backdrop = document.querySelector('.palette-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'palette-backdrop';
        backdrop.innerHTML = `
          <div class="palette-dialog" role="dialog" aria-modal="true" aria-label="Command Palette">
            <div class="palette-input-wrap">
              <span class="palette-input-icon">⌕</span>
              <input class="palette-input" type="text" placeholder="Type a command or search..." autocomplete="off">
              <span class="palette-esc-badge">ESC</span>
            </div>
            <div class="palette-list" role="listbox"></div>
          </div>
        `;
        document.body.appendChild(backdrop);
      }

      const input = backdrop.querySelector('.palette-input');
      const list = backdrop.querySelector('.palette-list');

      const commands = [
        { label: 'Go to Selected Work', icon: '01', action: () => window.Scroll.to('#work') },
        { label: 'Go to Highlights & Proof', icon: '02', action: () => window.Scroll.to('#highlights') },
        { label: 'Go to Behind The Screen', icon: '03', action: () => window.Scroll.to('#about') },
        { label: 'Go to The Journey', icon: '04', action: () => window.Scroll.to('#journey') },
        { label: 'Go to Contact', icon: '05', action: () => window.Scroll.to('#contact') },
        { label: 'Open Terminal Drawer', icon: '$_', action: () => Extras.openTerminal() },
        { label: 'Download CV', icon: '↓', action: () => Extras.toast('CV coming soon') },
        { label: 'Copy Email Address', icon: '✉', action: () => { navigator.clipboard.writeText('moheithmayura@gmail.com'); Extras.toast('Email copied ✓'); } },
        { label: 'Open WhatsApp', icon: '↗', action: () => window.open('https://wa.me/918660227877', '_blank') },
        { label: 'Open GitHub Profile', icon: '↗', action: () => window.open('https://github.com/moheith', '_blank') },
        { label: 'Toggle Sound Effects', icon: '🔊', action: () => SwarmSound.set(!soundEnabled) },
        { label: 'Replay Page Rebuild Intro', icon: '↺', action: () => { if (window.Swarm) { window.Swarm.reset(); window.Swarm.start(); } } },
        { label: 'Theme: Red Accent', icon: '●', action: () => Extras.setAccent('red') },
        { label: 'Theme: Violet Accent', icon: '●', action: () => Extras.setAccent('violet') },
        { label: 'Theme: Blue Accent', icon: '●', action: () => Extras.setAccent('blue') },
        { label: 'Theme: Amber Accent', icon: '●', action: () => Extras.setAccent('amber') },
      ];

      const render = (query = '') => {
        list.innerHTML = '';
        const q = query.toLowerCase().trim();
        const filtered = commands.filter((c) => c.label.toLowerCase().includes(q));

        if (!filtered.length) {
          list.innerHTML = `<div style="padding:16px;text-align:center;color:var(--dim);font-size:12px">No commands found</div>`;
          return;
        }

        filtered.forEach((cmd, idx) => {
          const item = document.createElement('div');
          item.className = `palette-item ${idx === 0 ? 'is-selected' : ''}`;
          item.innerHTML = `
            <div class="palette-item-left">
              <span class="palette-item-icon">${cmd.icon}</span>
              <span>${cmd.label}</span>
            </div>
            <span class="palette-item-badge">↵ Jump</span>
          `;
          item.addEventListener('click', () => {
            close();
            cmd.action();
          });
          list.appendChild(item);
        });
      };

      const open = () => {
        backdrop.classList.add('is-open');
        input.value = '';
        render();
        setTimeout(() => input.focus(), 50);
      };

      const close = () => {
        backdrop.classList.remove('is-open');
      };

      input.addEventListener('input', () => render(input.value));

      input.addEventListener('keydown', (e) => {
        const items = Array.from(list.querySelectorAll('.palette-item'));
        const selected = list.querySelector('.palette-item.is-selected');
        let idx = items.indexOf(selected);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (selected) selected.classList.remove('is-selected');
          const next = items[(idx + 1) % items.length];
          if (next) next.classList.add('is-selected');
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (selected) selected.classList.remove('is-selected');
          const prev = items[(idx - 1 + items.length) % items.length];
          if (prev) prev.classList.add('is-selected');
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (selected) selected.click();
        } else if (e.key === 'Escape') {
          close();
        }
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) close();
      });

      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          backdrop.classList.contains('is-open') ? close() : open();
        } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          open();
        }
      });

      this.openPalette = open;
    },

    /* =====================================================================
       4. INTERACTIVE MINI TERMINAL (Part 7.21)
    ===================================================================== */
    initMiniTerminal() {
      let backdrop = document.querySelector('.terminal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'terminal-backdrop';
        backdrop.innerHTML = `
          <div class="terminal-drawer" role="dialog" aria-modal="true" aria-label="Terminal">
            <div class="terminal-header">
              <div class="terminal-title">
                <i class="terminal-title-dot"></i>
                <span>mayura@portfolio: ~ (bash)</span>
              </div>
              <button class="terminal-close" type="button" aria-label="Close terminal">✕</button>
            </div>
            <div class="terminal-body" aria-live="polite">
              <div class="terminal-line terminal-line--system">Mayura Interactive Shell v2.4.0 (x86_64-pc-sys)</div>
              <div class="terminal-line terminal-line--dim">Type 'help' for available commands or 'exit' to close.</div>
            </div>
            <div class="terminal-input-row">
              <span class="terminal-prompt">mayura@portfolio:~$</span>
              <input class="terminal-input" type="text" autocomplete="off" spellcheck="false">
            </div>
          </div>
        `;
        document.body.appendChild(backdrop);
      }

      const input = backdrop.querySelector('.terminal-input');
      const body = backdrop.querySelector('.terminal-body');
      const closeBtn = backdrop.querySelector('.terminal-close');

      const print = (text, className = '') => {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        body.appendChild(line);
        body.scrollTop = body.scrollHeight;
      };

      const execute = (cmdStr) => {
        const raw = cmdStr.trim();
        if (!raw) return;
        print(`mayura@portfolio:~$ ${raw}`, 'terminal-line--cmd');
        const parts = raw.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');

        switch (cmd) {
          case 'help':
            print('Available commands:');
            print('  whoami          Display bio and identity');
            print('  about           Overview of skills and education');
            print('  projects        List shipped works');
            print('  open <n|slug>   Open a project modal');
            print('  skills          Creative & engineering toolkit');
            print('  contact         Show ways to reach out');
            print('  github          Open GitHub profile');
            print('  yulya           Open Yulya Bot website');
            print('  theme <color>   Set theme: red, violet, blue, amber');
            print('  replay          Re-run the swarm build intro');
            print('  clear           Clear the terminal window');
            print('  exit            Close the terminal');
            break;
          case 'whoami':
            print('Mohieth Mayura S Y ("Mayura")');
            print('Full Stack Developer & Graphics Designer based in Bengaluru, India.');
            print('Building AI tools, local LLM fine-tunes, and browser games.');
            break;
          case 'about':
            print('BCA Student at SFGC Bengaluru. 4+ years of programming, digital art & 3D.');
            break;
          case 'projects':
            ((window.CONTENT && window.CONTENT.projects) || []).forEach((p, idx) => {
              print(`  [${idx + 1}] ${p.title} (${p.tag})`);
            });
            break;
          case 'open':
            if (!arg) {
              print('Usage: open <project_number_or_slug>');
            } else {
              const num = parseInt(arg, 10);
              const p = !isNaN(num)
                ? window.CONTENT.projects[num - 1]
                : window.CONTENT.projects.find((item) => item.slug === arg);
              if (p) {
                print(`Opening project: ${p.title}`);
                window.Work.openModal(p.slug);
              } else {
                print(`Project '${arg}' not found.`);
              }
            }
            break;
          case 'skills':
            print('Python, JavaScript, TypeScript, Unity, Blender, Krita, Live2D, Ollama, Unsloth, WebGL');
            break;
          case 'contact':
            print('Email: moheithmayura@gmail.com');
            print('WhatsApp: +91 86602 27877');
            print('Instagram: @moheith_mayura');
            break;
          case 'github':
            window.open('https://github.com/moheith', '_blank');
            print('Opening https://github.com/moheith...');
            break;
          case 'yulya':
            window.open('https://discord.yulya.me', '_blank');
            print('Opening https://discord.yulya.me...');
            break;
          case 'theme':
            if (['red', 'violet', 'blue', 'amber'].includes(arg)) {
              Extras.setAccent(arg);
              print(`Accent theme set to ${arg}.`);
            } else {
              print('Usage: theme <red|violet|blue|amber>');
            }
            break;
          case 'replay':
            print('Replaying 30-agent swarm rebuild...');
            if (window.Swarm) {
              window.Swarm.reset();
              window.Swarm.start();
            }
            break;
          case 'clear':
            body.innerHTML = '';
            break;
          case 'exit':
            close();
            break;
          default:
            print(`command not found: ${cmd}. Type 'help' for available commands.`, 'terminal-line--err');
        }
      };

      const open = () => {
        backdrop.classList.add('is-open');
        setTimeout(() => input.focus(), 50);
      };

      const close = () => {
        backdrop.classList.remove('is-open');
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          execute(input.value);
          input.value = '';
        } else if (e.key === 'Escape') {
          close();
        }
      });

      closeBtn.addEventListener('click', close);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) close();
      });

      // Press backtick key ` to toggle
      document.addEventListener('keydown', (e) => {
        if (e.key === '`' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          backdrop.classList.contains('is-open') ? close() : open();
        }
      });

      this.openTerminal = open;
    },

    /* =====================================================================
       5. IDLE SWARM COMPANIONS (Part 7.14)
    ===================================================================== */
    initIdleCompanions() {
      let timer = null;
      let active = false;
      const companions = [];
      const colors = ['#5eead4', '#fb923c', '#ffffff', '#a78bfa', '#7dd3fc', '#f43f5e'];

      const create = () => {
        for (let i = 0; i < 6; i++) {
          const el = document.createElement('div');
          el.className = 'companion-cursor';
          el.innerHTML = `
            <svg viewBox="0 0 16 16" fill="${colors[i]}" style="transform:rotate(-45deg)">
              <polygon points="0,0 16,6 10,10 6,16"/>
            </svg>
          `;
          document.body.appendChild(el);
          companions.push({ el, x: 0, y: 0, targetX: 0, targetY: 0, angle: (i * Math.PI) / 3 });
        }
      };

      let lastMouseX = window.innerWidth / 2;
      let lastMouseY = window.innerHeight / 2;

      window.addEventListener('mousemove', (e) => {
        const dx = Math.abs(e.clientX - lastMouseX);
        const dy = Math.abs(e.clientY - lastMouseY);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        if (active && (dx > 30 || dy > 30)) {
          dismiss();
        }

        clearTimeout(timer);
        timer = setTimeout(() => {
          // If cursor in hero, summon companions
          const hero = document.getElementById('home');
          if (hero && hero.getBoundingClientRect().bottom > 200) {
            summon();
          }
        }, 4000);
      });

      const summon = () => {
        if (active) return;
        active = true;
        if (!companions.length) create();

        companions.forEach((c) => {
          c.x = lastMouseX + (Math.random() - 0.5) * 300;
          c.y = lastMouseY + (Math.random() - 0.5) * 300;
          c.el.style.opacity = '1';
        });

        loop();
      };

      const dismiss = () => {
        if (!active) return;
        active = false;
        companions.forEach((c) => {
          c.el.style.opacity = '0';
        });
      };

      const loop = () => {
        if (!active) return;
        const now = performance.now() * 0.002;
        companions.forEach((c, idx) => {
          c.angle += 0.02;
          const radius = 55 + idx * 8;
          c.targetX = lastMouseX + Math.cos(c.angle) * radius;
          c.targetY = lastMouseY + Math.sin(c.angle) * radius;

          c.x += (c.targetX - c.x) * 0.08;
          c.y += (c.targetY - c.y) * 0.08;

          c.el.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px)`;
        });
        requestAnimationFrame(loop);
      };
    },

    /* =====================================================================
       6. KONAMI CODE & REPLAY EASTER EGG (Part 7.17)
    ===================================================================== */
    initKonamiAndReplay() {
      const pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      let current = 0;

      document.addEventListener('keydown', (e) => {
        // Replay rebuild on 'R' key when not typing in an input
        if (
          e.key.toLowerCase() === 'r' &&
          document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA' &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          if (window.Swarm) {
            Extras.toast('Rebuilding page...');
            window.Swarm.reset();
            window.Swarm.start();
          }
          return;
        }

        // Konami code check
        const key = e.key;
        if (key.toLowerCase() === pattern[current].toLowerCase()) {
          current++;
          if (current === pattern.length) {
            current = 0;
            Extras.toast('🎮 KONAMI UNLOCKED: Swarm Orbital Swarm!');
            if (window.Swarm) {
              window.Swarm.start();
            }
          }
        } else {
          current = 0;
        }
      });
    },

    /* =====================================================================
       7. LIVE GITHUB STATS WIDGET (Part 7.12)
    ===================================================================== */
    initGitHubStats() {
      const cached = sessionStorage.getItem('mayura_gh_stats');
      if (cached) {
        try {
          const data = JSON.parse(cached);
          applyStats(data);
          return;
        } catch (_) {}
      }

      // Public GitHub API (no token) with silent fallback
      fetch('https://api.github.com/users/moheith')
        .then((res) => {
          if (!res.ok) throw new Error('GH rate limit or offline');
          return res.json();
        })
        .then((user) => {
          const stats = {
            public_repos: user.public_repos || 13,
            followers: user.followers || 4,
          };
          sessionStorage.setItem('mayura_gh_stats', JSON.stringify(stats));
          applyStats(stats);
        })
        .catch(() => {
          // Silently fall back to static numbers
          applyStats({ public_repos: 13, followers: 4 });
        });

      function applyStats(data) {
        const repoStat = document.querySelector('[data-layer-id="hl.row.6.metric"]');
        if (repoStat && (!window.Swarm || window.Swarm.state === 'finale' || window.Swarm.state === 'live')) {
          repoStat.textContent = String(data.public_repos);
        }
      }
    },
  };

  window.Extras = Extras;
})();
