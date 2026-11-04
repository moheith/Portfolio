/* js/scroll.js — Smooth Scrolling, GSAP ScrollTrigger, Scroll Spy, Playhead & Timecode, Mobile Drawer */

(function () {
  'use strict';

  let lenis = null;
  let isStopped = false;

  const Scroll = {
    lenis: null,

    init() {
      // Initialize Lenis smooth scroll if available
      if (typeof window.Lenis !== 'undefined') {
        try {
          lenis = new window.Lenis({
            lerp: 0.09,
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            autoResize: true,
          });
          this.lenis = lenis;

          // Sync with GSAP ScrollTrigger
          if (typeof window.ScrollTrigger !== 'undefined' && typeof window.gsap !== 'undefined') {
            lenis.on('scroll', window.ScrollTrigger.update);
            window.gsap.ticker.add((time) => {
              lenis.raf(time * 1000);
            });
            window.gsap.ticker.lagSmoothing(0);
          } else {
            const raf = (time) => {
              lenis.raf(time);
              requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
          }

          // Stop immediately as required by Part 10.1 (until swarm completes or skips)
          this.stop();
        } catch (e) {
          console.warn('[scroll] Lenis init failed, fallback to native scroll', e);
        }
      }

      this.initSpy();
      this.initPlayhead();
      this.initNav();
      this.initHash();
    },

    stop() {
      isStopped = true;
      if (lenis) {
        try { lenis.stop(); } catch (_) {}
      }
    },

    start() {
      isStopped = false;
      if (lenis) {
        try { lenis.start(); } catch (_) {}
      }
    },

    to(target, options = {}) {
      const offset = options.offset !== undefined ? options.offset : -64;
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;

      if (lenis && !isStopped) {
        lenis.scrollTo(el, { offset, duration: options.duration || 1.2 });
      } else {
        const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    },

    /* =====================================================================
       Scroll Spy + Sliding Nav Underline
    ===================================================================== */
    initSpy() {
      const navLinks = Array.from(document.querySelectorAll('.nav__links .nav__link'));
      const underline = document.querySelector('.nav__underline');
      const sections = ['home', 'work', 'highlights', 'about', 'journey', 'contact']
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (!sections.length || !navLinks.length) return;

      const updateUnderline = (activeLink) => {
        if (!underline || !activeLink) {
          if (underline) underline.style.width = '0px';
          return;
        }
        const left = activeLink.offsetLeft;
        const width = activeLink.offsetWidth;
        underline.style.transform = `translateX(${left}px)`;
        underline.style.width = `${width}px`;
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              navLinks.forEach((link) => {
                const href = link.getAttribute('href');
                const match = href === `#${id}`;
                link.classList.toggle('is-active', match);
                if (match) updateUnderline(link);
              });
            }
          });
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      sections.forEach((sec) => observer.observe(sec));

      // Initial underline placement
      const currentActive = document.querySelector('.nav__links .nav__link.is-active') || navLinks[0];
      if (currentActive) updateUnderline(currentActive);

      // Window resize listener to keep underline aligned
      window.addEventListener('resize', () => {
        const active = document.querySelector('.nav__links .nav__link.is-active');
        if (active) updateUnderline(active);
      });
    },

    /* =====================================================================
       Scroll Playhead + Timecode Display (Part 7.1)
    ===================================================================== */
    initPlayhead() {
      const playhead = document.getElementById('scroll-playhead');
      if (!playhead) return;

      const phLine = playhead.querySelector('.ph-line');
      const phTime = playhead.querySelector('.ph-time');

      // Create chapter markers along playhead
      const sections = [
        { id: 'home', name: '00 / INTRO' },
        { id: 'work', name: '01 / WORK' },
        { id: 'highlights', name: 'PROOF' },
        { id: 'about', name: '02 / ABOUT' },
        { id: 'journey', name: '03 / JOURNEY' },
        { id: 'contact', name: '04 / CONTACT' },
      ];

      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const marker = document.createElement('div');
        marker.className = 'ph-marker';
        marker.innerHTML = `<span class="ph-tooltip">${s.name}</span>`;
        marker.addEventListener('click', (e) => {
          e.stopPropagation();
          Scroll.to(el);
        });
        playhead.appendChild(marker);
        marker.dataset.secId = s.id;
      });

      const positionMarkers = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;
        const markers = playhead.querySelectorAll('.ph-marker');
        markers.forEach((m) => {
          const el = document.getElementById(m.dataset.secId);
          if (el) {
            const top = el.offsetTop;
            const pct = Math.min(1, Math.max(0, top / maxScroll)) * 100;
            m.style.top = `${pct}%`;
          }
        });
      };
      window.addEventListener('resize', positionMarkers);
      setTimeout(positionMarkers, 1000);

      const updateProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

        if (phLine) {
          phLine.style.height = `${(progress * 100).toFixed(2)}%`;
        }

        // Map progress (0..1) to 00:00:00:00 -> 00:02:00:00 at 24fps (120 seconds total)
        if (phTime) {
          const totalFrames = Math.floor(progress * 120 * 24);
          const fps = 24;
          const frames = totalFrames % fps;
          const totalSeconds = Math.floor(totalFrames / fps);
          const seconds = totalSeconds % 60;
          const minutes = Math.floor(totalSeconds / 60) % 60;
          const hours = Math.floor(totalSeconds / 3600);

          const pad = (n) => String(n).padStart(2, '0');
          phTime.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
        }
      };

      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();

      // Click on ph-time jumps to top
      if (phTime) {
        phTime.addEventListener('click', () => {
          Scroll.to('#home');
        });
      }
    },

    /* =====================================================================
       Navbar Scroll State & Mobile Burger Drawer
    ===================================================================== */
    initNav() {
      const nav = document.querySelector('.nav');
      const burger = document.querySelector('.nav__burger');

      window.addEventListener(
        'scroll',
        () => {
          const y = window.pageYOffset || document.documentElement.scrollTop;
          if (nav) nav.classList.toggle('is-scrolled', y > 8);
        },
        { passive: true }
      );

      // Create mobile drawer if not already created
      if (nav && !nav.querySelector('.nav__drawer')) {
        const drawer = document.createElement('div');
        drawer.className = 'nav__drawer';
        drawer.innerHTML = `
          <a class="nav__link" href="#home">HOME</a>
          <a class="nav__link" href="#work">WORK</a>
          <a class="nav__link" href="#highlights">PROOF</a>
          <a class="nav__link" href="#about">ABOUT</a>
          <a class="nav__link" href="#journey">JOURNEY</a>
          <a class="nav__link" href="#contact">CONTACT</a>
        `;
        nav.appendChild(drawer);

        drawer.querySelectorAll('.nav__link').forEach((link) => {
          link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
              e.preventDefault();
              nav.classList.remove('is-open');
              Scroll.to(href);
            }
          });
        });
      }

      if (burger && nav) {
        burger.addEventListener('click', () => {
          const isOpen = nav.classList.toggle('is-open');
          burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            nav.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
          }
        });
      }
    },

    /* =====================================================================
       Hash Routing & Section Click Interception
    ===================================================================== */
    initHash() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.startsWith('#work/')) return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          Scroll.to(target);
          if (history.pushState) {
            history.pushState(null, '', href);
          }
        }
      });
    },
  };

  window.Scroll = Scroll;
})();
