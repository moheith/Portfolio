/* js/hero.js — Dynamic FitText, Silhouette Fallback, Numeral Counters, Mouse Parallax & Spotlight */

(function () {
  'use strict';

  let hasCounted = false;

  const Hero = {
    init() {
      this.initPhotoFallback();
      this.initParallax();
      this.initSpotlight();
    },

    /* =====================================================================
       fitText(): Scale giant word so rendered width = 94% of viewport width
    ===================================================================== */
    fitText() {
      const heroWord = document.querySelector('.hero__word');
      if (!heroWord) return;

      if (window.CONTENT && window.CONTENT.meta && window.CONTENT.meta.heroWord) {
        // Only set textContent if swarm is not actively running
        if (!window.Swarm || window.Swarm.state === 'idle') {
          heroWord.textContent = window.CONTENT.meta.heroWord;
          heroWord.dataset.full = window.CONTENT.meta.heroWord;
        }
      }

      const vw = window.innerWidth;
      const targetWidth = vw * 0.94;

      // Temporarily set a test font size to measure exact aspect ratio
      const testSize = 100;
      heroWord.style.fontSize = `${testSize}px`;
      heroWord.style.display = 'inline-block';
      heroWord.style.visibility = 'hidden';

      const measuredWidth = heroWord.getBoundingClientRect().width || 1;
      const ratio = targetWidth / measuredWidth;
      const finalFontSize = Math.max(72, Math.floor(testSize * ratio));

      heroWord.style.fontSize = `${finalFontSize}px`;
      heroWord.style.visibility = '';

      // Set position
      heroWord.style.left = '3vw';
      heroWord.style.top = '14%';
    },

    /* =====================================================================
       Photo Fallback: SVG Silhouette if hero-cutout fails to load
    ===================================================================== */
    initPhotoFallback() {
      const photo = document.querySelector('.hero__photo');
      if (!photo) return;

      photo.addEventListener('error', () => {
        console.warn('[hero] Cutout photo failed to load, replacing with SVG silhouette.');
        const parent = photo.parentElement;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 500 700');
        svg.setAttribute('class', 'hero__photo hero__photo--silhouette');
        svg.style.height = '100%';
        svg.style.width = 'auto';
        svg.style.filter = 'drop-shadow(0 0 40px rgba(255, 59, 48, .35))';
        svg.innerHTML = `
          <defs>
            <radialGradient id="silGlow" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stop-color="#ff3b30" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#07070a" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="500" height="700" fill="url(#silGlow)"/>
          <path d="M 250 160 C 290 160 320 195 320 250 C 320 300 295 330 250 330 C 205 330 180 300 180 250 C 180 195 210 160 250 160 Z" fill="#090a0f"/>
          <path d="M 120 700 C 130 520 150 420 190 380 C 210 360 230 350 250 350 C 270 350 290 360 310 380 C 350 420 370 520 380 700 Z" fill="#090a0f"/>
        `;
        parent.replaceChild(svg, photo);
      });
    },

    /* =====================================================================
       startCounters(): Count up stat numbers from 0 to N+
    ===================================================================== */
    startCounters() {
      if (hasCounted) return;
      const statsWrap = document.querySelector('.hero__stats');
      if (!statsWrap) return;

      const triggerCount = () => {
        if (hasCounted) return;
        hasCounted = true;

        const stats = document.querySelectorAll('.stat__num');
        stats.forEach((stat) => {
          const originalText = stat.textContent.trim();
          const match = originalText.match(/^(\d+)(\+?)$/);
          if (!match) return;

          const targetNum = parseInt(match[1], 10);
          const suffix = match[2] || '';
          const duration = 1400; // 1.4s ease-out
          const startTime = performance.now();

          const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * targetNum);

            stat.textContent = `${current}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              stat.textContent = originalText;
            }
          };

          requestAnimationFrame(update);
        });
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            triggerCount();
          }
        });
      }, { threshold: 0.5 });

      observer.observe(statsWrap);
    },

    /* =====================================================================
       Parallax: Scroll and Mouse Parallax (Word 0.15, Photo 0.05)
    ===================================================================== */
    initParallax() {
      if (
        document.documentElement.getAttribute('data-motion') === 'off' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      const word = document.querySelector('.hero__word');
      const photoWrap = document.querySelector('.hero__photo-wrap');

      // Mouse Parallax lerped
      let targetWordX = 0, targetWordY = 0;
      let targetPhotoX = 0, targetPhotoY = 0;
      let currentWordX = 0, currentWordY = 0;
      let currentPhotoX = 0, currentPhotoY = 0;

      window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;

        targetWordX = nx * 26;
        targetWordY = ny * 16;
        targetPhotoX = nx * 14;
        targetPhotoY = ny * 8;
      });

      const loop = () => {
        currentWordX += (targetWordX - currentWordX) * 0.08;
        currentWordY += (targetWordY - currentWordY) * 0.08;
        currentPhotoX += (targetPhotoX - currentPhotoX) * 0.08;
        currentPhotoY += (targetPhotoY - currentPhotoY) * 0.08;

        if (word) {
          word.style.transform = `translate3d(${currentWordX.toFixed(2)}px, ${currentWordY.toFixed(2)}px, 0)`;
        }
        if (photoWrap) {
          photoWrap.style.transform = `translateX(calc(-50% + ${currentPhotoX.toFixed(2)}px)) translateY(${currentPhotoY.toFixed(2)}px)`;
        }

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },

    /* =====================================================================
       Spotlight: Radial Gradient follows mouse inside Hero
    ===================================================================== */
    initSpotlight() {
      const hero = document.getElementById('home');
      if (!hero) return;

      const spot = document.createElement('div');
      spot.className = 'hero__spotlight';
      spot.style.position = 'absolute';
      spot.style.width = '260px';
      spot.style.height = '260px';
      spot.style.borderRadius = '50%';
      spot.style.background = 'radial-gradient(circle, rgba(255, 120, 100, .35) 0%, transparent 70%)';
      spot.style.mixBlendMode = 'screen';
      spot.style.pointerEvents = 'none';
      spot.style.zIndex = '3';
      spot.style.transform = 'translate(-50%, -50%)';
      spot.style.opacity = '0';
      spot.style.transition = 'opacity .3s var(--ease)';
      hero.appendChild(spot);

      hero.addEventListener('mouseenter', () => {
        spot.style.opacity = '1';
      });

      hero.addEventListener('mouseleave', () => {
        spot.style.opacity = '0';
      });

      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spot.style.left = `${x}px`;
        spot.style.top = `${y}px`;
      });
    },
  };

  // Debounced resize handler for fitText
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      Hero.fitText();
    }, 120);
  });

  window.Hero = Hero;
})();
