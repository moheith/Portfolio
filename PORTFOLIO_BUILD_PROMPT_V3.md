# AUTONOMOUS BUILD BRIEF — "MAYURA." portfolio with an AI-Agent-Swarm build-in intro

> **Read this whole document before writing a single line of code.** It is written for an autonomous coding agent with a very large context window that will run unattended (for example under a `/goal` command). It contains the finished, already-tested engine code, the complete HTML, the complete data files, exact specs for everything you still have to write, and the commands that prove your work is correct. **You are not expected to design anything from scratch or to ask questions. Where this brief gives you code, copy it exactly. Where it gives you a spec, implement the spec literally.**

You are a senior creative front-end engineer. Build the complete, production-quality, single-page personal portfolio website of **Mohieth Mayura S Y ("Mayura")** — Full Stack Developer, UI designer and graphics designer from Bengaluru, India — as a folder called `portfolio/`. It is a faithful recreation of a reference site (a dark, cinematic, red-accented video-editor portfolio) adapted to Mayura's real work, plus extra "god-level" features.

**The signature feature (top priority):** when the page loads, a swarm of 18 → 30 small pastel arrow cursors ("AI agents") visibly **builds the entire page in front of the visitor in about 50 seconds**, Figma-style. Cursors fly to each element, drag out blue selection boxes with white corner handles and live `W × H` size labels, resize and move them, switch to I-beam cursors and type the text in letter by letter, double-click to select text and retype it, fix typos, fill image placeholders that then blur-in, outline cards and logos in red, drop snap guides and rulers, commit each section with a blue sweep line, and finally swirl in a ring around the contact card while a bottom control bar announces **"Rebuilt by 30 agents in 51.4s  [Go live] [Replay]"**. The engine that does all of this is **already written and tested** (Part 5). Your job is to build the website around it so that the effect works perfectly on the real page.

**Contents:** Part 0 Operating mode · 1 Reference, owner, mapping · 2 File tree · 3 Tokens & typography · 4 Layer system & geometry contract · **5 The Agent Swarm (timeline, cursor/box/typing specs, choreography bible, VERBATIM engine)** · 6 Class-by-class styling spec · 7 Extras · 8 JS module contracts (+ VERBATIM main.js) · 9 Data & markup (VERBATIM) · 10 Tests (VERBATIM) · 11 Definition of done · 12 README / final report.

---------------------------------------------------------------------
## PART 0 — OPERATING MODE (READ FIRST, FOLLOW STRICTLY)

### 0.1 Autonomy rules
1. **Never ask the user anything.** There is no "stage 1 / reply NEXT". Work from the first instruction to the Definition of Done (Part 11) in one continuous run. When something is ambiguous, choose the most reasonable option, keep going, and write the decision into `ASSUMPTIONS.md`.
2. **Write real files to disk** inside `portfolio/` (do not just print code). Create folders as needed. Every file must be complete and runnable — no `...`, no "rest of the code here", no "similar to above".
3. **Copy-exact files.** The files marked **VERBATIM** in Part 2 appear in full in this brief (Parts 5 and 9). Write them to disk **byte-for-byte** (use the code block contents exactly; do not reformat, rename, re-indent or "improve" them). They have been tested together; changing them is the most common way to break the effect. You may only change the documented tuning knobs (Part 5.10) after the tests pass.
4. **Spec-driven files.** The files marked **WRITE** in Part 2 are yours to write, following the specs in Parts 3, 4, 6, 7 and 8. The specs name every class, id, global and function you must use so that your files plug into the verbatim files without guessing.
5. **No build step, no frameworks.** Plain HTML + CSS + vanilla JS. Only the CDN libraries listed in 0.3 are allowed. The site must work by double-clicking `index.html` **and** from a static server.
6. **English only.** There is **no language switcher and no translations**. Do not add Kannada, Hindi, Indonesian or any other language. Do not load Noto Sans Kannada/Devanagari.
7. Code style: clear comments, CSS custom properties for every colour/size, BEM-style class names (the HTML already uses them), no inline styles except dynamic positions.

### 0.2 Order of work (phases, each ends with a GATE you must pass before continuing)
| Phase | What you do | GATE (must be true to continue) |
|---|---|---|
| **P0 Setup** | Create `portfolio/` and the folder tree from Part 2. Check that Node, Python 3 and Playwright with Chromium are available (`node -v`, `python3 -V`, `node -e "require('playwright')"`). If Playwright is missing: `npm i -D playwright && npx playwright install chromium`. Copy the provided photo into `assets/img/` (Part 1.4). | Tools available |
| **P1 Verbatim files** | Write every VERBATIM file exactly (Part 5.9, Part 9). Write `tokens.css` (Part 3) and the small boilerplate files (manifest, favicon). | `node --check` passes on every `.js` file; JSON/HTML well-formed |
| **P2 CSS** | Write `base.css`, `layout.css`, `components.css` for the **existing markup** using the class-by-class spec in Part 6, plus the layer-geometry contract in Part 4.2. | Static layout check (`node tests/layout-check.js`) passes; you have **looked at screenshots** at 1440, 1024, 390 px and they match Part 6 |
| **P3 JS modules** | Write `scroll.js`, `cursor.js`, `hero.js`, `work.js`, `compare.js`, `journey.js`, `extras.js` to the API contracts in Part 8. `main.js` is provided verbatim. | No console errors with `?swarm=off`; every interaction in Part 7 works |
| **P4 Swarm integration** | Run the swarm against the real page. Fix **your** CSS/JS (never the engine) until `node tests/swarm-check.js` passes and the screenshots match Part 5.1. | `ALL CHECKS PASSED` |
| **P5 Polish + QA** | Accessibility, performance, SEO, responsive pass, README, ASSUMPTIONS. | Checklist in Part 11 fully ticked |
| **P6 Report** | Print the final report (Part 12). | — |

### 0.3 Allowed external resources
- GSAP 3.12.5 + ScrollTrigger: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` and `.../ScrollTrigger.min.js`
- Lenis 1.1.13: `https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js`
- Google Fonts: Anton, Plus Jakarta Sans (300–800), Nothing You Could Do, Caveat, Inter (already linked in `index.html`).
- Tech logos: `https://cdn.simpleicons.org/<slug>/<hex>` (already handled by `render.js` with a text-wordmark fallback).
- **Everything must still look correct if every one of these fails to load** (offline, blocked CDN). GSAP/Lenis are always accessed through guarded code (`window.gsap && …`). The tests run with all external requests blocked; this is deliberate.

### 0.4 The build–verify loop (this is how you work, always)
After **every** phase:
1. Run the checks named in the gate (commands in Part 10).
2. **Look at the screenshots yourself** (open the PNG files with your image-reading tool). Compare them with the descriptions in Parts 5 and 6. Do not trust a passing script alone for visual work.
3. If anything is off, fix it, re-run, re-look. Keep iterating until the gate is genuinely true. There is no iteration limit; there is a quality bar.
4. Keep a short running log in `BUILD_LOG.md` (what you built, what you fixed, what you decided).

### 0.5 What "done" means
The Definition of Done (Part 11) is the only finish line. When every item is ticked, print the final report (Part 12) and stop.

### 0.6 Things in the reference video that are NOT part of the site (ignore)
Browser tabs / address bar, Windows taskbar, weather widget, "Show hidden icons" tooltip, taskbar thumbnails.

---------------------------------------------------------------------
## PART 1 — THE REFERENCE LOOK, THE OWNER, AND THE MAPPING

### 1.1 What the reference looks like
Near-black background; huge condensed white headlines with a **red/coral accent word**; a giant red-gradient word behind a cut-out portrait; thin hairline dividers; tiny uppercase tracked micro-labels; red numerals; generous spacing. It feels like a movie title sequence. It is a single page with hash links. Section order: **Nav → Hero (giant "PORTFOLIO" + cut-out photo + name + stats) → 01 Selected Work (filter tabs + card slider) → tech-logo strip → Proof of Work → From Sketch to Shipped (before/after slider) → 02 Behind the Code → 03 The Journey → 04 Let's Build (contact) → Footer.**

