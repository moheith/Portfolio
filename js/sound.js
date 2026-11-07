/* js/sound.js — High-tech procedural Web Audio UI synthesizer (Zero external audio files)
   Clean, subtle micro-haptics for button clicks, hovers, tab switches, modals, and slider moves.
   Default: Muted (opt-in via nav button or command palette). State persists in localStorage. */
(() => {
  'use strict';

  let ctx = null;
  let isEnabled = false;
  let lastHoverTime = 0;

  function getAudioContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  const SoundFX = {
    init() {
      try {
        const stored = localStorage.getItem('ui_sound');
        isEnabled = stored === 'on';
      } catch (e) {
        isEnabled = false;
      }

      this.updateNavUI();
      this.attachGlobalListeners();

      // Expose globally
      window.SoundFX = this;
    },

    isEnabled() {
      return isEnabled;
    },

    enable() {
      isEnabled = true;
      try { localStorage.setItem('ui_sound', 'on'); } catch (e) {}
      getAudioContext();
      this.updateNavUI();
      this.playConfirm();
      if (window.Extras && Extras.toast) {
        Extras.toast('Audio Engine: Active 🔊');
      }
      window.dispatchEvent(new CustomEvent('sound:change', { detail: { enabled: true } }));
    },

    disable() {
      isEnabled = false;
      try { localStorage.setItem('ui_sound', 'off'); } catch (e) {}
      this.updateNavUI();
      if (window.Extras && Extras.toast) {
        Extras.toast('Audio Engine: Muted 🔇');
      }
      window.dispatchEvent(new CustomEvent('sound:change', { detail: { enabled: false } }));
    },

    toggle() {
      if (isEnabled) {
        this.disable();
      } else {
        this.enable();
      }
    },

    updateNavUI() {
      const btn = document.getElementById('soundToggle');
      if (!btn) return;
      btn.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
      btn.classList.toggle('is-active', isEnabled);
      const icon = btn.querySelector('.nav__sound-icon');
      const text = btn.querySelector('.nav__sound-text');
      if (icon) icon.textContent = isEnabled ? '🔊' : '🔇';
      if (text) text.textContent = isEnabled ? 'Sound on' : 'Sound off';
    },

    // -------------------------------------------------------------
    // Procedural Synthesizers (Clean, subtle micro-frequencies)
    // -------------------------------------------------------------

    // Soft glass micro-tick for hovers (throttled to avoid sound clutter)
    playHover() {
      if (!isEnabled) return;
      const now = performance.now();
      if (now - lastHoverTime < 50) return;
      lastHoverTime = now;

      const c = getAudioContext();
      if (!c) return;

      const osc = c.createOscillator();
      const gain = c.createGain();
      const t = c.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.015);

      gain.gain.setValueAtTime(0.018, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(t);
      osc.stop(t + 0.018);
    },

    // Clean mechanical click for primary buttons & triggers
    playClick() {
      if (!isEnabled) return;
      const c = getAudioContext();
      if (!c) return;

      const osc = c.createOscillator();
      const gain = c.createGain();
      const t = c.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(1600, t + 0.025);

      gain.gain.setValueAtTime(0.035, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(t);
      osc.stop(t + 0.03);
    },

    // Harmonic pitch-shift for tab switches & filter buttons
    playTab() {
      if (!isEnabled) return;
      const c = getAudioContext();
      if (!c) return;

      const t = c.currentTime;
      [587.33, 880].forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.018);

        gain.gain.setValueAtTime(0.025, t + i * 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.018 + 0.04);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(t + i * 0.018);
        osc.stop(t + i * 0.018 + 0.045);
      });
    },

    // Deep sub-bass bloom for modal open
    playModalOpen() {
      if (!isEnabled) return;
      const c = getAudioContext();
      if (!c) return;

      const t = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(70, t);
      osc.frequency.exponentialRampToValueAtTime(190, t + 0.12);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    },

    // Descending tone for modal close
    playModalClose() {
      if (!isEnabled) return;
      const c = getAudioContext();
      if (!c) return;

      const t = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.08);

      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(t);
      osc.stop(t + 0.11);
    },

    // Analog gear click for compare slider
    playSlider(val) {
      if (!isEnabled) return;
      const c = getAudioContext();
      if (!c) return;

      const t = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();

      const freq = 600 + (val || 50) * 8;
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.012, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(t);
      osc.stop(t + 0.015);
    },

    // Keystroke tap for terminal typing
    playKey() {
      if (!isEnabled) return;
      const c = getAudioContext();
      if (!c) return;

      const t = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();

      const freq = 1200 + Math.random() * 300;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.015, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.008);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(t);
      osc.stop(t + 0.01);
    },

    // Cybernetic confirmation chime for terminal commands & actions
    playConfirm() {
      if (!isEnabled) return;
      const c = getAudioContext();
      if (!c) return;

      const t = c.currentTime;
      [659.25, 987.77, 1318.51].forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.035);

        gain.gain.setValueAtTime(0.03, t + i * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.035 + 0.08);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(t + i * 0.035);
        osc.stop(t + i * 0.035 + 0.09);
      });
    },

    // Soft error tone
    playError() {
      if (!isEnabled) return;
      const c = getAudioContext();
      if (!c) return;

      const t = c.currentTime;
      [220, 196].forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t + i * 0.04);

        gain.gain.setValueAtTime(0.02, t + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.04 + 0.06);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(t + i * 0.04);
        osc.stop(t + i * 0.04 + 0.07);
      });
    },

    // Attach delegated listeners to buttons, links, tabs, and sliders
    attachGlobalListeners() {
      // Click listeners
      document.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, .tab, .card, .accent-dot, .sbtn, .modal__pstep');
        if (!target) return;

        if (target.id === 'soundToggle') return; // Handled separately
        if (target.classList.contains('tab')) {
          this.playTab();
        } else if (target.classList.contains('card')) {
          this.playModalOpen();
        } else if (target.classList.contains('modal__close')) {
          this.playModalClose();
        } else {
          this.playClick();
        }
      });

      // Hover listeners (delegated)
      document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('button, a, .tab, .card, .accent-dot, .sbtn, .modal__pstep, .crow, .hl');
        if (target) {
          this.playHover();
        }
      });

      // Sound toggle button click
      const soundBtn = document.getElementById('soundToggle');
      if (soundBtn) {
        soundBtn.addEventListener('click', () => {
          this.toggle();
        });
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SoundFX.init());
  } else {
    SoundFX.init();
  }
})();
