/* js/extras.js — palette, sound hint, accent switcher, idle companions, live stats, clock, easter eggs, toast */
(() => {
  'use strict';

  let toastTimer = null;
  const ACCENT_PRESETS = {
    crimson: { red: '#ff3b30', redDeep: '#c8231f', accent: '#ff4d5a', btn: '#ef4337', guide: '#ff4d2d' },
    blue:    { red: '#3b82ff', redDeep: '#2563eb', accent: '#60a5fa', btn: '#2563eb', guide: '#38bdf8' },
    violet:  { red: '#8b5cf6', redDeep: '#7c3aed', accent: '#a78bfa', btn: '#7c3aed', guide: '#c084fc' },
    amber:   { red: '#f59e0b', redDeep: '#d97706', accent: '#fbbf24', btn: '#d97706', guide: '#fcd34d' }
  };

  const Extras = {
    init() {
      this.setupToastContainer();
      this.setupMotionToggle();
      this.setupAccentSwitcher();
      this.setupCvLinks();
      this.setupQuickBrief();
      this.setupEmailCopy();
      this.setupClock();
      this.setupCommandPalette();
      this.setupKeyboardShortcuts();
      this.setupRolodexHeadings();
    },

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
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastEl.classList.remove('is-show');
      }, 2400);
    },

    setupToastContainer() {
      if (!document.getElementById('toast')) {
        const t = document.createElement('div');
        t.id = 'toast';
        t.className = 'toast';
        document.body.appendChild(t);
      }
    },

    setupMotionToggle() {
      const btn = document.getElementById('motionToggle');
      if (!btn) return;

      const updateUI = (isOff) => {
        btn.setAttribute('aria-pressed', isOff ? 'true' : 'false');
        const txt = btn.querySelector('[data-layer="text"]') || btn.querySelector('span:last-child');
        if (txt) txt.textContent = isOff ? 'Motion on' : 'Motion off';
      };

      const isCurrentOff = document.documentElement.getAttribute('data-motion') === 'off';
      updateUI(isCurrentOff);

      btn.addEventListener('click', () => {
        const isOff = document.documentElement.getAttribute('data-motion') === 'off';
        if (isOff) {
          document.documentElement.removeAttribute('data-motion');
          localStorage.setItem('motion', 'on');
          updateUI(false);
          this.toast('Motion on — reload to replay the intro');
        } else {
          document.documentElement.setAttribute('data-motion', 'off');
          localStorage.setItem('motion', 'off');
          updateUI(true);
          if (window.Swarm && window.Swarm.state !== 'live') {
            window.Swarm.abort();
          }
          this.toast('Motion off');
        }
      });
    },

    setupAccentSwitcher() {
      const dots = document.querySelectorAll('.accent-dot');
      const hexMap = {
        '#ff3b30': 'crimson',
        '#3b82ff': 'blue',
        '#8b5cf6': 'violet',
        '#ffb020': 'amber'
      };

      const applyAccent = (val) => {
        const key = hexMap[val] || val || 'crimson';
        const p = ACCENT_PRESETS[key] || ACCENT_PRESETS.crimson;
        const root = document.documentElement;
        root.style.setProperty('--red', p.red);
        root.style.setProperty('--red-deep', p.redDeep);
        root.style.setProperty('--accent', p.accent);
        root.style.setProperty('--btn', p.btn);
        root.style.setProperty('--guide', p.guide);
        localStorage.setItem('accent', val);

        dots.forEach(d => {
          const acc = d.getAttribute('data-accent');
          d.classList.toggle('is-active', acc === val || hexMap[acc] === key);
        });
      };

      dots.forEach(d => {
        d.addEventListener('click', () => {
          const acc = d.getAttribute('data-accent');
          applyAccent(acc);
        });
      });

      const saved = localStorage.getItem('accent') || '#ff3b30';
      applyAccent(saved);
    },

    setupCvLinks() {
      const links = document.querySelectorAll('#cvLink, #resumeLink, a[href$=".pdf"]');
      links.forEach(l => {
        l.addEventListener('click', (e) => {
          e.preventDefault();
          this.toast('CV coming soon');
        });
      });
    },

    setupQuickBrief() {
      const form = document.getElementById('briefForm') || document.querySelector('.brief');
      const input = document.getElementById('briefInput') || document.querySelector('.brief input');
      const sendBtn = document.getElementById('briefSend') || document.querySelector('.brief__send');

      const submit = () => {
        const val = input ? input.value.trim() : '';
        const msg = encodeURIComponent(`${CONTENT.meta.waMessage}${val}`);
        const url = `https://wa.me/${CONTENT.meta.whatsapp}?text=${msg}`;
        window.open(url, '_blank', 'noopener');
      };

      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submit();
          }
        });
      }
      if (sendBtn) {
        sendBtn.addEventListener('click', (e) => {
          e.preventDefault();
          submit();
        });
      }

      const posterBtn = document.querySelector('.poster__btn');
      if (posterBtn) {
        posterBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const brief = document.getElementById('brief');
          if (brief) brief.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (input) setTimeout(() => input.focus(), 350);
        });
      }
    },

    setupEmailCopy() {
      const emailRow = document.getElementById('emailRow') || document.querySelector('a[href^="mailto:"]');
      if (emailRow) {
        emailRow.addEventListener('click', (e) => {
          if (e.ctrlKey || e.metaKey || e.button === 1) return;
          e.preventDefault();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(CONTENT.meta.email).then(() => {
              this.toast('Email copied ✓');
            }).catch(() => {
              location.href = `mailto:${CONTENT.meta.email}`;
            });
          } else {
            location.href = `mailto:${CONTENT.meta.email}`;
          }
        });
      }
    },

    setupClock() {
      const clockEl = document.getElementById('clock');
      const update = () => {
        if (!clockEl) return;
        try {
          const now = new Date();
          const fmt = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).format(now);
          clockEl.textContent = `Bengaluru · ${fmt} IST`;
        } catch (e) {
          clockEl.textContent = 'Bengaluru · 17:04 IST';
        }
      };
      update();
      setInterval(update, 30000);
    },

    setupCommandPalette() {
      const palette = document.getElementById('palette');
      if (!palette) return;

      palette.innerHTML = `
        <div class="palette__box" role="dialog" aria-modal="true" aria-label="Command palette">
          <div class="palette__header">
            <span class="palette__prompt">&gt;</span>
            <input class="palette__input" type="text" placeholder="Type a command or jump to..." autofocus autocomplete="off">
          </div>
          <ul class="palette__list"></ul>
          <div class="palette__footer">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
        </div>
      `;

      const input = palette.querySelector('.palette__input');
      const list = palette.querySelector('.palette__list');

      const actions = [
        { label: 'Open Developer Terminal (~)', sub: 'Shell', run: () => window.Terminal && Terminal.open() },
        { label: 'Terminal: cat resume', sub: 'Shell', run: () => { window.Terminal && Terminal.open(); setTimeout(() => Terminal.execute('cat resume'), 120); } },
        { label: 'Terminal: skills matrix', sub: 'Shell', run: () => { window.Terminal && Terminal.open(); setTimeout(() => Terminal.execute('skills'), 120); } },
        { label: 'Terminal: projects directory', sub: 'Shell', run: () => { window.Terminal && Terminal.open(); setTimeout(() => Terminal.execute('projects'), 120); } },
        { label: 'Toggle UI Sound FX', sub: 'Audio', run: () => window.SoundFX && SoundFX.toggle() },
        { label: 'Jump to Hero', sub: 'Section', run: () => window.Scroll && Scroll.to('#home') },
        { label: 'Jump to Selected Work', sub: 'Section', run: () => window.Scroll && Scroll.to('#work') },
        { label: 'Jump to Proof of Work', sub: 'Section', run: () => window.Scroll && Scroll.to('#proof') },
        { label: 'Jump to From Sketch to Shipped', sub: 'Section', run: () => window.Scroll && Scroll.to('#raw') },
        { label: 'Jump to Behind the Code', sub: 'Section', run: () => window.Scroll && Scroll.to('#about') },
        { label: 'Jump to The Journey', sub: 'Section', run: () => window.Scroll && Scroll.to('#journey') },
        { label: 'Jump to Contact', sub: 'Section', run: () => window.Scroll && Scroll.to('#contact') },
        { label: 'Open GitHub Profile', sub: 'Link', run: () => window.open(CONTENT.meta.links.github, '_blank', 'noopener') },
        { label: 'Open Hugging Face', sub: 'Link', run: () => window.open(CONTENT.meta.links.huggingface, '_blank', 'noopener') },
        { label: 'Open Ollama Library', sub: 'Link', run: () => window.open(CONTENT.meta.links.ollama, '_blank', 'noopener') },
        { label: 'Open Instagram', sub: 'Link', run: () => window.open(CONTENT.meta.links.instagram, '_blank', 'noopener') },
        { label: 'Open LinkedIn', sub: 'Link', run: () => window.open(CONTENT.meta.links.linkedin, '_blank', 'noopener') },
        { label: 'Open X (Twitter)', sub: 'Link', run: () => window.open(CONTENT.meta.links.x, '_blank', 'noopener') },
        { label: 'Copy Email Address', sub: 'Action', run: () => { navigator.clipboard.writeText(CONTENT.meta.email); Extras.toast('Email copied ✓'); } },
        { label: 'Save Contact (.vcf)', sub: 'Action', run: () => window.Polish && Polish.vcard() },
        { label: 'Download CV', sub: 'Action', run: () => Extras.toast('CV coming soon') },
        { label: 'Replay Agent Swarm Rebuild', sub: 'Action', run: () => window.PortfolioBoot && PortfolioBoot.replay() },
        { label: 'Switch Accent: Crimson', sub: 'Theme', run: () => this.switchAccent('crimson') },
        { label: 'Switch Accent: Electric Blue', sub: 'Theme', run: () => this.switchAccent('blue') },
        { label: 'Switch Accent: Violet', sub: 'Theme', run: () => this.switchAccent('violet') },
        { label: 'Switch Accent: Amber', sub: 'Theme', run: () => this.switchAccent('amber') }
      ];

      // Add projects
      CONTENT.projects.forEach(p => {
        actions.push({
          label: `Project: ${p.title}`,
          sub: p.stack,
          run: () => {
            window.Scroll && Scroll.to('#work');
            setTimeout(() => window.Work && Work.open(p.slug), 100);
          }
        });
      });

      let selectedIndex = 0;
      let filteredActions = [...actions];

      const renderList = () => {
        list.innerHTML = filteredActions.map((a, i) => `
          <li class="palette__item${i === selectedIndex ? ' is-active' : ''}" data-idx="${i}">
            <span>${Render.esc(a.label)}</span>
            <span class="palette__item-sub">${Render.esc(a.sub)}</span>
          </li>
        `).join('');

        list.querySelectorAll('.palette__item').forEach(item => {
          item.addEventListener('click', () => {
            const idx = +item.getAttribute('data-idx');
            if (filteredActions[idx]) {
              filteredActions[idx].run();
              close();
            }
          });
        });
      };

      const open = () => {
        palette.classList.add('is-open');
        palette.setAttribute('aria-hidden', 'false');
        input.value = '';
        filteredActions = [...actions];
        selectedIndex = 0;
        renderList();
        input.focus();
      };

      const close = () => {
        palette.classList.remove('is-open');
        palette.setAttribute('aria-hidden', 'true');
      };

      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        filteredActions = actions.filter(a =>
          a.label.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q)
        );
        selectedIndex = 0;
        renderList();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % Math.max(1, filteredActions.length);
          renderList();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = (selectedIndex - 1 + filteredActions.length) % Math.max(1, filteredActions.length);
          renderList();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredActions[selectedIndex]) {
            filteredActions[selectedIndex].run();
            close();
          }
        } else if (e.key === 'Escape') {
          close();
        }
      });

      palette.addEventListener('click', (e) => {
        if (e.target === palette) close();
      });

      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          palette.classList.contains('is-open') ? close() : open();
        } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          open();
        }
      });
    },

    switchAccent(name) {
      const i = Object.keys(ACCENT_PRESETS).indexOf(name);
      const dots = document.querySelectorAll('.accent-dot');
      if (i >= 0 && dots[i]) dots[i].click();
    },

    setupKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
          if (window.PortfolioBoot) PortfolioBoot.replay();
        }
      });

      const replayBtn = document.getElementById('replayBtn');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          if (window.PortfolioBoot) PortfolioBoot.replay();
        });
      }

      // Konami code: Up Up Down Down Left Right Left Right B A
      const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      let kIdx = 0;
      window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === konami[kIdx].toLowerCase()) {
          kIdx++;
          if (kIdx === konami.length) {
            kIdx = 0;
            Extras.toast('Swarm Orbit Activated! 🛸');
          }
        } else {
          kIdx = 0;
        }
      });
    },

    setupRolodexHeadings() {
      const sel = '.h-display .line, .h-bold, .poster__title .line, .hero__role .line, .link-all span:first-child';
      const sync = () => {
        document.querySelectorAll(sel).forEach(el => {
          const txt = el.textContent.trim();
          if (txt && el.getAttribute('data-text') !== txt) {
            el.setAttribute('data-text', txt);
          }
        });
      };
      sync();
      document.addEventListener('swarm:done', sync);
      window.addEventListener('load', sync);
      document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(sel);
        if (target && !target.getAttribute('data-text')) {
          target.setAttribute('data-text', target.textContent.trim());
        }
      });
    },

    afterIntro(how) {
      this.setupRolodexHeadings();
      this.fetchLiveStats();
      this.setupIdleCompanions();
    },

    fetchLiveStats() {
      // Live GitHub public_repos
      fetch('https://api.github.com/users/moheith')
        .then(r => r.json())
        .then(data => {
          if (data && typeof data.public_repos === 'number') {
            const el = document.querySelector('.hl[href*="github"] .hl__val');
            if (el && window.Hero) Hero.countUp(el, data.public_repos);
          }
        }).catch(() => {});

      // Live Hugging Face models
      fetch('https://huggingface.co/api/models?author=moheith')
        .then(r => r.json())
        .then(models => {
          if (Array.isArray(models)) {
            const el = document.querySelector('.hl[href*="huggingface"] .hl__val');
            if (el && window.Hero) Hero.countUp(el, models.length);
          }
        }).catch(() => {});
    },

    /* idle companions removed on purpose: cursors standing around the pointer looked messy */
    setupIdleCompanions() {}
  };

  window.Extras = Extras;
})();