### 1.2 The owner — facts to use exactly
- **Full name:** Mohieth Mayura S Y. **Short name in logo/hero:** MAYURA. **Initial:** M. Online handle: moheith.
- **Role:** Full Stack Developer & Designer; also a graphics designer. **Open to work: yes.**
- **City:** Bengaluru, Karnataka, India (timezone Asia/Kolkata, "IST").
- **Education:** SFGC — Bachelor of Computer Applications (BCA).
- **Experience:** 4+ years. **Projects:** 10+. **Awards: none** (the reference's awards section becomes "Proof of work").
- **Creative/game tools he uses:** **Unity, Blender, Krita, Live2D** (they appear in the toolkit chips, the software tiles, the tech marquee and the journey).
- **Contact:** email `moheithmayura@gmail.com` · phone/WhatsApp `+91 86602 27877` (wa.me number `918660227877`) · Instagram `@moheith_mayura` (confirmed) · GitHub `github.com/moheith` · LinkedIn `linkedin.com/in/mohieth` · Hugging Face `huggingface.co/moheith` · Ollama `ollama.com/moheith` · X `x.com/mohiethh`. The main contact CTA opens **WhatsApp**.
- **Live projects:** Yulya (Discord AI companion) → `https://discord.yulya.me`; Yulya Studio → `https://studio.yulya.me` (repo `github.com/moheith/Studio`).
- **No CV yet:** the "Download CV" / "Resume" links point at `assets/Mayura-CV.pdf` (does not exist); if the file is missing show the toast "CV coming soon". **No showreel:** replaced by "View live project ↗". **Domain not bought yet:** `https://YOURDOMAIN.com` placeholders (README explains how to replace).
- **Do NOT include:** any language switcher, Kannada, Hindi, Indonesian, or the words "RENANDO", "VFX" or "video editor" (those belong to the reference owner).

### 1.3 Mapping: reference section → this site
| Reference | This site |
|---|---|
| Hero "PORTFOLIO" + name + EDITOR & VFX ARTIST | Hero "PORTFOLIO" + **MAYURA.** + FULL STACK DEV & DESIGNER |
| Play showreel | **View live project ↗** (opens discord.yulya.me) |
| Selected Work (VFX / Film / 3D video cards) | Selected Work (All · Full-Stack · AI / ML · Discord · Web Apps · Design · Open Source); cards open a project-detail modal |
| Client logos "BEEN PART OF" | Tech marquee "BUILT WITH / THE TOOLS I SHIP WITH." |
| Recognition & Awards | **Proof of work** "THE CODE. THE PROOF." (10+ projects + six real metrics) |
| From Raw. To Real. | **From Sketch. To Shipped.** (wireframe vs final UI of Yulya Studio) |
| Behind the Frames | **Behind the Code** |
| The Journey (jobs) | The Journey (self-taught → shipped products), accordion |
| Your Next Story + preview card | Let's work together + poster card + WhatsApp quick-brief bar |

### 1.4 Provided assets
`hero-cutout.png` (1086×1448, transparent, edges softly faded left/right/bottom) and `hero-cutout.webp` are provided alongside this brief. Look for them in the same folder as this brief (or the current working directory) and copy both to `portfolio/assets/img/`. If you cannot find them, continue anyway (the inline SVG silhouette fallback is used) and note it in `ASSUMPTIONS.md`. **Everything else (project screenshots `work-01.jpg … work-11.jpg`, `raw-final.jpg`, `raw-wireframe.jpg`, `og.jpg`, the CV) is NOT provided**: the site must look excellent without them using the CSS gradient fallbacks specified in Part 6, and the README explains how to add them later. Never output a broken `<img>`; all `<img>` already have `onerror` handling in the verbatim markup/render code.

---------------------------------------------------------------------
## PART 2 — FILE TREE AND PROVENANCE (create exactly this)

```
portfolio/
├─ index.html                 VERBATIM  (Part 9.3)
├─ manifest.webmanifest       VERBATIM  (Part 3.3)
├─ README.md                  WRITE     (Part 12.2)
├─ ASSUMPTIONS.md             WRITE     (decisions you made)
├─ BUILD_LOG.md               WRITE     (running log)
├─ css/
│  ├─ tokens.css              VERBATIM  (Part 3.1)
│  ├─ base.css                WRITE     (reset, typography, utilities — Part 4)
│  ├─ layout.css              WRITE     (nav, sections, grids — Part 6)
│  ├─ components.css          WRITE     (cards, tabs, chips, buttons, modal, palette, toast, compare — Part 6)
│  └─ swarm.css               VERBATIM  (Part 5.9)
├─ js/
│  ├─ content.js              VERBATIM  (Part 9.1)
│  ├─ render.js               VERBATIM  (Part 9.2)
│  ├─ swarm.js                VERBATIM  (Part 5.9)   ← the engine
│  ├─ hud.js                  VERBATIM  (Part 5.9)
│  ├─ main.js                 VERBATIM  (Part 8.1)
│  ├─ scroll.js               WRITE     (Part 8.2)  Lenis + ScrollTrigger + spy + playhead + Reveals
│  ├─ cursor.js               WRITE     (Part 8.3)  site cursor + magnetic buttons
│  ├─ hero.js                 WRITE     (Part 8.4)  fitText, parallax, spotlight, countUp, laurel
│  ├─ work.js                 WRITE     (Part 8.5)  filters, FLIP, search, slider, modal, marquee
│  ├─ compare.js              WRITE     (Part 8.6)  before/after slider
│  ├─ journey.js              WRITE     (Part 8.7)  accordion
│  └─ extras.js               WRITE     (Part 8.8)  palette, sound hint, accent switcher, idle companions, live stats, clock, easter eggs, toast
├─ tests/
│  ├─ swarm-check.js          VERBATIM  (Part 10.1)
│  ├─ layout-check.js         VERBATIM  (Part 10.2)
│  └─ css-coverage.js         VERBATIM  (Part 10.3)
└─ assets/
   ├─ img/    hero-cutout.png (PROVIDED)  hero-cutout.webp (PROVIDED)  [work-01…11.jpg, raw-final.jpg, raw-wireframe.jpg, og.jpg are added later by the owner]
   ├─ icons/  favicon.svg (VERBATIM Part 3.3)  apple-touch-icon.png (generate: Part 3.3)
   └─ (Mayura-CV.pdf is added later by the owner)
```

**Why VERBATIM matters:** `index.html` carries the `data-layer` tags, `render.js` carries the templates with their tags, `swarm.js`/`swarm.css`/`hud.js` are the tested engine, `main.js` wires the intro into the site. They fit each other exactly. Your CSS and the six other JS modules must adapt to **them**, never the other way round.

---------------------------------------------------------------------
## PART 3 — DESIGN TOKENS, TYPOGRAPHY, SMALL FILES

### 3.1 `css/tokens.css` (VERBATIM)
```css
/* css/tokens.css — design tokens only. Every colour/size used anywhere else comes from here. */
:root{
  /* surfaces */
  --bg:#07070a; --bg-2:#0d0d11; --surface:#121216; --surface-2:#18181e;
  --line:rgba(255,255,255,.07); --line-strong:rgba(255,255,255,.16);
  /* text */
  --text:#f5f5f7; --text-2:rgba(245,245,247,.78); --muted:#9a9aa6; --dim:#6b6b76;
  /* brand reds (the accent switcher in the footer rewrites --red --accent --btn --guide at runtime) */
  --red:#ff3b30;           /* hero giant word (top), big stat numerals, spines, handles */
  --red-deep:#c8231f;      /* gradient middle */
  --accent:#ff4d5a;        /* coral accent word on the 2nd line of statement headings */
  --btn:#ef4337;           /* CTA buttons */
  --maroon:#2a0a12;        /* proof panel glow */
  /* swarm / build-UI colours (only the overlay uses these) */
  --blue:#2f8cff; --blue-pill:#0d99ff; --blue-fill:rgba(70,95,130,.85);
  --guide:#ff4d2d;         /* red snap-guide lines + red outlines for cards/logos */
  --hud-bg:rgba(16,18,22,.92);
  --a1:#5eead4; --a2:#fb923c; --a3:#ffffff; --a4:#a78bfa; --a5:#7dd3fc; --a6:#fda4af; --a7:#fcd34d; --a8:#86efac;
  /* type */
  --f-display:'Anton','Bebas Neue',Impact,'Arial Narrow',sans-serif;
  --f-body:'Plus Jakarta Sans','Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  --f-ui:'Inter',system-ui,sans-serif;
  --f-script:'Nothing You Could Do','Caveat',cursive;
  /* layout */
  --nav-h:64px; --pad:clamp(20px,4vw,64px); --maxw:1440px;
  --ease:cubic-bezier(.22,1,.36,1); --ease-io:cubic-bezier(.65,0,.35,1);
  /* z-index scale */
  --z-hero-word:1; --z-hero-photo:2; --z-hero-text:3; --z-grain:40; --z-nav:50; --z-playhead:45; --z-modal:80; --z-palette:90; --z-cursor:95; --z-swarm:9999;
}
```

### 3.2 Typography rules (use in `base.css`)
- **Display headings** — Anton, UPPERCASE, `line-height:.9`, `letter-spacing:-0.01em`. Used by `.h-display` (statement headings), `.hero__giant`, `.hero__name`, big numerals (`.stat__n`, `.card__n`, `.proof__num`, `.hl__val`, `.step__n`), `.poster__title`. The second line / accent word is `var(--accent)` (class `.accent`). Section H2 size `clamp(44px, 6vw, 96px)`; `.h-display--sm` = `clamp(32px,3.4vw,52px)`; `.h-display--xl` = `clamp(56px,7.5vw,120px)`.
- **Bold-grotesk headings** — Plus Jakarta Sans 800, UPPERCASE, `letter-spacing:-0.045em`, `line-height:1`. Used by `.h-bold` (`clamp(40px,5.2vw,84px)`), `.h-bold--sm` (20px), `.h-bold--one` (forced single line on desktop), card/highlight/role titles.
- **Eyebrow / micro-label** — Inter 11px, 700, UPPERCASE, `letter-spacing:.14em`, `var(--muted)`. `.eyebrow--red` is `var(--red)`; `.label-red` same with 10px.
- **Body** — Plus Jakarta Sans 400, 15–16px, line-height 1.6, `var(--text-2)`.
- **Script** — `var(--f-script)` for "Hello, I'm" (44px, rotate(-4deg)) and the signature "Mayura" (34px).
- Hairline dividers: 1px `var(--line)` between sections. Section vertical padding `clamp(96px,12vw,160px)`; horizontal `var(--pad)`; content max-width `var(--maxw)` centred.
- Selection colour: `::selection{background:var(--red);color:#fff}`. Scrollbar: 8px thumb `rgba(255,255,255,.18)`.
- `html{scroll-behavior:auto}` — **never** `smooth` (Lenis and the swarm drive scrolling; CSS smooth scroll fights them).

### 3.3 Small files
`assets/icons/favicon.svg` (VERBATIM):
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#ff3b30"/><text x="32" y="47" text-anchor="middle" font-family="Anton,Impact,'Arial Narrow',sans-serif" font-weight="900" font-size="44" fill="#fff">M</text></svg>
```
`manifest.webmanifest` (VERBATIM):
```json
{
  "name": "Mayura — Full Stack Developer & Designer",
  "short_name": "Mayura",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#07070a",
  "theme_color": "#07070a",
  "icons": [{ "src": "assets/icons/favicon.svg", "sizes": "any", "type": "image/svg+xml" }, { "src": "assets/icons/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }]
}
```
Generate `assets/icons/apple-touch-icon.png` (180×180) by rendering the SVG with Playwright:
```bash
node -e "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:180,height:180}});await p.setContent('<body style=margin:0><img src=\"file://'+process.cwd()+'/assets/icons/favicon.svg\" width=180 height=180>');await p.screenshot({path:'assets/icons/apple-touch-icon.png'});await b.close()})()"
```
(run it from inside `portfolio/`). If that fails for any reason, skip it and note it in `ASSUMPTIONS.md`.

---------------------------------------------------------------------
## PART 4 — GLOBAL SYSTEMS AND THE LAYER-GEOMETRY CONTRACT

### 4.1 The "layer" system (already in the markup — understand it)
Every individually visible piece of the page carries `data-layer="<type>"` where type ∈ `text | chip | button | image | card | logo | icon | line | input | shape`. The swarm builds layers one by one. The gate in `swarm.css`:
```css
html.is-building [data-layer]:not(.is-built){visibility:hidden}
html.is-building [data-layer].is-built{visibility:visible}   /* a built child shows even if its card/shape parent is still hidden */
```
`<html class="is-building">` is set in the HTML from first paint and removed by `main.js` when the intro ends (or is skipped). A 4-second inline fail-safe in `<head>` removes it if the engine never starts, so the page can never stay invisible.

| type | what it is in this site | how the swarm builds it |
|---|---|---|
| `text` | headings (each line separately), paragraphs, labels, numerals, links' text | box → type letter by letter (some get select-and-retype / typo-fix) |
| `chip` | small tags, filter-like pills, toolkit chips, `WIREFRAME`/`FINAL UI` labels | box → quick typing |
| `button` | `.btn`, the poster's red circle | box → optional colour-swatch pick → red fill → reveal |
| `image` | hero portrait, card media, the compare slider | box (sometimes resized) → blue-grey placeholder + progress → blur-in |
| `card` | project cards, the quote card, the poster | RED outline box (sometimes dragged into place) → rise-in |
| `shape` | dots, nodes, panels, accent bars | box → red fill → fade-in |
| `icon` | arrows, small glyphs, social icons, `+` | crosshair click → pop-in |
| `line` | 1px hairlines and spines | dragged out along the line → wipe |
| `input` | search field, quick-brief field | box → I-beam click → placeholder typed → fade-in |
| `logo` | tech logos / tiles | long chain of small RED boxes ~120 ms apart → pop-in |

Rules the markup already follows (keep them if you ever touch it): tag leaf elements; each heading **line** is its own `text` layer; `text`/`chip` layers contain **plain text only** (no child elements); containers with a visible background/border (`card`, `shape`) may contain other layers; collapsed accordion content is not tagged; marquee clones are **not** tagged (they are created after the intro).

### 4.2 THE LAYER-GEOMETRY CONTRACT (put this in `base.css` — the intro depends on it)
The selection boxes are drawn around each element's real rectangle, so the rectangles must be sensible and **stable** while the page is built:
```css
/* 1. Text/chip layers hug their text and are never display:inline (an inline box has no stable height to select) */
[data-layer="text"],[data-layer="chip"]{display:block;width:fit-content;max-width:100%}
a > [data-layer="text"], span[data-layer="text"], b[data-layer="text"], small[data-layer="text"]{display:block}
/* when a text layer sits INSIDE a flex row where it must stay inline-level, use inline-block instead of block: */
.nav__links a > span, .nav__right [data-layer="text"], .link-all [data-layer], .link-red [data-layer], .btn__label{display:inline-block}
/* 2. Layers are never display:none while the intro is running; collapsed content is simply not tagged */
/* 3. While building: nothing may move on its own */
html.is-building .hero__giant, html.is-building .hero__photo, html.is-building [data-parallax]{transform:none !important}
html.is-building .logos__row{animation:none !important;transform:none !important}
html.is-building *{scroll-behavior:auto !important}
html.is-building .card, html.is-building .btn, html.is-building a{transition:none}
/* 4. The typed-span trick needs normal inline text flow: do not use letter-spacing animations, text-transform changes or
      white-space:pre on text layers, and do not give text layers padding that changes while typing */
/* 5. Gradient text (the giant word) must use background-clip:text on the layer itself — it is revealed with a clip-path wipe, never typed */
```
`node tests/layout-check.js` verifies rules 1 and 2 (no `display:inline` text layers, no children inside text layers, layer count 300–450, no horizontal scroll at 8 widths).

### 4.3 Smooth scroll (`scroll.js`)
Lenis (lerp .09) driving GSAP ScrollTrigger: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)`. `Scroll.stop()` is called by `main.js` before the swarm starts (the swarm scrolls with `window.scrollTo`); `Scroll.start()` after the intro. If Lenis/GSAP failed to load, fall back to native scrolling and `IntersectionObserver` — never throw.

### 4.4 Fixed nav (`.nav`)
Height 64px, `rgba(7,7,10,.8)` + `backdrop-filter:blur(14px)`, bottom hairline, z-index 50. Left: logo `MAYURA` (Anton 22px) + 6px red dot. Centre links (13px/500, white 80%): Work · Proof · About · Journey · Contact; the active link (scroll-spy, `[data-spy]`) is white with a 2px red underline (`.nav__underline`) that slides between links. Right: `▷ Motion off` toggle (11px muted), `Let's talk ›` (12px; chevron moves 4px on hover). ≤860px: links hide, `.nav__burger` shows and opens `#menu` (full-screen overlay, big Anton links stacking in).

### 4.5 Grain + vignette + playhead
`#grain` fixed full-screen canvas at 6% opacity redrawn ~12 fps (off in Motion-off); `.vignette` radial gradient (transparent centre → `rgba(0,0,0,.35)`), both `pointer-events:none`, z-index 40. `#playhead` = 2px red vertical line fixed at the far left (`#playheadFill` height = scroll %) with a mono readout `#playheadReadout` near the bottom-left (`042% · PROOF`).

### 4.6 Reveals (`Reveals` in `scroll.js`)
Used when the intro was skipped or aborted. Headings split by their `.line` children: each line slides up from 110% inside an `overflow:hidden` mask (0.9s, `--ease`, stagger .08s); paragraphs fade up 24px; images clip-reveal (`clip-path: inset(0 0 100% 0)` → `inset(0)` with scale 1.12 → 1). ScrollTrigger `start:'top 88%'`, `once:true`. **`Reveals.initQuiet()` (after a full swarm run) must not hide or animate anything** — everything was already built in front of the visitor; it only wires counters/hover. In Motion-off mode show everything instantly.

---------------------------------------------------------------------
## PART 5 — THE AGENT SWARM BUILD INTRO (THE MOST IMPORTANT PART)

The engine in 5.9 is finished and tested: in Chromium against the exact markup in Part 9 it builds all layers, ends in the "Rebuilt by 30 agents" state, and passes replay / abort / Go live / tour-pause / phone / reduced-motion checks. Sections 5.1–5.8 describe **what it does** so that you can (a) verify it visually, (b) make your CSS cooperate with it, and (c) tune it. **Do not rewrite it.**

### 5.1 What the visitor sees, second by second (1x speed; this is the reference timeline the engine reproduces)

| Time | What happens | HUD text |
|---|---|---|
| 0.0 – 0.8 s | Pure near-black screen. A faint giant **"M"** watermark (12% opacity) in the centre. **Two small flocks of 9 arrow cursors** drift around (one centred at 35% x / 60% y, one at 65% x / 45% y), each arrow rotating to its velocity. Every arrow has a different pastel colour. | `Scanning page…` + 90px indeterminate progress line + [Tour] [1x] [🔊] [✕] |
| 0.8 – 1.3 s | The flocks **scatter** to the left edge and the corners and turn into white **"+" crosshairs** and **I-beams** (alternating). **Rulers** (20px, ticks every 10px, numbers every 100px) fade in along the top and left; a bright **blue bar flashes along the top edge** (24px, glowing) and a thinner one along the left edge, then fade — the "page scan". | `18 agents · 0 / N layers` |
| 1.3 – 2.0 s | **Wireframe stage:** every nav + hero element gets a thin blue outline box at once (staggered 14 ms), each with a small blue pill showing its size (`1020 × 80`). The portrait area is a flat blue-grey rectangle. | counters start climbing |
| 2.0 – 6 s | Agents start claiming layers in reading order. Hero text is typed into blue boxes with I-beams; the giant word wipes in; the portrait gets resized, then blur-ins; the red CTA fills red; a **red snap-guide** runs full height at the content's left edge. ≈ 14 layers done by 6 s and ≈ 70 by 10 s. | `18–19 agents · 14 → 69 / N` |
| 6 – 16 s | The page **auto-scrolls** ("Touring"). Selected Work: heading typed, tabs typed one by one, search field typed, cards get RED outlines (some dragged into place), image placeholders blur in, titles typed. | 19 → 23 agents |
| 16 – 20 s | Tech strip: a long chain of small **red boxes** sweeps left → right (~120 ms apart), logos pop in. A thin **blue sweep line with a glowing white dot** travels along the bottom of each finished section. | 23 → 24 agents |
| 20 – 30 s | Proof of work: panel, two-line headline, `10+` (counts up) with laurels, six highlight rows (hairlines drawn, titles typed, red metrics). From Sketch to Shipped: image box resized, handle dragged into place, labels typed, then the compare slider runs its auto-demo. Rulers flash for ~1.2 s at the start of every new section. | 24 → 28 agents |
| 30 – 42 s | About: headings, paragraph, education rows, toolkit chips typed in quick succession, software tiles (red chain), process spine dragged down, nodes dropped (moved into place), red quote card rises. Journey: heading, vertical red spine dragged, dated rows typed, `+` crosshair icons clicked, milestones. | 28 → 29 agents |
| 42 – 50 s | Contact: huge heading, paragraph, CTA, four contact rows, the poster card (red outline), quick-brief field typed, footer (hairline, socials, accent dots, replay link). | 29 → 30 agents |
| 50 – 52 s | **Finale.** The last agents join (always 30), the page scrolls so the poster card is centred, **all cursors orbit the poster card in a breathing ring** (arrows tangent to the circle), five peel away to the top-right. HUD morphs. | `Rebuilt by 30 agents in 51.4s` (real number) + full bar + [🔊] [Go live] [Replay] [✕] |

Agent count timeline: 18 at start → 19 at ≈6 s → 23 at ≈12 s → 24 at ≈17 s → 28 at ≈31 s → 29 at ≈39 s → 30 at ≈48 s (`cfg.joins`, scaled by `targetSeconds / 51.4`). New agents fly in from a random screen edge.
Measured in the test harness at 1x: **built layers ≈ 14 @6 s, 69 @10 s, 159 @14 s, 191 @18 s, 226 @26 s, 285 @34 s, 347 @42 s, 379 @46 s, finale at ≈ 47–51 s** (total ≈ 382 layers). Your real page should land in the same band: **finale between 44 s and 56 s at 1x**.

### 5.2 Agent cursor look
- A `div.sw-cursor` (22×22) holding three inline SVGs, shown by `data-mode`:
  - **arrow** — path `M3 2 L3 19 L7.6 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.6 L16.6 13.6 Z`, fill = the agent's colour (cycle `#5eead4 #fb923c #ffffff #a78bfa #7dd3fc #fda4af #fcd34d #86efac`), 1.4px white stroke, `drop-shadow(0 2px 4px rgba(0,0,0,.55))`. Its tip is the hotspot.
  - **cross** — white 1.6px "+" (14px) with a thin coloured core, hotspot at the centre.
  - **ibeam** — white 1.6px I-beam 16px tall, hotspot at the centre.
  - **grab** — the arrow, squashed to 0.82 on click (used when dragging a box into place).
- Flight: quadratic bezier with a random control point (±110px), ease-in-out cubic, 320–950 ms (`260 + distance·0.5`), the arrow leans toward its heading (`sin(π·t)` × 0.3) and settles to 0° on arrival.
- Clicks: the cursor squashes for 140 ms and a blue **ripple ring** expands from its tip (a double-click = two ripples 70 ms apart).
- Idle agents (nothing to claim) drift like a flock: random acceleration + a weak pull to where they stopped, speed capped at 1.6 px/frame, arrow rotating to velocity.

### 5.3 Ghost box (selection box) look
- 1px solid `--blue` outline, no radius, four white 6×6 squares with 1px blue border centred on the corners, a **size pill** under the box centred (`--blue-pill` background, white 10px/700 Inter, 3px radius, content `W × H`, live while drawing/resizing; hidden while the box is < 4 px).
- Kinds: `text`/`chip` → blue outline only; `image` → also gets `.is-placeholder` (flat `rgba(70,95,130,.85)` fill + tiny image icon + a 3px progress bar); `button`/`shape` → `.is-filled` (`rgba(240,69,58,.9)`); `card`, `logo` and big panels → **red** (`--guide`) outline, handles and pill; `icon`/`logo` boxes hide the pill.
- Draw animation: the cursor starts on the top-left corner and drags to the bottom-right while the box grows 0 → 100% (300 ms, ease-out-cubic). The box follows its element every frame (the page scrolls during the tour). When done the real element becomes visible and the box fades out in 280 ms.

### 5.4 Text typing — the "typed span + hidden rest + zero-width caret" trick
While a `text` layer is typed, its content is `<span>typed</span><i class="sw-caret"></i><span class="sw-rest">remaining</span>`. The hidden remainder keeps the **final layout from the first character** (no reflow, so the selection box never lies). The caret is an inline element with a 1.5px left border and `margin-right:-1.5px` (zero net width, and — unlike an inline-block — it creates no wrap opportunity mid-word). The element's `min-width/min-height` are pinned to its measured size for the duration. The I-beam cursor tracks the caret rectangle (+8 px) with a 0.55 lerp. Speed 32 ms/character (chips 22), total clamped to 180–1900 ms (long paragraphs are typed faster per character). Graphemes are handled with `Array.from`.
**Select-and-edit passes** (the part of the effect that makes it look like real people editing): 34% of text layers with ≥10 characters (never chips) get one of two edits, chosen by a seeded random (so a replay looks identical):
1. **Replace** (text ≥16 chars, 50% of edits): type a *draft* (`Lorem ipsum dolor sit amet…` sliced to 55% of the length; `Title here` for very short text) → pause 180 ms → **double-click** (squash + 2 ripples) → the whole draft is highlighted blue (`.sw-sel`) for 280 ms → **Delete** (empty field + caret, 170 ms) → type the real text.
2. **Fix a typo:** type the real text but with two letters swapped in one middle word of ≥5 letters (`STACK→STCAK`, `SELECTED→SEELCTED`, `Ollama→Olalma`) → pause 240 ms → the I-beam jumps to the wrong word, **double-click** selects it (blue highlight, 260 ms) → delete it → retype the word correctly at 60 ms/char → continue.
After any pass `finish()` restores the element to plain text (`el.textContent = full`) so no spans or carets ever survive.

### 5.5 Snap guide, rulers, scan bars, section-commit sweep
- **Guide:** one 1.5px full-height `--guide` line (opacity .9) at the left edge of the content of the section that has just started (sections with `data-guide="left"`); fades in 200 ms; after the section commits it fades out in 400 ms.
- **Rulers:** `#sw-ruler-top` (20px) and `#sw-ruler-left` (20px), background `rgba(28,36,51,.88)`, 1px ticks every 10px, taller every 100px (repeating `linear-gradient`), 8px labels every 100px (left-ruler labels follow the scroll offset). Shown 2.6 s at the start and 1.2 s at the start of every new section (not for nav/hero). Hidden on ≤640px.
- **Scan bars:** at the end of the scan, `#sw-scan-top` (24px, blue gradient + glow) and `#sw-scan-left` (12px) flash once (0.9 s).
- **Section-commit sweep:** when the last layer of a section is built, a 2px line (`linear-gradient(90deg, transparent, var(--blue))`) with an 8px glowing white dot at its leading end moves left → right (700 ms) along the section's bottom edge (clamped inside the viewport), then fades. Optional whoosh sound.

### 5.6 HUD control bar (`js/hud.js`, `#sw-hud`)
Fixed bottom centre (24px up), height 40px, pill radius, `--hud-bg` + blur(12px), 1px `rgba(255,255,255,.08)` border, Inter 11px/500 `#cfd3da`. Three states:
1. **Scanning:** `Scanning page…` + indeterminate 90px track + ghost **Tour** + `1x` + speaker + ✕.
2. **Building:** overlapping avatar stack (5 coloured dots) · `18 agents` · divider · `137 / 364 layers` · 72×3px track (blue fill) · blue pill **Touring** (`#2563eb`, 24px high, 6px radius) · `1x` · speaker · ✕.
3. **Done:** `Rebuilt by 30 agents in 51.4s` (real count and wall-clock seconds) · wide full track · speaker · blue **Go live** · ghost **Replay** · ✕.
Buttons: **Tour/Touring** toggles auto-scroll (any manual wheel/touch/keyboard scroll pauses it and the pill becomes ghost "Tour"); **1x** cycles 1x → 2x → 4x → 0.5x (everything is driven by a virtual clock, so speed changes are seamless); **speaker** toggles the synthesized sound (default OFF); **✕** aborts instantly (every layer revealed, overlay removed); **Go live** flies the cursors off, smooth-scrolls to the top, removes the overlay (`end` event `'live'`); **Replay** resets every layer and runs again (identical choreography thanks to the seeded RNG). `aria-live="polite"` on the bar.

### 5.7 THE CHOREOGRAPHY BIBLE — exactly what every cursor does, per element type
(All durations are base values at pace 1; the pace controller multiplies them by ≈1.1–2.7 and never stretches one action beyond ≈2.2 s.)

**A. The universal beat sheet for one layer**
1. **CLAIM** (instant). The agent takes the unclaimed layer with the best score inside the visible window `[scrollY − 90, scrollY + 0.98·viewport]` where `score = (layerTop − windowTop) + 0.32 · distanceFromAgent + 0.01·readingIndex` (reading order first, nearby second). If nothing is claimable it becomes an idle flock member and re-checks every 110 ms. If no agent has claimed anything for 1.6 s (e.g. the visitor scrolled away) the window opens to the whole page and far layers simply appear.
2. **FLY** (320–950 ms) — arrow cursor, curved bezier flight to the layer's top-left corner (the target is re-read every frame, so it tracks the scrolling page).
3. **DRAW** (≈300 ms) — cursor becomes a **crosshair**; a box is created at 0×0 at the top-left corner and dragged to the bottom-right corner (ease-out-cubic), the cursor pinned to the moving corner, the pill counting up `0 × 0 → W × H`.
4. **RESIZE / MOVE variant** (optional, see C) — a second gesture that corrects the box.
5. **FILL / TYPE** — type-specific (B).
6. **REVEAL** — the real element gets `.is-built` (+ an entrance class); the box fades out; counters, `layer` event, section progress.
7. **RELEASE** — the cursor returns to arrow mode and immediately claims the next layer.

**B. Per-type scripts**
- **text** — beats 1-3 → cursor becomes an **I-beam** at the caret → type letter by letter (5.4), possibly with an edit pass → box fades. A text layer with `data-swarm="wipe"` (the giant gradient word) is not typed: after drawing a (resized) box the cursor turns back to an arrow and the element is revealed with a left → right clip-path wipe (0.5 s).
- **chip** — same as text but 22 ms/char and never edited.
- **image** — DRAW with the **resize** variant for big images (50%): the box is first dragged to ≈60–72% of its size, the cursor holds 150 ms, clicks the bottom-right handle, and drags it out to 100% (280 ms, pill numbers updating) → the box turns into a flat blue-grey **placeholder** with an image icon, cursor back to arrow → a 3 px progress bar fills along the bottom (340 ms) → the element **blurs in** (blur 18px → 0, opacity 0 → 1, 0.6 s) → box fades after 170 ms.
- **card** — **red** outline box. 35%: **move** variant — the box is drawn 22–42 px right and 14–28 px down of the card, the cursor pauses 110 ms, turns to the *grab* pose, clicks the middle of the box and drags it into place (300 ms ease-in-out). Otherwise 50%: resize variant. Hold 180 ms → the card **rises in** (translateY 10px → 0 with fade, 0.5 s) → box fades.
- **button** — box; cursor back to arrow; **60%:** a 4-dot colour-swatch popover (blue, white, red, yellow) appears above the button, the cursor glides to the **red** dot (300 ms), clicks it (the dot gets a white ring), the popover fades; then the box fills solid red (220 ms), the real button fades in, the box fades.
- **shape** — box (35% **move** variant) → fills red (160 ms) → real shape fades in. A *big* shape (> 280×160, e.g. the proof panel) is treated like a card: red outline, no fill.
- **icon** — fast box, one click (squash + ripple), the glyph **pops in** (scale .55 → 1 with overshoot).
- **line** — the cursor (crosshair) drags the box along the hairline (left → right, or top → bottom for vertical spines) in 240 ms; the line **wipes in** along its direction.
- **input** — box; the cursor turns to an I-beam, clicks (ripple), the **placeholder text is typed** inside the box 38 px from the left at 40 ms/char (the real placeholder is revealed afterwards); box fades.
- **logo** — **chain build.** The agent that claims a logo claims *every logo in the same row* (same section, |Δy| < 40) at once, flies to the first, switches to crosshair, and for each logo left → right: a **red** box appears at full size, the cursor snaps to its bottom-right corner, 120 ms later the next one; each logo pops in 150 ms after its box. A row of 16 logos takes ≈ 2 s. Logos beyond the right edge of the viewport appear instantly.
- **off-screen** layers (the overflow of the card slider, anything far outside the viewport) simply appear after 50 ms with no cursor.

**C. Probabilities and knobs (all seeded; `cfg.seed` = 7, reseeded on every run/replay):** `editRate` .34, `resizeRate` .5, `moveRate` .35, `swatchRate` .6.

**D. Scene scripts — what you should *see* in each section** (layer order follows reading order; "red" = red outline box)
1. **Nav (fixed, built with the hero):** `MAYURA` typed, the red dot dropped (shape), the five links typed one after another, the `▷` icon clicked, `Motion off` typed, `Let's talk` typed, `›` clicked.
2. **Hero:** all hero + nav layers are previewed as blue wireframes first (the portrait as a blue-grey slab); then: the giant `PORTFOLIO` word wipes in; the portrait is resized then blurs in; `Hello, I'm` typed in script; `MAYURA` typed (the red period is not a layer — it is visible with the name); `MOHIETH MAYURA S Y`; the two role lines (typo-fix likely visible: `STCAK` → `STACK`); the intro paragraph (replace pass likely); the red **See my work** button (swatch pick); location icon + text; the red accent bar; the live-project ring `↗` and its two text lines; the right column: tagline, three stat hairlines drawn, numerals typed then **counting up** (`Hero.countUp` via the `layer` event), labels, `DOWNLOAD CV`; bottom: pulsing dot, `SCROLL TO DISCOVER ↓`, `SELECTED WORK · 2026`.
3. **Work:** guide + 1.2 s rulers → `01 / SELECTED WORK`, `WORK THAT SPEAKS.`, `ALL WORK →`; the seven tabs typed by different agents in parallel; the search field typed; three visible cards (red outlines; images resized/blurred in; number, title, meta typed; `↗` clicked; tag chip typed inside the image); the other eight cards (off-screen right) just appear; slider arrows clicked; `SEE ALL (11) •` typed. Sweep along the bottom.
4. **Tech strip:** label typed; **the red chain** across 16 logos (≈2 s); sweep.
5. **Proof:** guide; the maroon panel gets a red outline and rises in (big shape); eyebrow; `THE CODE.` / `THE PROOF.` typed (accent line coral); laurel icons pop; `10+` typed + count-up; `PROJECTS SHIPPED`; paragraph (edit pass likely); `SEE GITHUB ↗`; right column header; six highlight rows each: hairline wipe → index → title typed → sub typed → metric typed → unit. `Hero.laurel()` draws the laurel strokes when the section commits.
6. **From Sketch to Shipped:** eyebrow, two-line heading, paragraph, two meta lines; the compare image box (resize), blur-in (or the CSS fake UI appears), the vertical divider dragged down, the red circular **handle** moved into place (move variant), `WIREFRAME` / `FINAL UI` chips typed, hint typed — then `Compare.demo()` plays (15% → 85% → 50%, 2.4 s).
7. **About:** rulers flash; eyebrow, two-line heading, the 4-line paragraph; column 1: `EDUCATION & SKILLS`, `EDUCATION`, two rows typed, `TOOLKIT`, **14 chips typed in quick succession**, then the **10 software tiles as a red chain** (Python … Unity, Blender, Krita, Live2D); column 2: heading, the red vertical spine dragged down, five steps each: numeral, node (moved into place, then lit red by the `layer` hook), title, description; column 3: the tall red quote card gets a red outline and rises, then the quote mark, two quote lines, script signature, footer lines and the asterisk.
8. **Journey:** eyebrow; the one-line `KEEP BUILDING. KEEP SHIPPING.`; `RESUME ⤓`; the red spine dragged down; five dated rows (date typed — `2026 · NOW` in red —, role, sub, `+` icon clicked) and the open first row's description typed (edit pass likely); right: `A FEW MILESTONES`, `LITTLE WINS.` / `BIG MEANING.`, four milestone rows.
9. **Contact:** the huge `LET'S WORK / TOGETHER` (the red square period is visible with the word), paragraph, the CTA ring `↗` + `START A CONVERSATION`; four contact rows (icon clicked, label, value typed, arrow, hairline drawn); the **poster** (red outline, rises) with `MAYURA●`, `DESIGN IT.` / `SHIP IT.`, the red circle button; the quick-brief bar: hairline, the input (I-beam types `Tell me about your project`), two small icons and the send arrow.
10. **Footer:** hairline, `MAYURA●`, copyright, clock, seven social icons clicked, four accent dots (shapes), `Replay the rebuild ↺`, `Back to top ↑`.
11. **Finale:** see 5.1 (orbit around `#poster`, `cfg.finaleTarget`).

### 5.8 How the engine plugs into the page (all already done in the verbatim files — know it so you can debug)
- `index.html` has `class="is-building"` on `<html>`, `<div id="swarm-root">` (with `#sw-watermark`, rulers, scan bars, `#sw-guide`, `#sw-layer`, `#sw-agents`) and `<div id="sw-hud">`.
- `main.js` → `Render.all()` → module inits → `Scroll.stop()` → waits for the hero image decode → `Swarm.start({ initial:'M', speed: ?swarmSpeed })` (phone: 8→12 agents). When the engine emits `end` (`'live'` or `'abort'`) `afterIntro()` removes `is-building`, restarts Lenis, enables the site cursor, creates the marquee clones, wires reveals.
- Skips: `data-motion="off"` (the `Motion off` toggle, saved in `localStorage.motion`, or `prefers-reduced-motion`), `?swarm=off`, and any deep link hash other than `#`/`#home` (add `?swarmForce` to keep the intro with a hash).
- Query helpers for testing: `?swarmSpeed=4` (4× faster), `?swarm=off`.
- Engine events (`Swarm.on(name, fn)`): `state`, `progress(built,total)`, `agents(n)`, `tour(bool)`, `speed(x)`, `sound(bool)`, `pace(p)`, `layer(el,type)` (fires when a layer is finished), `section(name)` (when a section commits), `replay`, `end('live'|'abort')`.
- **What your CSS/JS must guarantee for the engine to look right** (the full list is the layer-geometry contract in 4.2): text layers are block/inline-block and shrink-wrapped; nothing animates by itself while `is-building`; no layout shift after load (give every `<img>` width/height or an aspect-ratio box; the hero photo has explicit width/height in the markup); the card slider has fixed card widths so cards beyond the viewport do not wrap; `position:fixed` elements are fine (the engine detects fixed/sticky ancestors) but `transform` on ancestors of layers must be `none` during the intro.

### 5.9 THE ENGINE — VERBATIM FILES (write these three files to disk exactly)

**css/swarm.css**
```css
/* css/swarm.css — everything for the Agent Swarm build intro.
   Colours come from tokens.css (--blue, --blue-pill, --blue-fill, --guide, --hud-bg, --a1..--a8). */

/* ---------- 1. THE LAYER GATE (the heart of the effect) ---------- */
html.is-building [data-layer]:not(.is-built){visibility:hidden}
/* a built child must show even when its (card/shape) parent is still hidden */
html.is-building [data-layer].is-built{visibility:visible}
html.is-building{--sw-speed:1}
html.is-building body{overflow-x:hidden}

/* ---------- 2. OVERLAY ROOT ---------- */
#swarm-root{position:fixed;inset:0;pointer-events:none;z-index:var(--z-swarm,9999);overflow:hidden;display:none}
#swarm-root.on{display:block}
#sw-layer,#sw-agents{position:absolute;inset:0}
#sw-watermark{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:400 min(52vh,60vw)/1 var(--f-display,Anton,Impact,sans-serif);color:#fff;opacity:.12;transition:opacity .9s ease;user-select:none}
#sw-watermark.off{opacity:0}

/* rulers */
#sw-ruler-top,#sw-ruler-left{position:absolute;background-color:rgba(28,36,51,.88);opacity:0;transition:opacity .25s ease;overflow:hidden;color:var(--muted,#9a9aa6);font:500 8px/1 Inter,system-ui,sans-serif}
#sw-ruler-top{left:0;right:0;top:0;height:20px;
  background-image:linear-gradient(90deg,rgba(255,255,255,.38) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px);
  background-size:10px 5px,100px 11px;background-position:0 100%,0 100%;background-repeat:repeat-x,repeat-x}
#sw-ruler-left{left:0;top:0;bottom:0;width:20px;
  background-image:linear-gradient(0deg,rgba(255,255,255,.38) 1px,transparent 1px),linear-gradient(0deg,rgba(255,255,255,.7) 1px,transparent 1px);
  background-size:5px 10px,11px 100px;background-position:100% 0,100% 0;background-repeat:repeat-y,repeat-y}
#sw-ruler-top.on,#sw-ruler-left.on{opacity:1}
#sw-ruler-top span{position:absolute;top:2px;transform:translateX(3px)}
#sw-ruler-left span{position:absolute;left:1px;writing-mode:vertical-rl;transform:rotate(180deg) translateY(-3px)}

/* initial page-scan flash */
#sw-scan-top,#sw-scan-left{position:absolute;background:linear-gradient(90deg,rgba(47,140,255,0),var(--blue,#2f8cff) 20%,var(--blue,#2f8cff) 80%,rgba(47,140,255,0));opacity:0}
#sw-scan-top{left:0;right:0;top:0;height:24px;box-shadow:0 0 40px 8px rgba(47,140,255,.55)}
#sw-scan-left{left:0;top:0;bottom:0;width:12px;background:linear-gradient(180deg,rgba(47,140,255,0),var(--blue,#2f8cff) 20%,var(--blue,#2f8cff) 80%,rgba(47,140,255,0));box-shadow:0 0 30px 6px rgba(47,140,255,.5)}
#sw-scan-top.flash{animation:swScan calc(.9s / var(--sw-speed,1)) ease-out both}
#sw-scan-left.flash{animation:swScan calc(.9s / var(--sw-speed,1)) .12s ease-out both}
@keyframes swScan{0%{opacity:0}18%{opacity:1}100%{opacity:0}}

/* red snap guide */
#sw-guide{position:absolute;top:0;bottom:0;width:0;border-left:1.5px solid var(--guide,#ff4d2d);opacity:0;transition:opacity .2s ease}
#sw-guide.on{opacity:.9}
#sw-guide.slow{transition-duration:.4s}

/* ---------- 3. AGENT CURSORS ---------- */
.sw-cursor{position:absolute;left:0;top:0;width:22px;height:22px;will-change:transform;filter:drop-shadow(0 2px 4px rgba(0,0,0,.55));margin:-2px 0 0 -3px}
.sw-cursor svg{position:absolute;inset:0;width:22px;height:22px;overflow:visible;display:none}
.sw-cursor[data-mode="arrow"] .g-arrow{display:block}
.sw-cursor[data-mode="cross"] .g-cross{display:block}
.sw-cursor[data-mode="ibeam"] .g-ibeam{display:block}
.sw-cursor[data-mode="grab"] .g-arrow{display:block}
.sw-cursor.is-click .g-arrow{transform:scale(.82);transform-origin:3px 2px}

/* click ripple (double-click = two of them) */
.sw-ripple{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;border:1.5px solid var(--blue,#2f8cff);border-radius:50%;animation:swRipple calc(.45s / var(--sw-speed,1)) ease-out both}
@keyframes swRipple{from{transform:scale(.4);opacity:1}to{transform:scale(3.2);opacity:0}}

/* ---------- 4. GHOST BOXES (selection boxes) ---------- */
.sw-box{position:absolute;left:0;top:0;box-sizing:border-box;border:1px solid var(--blue,#2f8cff);transform-origin:0 0;will-change:transform,width,height;transition:opacity .22s ease}
.sw-box i{position:absolute;width:6px;height:6px;background:#fff;border:1px solid var(--blue,#2f8cff);box-sizing:border-box}
.sw-box i.tl{left:-4px;top:-4px}.sw-box i.tr{right:-4px;top:-4px}.sw-box i.bl{left:-4px;bottom:-4px}.sw-box i.br{right:-4px;bottom:-4px}
.sw-box b{position:absolute;left:50%;top:100%;transform:translate(-50%,6px);background:var(--blue-pill,#0d99ff);color:#fff;font:700 10px/1 Inter,system-ui,sans-serif;padding:3px 6px;border-radius:3px;white-space:nowrap}
.sw-box.is-out{opacity:0}
/* kinds */
.sw-box--card,.sw-box--logo{border-color:var(--guide,#ff4d2d)}
.sw-box--card i,.sw-box--logo i{border-color:var(--guide,#ff4d2d)}
.sw-box--card b,.sw-box--logo b{background:var(--guide,#ff4d2d)}
.sw-box--icon b,.sw-box--logo b{display:none}
.sw-box.is-placeholder{background:var(--blue-fill,rgba(70,95,130,.85))}
.sw-box.is-placeholder::after{content:"";position:absolute;left:50%;top:50%;width:26px;height:22px;margin:-11px 0 0 -13px;opacity:.7;
  background:no-repeat center/contain url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 22' fill='none' stroke='white' stroke-width='1.6'><rect x='1' y='1' width='24' height='20' rx='2'/><circle cx='8' cy='7.5' r='2.4'/><path d='M1.5 18 8 12l5 4.5 4-4 7.5 6'/></svg>")}
.sw-box.is-filled{background:rgba(240,69,58,.9)}
.sw-box.is-fillblue{background:rgba(47,140,255,.22)}
.sw-box .prog{position:absolute;left:0;bottom:0;height:3px;width:0;background:var(--blue-pill,#0d99ff)}
/* static wireframe previews of not-yet-built layers */
.sw-pre{position:absolute;left:0;top:0;box-sizing:border-box;border:1px solid rgba(47,140,255,.55);opacity:0;transition:opacity .3s ease;will-change:transform}
.sw-pre.in{opacity:1}
.sw-pre.fill{background:rgba(70,95,130,.55)}
.sw-pre b{position:absolute;left:50%;top:100%;transform:translate(-50%,4px);background:var(--blue-pill,#0d99ff);color:#fff;font:700 9px/1 Inter,system-ui,sans-serif;padding:2px 5px;border-radius:3px;white-space:nowrap}
.sw-pre.card{border-color:rgba(255,77,45,.6)}
.sw-pre.card b{background:var(--guide,#ff4d2d)}

/* colour swatches popover (button build) */
.sw-swatches{position:absolute;display:flex;gap:5px;padding:5px 6px;background:rgba(20,22,28,.96);border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.5);transition:opacity .2s ease}
.sw-swatches i{width:14px;height:14px;border-radius:50%;border:1.5px solid transparent}
.sw-swatches i.pick{border-color:#fff;transform:scale(1.2)}
.sw-swatches.is-out{opacity:0}

/* overlay placeholder text typed inside an input box */
.sw-ph{position:absolute;white-space:nowrap;color:rgba(255,255,255,.7);font:400 13px/1 Inter,system-ui,sans-serif}

/* ---------- 5. TEXT TYPING INSIDE THE REAL ELEMENT ---------- */
.sw-rest{visibility:hidden}
.sw-sel{background:rgba(47,140,255,.55);color:#fff;-webkit-text-fill-color:#fff}
.sw-caret{display:inline;border-left:1.5px solid #fff;margin-right:-1.5px;animation:swBlink 1s steps(1) infinite}
@keyframes swBlink{50%{border-left-color:transparent}}

/* ---------- 6. REVEAL ANIMATIONS (fill-mode: backwards, so nothing sticks afterwards) ---------- */
.sw-in-fade{animation:swFade calc(.35s / var(--sw-speed,1)) ease-out backwards}
.sw-in-blur{animation:swBlur calc(.6s / var(--sw-speed,1)) ease-out backwards}
.sw-in-pop{animation:swPop calc(.3s / var(--sw-speed,1)) cubic-bezier(.2,1.4,.4,1) backwards}
.sw-in-wipe{animation:swWipe calc(.5s / var(--sw-speed,1)) cubic-bezier(.65,0,.35,1) backwards}
.sw-in-wipey{animation:swWipeY calc(.5s / var(--sw-speed,1)) cubic-bezier(.65,0,.35,1) backwards}
.sw-in-rise{animation:swRise calc(.5s / var(--sw-speed,1)) cubic-bezier(.22,1,.36,1) backwards}
@keyframes swFade{from{opacity:0}to{opacity:1}}
@keyframes swBlur{from{filter:blur(18px);opacity:0}to{filter:blur(0);opacity:1}}
@keyframes swPop{from{transform:scale(.55);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes swWipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes swWipeY{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes swRise{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}

/* ---------- 7. SECTION-COMMIT SWEEP ---------- */
.sw-sweep{position:absolute;left:0;height:2px;width:0;background:linear-gradient(90deg,transparent,var(--blue,#2f8cff));transition:opacity .35s ease}
.sw-sweep::after{content:"";position:absolute;right:-4px;top:-3px;width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:0 0 12px 4px var(--blue,#2f8cff)}
.sw-sweep.is-out{opacity:0}

/* ---------- 8. HUD (3 states) ---------- */
#sw-hud{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:calc(var(--z-swarm,9999) + 1);height:40px;display:none;align-items:center;gap:12px;
  padding:0 8px 0 16px;border-radius:999px;background:var(--hud-bg,rgba(16,18,22,.92));-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,.08);box-shadow:0 8px 30px rgba(0,0,0,.5);color:#cfd3da;font:500 11px/1 Inter,system-ui,sans-serif;white-space:nowrap;pointer-events:auto;max-width:calc(100vw - 16px)}
#sw-hud.on{display:flex}
#sw-hud .stack{display:flex}
#sw-hud .stack i{width:18px;height:18px;border-radius:50%;border:2px solid #101216;margin-left:-6px;box-sizing:content-box;width:14px;height:14px}
#sw-hud .stack i:first-child{margin-left:0}
#sw-hud .div{width:1px;height:16px;background:rgba(255,255,255,.14)}
#sw-hud .track{width:72px;height:3px;border-radius:3px;background:rgba(255,255,255,.14);overflow:hidden}
#sw-hud .track i{display:block;height:100%;width:0;background:var(--blue,#2f8cff)}
#sw-hud .track.wide{width:140px}
#sw-hud .track.indet{width:90px;position:relative}
#sw-hud .track.indet i{position:absolute;width:35%;animation:swIndet 1.1s ease-in-out infinite}
@keyframes swIndet{from{left:-35%}to{left:100%}}
#sw-hud button{all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;height:24px;min-width:24px;padding:0 9px;border-radius:6px;color:#cfd3da;font:600 11px/1 Inter,system-ui,sans-serif;box-sizing:border-box}
#sw-hud button:hover{background:rgba(255,255,255,.08)}
#sw-hud button:focus-visible{outline:2px solid var(--accent,#ff4d5a);outline-offset:2px}
#sw-hud button.pill{background:#2563eb;color:#fff}
#sw-hud button.pill:hover{background:#3b73f0}
#sw-hud button.ghost{border:1px solid rgba(255,255,255,.18)}
#sw-hud button.on{color:#fff}
#sw-hud .txt b{font-weight:700;color:#fff}
@media (max-width:640px){#sw-hud{height:auto;min-height:40px;flex-wrap:wrap;border-radius:20px;padding:8px 10px;gap:8px;row-gap:6px;justify-content:center;width:calc(100vw - 16px)}#sw-ruler-top,#sw-ruler-left{display:none}}

/* never show the swarm to people who asked for less motion */
html[data-motion="off"] #swarm-root,html[data-motion="off"] #sw-hud{display:none!important}
```

**js/swarm.js**
```js
/* js/swarm.js — AGENT SWARM BUILD ENGINE v2 (TESTED in Chromium via Playwright).
   A swarm of arrow cursors ("agents") visibly builds every [data-layer] element of the page:
   fly -> drag a selection box (crosshair) -> resize / move it -> type text (I-beam) -> select + retype / fix typos ->
   fill placeholders -> reveal the real element. Plus rulers, snap guide, section sweeps, HUD events, finale orbit.
   Public API: window.Swarm  (start, abort, goLive, replay, setSpeed, setTour, setSound, on, state, stats)
   Events (Swarm.on): state(s) progress(built,total) agents(n) tour(bool) speed(x) sound(bool) pace(p) layer(el,type) section(name) replay() end('live'|'abort')   */
(() => {
  'use strict';

  /* ======================================================================= 0. CONFIG + STATE */
  const COLORS = ['#5eead4', '#fb923c', '#ffffff', '#a78bfa', '#7dd3fc', '#fda4af', '#fcd34d', '#86efac'];
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const ABORT = { abort: true };

  const S = window.Swarm = {
    cfg: {
      startAgents: 18, maxAgents: 30,
      targetSeconds: 51.4,                                   // total run time at 1x (the pace controller steers to this)
      joins: [[6, 19], [12, 23], [17, 24], [31, 28], [39, 29], [48, 30]],   // [seconds at 1x, agent count] (measured from the reference)
      editRate: 0.34,                                        // share of long text layers that get a select-and-retype / typo-fix pass
      resizeRate: 0.5,                                       // share of images/cards that are first drawn too small, then resized
      moveRate: 0.35,                                        // share of cards/shapes first drawn off-position, then dragged into place
      swatchRate: 0.6,                                       // share of buttons that get a colour-swatch pick
      previewSections: ['nav', 'hero'],                      // sections that get the "all wireframes at once" stage
      finaleTarget: '#poster',                               // element the cursors orbit at the end
      seed: 7, speed: 1,
      scanMs: 800, scatterMs: 420, previewMs: 700
    },
    speed: 1, pace: 1, tour: true, sound: false,
    t: 0, real: 0,                                           // virtual ms (speed-scaled) and real ms (clamped), since the engine started
    state: 'idle',                                           // idle | scan | build | finale | live | abort
    agents: [], layers: [], sections: new Map(),
    built: 0, total: 0, run: 0, stop: false,
    doneSeconds: 0, userScrolled: false
  };

  /* ---- tiny event emitter ---- */
  const handlers = {};
  S.on = (ev, fn) => { (handlers[ev] = handlers[ev] || []).push(fn); return S; };
  const emit = (ev, a, b) => { (handlers[ev] || []).forEach((fn) => { try { fn(a, b); } catch (e) { console.error(e); } }); };

  /* ======================================================================= 1. UTILITIES */
  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function mulberry(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  let R = mulberry(7);                                       // global rng (reseeded every run so replays look identical)

  /* reference progress curve: fraction of layers built after u = elapsed / target (from the measured video) */
  const CURVE = [[0, 0], [0.035, 0], [0.078, 0.113], [0.175, 0.255], [0.321, 0.379], [0.545, 0.516], [0.72, 0.72], [0.944, 0.937], [1, 1]];
  function curve(u) {
    if (u <= 0) return 0; if (u >= 1) return 1;
    for (let i = 1; i < CURVE.length; i++) if (u <= CURVE[i][0]) { const [u0, f0] = CURVE[i - 1], [u1, f1] = CURVE[i]; return lerp(f0, f1, (u - u0) / (u1 - u0)); }
    return 1;
  }

  /* ======================================================================= 2. CLOCK: ONE rAF LOOP, VIRTUAL TIME */
  const tasks = new Set();          // (dt) => true when finished       (tweens, sleeps)
  const followers = new Set();      // () => void, every frame, AFTER tasks (boxes, agents tracking things, scroll)
  const pending = new Set();        // resolvers to flush on abort
  let rafId = 0, lastNow = 0;

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    const dtReal = Math.min(100, now - (lastNow || now)); lastNow = now;
    S.real += dtReal;
    const dt = dtReal * S.speed; S.t += dt;
    for (const k of [...tasks]) if (k(dt)) tasks.delete(k);
    for (const f of [...followers]) f(dt);
  }
  const startClock = () => { if (!rafId) { lastNow = 0; rafId = requestAnimationFrame(frame); } };
  const stopClock = () => { cancelAnimationFrame(rafId); rafId = 0; };

  /* tween(ms, step): durations are in "1x milliseconds" and are multiplied by S.pace (pace controller) */
  function tween(ms, step) {
    return new Promise((resolve) => {
      /* pace stretches an action, but never beyond ~2.2 s */
      const dur = Math.max(1, Math.min(ms * S.pace, Math.max(ms, 2200))); let el = 0; const rec = () => resolve();
      pending.add(rec);
      tasks.add((dt) => { el += dt; const t = clamp(el / dur, 0, 1); if (step) step(t); if (t >= 1) { pending.delete(rec); resolve(); return true; } return false; });
    });
  }
  const sleep = (ms) => tween(ms, null);
  const flush = () => { const p = [...pending]; pending.clear(); tasks.clear(); p.forEach((r) => r()); };

  /* ======================================================================= 3. SOUND (default OFF) */
  const Sound = {
    ctx: null, last: 0,
    enable() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; } } if (this.ctx.state === 'suspended') this.ctx.resume(); },
    tone(freq, dur, type, gain, when = 0) {
      if (!S.sound || !this.ctx) return; const c = this.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = gain; o.connect(g); g.connect(c.destination);
      const t0 = c.currentTime + when; g.gain.setValueAtTime(gain, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.start(t0); o.stop(t0 + dur + 0.02);
    },
    tick() { const n = performance.now(); if (n - this.last < 70) return; this.last = n; this.tone(1800, 0.012, 'square', 0.03); },
    whoosh() {
      if (!S.sound || !this.ctx) return; const c = this.ctx, len = c.sampleRate * 0.4, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = buf; f.type = 'bandpass'; f.frequency.value = 900; g.gain.value = 0.05;
      s.connect(f); f.connect(g); g.connect(c.destination); s.start();
    },
    chime() { this.tone(659, 0.35, 'sine', 0.06); this.tone(988, 0.5, 'sine', 0.06, 0.16); }
  };
  S.setSound = (on) => { S.sound = !!on; if (on) Sound.enable(); emit('sound', S.sound); };

  /* ======================================================================= 4. DOM HELPERS */
  const layerEl = () => $('#sw-layer'), agentsEl = () => $('#sw-agents');
  function mk(tag, cls, parent, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  function ripple(x, y) { const r = mk('div', 'sw-ripple', layerEl()); r.style.left = x + 'px'; r.style.top = y + 'px'; setTimeout(() => r.remove(), 600); }

  /* ======================================================================= 5. LAYERS: collect, measure, claim */
  const isFixedChain = (el) => { for (let n = el; n && n !== document.documentElement; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };

  function measure(L) {
    const r = L.el.getBoundingClientRect();
    L.w = r.width; L.h = r.height;
    if (L.fixed) { L.x = r.left; L.y = r.top; } else { L.x = r.left + scrollX; L.y = r.top + scrollY; }
  }
  /* viewport rect of a layer, live (follows page scroll) */
  function vr(L) { return L.fixed ? { x: L.x, y: L.y, w: L.w, h: L.h } : { x: L.x - scrollX, y: L.y - scrollY, w: L.w, h: L.h }; }
  const isOff = (v) => v.x > innerWidth + 4 || v.x + v.w < -4 || v.y > innerHeight + 260 || v.y + v.h < -260;

  const secName = (el) => { const s = el.closest('[data-swarm-section]'); return s ? s.dataset.swarmSection : 'page'; };
  function collect() {
    const out = []; let i = 0;
    S.sections = new Map();
    document.querySelectorAll('[data-layer]').forEach((el) => {
      const cs = getComputedStyle(el);
      el.classList.remove('is-built');
      const r = el.getBoundingClientRect();
      if (cs.display === 'none' || (r.width < 0.5 && r.height < 0.5)) { el.classList.add('is-built'); return; }   // collapsed / hidden: never part of the show
      const type = el.dataset.layer;
      const L = { el, type, i: i++, claimed: false, done: false, fixed: isFixedChain(el), section: secName(el), mode: null, full: null };
      if ((type === 'text' || type === 'chip')) {
        if (el.children.length) { L.mode = 'wipe'; console.warn('[swarm] text layer has child elements; using wipe instead of typing:', el); }
        else { L.full = el.textContent; if (cs.display === 'inline') { el.style.display = 'inline-block'; console.warn('[swarm] text layer was display:inline; forced inline-block: <' + el.tagName.toLowerCase() + ' class="' + el.className + '">'); } }
        if (el.dataset.swarm === 'wipe') L.mode = 'wipe';
      }
      measure(L); out.push(L);
    });
    out.sort((a, b) => (a.y - b.y) || (a.x - b.x) || (a.i - b.i));
    out.forEach((L, k) => { L.k = k; L.rnd = mulberry(S.cfg.seed * 977 + L.i * 31 + 5); });
    S.layers = out; S.total = out.length; S.built = 0; S.firstFree = 0;
    out.forEach((L) => {
      let s = S.sections.get(L.section); if (!s) { s = { name: L.section, el: L.el.closest('[data-swarm-section]'), total: 0, built: 0, started: false, committed: false }; S.sections.set(L.section, s); }
      s.total++;
    });
  }
  const remeasureFree = () => { for (const L of S.layers) if (!L.claimed) measure(L); };

  /* next layer for an agent: reading order inside the visible window, biased to the agent's position */
  function claim(a) {
    const L0 = S.layers, n = L0.length;
    while (S.firstFree < n && L0[S.firstFree].claimed) S.firstFree++;
    if (S.firstFree >= n) return null;
    const lo = scrollY - 90, hi = scrollY + innerHeight * 0.98, starving = S.t - (S.lastClaim || 0) > 1600;
    let best = null, bestScore = 1e12, seen = 0;
    for (let k = S.firstFree; k < n && seen < 44; k++) {
      const L = L0[k]; if (L.claimed) continue;
      const top = L.fixed ? scrollY + L.y : L.y;
      if (!starving && top > hi) break;                    // below the visible window: wait for the tour to scroll there
      seen++;
      const v = vr(L); const score = (top - lo) * 1 + Math.hypot(v.x - a.x, v.y - a.y) * 0.32 + L.k * 0.01;
      if (score < bestScore) { bestScore = score; best = L; }
    }
    if (best) { best.claimed = true; S.lastClaim = S.t; }
    return best;
  }

  /* ======================================================================= 6. AGENT (cursor) */
  class Agent {
    constructor(id, x, y) {
      this.id = id; this.color = COLORS[id % COLORS.length]; this.x = x; this.y = y; this.rot = 0; this.mode = 'arrow';
      this.vx = (R() - 0.5) * 2; this.vy = (R() - 0.5) * 2; this.track = null; this.idle = true; this.run = S.run; this.theta = 0; this.radius = 100; this.flock = null;
      const el = this.el = mk('div', 'sw-cursor', agentsEl()); el.dataset.mode = 'arrow';
      el.innerHTML =
        `<svg class="g-arrow" viewBox="0 0 24 24"><path d="M3 2 L3 19 L7.6 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.6 L16.6 13.6 Z" fill="${this.color}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>` +
        `<svg class="g-cross" viewBox="0 0 24 24"><g transform="translate(-9 -10)"><path d="M12 5V19M5 12H19" stroke="#fff" stroke-width="1.6" stroke-linecap="square"/><path d="M12 5V19M5 12H19" stroke="${this.color}" stroke-width=".6" opacity=".9"/></g></svg>` +
        `<svg class="g-ibeam" viewBox="0 0 24 24"><g transform="translate(-9 -10)"><path d="M9.5 4H14.5M9.5 20H14.5M12 4V20" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none"/></g></svg>`;
      this.draw();
    }
    setMode(m) { this.mode = m; this.el.dataset.mode = m; }
    draw() { this.el.style.transform = `translate(${this.x.toFixed(1)}px,${this.y.toFixed(1)}px) rotate(${this.mode === 'arrow' || this.mode === 'grab' ? this.rot.toFixed(1) : 0}deg)`; }
    click() { this.el.classList.add('is-click'); setTimeout(() => this.el.classList.remove('is-click'), 140 / Math.max(1, S.speed)); ripple(this.x, this.y); }
    /* curved flight (quadratic bezier); the target is a function so it can follow a scrolling page */
    async flyTo(getT, ms) {
      this.track = null; this.setMode('arrow'); this.idle = false;
      const sx = this.x, sy = this.y; let [tx, ty] = getT();
      const cx = (sx + tx) / 2 + (R() - 0.5) * 220, cy = (sy + ty) / 2 + (R() - 0.5) * 220;
      const heading = (Math.atan2(ty - sy, tx - sx) * 180) / Math.PI + 135;
      await tween(ms, (t) => {
        [tx, ty] = getT(); const e = easeInOut(t), u = 1 - e;
        this.x = u * u * sx + 2 * u * e * cx + e * e * tx; this.y = u * u * sy + 2 * u * e * cy + e * e * ty;
        this.rot = heading * Math.sin(Math.PI * Math.min(1, t * 1.1)) * 0.3; this.draw();
      });
      this.rot = 0; this.draw();
    }
  }

  /* idle flock: random acceleration + pull to a centre, speed capped, arrow points along velocity */
  function flockStep(a, dt, cx, cy, pull) {
    const k = dt / 16.7;
    a.vx += ((R() - 0.5) * 0.35 + (cx - a.x) * pull) * k; a.vy += ((R() - 0.5) * 0.35 + (cy - a.y) * pull) * k;
    const sp = Math.hypot(a.vx, a.vy), mx = 1.6; if (sp > mx) { a.vx *= mx / sp; a.vy *= mx / sp; }
    a.x = clamp(a.x + a.vx * k, 20, innerWidth - 20); a.y = clamp(a.y + a.vy * k, 24, innerHeight - 70);
    a.rot = (Math.atan2(a.vy, a.vx) * 180) / Math.PI + 135; a.draw();
  }

  /* ======================================================================= 7. GHOST BOX */
  class Box {
    constructor(kind, L) {
      this.L = L; this.gx = 0; this.gy = 0; this.ox = 0; this.oy = 0; this.kind = kind; this.lastPill = '';
      const el = this.el = mk('div', `sw-box sw-box--${kind}`, layerEl(), '<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><b></b>');
      this.pill = el.querySelector('b'); this.f = () => this.update(); followers.add(this.f); this.update();
    }
    update() {
      const r = vr(this.L); const w = Math.max(0, r.w * this.gx), h = Math.max(0, r.h * this.gy);
      this.el.style.transform = `translate(${(r.x + this.ox).toFixed(1)}px,${(r.y + this.oy).toFixed(1)}px)`;
      this.el.style.width = w.toFixed(1) + 'px'; this.el.style.height = h.toFixed(1) + 'px';
      const p = w < 4 && h < 4 ? '' : `${Math.round(w)} × ${Math.round(h)}`; if (p !== this.lastPill) { this.pill.textContent = p; this.pill.style.display = p ? '' : 'none'; this.lastPill = p; }
    }
    corner() { const r = vr(this.L); return { x: r.x + this.ox + r.w * this.gx, y: r.y + this.oy + r.h * this.gy }; }
    fade() { followers.delete(this.f); this.el.classList.add('is-out'); setTimeout(() => this.el.remove(), 280); }
    kill() { followers.delete(this.f); this.el.remove(); }
  }

  /* static wireframe previews (the "everything outlined at once" stage of the hero) */
  const previews = new Map();
  function makePreview(L) {
    const e = mk('div', `sw-pre ${L.type === 'image' ? 'fill' : ''} ${L.type === 'card' ? 'card' : ''}`, layerEl(), '<b></b>');
    const f = () => { const r = vr(L); e.style.transform = `translate(${r.x.toFixed(1)}px,${r.y.toFixed(1)}px)`; e.style.width = r.w + 'px'; e.style.height = r.h + 'px'; };
    e.querySelector('b').textContent = `${Math.round(L.w)} × ${Math.round(L.h)}`; f(); followers.add(f); previews.set(L, { e, f });
    requestAnimationFrame(() => e.classList.add('in'));
  }
  function dropPreview(L) { const p = previews.get(L); if (!p) return; followers.delete(p.f); p.e.style.opacity = 0; setTimeout(() => p.e.remove(), 250); previews.delete(L); }

  /* ======================================================================= 8. EFFECTS: rulers, scan, guide, sweep */
  let rulerTimer = 0;
  function buildRulers() {
    const top = $('#sw-ruler-top'), left = $('#sw-ruler-left'); top.innerHTML = ''; left.innerHTML = '';
    for (let x = 100; x < innerWidth; x += 100) { const s = mk('span', '', top, String(x)); s.style.left = x + 'px'; }
    for (let k = 1; k * 100 < innerHeight; k++) { const s = mk('span', '', left); s.style.top = k * 100 + 'px'; s.dataset.k = k; s.textContent = String(k * 100); }
  }
  function updateRulerLabels() { const base = Math.floor(scrollY / 100) * 100, off = scrollY - base; $('#sw-ruler-left').querySelectorAll('span').forEach((s) => { const k = +s.dataset.k; s.style.top = (k * 100 - off) + 'px'; s.textContent = String(base + k * 100); }); }
  async function showRulers(ms, run) {
    const t = $('#sw-ruler-top'), l = $('#sw-ruler-left'); t.classList.add('on'); l.classList.add('on'); updateRulerLabels();
    const key = ++rulerTimer; await sleep(ms); if (key === rulerTimer && S.run === run) { t.classList.remove('on'); l.classList.remove('on'); }
  }
  function scanFlash() { const a = $('#sw-scan-top'), b = $('#sw-scan-left'); [a, b].forEach((e) => { e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); }); }

  function guideFor(sec) {
    const g = $('#sw-guide'); let x = Infinity; S.layers.forEach((L) => { if (L.section === sec.name && !L.fixed && L.w > 4) x = Math.min(x, L.x - scrollX); });
    if (!isFinite(x)) return; g.style.left = Math.round(x) + 'px'; g.classList.remove('slow'); g.classList.add('on'); S.guideOwner = sec.name;
  }
  function sectionStart(L) {
    const s = S.sections.get(L.section); if (!s || s.started) return; s.started = true;
    if (L.section !== 'nav' && L.section !== 'hero') { showRulers(1200, S.run); }
    if (s.el && s.el.dataset.guide) guideFor(s);
  }
  function sectionDone(L) {
    const s = S.sections.get(L.section); if (!s) return; s.built++;
    if (s.built >= s.total && !s.committed) { s.committed = true; emit('section', s.name); commitSweep(s); if (S.guideOwner === s.name) { const g = $('#sw-guide'); g.classList.add('slow'); setTimeout(() => g.classList.remove('on'), 400 / S.speed); } }
  }
  async function commitSweep(s) {
    if (!s.el || s.name === 'nav') return; const run = S.run;
    const sw = mk('div', 'sw-sweep', layerEl()); Sound.whoosh();
    const left = Math.max(0, s.el.getBoundingClientRect().left);
    await tween(700, (t) => { if (!sw.isConnected) return; const r = s.el.getBoundingClientRect(); const y = clamp(r.bottom - 2, 2, innerHeight - 2); sw.style.top = y + 'px'; sw.style.left = left + 'px'; sw.style.width = (easeOut(t) * (r.width)) + 'px'; });
    if (S.run !== run) return; sw.classList.add('is-out'); setTimeout(() => sw.remove(), 400);
  }

  /* ======================================================================= 9. THE BUILD CHOREOGRAPHY */
  function finish(L, anim, dur) {
    if (L.done) return; L.done = true; L.claimed = true; const el = L.el;
    if (L.full != null && L.mode !== 'wipe') { el.textContent = L.full; el.style.minWidth = el.style.minHeight = ''; }
    el.classList.add('is-built'); if (anim) el.classList.add(anim);
    dropPreview(L); S.built++; emit('progress', S.built, S.total); emit('layer', el, L.type); sectionDone(L);
  }

  /* ---- text engine: typed span + hidden rest span + inline caret (zero layout shift) ---- */
  function paint(L, segs, rest) {
    L.el.innerHTML = segs.map((s) => `<span${s.c ? ` class="${s.c}"` : ''}>${esc(s.t)}</span>`).join('') + '<i class="sw-caret"></i>' + `<span class="sw-rest">${esc(rest)}</span>`;
    L.caret = L.el.querySelector('.sw-caret');
  }
  function caretPos(L) {
    const c = L.caret; if (!c || !c.isConnected) return null; const r = c.getBoundingClientRect();
    if (!r.height) { const e = L.el.getBoundingClientRect(); return { x: e.left + 4, y: e.top + e.height / 2 }; }
    return { x: r.left + 8, y: r.top + r.height / 2 };
  }
  /* type `str` after `prefix` segments; `restAfter(n)` gives the hidden remainder so the layout is final from the first character */
  async function typeStr(a, L, prefix, str, restAfter, msPerChar, chk) {
    const ch = Array.from(str), n = ch.length; if (!n) { paint(L, prefix, restAfter(0)); return; }
    const total = clamp(n * msPerChar, 180, 1900); let last = -1;
    await tween(total, (t) => {
      const k = Math.min(n, Math.floor(t * n + 0.999)); if (k === last) return; last = k;
      paint(L, prefix.concat([{ t: ch.slice(0, k).join('') }]), restAfter(k));
      if (ch[k - 1] === ' ') Sound.tick();
    });
    chk();
  }
  function makeDraft(full) {
    const pool = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor'; const ch = Array.from(full); const len = Math.max(5, Math.floor(ch.length * 0.55));
    return ch.length <= 12 ? 'Title here'.slice(0, Math.max(4, ch.length - 2)) : pool.slice(0, len).trim();
  }
  function makeTypo(full) {
    const words = []; const re = /[A-Za-z]{5,}/g; let m; while ((m = re.exec(full))) words.push([m.index, m[0]]); if (!words.length) return null;
    const [idx, w] = words[Math.floor(words.length / 2)]; const c = Array.from(w); const j = Math.min(2, c.length - 2); [c[j], c[j + 1]] = [c[j + 1], c[j]];
    if (c.join('') === w) return null; return { a: idx, b: idx + w.length, wrong: c.join(''), right: w };
  }

  async function typeLayer(a, L, box, chk) {
    const el = L.el, full = L.full, ch = Array.from(full), n = ch.length, isChip = L.type === 'chip', mpc = isChip ? 22 : 32;
    const b = el.getBoundingClientRect(); el.style.minWidth = b.width + 'px'; el.style.minHeight = b.height + 'px';
    el.classList.add('is-built');
    a.setMode('ibeam'); a.track = () => { const p = caretPos(L); if (!p) return null; return { x: lerp(a.x, p.x, 0.55), y: lerp(a.y, p.y, 0.55) }; };
    paint(L, [], full);
    const mode = L.rnd() < S.cfg.editRate && !isChip && n >= 10 ? (n >= 16 && L.rnd() < 0.5 ? 'replace' : 'fix') : 'plain';
    const typo = mode === 'fix' ? makeTypo(full) : null;
    if (mode === 'replace') {
      const draft = makeDraft(full);
      await typeStr(a, L, [], draft, () => '', mpc * 0.8, chk);
      await sleep(180); chk();
      a.click(); await sleep(70); a.click();                                   // double-click = select
      paint(L, [{ t: draft, c: 'sw-sel' }], ''); await sleep(280); chk();
      paint(L, [], ''); await sleep(170); chk();                                // Delete
      await typeStr(a, L, [], full, (k) => ch.slice(k).join(''), mpc, chk);
    } else if (mode === 'fix' && typo) {
      const wrongFull = full.slice(0, typo.a) + typo.wrong + full.slice(typo.b), wch = Array.from(wrongFull);
      await typeStr(a, L, [], wrongFull, (k) => wch.slice(k).join(''), mpc, chk);
      await sleep(240); chk();
      paint(L, [{ t: wrongFull.slice(0, typo.a) }, { t: typo.wrong, c: 'sw-sel' }, { t: wrongFull.slice(typo.b) }], '');      // select the bad word
      const sel = el.querySelector('.sw-sel');
      a.track = () => { const sr = sel.getBoundingClientRect(); return { x: lerp(a.x, sr.left + sr.width / 2, 0.4), y: lerp(a.y, sr.top + sr.height / 2, 0.4) }; };
      await sleep(120); chk(); a.click(); await sleep(70); a.click(); await sleep(260); chk();
      paint(L, [{ t: full.slice(0, typo.a) }], full.slice(typo.b));            // Delete the word, then retype it correctly
      a.track = () => { const p = caretPos(L); return p ? { x: lerp(a.x, p.x, 0.55), y: lerp(a.y, p.y, 0.55) } : null; };
      await sleep(150); chk();
      await typeStr(a, L, [{ t: full.slice(0, typo.a) }], typo.right, (k) => Array.from(typo.right).slice(k).join('') + full.slice(typo.b), 60, chk);
    } else {
      await typeStr(a, L, [], full, (k) => ch.slice(k).join(''), mpc, chk);
    }
    await sleep(90); chk();
  }

  /* ---- box drawing: drag from the top-left corner to the bottom-right, optionally resize/move afterwards ---- */
  async function drawBox(a, L, box, variant, chk) {
    a.setMode('cross'); a.track = () => box.corner(); a.idle = false;
    const tgtX = variant === 'resize' ? 0.6 + L.rnd() * 0.12 : 1, tgtY = variant === 'resize' ? 0.62 + L.rnd() * 0.12 : 1;
    if (variant === 'move') { box.ox = 22 + L.rnd() * 20; box.oy = 14 + L.rnd() * 14; }
    const vert = variant === 'line' && L.h > L.w * 3;                      // vertical hairlines are dragged top -> bottom
    await tween(variant === 'line' ? 240 : 300, (t) => { const e = easeOut(t); if (variant === 'line') { box.gx = vert ? 1 : e; box.gy = vert ? e : 1; } else { box.gx = e * tgtX; box.gy = e * tgtY; } }); chk();
    if (variant === 'resize') {                                           // grab the bottom-right handle and drag it to the right size
      await sleep(150); chk(); a.click();
      await tween(280, (t) => { const e = easeInOut(t); box.gx = lerp(tgtX, 1, e); box.gy = lerp(tgtY, 1, e); }); chk();
    }
    if (variant === 'move') {                                             // grab the box by its middle and drag it into place
      await sleep(110); chk();
      const ox0 = box.ox, oy0 = box.oy;
      a.setMode('grab'); a.track = () => { const r = vr(L); return { x: r.x + box.ox + r.w / 2, y: r.y + box.oy + r.h / 2 }; };
      await sleep(80); chk(); a.click();
      await tween(300, (t) => { const e = easeInOut(t); box.ox = lerp(ox0, 0, e); box.oy = lerp(oy0, 0, e); }); chk();
    }
    box.gx = box.gy = 1;
  }

  const boxKind = (L) => ({ text: 'text', chip: 'text', image: 'image', card: 'card', shape: 'shape', button: 'button', icon: 'icon', line: 'line', input: 'input', logo: 'logo' }[L.type] || 'text');
  const flightMs = (a, L) => { const v = vr(L); return clamp(260 + Math.hypot(v.x - a.x, v.y - a.y) * 0.5, 320, 950); };

  async function build(a, L) {
    const run = a.run, chk = () => { if (S.stop || S.run !== run) throw ABORT; };
    const W = async (p) => { await p; chk(); };
    sectionStart(L); dropPreview(L);
    let v = vr(L);
    if (isOff(v)) { await W(sleep(50)); finish(L, null); return; }                          // far off-screen (slider overflow etc.): just appear

    if (L.type === 'logo') return buildLogoRow(a, L, chk);

    await W(a.flyTo(() => { const r = vr(L); return [r.x, r.y]; }, flightMs(a, L)));
    const bigPanel = L.type === 'shape' && L.w > 280 && L.h > 160;
    const kind = bigPanel ? 'card' : boxKind(L);
    const box = new Box(kind, L);
    const big = L.w * L.h > 30000;

    try {
      /* ------------- images ------------- */
      if (L.type === 'image') {
        await drawBox(a, L, box, L.rnd() < S.cfg.resizeRate && big ? 'resize' : 'drag', chk);
        box.el.classList.add('is-placeholder'); const prog = mk('div', 'prog', box.el); a.setMode('arrow');
        await W(tween(340, (t) => { prog.style.width = (t * 100) + '%'; }));
        L.el.classList.add('is-built'); L.el.style.animationDuration = ''; finish(L, 'sw-in-blur'); await W(sleep(170)); box.fade();
      }
      /* ------------- text + chips ------------- */
      else if ((L.type === 'text' || L.type === 'chip') && L.mode !== 'wipe') {
        await drawBox(a, L, box, 'drag', chk);
        await typeLayer(a, L, box, chk); finish(L, null); box.fade();
      } else if (L.type === 'text' || L.type === 'chip') {                                   // wipe (giant gradient word / text with child nodes)
        await drawBox(a, L, box, big ? 'resize' : 'drag', chk); a.setMode('arrow'); finish(L, 'sw-in-wipe'); await W(sleep(300)); box.fade();
      }
      /* ------------- buttons (colour swatch, red fill) ------------- */
      else if (L.type === 'button') {
        await drawBox(a, L, box, 'drag', chk); a.setMode('arrow');
        if (L.rnd() < S.cfg.swatchRate) {
          const r = vr(L); const sw = mk('div', 'sw-swatches', layerEl(), '<i style="background:#2f8cff"></i><i style="background:#ffffff"></i><i style="background:#ef4337"></i><i style="background:#fcd34d"></i>');
          sw.style.left = (r.x) + 'px'; sw.style.top = (r.y - 34) + 'px'; const dots = sw.querySelectorAll('i');
          const f = () => { const q = vr(L); sw.style.left = q.x + 'px'; sw.style.top = (q.y - 34) + 'px'; }; followers.add(f);
          await W(sleep(140)); a.track = () => { const d = dots[2].getBoundingClientRect(); return { x: lerp(a.x, d.left + 7, 0.4), y: lerp(a.y, d.top + 7, 0.4) }; };
          await W(sleep(300)); a.click(); dots[2].classList.add('pick'); await W(sleep(180)); followers.delete(f); sw.classList.add('is-out'); setTimeout(() => sw.remove(), 250); a.track = null;
        }
        box.el.classList.add('is-filled'); await W(sleep(220)); finish(L, 'sw-in-fade'); await W(sleep(120)); box.fade();
      }
      /* ------------- cards & big panels: red outline, optionally dragged into place ------------- */
      else if (L.type === 'card' || bigPanel) {
        await drawBox(a, L, box, L.rnd() < S.cfg.moveRate ? 'move' : (L.rnd() < S.cfg.resizeRate ? 'resize' : 'drag'), chk); a.setMode('arrow');
        await W(sleep(180)); finish(L, 'sw-in-rise'); await W(sleep(160)); box.fade();
      }
      /* ------------- icons ------------- */
      else if (L.type === 'icon') {
        await drawBox(a, L, box, 'drag', chk); a.setMode('arrow'); a.click(); finish(L, 'sw-in-pop'); await W(sleep(140)); box.fade();
      }
      /* ------------- hairlines ------------- */
      else if (L.type === 'line') {
        await drawBox(a, L, box, 'line', chk); a.setMode('arrow'); finish(L, L.h > L.w * 3 ? 'sw-in-wipey' : 'sw-in-wipe'); await W(sleep(120)); box.fade();
      }
      /* ------------- inputs: draw the field, click in, type the placeholder ------------- */
      else if (L.type === 'input') {
        await drawBox(a, L, box, 'drag', chk);
        const inp = L.el.querySelector('input'), ph = (inp && inp.placeholder) || ''; const r0 = vr(L);
        a.setMode('ibeam'); const span = mk('span', 'sw-ph', box.el); span.style.left = '38px'; span.style.top = (r0.h / 2 - 7) + 'px';
        a.track = () => { const q = span.getBoundingClientRect(); return { x: lerp(a.x, q.right + 6, 0.5), y: lerp(a.y, q.top + q.height / 2, 0.5) }; }; a.click();
        const pch = Array.from(ph); await W(tween(Math.max(300, pch.length * 40), (t) => { span.textContent = pch.slice(0, Math.ceil(t * pch.length)).join(''); }));
        await W(sleep(120)); finish(L, 'sw-in-fade'); box.fade();
      }
      /* ------------- shapes (dots, nodes, bars, panels) ------------- */
      else {
        await drawBox(a, L, box, L.rnd() < S.cfg.moveRate ? 'move' : 'drag', chk); a.setMode('arrow');
        box.el.classList.add('is-filled'); await W(sleep(160)); finish(L, 'sw-in-fade'); await W(sleep(100)); box.fade();
      }
    } catch (e) { box.kill(); throw e; }
    a.track = null; a.setMode('arrow');
  }

  /* logo chains: a long row of small RED boxes sweeping left -> right, ~120 ms apart, logos pop in colour */
  async function buildLogoRow(a, L, chk) {
    const row = [L].concat(S.layers.filter((x) => !x.claimed && x.type === 'logo' && x.section === L.section && Math.abs(x.y - L.y) < 40));
    row.forEach((x) => { x.claimed = true; }); row.sort((p, q) => p.x - q.x);
    const first = vr(row[0]); await a.flyTo(() => { const r = vr(row[0]); return [r.x, r.y]; }, flightMs(a, row[0])); chk();
    a.setMode('cross');
    for (const X of row) {
      chk(); const r = vr(X); if (isOff(r)) { finish(X, null); continue; }
      const box = new Box('logo', X); box.gx = box.gy = 1; box.update();
      a.track = () => { const q = vr(X); return { x: q.x + q.w, y: q.y + q.h }; };
      tween(150, null).then(() => { if (S.run === a.run && !S.stop) { finish(X, 'sw-in-pop'); box.fade(); } else box.kill(); });
      await tween(120, null); chk();
    }
    a.track = null; a.setMode('arrow'); await tween(160, null); chk();
  }

  /* ======================================================================= 10. LOOPS */
  async function agentLoop(a) {
    while (!S.stop && S.run === a.run) {
      const L = claim(a);
      if (!L) { if (S.layers.every((l) => l.claimed)) break; if (!a.idle) { a.cx = a.x; a.cy = a.y; } a.idle = true; a.track = null; await sleep(110); continue; }
      a.idle = false;
      try { await build(a, L); } catch (e) { if (e !== ABORT) { console.error('[swarm] build failed, forcing layer visible', e, L.el); finish(L, null); } else break; }
    }
    a.idle = true; a.track = null; a.setMode('arrow'); a.draw();
  }

  /* one follower: agents tracking things, idle flocks, auto-scroll tour, orbit, pace controller, joins, HUD progress */
  let ctlAcc = 0, loops = [];
  function mainFollower(dt) {
    /* agents */
    S.agents.forEach((a, i) => {
      if (S.orbit) return;
      if (a.track) { const p = a.track(); if (p) { a.x = p.x; a.y = p.y; } a.draw(); }
      else if (a.idle && S.state !== 'scan' && S.state !== 'live') flockStep(a, dt, a.cx || innerWidth / 2, a.cy || innerHeight / 2, 0.00012);
      else if (S.state === 'scan' && a.flock) flockStep(a, dt, a.flock.x * innerWidth, a.flock.y * innerHeight, 0.0007);
    });
    if (S.state === 'build' || S.state === 'finale') tourStep(dt);
    if (S.orbit) orbitStep(dt);
    if (S.state === 'build') controller(dt);
    if ($('#sw-ruler-left') && $('#sw-ruler-left').classList.contains('on')) updateRulerLabels();
  }

  function controller(dt) {
    /* join schedule */
    const scale = S.cfg.targetSeconds / 51.4, tsec = S.t / 1000;
    for (const [sec, count] of S.cfg.joins) while (S.agents.length < Math.min(count, S.cfg.maxAgents) && tsec >= sec * scale) spawn(true);
    /* pace controller: steer the layer count toward the reference curve so the run lasts ~targetSeconds */
    ctlAcc += dt; if (ctlAcc < 300) return; ctlAcc = 0;
    const u = S.t / (S.cfg.targetSeconds * 1000); const want = curve(u), have = S.total ? S.built / S.total : 1;
    S.pace = lerp(S.pace, clamp(2.15 * Math.exp(-4 * (want - have)), 0.3, 3.6), 0.4);   // behind schedule -> faster actions, ahead -> slower
    if (u > 1.0 || have > 0.97) S.pace = Math.min(S.pace, 0.55);           // final sprint
    emit('pace', S.pace);
  }

  function tourStep(dt) {
    if (S.stop) return; let target = null;
    if (S.tourOverride) target = S.tourOverride();
    else if (S.tour && !S.userScrolled) { const L = S.layers[S.firstFree]; if (L) target = (L.fixed ? 0 : L.y) - innerHeight * 0.34; }
    if (target == null) return;
    const max = document.documentElement.scrollHeight - innerHeight; target = clamp(target, 0, Math.max(0, max));
    const d = target - scrollY; if (Math.abs(d) < 0.6) return;
    const step = clamp(d * (1 - Math.exp(-dt / 330)), -2.4 * dt, 2.4 * dt); window.scrollTo(0, scrollY + step);
  }

  function orbitStep(dt) {
    const o = S.orbit, el = $(S.cfg.finaleTarget) || document.body, r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    S.agents.forEach((a, i) => {
      if (a.peel) { return; }
      a.theta += (0.0018 + (i % 3) * 0.0005) * dt;
      const rad = a.radius * (1 + 0.14 * Math.sin(S.t / 650 + i)); a.setMode('arrow');
      const k = 1 - Math.exp(-dt / 160), tx = cx + Math.cos(a.theta) * rad * 1.25, ty = cy + Math.sin(a.theta) * rad * 0.8;
      a.x += (tx - a.x) * k; a.y += (ty - a.y) * k;
      a.rot = ((a.theta + Math.PI / 2) * 180) / Math.PI + 135; a.draw();
    });
  }

  /* ======================================================================= 11. LIFECYCLE */
  function spawn(fromEdge) {
    const id = S.agents.length; let x = R() * innerWidth, y = R() * innerHeight;
    if (fromEdge) { const side = Math.floor(R() * 4); if (side === 0) { x = -20; } else if (side === 1) { x = innerWidth + 20; } else if (side === 2) { y = -20; } else { y = innerHeight + 20; } }
    const a = new Agent(id, x, y); a.flock = { x: 0.5, y: 0.5 }; a.cx = x; a.cy = y; S.agents.push(a); emit('agents', S.agents.length);
    if (S.state === 'build') loops.push(agentLoop(a)); return a;
  }
  function setState(s) { S.state = s; emit('state', s); }

  async function start(opts = {}) {
    Object.assign(S.cfg, opts); await teardown(true);
    const root = $('#swarm-root'); const html = document.documentElement;
    if (!root) { console.error('[swarm] #swarm-root missing'); html.classList.remove('is-building'); return; }
    window.__swarmStarted = true; html.classList.add('is-building'); S.stop = false; const run = ++S.run;
    R = mulberry(S.cfg.seed); S.speed = S.cfg.speed || 1; document.documentElement.style.setProperty('--sw-speed', S.speed);
    S.pace = 1.8; S.t = 0; S.real = 0; S.userScrolled = false; S.tourOverride = null; S.orbit = null; S.tour = true; S.agents = []; loops = []; S.guideOwner = null; S.lastClaim = 0;
    try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* ignore */ }
    window.scrollTo(0, 0);
    collect(); buildRulers(); root.classList.add('on'); layerEl().innerHTML = ''; agentsEl().innerHTML = '';
    $('#sw-watermark').classList.remove('off'); const wm = $('#sw-watermark'); if (opts.initial) wm.textContent = opts.initial;
    startClock(); followers.add(mainFollower);
    window.addEventListener('wheel', onUserScroll, { passive: true }); window.addEventListener('touchmove', onUserScroll, { passive: true }); window.addEventListener('keydown', onKey);
    remeasureTimer = setInterval(() => { if (S.state === 'build') remeasureFree(); }, 900);
    window.addEventListener('resize', onResize);

    /* ---- phase A: scan — two flocks drift around ---- */
    setState('scan'); emit('progress', 0, S.total);
    for (let i = 0; i < S.cfg.startAgents; i++) { const A = i < Math.ceil(S.cfg.startAgents / 2); const a = new Agent(i, (A ? 0.35 : 0.65) * innerWidth + (R() - 0.5) * 160, (A ? 0.6 : 0.45) * innerHeight + (R() - 0.5) * 160); a.flock = A ? { x: 0.35, y: 0.6 } : { x: 0.65, y: 0.45 }; S.agents.push(a); }
    emit('agents', S.agents.length);
    await sleep(S.cfg.scanMs); if (S.run !== run) return;

    /* ---- phase B: scatter to the edges as crosshairs / I-beams, rulers + scan bars flash ---- */
    scanFlash(); showRulers(2600, run);
    const n = S.agents.length; const ps = [];
    S.agents.forEach((a, i) => {
      a.flock = null; a.setMode(i % 2 ? 'ibeam' : 'cross'); a.idle = false;
      const tx = i < 12 ? 16 : (i % 2 ? innerWidth - 22 : 40 + (i - 12) * 30), ty = i < 12 ? 70 + i * ((innerHeight - 160) / 12) : (i % 2 ? 70 + i * 24 : innerHeight - 90);
      ps.push(a.flyTo(() => [tx, ty], S.cfg.scatterMs + R() * 160).then(() => { a.setMode(i % 2 ? 'ibeam' : 'cross'); }));
    });
    await Promise.all(ps); if (S.run !== run) return;

    /* ---- phase C: build ---- */
    S.buildT0 = S.t; setState('build');
    S.agents.forEach((a) => { a.idle = true; a.setMode('arrow'); });
    S.cfg.previewSections.forEach((sec) => S.layers.filter((L) => L.section === sec).forEach((L, k) => { tween(k * 14, null).then(() => { if (S.run === run && !L.claimed) makePreview(L); }); }));
    setTimeout(() => { if (S.run === run) $('#sw-watermark').classList.add('off'); }, 2200 / S.speed);
    await sleep(S.cfg.previewMs); if (S.run !== run) return;
    loops = S.agents.map((a) => agentLoop(a));
    for (;;) { const cur = loops.slice(); await Promise.all(cur); if (S.run !== run || S.stop) return; if (loops.length === cur.length) break; }   // agents may join while we wait
    S.layers.forEach((L) => { if (!L.done) finish(L, null); });
    await finale(run);
  }

  async function finale(run) {
    S.doneSeconds = Math.round(S.real / 100) / 10;                          // wall-clock seconds from the first frame to the last layer
    while (S.agents.length < S.cfg.maxAgents) spawn(true);                   // the last agents always arrive before "Rebuilt by 30 agents"
    emit('agents', S.agents.length);
    S.tourOverride = () => { const el = $(S.cfg.finaleTarget); if (!el) return null; const r = el.getBoundingClientRect(); return scrollY + r.top - (innerHeight - r.height) / 2; };
    setState('finale'); Sound.chime();
    const r0 = ($(S.cfg.finaleTarget) || document.body).getBoundingClientRect(); const cx = r0.left + r0.width / 2, cy = r0.top + r0.height / 2;
    S.agents.forEach((a, i) => { a.theta = Math.atan2(a.y - cy, a.x - cx); a.radius = 105 + (i % 4) * 36; a.peel = false; a.track = null; a.idle = false; });
    S.orbit = { t0: S.t };
    /* a few agents peel off to the top-right corner, staggered */
    const peelers = S.agents.slice(-5);
    peelers.forEach((a, k) => { sleep(1400 + k * 380).then(async () => { if (S.run !== run || S.state !== 'finale') return; a.peel = true; await a.flyTo(() => [innerWidth + 40, -40], 900); }); });
  }

  const onResize = () => { clearTimeout(S.rz); S.rz = setTimeout(() => { remeasureFree(); buildRulers(); }, 150); };
  const onUserScroll = () => { if (S.state === 'build' && S.tour) { S.userScrolled = true; S.tour = false; emit('tour', false); } };
  const onKey = (e) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key) && S.state === 'build' && S.tour) onUserScroll(); };
  let remeasureTimer = 0;

  /* ---- reset every layer to its pre-build state (used by replay / abort) ---- */
  function restoreAll(markBuilt) {
    S.layers.forEach((L) => {
      const el = L.el; el.classList.remove('sw-in-fade', 'sw-in-blur', 'sw-in-pop', 'sw-in-wipe', 'sw-in-wipey', 'sw-in-rise');
      if (L.full != null && L.mode !== 'wipe') el.textContent = L.full; el.style.minWidth = el.style.minHeight = '';
      if (markBuilt) el.classList.add('is-built'); else el.classList.remove('is-built');
    });
  }

  async function teardown(forRestart) {
    S.stop = true; S.run++; flush(); await new Promise((r) => setTimeout(r, 0));
    followers.clear(); tasks.clear(); pending.clear(); previews.clear(); clearInterval(remeasureTimer);
    window.removeEventListener('wheel', onUserScroll); window.removeEventListener('touchmove', onUserScroll); window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize);
    const l = layerEl(), g = agentsEl(); if (l) l.innerHTML = ''; if (g) g.innerHTML = '';
    ['#sw-ruler-top', '#sw-ruler-left'].forEach((s) => { const e = $(s); if (e) e.classList.remove('on'); });
    const gd = $('#sw-guide'); if (gd) gd.classList.remove('on');
    S.agents = []; S.orbit = null; S.tourOverride = null; loops = [];
    if (!forRestart) { stopClock(); const root = $('#swarm-root'); if (root) root.classList.remove('on'); }
  }

  /* ---- public controls ---- */
  S.start = start;
  S.abort = async () => {                                                  // the ✕ button: reveal everything instantly
    if (S.state === 'live' || S.state === 'abort' || S.state === 'idle') return; const had = S.layers.length;
    await teardown(false); if (had) restoreAll(true); document.documentElement.classList.remove('is-building'); setState('abort'); emit('end', 'abort');
  };
  S.goLive = async () => {                                                 // "Go live" after the finale
    if (S.state !== 'finale') return; const run = S.run; S.orbit = null; setState('live');
    S.agents.forEach((a, i) => { sleep(i * 25).then(() => a.flyTo(() => [innerWidth + 60, -60], 700 + (i % 5) * 80)); });
    window.scrollTo({ top: 0, behavior: 'smooth' }); await sleep(1100); if (S.run !== run) return;
    await teardown(false); document.documentElement.classList.remove('is-building'); emit('end', 'live');
  };
  S.replay = async () => {
    const wasLive = S.state === 'live' || S.state === 'abort' || S.state === 'idle';
    if (!wasLive) { await teardown(true); restoreAll(false); } else { restoreAll(false); }
    document.documentElement.classList.add('is-building'); emit('replay'); await start({});
  };
  S.setSpeed = (v) => { S.speed = v; S.cfg.speed = v; document.documentElement.style.setProperty('--sw-speed', v); emit('speed', v); };
  S.setTour = (on) => { S.tour = !!on; S.userScrolled = !on; emit('tour', S.tour); };
  S.stats = () => ({ agents: S.agents.length, built: S.built, total: S.total, seconds: S.doneSeconds, state: S.state });
})();
```

**js/hud.js**
```js
/* js/hud.js — bottom control bar for the swarm. 3 states: scanning · building · done.
   Subscribes to Swarm events; owns NO build logic. Buttons: Tour/Touring, 1x cycle, speaker, ✕, Go live, Replay. */
