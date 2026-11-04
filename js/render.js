/* js/render.js — turns CONTENT lists into DOM *before* the swarm starts.
   Every template below carries its data-layer tags. Do not change the tag vocabulary:
   text | chip | button | image | card | logo | icon | line | input | shape                          */
const Render = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const pad = (n) => String(n).padStart(2, '0');

  /* simple-icons logo with a text-wordmark fallback (also used when slug is "") */
  function iconHTML(label, slug, hex, cls) {
    if (!slug) return `<span class="${cls} ${cls}--word" style="color:#${hex}">${esc(label)}</span>`;
    return `<img class="${cls}" src="https://cdn.simpleicons.org/${slug}/${hex}" alt="" loading="lazy" decoding="async" width="28" height="28"
      onerror="this.outerHTML='<span class=&quot;${cls} ${cls}--word&quot; style=&quot;color:#${hex}&quot;>${esc(label)}</span>'">`;
  }

  function initials(title) {
    return title.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('');
  }

  function posterHTML(p) {
    const slug = p.slug;
    if (slug === 'yulya') {
      return `<div class="card__poster card__poster--yulya" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title"># voice-companion</span><span class="poster__badge">ONLINE</span></div>
        <div class="poster__center">
          <div class="poster__avatar poster__avatar--lg">Y</div>
          <div class="poster__msg"><span class="poster__sender">Yulya [BOT]</span><span class="poster__bubble">Gemini Live voice active &middot; Listening...</span></div>
          <div class="poster__waveform"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        </div>
        <div class="poster__chips"><span class="poster__chip">WebRTC</span><span class="poster__chip">Live Memory</span><span class="poster__chip">RPG Heist</span></div>
      </div>`;
    }
    if (slug === 'yulya-studio') {
      return `<div class="card__poster card__poster--yulya-studio" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">studio.yulya.me</span><span class="poster__badge">60 FPS</span></div>
        <div class="poster__ide">
          <div class="poster__code"><span class="poster__kw">import</span> { Studio } <span class="poster__kw">from</span> <span class="poster__str">'yulya'</span>;<br><span class="poster__kw">const</span> game = <span class="poster__kw">new</span> <span class="poster__fn">Studio</span>();<br>game.<span class="poster__fn">spawn</span>(<span class="poster__str">"companion"</span>);<br>game.<span class="poster__fn">run</span>();</div>
          <div class="poster__stage"><div class="poster__grid"></div><div class="poster__craft"></div><div class="poster__sun"></div></div>
        </div>
        <div class="poster__chips"><span class="poster__chip">WebGL2</span><span class="poster__chip">Vite / React</span><span class="poster__chip">Monaco</span></div>
      </div>`;
    }
    if (slug === 'learnexa') {
      return `<div class="card__poster card__poster--learnexa" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">LEARNEXA MATCH ENGINE</span><span class="poster__badge">MATCH 98%</span></div>
        <div class="poster__match">
          <div class="poster__card"><span class="poster__sub">OFFERING</span><b>Python &amp; ML</b></div>
          <span class="poster__swap">⇆</span>
          <div class="poster__card"><span class="poster__sub">WANT TO LEARN</span><b>3D Blender</b></div>
        </div>
        <div class="poster__chips"><span class="poster__chip">TF-IDF</span><span class="poster__chip">Next.js</span><span class="poster__chip">Flask</span></div>
      </div>`;
    }
    if (slug === 'yulya-models') {
      return `<div class="card__poster card__poster--yulya-models" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">huggingface.co/moheith</span><span class="poster__badge">8 MODELS</span></div>
        <div class="poster__models">
          <div class="poster__chart"><svg viewBox="0 0 100 40" class="poster__svg" aria-hidden="true"><path d="M5,35 Q 30,30 45,15 T 95,8" fill="none" stroke="#ff3b30" stroke-width="2.5"/><path d="M5,35 Q 30,30 45,15 T 95,8 L 95,40 L 5,40 Z" fill="rgba(255,59,48,0.1)"/></svg></div>
          <div class="poster__cmd"><code>$ ollama run yulya:latest</code></div>
        </div>
        <div class="poster__chips"><span class="poster__chip">Qwen2.5</span><span class="poster__chip">SmolLM2</span><span class="poster__chip">Q4_K_M</span></div>
      </div>`;
    }
    if (slug === 'desktop-ai-companion') {
      return `<div class="card__poster card__poster--desktop-ai-companion" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">DESKTOP OVERLAY COMPANION</span><span class="poster__badge">SYNCED</span></div>
        <div class="poster__graph">
          <div class="poster__node poster__node--center">AI</div>
          <div class="poster__node poster__node--1"></div>
          <div class="poster__node poster__node--2"></div>
          <div class="poster__node poster__node--3"></div>
          <div class="poster__link poster__link--1"></div>
          <div class="poster__link poster__link--2"></div>
          <div class="poster__link poster__link--3"></div>
        </div>
        <div class="poster__chips"><span class="poster__chip">Vector Memory</span><span class="poster__chip">HUD Overlay</span><span class="poster__chip">Desktop Mate</span></div>
      </div>`;
    }
    if (slug === 'yulya-landing') {
      return `<div class="card__poster card__poster--yulya-landing" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">yulya.me</span><span class="poster__badge">HERO</span></div>
        <div class="poster__showcase">
          <span class="poster__glowtext">YULYA</span>
          <span class="poster__subtext">THE AI ECOSYSTEM</span>
          <span class="poster__btn">EXPLORE &rarr;</span>
        </div>
        <div class="poster__chips"><span class="poster__chip">Creative Dev</span><span class="poster__chip">Design</span><span class="poster__chip">Modern Web</span></div>
      </div>`;
    }
    if (slug === 'mascot-website') {
      return `<div class="card__poster card__poster--mascot-website" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">MASCOT 3D ASSETS</span><span class="poster__badge">1.2K DL</span></div>
        <div class="poster__mascot">
          <div class="poster__botface"><div class="poster__eyes"></div></div>
          <div class="poster__mascotstat">RIGGED &middot; ANIMATED &middot; 3D</div>
        </div>
        <div class="poster__chips"><span class="poster__chip">Three.js</span><span class="poster__chip">3D Model</span><span class="poster__chip">GLTF / OBJ</span></div>
      </div>`;
    }
    if (slug === 'textlink') {
      return `<div class="card__poster card__poster--textlink" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">txlk.me</span><span class="poster__badge">SERVERLESS</span></div>
        <div class="poster__textlink">
          <div class="poster__urlbox">txlk.me/<b>89f2a4</b></div>
          <div class="poster__tagline">Browser-native hash &middot; Zero database</div>
        </div>
        <div class="poster__chips"><span class="poster__chip">Ephemeral</span><span class="poster__chip">Instant Link</span><span class="poster__chip">Pure JS</span></div>
      </div>`;
    }
    if (slug === 'yulya-api') {
      return `<div class="card__poster card__poster--yulya-api" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">API REFERENCE</span><span class="poster__badge">14 MS</span></div>
        <div class="poster__api">
          <div class="poster__endpoint"><span class="poster__method">POST</span> /v1/embeddings</div>
          <div class="poster__json"><code>{ &quot;status&quot;: &quot;ok&quot;, &quot;dim&quot;: 1536 }</code></div>
        </div>
        <div class="poster__chips"><span class="poster__chip">FastAPI</span><span class="poster__chip">Python</span><span class="poster__chip">Embeddings</span></div>
      </div>`;
    }
    if (slug === 'graphic-design') {
      return `<div class="card__poster card__poster--graphic-design" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">POSTER &amp; VISUALS</span><span class="poster__badge">ART DIR</span></div>
        <div class="poster__swiss">
          <div class="poster__swisstop">TYPOGRAPHIC SYSTEM</div>
          <div class="poster__swissbig">DESIGN</div>
        </div>
        <div class="poster__chips"><span class="poster__chip">Brutalist</span><span class="poster__chip">Posters</span><span class="poster__chip">Creative</span></div>
      </div>`;
    }
    if (slug === 'brand-identity') {
      return `<div class="card__poster card__poster--brand-identity" aria-hidden="true">
        <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">IDENTITY SYSTEM</span><span class="poster__badge">BRAND</span></div>
        <div class="poster__brand">
          <div class="poster__swatches">
            <span class="poster__color poster__color--1"></span>
            <span class="poster__color poster__color--2"></span>
            <span class="poster__color poster__color--3"></span>
            <span class="poster__color poster__color--4"></span>
          </div>
          <div class="poster__specimen">Aa &middot; Display &middot; Sans &middot; Mono</div>
        </div>
        <div class="poster__chips"><span class="poster__chip">Design System</span><span class="poster__chip">Guidelines</span><span class="poster__chip">Color Theory</span></div>
      </div>`;
    }
    return `<div class="card__poster" aria-hidden="true">
      <div class="poster__head"><span class="poster__dot"></span><span class="poster__title">${esc(p.title)}</span></div>
      <div class="poster__generic">
        <span class="card__initials">${esc(initials(p.title))}</span>
        <span class="card__stack">${esc(p.stack)}</span>
      </div>
    </div>`;
  }

  function cards(list = CONTENT.projects) {
    const host = $('#cards');
    host.innerHTML = list.map((p) => `
      <article class="card" data-layer="card" data-slug="${p.slug}" tabindex="0" role="link" aria-label="${esc(p.title)} — open project details">
        <div class="card__media" data-layer="image">
          <img class="card__img" src="${p.img}" alt="" loading="lazy" decoding="async" onerror="this.remove()">
          ${posterHTML(p)}
          <span class="card__tag" data-layer="chip">${esc(p.tag)}</span>
        </div>
        <div class="card__row">
          <span class="card__n" data-layer="text">${p.n}</span>
          <div class="card__txt">
            <h3 class="card__title" data-layer="text">${esc(p.title)}</h3>
            <p class="card__meta" data-layer="text">${esc(p.meta)}</p>
          </div>
          <span class="card__arrow" data-layer="icon">↗</span>
        </div>
      </article>`).join('');
    const c = $('#seeAllLabel'); if (c) c.textContent = `SEE ALL (${list.length}) •`;
  }

  function stack() {
    $('#stackRow').innerHTML = CONTENT.stack.map(([label, slug, hex]) => `
      <li class="logo" data-layer="logo">${iconHTML(label, slug, hex, 'logo__ico')}<span class="logo__name">${esc(label)}</span></li>`).join('');
  }

  function highlights() {
    $('#highlights').innerHTML = CONTENT.highlights.map(([t, s, m, u, link], i) => `
      <li><a class="hl" href="${link}" target="_blank" rel="noopener">
        <i class="hl__line" data-layer="line"></i>
        <span class="hl__n" data-layer="text">${pad(i + 1)}</span>
        <span class="hl__body"><b class="hl__title" data-layer="text">${esc(t)}</b><span class="hl__sub" data-layer="text">${esc(s)}</span></span>
        <span class="hl__metric"><b class="hl__val" data-layer="text" data-metric="${esc(m)}">${esc(m)}</b><span class="hl__unit" data-layer="text">${esc(u)}</span></span>
      </a></li>`).join('');
  }

  function education() {
    $('#education').innerHTML = CONTENT.education.map(([t, s, tag]) => `
      <li class="edu__row">
        <div class="edu__txt"><b class="edu__title" data-layer="text">${esc(t)}</b><span class="edu__sub" data-layer="text">${esc(s)}</span></div>
        ${tag ? `<span class="edu__tag" data-layer="chip">${esc(tag)}</span>` : ''}
      </li>`).join('');
  }

  function toolkit() {
    $('#toolkit').innerHTML = CONTENT.toolkit.map((t) => `<li class="chip" data-layer="chip">${esc(t)}</li>`).join('');
    $('#software').innerHTML = CONTENT.software.map(([label, slug, hex]) => `
      <li class="tile" data-layer="logo" title="${esc(label)}">${iconHTML(label, slug, hex, 'tile__ico')}</li>`).join('');
  }

  function process() {
    $('#process').innerHTML = CONTENT.process.map(([n, t, d]) => `
      <li class="step">
        <span class="step__n" data-layer="text">${n}</span>
        <i class="step__node" data-layer="shape"></i>
        <div class="step__txt"><h4 class="step__title" data-layer="text">${esc(t)}</h4><p class="step__desc" data-layer="text">${esc(d)}</p></div>
      </li>`).join('');
  }

  function timeline() {
    $('#timeline').innerHTML = CONTENT.timeline.map(([date, role, sub, desc], i) => `
      <li class="tl__item${i === 0 ? ' is-open' : ''}">
        <span class="tl__date${i === 0 ? ' is-now' : ''}" data-layer="text">${esc(date)}</span>
        <div class="tl__main">
          <button class="tl__head" type="button" aria-expanded="${i === 0}" aria-controls="tl-p${i}" id="tl-h${i}">
            <span class="tl__titles"><span class="tl__role" data-layer="text">${esc(role)}</span><span class="tl__sub" data-layer="text">${esc(sub)}</span></span>
            <span class="tl__plus" data-layer="icon" aria-hidden="true">+</span>
          </button>
          <div class="tl__panel" id="tl-p${i}" role="region" aria-labelledby="tl-h${i}"><div class="tl__inner">
            <p class="tl__desc"${i === 0 ? ' data-layer="text"' : ''}>${esc(desc)}</p>
          </div></div>
        </div>
      </li>`).join('');
  }

  function milestones() {
    $('#milestones').innerHTML = CONTENT.milestones.map(([t, y, link], i) => `
      <li><a class="ms" href="${link}" target="_blank" rel="noopener">
        <span class="ms__n" data-layer="text">${pad(i + 1)}</span>
        <span class="ms__t" data-layer="text">${esc(t)}</span>
        <span class="ms__y" data-layer="text">${esc(y)}</span>
        <span class="ms__a" data-layer="icon">↗</span>
      </a></li>`).join('');
  }

  function all() { cards(); stack(); highlights(); education(); toolkit(); process(); timeline(); milestones(); }
  return { all, cards, esc };
})();
if (typeof module !== 'undefined') module.exports = Render;
