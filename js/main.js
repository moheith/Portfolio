/* js/main.js — Boot Sequence, Hydration, Swarm Start, and startSite() Controller */

(function () {
  'use strict';

  let siteStarted = false;

  /* Helper wait */
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* =====================================================================
     1. Hydration ([data-c] content bindings and [CONTENT.links] mapping)
  ===================================================================== */
  function hydrate() {
    if (!window.CONTENT) return;

    // Resolve dotted path in CONTENT
    const resolvePath = (path) => {
      const parts = path.split('.');
      let cur = window.CONTENT;
      for (const part of parts) {
        if (cur === undefined || cur === null) return undefined;
        cur = cur[part];
      }
      return cur;
    };

    const elements = document.querySelectorAll('[data-c]');
    elements.forEach((el) => {
      const path = el.getAttribute('data-c');
      const val = resolvePath(path);
      if (val !== undefined && typeof val !== 'object') {
        const prefix = el.getAttribute('data-c-prefix') || '';
        const suffix = el.getAttribute('data-c-suffix') || '';
        const isUpper = el.hasAttribute('data-c-upper');
        const strVal = String(val);
        const finalText = prefix + (isUpper ? strVal.toUpperCase() : strVal) + suffix;

        el.textContent = finalText;
        if (el.dataset.full !== undefined) {
          el.dataset.full = finalText;
        }
      }
    });

    // Hydrate dynamic links
    if (window.CONTENT.links) {
      const L = window.CONTENT.links;
      const ghLinks = document.querySelectorAll('a[href*="github.com/moheith"]');
      ghLinks.forEach((a) => { if (L.github) a.href = L.github; });

      const igLinks = document.querySelectorAll('a[href*="instagram.com"]');
      igLinks.forEach((a) => { if (L.instagram) a.href = L.instagram; });

      const waLinks = document.querySelectorAll('a[href*="wa.me"]');
      waLinks.forEach((a) => {
        if (L.whatsapp) {
          const currentHref = a.getAttribute('href');
          if (currentHref && currentHref.includes('?text=')) {
            const query = currentHref.split('?text=')[1];
            a.href = `https://wa.me/${L.whatsapp}?text=${query}`;
          } else {
            a.href = `https://wa.me/${L.whatsapp}`;
          }
        }
      });
    }
  }

  /* =====================================================================
     Reveals & Eyebrow Text Scramble (Part 7.4 / 10.1)
  ===================================================================== */
  const Reveals = {
    init() {
      // Rule: Never hide an element that is already on screen
      const viewportBottom = window.scrollY + window.innerHeight;

      // Text Scramble on eyebrows when they enter viewport
      const scrambleChars = '▮#/_\\<>[]~+=*';
      const eyebrows = document.querySelectorAll('.eyebrow');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              observer.unobserve(el);

              // Don't scramble if motion is off
              if (
                document.documentElement.getAttribute('data-motion') === 'off' ||
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ) {
                return;
              }

              const original = el.textContent;
              const duration = 500;
              const startTime = performance.now();

              const scrambleLoop = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(1, elapsed / duration);
                const revealIdx = Math.floor(progress * original.length);

                let result = original.slice(0, revealIdx);
                for (let i = revealIdx; i < original.length; i++) {
                  if (original[i] === ' ' || original[i] === '/') {
                    result += original[i];
                  } else {
                    result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                  }
                }
                el.textContent = result;

                if (progress < 1) {
                  requestAnimationFrame(scrambleLoop);
                } else {
                  el.textContent = original;
                }
              };

              requestAnimationFrame(scrambleLoop);
            }
          });
        },
        { threshold: 0.2 }
      );

      eyebrows.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        // Only observe if below current viewport
        if (top > viewportBottom) {
          observer.observe(el);
        }
      });
    },
  };

  /* =====================================================================
     startSite(): Idempotent, runs once when Swarm reaches finale or is skipped
  ===================================================================== */
  function startSite() {
    if (siteStarted) return;
    siteStarted = true;

    // 1. Start smooth scrolling
    if (window.Scroll) {
      window.Scroll.start();
    }

    // 2. Enable Custom Site Cursor
    if (window.Cursor) {
      window.Cursor.enable();
    }

    // 3. Count up stat numbers
    if (window.Hero) {
      window.Hero.startCounters();
      window.Hero.init();
    }

    // 4. Init Journey and reveals
    if (window.Journey) {
      window.Journey.init();
    }
    Reveals.init();

    // 5. Refresh ScrollTrigger if loaded
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }

    // If URL has section hash, scroll to it smoothly
    const hash = window.location.hash;
    if (hash && hash.length > 1 && !hash.startsWith('#work/') && window.Scroll) {
      setTimeout(() => {
        window.Scroll.to(hash);
      }, 400);
    }
  }

  /* =====================================================================
     BOOT SEQUENCE (Part 10.1)
  ===================================================================== */
  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Hydrate content bindings BEFORE swarm measures text
    hydrate();

    // 2. Build remaining project cards, tabs, search, modal
    if (window.Work) {
      window.Work.init();
    }

    // 3. Build UI mocks in Raw vs Real comparison slider
    if (window.Compare) {
      window.Compare.build();
    }

    // 4. Initialize static widgets: clock, accent restore, motion, toasts
    if (window.Extras) {
      window.Extras.initStatic();
    }

    // 5. Await font loading (max 1.5s timeout)
    try {
      await Promise.race([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        wait(1500),
      ]);
    } catch (_) {}

    // 6. Scale giant word dynamically (must be measured at final font size)
    if (window.Hero) {
      window.Hero.fitText();
    }

    // 7. Initialize scroll controller (calls lenis.stop() immediately)
    if (window.Scroll) {
      window.Scroll.init();
    }

    // 8. Determine if intro should be skipped
    const isMotionOff =
      localStorage.getItem('motion') === 'off' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.location.search.includes('intro=off');

    // 9. Listen for swarm completion
    document.addEventListener('swarmstate', (e) => {
      if (e.detail === 'finale' || e.detail === 'live') {
        startSite();
      }
    });

    if (window.Swarm) {
      if (isMotionOff) {
        window.Swarm.finishAll();
        startSite();
      } else {
        window.Swarm.start();
      }
    } else {
      startSite();
    }
  });

  window.startSite = startSite;
  window.Reveals = Reveals;
})();