(() => {
  const S = window.Swarm; if (!S) return;
  const hud = document.getElementById('sw-hud'); if (!hud) return;
  const SPEEDS = [1, 2, 4, 0.5];
  const COLORS = ['#5eead4', '#fb923c', '#ffffff', '#a78bfa', '#7dd3fc', '#fda4af', '#fcd34d', '#86efac'];
  const ICON_ON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const ICON_OFF = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';
  const X = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>';
  let mode = null, refs = {};

  const stack = () => `<span class="stack">${COLORS.slice(0, 5).map((c) => `<i style="background:${c}"></i>`).join('')}</span>`;
  const speaker = () => `<button type="button" data-a="sound" aria-label="Toggle sound" title="Sound">${S.sound ? ICON_ON : ICON_OFF}</button>`;
  const close = () => `<button type="button" data-a="close" aria-label="Skip the intro" title="Skip">${X}</button>`;

  function render(next) {
    if (next === mode) return; mode = next; hud.classList.add('on');
    if (next === 'scan') hud.innerHTML = `<span class="txt">Scanning page…</span><span class="track indet"><i></i></span><button type="button" data-a="tour" class="ghost">Tour</button><button type="button" data-a="speed">${S.speed}x</button>${speaker()}${close()}`;
    else if (next === 'build') hud.innerHTML = `${stack()}<span class="txt"><b id="hAg">${S.agents.length}</b> agents</span><span class="div"></span><span class="txt"><b id="hBu">0</b> / <span id="hTo">${S.total}</span> layers</span><span class="track"><i id="hBar"></i></span><button type="button" data-a="tour" id="hTour" class="${S.tour ? 'pill' : 'ghost'}">${S.tour ? 'Touring' : 'Tour'}</button><button type="button" data-a="speed" id="hSp">${S.speed}x</button>${speaker()}${close()}`;
    else if (next === 'done') hud.innerHTML = `<span class="txt">Rebuilt by <b>${S.agents.length} agents</b> in <b>${S.doneSeconds.toFixed(1)}s</b></span><span class="track wide"><i style="width:100%"></i></span>${speaker()}<button type="button" data-a="live" class="pill">Go live</button><button type="button" data-a="replay" class="ghost">Replay</button>${close()}`;
    refs = { ag: hud.querySelector('#hAg'), bu: hud.querySelector('#hBu'), to: hud.querySelector('#hTo'), bar: hud.querySelector('#hBar'), tour: hud.querySelector('#hTour'), sp: hud.querySelector('#hSp') };
    const first = hud.querySelector('button'); /* keep keyboard focus predictable */
  }

  S.on('state', (s) => {
    if (s === 'scan') render('scan'); else if (s === 'build') render('build'); else if (s === 'finale') render('done');
    else if (s === 'live' || s === 'abort') { hud.classList.remove('on'); hud.innerHTML = ''; mode = null; }
  });
  let lastDraw = 0;
  S.on('progress', (b, t) => {
    const n = performance.now(); if (mode !== 'build' || (n - lastDraw < 90 && b < t)) return; lastDraw = n;
    if (refs.bu) refs.bu.textContent = b; if (refs.to) refs.to.textContent = t; if (refs.bar) refs.bar.style.width = (t ? (b / t) * 100 : 0) + '%';
  });
  S.on('agents', (n) => { if (refs.ag) refs.ag.textContent = n; });
  S.on('tour', (on) => { if (refs.tour) { refs.tour.textContent = on ? 'Touring' : 'Tour'; refs.tour.className = on ? 'pill' : 'ghost'; } });
  S.on('speed', (v) => { if (refs.sp) refs.sp.textContent = v + 'x'; hud.querySelectorAll('[data-a="speed"]').forEach((b) => { b.textContent = v + 'x'; }); });
  S.on('sound', () => { hud.querySelectorAll('[data-a="sound"]').forEach((b) => { b.innerHTML = S.sound ? ICON_ON : ICON_OFF; }); });

  hud.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return; const a = b.dataset.a;
    if (a === 'tour') S.setTour(!S.tour);
    else if (a === 'speed') S.setSpeed(SPEEDS[(SPEEDS.indexOf(S.speed) + 1) % SPEEDS.length]);
    else if (a === 'sound') S.setSound(!S.sound);
    else if (a === 'close') S.abort();
    else if (a === 'live') S.goLive();
    else if (a === 'replay') S.replay();
  });
})();
```

### 5.10 Tuning knobs (only after the tests pass; edit via `Swarm.start({...})` in `main.js`, never inside the engine)
| Knob (`cfg`) | Default | Effect |
|---|---|---|
| `targetSeconds` | 51.4 | total run time at 1x (the pace controller steers the layer curve to this) — raise/lower to make the intro longer/shorter |
| `startAgents` / `maxAgents` | 18 / 30 | cursors at start / at the end |
| `joins` | `[[6,19],[12,23],[17,24],[31,28],[39,29],[48,30]]` | `[seconds, agentCount]` schedule (scaled with `targetSeconds`) |
| `editRate` | .34 | share of long text layers that get select-and-retype / typo-fix |
| `resizeRate`, `moveRate`, `swatchRate` | .5, .35, .6 | gesture probabilities (see 5.7 C) |
| `previewSections` | `['nav','hero']` | which sections get the all-at-once wireframe stage |
| `finaleTarget` | `'#poster'` | element the cursors orbit |
| `scanMs`, `scatterMs`, `previewMs` | 800, 420, 700 | scan / scatter / wireframe-stage lengths |
| `seed` | 7 | choreography seed (changes *which* layers get edits; replay-stable) |

### 5.11 Troubleshooting map (symptom → cause → fix **in your code**)
- *Boxes drawn in the wrong place / jumping:* an ancestor has `transform`/parallax during the intro, or layout shifts after load (fonts, images). Apply rule 3 of 4.2, give images dimensions, make sure `main.js` is unchanged (it waits for fonts via the engine and decodes the hero image).
- *"text layer was display:inline" console warnings:* fix the CSS (4.2 rule 1). The engine forces inline-block as a safety net but the boxes will be less tidy.
- *Text layer with child elements warning:* you changed the markup — restore it.
- *Selection boxes are huge/full-width around short text:* the text layer is a block without `width:fit-content`.
- *Run is much shorter/longer than ~50 s:* check that the number of layers is ≈ 350–400 and that nothing in your CSS hides layers (a `display:none` parent makes layers count as zero-size and skip the show). Then adjust `targetSeconds`.
- *Page stays invisible after the intro:* some module threw before `afterIntro`; open the console. `main.js` always calls `afterIntro` on failure; the inline 4-second fail-safe covers the case where scripts never load.
- *Marquee looks wrong during the intro:* it must not exist during the intro (clones are created in `Marquee.init()` after the intro; the row is static while building).
- *Cards beyond the first three animate too:* they are off-screen to the right by design; they appear instantly. Make sure the slider track does not wrap to a second row.
- *Gradient giant word is solid white/red or the wipe shows a box:* the gradient must be on the layer element itself with `background-clip:text; -webkit-background-clip:text; color:transparent`.

---------------------------------------------------------------------
## PART 6 — CLASS-BY-CLASS STYLING SPEC (write `base.css`, `layout.css`, `components.css` from this)

All sizes are for a 1440 px desktop reference, then Part 6.11 gives the responsive rules. Use the tokens from Part 3. **Every class that exists in `index.html` / `render.js` is named below** (a coverage check in Part 10 greps for this). Classes with state suffixes: `is-active`, `is-open`, `is-now`, `is-lit`, `is-live`, `is-built`, `is-building`.

### 6.0 Global / base (`base.css`)
- `*{box-sizing:border-box}`; body: `background:var(--bg); color:var(--text); font:400 15px/1.6 var(--f-body); -webkit-font-smoothing:antialiased; overflow-x:hidden`. Links inherit colour, no underline. Images `display:block;max-width:100%`.
- `.skip` — visually hidden until focused, then fixed top-left, red background, white text.
- `.sr-only` — standard screen-reader-only utility.
- `.accent` — `color:var(--accent)`. `.red` — `color:var(--red)`. `.dim` — `opacity:.7`. `.line` — `display:block` (a heading line; lines are separate text layers).
- `.eyebrow`, `.eyebrow--red`, `.label-red`, `.h-display`, `.h-display--sm`, `.h-display--xl`, `.h-bold`, `.h-bold--one`, `.h-bold--sm` — per 3.2 (`.h-bold--one{white-space:nowrap}` above 1100px; wrap below).
- `.btn` (shared button): inline-flex, centred, gap 10px, `height:44px`, `font:700 13px var(--f-ui)`, colour white, radius 2px. `.btn--primary` — `background:var(--btn)`, width 190px; hover lightens 6%, `.btn__arrow` drops 4px; `.btn__label` is the text span, `.btn__arrow` the ↓ glyph.
- `.link-all` — inline-flex gap 6px, `font:700 11px var(--f-ui)` uppercase tracking .08em; the arrow slides 4px right on hover. `.link-red` — same but colour `var(--red)`.
- Focus ring: `:focus-visible{outline:2px solid var(--accent);outline-offset:3px}`.
- `.vignette` — fixed inset 0, `background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.35))`, `pointer-events:none`, z-index `var(--z-grain)`. `#grain` — fixed full-screen canvas, opacity .06, `pointer-events:none`, same z-index.
- `.toast` — fixed bottom-centre (88px up, above the HUD), dark pill `rgba(16,18,22,.95)`, 12px text, translateY(12px)+opacity 0 → `.is-show` shows; auto-hides after 2.4 s.
- `.cur-dot` (8px red dot, `mix-blend-mode:difference`) and `.cur-ring` (36px ring, 1px `rgba(255,255,255,.5)`, has a `<span>` for the label like `VIEW`/`OPEN`/`DRAG`): fixed, `pointer-events:none`, z `var(--z-cursor)`, hidden on touch (`@media (hover:none){display:none}`) and until `SiteCursor.enable()` adds `html.has-cursor`.
- `.menu` — fixed full-screen overlay `rgba(7,7,10,.97)`, hidden by default, `.is-open` shows it with big Anton links (clamp(48px,12vw,96px)) stacked and staggered in. `.modal` / `.palette` — see 6.12 (components).

