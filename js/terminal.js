/* js/terminal.js — Interactive Developer Terminal & Shell
   Provides an authentic zsh-style developer CLI for recruiters and engineers.
   Zero forbidden words. Full keyboard navigation, command history, and Web Audio integration. */
(() => {
  'use strict';
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const COMMANDS = {
    help: {
      desc: 'List all available shell commands',
      exec: () => `
<div class="term__table">
  <div class="term__row"><span class="term__cmd">whoami</span><span class="term__desc">Biographical overview, location, and credentials</span></div>
  <div class="term__row"><span class="term__cmd">skills</span><span class="term__desc">Categorical technical matrix (AI, Full Stack, Systems)</span></div>
  <div class="term__row"><span class="term__cmd">projects</span><span class="term__desc">Directory of all 11 shipped software & AI products</span></div>
  <div class="term__row"><span class="term__cmd">project &lt;slug&gt;</span><span class="term__desc">Deep architecture breakdown (e.g. 'project yulya')</span></div>
  <div class="term__row"><span class="term__cmd">cat resume</span><span class="term__desc">Print formatted technical CV / résumé</span></div>
  <div class="term__row"><span class="term__cmd">architecture</span><span class="term__desc">How this portfolio was engineered (Swarm, 0 CDN, WebGL2)</span></div>
  <div class="term__row"><span class="term__cmd">contact</span><span class="term__desc">Direct channels (Email, WhatsApp, GitHub, LinkedIn, X)</span></div>
  <div class="term__row"><span class="term__cmd">email</span><span class="term__desc">Copy primary email address to clipboard</span></div>
  <div class="term__row"><span class="term__cmd">vcard</span><span class="term__desc">Save contact card (.vcf) directly to device</span></div>
  <div class="term__row"><span class="term__cmd">sound [on|off]</span><span class="term__desc">Mute or unmute the site sound (always on by default)</span></div>
  <div class="term__row"><span class="term__cmd">theme &lt;name&gt;</span><span class="term__desc">Switch accent: crimson | blue | violet | amber</span></div>
  <div class="term__row"><span class="term__cmd">clear</span><span class="term__desc">Clear terminal display history</span></div>
  <div class="term__row"><span class="term__cmd">exit</span><span class="term__desc">Close the developer terminal</span></div>
</div>
<div class="term__tip">Tip: Press Tab to autocomplete. Use ↑/↓ for command history. Press ~ or Esc to toggle.</div>`
    },

    whoami: {
      desc: 'Display biographical dossier',
      exec: () => `
<div class="term__box">
  <div class="term__title">MOHIETH MAYURA S Y</div>
  <div class="term__meta">Full Stack Developer & Systems Designer — Bengaluru, India (UTC+05:30)</div>
  <p>Creative engineer specializing in production-grade AI applications, full-stack systems, WebRTC real-time voice pipelines, and interactive UI/UX.</p>
  <p>Creator of <strong>Yulya</strong> (Discord AI Companion & Ecosystem with 259+ pulls on Ollama), <strong>Yulya Studio</strong> (in-browser AI game studio), and <strong>Learnexa 2.0</strong>.</p>
  <div class="term__status">● STATUS: Open for high-impact software engineering roles & technical contracts.</div>
</div>`
    },

    skills: {
      desc: 'Print technical skills matrix',
      exec: () => `
<div class="term__section">
  <div class="term__sec-title">CORE TECHNICAL MATRIX</div>
  <div class="term__grid">
    <div class="term__group">
      <div class="term__grp-h">[ LANGUAGES ]</div>
      <div>Python, TypeScript, JavaScript (ESNext), GLSL Shaders, SQL, HTML5, CSS3/PostCSS</div>
    </div>
    <div class="term__group">
      <div class="term__grp-h">[ AI & REAL-TIME ]</div>
      <div>Gemini Live, WebRTC Audio, Hugging Face Transformers, Ollama Local Fine-Tuning, PyTorch</div>
    </div>
    <div class="term__group">
      <div class="term__grp-h">[ BACKEND SYSTEMS ]</div>
      <div>FastAPI, Flask, Node.js, WebSockets, MongoDB, SQLite, MySQL, REST APIs, Microservices</div>
    </div>
    <div class="term__group">
      <div class="term__grp-h">[ FRONTEND & 3D ]</div>
      <div>React, Next.js, Vite, Three.js, WebGL2, GSAP Motion, PBR Shaders, Lenis Smooth Scroll</div>
    </div>
    <div class="term__group">
      <div class="term__grp-h">[ CREATIVE & TOOLS ]</div>
      <div>Blender (3D Modeling & Rigging), Krita, Live2D, Design Systems, Typography, Git</div>
    </div>
  </div>
</div>`
    },

    projects: {
      desc: 'Directory of all 11 shipped projects',
      exec: () => `
<div class="term__table">
  <div class="term__row"><strong>01. YULYA</strong> <span>Discord AI Companion · WebRTC voice, persistent memory, crypto economy</span></div>
  <div class="term__row"><strong>02. YULYA STUDIO</strong> <span>AI Game Studio · In-browser code, sandboxed execution, remix gallery</span></div>
  <div class="term__row"><strong>03. LEARNEXA 2.0</strong> <span>Student Skill Exchange · Vector TF-IDF recommendation engine</span></div>
  <div class="term__row"><strong>04. YULYA MODELS</strong> <span>Open Source AI · 8 fine-tuned LLMs on Hugging Face & Ollama</span></div>
  <div class="term__row"><strong>05. DESKTOP COMPANION</strong> <span>Utility · Transparent HUD assistant with conversational memory</span></div>
  <div class="term__row"><strong>06. YULYA LANDING</strong> <span>Creative Web · Responsive Swiss-style brutalist landing experience</span></div>
  <div class="term__row"><strong>07. MASCOT 3D SHOWCASE</strong> <span>Three.js / WebGL2 · Interactive 3D asset viewer with lighting rigs</span></div>
  <div class="term__row"><strong>08. TEXTLINK</strong> <span>Serverless Tool · Zero-database text-to-URL state serializer</span></div>
  <div class="term__row"><strong>09. YULYA API</strong> <span>Microservice · High-throughput FastAPI vector embedding pipeline</span></div>
  <div class="term__row"><strong>10. GRAPHIC WORKS</strong> <span>Visual Systems · Swiss brutalist typography, posters & branding</span></div>
  <div class="term__row"><strong>11. BRAND SYSTEMS</strong> <span>Identity Systems · Design language, tokens, and geometric identity</span></div>
</div>
<div class="term__tip">Type 'project &lt;slug&gt;' (e.g. 'project yulya' or 'project studio') for architecture specs.</div>`
    },

    architecture: {
      desc: 'Portfolio architecture breakdown',
      exec: () => `
<div class="term__box">
  <div class="term__title">PORTFOLIO SYSTEM ARCHITECTURE (V3 GOD-LEVEL)</div>
  <p>• <strong>Autonomous 30-Agent Swarm:</strong> Procedural multi-agent engine that physically claims, measures, and constructs all 376 DOM layers in real time.</p>
  <p>• <strong>Monotonic Camera Controller:</strong> Strictly forward-advancing viewport tracking prevents scroll drift or jitter.</p>
  <p>• <strong>100% Self-Hosted:</strong> Zero external CDNs. All WOFF2 typography, tech SVGs, and vendor bundles served locally from edge cache.</p>
  <p>• <strong>Deep Semantic Fallbacks:</strong> Full non-JS noscript catalog, 19 indexed deep links, and Schema.org Knowledge Graph.</p>
  <p>• <strong>Multi-Resolution Favicon System:</strong> Binary 16/32/48 ICO + PNG standards compliant with Google Search specifications.</p>
</div>`
    },

    resume: {
      desc: 'Print technical résumé',
      exec: () => COMMANDS['cat resume'].exec()
    },

    'cat resume': {
      desc: 'Print formatted technical résumé',
      exec: () => `
<div class="term__resume">
  <div class="term__resume-h">MOHIETH MAYURA S Y — TECHNICAL RÉSUMÉ</div>
  <div class="term__resume-sub">Bengaluru, Karnataka, India | mohiethmayura@gmail.com | https://moheith.tech</div>
  <hr class="term__divider">
  <div class="term__resume-sec">
    <strong>PROFESSIONAL PROFILE</strong>
    <p>Creative Technologist, Full Stack Software Engineer, and Systems Designer with 4+ years of hands-on experience designing, architecting, and deploying production AI integrations, web architectures, and real-time voice pipelines.</p>
  </div>
  <div class="term__resume-sec">
    <strong>KEY SHIPPED PRODUCTS</strong>
    <p>• <strong>Yulya (Discord AI Companion & Ecosystem):</strong> Engineered real-time WebRTC audio voice system, multi-persona neural memory, and simulated in-server crypto economy serving thousands of community messages.</p>
    <p>• <strong>Yulya Studio:</strong> Architected browser-based game engine utilizing React, TypeScript, and FastAPI with in-browser sandboxed simulation and public remix gallery.</p>
    <p>• <strong>Learnexa 2.0:</strong> Implemented TF-IDF mathematical vector recommendation algorithms in Flask and Next.js for peer skill discovery.</p>
    <p>• <strong>Yulya Language Models:</strong> Fine-tuned 8 conversational models across Qwen2.5 and Llama 3.x architectures published on Hugging Face and Ollama with 259+ pulls.</p>
  </div>
  <div class="term__resume-sec">
    <strong>EDUCATION</strong>
    <p>• Seshadripuram First Grade College (SFGC) — Bengaluru, Karnataka, India</p>
  </div>
  <div class="term__resume-sec">
    <strong>CONTACT & CHANNELS</strong>
    <p>• GitHub: https://github.com/moheith | LinkedIn: https://linkedin.com/in/mohieth | Web: https://moheith.tech</p>
  </div>
</div>`
    },

    contact: {
      desc: 'Display contact communication channels',
      exec: () => `
<div class="term__box">
  <div class="term__title">GET IN TOUCH</div>
  <p>• <strong>Email:</strong> <a href="mailto:mohiethmayura@gmail.com" class="term__link">mohiethmayura@gmail.com</a></p>
  <p>• <strong>WhatsApp:</strong> <a href="https://wa.me/918660227877" target="_blank" rel="noopener" class="term__link">+91 86602 27877</a></p>
  <p>• <strong>GitHub:</strong> <a href="https://github.com/moheith" target="_blank" rel="noopener" class="term__link">github.com/moheith</a></p>
  <p>• <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/mohieth" target="_blank" rel="noopener" class="term__link">linkedin.com/in/mohieth</a></p>
  <p>• <strong>X (Twitter):</strong> <a href="https://x.com/mohiethh" target="_blank" rel="noopener" class="term__link">x.com/mohiethh</a></p>
  <div class="term__tip">Type 'email' to copy address or 'vcard' to save full contact card.</div>
</div>`
    },

    email: {
      desc: 'Copy email address to clipboard',
      exec: () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText('mohiethmayura@gmail.com').catch(() => {});
        }
        if (window.Extras && Extras.toast) Extras.toast('Email copied ✓');
        return '<span class="term__success">✓ Email address copied to clipboard: mohiethmayura@gmail.com</span>';
      }
    },

    vcard: {
      desc: 'Download contact vCard (.vcf)',
      exec: () => {
        if (window.Polish && Polish.vcard) {
          Polish.vcard();
          return '<span class="term__success">✓ Generating and downloading mohieth-mayura.vcf ...</span>';
        }
        return '<span class="term__err">vCard generator unavailable.</span>';
      }
    },

    sound: {
      desc: 'Mute or unmute all site sound (sound off / sound on)',
      exec: (args) => {
        if (!window.SoundFX) return 'Sound module loading...';
        const arg = (args[0] || '').toLowerCase();
        if (arg === 'on') {
          SoundFX.enable();
          return '<span class="term__success">✓ Audio Engine: ACTIVE</span>';
        } else if (arg === 'off') {
          SoundFX.disable();
          return '<span class="term__success">✓ Audio Engine: MUTED</span>';
        }
        SoundFX.toggle();
        return `<span class="term__success">✓ Audio Engine: ${SoundFX.isEnabled() ? 'ACTIVE' : 'MUTED'}</span>`;
      }
    },

    theme: {
      desc: 'Switch theme accent (theme crimson | blue | violet | amber)',
      exec: (args) => {
        const theme = (args[0] || '').toLowerCase();
        const valid = ['crimson', 'blue', 'violet', 'amber'];
        if (!valid.includes(theme)) {
          return `<span class="term__err">Unknown theme '${esc(theme)}'. Valid choices: crimson, blue, violet, amber.</span>`;
        }
        if (window.Extras && Extras.switchAccent) {
          Extras.switchAccent(theme);
          return `<span class="term__success">✓ Accent theme switched to ${theme.toUpperCase()}</span>`;
        }
        return `<span class="term__err">Theme switcher unavailable</span>`;
      }
    },

    clear: {
      desc: 'Clear terminal screen',
      exec: () => null
    },

    exit: {
      desc: 'Close developer terminal',
      exec: () => {
        setTimeout(() => Terminal.close(), 150);
        return 'Closing terminal session...';
      }
    },

    // Easter eggs
    sudo: {
      desc: 'Administrative privileges',
      exec: () => '<span class="term__err">Permission denied: user \'guest\' is not in the sudoers file. This incident will be reported to Mayura.</span>'
    },

    ls: {
      desc: 'List directory contents',
      exec: () => '<div class="term__files">index.html  css/  js/  assets/  sitemap.xml  robots.txt  llms.txt  manifest.webmanifest</div>'
    },

    pwd: {
      desc: 'Print working directory',
      exec: () => '/home/mayura/projects/portfolio'
    },

    date: {
      desc: 'Display current timestamp in Bengaluru',
      exec: () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'long' }) + ' (IST)'
    },

    yulya: {
      desc: 'Inspect Yulya core telemetry',
      exec: () => `
<div class="term__box">
  <div class="term__title">YULYA ECOSYSTEM TELEMETRY</div>
  <p>• Status: OPERATIONAL · Live at https://discord.yulya.me</p>
  <p>• Models: 8 conversational fine-tunes published on Hugging Face & Ollama (259+ pulls)</p>
  <p>• Voice Pipeline: WebRTC full-duplex low-latency audio stream</p>
  <p>• Vision: Multimodal document and video processing engine</p>
</div>`
    }
  };

  // Dedicated project architecture lookups
  function getProjectDetail(slug) {
    if (!slug) return COMMANDS.projects.exec();
    const clean = slug.toLowerCase().trim();
    const p = (window.CONTENT && CONTENT.projects) ? CONTENT.projects.find(x => x.slug === clean || x.title.toLowerCase().includes(clean)) : null;
    if (!p) {
      return `<span class="term__err">Project '${esc(slug)}' not found. Type 'projects' for the full list.</span>`;
    }
    return `
<div class="term__box">
  <div class="term__title">${p.title}</div>
  <div class="term__meta">Category: ${p.category} | Year: ${p.year}</div>
  <p><strong>Stack:</strong> ${p.stack}</p>
  <p><strong>Overview:</strong> ${p.summary || p.subtitle || ''}</p>
  <p><strong>Description:</strong> ${p.desc || ''}</p>
  <div class="term__links">
    ${p.href ? `<a href="${p.href}" target="_blank" rel="noopener" class="term__link">Live URL ↗</a>` : ''}
    ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener" class="term__link">GitHub Repo ↗</a>` : ''}
  </div>
