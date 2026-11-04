/* js/work.js — Project Cards Generation, Code Posters, FLIP Filtering, Live Search, Horizontal Drag Slider & Cinema Modal */

(function () {
  'use strict';

  let activeFilter = 'All';
  let searchTerm = '';
  let activeModalSlug = null;
  let lastFocusedElement = null;

  const Work = {
    init() {
      this.populateCards();
      this.setupCodePosters();
      this.initTabs();
      this.initSearch();
      this.initSlider();
      this.initModal();
      this.init3DTilt();
      this.checkUrlHash();
    },

    /* =====================================================================
       Cards 4..11 Generation (Identical markup to static ones, NO data-layer)
    ===================================================================== */
    populateCards() {
      const cardsList = document.querySelector('.work__slider .cards');
      if (!cardsList || !window.CONTENT || !window.CONTENT.projects) return;

      const projects = window.CONTENT.projects;

      // Cards 4 to 11 (index 3 to 10)
      for (let i = 3; i < projects.length; i++) {
        const p = projects[i];
        // Check if card with this slug already exists
        if (cardsList.querySelector(`[data-slug="${p.slug}"]`)) continue;

        const li = document.createElement('li');
        li.className = 'card';
        li.setAttribute('data-slug', p.slug);
        li.setAttribute('data-cats', p.cats.join('|'));

        li.innerHTML = `
          <a class="card__link" href="#work/${p.slug}" data-cursor="view">
            <figure class="card__media">
              <span class="card__poster"></span>
            </figure>
            <span class="card__tagwrap">
              <i class="card__chip-rule"></i>
              <span class="card__tag">${p.tag}</span>
            </span>
            <div class="card__row">
              <b class="card__num">${p.n}</b>
              <div class="card__titles">
                <h3 class="card__title">${p.title}</h3>
                <p class="card__meta">${p.meta}</p>
              </div>
              <i class="card__arrow">↗</i>
            </div>
          </a>
        `;

        cardsList.appendChild(li);
      }
    },

    /* =====================================================================
       Code Posters Generator (Part 6.2) — Bespoke Visual Posters
    ===================================================================== */
    setupCodePosters() {
      const cards = document.querySelectorAll('.work__slider .card');
      const projects = (window.CONTENT && window.CONTENT.projects) || [];

      const getPosterVisual = (slug, p) => {
        switch (slug) {
          case 'yulya-discord-bot':
            return `
              <div class="p-vis p-vis--discord">
                <div class="p-vis__bar">
                  <span class="p-vis__badge">● Yulya#0001 [BOT]</span>
                  <span class="p-vis__voice">🎙️ Voice WebRTC</span>
                </div>
                <div class="p-vis__chat">
                  <div class="p-chat-bubble p-chat-user"><span class="p-cmd">/research</span> quantum computing</div>
                  <div class="p-chat-bubble p-chat-bot"><span class="p-bot-name">Yulya:</span> 4 papers synthesized · 8-qubit coherent state.</div>
                </div>
                <div class="p-vis__market">
                  <span class="p-coin">YULYA/COIN $4.20</span>
                  <span class="p-gain">+18.4% ▲</span>
                </div>
              </div>
            `;
          case 'yulya-studio':
            return `
              <div class="p-vis p-vis--studio">
                <div class="p-vis__bar">
                  <span class="p-vis__dots"><i class="r"></i><i class="y"></i><i class="g"></i></span>
                  <span class="p-vis__title">YULYA STUDIO · MONACO IDE</span>
                  <span class="p-vis__run">RUN ▶</span>
                </div>
                <div class="p-studio-split">
                  <div class="p-code-block">
                    <code><span class="kw">import</span> { Engine } <span class="kw">from</span> <span class="str">'@yulya'</span>;</code>
                    <code><span class="kw">const</span> game = <span class="kw">new</span> <span class="fn">Engine</span>();</code>
                    <code>game.<span class="fn">spawnPlayer</span>({ x: 120 });</code>
                  </div>
                  <div class="p-canvas-preview">
                    <div class="p-preview-stars"></div>
                    <div class="p-preview-ship"></div>
                  </div>
                </div>
              </div>
            `;
          case 'yulya-model-family':
            return `
              <div class="p-vis p-vis--model">
                <div class="p-vis__bar">
                  <span class="p-vis__hf">🤗 HUGGING FACE · GGUF</span>
                  <span class="p-vis__tag">8B MODEL</span>
                </div>
                <div class="p-model-name">Llama-3-Yulya-8B-Instruct</div>
                <div class="p-model-bars">
                  <span style="height:45%"></span>
                  <span style="height:70%"></span>
                  <span style="height:90%"></span>
                  <span style="height:60%"></span>
                  <span style="height:85%"></span>
                  <span style="height:75%"></span>
                  <span style="height:100%"></span>
                </div>
                <div class="p-model-log">llama.cpp: 33 layers offloaded to GPU · 128 tok/s</div>
              </div>
            `;
          case 'desktop-ai-companion':
            return `
              <div class="p-vis p-vis--companion">
                <div class="p-vis__bar">
                  <span class="p-vis__title">● DESKTOP COMPANION</span>
                  <span class="p-vis__pill">TRANSPARENT</span>
                </div>
                <div class="p-companion-body">
                  <div class="p-avatar-holo">
                    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
                      <circle cx="24" cy="20" r="14" fill="none" stroke="#7dd3fc" stroke-width="1.8"/>
                      <circle cx="20" cy="18" r="2" fill="#7dd3fc"/>
                      <circle cx="28" cy="18" r="2" fill="#7dd3fc"/>
                      <path d="M21 24 Q24 27 27 24" fill="none" stroke="#7dd3fc" stroke-width="1.5"/>
                      <path d="M12 38 Q24 30 36 38" fill="none" stroke="#7dd3fc" stroke-width="1.8"/>
                    </svg>
                  </div>
                  <div class="p-companion-wave">
                    <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                  </div>
                </div>
                <div class="p-vis__meta">● Ollama (llama3:8b local) · whisper.cpp STT</div>
              </div>
            `;
          case 'yulya-api':
            return `
              <div class="p-vis p-vis--api">
                <div class="p-vis__bar">
                  <span class="p-api-endpoint">POST /v1/embeddings</span>
                  <span class="p-api-status">200 OK</span>
                </div>
                <div class="p-api-nodes">
                  <div class="p-grid-mesh">
                    <i class="p-n"></i><i class="p-n act"></i><i class="p-n"></i><i class="p-n act"></i>
                    <i class="p-n act"></i><i class="p-n"></i><i class="p-n act"></i><i class="p-n"></i>
                    <i class="p-n"></i><i class="p-n act"></i><i class="p-n"></i><i class="p-n act"></i>
                  </div>
                </div>
                <div class="p-vis__meta">1536 dims float32 · 12ms latency · FastAPI</div>
              </div>
            `;
          case 'neural-deck':
            return `
              <div class="p-vis p-vis--deck">
                <div class="p-vis__bar">
                  <span class="p-vis__title">NEURAL DASHBOARD</span>
                  <span class="p-vis__pill">12 SHARDS</span>
                </div>
                <div class="p-deck-chart">
                  <span class="c-bar g" style="height:60%"></span>
                  <span class="c-bar r" style="height:40%"></span>
                  <span class="c-bar g" style="height:75%"></span>
                  <span class="c-bar g" style="height:90%"></span>
                  <span class="c-bar r" style="height:50%"></span>
                  <span class="c-bar g" style="height:85%"></span>
                </div>
                <div class="p-vis__meta">Live command ledger · 99.98% uptime</div>
              </div>
            `;
          case 'mascot-live2d-art':
            return `
              <div class="p-vis p-vis--art">
                <div class="p-vis__bar">
                  <span class="p-vis__title">KRITA & LIVE2D CUBISM</span>
                  <span class="p-vis__pill">RIGGED</span>
                </div>
                <div class="p-art-mesh">
                  <div class="p-mesh-box">
                    <span class="p-dot"></span><span class="p-dot"></span><span class="p-dot"></span>
                    <span class="p-dot"></span><span class="p-dot"></span><span class="p-dot"></span>
                  </div>
                </div>
                <div class="p-vis__meta">Angle X: +12° · EyeOpen: 1.0 · Physics applied</div>
              </div>
            `;
          case 'mascot-website':
            return `
              <div class="p-vis p-vis--web">
                <div class="p-vis__bar">
                  <span class="p-url">https://mascot.yulya.me</span>
                </div>
                <div class="p-web-hero">
                  <span class="p-web-title">MEET THE MASCOT</span>
                  <span class="p-web-btn">DOWNLOAD FREE ↗</span>
                </div>
                <div class="p-vis__meta">Responsive showcase template</div>
              </div>
            `;
          case 'unity-blender':
            return `
              <div class="p-vis p-vis--unity">
                <div class="p-vis__bar">
                  <span class="p-vis__title">UNITY & BLENDER VIEWPORT</span>
                  <span class="p-vis__pill">3D</span>
                </div>
                <div class="p-unity-gizmo">
                  <div class="p-axis"><span class="ax-x">X</span><span class="ax-y">Y</span><span class="ax-z">Z</span></div>
                  <div class="p-isometric-box"></div>
                </div>
                <div class="p-vis__meta">DirectX 12 / PBR shaders / Low-poly assets</div>
              </div>
            `;
          case 'yulya-space':
            return `
              <div class="p-vis p-vis--space">
                <div class="p-vis__bar">
                  <span class="p-vis__hf">🤗 LIVE SPACE</span>
                  <span class="p-vis__pill">T4 GPU</span>
                </div>
                <div class="p-space-content">
                  <span class="p-space-sub">Hugging Face Live Interactive Demo</span>
                  <span class="p-space-action">TRY IN BROWSER ↗</span>
                </div>
                <div class="p-vis__meta">Zero-install browser execution · 114 tok/s</div>
              </div>
            `;
          case 'college-project':
          default:
            return `
              <div class="p-vis p-vis--college">
                <div class="p-vis__bar">
                  <span class="p-vis__title">LEARNEXA 2.0</span>
                  <span class="p-vis__pill">FULL STACK</span>
                </div>
                <div class="p-college-arch">
                  <span>Next.js Client</span>
                  <i>➔</i>
                  <span>Flask API</span>
                  <i>➔</i>
                  <span>SQLite</span>
                </div>
                <div class="p-vis__meta">BCA Capstone · TF-IDF skill recommendation</div>
              </div>
            `;
        }
      };

      cards.forEach((card, index) => {
        const slug = card.getAttribute('data-slug');
        const p = projects.find((item) => item.slug === slug) || projects[index];
        if (!p) return;

        const media = card.querySelector('.card__media');
        if (!media) return;

        const posterSpan = media.querySelector('.card__poster');
        if (!posterSpan) return;

        const chipsHtml = (p.tech || []).slice(0, 3).map(t => `<span class="card__poster-chip">${t}</span>`).join('');
        const visualHtml = getPosterVisual(p.slug, p);

        posterSpan.innerHTML = `
          <div class="card__poster-inner">
            ${visualHtml}
            <div class="card__poster-chips">${chipsHtml}</div>
          </div>
        `;

        // If an image path is specified, test loading it
        if (p.img) {
          const img = new Image();
          img.src = p.img;
          img.onload = () => {
            img.className = 'card__img';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            media.appendChild(img);
            posterSpan.style.display = 'none';
          };
        }
      });
    },

    /* =====================================================================
       FLIP Animated Tab Filtering (Part 6.2 / 10.5)
    ===================================================================== */
    initTabs() {
      const tabs = Array.from(document.querySelectorAll('.work__filters .tab'));
      const line = document.querySelector('.tabs__line');
      if (!tabs.length) return;

      const updateTabLine = (tab) => {
        if (!line || !tab) return;
        const left = tab.offsetLeft;
        const width = tab.offsetWidth;
        line.style.transform = `translateX(${left}px)`;
        line.style.width = `${width}px`;
      };

      // Set initial line position
      const initialTab = document.querySelector('.work__filters .tab.is-active') || tabs[0];
      if (initialTab) updateTabLine(initialTab);

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
          updateTabLine(tab);

          activeFilter = tab.getAttribute('data-filter') || 'All';
          Work.applyFilter();
        });
      });
    },

    /* =====================================================================
       Live Search with Highlighted Matches (Part 6.2 / 10.5)
    ===================================================================== */
    initSearch() {
      const input = document.querySelector('.work__search input');
      const placeholder = document.querySelector('.work__search-ph');
      if (!input) return;

      input.addEventListener('input', () => {
        searchTerm = input.value.trim().toLowerCase();
        if (placeholder) {
          placeholder.classList.toggle('is-hidden', input.value.length > 0);
        }
        Work.applyFilter();
      });
    },

    applyFilter() {
      const cards = Array.from(document.querySelectorAll('.work__slider .card'));
      const projects = (window.CONTENT && window.CONTENT.projects) || [];

      // 1. Record initial rects for FLIP
      const firstPositions = new Map();
      cards.forEach((card) => {
        if (!card.hidden && card.offsetParent !== null) {
          firstPositions.set(card, card.getBoundingClientRect());
        }
      });

      let visibleCount = 0;

      cards.forEach((card, index) => {
        const slug = card.getAttribute('data-slug');
        const p = projects.find((item) => item.slug === slug) || projects[index];
        const cats = (card.getAttribute('data-cats') || '').split('|');

        // Check category filter
        const matchesCategory = activeFilter === 'All' || cats.includes(activeFilter);

        // Check search term
        let matchesSearch = true;
        if (searchTerm && p) {
          const searchable = `${p.title} ${p.meta} ${p.tag} ${(p.tech || []).join(' ')}`.toLowerCase();
          matchesSearch = searchable.includes(searchTerm);
        }

        const isVisible = matchesCategory && matchesSearch;

        // Title highlight
        const titleEl = card.querySelector('.card__title');
        if (titleEl && p) {
          if (searchTerm && isVisible) {
            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            titleEl.innerHTML = p.title.replace(regex, '<mark class="match">$1</mark>');
          } else {
            titleEl.textContent = p.title;
          }
        }

        if (isVisible) {
          card.hidden = false;
          visibleCount++;
        } else {
          card.hidden = true;
        }
      });

      // 2. Animate delta for FLIP
      cards.forEach((card) => {
        if (card.hidden) return;
        const first = firstPositions.get(card);
        if (!first) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            card.style.opacity = '1';
            card.style.transform = 'none';
          });
          return;
        }

        const last = card.getBoundingClientRect();
        const dx = first.left - last.left;
        const dy = first.top - last.top;

        if (dx !== 0 || dy !== 0) {
          card.style.transform = `translate(${dx}px, ${dy}px)`;
          card.style.transition = 'transform 0s';

          requestAnimationFrame(() => {
            card.style.transition = 'transform .5s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform = 'none';
          });
        }
      });

      // Update counter text (only after swarm is complete)
      const countEl = document.querySelector('.work__count');
      if (countEl && (!window.Swarm || window.Swarm.state === 'finale' || window.Swarm.state === 'live')) {
        countEl.textContent = `SEE ALL (${visibleCount}) •`;
      }
    },

    /* =====================================================================
       Horizontal Slider (Scroll-snap + Drag with Inertia + Prev/Next)
    ===================================================================== */
    initSlider() {
      const slider = document.querySelector('.work__slider .cards');
      const prevBtn = document.querySelector('.slider__btn--prev');
      const nextBtn = document.querySelector('.slider__btn--next');
      const dotsWrap = document.querySelector('.slider__dots');
      if (!slider) return;

      // Populate indicator dots
      const updateDots = () => {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        const pageCount = Math.max(1, Math.ceil(slider.scrollWidth / slider.clientWidth));
        const currentPage = Math.round(slider.scrollLeft / slider.clientWidth);

        for (let i = 0; i < pageCount; i++) {
          const dot = document.createElement('i');
          if (i === currentPage) dot.classList.add('is-active');
          dot.addEventListener('click', () => {
            slider.scrollTo({ left: i * slider.clientWidth, behavior: 'smooth' });
          });
          dotsWrap.appendChild(dot);
        }
      };

      slider.addEventListener('scroll', () => {
        const dots = dotsWrap ? dotsWrap.querySelectorAll('i') : [];
        const currentPage = Math.round(slider.scrollLeft / slider.clientWidth);
        dots.forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === currentPage);
        });
      }, { passive: true });

      setTimeout(updateDots, 600);
      window.addEventListener('resize', updateDots);

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          slider.scrollBy({ left: -slider.clientWidth * 0.75, behavior: 'smooth' });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          slider.scrollBy({ left: slider.clientWidth * 0.75, behavior: 'smooth' });
        });
      }

      // Pointer drag to scroll
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
      });

      window.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = '';
      });

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
      });
    },

    /* =====================================================================
       Card 3D Tilt Hover Effect
    ===================================================================== */
    init3DTilt() {
      if (
        document.documentElement.getAttribute('data-motion') === 'off' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      const cards = document.querySelectorAll('.work__slider .card');
      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          const rotateX = -y * 8;
          const rotateY = x * 8;

          card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    },

    /* =====================================================================
       Cinema Project Modal (Part 7.6 / 7.7)
    ===================================================================== */
    initModal() {
      let modalBackdrop = document.querySelector('.modal-backdrop');
      if (!modalBackdrop) {
        modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'modal-backdrop';
        modalBackdrop.setAttribute('role', 'dialog');
        modalBackdrop.setAttribute('aria-modal', 'true');
        modalBackdrop.setAttribute('aria-label', 'Project details');

        modalBackdrop.innerHTML = `
          <div class="modal-letterbox-t"></div>
          <div class="modal-letterbox-b"></div>
          <div class="modal-window">
            <button class="modal-close" type="button" aria-label="Close modal" data-cursor="close">✕</button>
            <div class="modal-body">
              <div class="modal-media"></div>
              <div class="modal-details">
                <p class="modal-num"></p>
                <h3 class="modal-title"></h3>
                <p class="modal-meta"></p>
                <p class="modal-desc"></p>
                <div class="modal-tech"></div>
                <div class="modal-actions">
                  <a class="modal-btn modal-btn--live" href="#" target="_blank" rel="noopener">LIVE DEMO ↗</a>
                  <a class="modal-btn modal-btn--repo" href="#" target="_blank" rel="noopener">VIEW GITHUB ↗</a>
                </div>
              </div>
            </div>
            <div class="modal-nav">
              <button class="modal-nav-btn modal-nav-btn--prev" type="button" aria-label="Previous project">‹</button>
              <button class="modal-nav-btn modal-nav-btn--next" type="button" aria-label="Next project">›</button>
            </div>
          </div>
        `;

        document.body.appendChild(modalBackdrop);

        // Bind close button
        modalBackdrop.querySelector('.modal-close').addEventListener('click', () => {
          Work.closeModal();
        });

        modalBackdrop.addEventListener('click', (e) => {
          if (e.target === modalBackdrop) Work.closeModal();
        });

        // Prev / Next Project buttons
        modalBackdrop.querySelector('.modal-nav-btn--prev').addEventListener('click', (e) => {
          e.stopPropagation();
          Work.navigateModal(-1);
        });

        modalBackdrop.querySelector('.modal-nav-btn--next').addEventListener('click', (e) => {
          e.stopPropagation();
          Work.navigateModal(1);
        });

        // Keyboard handler: Esc to close, Left/Right arrows
        document.addEventListener('keydown', (e) => {
          if (!modalBackdrop.classList.contains('is-open')) return;
          if (e.key === 'Escape') Work.closeModal();
          else if (e.key === 'ArrowLeft') Work.navigateModal(-1);
          else if (e.key === 'ArrowRight') Work.navigateModal(1);
        });
      }

      // Delegate click on card links
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#work/"]');
        if (!link) return;
        e.preventDefault();
        const slug = link.getAttribute('href').replace('#work/', '');
        lastFocusedElement = link;
        Work.openModal(slug);
      });
    },

    openModal(slug) {
      const projects = (window.CONTENT && window.CONTENT.projects) || [];
      const project = projects.find((p) => p.slug === slug);
      if (!project) return;

      activeModalSlug = slug;
      const modal = document.querySelector('.modal-backdrop');
      if (!modal) return;

      modal.querySelector('.modal-num').textContent = project.n;
      modal.querySelector('.modal-title').textContent = project.title;
      modal.querySelector('.modal-meta').textContent = `${project.tag} · ${project.meta}`;
      modal.querySelector('.modal-desc').textContent = project.desc;

      // Tech pills
      const techWrap = modal.querySelector('.modal-tech');
      techWrap.innerHTML = (project.tech || []).map(t => `<span class="modal-tech-pill">${t}</span>`).join('');

      // Media area (poster or image)
      const mediaWrap = modal.querySelector('.modal-media');
      const hue = (projects.indexOf(project) * 47) % 360;
      const initials = project.title.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('');
      mediaWrap.innerHTML = `
        <div class="card__poster-inner" style="background:linear-gradient(135deg, hsl(${hue}, 60%, 14%), hsl(${hue}, 50%, 8%))">
          <span class="card__poster-initials">${initials}</span>
        </div>
      `;

      if (project.img) {
        const img = new Image();
        img.src = project.img;
        img.onload = () => {
          mediaWrap.innerHTML = `<img src="${project.img}" alt="${project.title}">`;
        };
      }

      // Action buttons
      const liveBtn = modal.querySelector('.modal-btn--live');
      if (project.live) {
        liveBtn.href = project.live;
        liveBtn.style.display = 'inline-flex';
      } else {
        liveBtn.style.display = 'none';
      }

      const repoBtn = modal.querySelector('.modal-btn--repo');
      if (project.repo) {
        repoBtn.href = project.repo;
        repoBtn.style.display = 'inline-flex';
      } else {
        repoBtn.style.display = 'none';
      }

      modal.classList.add('is-open');
      modal.querySelector('.modal-close').focus();

      if (history.pushState) {
        history.pushState(null, '', `#work/${slug}`);
      }
    },

    closeModal() {
      const modal = document.querySelector('.modal-backdrop');
      if (modal) {
        modal.classList.remove('is-open');
      }
      activeModalSlug = null;
      if (history.pushState) {
        history.pushState(null, '', window.location.pathname);
      }
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    },

    navigateModal(direction) {
      const projects = (window.CONTENT && window.CONTENT.projects) || [];
      if (!projects.length || !activeModalSlug) return;
      const idx = projects.findIndex((p) => p.slug === activeModalSlug);
      if (idx === -1) return;

      const nextIdx = (idx + direction + projects.length) % projects.length;
      Work.openModal(projects[nextIdx].slug);
    },

    checkUrlHash() {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#work/')) {
        const slug = hash.replace('#work/', '');
        setTimeout(() => Work.openModal(slug), 500);
      }
    },
  };

  window.Work = Work;
})();