### 6.1 Nav (`layout.css`)
- `.nav` fixed top, `height:var(--nav-h)`, flex space-between, padding 0 var(--pad), `background:rgba(7,7,10,.8)`, `backdrop-filter:blur(14px)`, bottom 1px `var(--line)`, z `var(--z-nav)`.
- `.nav__logo` flex baseline; `.nav__word` Anton 22px; `.nav__dot` 6px red circle, margin-left 4px, margin-bottom -2px.
- `.nav__links` absolutely centred (left 50%, translateX(-50%)), flex gap 32px, 13px/500 `var(--text-2)`; each `a` position relative; `a.is-active` colour white. `.nav__underline` absolute bottom -6px, height 2px, `background:var(--red)`, width/translateX set by `Scroll` JS (CSS var `--ul-x`, `--ul-w`), `transition:transform .4s var(--ease), width .4s var(--ease)`.
- `.nav__right` flex gap 22px, align centre. `.nav__motion` button (11px muted, flex gap 6px; `.nav__tri` is the ▷ glyph), `.nav__talk` (12px white, flex gap 4px; `.nav__chev` moves 4px right on hover). `.nav__burger` hidden ≥861px; 2 bars 22×2px.

### 6.2 Hero (`#home`, `.hero`)
`.hero{position:relative; min-height:100vh; height:max(100vh,760px); overflow:hidden; padding:0}`. Everything inside is absolutely positioned (percentages of the hero) exactly as follows:
1. **`.hero__giant`** (`#giant`) — Anton uppercase, `line-height:.8`, `letter-spacing:-.02em`, `white-space:nowrap`, `left:3vw; top:14%`, z 1. `Hero.fit()` sets its `font-size` so its rendered width = 94% of the viewport (≈ 24vw at 1440). Fill: `background:linear-gradient(180deg,#ff3b30 0%,#c8231f 45%,rgba(70,10,10,.85) 80%,rgba(10,10,10,0) 100%); -webkit-background-clip:text; background-clip:text; color:transparent`.
2. **`.hero__photo`** — z 2, `bottom:0; left:50%`, height 88vh, width auto (aspect 1086/1448 → ≈ 46vh·…; set `aspect-ratio:1086/1448`), translateX(-44%) so the head overlaps the middle letters of the giant word. The `<img>` fills it: `object-fit:contain; object-position:bottom`; `filter:drop-shadow(0 0 40px rgba(255,59,48,.25))`. `.hero__fallback` (the inline SVG silhouette) is `display:none`; `hero.js` shows it only if the image errors.
3. **`.hero__left`** — z 3, `left:4vw; top:34vh; width:320px`, flex column gap 10px:
   - `.hero__hello` — script 44px, white, `transform:rotate(-4deg)`, margin-bottom -8px.
   - `.hero__name` — Anton `clamp(60px,8vw,140px)`, line-height .9, white, `text-shadow:0 2px 0 rgba(0,0,0,.35),0 10px 40px rgba(0,0,0,.5)`; contains the text span and `.hero__period` = 0.14em red square, inline-block, margin-left .06em.
   - `.hero__full` — 11px/700 uppercase tracking .18em muted.
   - `.hero__role` — Plus Jakarta 800 24px uppercase, line-height 1.05, colour `var(--accent)`; two `.line` children.
   - `.hero__intro` — 15px/1.6 `var(--text-2)`, max-width 300px.
   - `.hero__cta` — `.btn.btn--primary` 190×44.
   - `.hero__loc` — flex gap 8px, 10px/600 uppercase tracking .12em muted; `.hero__pin` red 14px glyph.
   - `.hero__bar` — 120×3px `var(--red)` block.