</div>`;
  }

  const Terminal = {
    isOpen: false,
    history: [],
    historyIndex: -1,

    init() {
      this.injectTerminalDOM();
      this.bindEvents();
      window.Terminal = this;
    },

    injectTerminalDOM() {
      if (document.getElementById('terminalDrawer')) return;

      const div = document.createElement('div');
      div.id = 'terminalDrawer';
      div.className = 'terminal';
      div.setAttribute('aria-hidden', 'true');
      div.setAttribute('inert', '');
      div.style.display = 'none';
      div.setAttribute('role', 'dialog');
      div.setAttribute('aria-modal', 'true');
      div.setAttribute('aria-label', 'Interactive Developer Terminal');

      div.innerHTML = `
        <div class="term__window">
          <div class="term__header">
            <div class="term__dots">
              <button class="term__dot term__dot--close" type="button" aria-label="Close terminal" title="Close (Esc)"></button>
              <button class="term__dot term__dot--min" type="button" aria-label="Minimize terminal" title="Minimize"></button>
              <button class="term__dot term__dot--max" type="button" aria-label="Maximize terminal" title="Maximize"></button>
            </div>
            <div class="term__title-bar">
              <span class="term__icon">›_</span>
              <span class="term__headline">mayura@bengaluru: ~ (zsh)</span>
            </div>
            <div class="term__controls">
              <button class="term__btn" id="termClearBtn" type="button">Clear</button>
              <button class="term__btn term__btn--close" id="termCloseBtn" type="button">✕</button>
            </div>
          </div>
          <div class="term__body" id="termBody" data-lenis-prevent tabindex="-1">
            <div class="term__welcome">
              <div class="term__banner">MOHIETH MAYURA S Y — TERMINAL SHELL v2.6.0</div>
              <div class="term__subbanner">Full-stack software developer & systems designer from Bengaluru, India.</div>
              <div class="term__hint">Type <span class="term__highlight">'help'</span> for all commands, <span class="term__highlight">'skills'</span> for tech stack, or <span class="term__highlight">'cat resume'</span> for CV.</div>
            </div>
            <div class="term__output" id="termOutput"></div>
            <form class="term__prompt-line" id="termForm" autocomplete="off">
              <span class="term__prompt-user">mayura@bengaluru</span><span class="term__prompt-sep">:</span><span class="term__prompt-dir">~</span><span class="term__prompt-sym">$</span>
              <input class="term__input" id="termInput" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Terminal command input" />
            </form>
          </div>
        </div>
      `;

      document.body.appendChild(div);
    },

    open() {
      const el = document.getElementById('terminalDrawer');
      if (!el || this.isOpen) return;
      if (document.documentElement.classList.contains('is-building')) return;   // never over the swarm intro
      this.lastFocus = document.activeElement;
      this.isOpen = true;
      if (window.Scroll && Scroll.stop) Scroll.stop();
      document.documentElement.classList.add('term-open');
      el.style.display = '';
      void el.offsetWidth;
      el.classList.add('is-open');
      el.removeAttribute('inert');
      el.setAttribute('aria-hidden', 'false');

      const input = document.getElementById('termInput');
      if (input) {
        setTimeout(() => input.focus(), 80);
      }

      if (window.SoundFX) SoundFX.playModalOpen();
      this.scrollToBottom();
    },

    close() {
      const el = document.getElementById('terminalDrawer');
      if (!el) return;
      if (!this.isOpen) return;
      this.isOpen = false;
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('inert', '');
      el.classList.remove('is-max');
      clearTimeout(this._hideT); this._hideT = setTimeout(() => { if (!this.isOpen) el.style.display = 'none'; }, 320);
      document.documentElement.classList.remove('term-open');
      if (window.Scroll && Scroll.start && !document.documentElement.classList.contains('is-building')) Scroll.start();
      if (this.lastFocus && this.lastFocus.focus && document.contains(this.lastFocus)) this.lastFocus.focus({ preventScroll: true });
      if (window.SoundFX) SoundFX.playModalClose();
    },

    toggle() {
      this.isOpen ? this.close() : this.open();
    },

    clear() {
      const out = document.getElementById('termOutput');
      if (out) out.innerHTML = '';
      if (window.SoundFX) SoundFX.playConfirm();
    },

    scrollToBottom() {
      const body = document.getElementById('termBody');
      if (body) {
        body.scrollTop = body.scrollHeight;
      }
    },

    execute(cmdRaw) {
      const trimmed = (cmdRaw || '').trim();
      if (!trimmed) return;

      // Add to command history
      this.history.push(trimmed);
      this.historyIndex = this.history.length;

      const parts = trimmed.split(/\s+/);
      const root = parts[0].toLowerCase();
      const args = parts.slice(1);

      const out = document.getElementById('termOutput');
      if (!out) return;

      // Print prompt echo
      const entry = document.createElement('div');
      entry.className = 'term__entry';
      entry.innerHTML = `<div class="term__echo"><span class="term__echo-user">mayura@bengaluru</span>:<span class="term__echo-dir">~</span>$ <span class="term__echo-cmd">${esc(trimmed)}</span></div>`;

      // Clear special case
      if (root === 'clear') {
        out.innerHTML = '';
        return;
      }

      let responseHTML = '';
      const fullTwoWord = parts.slice(0, 2).join(' ').toLowerCase();

      if (root === 'project') {
        responseHTML = getProjectDetail(args[0]);
        if (window.SoundFX) SoundFX.playConfirm();
      } else if (COMMANDS[fullTwoWord]) {
        responseHTML = COMMANDS[fullTwoWord].exec(parts.slice(2));
        if (window.SoundFX) SoundFX.playConfirm();
      } else if (COMMANDS[root]) {
        responseHTML = COMMANDS[root].exec(args);
        if (responseHTML && window.SoundFX) SoundFX.playConfirm();
      } else {
        responseHTML = `<div class="term__err">zsh: command not found: ${esc(root)}. Type 'help' for available commands.</div>`;
        if (window.SoundFX) SoundFX.playError();
      }

      if (responseHTML) {
        const resDiv = document.createElement('div');
        resDiv.className = 'term__result';
        resDiv.innerHTML = responseHTML;
        entry.appendChild(resDiv);
      }

      out.appendChild(entry);
      this.scrollToBottom();
    },

    bindEvents() {
      const form = document.getElementById('termForm');
      const input = document.getElementById('termInput');
      const closeBtn = document.getElementById('termCloseBtn');
      const clearBtn = document.getElementById('termClearBtn');
      const closeDot = document.querySelector('.term__dot--close');
      const drawer = document.getElementById('terminalDrawer');

      if (form && input) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = input.value;
          input.value = '';
          this.execute(val);
        });

        input.addEventListener('keydown', (e) => {
          if (window.SoundFX && e.key.length === 1) {
            SoundFX.playKey();
          }

          // History navigation
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.history.length === 0) return;
            if (this.historyIndex > 0) {
              this.historyIndex--;
              input.value = this.history[this.historyIndex] || '';
            }
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
              this.historyIndex++;
              input.value = this.history[this.historyIndex] || '';
            } else {
              this.historyIndex = this.history.length;
              input.value = '';
            }
          } else if (e.key === 'Tab') {
            e.preventDefault();
            // Autocomplete commands
            const current = input.value.trim().toLowerCase();
            if (!current) return;
            const match = Object.keys(COMMANDS).find(c => c.startsWith(current));
            if (match) {
              input.value = match + (match === 'project' ? ' ' : '');
            }
          }
        });
      }

      const termToggle = document.getElementById('termToggle');
      if (termToggle) termToggle.addEventListener('click', () => this.toggle());
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (closeDot) closeDot.addEventListener('click', () => this.close());
      const minDot = document.querySelector('.term__dot--min'), maxDot = document.querySelector('.term__dot--max');
      if (minDot) minDot.addEventListener('click', () => this.close());
      if (maxDot) maxDot.addEventListener('click', () => { drawer.classList.toggle('is-max'); if (window.SoundFX) SoundFX.playTab(); });
      const bodyEl = document.getElementById('termBody');
      if (bodyEl && input) bodyEl.addEventListener('click', () => { if (!String(window.getSelection && window.getSelection()).length) input.focus({ preventScroll: true }); });
      if (drawer) drawer.addEventListener('wheel', (e) => { if (!e.target.closest('#termBody')) e.preventDefault(); }, { passive: false });
      if (clearBtn) clearBtn.addEventListener('click', () => this.clear());

      // Click outside terminal window closes it
      if (drawer) {
        drawer.addEventListener('click', (e) => {
          if (e.target === drawer) this.close();
        });
      }

      // Global shortcut: Backtick / Tilde opens terminal when not typing
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          const pal = document.getElementById('palette');
          if (e.defaultPrevented || (pal && pal.classList.contains('is-open'))) return;
          e.preventDefault();
          this.close();
        } else if (e.key === 'Tab' && this.isOpen) {
          const f = [...drawer.querySelectorAll('button, input')].filter((x) => x.offsetParent !== null);
          if (!f.length) return;
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        } else if ((e.key === '`' || e.key === '~') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          this.toggle();
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Terminal.init());
  } else {
    Terminal.init();
  }
})();
