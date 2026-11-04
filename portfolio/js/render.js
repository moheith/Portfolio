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

  function cards(list = CONTENT.projects) {
    const host = $('#cards');
    host.innerHTML = list.map((p) => `
      <article class="card" data-layer="card" data-slug="${p.slug}" tabindex="0" role="link" aria-label="${esc(p.title)} — open project details">
        <div class="card__media" data-layer="image">
          <img class="card__img" src="${p.img}" alt="" loading="lazy" decoding="async" onerror="this.remove()">
          <span class="card__initials" aria-hidden="true">${esc(initials(p.title))}</span>
          <span class="card__stack" aria-hidden="true">${esc(p.stack)}</span>
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