4. **`.hero__tag`** (+ `--tl`, `--tl2`) — 11px uppercase muted, absolute `left:4vw`, `top:84px` and `top:104px`. **`.hero__avail`** — absolute `right:var(--pad); top:84px`, flex gap 8px, 11px uppercase; **`.hero__pulse`** — 6px green(#34d399) circle with a pulsing ring (`@keyframes` scale .8→1.8 opacity 1→0, 1.6s infinite; paused in Motion-off).
5. **`.hero__live`** — absolute `left:4vw; bottom:70px`, flex gap 12px; `.hero__live-ring` 36px circle, 1.5px `var(--red)` border, white `↗` centred; `.hero__live-txt` column: first line 11px/800 uppercase white, second 9px muted.
6. **`.hero__right`** — z 3, absolute `right:var(--pad); top:32vh; width:210px`, flex column gap 16px:
   - `.hero__tagline` — 11px/1.5; `.hero__star` red ✳ (14px, margin-bottom 4px); two `.line`s.
   - `.stats` — column; `.stat` = grid `70px 1fr`, areas `"l l" "n t"`, row gap 8px; `.stat__line` — 1px hairline (the first one has a 28px red accent: `.stat:first-child .stat__line{background:linear-gradient(90deg,var(--red) 28px,var(--line-strong) 28px)}`); `.stat__n` Anton 44px red; `.stat__l` 9px uppercase tracking .12em muted, 2 lines max.
   - `.hero__cv` — flex gap 6px, 10px/700 uppercase.
7. **`.hero__scroll`** — absolute `left:50%; bottom:24px; translateX(-50%)`, 9px uppercase; `.hero__dot` 6px red dot bobbing 6px (1.6s loop; paused in Motion-off). **`.hero__range`** — absolute `right:var(--pad); bottom:24px`, 9px muted.
Hero motion (set up by `Hero.afterIntro`, never during the intro): scroll parallax (giant word 0.15, photo 0.05, text 0), mouse parallax ±26px word / ±14px photo (lerped), and a 260px radial spotlight `rgba(255,120,100,.35)` with `mix-blend-mode:screen` following the mouse over the giant word. Elements that move carry `data-parallax`.

### 6.3 Section chrome shared by Work / Proof / About / Journey / Contact
- `section` (except `.hero`, `.logos`): `padding:clamp(96px,12vw,160px) var(--pad); border-top:1px solid var(--line); max-width:none`; inner content is capped to `var(--maxw)` by `padding-inline:max(var(--pad),calc((100vw - var(--maxw))/2 + var(--pad)))`.
- `.sec__head` — flex space-between, align end, margin-bottom 36px (eyebrow above the H2 on the left; link right).

### 6.4 Selected Work (`.work`)
- `.work__bar` — flex space-between, margin-bottom 28px, border-bottom 1px `var(--line)` padding-bottom 14px.
- `.tabs` — flex gap 26px, relative; `.tab` button: no background/border, 13px/500 `var(--muted)`, padding 0 0 12px; `.tab.is-active` white; `.tabs__underline` absolute bottom -1px height 2px red, moved by `Work` JS with `--ul-x/--ul-w` (transition .4s).
- `.search` — flex gap 8px, width 240px, bottom hairline; `.search__ico` ⌕; the input transparent, 12px; focus → bottom border red.
- `.slider` — `overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none`; **cursor grab, drag-to-scroll with inertia** (`Work`). `.slider__track` — flex, gap 24px, no wrapping.
- **`.card`** (the red-outlined build target) — `flex:0 0 calc((100% - 48px)/3)` (2-up ≤1024, 1.15-up ≤640 with peek), scroll-snap-align start, position relative, `transition:transform .5s var(--ease)`, outline 1px transparent → on hover `outline-color:var(--red)`, 3D tilt ±6° (JS sets `--rx/--ry`). 
  - `.card__media` — `aspect-ratio:16/9`, position relative, overflow hidden, radius 2px, `background:linear-gradient(135deg,#2a1114,#10131c)` with a faint diagonal red/blue glow (`radial-gradient(60% 80% at 20% 0%,rgba(255,59,48,.25),transparent),radial-gradient(60% 80% at 100% 100%,rgba(59,130,255,.18),transparent)`); `.card__img` fills it (`object-fit:cover`, hover scale 1.05 over .8s); **`.card__initials`** — absolute centre, Anton 130px, opacity .12 (fallback look when no image); `.card__stack` — absolute left 12px bottom 8px, 10px muted (the stack line, also part of the fallback look); `.card__tag` — absolute left 10px top 10px, 9px/800 uppercase, padding 4px 7px, `background:rgba(0,0,0,.6)`, 2px red left border.
  - `.card__row` — flex gap 14px, align centre, padding-top 14px; `.card__n` Anton 34px red; `.card__txt` flex 1; `.card__title` Plus Jakarta 800 13px uppercase, tight tracking; `.card__meta` 10px muted; `.card__arrow` 18px, turns red and moves 4px up-right on hover.
- `.slider__ctrl` — flex gap 14px align centre, margin-top 22px; `.sbtn` 38px circle, 1px `var(--line-strong)`, hover red border; `.slider__count` right-aligned (margin-left auto), 11px/700 uppercase. Filtering uses FLIP (0.5s). **Projects with `placeholder:true`** show a small `PLACEHOLDER` chip in the media corner (added by `Work`).

### 6.5 Tech strip (`.logos`)
- `.logos` — flex, align centre, gap 40px, padding 44px var(--pad), border-top/bottom hairline, overflow hidden. `.logos__label` — column, flex `0 0 170px`, first line 11px/800 uppercase white, second 10px muted. `.logos__mask` — flex 1, overflow hidden, `mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)`. `.logos__row` — flex, gap 96px, width max-content (the row is deliberately cut off at the right edge). `.logo` — flex column, align centre, gap 8px, width ~150px, opacity .85 (1 on hover); `.logo__ico` 28px high (`.logo__ico--word` = styled text wordmark fallback: Plus Jakarta 800 15px, coloured by its inline colour); `.logo__name` 10px muted. `Marquee` (in `work.js`) clones the children once **after the intro**, then scrolls at 40px/s, pauses on hover, speeds up with scroll velocity.

### 6.6 Proof of work (`.proof`)
- `.proof` — grid `45fr 55fr`, gap 40px. `.proof__panel` — padding 56px, flex column gap 18px, `background:radial-gradient(120% 90% at 0% 0%,rgba(120,20,30,.55),transparent 60%),var(--bg-2)`.
  - `.h-display` inside: lines at ≈ 6.4vw; `.proof__big` — flex, align centre, gap 14px; `.proof__num` Anton 120px white (the `+` is part of the text; colour the whole numeral white and add a red `+` via `.proof__num::after{content:''}` NOT needed — keep it simple: white numeral); `.laurel` — 50×100px red stroked SVGs, `.laurel--l` mirrored (`transform:scaleX(-1)`), `.laurel--r` as drawn; `Hero.laurel()` draws them with `stroke-dasharray/offset`; `.proof__cap` 10px/800 red tracking .2em; `.proof__text` 14px max-width 360px; `.link-red`.
- `.proof__list` — `.proof__listhead` flex space-between, margin-bottom 12px. `.hls` list; each `li > a.hl` = grid `34px 1fr auto`, areas `"l l l" "n b m"`, column gap 14px, padding 18px 0, align centre: `.hl__line` 1px hairline (area l); `.hl__n` 10px red; `.hl__body` column: `.hl__title` Plus Jakarta 800 20px white, `.hl__sub` 11px muted; `.hl__metric` column align end: `.hl__val` Anton 34px red, `.hl__unit` 9px muted uppercase. Hover: row background `rgba(255,255,255,.03)`, title +8px right, metric −6px left, hairline turns red.

### 6.7 From Sketch to Shipped (`.raw`)
- `.raw` — grid `38fr 62fr`, gap 48px, align centre. `.raw__left` column gap 16px (eyebrow, `.h-display` ≈ 7vw lines, `.raw__text` 14px max-width 360px, `.raw__meta` column 9px uppercase muted).
- `.raw__right` — relative. **`.compare`** — `aspect-ratio:16/10`, relative, overflow hidden, radius 2px, `background:#0e0e12`, cursor ew-resize, `touch-action:pan-y`. `.compare__final` and `.compare__wire` are absolutely stacked (`inset:0`); `.compare__wire` is clipped with `clip-path:inset(0 calc(100% - var(--pos,50%)) 0 0)` (JS sets `--pos`). Images fill (`object-fit:cover`); the **wireframe fallback** when `raw-wireframe.jpg` is missing: `.compare__wire` shows `.fakeui--wire` (grey outline boxes on `#0b1626` with a 24px blueprint grid `repeating-linear-gradient`); the **final fallback** `.fakeui` is a pure-CSS fake app (header bar, sidebar, 4 content cards, code block) using `.fakeui > i` blocks (grid, gap 10px, `i` backgrounds `#1b1b22` with red/blue accents; `.fakeui--wire i` transparent with 1px `rgba(120,160,255,.5)` borders). If a real `<img>` loads, hide the `.fakeui` sibling (`img + .fakeui{display:none}`).
  - `.compare__line` — absolute top 0 bottom 0, `left:var(--pos,50%)`, 1px white. `.compare__handle` — 40px red circle with a faint white ring (`box-shadow:0 0 0 6px rgba(255,255,255,.12)`), centred on the line, `⇆` glyph. `.compare__lab` — absolute top 10px, 8px/800 uppercase, dark pill padding 5px 8px; `.compare__lab--l` left 10px, `.compare__lab--r` right 10px. `.compare__hint` — 9px uppercase muted, margin-top 12px.

### 6.8 Behind the Code (`.about`)
- `.about__head` — flex space-between, gap 40px, align end, margin-bottom 56px; `.about__text` 11px/1.7 muted max-width 300px.
- `.about__cols` — grid `1fr 1fr 300px`, gap 48px. `.about__col` column gap 16px.
- **Education column** (`.about__col--edu`): `.h-bold--sm`; `.label-red`; `.edu` list: `.edu__row` flex space-between, padding 12px 0, bottom hairline; `.edu__txt` column; `.edu__title` 14px/700 white; `.edu__sub` 12px muted; `.edu__tag` 10px muted (right). `.chips` — flex wrap gap 8px; `.chip` 10px/600, 1px `var(--line-strong)` border, radius 3px, padding 5px 9px. `.tiles` — flex wrap gap 12px; `.tile` 44×44, 1px `var(--line)` border, radius 4px, centred; `.tile__ico` 24px (`.tile__ico--word` = 9px wordmark fallback).
- **Process column** (`.about__col--process`): `.process` relative; `.process__spine` — absolute `left:41px; top:8px; bottom:8px; width:1px; background:var(--red)`, scaleY driven by scroll (after the intro) from the top; `.steps` column gap 26px; `.step` grid `38px 10px 1fr`, gap 14px: `.step__n` Anton 22px red; `.step__node` 8px circle, 2px red ring, dark centre; **`.step__node.is-lit`** fills red with a soft red glow; `.step__txt`: `.step__title` Plus Jakarta 800 12px uppercase, `.step__desc` 11px/1.6 muted (2 lines).
- **Quote column** (`.about__col--quote`): `.quote` — `margin:0`, ≈ 280×420, padding 26px, flex column space-between, `background:linear-gradient(160deg,#d62d27,#8e1713)` plus subtle noise (`url("data:image/svg+xml…feTurbulence…")` at .12 opacity), radius 4px, hover: 3D tilt + a light sheen sweeping across. `.quote__mark` 40px white; `.quote__text` (blockquote, `margin:0`) Plus Jakarta 300 26px/1.25 white, two `.line`s (`.dim` second line 70%); `.quote__sig` script 34px; `.quote__foot` 8px uppercase tracking .16em, two lines; `.quote__star` white ✳ bottom-right (absolute).

### 6.9 The Journey (`.journey`)
- `.journey__grid` — grid `60fr 30fr`, gap 60px. `.tl` — relative; `.tl__spine` — absolute `left:140px; top:0; bottom:0; width:1px; background:var(--red)`, scaleY (0→1) on scroll after the intro (static during).
- `.tl__list` list; `.tl__item` — grid `140px 1fr`, padding 20px 0, bottom hairline; `.tl__date` 10px muted (the `.is-now` one is red); `.tl__main` column, padding-left 28px; `.tl__head` — full-width button, flex space-between, text-align left, no chrome; `.tl__titles` column: `.tl__role` Plus Jakarta 800 22px white, `.tl__sub` 12px muted; `.tl__plus` 20px glyph rotating 45° when `aria-expanded=true`. **Accordion:** `.tl__panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s var(--ease)}` `.tl__item.is-open .tl__panel{grid-template-rows:1fr}`; `.tl__inner{overflow:hidden;min-height:0}`; `.tl__desc` 13px/1.6 muted, padding-top 12px. One open at a time; first open by default.
- `.miles` — column gap 16px: `.h-display--sm` (two `.line`s); `.ms-list` list; `.ms` — grid `26px 1fr auto auto`, gap 10px, padding 12px 0, bottom hairline; `.ms__t` is the 12px/700 title; `.ms__n` 10px red, `.ms__y` 9px muted, `.ms__a` ↗ (turns red on hover).

### 6.10 Contact (`.contact`) and Footer (`.footer`)
- `.contact` — grid `1fr 1fr 460px`, gap 40px, align start. `.contact__left` column gap 18px: `.h-display--xl` two `.line`s (the second ends with `.contact__period` = 0.1em red square, inline-block); `.contact__text` 14px max-width 380px; **`.cta`** — flex gap 12px align centre: `.cta__ring` 44px circle 1.5px red border, red `↗`; `.cta__txt` 11px/800 uppercase red; hover: ring fills red, arrow turns white and rotates 45° → 0.
- `.contact__rows` list; `.crow` — grid `28px 1fr auto`, areas `"i t a" "l l l"`, gap 12px, padding 14px 0, align centre; `.crow__ico` 28px red outline glyph; `.crow__txt` column: `small` 9px uppercase muted, `b` 14px/600 white; `.crow__a` ↗; `.crow__line` hairline in area l. Hover: arrow turns red, line grows red.
- **`.poster`** — ≈ 460×300, 1px `var(--line)` border, radius 4px, padding 22px, flex column space-between, relative, `background:#0a0a0c` with a faint code-grid (`linear-gradient` 24px lines at 4%) and grain; `.poster__brand` 10px; `.poster__title` Anton `clamp(48px,5vw,72px)`, line-height .9, two `.line`s (`.red` second); `.poster__btn` — absolute right 22 bottom 22, 44px red circle, white `↗`, `data-layer="button"`. Hover: lifts 4px + red glow.
- `.brief` — `grid-column:1/-1`, flex gap 16px, align centre, relative, padding-top 18px; `.brief__line` hairline across the top (absolute); `.brief__field` flex 1, bottom 1px `var(--line-strong)`; the input 40px high, transparent; `.brief__ico` 16px muted; `.brief__send` 36px, `↗`, red on hover.
- `.footer` — padding 44px var(--pad) 110px (room for the HUD), relative; `.footer__line` hairline at the top; `.footer__row` flex space-between align centre, margin-top 14px; `.footer__row--2` margin-top 26px; `.footer__logo` Anton 22px; `.footer__mid` centre column 11px muted (two lines: copyright + live clock `Bengaluru · 17:04 IST`); `.footer__social` flex gap 14px (7 icon links, 11px, hover red); `.accents` flex gap 8px, `.accent-dot` 12px circles in the four accent colours, `.is-active` has a white ring; `.footer__replay`, `.footer__top` 11px, hover white.

### 6.11 Responsive rules
Breakpoints 1280 / 1024 / 860 / 640. Test 360, 390, 768, 1024, 1280, 1440, 1920, 2560 — **no horizontal scroll at any width**.
- ≤1280: hero left block shrinks (`width:280px`), `.about__cols` → `1fr 1fr` with the quote card under.
- ≤1024: hero stats move under the paragraph in a horizontal row (`.hero__right` becomes static flow inside the left column area); cards 2-up; `.proof` and `.raw` stack (panel first); `.contact` → 1 column with the poster first; `.journey__grid` → 1 column.
- ≤860: nav links hidden, `.nav__burger` shown, `.nav__right .nav__talk` stays; hero: `.hero__giant` fits 94vw on one line at the top (top 10%), the photo centred below (height 62vh, `left:50%`), `.hero__left` stacks over the lower part; `.about__cols` single column; `.tl__item` grid `96px 1fr`, `.tl__spine{left:96px}`; `.hero__live` and `.hero__tag--tl2` hidden.
- ≤640: cards 1.15-up with peek; headings scale with `clamp`; `.hero__right` stats in one row under the intro; the HUD wraps to a compact 2-row pill (already in `swarm.css`); rulers hidden (already); `.logos` stacks (label above the row); `.footer__row` stack.

### 6.12 Components used by modules (`components.css`)
- **Project modal (`#modal`)** — `.modal` fixed inset 0, z `var(--z-modal)`, black, hidden → `.is-open`; **letterbox bars** (two 12vh black bars sliding in from top and bottom, `transform` .6s), a large media area (project image or gradient fallback, or iframe/video when `project.video` is set), title (Anton 56px), meta line, description, stack chips, buttons `Live ↗` / `Code ↗` (only when the URL exists), prev/next arrows, close ✕. Keyboard ←/→/Esc, focus trap, restores focus, deep link `#work/<slug>`.
- **Command palette (`#palette`)** — `.palette` fixed, centred glass modal (`backdrop-filter:blur(16px)`, `rgba(16,18,22,.85)`, 1px border, radius 10px, width min(640px,92vw)); monospace (`ui-monospace, Menlo, Consolas`), `>` prompt, list with arrow-key selection (active row red left border).
- **Idle companions** — `.companion` absolutely positioned pastel arrow cursors (reuse the arrow SVG).
- **Reduced motion:** `html[data-motion="off"] *{animation:none!important; transition:none!important}`, marquee static, grain hidden.

---------------------------------------------------------------------
## PART 7 — "GOD-LEVEL" EXTRAS (on top of the reference) — all implemented in the WRITE files per Part 8

**MUST-HAVE**
1. **Scroll playhead + readout** (`#playhead`): 2px red vertical line at the far left whose fill height = scroll progress; mono readout `042% · PROOF` (percentage and current section name); hovering shows chapter markers for each section, clicking one jumps there. (The video-editor "playhead" idea turned into a developer-style progress readout.)
2. **Custom site cursor** (`cursor.js`): 8px red dot (instant) + 36px ring (lerp .18). States: default; `VIEW` (over `.card`, ring grows to 80px with text); `OPEN` (over live-project links/`.poster__btn`/`.hero__live`); `DRAG` (over `.slider` and `.compare`); `×` over modal close; I-beam over inputs. Hidden on touch. Enabled only after the intro (`SiteCursor.enable()`), never while agents are building.
3. **Magnetic buttons + link hover:** `.btn`, `.nav__links a`, `.footer__social a`, `.cta`, `.poster__btn` are pulled toward the cursor up to 10px within 90px (`gsap.quickTo` when GSAP exists, else a small rAF lerp). Nav links have a letter-roll hover (duplicate text slides up).
4. **Text scramble** on every `.eyebrow` when it first enters the viewport (characters cycle through `▮#/\` for 500ms then resolve). Skipped for text that has already been typed by the swarm in this session and in Motion-off.
5. **RGB-split glitch** on hover of `.h-display .line`: two pseudo-element copies offset ±2px in cyan/red with `mix-blend-mode:screen`, 220ms (use `data-text` attributes set by JS).
6. **Project detail modal (cinema style)** — see 6.12. Opens from cards (click/Enter), has prev/next, deep link `#work/<slug>`, closes with Esc/✕/backdrop.
7. **Live-project links:** hero `.hero__live` and `.poster__btn` open `https://discord.yulya.me` in a new tab. If `CONTENT.meta.showreel` is ever filled with a video URL, `.hero__live` opens the same cinema modal with that video instead.
8. **Before/after slider** (`compare.js`) with pointer + touch + keyboard (←/→ 5%, Home/End), `role="slider"`, `aria-valuenow`; auto-demo 15 → 85 → 50 (2.4s ease-in-out) when first built by the swarm or first scrolled into view.
9. **Motion-off toggle** (`#motionToggle`): sets `html[data-motion="off"]`, `localStorage.motion='off'`, `aria-pressed`; disables the swarm on future loads, parallax, marquee, grain, magnetic, reveals; defaults to on when `prefers-reduced-motion: reduce`. Toggling it **off** while the swarm is running calls `Swarm.abort()`; toggling it **on** shows a toast "Motion on — reload to replay the intro".
10. **Scroll spy + hash routing:** nav highlights the current section (`[data-spy]` → `.is-active`, underline slides); links smooth-scroll (Lenis `scrollTo`, offset −64, native fallback) and update the hash without a jump; opening `#proof` directly scrolls there after load (the intro is skipped for deep links).

**SHOULD-HAVE**
11. **Command palette** (`Ctrl/Cmd + K` or `/`): fuzzy search over sections, projects, "Open GitHub / Hugging Face / Ollama / Instagram / LinkedIn / X", "Download CV", "Copy email", "WhatsApp me", "Toggle sound", "Replay rebuild", "Change accent colour". ↑/↓ + Enter, Esc closes, terminal look (monospace, `>` prompt).
12. **Accent colour switcher** (`.accent-dot` ×4 in the footer): crimson `#ff3b30` (default) / electric blue `#3b82ff` / violet `#8b5cf6` / amber `#ffb020`. Sets `--red`, `--accent` (lighter tint of the same hue), `--btn`, `--guide` on `:root`; persists in `localStorage.accent`; `.is-active` ring.
13. **Idle swarm companions:** if the mouse is still for 4s inside the hero (after the intro), 6 pastel agent cursors drift in (flocking like the engine's idle agents) and loosely follow the real cursor with delay, orbiting it; any click or mouse move > 40px sends them away.
14. **WhatsApp quick-brief bar** (`#brief`): Enter/submit opens `https://wa.me/918660227877?text=<encodeURIComponent(CONTENT.meta.waMessage + typed text)>` in a new tab (fallback `mailto:`); `#emailRow` click copies the email to the clipboard + toast `Email copied ✓` (middle/ctrl-click keeps the mailto); `#waCta` opens WhatsApp with the default message.
15. **Live GitHub + Hugging Face numbers** (after the intro): fetch `https://api.github.com/users/moheith` (`public_repos`) and `https://huggingface.co/api/models?author=moheith` (array length); cache 1 hour in `sessionStorage`; update the "13 repos" highlight value and the "8 models" values (`#statModels` and the Hugging Face highlight `.hl__val`) with a count-up; silently keep the static numbers on any error/offline. Optional: a tiny "Latest repos" strip (3 most recently pushed repos) in the footer — nothing is rendered if the fetch fails.
16. **Live clock + availability badge:** `#clock` = `Bengaluru · HH:MM IST` (Asia/Kolkata, `Intl.DateTimeFormat`), refreshed every 30 s.
17. **CV placeholder logic:** `#cvLink` and `#resumeLink` do a `HEAD` request to `assets/Mayura-CV.pdf` on click; if it fails, `preventDefault()` and show toast `CV coming soon`.

**NICE-TO-HAVE**
18. Press `R` (outside inputs) or type "replay" in the palette → `PortfolioBoot.replay()`; the footer `#replayBtn` does the same (scrolls to top first). Hidden Konami code (↑↑↓↓←→←→BA) → 30 cursors circle the pointer for 4 s.
19. **SEO & sharing:** the head already contains title, description, canonical, Open Graph, Twitter card, JSON-LD `Person`, manifest. Keep `YOURDOMAIN.com` placeholders and document them in the README.
20. **Performance:** lazy images below the fold, `preconnect` (already), `font-display:swap` (Google URL has `display=swap`), `content-visibility:auto` on `.about`, `.journey`, `.contact` **only after the intro** (`html.is-ready`), `will-change` only on animating elements, `ScrollTrigger.refresh()` after fonts load. Targets: Lighthouse Performance ≥ 90, Accessibility ≥ 95, CLS < 0.05, LCP < 2.5 s (the intro overlay must not delay the LCP of the hero image).
21. **Accessibility:** skip link, visible focus ring, ARIA labels on icon buttons, `aria-live="polite"` on the HUD (already), modals trap focus and restore it, contrast ≥ 4.5:1 for body text, every animation honours Motion-off, the swarm overlay is `aria-hidden="true"` and the page is **not** made `inert` (visitors may scroll while it builds).

---------------------------------------------------------------------
## PART 8 — THE JAVASCRIPT MODULES (main.js is provided; you write the other seven to these contracts)

**Global rules for every module**
- Plain script, wrapped in an IIFE, exposing exactly the globals named below (the verbatim `main.js` calls them through a guarded `call()`, so a missing function never crashes — but a *missing feature* fails the checklist).
- **Never throw.** Wrap risky code in try/catch. `window.gsap`, `window.ScrollTrigger`, `window.Lenis` may be undefined (CDN blocked): always provide a native fallback.
- **Do nothing visual while `html.classList.contains('is-building')`.** The intro owns the screen: no parallax, no reveals, no cursor, no marquee, no hover transforms, no filter/slider interaction (ignore clicks on tabs/cards while building). `main.js` calls the `afterIntro`/`init` hooks at the right time.
- Respect Motion-off: `document.documentElement.getAttribute('data-motion') === 'off'` → skip all animation and apply final states instantly.
- Use `CONTENT` (global from `content.js`) for data; use `Render.cards(list)` to re-render cards.
- Provide a `Toast` helper in `extras.js`: `Extras.toast(message)` (shows `#toast` for 2.4 s). Other modules call `window.Extras && Extras.toast(...)`.

### 8.1 `js/main.js` (VERBATIM)
```js
/* js/main.js — boot order + swarm integration. Every module call is guarded, so a missing/failed module can never leave the page invisible. */
(() => {
  'use strict';
  const html = document.documentElement;
  const q = new URLSearchParams(location.search);
  const call = (obj, fn, ...args) => { try { const o = window[obj]; if (o && typeof o[fn] === 'function') return o[fn](...args); } catch (e) { console.error(`[${obj}.${fn}]`, e); } };
  const small = () => matchMedia('(max-width: 640px)').matches;
  /* deep links (#proof, #work/yulya …) skip the intro so a shared link lands on content; ?swarm=off also skips; ?swarmForce keeps it */
  const skipIntro = () => html.getAttribute('data-motion') === 'off' || q.get('swarm') === 'off' ||
    (!!location.hash && !['#', '#home'].includes(location.hash) && !q.has('swarmForce'));
  let introHow = null;

  /* runs exactly once when the intro is finished ('live'), aborted ('abort') or never ran ('skip') */
  function afterIntro(how) {
    if (introHow) return; introHow = how;
    html.classList.remove('is-building'); html.classList.add('is-ready');
    call('Scroll', 'start');                       // Lenis start (it was stopped during the intro)
    call('SiteCursor', 'enable');                  // custom red cursor + magnetic buttons
    call('Hero', 'afterIntro', how);               // mouse parallax + spotlight
    call('Marquee', 'init');                       // clones the logo row ONLY now, then starts the infinite scroll
    call('Reveals', how === 'live' ? 'initQuiet' : 'init');          // 'live': everything was already seen, so nothing is re-hidden
    call('Extras', 'afterIntro', how);             // live stats, idle companions, clock, command palette hint
    window.dispatchEvent(new CustomEvent('portfolio:ready', { detail: { how } }));
    if (location.hash && how !== 'live') call('Scroll', 'toHash', location.hash, true);
  }

  /* small per-layer flourishes that fire the instant an agent finishes a layer */
  function wireSwarm() {
    Swarm.on('end', afterIntro);
    Swarm.on('layer', (el) => {
      if (el.matches('[data-count]')) call('Hero', 'countUp', el);                // 4+ / 10+ / 8 count up from 0 the moment they appear
      if (el.id === 'compare') call('Compare', 'demo');                           // wireframe <-> final auto demo
      if (el.matches('.step__node')) el.classList.add('is-lit');                  // process nodes light up as they are dropped in
      if (el.matches('.hero__pulse,.hero__dot')) el.classList.add('is-live');
    });
    Swarm.on('section', (name) => { if (name === 'proof') call('Hero', 'laurel'); });   // laurel branches draw in when the proof section commits
  }

  async function decodeHero() {
    const img = document.getElementById('heroImg'); if (!img) return;
    try { await Promise.race([img.decode(), new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* fallback SVG is shown by hero.js onerror */ }
  }

  async function boot() {
    try {
      Render.all();                                                  // 1. cards, logos, highlights, timeline … (with data-layer tags)
      call('Hero', 'init');                                          // 2. fitText + static layout (needs fonts: re-run on fonts.ready)
      call('Work', 'init'); call('Compare', 'init'); call('Journey', 'init');
      call('Scroll', 'init'); call('SiteCursor', 'init'); call('Extras', 'init');
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => call('Hero', 'fit'));
    } catch (e) { console.error('[boot]', e); }

    if (skipIntro() || !window.Swarm) { afterIntro('skip'); return; }
    window.__swarmStarted = true;
    call('Scroll', 'stop');                                          // Lenis off; the swarm drives window.scrollTo itself
    wireSwarm();
    await decodeHero();
    const cfg = { initial: CONTENT.meta.initial, speed: +q.get('swarmSpeed') || 1 };
    if (small()) Object.assign(cfg, { startAgents: 8, maxAgents: 12, joins: [[6, 9], [17, 10], [31, 11], [48, 12]] });
    try { await Swarm.start(cfg); } catch (e) { console.error('[swarm]', e); afterIntro('abort'); }
  }

  window.PortfolioBoot = { afterIntro, replay: () => { introHow = null; call('Scroll', 'stop'); Swarm.replay(); } };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();
```

### 8.2 `js/scroll.js` → `window.Scroll`, `window.Reveals`
`Scroll.init()` — create Lenis (`lerp:.09`, `smoothWheel:true`) if available and tie it to ScrollTrigger (4.3); build the section list from `section[id]` (`#home #work #logos #proof #raw #about #journey #contact`) and the nav-spy map from `[data-spy]`; set up the **scroll spy** (IntersectionObserver or ScrollTrigger) that toggles `.is-active` on the matching nav link and moves `.nav__underline` (set CSS vars `--ul-x`, `--ul-w` on `.nav__links`); build the **playhead** (`#playheadFill` height %, `#playheadReadout` text `042% · PROOF`, hover markers/jump); intercept in-page anchor clicks (`a[href^="#"]`) → `Scroll.to(hash)` (offset −64) and `history.pushState` without a jump; hamburger/`#menu` open/close (`#burger`, `aria-expanded`, Esc, link click closes). `Scroll.start()` / `Scroll.stop()` → `lenis.start()/stop()` (stop also sets `html.style.overflow` untouched — never lock the page; the swarm scrolls with `window.scrollTo`). `Scroll.to(target, {offset,immediate})`, `Scroll.toHash(hash, immediate)` (also understands `#work/<slug>` by scrolling to `#work` and letting `Work` open the modal).
`Reveals.init()` — headings: for each `.h-display, .h-bold` wrap its `.line` children in a mask and slide up (4.6); paragraphs fade-up; images clip-reveal; ScrollTrigger/IntersectionObserver `once:true`; the process spine (`.process__spine`) and journey spine (`.tl__spine`) scaleY from 0 → 1 scrubbed with scroll and each `.step__node` toggles `.is-lit` when reached. `Reveals.initQuiet()` — same wiring but **no hiding/animating of anything already visible** (it only scrubs the two spines from the *current* state upward and lights nodes already lit); never sets `opacity:0` or transforms on content.

### 8.3 `js/cursor.js` → `window.SiteCursor`
`SiteCursor.init()` creates nothing visible. `SiteCursor.enable()` adds `html.has-cursor` (hides the native cursor over the page, **not** over inputs), starts the rAF loop for `#cursorDot` (instant) and `#cursorRing` (lerp .18), and the label states (`VIEW`, `OPEN`, `DRAG`, `×`) via `mouseover` delegation on `.card`, `a[href^="http"].hero__live, .poster__btn`, `.slider, .compare`, `.modal__close`. Includes the **magnetic** effect (3 in Part 7) and the nav **letter-roll** hover. Disabled on touch (`matchMedia('(hover:none)')`) and in Motion-off. `SiteCursor.disable()` reverses everything (used when the swarm is replayed).

### 8.4 `js/hero.js` → `window.Hero`
`Hero.init()` — `fit()`; hero image `error` → show `.hero__fallback`; `load` → add `is-loaded`. `Hero.fit()` — set `#giant` `font-size` so its width is 94% of `innerWidth` (measure with a binary search or `scrollWidth`), re-run on `resize` (debounced) and after fonts load. `Hero.afterIntro(how)` — start scroll parallax + mouse parallax + spotlight (6.2) unless Motion-off; **no** reveal animation of hero text (the swarm already built it; for `how!=='live'` use the normal Reveals). `Hero.countUp(el, to?)` — animate the element's text from 0 → `data-count` (or `to`) over 1.4 s ease-out, preserving `data-suffix` (`+`); if Motion-off set the final text immediately; guard against double runs with `el.dataset.counted`. `Hero.laurel()` — draw the two `.laurel` SVGs' paths with `stroke-dasharray/offset` (1 s); no-op if reduced motion.

### 8.5 `js/work.js` → `window.Work`, `window.Marquee`
`Work.init()` — wire tabs (`.tab[data-filter]`, `data-filter="All"` = all; project `cats` match the English names), the search input `#search`, the slider (`#slider` drag-to-scroll with inertia using pointer events, `#prev/#next` scroll by one card, `scroll-snap`), card click/Enter → `Work.open(slug)`, `hashchange`/initial `#work/<slug>` → open. **Filtering:** compute the list, FLIP-animate (record rects, `Render.cards(list)`, invert, play 0.5 s; fade out removed cards), update `#seeAllLabel` (done inside `Render.cards`) and the `.tabs__underline` position; search filters live on title + stack + category (case-insensitive) and wraps matched letters in `<mark>` (red) inside `.card__title` — restore plain text when cleared. Placeholder projects get a `PLACEHOLDER` chip. 3D tilt on cards (±6°, `--rx/--ry`). `Work.open(slug)` builds the cinema modal inside `#modal` (6.12), sets `#work/<slug>`, focus trap, ←/→ prev/next within the *current filtered list*, Esc/backdrop/✕ closes, restores focus and the previous hash; buttons `Live ↗`/`Code ↗` only when `url`/`repo` exist (open in new tab, `rel="noopener"`). If `project.video` is set render a `<video controls playsinline>` instead of the image.
`Marquee.init()` — **called by `main.js` after the intro**: clone the children of `#stackRow` once (clones get `aria-hidden="true"` and **no `data-layer`**), make the row `width:max-content`, animate `translateX` leftwards at 40px/s with rAF (loop when half the width has passed), pause on hover, add scroll-velocity boost; static in Motion-off.

### 8.6 `js/compare.js` → `window.Compare`
`Compare.init()` — on `#compare` set `--pos:50%`, pointer drag (`pointerdown/move/up` with capture; ignore vertical scroll on touch), keyboard (←/→ 5%, Home/End), `aria-valuenow`, hover cursor `DRAG`. `Compare.set(pct)`; `Compare.demo()` — 15% → 85% → 50% over 2.4 s ease-in-out (once; skipped if the user already touched it or Motion-off). `main.js` calls `demo()` when the swarm finishes the compare layer; when the intro was skipped/aborted call it the first time `#compare` is 40% visible.

### 8.7 `js/journey.js` → `window.Journey`
`Journey.init()` — accordion over `.tl__item`: click/Enter/Space on `.tl__head` toggles `.is-open` on its `.tl__item` and `aria-expanded`; **one open at a time**; the first item is open (already marked by `render.js`); keyboard ↑/↓ moves focus between heads; heights use the `grid-template-rows` trick (6.9) so no JS measuring is needed.

### 8.8 `js/extras.js` → `window.Extras`
`Extras.init()` — runs early (before the intro): sets up the `Toast` (`Extras.toast`), the Motion-off toggle (`#motionToggle`, Part 7.9; if the swarm is running, call `Swarm.abort()`), the accent switcher (7.12, applies the saved accent immediately), CV placeholder logic (7.17), quick-brief (7.14), email copy (7.14), live clock (7.16), command palette (7.11), keyboard shortcuts (`R`, `Ctrl/Cmd+K`, `/`, Konami), the `Replay` footer button (`#replayBtn` → scroll to top, `PortfolioBoot.replay()`), text scramble observers (7.4) and the glitch `data-text` attributes (7.5) — all event wiring only; nothing visual may happen to layers while `is-building`. `Extras.afterIntro(how)` — start the live GitHub/Hugging Face fetch (7.15), the idle companions (7.13) and enable the scramble/glitch effects. `Extras.toast(msg)`.

---------------------------------------------------------------------
## PART 9 — DATA AND MARKUP (VERBATIM FILES)

Rules: English only. Static copy lives inline in `index.html`; lists live in `content.js` and are rendered by `render.js` (templates carry the `data-layer` tags). Numbers in `highlights` are snapshots from November 2026 (GitHub 13 repos, Hugging Face 8 models, Ollama 259 pulls, Yulya Studio 109 commits); the live-stats feature (Part 7.15) refreshes the first two when online. Projects 10 and 11 are clearly-labelled **placeholders** so the "Design" filter is not empty; the owner replaces them later (README explains how).

### 9.1 `js/content.js` (VERBATIM)
```js
/* js/content.js — ALL data for Mohieth Mayura S Y's portfolio. English only.
   Static copy (headings, paragraphs, labels) lives inline in index.html.
   This file holds: meta, project data, tech stack, highlights, education, toolkit, software tiles, process, journey, milestones.
   Snapshot numbers are from November 2026 (GitHub 13 repos, Hugging Face 8 models, Ollama 259 pulls, Yulya Studio 109 commits). */
const CONTENT = {
  meta: {
    name: "MOHIETH MAYURA S Y", short: "MAYURA", initial: "M",
    city: "Bengaluru, India", cityShort: "BENGALURU, INDIA", tz: "Asia/Kolkata", tzLabel: "IST",
    email: "moheithmayura@gmail.com", phoneDisplay: "+91 86602 27877", whatsapp: "918660227877",
    instagram: "@moheith_mayura",
    cv: "assets/Mayura-CV.pdf",              /* placeholder: the file does not exist yet */
    showreel: "",                             /* empty on purpose: no showreel video yet */
    liveProject: "https://discord.yulya.me",
    domain: "https://YOURDOMAIN.com",         /* replace after buying a domain */
    links: {
      github: "https://github.com/moheith",
      linkedin: "https://linkedin.com/in/mohieth",
      huggingface: "https://huggingface.co/moheith",
      ollama: "https://ollama.com/moheith",
      x: "https://x.com/mohiethh",
      instagram: "https://instagram.com/moheith_mayura"
    },
    waMessage: "Hi Mayura, I saw your portfolio and I'd like to talk about a project: "
  },

  /* ---------- Selected work (11 cards). cats use these exact English names: "Full-Stack","AI / ML","Discord","Web Apps","Design","Open Source" ---------- */
  projects: [
    { slug: "yulya", n: "01", title: "YULYA — DISCORD AI COMPANION", meta: "AI / WEB · 2026", tag: "LIVE · AI / DISCORD",
      cats: ["AI / ML", "Discord", "Full-Stack"], stack: "Python · Gemini Live · WebRTC · MongoDB",
      desc: "A living AI companion for Discord: voice chat with custom personas, persistent memory, image and video understanding, and a simulated server economy with crypto markets and heists.",
      img: "assets/img/work-01.jpg", url: "https://discord.yulya.me", repo: "https://github.com/moheith/Yulya", video: "" },
    { slug: "yulya-studio", n: "02", title: "YULYA STUDIO", meta: "WEB APP · 2026", tag: "WEB APP · AI",
      cats: ["Full-Stack", "Web Apps", "AI / ML"], stack: "React · TypeScript · Vite · FastAPI · MongoDB · Gemini",
      desc: "An AI-assisted browser game studio: write, preview and remix static games in the browser with a sandboxed assistant, a public gallery and one-click remixing.",
      img: "assets/img/work-02.jpg", url: "https://studio.yulya.me", repo: "https://github.com/moheith/Studio", video: "" },
    { slug: "learnexa", n: "03", title: "LEARNEXA 2.0", meta: "FULL-STACK · 2026", tag: "FULL-STACK",
      cats: ["Full-Stack", "Web Apps"], stack: "Flask · Next.js · TypeScript · SQLite / MySQL",
      desc: "A skill-exchange platform for students: list what you can teach and want to learn, get matched with TF-IDF recommendations, schedule sessions, give feedback and earn reward points.",
      img: "assets/img/work-03.jpg", url: "", repo: "https://github.com/moheith/LEARNEXA-2.0", video: "" },
    { slug: "yulya-models", n: "04", title: "YULYA MODELS", meta: "AI / ML · 2026", tag: "AI / ML",
      cats: ["AI / ML", "Open Source"], stack: "Qwen2.5 · Llama 3.x · SmolLM2 · Ollama",
      desc: "A family of 8 fine-tuned conversational models published on Hugging Face, plus a local-run build on Ollama.",
      img: "assets/img/work-04.jpg", url: "https://huggingface.co/moheith", repo: "https://ollama.com/moheith", video: "" },
    { slug: "desktop-ai-companion", n: "05", title: "DESKTOP AI COMPANION", meta: "AI / DESKTOP", tag: "AI · JAVASCRIPT",
      cats: ["AI / ML", "Full-Stack"], stack: "JavaScript", desc: "A desktop mate with AI memory.",
      img: "assets/img/work-05.jpg", url: "", repo: "https://github.com/moheith/desktop-ai-companion", video: "" },
    { slug: "yulya-landing", n: "06", title: "YULYA LANDING PAGE", meta: "WEB / DESIGN", tag: "DESIGN · WEB",
      cats: ["Design", "Web Apps"], stack: "HTML · CSS · JavaScript", desc: "The landing page for the Yulya organisation.",
      img: "assets/img/work-06.jpg", url: "", repo: "https://github.com/moheith/yulya-landing-page", video: "" },
    { slug: "mascot-website", n: "07", title: "MASCOT WEBSITE", meta: "WEB / DESIGN", tag: "DESIGN · WEB",
      cats: ["Design", "Web Apps"], stack: "HTML", desc: "A website where people get to know a mascot and download it.",
      img: "assets/img/work-07.jpg", url: "", repo: "https://github.com/moheith/Mascot-Website", video: "" },
    { slug: "textlink", n: "08", title: "TEXTLINK", meta: "WEB APP · TOOL", tag: "WEB APP",
      cats: ["Web Apps", "Open Source"], stack: "HTML · CSS · JavaScript",
      desc: "Turns any text into a unique shareable link. Single file, no backend, no database.",
      img: "assets/img/work-08.jpg", url: "", repo: "https://github.com/moheith/Treasure", video: "" },
    { slug: "yulya-api", n: "09", title: "YULYA API", meta: "AI / BACKEND", tag: "AI · PYTHON",
      cats: ["AI / ML", "Open Source"], stack: "Python", desc: "Generates unlimited embedding files.",
      img: "assets/img/work-09.jpg", url: "", repo: "https://github.com/moheith/Yulya-API", video: "" },
    { slug: "graphic-design", n: "10", title: "GRAPHIC DESIGN — SELECTED WORKS", meta: "DESIGN", tag: "DESIGN",
      cats: ["Design"], stack: "Posters · Logos · Social · Krita", placeholder: true,
      desc: "Posters, logos and social media creatives. Placeholder card: replace with your best pieces.",
      img: "assets/img/work-10.jpg", url: "https://instagram.com/moheith_mayura", repo: "", video: "" },
    { slug: "brand-identity", n: "11", title: "BRAND IDENTITY — YOUR PROJECT", meta: "DESIGN", tag: "DESIGN",
      cats: ["Design"], stack: "Branding · UI · Blender", placeholder: true,
      desc: "A brand identity case study. Placeholder card: replace with a real project.",
      img: "assets/img/work-11.jpg", url: "", repo: "", video: "" }
  ],

  /* ---------- Tech marquee: [label, simple-icons slug ("" = no icon exists, use a text wordmark), hex colour] ---------- */
  stack: [
    ["Python", "python", "FFD343"], ["TypeScript", "typescript", "5AA0FF"], ["JavaScript", "javascript", "F7DF1E"],
    ["React", "react", "61DAFB"], ["Next.js", "nextdotjs", "FFFFFF"], ["FastAPI", "fastapi", "2DD4BF"],
    ["Flask", "flask", "FFFFFF"], ["MongoDB", "mongodb", "5FD068"], ["Hugging Face", "huggingface", "FFD21E"],
    ["Ollama", "ollama", "FFFFFF"], ["Discord", "discord", "8B95FF"], ["Gemini", "googlegemini", "B39DDB"],
    ["Unity", "unity", "FFFFFF"], ["Blender", "blender", "F5792A"], ["Krita", "krita", "3BABFF"], ["Live2D", "", "7DD3FC"]
  ],

  /* ---------- Proof of work rows: [title, sub, metric, unit, link] ---------- */
  highlights: [
    ["Yulya — Discord AI companion", "Live bot with voice chat, memory and an in-server economy", "LIVE", "online", "https://discord.yulya.me"],
    ["Hugging Face models", "Yulya family fine-tuned on Qwen2.5, Llama 3.x and SmolLM2", "8", "models", "https://huggingface.co/moheith"],
    ["Yulya on Ollama", "Run the persona locally on your own PC", "259+", "pulls", "https://ollama.com/moheith"],
    ["Yulya Studio", "AI-assisted browser game studio — React, FastAPI, MongoDB", "109", "commits", "https://github.com/moheith/Studio"],
    ["LEARNEXA 2.0", "Skill-exchange platform for students — Flask + Next.js", "2.0", "version", "https://github.com/moheith/LEARNEXA-2.0"],
    ["GitHub", "Public repositories, from AI to web apps", "13", "repos", "https://github.com/moheith"]
  ],

  /* ---------- About → education column: [title, sub, tag] ---------- */
  education: [
    ["SFGC", "Bachelor of Computer Applications (BCA)", ""],
    ["Self-directed learning", "Full stack, AI/ML, graphic design and game art — learned by shipping real projects", "4+ yrs"]
  ],

  toolkit: ["Full Stack Development", "UI / UX Design", "Graphic Design", "Python", "TypeScript", "React & Next.js",
            "FastAPI & Flask", "MongoDB & SQL", "LLM Fine-tuning", "Discord Bots",
            "Unity", "Blender", "Krita", "Live2D"],

  /* tiles under the toolkit chips (same format as stack) */
  software: [["Python", "python", "FFD343"], ["TypeScript", "typescript", "5AA0FF"], ["React", "react", "61DAFB"],
             ["Next.js", "nextdotjs", "FFFFFF"], ["MongoDB", "mongodb", "5FD068"], ["Hugging Face", "huggingface", "FFD21E"],
             ["Unity", "unity", "FFFFFF"], ["Blender", "blender", "F5792A"], ["Krita", "krita", "3BABFF"], ["Live2D", "", "7DD3FC"]],

  /* ---------- About → "FROM IDEA TO LAUNCH": [number, title, description] ---------- */
  process: [
    ["01", "THE IDEA", "Understand the problem, the users and the feeling the product should have."],
    ["02", "THE DESIGN", "Wireframes, visual direction and a design system that scales."],
    ["03", "THE BUILD", "Frontend, backend and data, written clean and tested."],
    ["04", "THE POLISH", "Motion, speed, accessibility and the details people feel."],
    ["05", "THE LAUNCH", "Ship it live, watch it run, and keep improving."]
  ],

  /* ---------- Journey accordion: [date, role, sub, description]. The FIRST item is open by default. ---------- */
  timeline: [
    ["2026 · NOW", "Independent Full Stack Developer & Designer", "Yulya · AI products & web apps",
     "Building Yulya end to end: a live Discord AI companion with voice, memory and an in-server economy, plus Yulya Studio and LEARNEXA 2.0. Design, frontend, backend, data and deployment, all in one pair of hands."],
    ["2026", "AI / ML Builder", "Hugging Face · Ollama",
     "Fine-tuned and published a family of 8 conversational models across Qwen2.5, Llama 3.x and SmolLM2, then shipped the persona to Ollama so anyone can run it locally."],
    ["2026", "BCA — SFGC", "Bachelor of Computer Applications",
     "Formal computer-science foundations, studied alongside hands-on product work and a growing list of shipped projects."],
    ["2024", "Game & Character Art", "Unity · Blender · Krita · Live2D",
     "Explored the creative side of tech: modelling in Blender, painting in Krita, rigging expressive Live2D characters and building interactive scenes in Unity. It shaped the visual taste behind everything I build."],
    ["2022 · 2025", "Designer & Developer — the self-taught years", "Graphics, websites & first products",
     "It started with graphic design (posters, logos, social creatives), grew into websites, then full stack code and AI. Four years of learning in public and shipping small things until they stopped being small."]
  ],

  /* ---------- Journey → milestones: [title, year, link] ---------- */
  milestones: [
    ["Yulya goes live on Discord", "2026", "https://discord.yulya.me"],
    ["8 models on Hugging Face", "2026", "https://huggingface.co/moheith"],
    ["Yulya Studio opens to the public", "2026", "https://studio.yulya.me"],
    ["Yulya on Ollama", "2026", "https://ollama.com/moheith"]
  ]
};
if (typeof module !== 'undefined') module.exports = CONTENT;
```

### 9.2 `js/render.js` (VERBATIM)
```js
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
```

### 9.3 `index.html` (VERBATIM)
```html
<!doctype html>
<html lang="en" class="is-building" data-motion="on">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Mayura | Full Stack Developer &amp; Designer — Bengaluru</title>
<meta name="description" content="Mohieth Mayura S Y (Mayura) — full stack developer, UI designer and graphics designer from Bengaluru. AI companions, web apps and tools: designed, built and shipped.">
<meta name="theme-color" content="#07070a">
<link rel="canonical" href="https://YOURDOMAIN.com/">
<meta property="og:type" content="website">
<meta property="og:title" content="Mayura — Full Stack Developer &amp; Designer">
<meta property="og:description" content="I design it, I build it, I ship it. Watch a swarm of AI agents build this portfolio in real time.">
<meta property="og:image" content="https://YOURDOMAIN.com/assets/img/og.jpg">
<meta property="og:url" content="https://YOURDOMAIN.com/">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.simpleicons.org" crossorigin>
<link rel="preload" as="image" href="assets/img/hero-cutout.webp" type="image/webp">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@500&family=Inter:wght@400;500;600;700&family=Nothing+You+Could+Do&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/swarm.css">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Person","name":"Mohieth Mayura S Y","alternateName":"Mayura","jobTitle":"Full Stack Developer & Designer",
 "address":{"@type":"PostalAddress","addressLocality":"Bengaluru","addressCountry":"IN"},
 "sameAs":["https://github.com/moheith","https://linkedin.com/in/mohieth","https://huggingface.co/moheith","https://x.com/mohiethh","https://ollama.com/moheith"]}
</script>
<script>
/* FAIL-SAFE: the page must never stay invisible. Runs before first paint. */
(function () {
  var h = document.documentElement;
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || localStorage.getItem('motion') === 'off') {
      h.classList.remove('is-building'); h.setAttribute('data-motion', 'off');
    }
  } catch (e) {}
  setTimeout(function () { if (!window.__swarmStarted) h.classList.remove('is-building'); }, 4000);
})();
</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<canvas id="grain" aria-hidden="true"></canvas>
<div class="vignette" aria-hidden="true"></div>

<!-- scroll playhead + readout (extras 1) -->
<div id="playhead" aria-hidden="true"><i id="playheadFill"></i><span id="playheadReadout">000% · HOME</span></div>

<!-- ===================== NAV ===================== -->
<header class="nav" id="nav" data-swarm-section="nav">
  <a class="nav__logo" href="#home" aria-label="Mayura — home"><span class="nav__word" data-layer="text">MAYURA</span><i class="nav__dot" data-layer="shape"></i></a>
  <nav class="nav__links" aria-label="Primary">
    <a href="#work" data-spy="work"><span data-layer="text">Work</span></a>
    <a href="#proof" data-spy="proof"><span data-layer="text">Proof</span></a>
    <a href="#about" data-spy="about"><span data-layer="text">About</span></a>
    <a href="#journey" data-spy="journey"><span data-layer="text">Journey</span></a>
    <a href="#contact" data-spy="contact"><span data-layer="text">Contact</span></a>
    <i class="nav__underline" aria-hidden="true"></i>
  </nav>
  <div class="nav__right">
    <button class="nav__motion" id="motionToggle" type="button" aria-pressed="false"><span class="nav__tri" data-layer="icon" aria-hidden="true">▷</span><span data-layer="text">Motion off</span></button>
    <a class="nav__talk" href="#contact"><span data-layer="text">Let's talk</span><span class="nav__chev" data-layer="icon" aria-hidden="true">›</span></a>
    <button class="nav__burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false"><i></i><i></i></button>
  </div>
</header>
<div class="menu" id="menu" aria-hidden="true">
  <a href="#work">Work</a><a href="#proof">Proof</a><a href="#about">About</a><a href="#journey">Journey</a><a href="#contact">Contact</a>
</div>

<main id="main">

<!-- ===================== 1. HERO ===================== -->
<section class="hero" id="home" data-swarm-section="hero" data-guide="left">
  <h1 class="hero__giant" id="giant" data-layer="text" data-swarm="wipe" aria-label="Portfolio">PORTFOLIO</h1>
  <div class="hero__photo" data-layer="image">
    <picture>
      <source srcset="assets/img/hero-cutout.webp" type="image/webp">
      <img id="heroImg" src="assets/img/hero-cutout.png" alt="Portrait of Mohieth Mayura S Y" width="1086" height="1448" fetchpriority="high" decoding="async">
    </picture>
    <svg class="hero__fallback" viewBox="0 0 400 500" aria-hidden="true"><defs><radialGradient id="hg" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#5a0f12"/><stop offset="1" stop-color="#07070a"/></radialGradient></defs><rect width="400" height="500" fill="url(#hg)"/><circle cx="200" cy="170" r="82" fill="#000"/><path d="M40 500 C40 360 110 300 200 300 C290 300 360 360 360 500Z" fill="#000"/></svg>
  </div>

  <p class="hero__tag hero__tag--tl" data-layer="text">FULL STACK DEV / DESIGNER</p>
  <p class="hero__tag hero__tag--tl2" data-layer="text">GRAPHICS · UI · AI</p>
  <p class="hero__avail"><i class="hero__pulse" data-layer="shape"></i><span data-layer="text">AVAILABLE FOR WORK</span></p>

  <div class="hero__left">
    <p class="hero__hello" data-layer="text">Hello, I'm</p>
    <h2 class="hero__name"><span data-layer="text">MAYURA</span><i class="hero__period" aria-hidden="true"></i></h2>
    <p class="hero__full" data-layer="text">MOHIETH MAYURA S Y</p>
    <p class="hero__role"><span class="line" data-layer="text">FULL STACK DEV</span><span class="line" data-layer="text">&amp; DESIGNER</span></p>
    <p class="hero__intro" data-layer="text">I design it, I build it, I ship it. From pixel-perfect interfaces to the backends that power them, I turn ideas into products people actually use.</p>
    <a class="btn btn--primary hero__cta" href="#work" data-layer="button"><span class="btn__label">See my work</span><span class="btn__arrow" aria-hidden="true">↓</span></a>
    <p class="hero__loc"><span class="hero__pin" data-layer="icon" aria-hidden="true">⌖</span><span data-layer="text">BENGALURU, INDIA</span></p>
    <i class="hero__bar" data-layer="shape"></i>
  </div>

  <a class="hero__live" href="https://discord.yulya.me" target="_blank" rel="noopener" aria-label="View live project: Yulya">
    <span class="hero__live-ring" data-layer="icon" aria-hidden="true">↗</span>
    <span class="hero__live-txt"><b data-layer="text">VIEW LIVE PROJECT</b><span data-layer="text">YULYA · WEB / AI</span></span>
  </a>

  <div class="hero__right">
    <p class="hero__tagline"><span class="hero__star" data-layer="icon" aria-hidden="true">✳</span><span class="line" data-layer="text">Designed to feel.</span><span class="line" data-layer="text">Built to last.</span></p>
    <ul class="stats">
      <li class="stat"><i class="stat__line" data-layer="line"></i><b class="stat__n" data-layer="text" data-count="4" data-suffix="+">4+</b><span class="stat__l" data-layer="text">Years of building &amp; designing</span></li>
      <li class="stat"><i class="stat__line" data-layer="line"></i><b class="stat__n" data-layer="text" data-count="10" data-suffix="+">10+</b><span class="stat__l" data-layer="text">Projects shipped</span></li>
      <li class="stat"><i class="stat__line" data-layer="line"></i><b class="stat__n" data-layer="text" data-count="8" id="statModels">8</b><span class="stat__l" data-layer="text">AI models published</span></li>
    </ul>
    <a class="hero__cv" id="cvLink" href="assets/Mayura-CV.pdf" download><span data-layer="icon" aria-hidden="true">↓</span><span data-layer="text">DOWNLOAD CV</span></a>
  </div>

  <p class="hero__scroll"><i class="hero__dot" data-layer="shape"></i><span data-layer="text">SCROLL TO DISCOVER ↓</span></p>
  <p class="hero__range" data-layer="text">SELECTED WORK · 2026</p>
</section>

<!-- ===================== 2. SELECTED WORK ===================== -->
<section class="work" id="work" data-swarm-section="work" data-guide="left">
  <div class="sec__head">
    <div>
      <p class="eyebrow" data-layer="text">01 / SELECTED WORK</p>
      <h2 class="h-bold" data-layer="text">WORK THAT SPEAKS.</h2>
    </div>
    <a class="link-all" href="https://github.com/moheith?tab=repositories" target="_blank" rel="noopener"><span data-layer="text">ALL WORK</span><span data-layer="icon" aria-hidden="true">→</span></a>
  </div>

  <div class="work__bar">
    <div class="tabs" id="tabs" role="tablist" aria-label="Filter projects">
      <button class="tab is-active" role="tab" aria-selected="true" data-filter="All" type="button"><span data-layer="text">All</span></button>
      <button class="tab" role="tab" aria-selected="false" data-filter="Full-Stack" type="button"><span data-layer="text">Full-Stack</span></button>
      <button class="tab" role="tab" aria-selected="false" data-filter="AI / ML" type="button"><span data-layer="text">AI / ML</span></button>
      <button class="tab" role="tab" aria-selected="false" data-filter="Discord" type="button"><span data-layer="text">Discord</span></button>
      <button class="tab" role="tab" aria-selected="false" data-filter="Web Apps" type="button"><span data-layer="text">Web Apps</span></button>
      <button class="tab" role="tab" aria-selected="false" data-filter="Design" type="button"><span data-layer="text">Design</span></button>
      <button class="tab" role="tab" aria-selected="false" data-filter="Open Source" type="button"><span data-layer="text">Open Source</span></button>
      <i class="tabs__underline" aria-hidden="true"></i>
    </div>
    <label class="search" data-layer="input"><span class="search__ico" aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Search title or tech" autocomplete="off" aria-label="Search projects"></label>
  </div>

  <div class="slider" id="slider">
    <div class="slider__track" id="cards"><!-- filled by render.js --></div>
  </div>
  <div class="slider__ctrl">
    <button class="sbtn" id="prev" type="button" aria-label="Previous"><span data-layer="icon" aria-hidden="true">‹</span></button>
    <button class="sbtn" id="next" type="button" aria-label="Next"><span data-layer="icon" aria-hidden="true">›</span></button>
    <span class="slider__count"><span id="seeAllLabel" data-layer="text">SEE ALL (11) •</span></span>
  </div>
</section>

<!-- ===================== 3. TECH STRIP ===================== -->
<section class="logos" id="logos" data-swarm-section="logos">
  <div class="logos__label"><b data-layer="text">BUILT WITH</b><span data-layer="text">THE TOOLS I SHIP WITH.</span></div>
  <div class="logos__mask"><ul class="logos__row" id="stackRow" aria-label="Tools"><!-- filled by render.js; marquee clones are added AFTER the intro --></ul></div>
</section>

<!-- ===================== 4. PROOF OF WORK ===================== -->
<section class="proof" id="proof" data-swarm-section="proof" data-guide="left">
  <div class="proof__panel" data-layer="shape">
    <p class="eyebrow eyebrow--red" data-layer="text">PROOF OF WORK</p>
    <h2 class="h-display"><span class="line" data-layer="text">THE CODE.</span><span class="line accent" data-layer="text">THE PROOF.</span></h2>
    <div class="proof__big">
      <svg class="laurel laurel--l" data-layer="icon" viewBox="0 0 60 120" aria-hidden="true"><path d="M50 8 C20 30 12 70 30 112" fill="none" stroke="#ff3b30" stroke-width="3" stroke-linecap="round"/><path d="M40 22 q-16 2 -22 16 M34 40 q-16 2 -22 16 M30 60 q-16 2 -20 16 M30 80 q-14 2 -18 14" fill="none" stroke="#ff3b30" stroke-width="3" stroke-linecap="round"/></svg>
      <b class="proof__num" data-layer="text" data-count="10" data-suffix="+">10+</b>
      <svg class="laurel laurel--r" data-layer="icon" viewBox="0 0 60 120" aria-hidden="true"><path d="M50 8 C20 30 12 70 30 112" fill="none" stroke="#ff3b30" stroke-width="3" stroke-linecap="round"/><path d="M40 22 q-16 2 -22 16 M34 40 q-16 2 -22 16 M30 60 q-16 2 -20 16 M30 80 q-14 2 -18 14" fill="none" stroke="#ff3b30" stroke-width="3" stroke-linecap="round"/></svg>
    </div>
    <p class="proof__cap" data-layer="text">PROJECTS SHIPPED</p>
    <p class="proof__text" data-layer="text">No trophies yet — just real products, live bots and open-source code you can click, run and read.</p>
    <a class="link-red" href="https://github.com/moheith" target="_blank" rel="noopener"><span data-layer="text">SEE GITHUB</span><span data-layer="icon" aria-hidden="true">↗</span></a>
  </div>
  <div class="proof__list">
    <div class="proof__listhead"><p class="eyebrow" data-layer="text">SELECTED HIGHLIGHTS</p><p class="eyebrow" data-layer="text">2026</p></div>
    <ul class="hls" id="highlights"><!-- filled by render.js --></ul>
  </div>
</section>

<!-- ===================== 5. FROM SKETCH TO SHIPPED ===================== -->
<section class="raw" id="raw" data-swarm-section="raw" data-guide="left">
  <div class="raw__left">
    <p class="eyebrow" data-layer="text">A LOOK UNDER THE SURFACE</p>
    <h2 class="h-display"><span class="line" data-layer="text">FROM SKETCH.</span><span class="line accent" data-layer="text">TO SHIPPED.</span></h2>
    <p class="raw__text" data-layer="text">One product. Many layers. See how a rough wireframe turns into a living interface.</p>
    <p class="raw__meta"><span data-layer="text">YULYA STUDIO / 2026</span><span data-layer="text">UI / UX · FRONTEND · BACKEND</span></p>
  </div>
  <div class="raw__right">
    <div class="compare" id="compare" data-layer="image" role="slider" tabindex="0" aria-label="Wireframe versus final UI" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
      <div class="compare__final" id="cmpFinal"><img src="assets/img/raw-final.jpg" alt="" onerror="this.remove()"><div class="fakeui" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
      <div class="compare__wire" id="cmpWire"><img src="assets/img/raw-wireframe.jpg" alt="" onerror="this.remove()"><div class="fakeui fakeui--wire" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
      <i class="compare__line" id="cmpLine" data-layer="line"></i>
      <button class="compare__handle" id="cmpHandle" type="button" tabindex="-1" aria-hidden="true" data-layer="shape"><span aria-hidden="true">⇆</span></button>
      <span class="compare__lab compare__lab--l" data-layer="chip">WIREFRAME</span>
      <span class="compare__lab compare__lab--r" data-layer="chip">FINAL UI</span>
    </div>
    <p class="compare__hint" data-layer="text">DRAG TO SEE THE PROCESS</p>
  </div>
</section>

<!-- ===================== 6. BEHIND THE CODE ===================== -->
<section class="about" id="about" data-swarm-section="about" data-guide="left">
  <div class="about__head">
    <div>
      <p class="eyebrow" data-layer="text">02 / BEHIND THE CODE</p>
      <h2 class="h-display"><span class="line" data-layer="text">NOT JUST PIXELS.</span><span class="line accent" data-layer="text">A WAY OF BUILDING.</span></h2>
    </div>
    <p class="about__text" data-layer="text">I'm Mohieth Mayura S Y, a full stack developer and designer from Bengaluru. I design the interface, build the backend behind it and ship the whole thing — AI companions, web apps and the art around them.</p>
  </div>
  <div class="about__cols">
    <div class="about__col about__col--edu">
      <h3 class="h-bold h-bold--sm" data-layer="text">EDUCATION &amp; SKILLS</h3>
      <p class="label-red" data-layer="text">EDUCATION</p>
      <ul class="edu" id="education"></ul>
      <p class="label-red" data-layer="text">TOOLKIT</p>
      <ul class="chips" id="toolkit"></ul>
      <ul class="tiles" id="software"></ul>
    </div>
    <div class="about__col about__col--process">
      <h3 class="h-bold h-bold--sm" data-layer="text">FROM IDEA TO LAUNCH</h3>
      <div class="process"><i class="process__spine" id="processSpine" data-layer="line"></i><ol class="steps" id="process"></ol></div>
    </div>
    <div class="about__col about__col--quote">
      <figure class="quote" data-layer="card">
        <span class="quote__mark" data-layer="text" aria-hidden="true">❝</span>
        <blockquote class="quote__text"><span class="line" data-layer="text">From idea and design,</span><span class="line dim" data-layer="text">to products that feel alive.</span></blockquote>
        <figcaption class="quote__sig" data-layer="text">Mayura</figcaption>
        <p class="quote__foot"><span data-layer="text">LET'S BUILD</span><span data-layer="text">THE NEXT THING</span></p>
        <span class="quote__star" data-layer="icon" aria-hidden="true">✳</span>
      </figure>
    </div>
  </div>
</section>

<!-- ===================== 7. THE JOURNEY ===================== -->
<section class="journey" id="journey" data-swarm-section="journey" data-guide="left">
  <div class="sec__head">
    <div>
      <p class="eyebrow" data-layer="text">03 / THE JOURNEY</p>
      <h2 class="h-bold h-bold--one" data-layer="text">KEEP BUILDING. KEEP SHIPPING.</h2>
    </div>
    <a class="link-all" id="resumeLink" href="assets/Mayura-CV.pdf" download><span data-layer="text">RESUME</span><span data-layer="icon" aria-hidden="true">⤓</span></a>
  </div>
  <div class="journey__grid">
    <div class="tl"><i class="tl__spine" data-layer="line"></i><ol class="tl__list" id="timeline"></ol></div>
    <aside class="miles">
      <p class="eyebrow" data-layer="text">A FEW MILESTONES</p>
      <h3 class="h-display h-display--sm"><span class="line" data-layer="text">LITTLE WINS.</span><span class="line accent" data-layer="text">BIG MEANING.</span></h3>
      <ul class="ms-list" id="milestones"></ul>
    </aside>
  </div>
</section>

<!-- ===================== 8. CONTACT ===================== -->
<section class="contact" id="contact" data-swarm-section="contact" data-guide="left">
  <div class="contact__left">
    <p class="eyebrow" data-layer="text">04 / LET'S BUILD</p>
    <h2 class="h-display h-display--xl"><span class="line" data-layer="text">LET'S WORK</span><span class="line"><span data-layer="text">TOGETHER</span><i class="contact__period" aria-hidden="true"></i></span></h2>
    <p class="contact__text" data-layer="text">Got an idea you want to bring to life? Let's design it, build it and ship it.</p>
    <a class="cta" id="waCta" href="https://wa.me/918660227877" target="_blank" rel="noopener"><span class="cta__ring" data-layer="icon" aria-hidden="true">↗</span><span class="cta__txt" data-layer="text">START A CONVERSATION</span></a>
  </div>
  <ul class="contact__rows">
    <li><a class="crow" id="emailRow" href="mailto:moheithmayura@gmail.com"><span class="crow__ico" data-layer="icon" aria-hidden="true">✉</span><span class="crow__txt"><small data-layer="text">EMAIL</small><b data-layer="text">moheithmayura@gmail.com</b></span><span class="crow__a" data-layer="icon" aria-hidden="true">↗</span><i class="crow__line" data-layer="line"></i></a></li>
    <li><a class="crow" href="https://instagram.com/moheith_mayura" target="_blank" rel="noopener"><span class="crow__ico" data-layer="icon" aria-hidden="true">◎</span><span class="crow__txt"><small data-layer="text">INSTAGRAM</small><b data-layer="text">@moheith_mayura</b></span><span class="crow__a" data-layer="icon" aria-hidden="true">↗</span><i class="crow__line" data-layer="line"></i></a></li>
    <li><a class="crow" href="https://wa.me/918660227877" target="_blank" rel="noopener"><span class="crow__ico" data-layer="icon" aria-hidden="true">✆</span><span class="crow__txt"><small data-layer="text">PHONE / WHATSAPP</small><b data-layer="text">+91 86602 27877</b></span><span class="crow__a" data-layer="icon" aria-hidden="true">↗</span><i class="crow__line" data-layer="line"></i></a></li>
    <li><div class="crow"><span class="crow__ico" data-layer="icon" aria-hidden="true">⌖</span><span class="crow__txt"><small data-layer="text">BASED IN</small><b data-layer="text">Bengaluru, India</b></span><span class="crow__a" data-layer="icon" aria-hidden="true">↗</span><i class="crow__line" data-layer="line"></i></div></li>
  </ul>
  <div class="poster" id="poster" data-layer="card">
    <span class="poster__brand" data-layer="text">MAYURA●</span>
    <p class="poster__title"><span class="line" data-layer="text">DESIGN IT.</span><span class="line red" data-layer="text">SHIP IT.</span></p>
    <a class="poster__btn" href="https://discord.yulya.me" target="_blank" rel="noopener" aria-label="Open the live project" data-layer="button"><span aria-hidden="true">↗</span></a>
  </div>
  <form class="brief" id="brief" autocomplete="off">
    <i class="brief__line" data-layer="line"></i>
    <label class="brief__field" data-layer="input"><span class="sr-only">Tell me about your project</span><input id="briefInput" type="text" placeholder="Tell me about your project"></label>
    <span class="brief__ico" data-layer="icon" aria-hidden="true">⎘</span>
    <span class="brief__ico" data-layer="icon" aria-hidden="true">◉</span>
    <button class="brief__send" type="submit" aria-label="Send on WhatsApp" data-layer="icon">↗</button>
  </form>
</section>
</main>

<!-- ===================== FOOTER ===================== -->
<footer class="footer" id="footer" data-swarm-section="footer">
  <i class="footer__line" data-layer="line"></i>
  <div class="footer__row">
    <p class="footer__logo" data-layer="text">MAYURA●</p>
    <div class="footer__mid">
      <p data-layer="text">© 2026 MOHIETH MAYURA S Y. All rights reserved.</p>
      <p id="clock" data-layer="text">Bengaluru · 00:00 IST</p>
    </div>
    <nav class="footer__social" aria-label="Social links">
      <a href="https://github.com/moheith" target="_blank" rel="noopener" aria-label="GitHub" data-layer="icon">GH</a>
      <a href="https://linkedin.com/in/mohieth" target="_blank" rel="noopener" aria-label="LinkedIn" data-layer="icon">IN</a>
      <a href="https://huggingface.co/moheith" target="_blank" rel="noopener" aria-label="Hugging Face" data-layer="icon">HF</a>
      <a href="https://ollama.com/moheith" target="_blank" rel="noopener" aria-label="Ollama" data-layer="icon">OL</a>
      <a href="https://x.com/mohiethh" target="_blank" rel="noopener" aria-label="X" data-layer="icon">X</a>
      <a href="https://instagram.com/moheith_mayura" target="_blank" rel="noopener" aria-label="Instagram" data-layer="icon">IG</a>
      <a href="mailto:moheithmayura@gmail.com" aria-label="Email" data-layer="icon">@</a>
    </nav>
  </div>
  <div class="footer__row footer__row--2">
    <div class="accents" role="group" aria-label="Accent colour">
      <button type="button" class="accent-dot is-active" data-accent="#ff3b30" aria-label="Crimson" data-layer="shape"></button>
      <button type="button" class="accent-dot" data-accent="#3b82ff" aria-label="Electric blue" data-layer="shape"></button>
      <button type="button" class="accent-dot" data-accent="#8b5cf6" aria-label="Violet" data-layer="shape"></button>
      <button type="button" class="accent-dot" data-accent="#ffb020" aria-label="Amber" data-layer="shape"></button>
    </div>
    <button class="footer__replay" id="replayBtn" type="button"><span data-layer="text">Replay the rebuild ↺</span></button>
    <a class="footer__top" href="#home"><span data-layer="text">Back to top ↑</span></a>
  </div>
</footer>

<!-- ===================== OVERLAYS (not layers) ===================== -->
<div id="toast" class="toast" role="status" aria-live="polite"></div>
<div id="modal" class="modal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Project details"></div>
<div id="palette" class="palette" aria-hidden="true" role="dialog" aria-label="Command palette"></div>
<div id="cursorDot" class="cur-dot" aria-hidden="true"></div><div id="cursorRing" class="cur-ring" aria-hidden="true"><span></span></div>

<!-- SWARM OVERLAY: everything the agents draw lives in here (aria-hidden, pointer-events:none) -->
<div id="swarm-root" aria-hidden="true">
  <div id="sw-watermark">M</div>
  <div id="sw-ruler-top"></div><div id="sw-ruler-left"></div>
  <div id="sw-scan-top"></div><div id="sw-scan-left"></div>
  <div id="sw-guide"></div>
  <div id="sw-layer"></div>   <!-- boxes, previews, carets, swatches go here -->
  <div id="sw-agents"></div>  <!-- cursors go here (always on top) -->
</div>
<div id="sw-hud" role="status" aria-live="polite"></div>

<noscript><style>html.is-building [data-layer]:not(.is-built){visibility:visible!important}</style></noscript>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="js/content.js" defer></script>
<script src="js/render.js" defer></script>
<script src="js/swarm.js" defer></script>
<script src="js/hud.js" defer></script>
<script src="js/scroll.js" defer></script>
<script src="js/cursor.js" defer></script>
<script src="js/hero.js" defer></script>
<script src="js/work.js" defer></script>
<script src="js/compare.js" defer></script>
<script src="js/journey.js" defer></script>
<script src="js/extras.js" defer></script>
<script src="js/main.js" defer></script>
</body>
</html>
```

---------------------------------------------------------------------
## PART 10 — TESTS (VERBATIM) AND HOW TO RUN THEM

### 10.0 Commands
```bash
cd portfolio
python3 -m http.server 8765 &          # static server (keep it running)
node tests/layout-check.js             # static layout contract, 8 widths, screenshots tests-out-w*.png
node tests/css-coverage.js             # every class in the markup has a CSS rule
node tests/swarm-check.js              # the whole intro end-to-end (≈ 2–3 minutes) + screenshots tests-out-*.png
# useful by hand:
#   http://localhost:8765/index.html                    the real 50-second intro
#   http://localhost:8765/index.html?swarmSpeed=4       4× faster
#   http://localhost:8765/index.html?swarm=off          skip the intro
```
The tests block every external request on purpose (fonts, GSAP, Lenis, logo CDN): the site must work and look right with system fonts and without GSAP/Lenis. If a test fails, fix **your** CSS/JS (never the verbatim engine files) and re-run. After the tests pass, **open the PNGs with your image tool and compare with Parts 5 and 6.**

### 10.1 `tests/swarm-check.js` (VERBATIM)
```js
/* tests/swarm-check.js — end-to-end check of the Agent Swarm intro.
   Usage:  (terminal 1) python3 -m http.server 8765      (in the portfolio/ folder)
           (terminal 2) node tests/swarm-check.js          [PAGE=index.html BASE=http://localhost:8765]
   Needs Playwright (`npm i -D playwright` + `npx playwright install chromium`, or the pre-installed one). Exit code 0 = all PASS. */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765', PAGE = process.env.PAGE || 'index.html';
let fails = 0; const ok = (name, cond, extra = '') => { console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); if (!cond) fails++; };
const snap = (p) => p.evaluate(() => ({
  st: Swarm.state, built: Swarm.built, total: Swarm.total, agents: Swarm.agents.length, secs: Swarm.doneSeconds,
  building: document.documentElement.classList.contains('is-building'),
  unbuilt: document.querySelectorAll('[data-layer]:not(.is-built)').length,
  strays: document.querySelectorAll('.sw-box,.sw-pre,.sw-sweep,.sw-swatches,.sw-ripple').length,
  cursors: document.querySelectorAll('.sw-cursor').length, hudOn: document.getElementById('sw-hud').classList.contains('on'),
  hud: document.getElementById('sw-hud').innerText.replace(/\n/g, ' | '),
  dirtyText: [...document.querySelectorAll('[data-layer=text],[data-layer=chip]')].filter((e) => e.querySelector('.sw-caret,.sw-rest,.sw-sel')).length
}));
(async () => {
  const browser = await chromium.launch();
  const open = async (vp, qs) => {
    const p = await browser.newPage({ viewport: vp }); p.errs = [];
    await p.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());               // offline-safe: external fonts/CDNs are blocked, the page must still work
    p.on('pageerror', (e) => p.errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) p.errs.push(m.text()); });
    await p.goto(`${BASE}/${PAGE}?${qs}`); return p;
  };
  /* 1. full run at 4x */
  let p = await open({ width: 1440, height: 900 }, 'swarmSpeed=4');
  await p.waitForFunction(() => window.Swarm && Swarm.state === 'scan', null, { timeout: 15000 }).catch(() => {});
  ok('swarm starts (scan state)', (await p.evaluate(() => Swarm.state)) !== 'idle');
  await p.waitForTimeout(500); ok('scan: HUD says Scanning', /Scanning/.test((await snap(p)).hud));
  await p.waitForFunction(() => Swarm.state === 'build', null, { timeout: 15000 }); await p.screenshot({ path: 'tests-out-build-start.png' });
  await p.waitForFunction(() => Swarm.state === 'finale', null, { timeout: 120000 }); await p.waitForTimeout(800);
  let s = await snap(p);
  ok('layer count between 300 and 450', s.total >= 300 && s.total <= 450, `(${s.total})`);
  ok('every layer built', s.built === s.total && s.unbuilt === 0);
  ok('30 agents at the finale', s.agents === 30, `(${s.agents})`);
  ok('no stray boxes/previews/sweeps', s.strays === 0, `(${s.strays})`);
  ok('no half-typed text left (caret/rest/selection spans)', s.dirtyText === 0, `(${s.dirtyText})`);
  ok('HUD shows "Rebuilt by 30 agents in …s" + Go live + Replay', /Rebuilt by 30 agents in [\d.]+s/.test(s.hud) && /Go live/.test(s.hud) && /Replay/.test(s.hud), s.hud);
  await p.screenshot({ path: 'tests-out-finale.png' });
  await p.click('#sw-hud [data-a=live]'); await p.waitForFunction(() => Swarm.state === 'live', null, { timeout: 8000 }); await p.waitForTimeout(2200); s = await snap(p);
  ok('Go live: overlay gone, is-building removed, cursors removed', !s.building && !s.hudOn && s.cursors === 0 && s.unbuilt === 0);
  ok('no page errors during the run', p.errs.length === 0, p.errs.join(' | '));
  /* 2. replay then abort mid-run (via the HUD buttons) */
  await p.evaluate(() => { window.PortfolioBoot ? PortfolioBoot.replay() : Swarm.replay(); }); await p.waitForTimeout(4000);
  s = await snap(p); ok('replay restarts the build (building, partial progress)', s.st === 'build' && s.built > 0 && s.built < s.total, `(${s.built}/${s.total})`);
  await p.click('#sw-hud [data-a=close]'); await p.waitForTimeout(700); s = await snap(p);
  ok('✕ aborts: everything visible, overlay removed, no strays, no half-typed text', !s.building && s.unbuilt === 0 && s.strays === 0 && s.cursors === 0 && s.dirtyText === 0);
  ok('no page errors after replay/abort', p.errs.length === 0, p.errs.join(' | ')); await p.close();
  /* 3. HUD controls + manual scroll pauses the tour (1x) */
  p = await open({ width: 1440, height: 900 }, 'swarmSpeed=1');
  await p.waitForFunction(() => Swarm.state === 'build', null, { timeout: 20000 }); await p.waitForTimeout(1500);
  await p.mouse.move(700, 400); await p.mouse.wheel(0, 300); await p.waitForTimeout(300);
  ok('manual scroll pauses the tour (HUD pill becomes "Tour")', await p.evaluate(() => !Swarm.tour && /^Tour$/.test(document.querySelector('[data-a=tour]').innerText.trim())));
  await p.click('#sw-hud [data-a=speed]'); ok('1x button cycles to 2x', (await p.evaluate(() => Swarm.speed)) === 2);
  await p.click('#sw-hud [data-a=tour]'); ok('Tour button re-enables the tour', await p.evaluate(() => Swarm.tour));
  await p.close();
  /* 4. skip paths */
  p = await open({ width: 1440, height: 900 }, 'swarm=off'); await p.waitForTimeout(800);
  ok('?swarm=off skips the intro and shows the page', await p.evaluate(() => !document.documentElement.classList.contains('is-building') && document.querySelectorAll('[data-layer]:not(.is-built)').length >= 0)); await p.close();
  p = await open({ width: 1440, height: 900 }, 'swarmSpeed=4'); await p.emulateMedia({ reducedMotion: 'reduce' }); await p.reload(); await p.waitForTimeout(800);
  ok('prefers-reduced-motion skips the intro', await p.evaluate(() => !document.documentElement.classList.contains('is-building'))); await p.close();
  /* 5. phone */
  p = await open({ width: 390, height: 844 }, 'swarmSpeed=4'); await p.waitForFunction(() => Swarm.state === 'finale', null, { timeout: 120000 }); await p.waitForTimeout(600); s = await snap(p);
  ok('phone: finishes with 12 agents max, no errors', s.built === s.total && s.agents <= 12 && p.errs.length === 0, `(${s.agents} agents, errs: ${p.errs.join('|')})`); await p.screenshot({ path: 'tests-out-phone.png' }); await p.close();
  await browser.close(); console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\nALL CHECKS PASSED'); process.exit(fails ? 1 : 0);
})();
```

### 10.2 `tests/layout-check.js` (VERBATIM)
```js
/* tests/layout-check.js — static layout contract. Usage: node tests/layout-check.js   [PAGE=index.html BASE=http://localhost:8765]
   Loads the page with the intro skipped (?swarm=off) at 8 widths and checks: no horizontal scroll, layer geometry, display rules. Writes tests-out-w<width>.png. */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765', PAGE = process.env.PAGE || 'index.html';
let fails = 0; const ok = (n, c, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? '  ' + x : '')); if (!c) fails++; };
(async () => {
  const b = await chromium.launch();
  for (const w of [360, 390, 768, 1024, 1280, 1440, 1920, 2560]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } }); await p.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());
    await p.goto(`${BASE}/${PAGE}?swarm=off`); await p.waitForTimeout(700);
    const r = await p.evaluate(() => {
      const ls = [...document.querySelectorAll('[data-layer]')]; const zero = ls.filter((e) => { const b = e.getBoundingClientRect(); return getComputedStyle(e).display !== 'none' && b.width < 0.5 && b.height < 0.5; }).length;
      const inline = ls.filter((e) => ['text', 'chip'].includes(e.dataset.layer) && getComputedStyle(e).display === 'inline').map((e) => e.className || e.tagName);
      const withKids = ls.filter((e) => ['text', 'chip'].includes(e.dataset.layer) && e.children.length && e.dataset.swarm !== 'wipe').map((e) => e.className || e.tagName);
      return { sw: document.documentElement.scrollWidth, iw: innerWidth, n: ls.length, zero, inline, withKids };
    });
    ok(`${w}px: no horizontal scroll`, r.sw <= r.iw + 1, `(scrollWidth ${r.sw} / ${r.iw})`);
    if (w === 1440) { ok('layer count 300-450', r.n >= 300 && r.n <= 450, `(${r.n})`); ok('text/chip layers are never display:inline', r.inline.length === 0, r.inline.slice(0, 6).join(',')); ok('text/chip layers have no child elements', r.withKids.length === 0, r.withKids.slice(0, 6).join(',')); }
    await p.screenshot({ path: `tests-out-w${w}.png`, fullPage: false }); await p.close();
  }
  await b.close(); console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\nALL CHECKS PASSED'); process.exit(fails ? 1 : 0);
})();
```

### 10.3 `tests/css-coverage.js` (VERBATIM)
```js
/* tests/css-coverage.js — every class used in index.html + render.js must be styled somewhere in css/*.css (except pure state/utility hooks).
   Usage: node tests/css-coverage.js   → prints classes with no CSS rule. Exit code 1 if any are missing. */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const read = (f) => { try { return fs.readFileSync(path.join(root, f), 'utf8'); } catch (e) { console.warn('missing file: ' + f); return ''; } };
const markup = read('index.html') + read('js/render.js');
const css = ['tokens', 'base', 'layout', 'components', 'swarm'].map((n) => read(`css/${n}.css`)).join('\n');
const classes = new Set();
for (const m of markup.matchAll(/class="([^"$]*)"/g)) for (const c of m[1].split(/\s+/)) if (c && !/[${}]/.test(c)) classes.add(c);
const IGNORE = new Set(['is-active', 'is-building', 'is-open', 'is-now', 'is-lit', 'is-live', 'is-built', 'g-arrow', 'g-cross', 'g-ibeam']);
const missing = [...classes].filter((c) => !IGNORE.has(c) && !new RegExp('[.#\\[\\s,>+~(]\\.?' + c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?![\\w-])').test(css) && !css.includes('.' + c));
console.log(missing.length ? 'UNSTYLED CLASSES:\n  ' + missing.join('\n  ') : 'All ' + classes.size + ' classes have CSS.');
process.exit(missing.length ? 1 : 0);
```
Structural classes that need no visual styling (for example `.stats`, `.hls`, `.ms-list`, `.tl__list`) still get a rule — even if it only sets `display`, `list-style` or `gap` — so that this check passes and the intent is explicit.

### 10.4 Manual visual review checklist (do it with real screenshots; use `?swarmSpeed=1` and the Playwright script below)
```bash
node -e "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('http://localhost:8765/index.html');for(const t of [0.5,1.5,3,8,16,26,38,48,53]){await p.waitForTimeout((t-(global.l||0))*1000);global.l=t;await p.screenshot({path:'tests-out-t'+t+'.png'})}await b.close()})()"
```
Look at each PNG and confirm:
- **0.5 s** — near-black screen, faint giant "M", two small flocks of coloured arrows, HUD `Scanning page…`.
- **1.5 s** — rulers on the top/left, blue scan flash fading, cursors as + and I-beams along the left edge, HUD `18 agents · 0 / N layers`.
- **3 s** — blue wireframe outlines with white corner handles and `W × H` pills around the nav/hero elements, a blue-grey slab where the portrait will be, a red vertical guide line, some text being typed with a blinking caret and an I-beam.
- **8 s** — hero mostly built (giant word, portrait, name, role lines, red button); stats counting up; cursors leaving to Selected Work; red outlines starting on cards.
- **16 s** — page scrolled to the cards/tech strip; image placeholders blurring in; a row of small red boxes sweeping across the logos; a blue sweep line with a glowing dot.
- **26 s** — proof section/compare slider: maroon panel, six highlight rows typing in, compare slider with the red handle.
- **38 s** — about/journey: chips typing quickly, red process spine, quote card rising.
- **48 s** — contact: huge heading, poster card outlined in red, footer being built; 29–30 agents.
- **53 s** — poster card centred, cursors orbiting it in a ring, HUD `Rebuilt by 30 agents in ~51s · Go live · Replay`.
Also verify: at any moment there are **no leftover boxes** on finished elements; text is never visibly broken (no stray carets after completion); the page is not horizontally scrollable.

---------------------------------------------------------------------
## PART 11 — DEFINITION OF DONE (every box must be true before you finish)

**Verbatim files**
- [ ] All VERBATIM files exist and are byte-identical to the blocks in this brief (spot-check with `diff` against what you wrote from the brief; never "fix" them).
- [ ] `node --check` passes for every `.js` file; `index.html` has no 404s for local files except the documented not-yet-provided assets (`work-*.jpg`, `raw-*.jpg`, `og.jpg`, `Mayura-CV.pdf`, `apple-touch-icon.png` if generation failed).

**Content**
- [ ] Name, role, city, contact, links and all 11 projects exactly as in `content.js`; Yulya Studio links to `https://studio.yulya.me`; Instagram is `@moheith_mayura`.
- [ ] English only: no Kannada/Hindi/Indonesian text, no language switcher, no "RENANDO", "VFX" or "video editor" text anywhere (`grep -ri` the folder to prove it).
- [ ] Unity, Blender, Krita and Live2D appear in the toolkit chips, the software tiles, the tech marquee and the journey.
- [ ] CV links show the "CV coming soon" toast while the PDF is absent; placeholder design cards are clearly marked.

**Visual fidelity (compare screenshots with Part 6)**
- [ ] Hero: giant red-gradient `PORTFOLIO` behind the cut-out portrait with the hair overlapping the letters; white `MAYURA.` with red square; script `Hello, I'm`; coral role text; red CTA; stats `4+ / 10+ / 8` in red on the right; pulsing availability dot.
- [ ] Two heading families used correctly (Anton statement headings; Plus Jakarta 800 tight list headings); coral accent word on the second line of statement headings; hairline dividers; tracked uppercase eyebrows with `01 /` numbering.
- [ ] Tech marquee (16 tools) with edge fade; proof panel with maroon glow + `10+` with laurels + six highlight rows with red metrics; sketch-to-shipped slider with red circular handle (works with **no** images); red quote card with script signature; process timeline with red spine; accordion journey with first row open; huge `LET'S WORK TOGETHER.`; poster card with red button; quick-brief bar; footer with live IST clock and four accent dots.
- [ ] Works with ZERO project images and ZERO videos (gradient fallbacks everywhere); the hero photo has an SVG fallback.

**Swarm intro fidelity**
- [ ] `node tests/swarm-check.js` → `ALL CHECKS PASSED`.
- [ ] Full-speed run (`?swarmSpeed=1`): finale between **44 s and 56 s**, 350–400 layers, agents 18 → 30, HUD text exactly as 5.1/5.6, no console errors, no stray boxes.
- [ ] You looked at the screenshots of 10.4 and each one matches its description.
- [ ] Select-and-edit moments are visible: at least 8 text layers show a draft-then-retype or a typo-fix (count with `Swarm.on('layer')` debugging or by watching the typed text).
- [ ] Manual scroll pauses the tour; `1x` cycles 1x → 2x → 4x → 0.5x; ✕ reveals everything instantly; Go live removes the overlay and re-enables Lenis/cursor; Replay reruns identically; reduced-motion, `?swarm=off` and deep links skip the intro; the page is never left invisible (4-second inline fail-safe).

**Quality**
- [ ] No console errors on load, during the intro, after Go live, and with `?swarm=off`. No layout shift. No horizontal scroll from 360 to 2560 px (`layout-check.js`).
- [ ] Every interactive element is keyboard reachable with a visible focus ring; modal and palette trap focus; Motion-off disables all animation and the page still looks complete.
- [ ] Lighthouse (if available: `npx lighthouse http://localhost:8765/index.html?swarm=off --only-categories=performance,accessibility --quiet`) Performance ≥ 90, Accessibility ≥ 95 with the intro skipped.
- [ ] Live GitHub/Hugging Face numbers fail silently offline and keep the static values.
- [ ] `README.md`, `ASSUMPTIONS.md`, `BUILD_LOG.md` written (Part 12).

---------------------------------------------------------------------
## PART 12 — README, ASSUMPTIONS AND THE FINAL REPORT

### 12.1 `ASSUMPTIONS.md`
A short list of every decision you made where this brief was silent (for example: icon fallbacks, hover details, any file you could not generate).

### 12.2 `README.md` (write it for the site owner, who is not an engineer)
Sections: **What this is** · **Run it** (double-click `index.html` or `python3 -m http.server`; VS Code Live Server port 5500) · **Edit your content** (`js/content.js` for projects/numbers/links/timeline/toolkit, `index.html` for headings and paragraphs; where the WhatsApp message lives: `CONTENT.meta.waMessage`) · **Add project screenshots** (`assets/img/work-01.jpg … work-11.jpg`, 16:9, ≥ 1280×720; `raw-final.jpg` and `raw-wireframe.jpg` for the slider, 16:10; `og.jpg` 1200×630) · **Replace the two placeholder design cards** (projects 10 and 11 in `content.js`: set `placeholder:false`, title, image, url) · **Add your CV** (`assets/Mayura-CV.pdf`) · **Change the domain** (search/replace `YOURDOMAIN.com` in `index.html`) · **Tune the intro** (`Swarm.start({...})` knobs in `main.js`: `targetSeconds`, `maxAgents`, `editRate`; add `?swarmSpeed=4` to preview quickly; `?swarm=off` to skip) · **Turn the intro off** · **Deploy free** (Netlify drag-and-drop, Vercel, GitHub Pages, Cloudflare Pages — exact click paths) · **Run the tests** (Part 10 commands) · **Troubleshooting** (Part 5.11 in plain words).

### 12.3 `BUILD_LOG.md`
Running log of phases, decisions and fixes (kept up to date during the build).

### 12.4 The final report (print this as your very last message)
1. One paragraph: what was built and where (`portfolio/`).
2. The results of the three test commands (copy the PASS/FAIL lines).
3. The measured intro time at 1x (the `Rebuilt by N agents in X s` text) and the layer count.
4. A list of anything you could not do and why (e.g. icon generation) — or "nothing".
5. The ASSUMPTIONS list (10 lines max).
6. A 10-line "How to customise" summary for the owner.
**Then stop.** Do not ask the owner any question.
