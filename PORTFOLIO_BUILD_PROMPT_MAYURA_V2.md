# MASTER BUILD PROMPT v2 — Mayura's Portfolio: a cinematic red-and-black site that BUILDS ITSELF with a swarm of 30 AI cursors

You are an autonomous senior front-end engineer with a file system and a shell. You will build a complete portfolio website for **Mohieth Mayura S Y ("Mayura")**, a full stack developer and graphics designer from Bengaluru, India.

The site copies the look, motion and the signature **"agent swarm builds the page live"** intro of a reference site I studied (a video-editor portfolio). The reference intro shows 18 to 30 tiny arrow cursors that fly to every element of the page, drag out blue selection boxes, type the text in letter by letter, fill image placeholders, and finally circle around a card while a bar says "Rebuilt by 30 agents in 51.4s". On top of that you add the extra features in Part 7.

**This document is complete.** It contains the exact content, the exact HTML, the exact choreography of every cursor, and tested reference code for the intro engine. You do not need to invent the design or the intro: you assemble, style and finish it exactly as written, then verify it with the tests in Part 11.

---------------------------------------------------------------------
## PART A — HOW TO RUN THIS JOB (READ FIRST, FOLLOW STRICTLY)

**A1. Read everything first.** Read this whole file once, top to bottom, before you create a single file. Parts 5, 8 and 9 contain files you must copy verbatim. Do not skim them.

**A2. Do not ask me questions.** Decide, write the decision in `ASSUMPTIONS.md` (3 to 10 short lines), and keep going. I am not available while you work.

**A3. Output folder.** Create everything inside `./portfolio/` (relative to the current directory). All paths in this document are relative to that folder.

**A4. Keep a log.** Create `PROGRESS.md` and update it after every milestone (Part 11) with: milestone name, status (DONE / FAILING), and the command you ran to verify it.

**A5. Three kinds of files.**
1. **Copy verbatim (do not edit, do not "improve", do not reformat):** `js/content.js` (Part 8), `index.html` (Part 9), `js/swarm-script.js` (5.8), `js/swarm.js`, `js/hud.js`, `css/swarm.css` (5.7), `tools/check-layers.js`, `tools/test-swarm.js` (Part 11). Only change one of them if a test proves a bug, and then fix it locally and note it in `ASSUMPTIONS.md`.
2. **Write yourself, following the specs:** `css/tokens.css`, `css/base.css`, `css/layout.css`, `css/components.css`, `js/main.js`, `js/scroll.js`, `js/cursor.js`, `js/hero.js`, `js/work.js`, `js/compare.js`, `js/journey.js`, `js/extras.js`, `manifest.webmanifest`, `README.md`, `assets/icons/*`.
3. **Provided by me:** `assets/img/hero-cutout.png` (my transparent-background portrait, 900×1200). I will put it in the folder. If it is missing, `hero.js` must fall back to an inline SVG silhouette (see 6.1), and nothing may crash.

**A6. Never abbreviate.** No `...`, no "rest of the code here", no "similar to above", no TODO, no lorem ipsum. Every file is complete and runnable. If a file is long, write it in several tool calls (create the file, then append), but never leave a gap.

**A7. Tech rules.**
- Plain **HTML + CSS + vanilla JavaScript**. No React, no TypeScript, no bundler, no npm packages in the shipped site. It must work by double-clicking `index.html` and from any static server.
- Only these CDN scripts are allowed (already in `index.html`): GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13, Google Fonts (Anton, Plus Jakarta Sans, Inter, Nothing You Could Do, Caveat). One extra network call is allowed: `fetch('https://api.github.com/users/moheith')` (7.12). Every network call must fail silently.
- The page must also work (just without animation libraries) if the CDN scripts are blocked: guard every `gsap`/`Lenis` use with `if (window.gsap)`.
- `html { scroll-behavior: auto; }` is mandatory. A global `scroll-behavior: smooth` breaks the swarm's auto-scroll.
- Code style: clear comments in plain English, CSS custom properties for every colour and size, BEM-style class names (the classes already used in `index.html` are the contract), no inline styles except dynamic positions.

**A8. Every image has a fallback.** The site must look finished with only `hero-cutout.png` present. Project cards use the generated "code poster" (6.2). The compare slider builds its pictures in HTML/CSS (6.5). Never show a broken-image icon: add `onerror` handlers.

**A9. Honesty rules for content.** Use only the facts in Part 8. Never invent clients, awards, employers, download counts or testimonials. Items marked `// EDIT` in `content.js` are placeholders I will replace; keep them and make them look finished. The words "award", "certificate", "client" and "showreel" must not appear anywhere on the site.

**A10. When something fails.** Read the error, fix the cause, run the check again. Try up to 6 times per problem. Never delete or weaken a test to make it pass. Never remove the intro to hide a bug. If a browser is not installed and cannot be installed, still run `node tools/check-layers.js`, then do a careful manual code review of the swarm integration (Part 10) and say so in `PROGRESS.md`.

**A11. Definition of done.** All milestones in Part 11 are DONE, `node tools/check-layers.js` exits 0, `node tools/test-swarm.js` prints `ALL TESTS PASSED`, and the checklist in Part 12 is ticked in `PROGRESS.md`. Then print a short final report: what you built, how to open it, what I must replace (CV, resume, domain, photos), and any assumptions.

---------------------------------------------------------------------
## PART B — OWNER BRIEF (decisions already made, do not reopen them)

- Owner: **Mohieth Mayura S Y**, goes by **Mayura**. Full Stack Developer and Designer / Graphics Designer. Bengaluru, India. Studies BCA at SFGC. 4+ years of experience, 10+ projects. Open to work. Speaks English, Kannada, Hindi.
- **English only.** No language switch, no other language anywhere. (Words from the reference site in other languages must never appear.)
- **Tools he really uses (use these names, nothing else):** Unity, Blender, Krita, Live2D. Plus his code stack: Python, JavaScript, Electron, Ollama, Hugging Face, Discord API, Gemini, Monaco, Git/GitHub, whisper.cpp. Never mention Figma or Photoshop.
- **Projects (real, from his GitHub, Hugging Face and live sites):**
  - **discord.yulya.me** is his **Discord bot** (a free multimodal AI with voice, memory and a simulated **crypto-style economy**).
  - **studio.yulya.me** is **Yulya Studio**, a browser game maker (Monaco IDE + Gemini AI + live hosting + online arcade). It is the project in his "studio" repo.
  - Yulya model family on Hugging Face (fine-tuned local LLMs from 135M to 8B), Desktop AI Companion (Live2D + Ollama), Yulya API, Mascot website, college project.
- **No awards, no showreel video, no CV file, no client logos.** So: awards become "Highlights & Proof", the showreel becomes a "Try Yulya" link plus a CSS poster card, CV/resume are placeholder links that show a "coming soon" toast, client logos become a tech-stack strip.
- **Photo:** `assets/img/hero-cutout.png` is a transparent-background portrait of me (head and shoulders, black blazer and shirt, dark hair). Use it as the hero cut-out so the giant word sits BEHIND my head.
- **The intro plays on EVERY visit** (no "seen" flag, no session skip). A visible ✕ Skip button stays in the HUD, and it is skipped only for `prefers-reduced-motion`, the Motion-off toggle, or the URL `?intro=off`.
- **Accent colour:** default red/coral like the reference. A four-dot switcher (red, violet `#a893ff`, blue, amber) is in the footer (7.13).
- I will buy a domain later: every domain value (canonical URL, Open Graph URL) comes from `CONTENT.meta.siteUrl`.
- Contact: email, Instagram `@moheith_mayura`, WhatsApp +91 86602 27877 (the main call to action opens WhatsApp), GitHub, LinkedIn, X, Hugging Face, Ollama.

---------------------------------------------------------------------
## PART 1 — WHAT THE REFERENCE SITE LOOKS LIKE (the visual truth)

Overall: near-black background, huge condensed white headlines with a **red/coral accent word**, a giant red gradient word behind a cut-out portrait, thin hairline dividers, tiny uppercase tracked micro-labels, red numerals, and generous spacing. It feels like a movie title sequence. My copy is English only (see Part 8). Page is a single-page app with hash links (`#home`, `#work`, `#highlights`, `#about`, `#journey`, `#contact`).

Section order (top to bottom):
1. **Nav bar** (fixed)
2. **Hero** — giant "PORTFOLIO" + cut-out photo + name + stats
3. **01 / Selected Work** — "WORK THAT SHIPS." filter tabs + a slider of 11 project cards (3 visible)
4. **Tech stack strip** — "BUILT WITH / THE RIGHT TOOLS."
5. **Highlights & Proof** — "THE WORK. THE PROOF." + "10+" + highlights list
6. **"A look under the surface"** — "FROM RAW. TO REAL." wireframe vs final UI slider
7. **02 / Behind the Screen** — "CODE THAT WORKS. DESIGN THAT FEELS." education, process timeline, red quote card
8. **03 / The Journey** — "KEEP MOVING. KEEP BUILDING." career timeline + milestones list
9. **04 / Your Next Project** — "LET'S WORK TOGETHER." contact + featured-project poster card + quick-brief bar
10. **Footer**

Things in the reference video that are NOT part of the site (ignore them): the browser tabs/address bar, the Windows taskbar, the weather widget, a "Show hidden icons" tooltip, a taskbar thumbnail pop-up.

---------------------------------------------------------------------
## PART 2 — FILE STRUCTURE (create exactly this)

```
portfolio/
├─ index.html                     [VERBATIM, Part 9]
├─ manifest.webmanifest           (name "Mayura", theme #07070a, icons)
├─ README.md                      (how to edit content, add images, deploy)
├─ ASSUMPTIONS.md  PROGRESS.md    (your working notes)
├─ css/
│  ├─ tokens.css                  (variables only, Part 3)
│  ├─ base.css                    (reset, typography, utilities)
│  ├─ layout.css                  (nav, sections, grid, responsive)
│  ├─ components.css              (cards, tabs, chips, buttons, modal, slider, palette, terminal)
│  └─ swarm.css                   [VERBATIM, 5.7]
├─ js/
│  ├─ content.js                  [VERBATIM, Part 8]  (ALL copy, English only)
│  ├─ swarm-script.js             [VERBATIM, 5.8]     (generated choreography of all 364 layers)
│  ├─ swarm.js                    [VERBATIM, 5.7]     (the agent engine, tested)
│  ├─ hud.js                      [VERBATIM, 5.7]     (bottom control bar)
│  ├─ main.js  scroll.js  cursor.js  hero.js  work.js  compare.js  journey.js  extras.js   [YOU WRITE, Part 10]
├─ tools/
│  ├─ check-layers.js             [VERBATIM, 11.1]
│  └─ test-swarm.js               [VERBATIM, 11.2]
└─ assets/
   ├─ img/ hero-cutout.png [PROVIDED BY ME]  (optional: work-01.jpg … work-11.jpg, og.jpg)
   ├─ cv/ (Mayura_CV.pdf, Mayura_Resume.pdf — placeholders, may be missing)
   └─ icons/ favicon.svg  apple-touch-icon.png
```

Favicon: a rounded red square (#ff3b30) with a white bold condensed letter "M". Also used as the faint watermark in the very first "Scanning page…" screen (a CSS pseudo-element on `html.is-building::before`, opacity .12, removed with the class).

---------------------------------------------------------------------
## PART 3 — DESIGN TOKENS (put in `css/tokens.css`)

```css
:root{
  /* surfaces */
  --bg:#07070a; --bg-2:#0d0d11; --surface:#121216; --surface-2:#18181e;
  --line:rgba(255,255,255,.07); --line-strong:rgba(255,255,255,.16);
  /* text */
  --text:#f5f5f7; --text-2:rgba(245,245,247,.78); --muted:#9a9aa6; --dim:#6b6b76;
  /* brand reds */
  --red:#ff3b30;           /* hero giant word top, big stat numerals */
  --red-deep:#c8231f;      /* gradient middle */
  --accent:#ff4d5a;        /* coral-red for accent headline words ("THE PROOF.", "TO REAL.", "DESIGN THAT FEELS.") */
  --btn:#ef4337;           /* CTA buttons */
  --maroon:#2a0a12;        /* highlights panel glow */
  --violet:#a893ff;        /* Yulya violet, used in the UI mock and as an accent preset */
  /* agent / build-UI blues (only used by the swarm overlay) */
  --blue:#2f8cff; --blue-pill:#0d99ff; --blue-fill:rgba(70,95,130,.85);
  --guide:#ff4d2d;         /* red snap-guide lines, like Figma smart guides */
  --hud-bg:rgba(16,18,22,.92);
  /* agent cursor colours (cycle through them) */
  --a1:#5eead4; --a2:#fb923c; --a3:#ffffff; --a4:#a78bfa; --a5:#7dd3fc; --a6:#fda4af; --a7:#fcd34d; --a8:#86efac;
  /* type */
  --f-display:'Anton','Bebas Neue',Impact,sans-serif;
  --f-body:'Plus Jakarta Sans','Inter',system-ui,sans-serif;
  --f-script:'Nothing You Could Do','Caveat',cursive;
  /* layout */
  --nav-h:64px; --pad:clamp(20px,4vw,64px); --maxw:1440px;
  --ease:cubic-bezier(.22,1,.36,1); --ease-io:cubic-bezier(.65,0,.35,1);
  /* z-index scale */
  --z-hero-word:1; --z-hero-photo:2; --z-hero-text:3; --z-nav:50; --z-modal:80; --z-swarm:9999;
}
```

Typography rules:
- **Display headings** (Anton, UPPERCASE, line-height .9, letter-spacing -0.01em): "PORTFOLIO", the name, "THE WORK. / THE PROOF.", "FROM RAW. / TO REAL.", "CODE THAT WORKS. / DESIGN THAT FEELS.", "LET'S WORK / TOGETHER.", "LITTLE WINS. / BIG MEANING.", "BUILD IT. / MAKE IT FEEL ALIVE.", big red numerals (01, 02, years, 10+). Second line / accent word is `--accent`. A tiny red square "." (period) ends some headings.
- **Bold-grotesk headings** (Plus Jakarta Sans 800, UPPERCASE, letter-spacing -0.045em, line-height 1): "WORK THAT SHIPS.", "KEEP MOVING. KEEP BUILDING.", "EDUCATION & SKILLS", "FROM IDEA TO LAUNCH", card titles, highlight titles.
- **Eyebrow / micro-label:** 11px, weight 700, UPPERCASE, letter-spacing .14em, colour `--muted`. Numbered style: `01 / SELECTED WORK`.
- **Body:** Plus Jakarta Sans 400, 15-16px, line-height 1.6, colour `--text-2`.
- **Script:** "Hello, I'm" and the signature: `--f-script`, white, rotate(-4deg).
- Section H2 size: `clamp(44px, 6vw, 96px)`. Hairline dividers (1px `--line`) separate every section. Section padding: `clamp(96px,12vw,160px)` top and bottom.

---------------------------------------------------------------------
## PART 4 — GLOBAL SYSTEMS

### 4.1 The layer system (ALREADY BUILT INTO `index.html`, do not change it)
Every individually visible piece of the page carries two attributes: `data-layer="<type>"` (`text | image | shape | logo | card`) and a unique `data-layer-id="<id>"`. There are exactly **364 layers**, and `js/swarm-script.js` has one scripted entry per id. Rules you must respect:
- **Do not add, remove, rename or retag layers.** If you restructure any markup, keep every `data-layer` and `data-layer-id` attribute and run `node tools/check-layers.js`.
- `text` layers contain **plain text only** (no child elements): the engine types the element's text letter by letter. `image`, `shape`, `card`, `logo` layers may contain children (a card contains its image/title/meta layers, the highlights panel contains its text layers).
- CSS gate (already in `css/swarm.css`): `html.is-building [data-layer]:not(.is-built){visibility:hidden}` plus `html.is-building [data-layer].is-built{visibility:visible}` so a built child shows even if its parent shape is still hidden. `<html class="is-building">` is in the HTML from the first paint; the engine removes the class at the finale, or `Swarm.finishAll()` removes it on skip.
- Layout must not shift while layers appear: `visibility:hidden` keeps the box, so write CSS as if everything were visible.

### 4.2 Smooth scroll
Lenis (lerp .09) driving GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add(t=>lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`). During the swarm build call `lenis.stop()` and drive scroll with `window.scrollTo`; call `lenis.start()` when done.

### 4.3 Fixed nav bar
Height 64px, background `rgba(7,7,10,.8)` + `backdrop-filter:blur(14px)`, bottom border 1px `--line`. Content hidden under it scrolls behind it (the giant red word is clipped by it in the reference).
- Left: logo wordmark "MAYURA" in Anton 22px white with a small red dot after it (6px circle).
- Centre links (13px, weight 500, white 80%): Work · Highlights · About · Journey · Contact. Active link (scroll-spy) turns white with a 2px red underline that slides between links.
- Right: `▷ Motion off` toggle (11px muted; triangle icon; toggles reduced-motion mode — see 7.14) and a "Let's talk ›" link (12px white, small chevron). On hover the chevron moves 4px right.
- On mobile (<860px): links collapse to a hamburger → full-screen overlay menu with big Anton links stacking in.

### 4.4 Grain + vignette
A fixed full-screen `<canvas>` film grain at 6% opacity, redrawn at ~12 fps (disabled in Motion-off mode), plus a CSS radial vignette (transparent centre → rgba(0,0,0,.35) edges). `pointer-events:none`, z-index just below the nav.

### 4.5 Scroll reveals (after the intro is finished or skipped)
Headings split into lines (wrap each line in an overflow-hidden mask; line slides up from 110% to 0, 0.9s, `--ease`, stagger .08s). Paragraphs fade up 24px. Images clip-reveal (`clip-path: inset(0 0 100% 0)` → `inset(0)`) with a slight scale 1.12 → 1. Use ScrollTrigger `start:'top 85%'`, `once:true`. In Motion-off mode show everything instantly.

---------------------------------------------------------------------
## PART 5 — THE AGENT SWARM BUILD INTRO (MOST IMPORTANT PART)

### 5.0 How it works (read before anything else)
The intro is **scripted, not improvised**. `js/swarm-script.js` (5.8) is a table of all 364 layers. For each layer it gives: which agent (0 to 29) builds it, and five timestamps `t = [t0, t1, t2, t3, t4]`:
1. `t0` the agent leaves whatever it was doing and starts flying (curved bezier path, ease-in-out) toward the **top-left corner** of the element;
2. `t1` it arrives; a selection box is created; the cursor turns into a **crosshair**;
3. `t2` it has dragged the box from the top-left to the bottom-right corner (the box grows as the cursor moves);
4. `t3` the element has been filled: text typed letter by letter (cursor = **I-beam** at the right edge, white blinking caret), or the image placeholder shown then blur-revealed, or the shape/card/logo popped in. The agent is now free and starts drifting like a flock again;
5. `t4` the selection box has faded out (0.22 s) and is removed.
Around the layers, `events` in the script trigger the rulers, the blue top/left flash bars, the scatter of the first flocks, the red snap-guide lines and the blue commit sweeps. `js/swarm.js` plays that table against a virtual clock (speed 1x, 2x, 4x, 0.5x), measures every element's real rectangle on every frame (so boxes follow elements while the page auto-scrolls), and finishes with the orbit finale. `js/hud.js` is the bottom bar.

**This engine was tested in headless Chromium: all 364 layers build, 30 agents appear, no errors, skip/replay/go-live work, manual scrolling pauses the tour.** Copy it exactly (5.7, 5.8). Your job is the website it builds (Parts 6 to 10).

Public API you will use from other files: `Swarm.start()`, `Swarm.finishAll()` (instant reveal, also used for skip/reduced motion), `Swarm.goLive()`, `Swarm.replay()`, `Swarm.setSpeed(n)`, `Swarm.state` (`idle | building | finale | live`), `Swarm.tour`, `Swarm.t`, and the DOM event `swarmstate` on `document` (`detail` = the new state).

### 5.1 What the visitor sees, second by second (the scripted timeline, speed 1x)

| Time | What happens | HUD text |
|---|---|---|
| 0.0-0.8s | Pure black screen. A faint "M" (logo initial) watermark in the centre (opacity .12). Two small flocks (about 8 cursors each) drift around, one at 35% x / 60% y, one at 65% x / 45% y. All cursors are tiny pastel arrows, each facing a different direction. | `Scanning page…` + a thin indeterminate progress line + [Tour] [1x] [🔊] [✕] |
| 0.8-1.2s | Flocks scatter to the page edges and become white **"+" crosshair** marks and **I-beam** text cursors along the left edge and in the corners. **Rulers** fade in along the top and left (20px, tick marks every 10px, tiny numbers every 100px). A bright **blue 24px bar flashes along the top edge** and a thinner one along the left edge, then fades (an initial "page scan"). | `18 agents · 0 / 364 layers` + progress + [Touring] |
| 1.2-2.0s | **Wireframe stage of the hero.** Blue 1px outline boxes with white 6px square handles at the corners appear for every hero element. Small blue pills under boxes show sizes like `1920 × 80`. The portrait area is one big flat blue-grey rectangle (#465f82 at 85%) with a tiny image icon in its centre. Text boxes get text typed into them: `Hello, I'm`, `MAYURA.`, `FULL STACK DEV`, `I build AI products, game to|` with a blinking caret and an I-beam cursor next to each box. The CTA button is a solid red rectangle. | counters climbing fast |
| 2.0-3.5s | The wireframe resolves into the finished hero: portrait appears, giant "PORTFOLIO" word, stats, nav. About 40 layers done by 4s. A red vertical **snap-guide line** (1.5px, `--guide`) runs full viewport height at the content's left edge. | `18 agents · 41 / 364` |
| 3.5-8s | Page auto-scrolls ("Touring"). Work heading `01 / SELECTED WORK` and "WORK THAT SHIPS." are typed in; filter tabs appear one by one with cursors dropping small red outline boxes labelled "AI & ML" on each tab. | 56 → 73 layers |
| 8-12s | Card images appear: blue outline → flat blue-grey placeholder → real image blurs in (blur 18px → 0 over 0.6s). Titles/numbers type in. Cards get a **red outline** (not blue) while being built. | 19 → 23 agents, 93 → 112 layers |
| 12-15s | Logo strip: a long chain of small **red** boxes sweeps left→right across the row very quickly (each box ~120 ms apart), logos pop in colour. A thin **blue sweep line** with a glowing dot at its left end travels along the bottom of the finished section (the "section commit" line). | 119 → 136 layers |
| 15-22s | Highlights: panel with maroon glow; headline typed; "10+" counts up with laurels; each highlight row: outline box → text typed → red year appears. Row outlines are white/red. | 24 agents, 138 → 165 |
| 22-28s | "A LOOK UNDER THE SURFACE / FROM RAW. TO REAL." Big grey-blue image placeholder, then the wireframe-to-final UI mock; a thin vertical white line + **red circular handle** appears in the middle; labels `WIREFRAME` and `FINAL UI`. | 170 → 188 |
| 28-38s | About: headline typed in two lines; Education list typed row by row; process timeline nodes drop one by one; red quote card slides up. Software tiles (Un, Bl, Kr, L2, Py, JS, Ol, Gi = Unity, Blender, Krita, Live2D, Python, JavaScript, Ollama, Git) pop in with red outline boxes. Temporary rulers flash for ~1s when a new section starts. | 28-29 agents, 213 → 262 |
| 38-45s | Journey: headline, red timeline spine, dates, roles; "+" accordion icons drop in as white crosshairs; milestone list. A blue sweep line travels along the section bottom. | 29 agents, 279 → 318 |
| 45-52s | Contact: heading, paragraph, outlined circle CTA, contact rows (red outline icons), featured-project poster card (grey placeholder first), quick-brief bar, footer logo. | 30 agents, 321 → 364 |
| 52-56s | **Finale.** All cursors lift off their work and **swirl in a circle/ring** around the featured-project poster card and the top-right corner, orbiting with their arrows tangent to the circle, then a few fly off-screen top-right. HUD morphs. | `Rebuilt by 30 agents in 51.4s` + full progress bar + [🔊] [Go live] [Replay] [✕] |

Agent count timeline (from the reference video, already encoded in `agentJoins` of `swarm-script.js`): 18 at start → 19 at 6 s → 23 at 12 s → 24 at 17 s → 28 at 31 s → 29 at 39 s → 30 at 48 s. New agents fly in from the top-right corner. The layer counter is non-linear: about 46 in the first 4.3 s, then roughly 5 to 10 per second. **You do not implement any of this timing: it is in the script file.**

### 5.2 Agent cursor look
- Inline SVG arrow 22×22px, path `M3 2 L3 19 L7.6 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.6 L16.6 13.6 Z`, fill = the agent's colour (cycle `--a1…--a8`), 1.4px white stroke, soft drop shadow (`drop-shadow(0 2px 4px rgba(0,0,0,.5))`).
- Flight: curved path (quadratic bezier with a random control point), `ease-in-out cubic`, 450-900 ms per hop. While flying the arrow leans toward its heading and settles to 0° on arrival.
- Cursor modes per action: **arrow** (flying/idle), **crosshair "+"** (white, 14px, 1.5px strokes) while dragging out a box, **I-beam** (white, 1.5px wide, 16px tall) while typing text.
- Idle agents (nothing to claim) drift like a flock (small random acceleration, speed capped at 1.6px/frame, arrow rotates to velocity).

### 5.3 Ghost box (selection box) look
- 1px solid `--blue` outline, no radius, four white 6px squares with 1px blue border centred on the corners, and a **size pill** under the box: `--blue-pill` background, white 10px bold text, 3px radius, content `W × H`.
- Types: `text` → blue outline only + typed caret; `image` → also filled with `--blue-fill` and a tiny image icon in the centre; `shape/button` → filled `rgba(240,69,58,.9)`; `card`, `logo` → **red** outline (`--guide`) instead of blue.
- Draw animation: cursor starts on the top-left corner and drags to the bottom-right corner while the box grows (260 ms, ease-out-cubic). When done, the real element becomes visible and the box fades out in 220 ms.
- Boxes follow their element every animation frame (the page keeps scrolling during the tour).

### 5.4 Text typing
Type the real element's text letter by letter (28-45 ms per character; cap total at ~1.8s for long paragraphs by typing in word chunks) inside the blue box, with a 1px white blinking caret and an I-beam agent cursor sitting at the right of the box. Plain-text layers only.

### 5.5 Snap guides, rulers, section-commit sweep
- **Guides:** a 1.5px full-height `--guide` line at the left edge of the section currently being built (x aligned to the content's left edge); fades in 200 ms, stays while the section builds, fades out 400 ms after the section completes.
- **Rulers:** `position:fixed` top ruler (height 20px) and left ruler (width 20px), background `rgba(28,36,51,.88)`, 1px ticks every 10px (taller every 100px) drawn with a repeating `linear-gradient`, labels 8px `--muted` every 100px. Show during the first 3 seconds and for 1.2s at each new section.
- **Section-commit sweep:** a 2px blue line (`linear-gradient(90deg, transparent, var(--blue), transparent)`) with an 8px glowing dot at its leading end moves left→right (700 ms) along the bottom edge of a section when all its layers are built.

### 5.6 HUD control bar (bottom centre)
Position `fixed; bottom:24px; left:50%; transform:translateX(-50%)`; height 40px; radius 999px; background `--hud-bg` + `backdrop-filter:blur(12px)`; border 1px rgba(255,255,255,.08); shadow `0 8px 30px rgba(0,0,0,.5)`; font Inter 11px/500, colour #cfd3da; z-index above everything. Three states:
1. **Scanning:** `Scanning page…` + 90px indeterminate progress line + ghost button `Tour` + `1x` + speaker + ✕.
2. **Building:** overlapping avatar stack (5 circles 18px, -6px overlap, 2px border in bg colour, each in an agent colour) · `18 agents` · divider · `137 / 364 layers` · 72px×3px progress track with `--blue` fill · blue pill button **Touring** (bg #2563eb, white, 24px high, 6px radius) · `1x` · speaker · ✕.
3. **Done:** `Rebuilt by 30 agents in 51.4s` · full progress · speaker · blue **Go live** · ghost **Replay** · ✕.
Button behaviour: `Tour/Touring` toggles auto-scroll (user scrolling manually pauses it and the pill changes to ghost "Tour"); `1x` cycles 1x → 2x → 4x → 0.5x; speaker toggles synthesized sound (default OFF); ✕ aborts the build instantly (reveal everything, remove overlay); **Go live** removes the overlay, swarm flies off, `lenis.start()`, custom cursor activates; **Replay** resets all layers and re-runs.

### 5.7 Engine files (VERBATIM — create these three files exactly)

**FILE: css/swarm.css**
```css
/* css/swarm.css — agent cursors, selection boxes, rulers, guides, sweep line, HUD. Reference implementation. */
html.is-building [data-layer]:not(.is-built){ visibility:hidden; }
html.is-building [data-layer].is-built{ visibility:visible; }   /* a built child shows even when its parent layer (a shape/card) is not built yet */
#swarm-root{ position:fixed; inset:0; pointer-events:none; z-index:var(--z-swarm,9999); overflow:hidden; }

/* ---- agent cursors (arrow / crosshair / I-beam share one SVG, the data-mode attribute picks which is visible) */
.agent-cursor{ position:absolute; left:0; top:0; filter:drop-shadow(0 2px 4px rgba(0,0,0,.5)); will-change:transform; transform-origin:3px 2px; }
.agent-cursor .m-cross, .agent-cursor .m-ibeam{ display:none; }
.agent-cursor[data-mode="cross"] .m-arrow, .agent-cursor[data-mode="ibeam"] .m-arrow{ display:none; }
.agent-cursor[data-mode="cross"] .m-cross, .agent-cursor[data-mode="ibeam"] .m-ibeam{ display:block; }

/* ---- ghost (selection) boxes */
.ghost-box{ position:absolute; left:0; top:0; transform-origin:0 0; outline:1px solid var(--blue,#2f8cff); will-change:transform,width,height; }
.ghost-box .h{ position:absolute; width:6px; height:6px; background:#fff; border:1px solid var(--blue,#2f8cff); box-sizing:border-box; }
.ghost-box .h.tl{left:-3px;top:-3px} .ghost-box .h.tr{right:-3px;top:-3px} .ghost-box .h.bl{left:-3px;bottom:-3px} .ghost-box .h.br{right:-3px;bottom:-3px}
.ghost-box .pill{ position:absolute; left:50%; top:100%; transform:translate(-50%,6px); background:var(--blue-pill,#0d99ff); color:#fff;
  font:700 10px/1 var(--f-body,Inter,sans-serif); padding:3px 6px; border-radius:3px; white-space:nowrap; }
.ghost-box .caret{ display:none; }
.ghost-box.typing .caret{ display:block; position:absolute; top:2px; bottom:2px; width:1px; background:#fff; left:calc(var(--caret,0) * 100%); animation:blink .7s steps(1) infinite; }
@keyframes blink{ 50%{ opacity:0 } }
.ghost-box.is-placeholder{ background:var(--blue-fill,rgba(70,95,130,.85)); }
.ghost-box.is-placeholder::after{ content:""; position:absolute; left:50%; top:50%; width:22px; height:18px; margin:-9px 0 0 -11px; border:2px solid rgba(255,255,255,.7); border-radius:3px; }
.ghost-box.is-filled{ background:rgba(240,69,58,.9); }
.ghost-card, .ghost-logo{ outline-color:var(--guide,#ff4d2d); }
.ghost-card .h, .ghost-logo .h{ border-color:var(--guide,#ff4d2d); }
.ghost-card .pill, .ghost-logo .pill{ background:var(--guide,#ff4d2d); }
.ghost-box.fade-out{ opacity:0; transition:opacity .22s; }

/* ---- element reveals */
.reveal-blur{ animation:revealBlur .6s var(--ease,cubic-bezier(.22,1,.36,1)) both; }
@keyframes revealBlur{ from{ filter:blur(18px); opacity:0 } to{ filter:none; opacity:1 } }
[data-layer] .untyped{ visibility:hidden; }

/* ---- rulers (top 20px, left 20px), initial blue bars, snap guides, commit sweep */
html:not(.show-rulers) #swarm-rulers{ opacity:0; }
#swarm-rulers{ transition:opacity .25s; }
#swarm-rulers .rt, #swarm-rulers .rl{ position:fixed; background-color:rgba(28,36,51,.88); color:var(--muted,#9a9aa6); font:8px/1 var(--f-body,Inter,sans-serif); z-index:var(--z-swarm,9999); pointer-events:none; }
#swarm-rulers .rt{ left:0; right:0; top:0; height:20px;
  background-image:repeating-linear-gradient(90deg, rgba(255,255,255,.35) 0 1px, transparent 1px 10px), repeating-linear-gradient(90deg, rgba(255,255,255,.7) 0 1px, transparent 1px 100px);
  background-size:100% 6px, 100% 12px; background-position:0 100%, 0 100%; background-repeat:no-repeat; }
#swarm-rulers .rl{ top:0; bottom:0; left:0; width:20px;
  background-image:repeating-linear-gradient(180deg, rgba(255,255,255,.35) 0 1px, transparent 1px 10px), repeating-linear-gradient(180deg, rgba(255,255,255,.7) 0 1px, transparent 1px 100px);
  background-size:6px 100%, 12px 100%; background-position:100% 0, 100% 0; background-repeat:no-repeat; }
#swarm-bars .bt, #swarm-bars .bl{ position:fixed; background:var(--blue,#2f8cff); opacity:0; z-index:var(--z-swarm,9999); pointer-events:none; transition:opacity .35s; }
#swarm-bars .bt{ left:0; right:0; top:0; height:24px; } #swarm-bars .bl{ left:0; top:0; bottom:0; width:10px; }
html.flash-bars #swarm-bars .bt, html.flash-bars #swarm-bars .bl{ opacity:.85; transition:none; }
.swarm-guide{ position:absolute; left:0; top:0; width:1.5px; height:100%; background:var(--guide,#ff4d2d); opacity:.9; transition:opacity .4s; }
.swarm-guide.fade-out{ opacity:0; }
.swarm-sweep{ position:absolute; left:0; top:0; width:100%; height:2px; opacity:0; transition:opacity .3s; }
.swarm-sweep i{ position:absolute; left:-200px; top:0; width:200px; height:2px; background:linear-gradient(90deg,transparent,var(--blue,#2f8cff)); }
.swarm-sweep i::after{ content:""; position:absolute; right:-4px; top:-3px; width:8px; height:8px; border-radius:50%; background:#cfe6ff; box-shadow:0 0 12px 4px var(--blue,#2f8cff); }

/* ---- HUD (bottom centre, 3 states: scanning / building / done) */
.hud{ position:fixed; left:50%; bottom:24px; transform:translateX(-50%); height:40px; border-radius:999px; padding:0 8px 0 16px; display:flex; align-items:center; gap:12px;
  background:var(--hud-bg,rgba(16,18,22,.92)); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.08); box-shadow:0 8px 30px rgba(0,0,0,.5);
  font:500 11px/1 Inter,system-ui,sans-serif; color:#cfd3da; z-index:calc(var(--z-swarm,9999) + 1); white-space:nowrap; }
.hud [data-show]{ display:none; align-items:center; gap:10px; }
.hud[data-state="scanning"] [data-show~="scanning"], .hud[data-state="building"] [data-show~="building"], .hud[data-state="done"] [data-show~="done"]{ display:flex; }
.hud .avatars{ display:flex; } .hud .avatars i{ width:18px; height:18px; border-radius:50%; border:2px solid #101216; margin-left:-6px; box-sizing:content-box; } .hud .avatars i:first-child{ margin-left:0; }
.hud .sep{ width:1px; height:14px; background:rgba(255,255,255,.12); }
.hud .track{ display:block; width:72px; height:3px; background:rgba(255,255,255,.12); border-radius:2px; overflow:hidden; } .hud .track b{ display:block; height:100%; width:0; background:var(--blue,#2f8cff); }
.hud .indeterminate{ display:block; width:90px; height:2px; background:rgba(255,255,255,.12); position:relative; overflow:hidden; }
.hud .indeterminate::after{ content:""; position:absolute; top:0; bottom:0; width:30px; background:var(--blue,#2f8cff); animation:indet 1.1s linear infinite; }
@keyframes indet{ from{ left:-30px } to{ left:90px } }
.hud button{ all:unset; cursor:pointer; height:24px; padding:0 10px; border-radius:6px; display:inline-flex; align-items:center; font:600 11px/1 Inter,system-ui,sans-serif; color:#cfd3da; }
.hud button:hover{ background:rgba(255,255,255,.08); }
.hud button:focus-visible{ outline:2px solid var(--accent,#ff4d5a); outline-offset:2px; }
.hud button.pill-blue{ background:#2563eb; color:#fff; } .hud button.pill-blue:hover{ background:#3b73f0; }
.hud button.ghost{ border:1px solid rgba(255,255,255,.14); }

/* ---- small screens: no rulers, compact HUD */
@media (max-width:640px){
  #swarm-rulers{ display:none; }
  .hud{ bottom:12px; max-width:calc(100vw - 16px); gap:8px; padding:0 6px 0 10px; font-size:10px; }
  .hud .avatars, .hud .sep, .hud .track{ display:none; }
  .agent-cursor{ width:18px; height:18px; }
}
@media (prefers-reduced-motion:reduce){ .reveal-blur{ animation:none; } }
```

**FILE: js/swarm.js**
```js
/* js/swarm.js — Agent Swarm build engine, SCRIPTED mode (reference implementation, tested in headless Chromium).
   It plays SWARM_SCRIPT (js/swarm-script.js): a fixed, deterministic choreography. Every layer has an agent and 5 timestamps:
   t0 agent leaves its previous spot and starts flying · t1 arrives at the element's top-left · t2 finished dragging the box
   · t3 finished typing / filling (agent is free) · t4 box fully faded out. Times are virtual seconds at 1x. */
(function () {
  'use strict';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const S = SWARM_SCRIPT;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (() => { let s = 1234567; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })(); // seeded, so every run looks the same

  const Swarm = {
    speed: 1, tour: true, state: 'idle',          // idle | building | finale | live
    t: 0, built: 0, total: S.layers.length, agents: [], states: [], events: [], eventIdx: 0, layerIdx: 0,
    active: [], boxes: new Set(), sweeps: [], guides: new Map(), root: null, startedWall: 0, elapsedWall: 0,
    finaleT0: 0, onTick: null, onState: null, onType: null, _raf: 0, _last: 0,
  };

  /* ------------------------------------------------------------ agents */
  function arrowSVG(color) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', '22'); svg.setAttribute('height', '22');
    svg.classList.add('agent-cursor');
    svg.innerHTML =
      `<g class="m-arrow"><path d="M3 2 L3 19 L7.6 14.8 L10.6 21.6 L13.4 20.4 L10.4 13.6 L16.6 13.6 Z" fill="${color}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></g>` +
      `<g class="m-cross"><path d="M12 4 V20 M4 12 H20" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></g>` +
      `<g class="m-ibeam"><path d="M9 4 H15 M12 4 V20 M9 20 H15" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none"/></g>`;
    return svg;
  }
  function makeAgent(i) {
    const color = S.colors[i % S.colors.length];
    const a = { i, color, el: arrowSVG(color), x: 0, y: 0, rot: 0, vx: 0, vy: 0, mode: 'arrow', joined: false,
                task: null, tween: null, home: [0.5, 0.5], orbit: null };
    a.el.style.display = 'none';
    Swarm.root.appendChild(a.el);
    return a;
  }
  function drawAgent(a) {
    a.el.style.transform = `translate3d(${a.x}px,${a.y}px,0) rotate(${a.rot}deg)`;
    a.el.dataset.mode = a.mode;
  }
  function placeFlockStart(a) {          // 18 starting agents: two flocks, around 35%/60% and 65%/45% of the viewport
    const c = S.events.find((e) => e.e === 'flocks').clusters[a.i % 2];
    a.home = c;
    a.x = c[0] * innerWidth + (rand() - 0.5) * 220; a.y = c[1] * innerHeight + (rand() - 0.5) * 160;
    a.vx = (rand() - 0.5) * 1.4; a.vy = (rand() - 0.5) * 1.4;
  }
  function idleDrift(a, k) {              // murmuration: random acceleration + weak pull toward the flock's home, speed capped at 1.6 px/frame
    const hx = a.home[0] * innerWidth, hy = a.home[1] * innerHeight;
    a.vx += ((rand() - 0.5) * 0.35 + (hx - a.x) * 0.0006) * k;
    a.vy += ((rand() - 0.5) * 0.35 + (hy - a.y) * 0.0006) * k;
    const sp = Math.hypot(a.vx, a.vy), max = 1.6;
    if (sp > max) { a.vx *= max / sp; a.vy *= max / sp; }
    a.x = clamp(a.x + a.vx * k, 16, innerWidth - 16); a.y = clamp(a.y + a.vy * k, 16, innerHeight - 16);
    a.rot = (Math.atan2(a.vy, a.vx) * 180) / Math.PI + 135;   // arrow points along its velocity
  }

  /* ------------------------------------------------------------ boxes (blue/red selection boxes) */
  function makeBox(kind) {
    const box = document.createElement('div');
    box.className = `ghost-box ghost-${kind}`;
    box.innerHTML = '<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i><b class="pill"></b><u class="caret"></u>';
    Swarm.root.appendChild(box); Swarm.boxes.add(box);
    return box;
  }
  function placeBox(box, r, grow) {
    box.style.transform = `translate3d(${r.left}px,${r.top}px,0)`;
    box.style.width = `${r.width * grow}px`; box.style.height = `${r.height * grow}px`;
    const pill = box.firstChild && box.querySelector('.pill');
    const txt = `${Math.round(r.width)} × ${Math.round(r.height)}`;
    if (pill.textContent !== txt) pill.textContent = txt;
  }
  function removeBox(box) { box.remove(); Swarm.boxes.delete(box); }

  /* ------------------------------------------------------------ text typing without reflow */
  function setTyped(el, full, p) {
    let n = Math.ceil(full.length * p);
    if (full.length > 60) {               // long paragraphs: reveal word by word so the total stays under ~1.8 s
      const next = full.indexOf(' ', n); n = next === -1 ? full.length : next;
    }
    const a = document.createElement('span'); a.className = 'typed'; a.textContent = full.slice(0, n);
    const b = document.createElement('span'); b.className = 'untyped'; b.textContent = full.slice(n);   // keeps the final layout, so nothing jumps
    el.textContent = ''; el.append(a, b);
    return n;
  }

  /* ------------------------------------------------------------ setup */
  Swarm.init = function () {
    Swarm.root = document.getElementById('swarm-root');
    Swarm.root.innerHTML = '';
    Swarm.events = S.events;
    Swarm.states = S.layers.map((L) => {
      const el = document.querySelector(`[data-layer-id="${L.id}"]`);
      if (el && el.dataset.full === undefined) el.dataset.full = el.textContent;
      return { L, el, phase: 0, box: null, typedN: -1 };
    });
    Swarm.total = Swarm.states.length;
    Swarm.agents = Array.from({ length: S.agentCount }, (_, i) => makeAgent(i));
    // layers that are missing in the DOM are reported once so the builder can fix the markup
    const missing = Swarm.states.filter((s) => !s.el).map((s) => s.L.id);
    if (missing.length) console.warn('[swarm] layers without a DOM element:', missing.join(', '));
  };

  Swarm.start = function () {
    document.documentElement.classList.add('is-building');
    scrollTo(0, 0);
    Swarm.init();
    Swarm.t = 0; Swarm.built = 0; Swarm.eventIdx = 0; Swarm.layerIdx = 0; Swarm.active = [];
    Swarm.sweeps = []; Swarm.state = 'building'; Swarm.tour = true;
    Swarm.startedWall = performance.now(); Swarm._last = performance.now();
    Swarm.agents.forEach((a) => { if (S.agentJoins[a.i] === 0) { a.joined = true; a.el.style.display = ''; placeFlockStart(a); drawAgent(a); } });
    setState('building');
    cancelAnimationFrame(Swarm._raf); Swarm._raf = requestAnimationFrame(frame);
  };

  function setState(s) { Swarm.state = s; document.documentElement.dataset.swarm = s; Swarm.onState && Swarm.onState(s); document.dispatchEvent(new CustomEvent('swarmstate', { detail: s })); }

  /* ------------------------------------------------------------ timed events (rulers, guides, scatter, sweeps, topbar flash) */
  function runEvent(e) {
    const html = document.documentElement;
    if (e.e === 'rulers') html.classList.toggle('show-rulers', !!e.on);
    else if (e.e === 'topbar-flash') { html.classList.add('flash-bars'); setTimeout(() => html.classList.remove('flash-bars'), e.ms / Swarm.speed); }
    else if (e.e === 'hud') { /* HUD state is derived in hud.js from Swarm.t, nothing to do here */ }
    else if (e.e === 'scatter') {          // flocks scatter to the page edges and turn into "+" crosshairs and I-beams
      const pts = [];
      Swarm.agents.filter((a) => a.joined).forEach((a, k) => {
        const side = k % 4, f = ((k * 0.137) % 1);
        const tx = side === 0 ? 14 : side === 1 ? innerWidth - 28 : f * innerWidth, ty = side === 2 ? 14 : side === 3 ? innerHeight - 28 : f * innerHeight;
        a.tween = { t0: Swarm.t, dur: 0.5, fx: a.x, fy: a.y, tx, ty };
        a.mode = k % 2 ? 'cross' : 'ibeam';
        setTimeout(() => { if (!a.task) a.mode = 'arrow'; }, 700 / Swarm.speed);
        a.home = [clamp(tx / innerWidth, 0.1, 0.9), clamp(ty / innerHeight, 0.2, 0.8)];
      });
    } else if (e.e === 'guide') {
      const sec = document.querySelector(e.sel);
      if (e.on) {
        const g = document.createElement('div'); g.className = 'swarm-guide'; Swarm.root.appendChild(g);
        Swarm.guides.set(e.sel, { el: g, sec });
      } else {
        const o = Swarm.guides.get(e.sel); if (o) { o.el.classList.add('fade-out'); setTimeout(() => o.el.remove(), 400 / Swarm.speed); Swarm.guides.delete(e.sel); }
      }
    } else if (e.e === 'sweep') {
      const el = document.createElement('div'); el.className = 'swarm-sweep'; el.innerHTML = '<i></i>'; Swarm.root.appendChild(el);
      Swarm.sweeps.push({ el, sec: document.querySelector(e.sel), t0: Swarm.t, dur: 0.7 });
      window.SwarmSound && SwarmSound.whoosh();
    }
  }

  /* ------------------------------------------------------------ one layer, one frame */
  function activate(st) {
    const a = Swarm.agents[st.L.a];
    if (!a.joined) { a.joined = true; a.el.style.display = ''; a.x = innerWidth - 40; a.y = -20; }   // newly joined agents fly in from the top-right
    st.agent = a; a.task = st; a.tween = null; a.mode = 'arrow';
    st.fromX = a.x; st.fromY = a.y;
    st.cx = (a.x + innerWidth / 2) / 2 + (rand() - 0.5) * 180;     // bezier control point
    st.cy = (a.y + innerHeight / 2) / 2 + (rand() - 0.5) * 160;
    Swarm.active.push(st);
  }

  function stepLayer(st, t) {
    const [t0, t1, t2, t3, t4] = st.L.t, a = st.agent, el = st.el, kind = st.L.k;
    if (!el || el.offsetParent === null && getComputedStyle(el).position !== 'fixed') {      // hidden or missing element: finish instantly
      if (!st.done) completeLayer(st, a); return true;
    }
    const r = el.getBoundingClientRect();
    const needBox = (t >= (st.L.tw ?? t1)) && t < t4;
    if (needBox && !st.box) { st.box = makeBox(kind); st.box.dataset.for = st.L.id; }
    // phase 1: flying to the top-left corner
    if (t < t1) {
      const e = easeInOutCubic(clamp((t - t0) / (t1 - t0), 0, 1)), u = 1 - e;
      const tx = r.left - 2, ty = r.top - 2;
      a.x = u * u * st.fromX + 2 * u * e * st.cx + e * e * tx; a.y = u * u * st.fromY + 2 * u * e * st.cy + e * e * ty;
      a.rot = 40 * Math.sin(Math.PI * Math.min(1, e * 1.1)) * (st.cx < st.fromX ? 1 : -1);
      a.mode = 'arrow';
      if (st.box && st.L.tw !== undefined) placeBox(st.box, r, 1);            // hero wireframe: box already exists at full size
    } else if (t < t2) {                       // phase 2: drag the box from the top-left to the bottom-right corner
      const g = easeOutCubic((t - t1) / (t2 - t1));
      if (st.box) placeBox(st.box, r, st.L.tw !== undefined ? 1 : g);
      a.x = r.left + r.width * g; a.y = r.top + r.height * g; a.rot = 0; a.mode = 'cross';
    } else if (t < t3) {                       // phase 3: type the text / fill the image / fill the shape
      const p = clamp((t - t2) / (t3 - t2), 0, 1);
      if (st.box) placeBox(st.box, r, 1);
      if (kind === 'text') {
        el.classList.add('is-built');
        const n = setTyped(el, el.dataset.full, p);
        if (st.box) { st.box.classList.add('typing'); st.box.style.setProperty('--caret', `${Math.min(1, n / Math.max(1, el.dataset.full.length))}`); }
        if (n !== st.typedN) { st.typedN = n; const ch = el.dataset.full.slice(n - 1, n); Swarm.onType && Swarm.onType(ch); window.SwarmSound && SwarmSound.tick(ch); }
        a.mode = 'ibeam'; a.x = r.right + 6; a.y = r.top + Math.min(r.height - 18, 2); a.rot = 0;
      } else if (kind === 'image') {
        if (st.box) st.box.classList.add('is-placeholder');
        if (p > 0.37 && !el.classList.contains('is-built')) el.classList.add('is-built', 'reveal-blur');
        a.mode = 'arrow'; a.x = r.right - 6; a.y = r.bottom - 6;
      } else {                                 // shape, card, logo
        if (st.box) st.box.classList.add('is-filled');
        if (p > 0.65) el.classList.add('is-built');
        a.mode = 'arrow'; a.x = r.right - 4; a.y = r.bottom - 4;
      }
      el.dataset.phase = 'fill';
    } else {                                   // phase 4: release, agent is free (it goes back to idle drifting), the box fades out
      if (!st.done) completeLayer(st, a);
      if (st.box) { placeBox(st.box, r, 1); st.box.classList.add('fade-out'); }
    }
    return t >= t4;
  }

  function completeLayer(st, a) {
    const el = st.el;
    if (el) { if (st.L.k === 'text') el.textContent = el.dataset.full; el.classList.add('is-built'); delete el.dataset.phase; }
    st.done = true; Swarm.built++;
    if (a && a.task === st) { a.task = null; a.mode = 'arrow'; a.vx = (rand() - 0.5) * 2; a.vy = (rand() - 0.5) * 2; a.home = [clamp(a.x / innerWidth, 0.1, 0.9), clamp(a.y / innerHeight, 0.15, 0.85)]; }
  }

  /* ------------------------------------------------------------ main loop */
  function frame(now) {
    const dtReal = Math.min(0.1, (now - Swarm._last) / 1000); Swarm._last = now;
    const dt = dtReal * Swarm.speed, k = dtReal * 60 * Math.min(Swarm.speed, 4);
    if (Swarm.state === 'building') {
      Swarm.t += dt;
      while (Swarm.eventIdx < Swarm.events.length && Swarm.events[Swarm.eventIdx].t <= Swarm.t) runEvent(Swarm.events[Swarm.eventIdx++]);
      while (Swarm.layerIdx < Swarm.states.length && Swarm.states[Swarm.layerIdx].L.t[0] <= Swarm.t) activate(Swarm.states[Swarm.layerIdx++]);
      // hero wireframe boxes appear BEFORE their agent arrives, so also step layers whose "tw" has passed
      for (const st of Swarm.states) if (st.L.tw !== undefined && !st.agent && Swarm.t >= st.L.tw && !st.wire) {
        st.wire = true; st.box = makeBox(st.L.k); st.box.dataset.for = st.L.id; if (st.el) placeBox(st.box, st.el.getBoundingClientRect(), 1);
      }
      Swarm.active = Swarm.active.filter((st) => { const fin = stepLayer(st, Swarm.t); if (fin) { if (st.box) removeBox(st.box); } return !fin; });
      for (const st of Swarm.states) if (st.wire && !st.agent && st.box && st.el) placeBox(st.box, st.el.getBoundingClientRect(), 1);   // keep wire boxes glued to their element
      // joined agents come online
      Swarm.agents.forEach((a) => { if (!a.joined && S.agentJoins[a.i] <= Swarm.t) { a.joined = true; a.el.style.display = ''; a.x = innerWidth - 40; a.y = -20; a.home = [0.75, 0.2]; } });
      Swarm.agents.forEach((a) => {
        if (!a.joined) return;
        if (a.tween) { const e = easeOutCubic(clamp((Swarm.t - a.tween.t0) / a.tween.dur, 0, 1)); a.x = lerp(a.tween.fx, a.tween.tx, e); a.y = lerp(a.tween.fy, a.tween.ty, e); if (e >= 1) a.tween = null; }
        else if (!a.task) idleDrift(a, k);
        drawAgent(a);
      });
      guides(); sweeps(); tour(dtReal);
      if (Swarm.eventIdx >= Swarm.events.length && Swarm.layerIdx >= Swarm.states.length && Swarm.active.length === 0 && Swarm.built >= Swarm.total) startFinale();
    } else if (Swarm.state === 'finale') {
      Swarm.t += dt; finaleStep(dtReal);
    }
    Swarm.onTick && Swarm.onTick(Swarm);
    if (Swarm.state === 'building' || Swarm.state === 'finale') Swarm._raf = requestAnimationFrame(frame);
  }

  function guides() {
    Swarm.guides.forEach((o) => {
      const anchor = o.sec && (o.sec.querySelector('[data-guide-anchor]') || o.sec);
      const x = anchor ? anchor.getBoundingClientRect().left : 40;
      o.el.style.transform = `translate3d(${Math.round(x)}px,0,0)`;
    });
  }
  function sweeps() {
    Swarm.sweeps = Swarm.sweeps.filter((s) => {
      const p = clamp((Swarm.t - s.t0) / s.dur, 0, 1);
      const r = s.sec.getBoundingClientRect();
      s.el.style.transform = `translate3d(0,${clamp(r.bottom - 2, 0, innerHeight - 2)}px,0)`;
      s.el.firstChild.style.transform = `translate3d(${p * innerWidth}px,0,0)`;
      s.el.style.opacity = p < 1 ? '1' : '0';
      if (p >= 1 && Swarm.t - s.t0 > s.dur + 0.3) { s.el.remove(); return false; }
      return true;
    });
  }
  function tour(dtReal) {                      // auto-scroll ("Touring"): keep the build front in the upper third of the screen
    if (!Swarm.tour) return;
    let front = null;
    for (const st of Swarm.active) { if (!st.el) continue; const y = st.el.getBoundingClientRect().top + scrollY; if (front === null || y < front) front = y; }
    if (front === null) { const nx = Swarm.states[Swarm.layerIdx]; if (nx && nx.el) front = nx.el.getBoundingClientRect().top + scrollY; }
    if (front === null) return;
    const target = Math.max(0, front - innerHeight * 0.32);
    const t = Swarm.t; if (t < 3.9) { scrollTo(0, 0); return; }            // the hero is built without scrolling
    scrollTo(0, scrollY + (target - scrollY) * Math.min(1, dtReal * 3.2 * Math.min(Swarm.speed, 2)));
  }

  /* ------------------------------------------------------------ finale: cursors lift off and orbit the featured card + the top-right corner */
  function startFinale() {
    Swarm.elapsedWall = (performance.now() - Swarm.startedWall) / 1000;
    document.documentElement.classList.remove('is-building', 'show-rulers');
    Swarm.guides.forEach((o) => { o.el.classList.add('fade-out'); setTimeout(() => o.el.remove(), 400); }); Swarm.guides.clear();
    window.SwarmSound && SwarmSound.chime();
    Swarm.finaleT0 = Swarm.t; setState('finale');
    const card = document.querySelector(`[data-layer-id="${S.finale.target}"]`);
    Swarm.finaleCard = card;
    Swarm.agents.forEach((a, i) => { a.orbit = { which: i % 3 === 0 ? 'corner' : 'card', theta: rand() * 6.28, radius: 110 + (i % 4) * 38, spd: 0.03 + (i % 3) * 0.006 }; a.task = null; a.tween = null; a.mode = 'arrow'; });
  }
  function finaleStep(dtReal) {
    const card = Swarm.finaleCard;
    if (card && Swarm.tour) {                    // bring the card into view
      const r = card.getBoundingClientRect(); const target = scrollY + r.top + r.height / 2 - innerHeight / 2;
      scrollTo(0, scrollY + (target - scrollY) * Math.min(1, dtReal * 2.5));
    }
    const r = card ? card.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const ccx = r.left + r.width / 2, ccy = r.top + r.height / 2, tcx = innerWidth - 70, tcy = 80;
    const breathe = 1 + 0.25 * Math.sin((Swarm.t - Swarm.finaleT0) * 1.4);
    Swarm.agents.forEach((a) => {
      const o = a.orbit; if (!o) return;
      o.theta += o.spd * dtReal * 60;
      const cx = o.which === 'card' ? ccx : tcx, cy = o.which === 'card' ? ccy : tcy, rad = o.radius * (o.which === 'card' ? breathe : 0.55);
      const tx = cx + Math.cos(o.theta) * rad, ty = cy + Math.sin(o.theta) * rad * 0.7;
      a.x += (tx - a.x) * Math.min(1, dtReal * 6); a.y += (ty - a.y) * Math.min(1, dtReal * 6);   // glide onto the ring, then follow it
      a.rot = (o.theta * 180) / Math.PI + 225;                                                   // arrow tangent to the circle
      drawAgent(a);
    });
  }

  /* ------------------------------------------------------------ public controls (used by hud.js) */
  Swarm.setSpeed = (s) => { Swarm.speed = s; };
  Swarm.toggleTour = () => { Swarm.tour = !Swarm.tour; return Swarm.tour; };
  Swarm.finishAll = function () {              // instantly show everything (✕ / skip / reduced motion)
    cancelAnimationFrame(Swarm._raf);
    (Swarm.states.length ? Swarm.states : (Swarm.init(), Swarm.states)).forEach((st) => {
      if (st.el) { if (st.L.k === 'text') st.el.textContent = st.el.dataset.full; st.el.classList.add('is-built'); delete st.el.dataset.phase; }
      if (st.box) removeBox(st.box);
    });
    [...Swarm.boxes].forEach(removeBox);
    document.querySelectorAll('.swarm-guide,.swarm-sweep').forEach((n) => n.remove());
    document.documentElement.classList.remove('is-building', 'show-rulers', 'flash-bars');
    Swarm.agents.forEach((a) => a.el.remove()); Swarm.agents = [];
    Swarm.built = Swarm.total; setState('live');
  };
  Swarm.goLive = function () {                 // "Go live": cursors fly off to the top-right and disappear
    Swarm.agents.forEach((a) => { a.el.style.transition = 'transform .8s cubic-bezier(.65,0,.35,1), opacity .8s'; a.el.style.transform = `translate3d(${innerWidth + 60}px,-60px,0)`; a.el.style.opacity = '0'; });
    setTimeout(() => { Swarm.finishAll(); }, 850);
  };
  Swarm.replay = function () {
    Swarm.states.forEach((st) => { if (st.el) { st.el.classList.remove('is-built', 'reveal-blur'); st.el.textContent = st.el.dataset.full; } });
    Swarm.finishAllReset && Swarm.finishAllReset();
    cancelAnimationFrame(Swarm._raf);
    [...Swarm.boxes].forEach(removeBox); Swarm.root.innerHTML = '';
    Swarm.states.forEach((st) => { st.box = null; st.agent = null; st.done = false; st.wire = false; st.phase = 0; });
    Swarm.start();
  };
  window.Swarm = Swarm;
})();
```

**FILE: js/hud.js**
```js
/* js/hud.js — bottom control bar. Reads Swarm state every tick, wires the buttons to the Swarm controls. */
(function () {
  const hud = document.getElementById('hud'); if (!hud) return;
  const $ = (s) => hud.querySelector(s);
  const agentsEl = $('[data-bind="agents"]'), layersEl = $('[data-bind="layers"]'), fill = $('.track b'), doneEl = $('[data-bind="done"]');
  const tourBtns = hud.querySelectorAll('[data-act="tour"]'), speedBtns = hud.querySelectorAll('[data-act="speed"]');
  const speeds = [1, 2, 4, 0.5];
  Swarm.onTick = (s) => {
    const joined = s.agents.filter((a) => a.joined).length;
    if (s.state === 'building') {
      hud.dataset.state = s.t < 0.8 ? 'scanning' : 'building';
      agentsEl.textContent = `${joined} agents`;
      layersEl.textContent = `${s.built} / ${s.total} layers`;
      fill.style.width = `${(s.built / s.total) * 100}%`;
      tourBtns.forEach((b) => { b.textContent = s.tour ? 'Touring' : 'Tour'; b.classList.toggle('pill-blue', s.tour); b.classList.toggle('ghost', !s.tour); });
    } else if (s.state === 'finale') {
      hud.dataset.state = 'done';
      doneEl.textContent = `Rebuilt by ${joined} agents in ${s.elapsedWall.toFixed(1)}s`;
    }
  };
  document.addEventListener('swarmstate', (e) => { if (e.detail === 'live') hud.dataset.state = 'gone'; });   // main.js listens to the same event
  hud.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act;
    if (act === 'tour') Swarm.toggleTour();
    else if (act === 'speed') { const i = (speeds.indexOf(Swarm.speed) + 1) % speeds.length; Swarm.setSpeed(speeds[i]); speedBtns.forEach((x) => { x.textContent = speeds[i] + 'x'; }); }
    else if (act === 'sound') { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '🔊' : '🔇'; window.SwarmSound && SwarmSound.set(on); }
    else if (act === 'close') Swarm.finishAll();
    else if (act === 'live') Swarm.goLive();
    else if (act === 'replay') Swarm.replay();
  });
  // a manual wheel / touch / key scroll pauses the auto tour (the pill turns into the ghost "Tour" button)
  ['wheel', 'touchstart', 'keydown'].forEach((ev) => addEventListener(ev, (e) => { if (Swarm.state === 'building' && (ev !== 'keydown' || ['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))) Swarm.tour = false; }, { passive: true }));
})();
```

The matching HUD markup is already inside `index.html` (Part 9, near the end of `<body>`): `#swarm-bars`, `#swarm-rulers`, `#swarm-root`, `#hud`.

### 5.8 The choreography table (VERBATIM — create `js/swarm-script.js` exactly)

**FILE: js/swarm-script.js**
```js
/* js/swarm-script.js — GENERATED choreography. Do not hand-edit. Times are seconds at 1x speed.
   layer: id = data-layer-id in index.html · a = agent index (0-29) · k = layer type · tw = wireframe box appears (hero only)
   t = [t0 agent leaves + flies, t1 arrives at top-left, t2 box dragged, t3 typed/filled (agent free), t4 box faded] */
const SWARM_SCRIPT = Object.assign({"version":1,"duration":51.36,"total":364,"agentCount":30,"agentJoins":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,6.0,9.5,10.5,11.2,12.0,17.0,21.0,25.0,28.0,31.0,39.0,48.0],"colors":["#5eead4","#fb923c","#ffffff","#a78bfa","#7dd3fc","#fda4af","#fcd34d","#86efac"],"groups":{"hero":{"ws":1.2,"we":4.3,"sel":"#home"},"work.head":{"ws":3.9,"we":8.0,"sel":"#work"},"work.cards":{"ws":8.0,"we":12.0,"sel":"#work"},"tech":{"ws":12.0,"we":15.0,"sel":"#tech"},"highlights":{"ws":15.0,"we":22.0,"sel":"#highlights"},"raw":{"ws":22.0,"we":28.0,"sel":"#raw"},"about":{"ws":28.0,"we":38.0,"sel":"#about"},"journey":{"ws":38.0,"we":45.0,"sel":"#journey"},"contact":{"ws":45.0,"we":49.4,"sel":"#contact"},"footer":{"ws":49.4,"we":51.52,"sel":"#footer"}},"events":[{"t":0.0,"e":"hud","state":"scanning"},{"t":0.0,"e":"flocks","clusters":[[0.35,0.6],[0.65,0.45]]},{"t":0.8,"e":"scatter"},{"t":0.8,"e":"rulers","on":true},{"t":0.8,"e":"topbar-flash","ms":400},{"t":0.8,"e":"hud","state":"building"},{"t":1.2,"e":"guide","on":true,"sel":"#home"},{"t":3.9,"e":"rulers","on":false},{"t":3.9,"e":"guide","on":true,"sel":"#work"},{"t":4.3,"e":"sweep","sel":"#home"},{"t":4.7,"e":"guide","on":false,"sel":"#home"},{"t":12.0,"e":"rulers","on":true},{"t":12.0,"e":"guide","on":true,"sel":"#tech"},{"t":12.0,"e":"sweep","sel":"#work"},{"t":12.4,"e":"guide","on":false,"sel":"#work"},{"t":13.2,"e":"rulers","on":false},{"t":15.0,"e":"rulers","on":true},{"t":15.0,"e":"guide","on":true,"sel":"#highlights"},{"t":15.0,"e":"sweep","sel":"#tech"},{"t":15.4,"e":"guide","on":false,"sel":"#tech"},{"t":16.2,"e":"rulers","on":false},{"t":22.0,"e":"rulers","on":true},{"t":22.0,"e":"guide","on":true,"sel":"#raw"},{"t":22.0,"e":"sweep","sel":"#highlights"},{"t":22.4,"e":"guide","on":false,"sel":"#highlights"},{"t":23.2,"e":"rulers","on":false},{"t":28.0,"e":"rulers","on":true},{"t":28.0,"e":"guide","on":true,"sel":"#about"},{"t":28.0,"e":"sweep","sel":"#raw"},{"t":28.4,"e":"guide","on":false,"sel":"#raw"},{"t":29.2,"e":"rulers","on":false},{"t":38.0,"e":"rulers","on":true},{"t":38.0,"e":"guide","on":true,"sel":"#journey"},{"t":38.0,"e":"sweep","sel":"#about"},{"t":38.4,"e":"guide","on":false,"sel":"#about"},{"t":39.2,"e":"rulers","on":false},{"t":45.0,"e":"rulers","on":true},{"t":45.0,"e":"guide","on":true,"sel":"#contact"},{"t":45.0,"e":"sweep","sel":"#journey"},{"t":45.4,"e":"guide","on":false,"sel":"#journey"},{"t":46.2,"e":"rulers","on":false},{"t":49.4,"e":"rulers","on":true},{"t":49.4,"e":"guide","on":true,"sel":"#footer"},{"t":49.4,"e":"sweep","sel":"#contact"},{"t":49.8,"e":"guide","on":false,"sel":"#contact"},{"t":50.6,"e":"rulers","on":false},{"t":51.52,"e":"sweep","sel":"#footer"},{"t":51.92,"e":"guide","on":false,"sel":"#footer"}],"finale":{"target":"ct.card","ms":4200,"secondTarget":"corner-tr"}}, { layers: [
  {"id":"nav.bar","a":0,"k":"shape","g":"hero","tw":1.2,"t":[1.2,1.539,1.695,1.875,2.007]},
  {"id":"nav.logo","a":1,"k":"text","g":"hero","tw":1.218,"t":[1.2,1.649,1.805,1.955,2.087]},
  {"id":"nav.dot","a":2,"k":"shape","g":"hero","tw":1.236,"t":[1.2,1.474,1.63,1.81,1.942]},
  {"id":"nav.link.1","a":3,"k":"text","g":"hero","tw":1.253,"t":[1.2,1.518,1.674,1.824,1.956]},
  {"id":"nav.link.2","a":4,"k":"text","g":"hero","tw":1.271,"t":[1.2,1.668,1.824,2.038,2.17]},
  {"id":"nav.link.3","a":5,"k":"text","g":"hero","tw":1.289,"t":[1.2,1.482,1.638,1.788,1.92]},
  {"id":"nav.link.4","a":6,"k":"text","g":"hero","tw":1.307,"t":[1.2,1.563,1.719,1.869,2.001]},
  {"id":"nav.link.5","a":7,"k":"text","g":"hero","tw":1.324,"t":[1.2,1.677,1.833,1.983,2.115]},
  {"id":"nav.motion","a":8,"k":"text","g":"hero","tw":1.342,"t":[1.2,1.694,1.85,2.033,2.165]},
  {"id":"nav.talk","a":9,"k":"text","g":"hero","tw":1.36,"t":[1.2,1.661,1.817,2.011,2.143]},
  {"id":"hero.word","a":10,"k":"shape","g":"hero","tw":1.376,"t":[1.2,1.496,1.652,1.832,1.964]},
  {"id":"hero.photo","a":11,"k":"image","g":"hero","tw":1.396,"t":[1.2,1.696,1.852,2.422,2.554]},
  {"id":"hero.photo.glow","a":12,"k":"shape","g":"hero","tw":1.365,"t":[1.2,1.485,1.641,1.821,1.953]},
  {"id":"hero.tag.1","a":13,"k":"text","g":"hero","tw":1.431,"t":[1.2,1.584,1.74,2.393,2.525]},
  {"id":"hero.tag.2","a":14,"k":"text","g":"hero","tw":1.435,"t":[1.2,1.555,1.711,1.997,2.129]},
  {"id":"hero.tag.avail","a":15,"k":"text","g":"hero","tw":1.467,"t":[1.2,1.709,1.865,2.122,2.254]},
  {"id":"hero.hello","a":16,"k":"text","g":"hero","tw":1.435,"t":[1.2,1.555,1.711,1.949,2.081]},
  {"id":"hero.name","a":17,"k":"text","g":"hero","tw":1.455,"t":[1.2,1.575,1.731,1.895,2.027]},
  {"id":"hero.role.1","a":5,"k":"text","g":"hero","tw":1.52,"t":[1.788,2.073,2.229,2.555,2.687]},
  {"id":"hero.role.2","a":2,"k":"text","g":"hero","tw":1.538,"t":[1.81,2.238,2.394,2.575,2.707]},
  {"id":"hero.intro","a":12,"k":"text","g":"hero","tw":1.556,"t":[1.821,2.1,2.256,3.71,3.842]},
  {"id":"hero.cta","a":3,"k":"shape","g":"hero","tw":1.573,"t":[1.824,2.089,2.245,2.425,2.557]},
  {"id":"hero.cta.label","a":10,"k":"text","g":"hero","tw":1.591,"t":[1.832,2.231,2.387,2.618,2.75]},
  {"id":"hero.loc.icon","a":6,"k":"shape","g":"hero","tw":1.609,"t":[1.869,2.146,2.302,2.482,2.614]},
  {"id":"hero.loc","a":0,"k":"text","g":"hero","tw":1.627,"t":[1.875,2.275,2.431,2.785,2.917]},
  {"id":"hero.demo.btn","a":17,"k":"shape","g":"hero","tw":1.644,"t":[1.895,2.326,2.482,2.662,2.794]},
  {"id":"hero.demo.1","a":16,"k":"text","g":"hero","tw":1.662,"t":[1.949,2.229,2.385,2.586,2.718]},
  {"id":"hero.demo.2","a":1,"k":"text","g":"hero","tw":1.68,"t":[1.955,2.407,2.563,2.817,2.949]},
  {"id":"hero.tagline.icon","a":7,"k":"shape","g":"hero","tw":1.698,"t":[1.983,2.266,2.422,2.602,2.734]},
  {"id":"hero.tagline.1","a":14,"k":"text","g":"hero","tw":1.716,"t":[1.997,2.495,2.651,2.976,3.108]},
  {"id":"hero.tagline.2","a":9,"k":"text","g":"hero","tw":1.733,"t":[2.011,2.395,2.551,3.033,3.165]},
  {"id":"hero.accent","a":8,"k":"shape","g":"hero","tw":1.751,"t":[2.033,2.291,2.447,2.627,2.759]},
  {"id":"hero.avail.dot","a":4,"k":"shape","g":"hero","tw":1.769,"t":[2.038,2.423,2.579,2.759,2.891]},
  {"id":"hero.stat.1.num","a":15,"k":"text","g":"hero","tw":1.787,"t":[2.122,2.433,2.589,2.739,2.871]},
  {"id":"hero.stat.1.label","a":13,"k":"text","g":"hero","tw":1.804,"t":[2.393,2.684,2.84,3.526,3.658]},
  {"id":"hero.stat.1.rule","a":11,"k":"shape","g":"hero","tw":1.822,"t":[2.422,2.69,2.846,3.026,3.158]},
  {"id":"hero.stat.2.num","a":3,"k":"text","g":"hero","tw":1.84,"t":[2.425,2.793,2.949,3.099,3.231]},
  {"id":"hero.stat.2.label","a":6,"k":"text","g":"hero","tw":1.858,"t":[2.482,2.757,2.913,3.311,3.443]},
  {"id":"hero.stat.2.rule","a":5,"k":"shape","g":"hero","tw":1.876,"t":[2.555,3.01,3.166,3.346,3.478]},
  {"id":"hero.stat.3.num","a":2,"k":"text","g":"hero","tw":1.893,"t":[2.575,2.887,3.043,3.193,3.325]},
  {"id":"hero.stat.3.label","a":16,"k":"text","g":"hero","tw":1.911,"t":[2.586,3.095,3.251,3.965,4.097]},
  {"id":"hero.stat.3.rule","a":7,"k":"shape","g":"hero","tw":1.929,"t":[2.602,3.003,3.159,3.339,3.471]},
  {"id":"hero.cv","a":10,"k":"text","g":"hero","tw":1.947,"t":[2.618,3.088,3.244,3.547,3.679]},
  {"id":"hero.scroll","a":8,"k":"text","g":"hero","tw":1.964,"t":[2.627,3.141,3.297,3.702,3.834]},
  {"id":"hero.range","a":17,"k":"text","g":"hero","tw":1.982,"t":[2.662,3.011,3.167,3.757,3.889]},
  {"id":"hero.rule","a":15,"k":"shape","g":"hero","tw":2.0,"t":[2.739,3.037,3.193,3.373,3.505]},
  {"id":"work.rule","a":0,"k":"shape","g":"work.head","t":[3.9,4.467,4.727,5.027,5.247]},
  {"id":"work.eyebrow","a":1,"k":"text","g":"work.head","t":[4.028,4.597,4.857,5.488,5.708]},
  {"id":"work.title","a":2,"k":"text","g":"work.head","t":[4.155,4.586,4.846,5.501,5.721]},
  {"id":"work.all","a":3,"k":"text","g":"work.head","t":[4.283,4.901,5.161,5.479,5.699]},
  {"id":"work.tab.1","a":4,"k":"text","g":"work.head","t":[4.41,5.143,5.403,5.653,5.873]},
  {"id":"work.tab.2","a":5,"k":"text","g":"work.head","t":[4.538,5.155,5.415,5.67,5.89]},
  {"id":"work.tab.3","a":6,"k":"text","g":"work.head","t":[4.666,5.222,5.482,5.893,6.113]},
  {"id":"work.tab.4","a":7,"k":"text","g":"work.head","t":[4.793,5.62,5.88,6.13,6.35]},
  {"id":"work.tab.5","a":8,"k":"text","g":"work.head","t":[4.921,5.347,5.607,5.857,6.077]},
  {"id":"work.tab.6","a":0,"k":"text","g":"work.head","t":[5.048,5.833,6.093,6.343,6.563]},
  {"id":"work.tab.7","a":9,"k":"text","g":"work.head","t":[5.176,5.727,5.987,6.335,6.555]},
  {"id":"work.tab.8","a":10,"k":"text","g":"work.head","t":[5.304,5.914,6.174,6.492,6.712]},
  {"id":"work.tab.line","a":11,"k":"shape","g":"work.head","t":[5.431,5.911,6.171,6.471,6.691]},
  {"id":"work.search.icon","a":1,"k":"shape","g":"work.head","t":[5.559,6.017,6.277,6.577,6.797]},
  {"id":"work.search","a":2,"k":"text","g":"work.head","t":[5.686,6.426,6.686,7.66,7.88]},
  {"id":"work.search.rule","a":3,"k":"shape","g":"work.head","t":[5.814,6.651,6.911,7.211,7.431]},
  {"id":"work.tabs.rule","a":4,"k":"shape","g":"work.head","t":[5.942,6.591,6.851,7.151,7.371]},
  {"id":"work.card.1","a":18,"k":"card","g":"work.cards","t":[8.0,8.709,8.969,9.369,9.589]},
  {"id":"work.card.1.img","a":0,"k":"image","g":"work.cards","t":[8.09,8.868,9.128,10.078,10.298]},
  {"id":"work.card.1.tag","a":1,"k":"text","g":"work.cards","t":[8.181,8.719,8.979,9.482,9.702]},
  {"id":"work.card.1.chip.rule","a":2,"k":"shape","g":"work.cards","t":[8.271,8.786,9.046,9.346,9.566]},
  {"id":"work.card.1.num","a":3,"k":"text","g":"work.cards","t":[8.362,9.132,9.392,9.642,9.862]},
  {"id":"work.card.1.title","a":4,"k":"text","g":"work.cards","t":[8.452,8.994,9.254,10.03,10.25]},
  {"id":"work.card.1.meta","a":5,"k":"text","g":"work.cards","t":[8.543,9.106,9.366,9.772,9.992]},
  {"id":"work.card.1.arrow","a":6,"k":"shape","g":"work.cards","t":[8.633,9.268,9.528,9.828,10.048]},
  {"id":"work.card.2","a":7,"k":"card","g":"work.cards","t":[8.724,9.39,9.65,10.05,10.27]},
  {"id":"work.card.2.img","a":8,"k":"image","g":"work.cards","t":[8.814,9.482,9.742,10.692,10.912]},
  {"id":"work.card.2.tag","a":9,"k":"text","g":"work.cards","t":[8.905,9.68,9.94,10.524,10.744]},
  {"id":"work.card.2.chip.rule","a":10,"k":"shape","g":"work.cards","t":[8.995,9.733,9.993,10.293,10.513]},
  {"id":"work.card.2.num","a":11,"k":"text","g":"work.cards","t":[9.086,9.843,10.103,10.353,10.573]},
  {"id":"work.card.2.title","a":12,"k":"text","g":"work.cards","t":[9.176,9.66,9.92,10.925,11.145]},
  {"id":"work.card.2.meta","a":13,"k":"text","g":"work.cards","t":[9.267,9.833,10.093,10.534,10.754]},
  {"id":"work.card.2.arrow","a":2,"k":"shape","g":"work.cards","t":[9.357,10.0,10.26,10.56,10.78]},
  {"id":"work.card.3","a":14,"k":"card","g":"work.cards","t":[9.447,9.939,10.199,10.599,10.819]},
  {"id":"work.card.3.img","a":19,"k":"image","g":"work.cards","t":[9.538,10.185,10.445,11.395,11.615]},
  {"id":"work.card.3.tag","a":1,"k":"text","g":"work.cards","t":[9.628,10.362,10.622,11.06,11.28]},
  {"id":"work.card.3.chip.rule","a":3,"k":"shape","g":"work.cards","t":[9.719,10.413,10.673,10.973,11.193]},
  {"id":"work.card.3.num","a":5,"k":"text","g":"work.cards","t":[9.809,10.651,10.911,11.161,11.381]},
  {"id":"work.card.3.title","a":6,"k":"text","g":"work.cards","t":[9.9,10.391,10.651,11.481,11.701]},
  {"id":"work.card.3.meta","a":15,"k":"text","g":"work.cards","t":[9.99,10.55,10.81,11.368,11.588]},
  {"id":"work.card.3.arrow","a":0,"k":"shape","g":"work.cards","t":[10.081,10.513,10.773,11.073,11.293]},
  {"id":"work.prev","a":4,"k":"shape","g":"work.cards","t":[10.171,10.693,10.953,11.253,11.473]},
  {"id":"work.next","a":7,"k":"shape","g":"work.cards","t":[10.262,11.073,11.333,11.633,11.853]},
  {"id":"work.dots","a":10,"k":"shape","g":"work.cards","t":[10.352,10.897,11.157,11.457,11.677]},
  {"id":"work.count","a":11,"k":"text","g":"work.cards","t":[10.443,11.008,11.268,11.66,11.88]},
  {"id":"tech.rule","a":20,"k":"shape","g":"tech","t":[12.0,12.547,12.807,13.107,13.327]},
  {"id":"tech.label.1","a":21,"k":"text","g":"tech","t":[12.114,12.605,12.865,13.27,13.49]},
  {"id":"tech.label.2","a":22,"k":"text","g":"tech","t":[12.228,12.696,12.956,13.452,13.672]},
  {"id":"tech.fade.l","a":0,"k":"shape","g":"tech","t":[12.342,13.04,13.3,13.6,13.82]},
  {"id":"tech.fade.r","a":1,"k":"shape","g":"tech","t":[12.456,13.083,13.343,13.643,13.863]},
  {"id":"tech.tile.1","a":2,"k":"logo","g":"tech","t":[12.57,13.11,13.37,13.67,13.89]},
  {"id":"tech.tile.2","a":3,"k":"logo","g":"tech","t":[12.684,13.122,13.382,13.682,13.902]},
  {"id":"tech.tile.3","a":4,"k":"logo","g":"tech","t":[12.798,13.496,13.756,14.056,14.276]},
  {"id":"tech.tile.4","a":5,"k":"logo","g":"tech","t":[12.912,13.531,13.791,14.091,14.311]},
  {"id":"tech.tile.5","a":6,"k":"logo","g":"tech","t":[13.026,13.886,14.146,14.446,14.666]},
  {"id":"tech.tile.6","a":7,"k":"logo","g":"tech","t":[13.14,13.723,13.983,14.283,14.503]},
  {"id":"tech.tile.7","a":8,"k":"logo","g":"tech","t":[13.254,13.785,14.045,14.345,14.565]},
  {"id":"tech.tile.8","a":9,"k":"logo","g":"tech","t":[13.368,14.1,14.36,14.66,14.88]},
  {"id":"tech.tile.9","a":10,"k":"logo","g":"tech","t":[13.482,13.903,14.163,14.463,14.683]},
  {"id":"hl.panel","a":0,"k":"shape","g":"highlights","t":[15.0,15.867,16.127,16.427,16.647]},
  {"id":"hl.eyebrow","a":1,"k":"text","g":"highlights","t":[15.082,15.842,16.102,16.64,16.86]},
  {"id":"hl.panel.glow","a":2,"k":"shape","g":"highlights","t":[15.165,15.984,16.244,16.544,16.764]},
  {"id":"hl.title.1","a":3,"k":"text","g":"highlights","t":[15.247,16.115,16.375,16.745,16.965]},
  {"id":"hl.title.2","a":4,"k":"text","g":"highlights","t":[15.329,15.862,16.122,16.429,16.649]},
  {"id":"hl.laurel.l","a":5,"k":"shape","g":"highlights","t":[15.412,16.032,16.292,16.592,16.812]},
  {"id":"hl.big","a":6,"k":"text","g":"highlights","t":[15.494,16.244,16.504,16.754,16.974]},
  {"id":"hl.laurel.r","a":7,"k":"shape","g":"highlights","t":[15.576,16.051,16.311,16.611,16.831]},
  {"id":"hl.caption","a":8,"k":"text","g":"highlights","t":[15.659,16.181,16.441,17.077,17.297]},
  {"id":"hl.text","a":9,"k":"text","g":"highlights","t":[15.741,16.478,16.738,18.836,19.056]},
  {"id":"hl.link","a":10,"k":"text","g":"highlights","t":[15.823,16.314,16.574,17.037,17.257]},
  {"id":"hl.list.title","a":11,"k":"text","g":"highlights","t":[15.906,16.581,16.841,17.543,17.763]},
  {"id":"hl.list.range","a":12,"k":"text","g":"highlights","t":[15.988,16.441,16.701,17.417,17.637]},
  {"id":"hl.row.1.rule","a":13,"k":"shape","g":"highlights","t":[16.07,16.826,17.086,17.386,17.606]},
  {"id":"hl.row.1.idx","a":14,"k":"text","g":"highlights","t":[16.153,16.724,16.984,17.234,17.454]},
  {"id":"hl.row.1.title","a":15,"k":"text","g":"highlights","t":[16.235,16.741,17.001,18.349,18.569]},
  {"id":"hl.row.1.sub","a":16,"k":"text","g":"highlights","t":[16.318,17.075,17.335,19.287,19.507]},
  {"id":"hl.row.1.metric","a":17,"k":"text","g":"highlights","t":[16.4,17.119,17.379,17.629,17.849]},
  {"id":"hl.row.1.arrow","a":0,"k":"shape","g":"highlights","t":[16.482,17.087,17.347,17.647,17.867]},
  {"id":"hl.row.2.rule","a":2,"k":"shape","g":"highlights","t":[16.565,17.32,17.58,17.88,18.1]},
  {"id":"hl.row.2.idx","a":1,"k":"text","g":"highlights","t":[16.647,17.502,17.762,18.012,18.232]},
  {"id":"hl.row.2.title","a":4,"k":"text","g":"highlights","t":[16.729,17.289,17.549,18.12,18.34]},
  {"id":"hl.row.2.sub","a":3,"k":"text","g":"highlights","t":[16.812,17.388,17.648,20.035,20.255]},
  {"id":"hl.row.2.metric","a":5,"k":"text","g":"highlights","t":[16.894,17.734,17.994,18.244,18.464]},
  {"id":"hl.row.2.arrow","a":6,"k":"shape","g":"highlights","t":[16.976,17.656,17.916,18.216,18.436]},
  {"id":"hl.row.3.rule","a":23,"k":"shape","g":"highlights","t":[17.059,17.852,18.112,18.412,18.632]},
  {"id":"hl.row.3.idx","a":7,"k":"text","g":"highlights","t":[17.141,17.754,18.014,18.264,18.484]},
  {"id":"hl.row.3.title","a":8,"k":"text","g":"highlights","t":[17.223,17.998,18.258,19.525,19.745]},
  {"id":"hl.row.3.sub","a":10,"k":"text","g":"highlights","t":[17.306,17.917,18.177,20.384,20.604]},
  {"id":"hl.row.3.metric","a":13,"k":"text","g":"highlights","t":[17.388,17.924,18.184,18.434,18.654]},
  {"id":"hl.row.3.arrow","a":12,"k":"shape","g":"highlights","t":[17.47,17.962,18.222,18.522,18.742]},
  {"id":"hl.row.4.rule","a":11,"k":"shape","g":"highlights","t":[17.553,18.026,18.286,18.586,18.806]},
  {"id":"hl.row.4.idx","a":14,"k":"text","g":"highlights","t":[17.635,18.267,18.527,18.777,18.997]},
  {"id":"hl.row.4.title","a":0,"k":"text","g":"highlights","t":[17.717,18.256,18.516,19.096,19.316]},
  {"id":"hl.row.4.sub","a":17,"k":"text","g":"highlights","t":[17.8,18.483,18.743,21.176,21.396]},
  {"id":"hl.row.4.metric","a":2,"k":"text","g":"highlights","t":[17.882,18.456,18.716,18.966,19.186]},
  {"id":"hl.row.4.arrow","a":18,"k":"shape","g":"highlights","t":[17.964,18.636,18.896,19.196,19.416]},
  {"id":"hl.row.5.rule","a":1,"k":"shape","g":"highlights","t":[18.047,18.531,18.791,19.091,19.311]},
  {"id":"hl.row.5.idx","a":4,"k":"text","g":"highlights","t":[18.129,18.68,18.94,19.19,19.41]},
  {"id":"hl.row.5.title","a":19,"k":"text","g":"highlights","t":[18.211,18.743,19.003,19.79,20.01]},
  {"id":"hl.row.5.sub","a":5,"k":"text","g":"highlights","t":[18.294,18.743,19.003,20.753,20.973]},
  {"id":"hl.row.5.metric","a":6,"k":"text","g":"highlights","t":[18.376,19.09,19.35,19.6,19.82]},
  {"id":"hl.row.5.arrow","a":7,"k":"shape","g":"highlights","t":[18.458,19.114,19.374,19.674,19.894]},
  {"id":"hl.row.6.rule","a":12,"k":"shape","g":"highlights","t":[18.541,19.129,19.389,19.689,19.909]},
  {"id":"hl.row.6.idx","a":11,"k":"text","g":"highlights","t":[18.623,19.236,19.496,19.746,19.966]},
  {"id":"hl.row.6.title","a":13,"k":"text","g":"highlights","t":[18.705,19.283,19.543,20.414,20.634]},
  {"id":"hl.row.6.sub","a":14,"k":"text","g":"highlights","t":[18.788,19.317,19.577,21.66,21.88]},
  {"id":"hl.row.6.metric","a":9,"k":"text","g":"highlights","t":[18.87,19.386,19.646,19.896,20.116]},
  {"id":"hl.row.6.arrow","a":15,"k":"shape","g":"highlights","t":[18.953,19.497,19.757,20.057,20.277]},
  {"id":"hl.live.1","a":2,"k":"text","g":"highlights","t":[19.035,19.549,19.809,20.254,20.474]},
  {"id":"hl.live.2","a":0,"k":"text","g":"highlights","t":[19.117,19.808,20.068,20.525,20.745]},
  {"id":"hl.live.3","a":1,"k":"text","g":"highlights","t":[19.2,20.063,20.323,20.663,20.883]},
  {"id":"raw.eyebrow","a":24,"k":"text","g":"raw","t":[22.0,22.763,23.023,23.844,24.064]},
  {"id":"raw.title.1","a":0,"k":"text","g":"raw","t":[22.287,23.08,23.34,23.61,23.83]},
  {"id":"raw.title.2","a":1,"k":"text","g":"raw","t":[22.573,23.319,23.579,23.907,24.127]},
  {"id":"raw.text","a":2,"k":"text","g":"raw","t":[22.86,23.561,23.821,25.68,25.9]},
  {"id":"raw.meta.1","a":3,"k":"text","g":"raw","t":[23.147,24.007,24.267,24.852,25.072]},
  {"id":"raw.meta.2","a":4,"k":"text","g":"raw","t":[23.433,24.007,24.267,25.446,25.666]},
  {"id":"raw.stage","a":0,"k":"image","g":"raw","t":[23.72,24.321,24.581,25.531,25.751]},
  {"id":"raw.handle","a":1,"k":"shape","g":"raw","t":[24.007,24.8,25.06,25.36,25.58]},
  {"id":"raw.wire","a":5,"k":"image","g":"raw","t":[24.293,24.96,25.22,26.17,26.39]},
  {"id":"raw.final","a":6,"k":"image","g":"raw","t":[24.58,25.035,25.295,26.245,26.465]},
  {"id":"raw.divider","a":3,"k":"shape","g":"raw","t":[24.867,25.413,25.673,25.973,26.193]},
  {"id":"raw.label.1","a":25,"k":"text","g":"raw","t":[25.153,25.836,26.096,26.386,26.606]},
  {"id":"raw.label.2","a":1,"k":"text","g":"raw","t":[25.44,26.147,26.407,26.695,26.915]},
  {"id":"raw.hint","a":0,"k":"text","g":"raw","t":[25.727,26.546,26.806,27.66,27.88]},
  {"id":"about.rule","a":26,"k":"shape","g":"about","t":[28.0,28.635,28.895,29.195,29.415]},
  {"id":"about.eyebrow.rule","a":0,"k":"shape","g":"about","t":[28.105,28.556,28.816,29.116,29.336]},
  {"id":"about.eyebrow","a":1,"k":"text","g":"about","t":[28.211,28.668,28.928,29.567,29.787]},
  {"id":"about.title.1","a":2,"k":"text","g":"about","t":[28.316,29.167,29.427,29.896,30.116]},
  {"id":"about.title.2","a":3,"k":"text","g":"about","t":[28.421,29.177,29.437,29.968,30.188]},
  {"id":"about.text","a":4,"k":"text","g":"about","t":[28.526,29.192,29.452,31.914,32.134]},
  {"id":"edu.title","a":5,"k":"text","g":"about","t":[28.632,29.292,29.552,30.262,30.482]},
  {"id":"edu.label","a":6,"k":"text","g":"about","t":[28.737,29.422,29.682,29.967,30.187]},
  {"id":"edu.row.1.rule","a":7,"k":"shape","g":"about","t":[28.842,29.372,29.632,29.932,30.152]},
  {"id":"edu.row.1.title","a":8,"k":"text","g":"about","t":[28.948,29.55,29.81,30.06,30.28]},
  {"id":"edu.row.1.sub","a":9,"k":"text","g":"about","t":[29.053,29.88,30.14,31.448,31.668]},
  {"id":"edu.row.1.tag","a":0,"k":"text","g":"about","t":[29.158,29.661,29.921,30.171,30.391]},
  {"id":"edu.row.2.rule","a":10,"k":"shape","g":"about","t":[29.264,29.882,30.142,30.442,30.662]},
  {"id":"edu.row.2.title","a":11,"k":"text","g":"about","t":[29.369,30.081,30.341,31.032,31.252]},
  {"id":"edu.row.2.sub","a":12,"k":"text","g":"about","t":[29.474,30.186,30.446,32.621,32.841]},
  {"id":"edu.row.2.tag","a":1,"k":"text","g":"about","t":[29.579,30.197,30.457,30.778,30.998]},
  {"id":"edu.row.3.rule","a":13,"k":"shape","g":"about","t":[29.685,30.286,30.546,30.846,31.066]},
  {"id":"edu.row.3.title","a":14,"k":"text","g":"about","t":[29.79,30.275,30.535,30.793,31.013]},
  {"id":"edu.row.3.sub","a":15,"k":"text","g":"about","t":[29.895,30.505,30.765,31.53,31.75]},
  {"id":"toolkit.label","a":2,"k":"text","g":"about","t":[30.001,30.64,30.9,31.461,31.681]},
  {"id":"software.rail","a":3,"k":"shape","g":"about","t":[30.106,30.652,30.912,31.212,31.432]},
  {"id":"toolkit.chip.1","a":0,"k":"text","g":"about","t":[30.211,31.079,31.339,32.059,32.279]},
  {"id":"toolkit.chip.2","a":5,"k":"text","g":"about","t":[30.317,30.938,31.198,31.819,32.039]},
  {"id":"toolkit.chip.3","a":6,"k":"text","g":"about","t":[30.422,31.237,31.497,31.915,32.135]},
  {"id":"toolkit.chip.4","a":7,"k":"text","g":"about","t":[30.527,31.152,31.412,32.034,32.254]},
  {"id":"toolkit.chip.5","a":8,"k":"text","g":"about","t":[30.632,31.393,31.653,32.003,32.223]},
  {"id":"toolkit.chip.6","a":10,"k":"text","g":"about","t":[30.738,31.235,31.495,31.831,32.051]},
  {"id":"toolkit.chip.7","a":1,"k":"text","g":"about","t":[30.843,31.508,31.768,32.183,32.403]},
  {"id":"toolkit.chip.8","a":13,"k":"text","g":"about","t":[30.948,31.799,32.059,32.609,32.829]},
  {"id":"toolkit.chip.9","a":27,"k":"text","g":"about","t":[31.054,31.812,32.072,32.423,32.643]},
  {"id":"toolkit.chip.10","a":11,"k":"text","g":"about","t":[31.159,31.852,32.112,32.362,32.582]},
  {"id":"toolkit.chip.11","a":3,"k":"text","g":"about","t":[31.264,31.689,31.949,32.291,32.511]},
  {"id":"software.1","a":14,"k":"logo","g":"about","t":[31.37,32.166,32.426,32.726,32.946]},
  {"id":"software.2","a":2,"k":"logo","g":"about","t":[31.475,32.093,32.353,32.653,32.873]},
  {"id":"software.3","a":9,"k":"logo","g":"about","t":[31.58,32.115,32.375,32.675,32.895]},
  {"id":"software.4","a":15,"k":"logo","g":"about","t":[31.685,32.244,32.504,32.804,33.024]},
  {"id":"software.5","a":16,"k":"logo","g":"about","t":[31.791,32.266,32.526,32.826,33.046]},
  {"id":"software.6","a":5,"k":"logo","g":"about","t":[31.896,32.443,32.703,33.003,33.223]},
  {"id":"software.7","a":4,"k":"logo","g":"about","t":[32.001,32.617,32.877,33.177,33.397]},
  {"id":"software.8","a":0,"k":"logo","g":"about","t":[32.107,32.662,32.922,33.222,33.442]},
  {"id":"process.title","a":1,"k":"text","g":"about","t":[32.212,32.785,33.045,33.647,33.867]},
  {"id":"process.spine","a":3,"k":"shape","g":"about","t":[32.317,32.864,33.124,33.424,33.644]},
  {"id":"process.1.num","a":6,"k":"text","g":"about","t":[32.422,32.936,33.196,33.446,33.666]},
  {"id":"process.1.line","a":7,"k":"shape","g":"about","t":[32.528,32.986,33.246,33.546,33.766]},
  {"id":"process.1.node","a":8,"k":"shape","g":"about","t":[32.633,33.145,33.405,33.705,33.925]},
  {"id":"process.1.title","a":2,"k":"text","g":"about","t":[32.738,33.565,33.825,34.127,34.347]},
  {"id":"process.1.text","a":9,"k":"text","g":"about","t":[32.844,33.492,33.752,35.876,36.096]},
  {"id":"process.2.num","a":10,"k":"text","g":"about","t":[32.949,33.601,33.861,34.111,34.331]},
  {"id":"process.2.line","a":5,"k":"shape","g":"about","t":[33.054,33.654,33.914,34.214,34.434]},
  {"id":"process.2.node","a":11,"k":"shape","g":"about","t":[33.16,33.72,33.98,34.28,34.5]},
  {"id":"process.2.title","a":0,"k":"text","g":"about","t":[33.265,34.126,34.386,34.688,34.908]},
  {"id":"process.2.text","a":4,"k":"text","g":"about","t":[33.37,33.934,34.194,36.017,36.237]},
  {"id":"process.3.num","a":3,"k":"text","g":"about","t":[33.475,34.274,34.534,34.784,35.004]},
  {"id":"process.3.line","a":6,"k":"shape","g":"about","t":[33.581,34.211,34.471,34.771,34.991]},
  {"id":"process.3.node","a":1,"k":"shape","g":"about","t":[33.686,34.118,34.378,34.678,34.898]},
  {"id":"process.3.title","a":7,"k":"text","g":"about","t":[33.791,34.63,34.89,35.266,35.486]},
  {"id":"process.3.text","a":8,"k":"text","g":"about","t":[33.897,34.435,34.695,37.069,37.289]},
  {"id":"process.4.num","a":12,"k":"text","g":"about","t":[34.002,34.705,34.965,35.215,35.435]},
  {"id":"process.4.line","a":13,"k":"shape","g":"about","t":[34.107,34.752,35.012,35.312,35.532]},
  {"id":"process.4.node","a":2,"k":"shape","g":"about","t":[34.213,34.661,34.921,35.221,35.441]},
  {"id":"process.4.title","a":5,"k":"text","g":"about","t":[34.318,34.846,35.106,35.463,35.683]},
  {"id":"process.4.text","a":10,"k":"text","g":"about","t":[34.423,34.902,35.162,37.577,37.797]},
  {"id":"process.5.num","a":11,"k":"text","g":"about","t":[34.528,35.013,35.273,35.523,35.743]},
  {"id":"process.5.node","a":14,"k":"shape","g":"about","t":[34.634,35.433,35.693,35.993,36.213]},
  {"id":"process.5.title","a":0,"k":"text","g":"about","t":[34.739,35.559,35.819,36.191,36.411]},
  {"id":"process.5.text","a":1,"k":"text","g":"about","t":[34.844,35.418,35.678,37.66,37.88]},
  {"id":"quote.card","a":3,"k":"shape","g":"about","t":[34.95,35.71,35.97,36.27,36.49]},
  {"id":"quote.icon","a":6,"k":"shape","g":"about","t":[35.055,35.788,36.048,36.348,36.568]},
  {"id":"quote.sheen","a":15,"k":"shape","g":"about","t":[35.16,35.647,35.907,36.207,36.427]},
  {"id":"quote.l1","a":2,"k":"text","g":"about","t":[35.266,35.847,36.107,37.105,37.325]},
  {"id":"quote.l2","a":7,"k":"text","g":"about","t":[35.371,36.114,36.374,37.167,37.387]},
  {"id":"quote.sig","a":5,"k":"text","g":"about","t":[35.476,36.188,36.448,36.698,36.918]},
  {"id":"quote.foot.1","a":11,"k":"text","g":"about","t":[35.581,36.071,36.331,36.762,36.982]},
  {"id":"quote.foot.2","a":12,"k":"text","g":"about","t":[35.687,36.533,36.793,37.438,37.658]},
  {"id":"quote.star","a":13,"k":"shape","g":"about","t":[35.792,36.646,36.906,37.206,37.426]},
  {"id":"jr.rule","a":0,"k":"shape","g":"journey","t":[38.0,38.817,39.077,39.377,39.597]},
  {"id":"jr.eyebrow","a":1,"k":"text","g":"journey","t":[38.088,38.708,38.968,39.628,39.848]},
  {"id":"jr.title","a":2,"k":"text","g":"journey","t":[38.176,38.653,38.913,39.762,39.982]},
  {"id":"jr.resume","a":3,"k":"text","g":"journey","t":[38.265,38.824,39.084,39.412,39.632]},
  {"id":"jr.spine","a":4,"k":"shape","g":"journey","t":[38.353,38.913,39.173,39.473,39.693]},
  {"id":"jr.row.1.rule","a":5,"k":"shape","g":"journey","t":[38.441,38.959,39.219,39.519,39.739]},
  {"id":"jr.row.1.date","a":6,"k":"text","g":"journey","t":[38.529,39.025,39.285,39.636,39.856]},
  {"id":"jr.row.1.node","a":7,"k":"shape","g":"journey","t":[38.618,39.046,39.306,39.606,39.826]},
  {"id":"jr.row.1.role","a":8,"k":"text","g":"journey","t":[38.706,39.453,39.713,40.662,40.882]},
  {"id":"jr.row.1.sub","a":9,"k":"text","g":"journey","t":[38.794,39.305,39.565,40.481,40.701]},
  {"id":"jr.row.1.plus","a":10,"k":"shape","g":"journey","t":[38.882,39.424,39.684,39.984,40.204]},
  {"id":"jr.row.1.desc","a":11,"k":"text","g":"journey","t":[38.971,39.55,39.81,41.936,42.156]},
  {"id":"jr.row.2.rule","a":28,"k":"shape","g":"journey","t":[39.059,39.803,40.063,40.363,40.583]},
  {"id":"jr.row.2.date","a":12,"k":"text","g":"journey","t":[39.147,39.902,40.162,40.47,40.69]},
  {"id":"jr.row.2.node","a":13,"k":"shape","g":"journey","t":[39.235,39.886,40.146,40.446,40.666]},
  {"id":"jr.row.2.role","a":14,"k":"text","g":"journey","t":[39.324,39.75,40.01,40.429,40.649]},
  {"id":"jr.row.2.sub","a":0,"k":"text","g":"journey","t":[39.412,39.904,40.164,40.741,40.961]},
  {"id":"jr.row.2.plus","a":3,"k":"shape","g":"journey","t":[39.5,40.219,40.479,40.779,40.999]},
  {"id":"jr.row.3.rule","a":4,"k":"shape","g":"journey","t":[39.588,40.05,40.31,40.61,40.83]},
  {"id":"jr.row.3.date","a":1,"k":"text","g":"journey","t":[39.676,40.1,40.36,40.771,40.991]},
  {"id":"jr.row.3.node","a":2,"k":"shape","g":"journey","t":[39.765,40.582,40.842,41.142,41.362]},
  {"id":"jr.row.3.role","a":5,"k":"text","g":"journey","t":[39.853,40.596,40.856,41.81,42.03]},
  {"id":"jr.row.3.sub","a":6,"k":"text","g":"journey","t":[39.941,40.584,40.844,41.518,41.738]},
  {"id":"jr.row.3.plus","a":7,"k":"shape","g":"journey","t":[40.029,40.799,41.059,41.359,41.579]},
  {"id":"jr.row.4.rule","a":10,"k":"shape","g":"journey","t":[40.118,40.859,41.119,41.419,41.639]},
  {"id":"jr.row.4.date","a":15,"k":"text","g":"journey","t":[40.206,40.719,40.979,41.297,41.517]},
  {"id":"jr.row.4.node","a":16,"k":"shape","g":"journey","t":[40.294,40.99,41.25,41.55,41.77]},
  {"id":"jr.row.4.role","a":17,"k":"text","g":"journey","t":[40.382,41.107,41.367,42.224,42.444]},
  {"id":"jr.row.4.sub","a":12,"k":"text","g":"journey","t":[40.471,41.249,41.509,42.19,42.41]},
  {"id":"jr.row.4.plus","a":9,"k":"shape","g":"journey","t":[40.559,41.208,41.468,41.768,41.988]},
  {"id":"jr.row.5.rule","a":4,"k":"shape","g":"journey","t":[40.647,41.3,41.56,41.86,42.08]},
  {"id":"jr.row.5.date","a":8,"k":"text","g":"journey","t":[40.735,41.594,41.854,42.104,42.324]},
  {"id":"jr.row.5.node","a":0,"k":"shape","g":"journey","t":[40.824,41.556,41.816,42.116,42.336]},
  {"id":"jr.row.5.role","a":1,"k":"text","g":"journey","t":[40.912,41.52,41.78,42.305,42.525]},
  {"id":"jr.row.5.sub","a":3,"k":"text","g":"journey","t":[41.0,41.868,42.128,43.376,43.596]},
  {"id":"jr.row.5.plus","a":13,"k":"shape","g":"journey","t":[41.088,41.782,42.042,42.342,42.562]},
  {"id":"ms.label","a":2,"k":"text","g":"journey","t":[41.176,41.738,41.998,42.541,42.761]},
  {"id":"ms.rule","a":14,"k":"shape","g":"journey","t":[41.265,41.79,42.05,42.35,42.57]},
  {"id":"ms.title.1","a":15,"k":"text","g":"journey","t":[41.353,42.212,42.472,42.851,43.071]},
  {"id":"ms.title.2","a":7,"k":"text","g":"journey","t":[41.441,42.23,42.49,42.861,43.081]},
  {"id":"ms.row.1.rule","a":6,"k":"shape","g":"journey","t":[41.529,42.361,42.621,42.921,43.141]},
  {"id":"ms.row.1.idx","a":10,"k":"text","g":"journey","t":[41.618,42.435,42.695,42.945,43.165]},
  {"id":"ms.row.1.title","a":16,"k":"text","g":"journey","t":[41.706,42.541,42.801,43.458,43.678]},
  {"id":"ms.row.1.year","a":9,"k":"text","g":"journey","t":[41.794,42.351,42.611,42.861,43.081]},
  {"id":"ms.row.1.arrow","a":4,"k":"shape","g":"journey","t":[41.882,42.424,42.684,42.984,43.204]},
  {"id":"ms.row.2.rule","a":5,"k":"shape","g":"journey","t":[41.971,42.801,43.061,43.361,43.581]},
  {"id":"ms.row.2.idx","a":11,"k":"text","g":"journey","t":[42.059,42.51,42.77,43.02,43.24]},
  {"id":"ms.row.2.title","a":0,"k":"text","g":"journey","t":[42.147,42.728,42.988,44.155,44.375]},
  {"id":"ms.row.2.year","a":8,"k":"text","g":"journey","t":[42.235,42.966,43.226,43.476,43.696]},
  {"id":"ms.row.2.arrow","a":1,"k":"shape","g":"journey","t":[42.324,42.825,43.085,43.385,43.605]},
  {"id":"ms.row.3.rule","a":12,"k":"shape","g":"journey","t":[42.412,42.879,43.139,43.439,43.659]},
  {"id":"ms.row.3.idx","a":13,"k":"text","g":"journey","t":[42.5,42.958,43.218,43.468,43.688]},
  {"id":"ms.row.3.title","a":2,"k":"text","g":"journey","t":[42.588,43.357,43.617,44.66,44.88]},
  {"id":"ms.row.3.year","a":14,"k":"text","g":"journey","t":[42.676,43.451,43.711,43.961,44.181]},
  {"id":"ms.row.3.arrow","a":17,"k":"shape","g":"journey","t":[42.765,43.522,43.782,44.082,44.302]},
  {"id":"ms.row.4.rule","a":15,"k":"shape","g":"journey","t":[42.853,43.441,43.701,44.001,44.221]},
  {"id":"ms.row.4.idx","a":6,"k":"text","g":"journey","t":[42.941,43.383,43.643,43.893,44.113]},
  {"id":"ms.row.4.title","a":4,"k":"text","g":"journey","t":[43.029,43.594,43.854,44.628,44.848]},
  {"id":"ms.row.4.year","a":7,"k":"text","g":"journey","t":[43.118,43.683,43.943,44.193,44.413]},
  {"id":"ms.row.4.arrow","a":9,"k":"shape","g":"journey","t":[43.206,43.871,44.131,44.431,44.651]},
  {"id":"ct.rule","a":0,"k":"shape","g":"contact","t":[45.0,45.514,45.774,46.074,46.294]},
  {"id":"ct.eyebrow","a":1,"k":"text","g":"contact","t":[45.066,45.527,45.787,46.685,46.905]},
  {"id":"ct.title.1","a":2,"k":"text","g":"contact","t":[45.133,45.631,45.891,46.253,46.473]},
  {"id":"ct.title.2","a":3,"k":"text","g":"contact","t":[45.199,45.735,45.995,46.304,46.524]},
  {"id":"ct.dot","a":4,"k":"shape","g":"contact","t":[45.265,45.951,46.211,46.511,46.731]},
  {"id":"ct.text","a":5,"k":"text","g":"contact","t":[45.332,46.124,46.384,48.096,48.316]},
  {"id":"ct.cta.circle","a":6,"k":"shape","g":"contact","t":[45.398,45.837,46.097,46.397,46.617]},
  {"id":"ct.cta.label","a":7,"k":"text","g":"contact","t":[45.464,46.333,46.593,47.431,47.651]},
  {"id":"ct.row.1.rule","a":8,"k":"shape","g":"contact","t":[45.53,46.332,46.592,46.892,47.112]},
  {"id":"ct.row.1.icon","a":9,"k":"shape","g":"contact","t":[45.597,46.273,46.533,46.833,47.053]},
  {"id":"ct.row.1.label","a":10,"k":"text","g":"contact","t":[45.663,46.479,46.739,46.989,47.209]},
  {"id":"ct.row.1.value","a":11,"k":"text","g":"contact","t":[45.729,46.154,46.414,47.153,47.373]},
  {"id":"ct.row.1.arrow","a":12,"k":"shape","g":"contact","t":[45.796,46.352,46.612,46.912,47.132]},
  {"id":"ct.row.2.rule","a":13,"k":"shape","g":"contact","t":[45.862,46.608,46.868,47.168,47.388]},
  {"id":"ct.row.2.icon","a":14,"k":"shape","g":"contact","t":[45.928,46.761,47.021,47.321,47.541]},
  {"id":"ct.row.2.label","a":15,"k":"text","g":"contact","t":[45.995,46.517,46.777,47.146,47.366]},
  {"id":"ct.row.2.value","a":16,"k":"text","g":"contact","t":[46.061,46.514,46.774,47.231,47.451]},
  {"id":"ct.row.2.arrow","a":0,"k":"shape","g":"contact","t":[46.127,46.772,47.032,47.332,47.552]},
  {"id":"ct.row.3.rule","a":17,"k":"shape","g":"contact","t":[46.194,46.708,46.968,47.268,47.488]},
  {"id":"ct.row.3.icon","a":2,"k":"shape","g":"contact","t":[46.26,46.831,47.091,47.391,47.611]},
  {"id":"ct.row.3.label","a":3,"k":"text","g":"contact","t":[46.326,46.794,47.054,47.304,47.524]},
  {"id":"ct.row.3.value","a":18,"k":"text","g":"contact","t":[46.392,47.244,47.504,47.949,48.169]},
  {"id":"ct.row.3.arrow","a":6,"k":"shape","g":"contact","t":[46.459,47.087,47.347,47.647,47.867]},
  {"id":"ct.row.4.rule","a":4,"k":"shape","g":"contact","t":[46.525,47.335,47.595,47.895,48.115]},
  {"id":"ct.row.4.icon","a":19,"k":"shape","g":"contact","t":[46.591,47.294,47.554,47.854,48.074]},
  {"id":"ct.row.4.label","a":20,"k":"text","g":"contact","t":[46.658,47.258,47.518,47.824,48.044]},
  {"id":"ct.row.4.value","a":1,"k":"text","g":"contact","t":[46.724,47.292,47.552,48.172,48.392]},
  {"id":"ct.row.4.arrow","a":21,"k":"shape","g":"contact","t":[46.79,47.344,47.604,47.904,48.124]},
  {"id":"ct.card","a":9,"k":"card","g":"contact","t":[46.857,47.609,47.869,48.269,48.489]},
  {"id":"ct.card.term.1","a":8,"k":"text","g":"contact","t":[46.923,47.674,47.934,48.234,48.454]},
  {"id":"ct.card.term.2","a":12,"k":"text","g":"contact","t":[46.989,47.758,48.018,48.495,48.715]},
  {"id":"ct.card.term.3","a":10,"k":"text","g":"contact","t":[47.056,47.911,48.171,48.667,48.887]},
  {"id":"ct.card.poster.1","a":22,"k":"text","g":"contact","t":[47.122,47.935,48.195,48.54,48.76]},
  {"id":"ct.card.poster.2","a":11,"k":"text","g":"contact","t":[47.188,48.031,48.291,48.881,49.101]},
  {"id":"ct.card.label","a":13,"k":"text","g":"contact","t":[47.254,47.92,48.18,48.43,48.65]},
  {"id":"ct.card.btn","a":3,"k":"shape","g":"contact","t":[47.321,48.112,48.372,48.672,48.892]},
  {"id":"ct.brief.input","a":0,"k":"text","g":"contact","t":[47.387,47.922,48.182,48.993,49.213]},
  {"id":"ct.brief.rule","a":2,"k":"shape","g":"contact","t":[47.453,47.911,48.171,48.471,48.691]},
  {"id":"ct.brief.bar","a":7,"k":"shape","g":"contact","t":[47.52,48.15,48.41,48.71,48.93]},
  {"id":"ct.brief.icon.1","a":14,"k":"shape","g":"contact","t":[47.586,48.262,48.522,48.822,49.042]},
  {"id":"ct.brief.icon.2","a":6,"k":"shape","g":"contact","t":[47.652,48.243,48.503,48.803,49.023]},
  {"id":"ct.brief.icon.3","a":15,"k":"shape","g":"contact","t":[47.719,48.5,48.76,49.06,49.28]},
  {"id":"ft.rule","a":29,"k":"shape","g":"footer","t":[49.4,49.786,49.952,50.144,50.285]},
  {"id":"ft.logo","a":0,"k":"text","g":"footer","t":[49.4,49.838,50.004,50.164,50.305]},
  {"id":"ft.dot","a":1,"k":"shape","g":"footer","t":[49.4,49.803,49.969,50.161,50.302]},
  {"id":"ft.copy","a":2,"k":"text","g":"footer","t":[49.4,49.833,49.999,51.221,51.362]},
  {"id":"ft.time","a":3,"k":"text","g":"footer","t":[49.4,49.927,50.093,50.541,50.682]},
  {"id":"ft.social.1","a":4,"k":"text","g":"footer","t":[49.4,49.899,50.066,50.226,50.367]},
  {"id":"ft.social.2","a":5,"k":"text","g":"footer","t":[49.4,49.679,49.845,50.019,50.16]},
  {"id":"ft.social.3","a":6,"k":"text","g":"footer","t":[49.4,49.909,50.075,50.235,50.376]},
  {"id":"ft.social.4","a":7,"k":"text","g":"footer","t":[49.4,49.753,49.919,50.162,50.302]},
  {"id":"ft.social.5","a":8,"k":"text","g":"footer","t":[49.4,49.691,49.857,50.017,50.158]},
  {"id":"ft.social.6","a":9,"k":"text","g":"footer","t":[49.4,49.817,49.983,50.147,50.288]},
  {"id":"ft.top","a":10,"k":"text","g":"footer","t":[49.4,49.924,50.09,50.405,50.546]},
  {"id":"ft.accent.1","a":11,"k":"shape","g":"footer","t":[49.4,49.803,49.969,50.161,50.302]},
  {"id":"ft.accent.2","a":12,"k":"shape","g":"footer","t":[49.4,49.88,50.047,50.239,50.379]},
  {"id":"ft.accent.3","a":13,"k":"shape","g":"footer","t":[49.4,49.949,50.115,50.307,50.448]},
  {"id":"ft.accent.4","a":14,"k":"shape","g":"footer","t":[49.4,49.699,49.866,50.058,50.199]}
] });
```

### 5.9 STORYBOARD — what every one of the 364 cursor actions looks like (human-readable version of 5.8)
This is the same data as 5.8, written out so you can check the result against it by eye. Read it once; you do not need to type any of it.

Format of every line: `start-time | Agent NN (colour) | layer-id [type] | exact choreography`. All times are seconds at 1x speed. "flies" = bezier flight from wherever the agent currently is to the TOP-LEFT corner of the element; "drags" = the cursor turns into a white crosshair and pulls the selection box from the top-left to the bottom-right corner; "types" = the cursor turns into an I-beam parked at the right edge of the box and the element's text appears letter by letter; "releases" = the agent is free and starts drifting, the box fades out in 0.22 s (scaled).


#### NAV + HERO  (window 1.2–4.3 s, 46 layers, 18 agents on screen at the start)

- **t=1.20** EVENT: red snap-guide line appears at the left edge of #home
- **t=3.90** EVENT: rulers fade OUT (0.25 s)
- **t=3.90** EVENT: red snap-guide line appears at the left edge of #work
- **t=4.30** EVENT: blue commit sweep (0.7 s) runs along the bottom of #home
- **t=4.70** EVENT: red snap-guide line fades out at the left edge of #home

- 1.20 | Agent 01 (teal) | `nav.bar` [shape] | its blue wireframe box has been on screen since t=1.20; then flies 1.20→1.54, drags a BLUE box 1.54→1.70, box fills RED, element pops in at 1.81, done 1.88, releases →2.01
- 1.20 | Agent 02 (orange) | `nav.logo` [text] | its blue wireframe box has been on screen since t=1.22; then flies 1.20→1.65, drags a BLUE box 1.65→1.80, types "MAYURA" 25 ms per character 1.80→1.96, releases →2.09
- 1.20 | Agent 03 (white) | `nav.dot` [shape] | its blue wireframe box has been on screen since t=1.24; then flies 1.20→1.47, drags a BLUE box 1.47→1.63, box fills RED, element pops in at 1.75, done 1.81, releases →1.94
- 1.20 | Agent 04 (violet) | `nav.link.1` [text] | its blue wireframe box has been on screen since t=1.25; then flies 1.20→1.52, drags a BLUE box 1.52→1.67, types "Work" 38 ms per character 1.67→1.82, releases →1.96
- 1.20 | Agent 05 (sky) | `nav.link.2` [text] | its blue wireframe box has been on screen since t=1.27; then flies 1.20→1.67, drags a BLUE box 1.67→1.82, types "Highlights" 21 ms per character 1.82→2.04, releases →2.17
- 1.20 | Agent 06 (rose) | `nav.link.3` [text] | its blue wireframe box has been on screen since t=1.29; then flies 1.20→1.48, drags a BLUE box 1.48→1.64, types "About" 30 ms per character 1.64→1.79, releases →1.92
- 1.20 | Agent 07 (amber) | `nav.link.4` [text] | its blue wireframe box has been on screen since t=1.31; then flies 1.20→1.56, drags a BLUE box 1.56→1.72, types "Journey" 21 ms per character 1.72→1.87, releases →2.00
- 1.20 | Agent 08 (green) | `nav.link.5` [text] | its blue wireframe box has been on screen since t=1.32; then flies 1.20→1.68, drags a BLUE box 1.68→1.83, types "Contact" 21 ms per character 1.83→1.98, releases →2.12
- 1.20 | Agent 09 (teal) | `nav.motion` [text] | its blue wireframe box has been on screen since t=1.34; then flies 1.20→1.69, drags a BLUE box 1.69→1.85, types "Motion off" 18 ms per character 1.85→2.03, releases →2.17
- 1.20 | Agent 10 (orange) | `nav.talk` [text] | its blue wireframe box has been on screen since t=1.36; then flies 1.20→1.66, drags a BLUE box 1.66→1.82, types "Let's talk" 19 ms per character 1.82→2.01, releases →2.14
- 1.20 | Agent 11 (white) | `hero.word` [shape] | its blue wireframe box has been on screen since t=1.38; then flies 1.20→1.50, drags a BLUE box 1.50→1.65, box fills RED, element pops in at 1.77, done 1.83, releases →1.96
- 1.20 | Agent 12 (violet) | `hero.photo` [image] | its blue wireframe box has been on screen since t=1.40; then flies 1.20→1.70, drags a BLUE box 1.70→1.85, box fills with the flat blue-grey placeholder + picture icon, real element blur-reveals at 2.06, done 2.42, releases →2.55
- 1.20 | Agent 13 (sky) | `hero.photo.glow` [shape] | its blue wireframe box has been on screen since t=1.36; then flies 1.20→1.49, drags a BLUE box 1.49→1.64, box fills RED, element pops in at 1.76, done 1.82, releases →1.95
- 1.20 | Agent 14 (rose) | `hero.tag.1` [text] | its blue wireframe box has been on screen since t=1.43; then flies 1.20→1.58, drags a BLUE box 1.58→1.74, types "FULL STACK DEVELOPER / DESIGNER" 21 ms per character 1.74→2.39, releases →2.52
- 1.20 | Agent 15 (amber) | `hero.tag.2` [text] | its blue wireframe box has been on screen since t=1.44; then flies 1.20→1.55, drags a BLUE box 1.55→1.71, types "GRAPHICS DESIGNER" 17 ms per character 1.71→2.00, releases →2.13
- 1.20 | Agent 16 (green) | `hero.tag.avail` [text] | its blue wireframe box has been on screen since t=1.47; then flies 1.20→1.71, drags a BLUE box 1.71→1.86, types "OPEN TO WORK" 21 ms per character 1.86→2.12, releases →2.25
- 1.20 | Agent 17 (teal) | `hero.hello` [text] | its blue wireframe box has been on screen since t=1.44; then flies 1.20→1.55, drags a BLUE box 1.55→1.71, types "Hello, I'm" 24 ms per character 1.71→1.95, releases →2.08
- 1.20 | Agent 18 (orange) | `hero.name` [text] | its blue wireframe box has been on screen since t=1.46; then flies 1.20→1.57, drags a BLUE box 1.57→1.73, types "MAYURA." 23 ms per character 1.73→1.90, releases →2.03
- 1.79 | Agent 06 (rose) | `hero.role.1` [text] | its blue wireframe box has been on screen since t=1.52; then flies 1.79→2.07, drags a BLUE box 2.07→2.23, types "FULL STACK DEV" 23 ms per character 2.23→2.56, releases →2.69
- 1.81 | Agent 03 (white) | `hero.role.2` [text] | its blue wireframe box has been on screen since t=1.54; then flies 1.81→2.24, drags a BLUE box 2.24→2.39, types "& DESIGNER" 18 ms per character 2.39→2.58, releases →2.71
- 1.82 | Agent 13 (sky) | `hero.intro` [text] | its blue wireframe box has been on screen since t=1.56; then flies 1.82→2.10, drags a BLUE box 2.10→2.26, types "I build AI products, game tools and web exper…" word by word (long text) 2.26→3.71, releases →3.84
- 1.82 | Agent 04 (violet) | `hero.cta` [shape] | its blue wireframe box has been on screen since t=1.57; then flies 1.82→2.09, drags a BLUE box 2.09→2.25, box fills RED, element pops in at 2.36, done 2.42, releases →2.56
- 1.83 | Agent 11 (white) | `hero.cta.label` [text] | its blue wireframe box has been on screen since t=1.59; then flies 1.83→2.23, drags a BLUE box 2.23→2.39, types "See my work ↓" 18 ms per character 2.39→2.62, releases →2.75
- 1.87 | Agent 07 (amber) | `hero.loc.icon` [shape] | its blue wireframe box has been on screen since t=1.61; then flies 1.87→2.15, drags a BLUE box 2.15→2.30, box fills RED, element pops in at 2.42, done 2.48, releases →2.61
- 1.88 | Agent 01 (teal) | `hero.loc` [text] | its blue wireframe box has been on screen since t=1.63; then flies 1.88→2.27, drags a BLUE box 2.27→2.43, types "BENGALURU, INDIA" 22 ms per character 2.43→2.79, releases →2.92
- 1.90 | Agent 18 (orange) | `hero.demo.btn` [shape] | its blue wireframe box has been on screen since t=1.64; then flies 1.90→2.33, drags a BLUE box 2.33→2.48, box fills RED, element pops in at 2.60, done 2.66, releases →2.79
- 1.95 | Agent 17 (teal) | `hero.demo.1` [text] | its blue wireframe box has been on screen since t=1.66; then flies 1.95→2.23, drags a BLUE box 2.23→2.38, types "TRY YULYA" 22 ms per character 2.38→2.59, releases →2.72
- 1.96 | Agent 02 (orange) | `hero.demo.2` [text] | its blue wireframe box has been on screen since t=1.68; then flies 1.96→2.41, drags a BLUE box 2.41→2.56, types "AI DISCORD BOT" 18 ms per character 2.56→2.82, releases →2.95
- 1.98 | Agent 08 (green) | `hero.tagline.icon` [shape] | its blue wireframe box has been on screen since t=1.70; then flies 1.98→2.27, drags a BLUE box 2.27→2.42, box fills RED, element pops in at 2.54, done 2.60, releases →2.73
- 2.00 | Agent 15 (amber) | `hero.tagline.1` [text] | its blue wireframe box has been on screen since t=1.72; then flies 2.00→2.50, drags a BLUE box 2.50→2.65, types "Built with logic." 19 ms per character 2.65→2.98, releases →3.11
- 2.01 | Agent 10 (orange) | `hero.tagline.2` [text] | its blue wireframe box has been on screen since t=1.73; then flies 2.01→2.40, drags a BLUE box 2.40→2.55, types "Finished with feeling." 22 ms per character 2.55→3.03, releases →3.17
- 2.03 | Agent 09 (teal) | `hero.accent` [shape] | its blue wireframe box has been on screen since t=1.75; then flies 2.03→2.29, drags a BLUE box 2.29→2.45, box fills RED, element pops in at 2.56, done 2.63, releases →2.76
- 2.04 | Agent 05 (sky) | `hero.avail.dot` [shape] | its blue wireframe box has been on screen since t=1.77; then flies 2.04→2.42, drags a BLUE box 2.42→2.58, box fills RED, element pops in at 2.70, done 2.76, releases →2.89
- 2.12 | Agent 16 (green) | `hero.stat.1.num` [text] | its blue wireframe box has been on screen since t=1.79; then flies 2.12→2.43, drags a BLUE box 2.43→2.59, types "4+" 75 ms per character 2.59→2.74, releases →2.87
- 2.39 | Agent 14 (rose) | `hero.stat.1.label` [text] | its blue wireframe box has been on screen since t=1.80; then flies 2.39→2.68, drags a BLUE box 2.68→2.84, types "Years of building & designing" 24 ms per character 2.84→3.53, releases →3.66
- 2.42 | Agent 12 (violet) | `hero.stat.1.rule` [shape] | its blue wireframe box has been on screen since t=1.82; then flies 2.42→2.69, drags a BLUE box 2.69→2.85, box fills RED, element pops in at 2.96, done 3.03, releases →3.16
- 2.42 | Agent 04 (violet) | `hero.stat.2.num` [text] | its blue wireframe box has been on screen since t=1.84; then flies 2.42→2.79, drags a BLUE box 2.79→2.95, types "10+" 50 ms per character 2.95→3.10, releases →3.23
- 2.48 | Agent 07 (amber) | `hero.stat.2.label` [text] | its blue wireframe box has been on screen since t=1.86; then flies 2.48→2.76, drags a BLUE box 2.76→2.91, types "Projects shipped" 25 ms per character 2.91→3.31, releases →3.44
- 2.56 | Agent 06 (rose) | `hero.stat.2.rule` [shape] | its blue wireframe box has been on screen since t=1.88; then flies 2.56→3.01, drags a BLUE box 3.01→3.17, box fills RED, element pops in at 3.28, done 3.35, releases →3.48
- 2.58 | Agent 03 (white) | `hero.stat.3.num` [text] | its blue wireframe box has been on screen since t=1.89; then flies 2.58→2.89, drags a BLUE box 2.89→3.04, types "13+" 50 ms per character 3.04→3.19, releases →3.33
- 2.59 | Agent 17 (teal) | `hero.stat.3.label` [text] | its blue wireframe box has been on screen since t=1.91; then flies 2.59→3.10, drags a BLUE box 3.10→3.25, types "Public repositories on GitHub" 25 ms per character 3.25→3.96, releases →4.10
- 2.60 | Agent 08 (green) | `hero.stat.3.rule` [shape] | its blue wireframe box has been on screen since t=1.93; then flies 2.60→3.00, drags a BLUE box 3.00→3.16, box fills RED, element pops in at 3.28, done 3.34, releases →3.47
- 2.62 | Agent 11 (white) | `hero.cv` [text] | its blue wireframe box has been on screen since t=1.95; then flies 2.62→3.09, drags a BLUE box 3.09→3.24, types "↓ DOWNLOAD CV" 23 ms per character 3.24→3.55, releases →3.68
- 2.63 | Agent 09 (teal) | `hero.scroll` [text] | its blue wireframe box has been on screen since t=1.96; then flies 2.63→3.14, drags a BLUE box 3.14→3.30, types "SCROLL TO DISCOVER ↓" 20 ms per character 3.30→3.70, releases →3.83
- 2.66 | Agent 18 (orange) | `hero.range` [text] | its blue wireframe box has been on screen since t=1.98; then flies 2.66→3.01, drags a BLUE box 3.01→3.17, types "SELECTED WORK · 2022 – 2026" 22 ms per character 3.17→3.76, releases →3.89
- 2.74 | Agent 16 (green) | `hero.rule` [shape] | its blue wireframe box has been on screen since t=2.00; then flies 2.74→3.04, drags a BLUE box 3.04→3.19, box fills RED, element pops in at 3.31, done 3.37, releases →3.50

#### SELECTED WORK: heading, tabs, search  (window 3.9–8.0 s, 17 layers, 18 agents on screen at the start)

- **t=3.90** EVENT: rulers fade OUT (0.25 s)
- **t=3.90** EVENT: red snap-guide line appears at the left edge of #work
- **t=4.30** EVENT: blue commit sweep (0.7 s) runs along the bottom of #home
- **t=4.70** EVENT: red snap-guide line fades out at the left edge of #home

- 3.90 | Agent 01 (teal) | `work.rule` [shape] | flies 3.90→4.47, drags a BLUE box 4.47→4.73, box fills RED, element pops in at 4.92, done 5.03, releases →5.25
- 4.03 | Agent 02 (orange) | `work.eyebrow` [text] | flies 4.03→4.60, drags a BLUE box 4.60→4.86, types "01 / SELECTED WORK" 35 ms per character 4.86→5.49, releases →5.71
- 4.16 | Agent 03 (white) | `work.title` [text] | flies 4.16→4.59, drags a BLUE box 4.59→4.85, types "WORK THAT SHIPS." 41 ms per character 4.85→5.50, releases →5.72
- 4.28 | Agent 04 (violet) | `work.all` [text] | flies 4.28→4.90, drags a BLUE box 4.90→5.16, types "ALL WORK →" 32 ms per character 5.16→5.48, releases →5.70
- 4.41 | Agent 05 (sky) | `work.tab.1` [text] | flies 4.41→5.14, drags a BLUE box 5.14→5.40, types "All" 83 ms per character 5.40→5.65, releases →5.87
- 4.54 | Agent 06 (rose) | `work.tab.2` [text] | flies 4.54→5.16, drags a BLUE box 5.16→5.42, types "AI & ML" 36 ms per character 5.42→5.67, releases →5.89
- 4.67 | Agent 07 (amber) | `work.tab.3` [text] | flies 4.67→5.22, drags a BLUE box 5.22→5.48, types "Full Stack" 41 ms per character 5.48→5.89, releases →6.11
- 4.79 | Agent 08 (green) | `work.tab.4` [text] | flies 4.79→5.62, drags a BLUE box 5.62→5.88, types "Bots" 62 ms per character 5.88→6.13, releases →6.35
- 4.92 | Agent 09 (teal) | `work.tab.5` [text] | flies 4.92→5.35, drags a BLUE box 5.35→5.61, types "Desktop" 36 ms per character 5.61→5.86, releases →6.08
- 5.05 | Agent 01 (teal) | `work.tab.6` [text] | flies 5.05→5.83, drags a BLUE box 5.83→6.09, types "Games" 50 ms per character 6.09→6.34, releases →6.56
- 5.18 | Agent 10 (orange) | `work.tab.7` [text] | flies 5.18→5.73, drags a BLUE box 5.73→5.99, types "Web Design" 35 ms per character 5.99→6.33, releases →6.55
- 5.30 | Agent 11 (white) | `work.tab.8` [text] | flies 5.30→5.91, drags a BLUE box 5.91→6.17, types "Art & 3D" 40 ms per character 6.17→6.49, releases →6.71
- 5.43 | Agent 12 (violet) | `work.tab.line` [shape] | flies 5.43→5.91, drags a BLUE box 5.91→6.17, box fills RED, element pops in at 6.37, done 6.47, releases →6.69
- 5.56 | Agent 02 (orange) | `work.search.icon` [shape] | flies 5.56→6.02, drags a BLUE box 6.02→6.28, box fills RED, element pops in at 6.47, done 6.58, releases →6.80
- 5.69 | Agent 03 (white) | `work.search` [text] | flies 5.69→6.43, drags a BLUE box 6.43→6.69, types "Search title or category" 41 ms per character 6.69→7.66, releases →7.88
- 5.81 | Agent 04 (violet) | `work.search.rule` [shape] | flies 5.81→6.65, drags a BLUE box 6.65→6.91, box fills RED, element pops in at 7.11, done 7.21, releases →7.43
- 5.94 | Agent 05 (sky) | `work.tabs.rule` [shape] | flies 5.94→6.59, drags a BLUE box 6.59→6.85, box fills RED, element pops in at 7.05, done 7.15, releases →7.37

#### SELECTED WORK: first three cards + slider controls  (window 8.0–12.0 s, 28 layers, 19 agents on screen at the start)

- **t=12.00** EVENT: rulers fade IN (0.25 s)
- **t=12.00** EVENT: red snap-guide line appears at the left edge of #tech
- **t=12.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #work
- **t=12.40** EVENT: red snap-guide line fades out at the left edge of #work

- 8.00 | Agent 19 (white) | `work.card.1` [card] | flies 8.00→8.71, drags a RED outline box 8.71→8.97, card pops in at 9.23, done 9.37, releases →9.59
- 8.09 | Agent 01 (teal) | `work.card.1.img` [image] | flies 8.09→8.87, drags a BLUE box 8.87→9.13, box fills with the flat blue-grey placeholder + picture icon, real element blur-reveals at 9.48, done 10.08, releases →10.30
- 8.18 | Agent 02 (orange) | `work.card.1.tag` [text] | flies 8.18→8.72, drags a BLUE box 8.72→8.98, types "AI / DISCORD BOT" 31 ms per character 8.98→9.48, releases →9.70
- 8.27 | Agent 03 (white) | `work.card.1.chip.rule` [shape] | flies 8.27→8.79, drags a BLUE box 8.79→9.05, box fills RED, element pops in at 9.24, done 9.35, releases →9.57
- 8.36 | Agent 04 (violet) | `work.card.1.num` [text] | flies 8.36→9.13, drags a BLUE box 9.13→9.39, types "01" 125 ms per character 9.39→9.64, releases →9.86
- 8.45 | Agent 05 (sky) | `work.card.1.title` [text] | flies 8.45→8.99, drags a BLUE box 8.99→9.25, types "YULYA — AI DISCORD BOT" 35 ms per character 9.25→10.03, releases →10.25
- 8.54 | Agent 06 (rose) | `work.card.1.meta` [text] | flies 8.54→9.11, drags a BLUE box 9.11→9.37, types "BOTS / 2026" 37 ms per character 9.37→9.77, releases →9.99
- 8.63 | Agent 07 (amber) | `work.card.1.arrow` [shape] | flies 8.63→9.27, drags a BLUE box 9.27→9.53, box fills RED, element pops in at 9.72, done 9.83, releases →10.05
- 8.72 | Agent 08 (green) | `work.card.2` [card] | flies 8.72→9.39, drags a RED outline box 9.39→9.65, card pops in at 9.91, done 10.05, releases →10.27
- 8.81 | Agent 09 (teal) | `work.card.2.img` [image] | flies 8.81→9.48, drags a BLUE box 9.48→9.74, box fills with the flat blue-grey placeholder + picture icon, real element blur-reveals at 10.09, done 10.69, releases →10.91
- 8.90 | Agent 10 (orange) | `work.card.2.tag` [text] | flies 8.90→9.68, drags a BLUE box 9.68→9.94, types "BROWSER GAME ENGINE" 31 ms per character 9.94→10.52, releases →10.74
- 8.99 | Agent 11 (white) | `work.card.2.chip.rule` [shape] | flies 8.99→9.73, drags a BLUE box 9.73→9.99, box fills RED, element pops in at 10.19, done 10.29, releases →10.51
- 9.09 | Agent 12 (violet) | `work.card.2.num` [text] | flies 9.09→9.84, drags a BLUE box 9.84→10.10, types "02" 125 ms per character 10.10→10.35, releases →10.57
- 9.18 | Agent 13 (sky) | `work.card.2.title` [text] | flies 9.18→9.66, drags a BLUE box 9.66→9.92, types "YULYA STUDIO — GAME MAKER" 40 ms per character 9.92→10.93, releases →11.14
- 9.27 | Agent 14 (rose) | `work.card.2.meta` [text] | flies 9.27→9.83, drags a BLUE box 9.83→10.09, types "GAMES / 2026" 37 ms per character 10.09→10.53, releases →10.75
- 9.36 | Agent 03 (white) | `work.card.2.arrow` [shape] | flies 9.36→10.00, drags a BLUE box 10.00→10.26, box fills RED, element pops in at 10.46, done 10.56, releases →10.78
- 9.45 | Agent 15 (amber) | `work.card.3` [card] | flies 9.45→9.94, drags a RED outline box 9.94→10.20, card pops in at 10.46, done 10.60, releases →10.82
- 9.54 | Agent 20 (violet) | `work.card.3.img` [image] | flies 9.54→10.19, drags a BLUE box 10.19→10.45, box fills with the flat blue-grey placeholder + picture icon, real element blur-reveals at 10.80, done 11.39, releases →11.62
- 9.63 | Agent 02 (orange) | `work.card.3.tag` [text] | flies 9.63→10.36, drags a BLUE box 10.36→10.62, types "FINE-TUNED LLMS" 29 ms per character 10.62→11.06, releases →11.28
- 9.72 | Agent 04 (violet) | `work.card.3.chip.rule` [shape] | flies 9.72→10.41, drags a BLUE box 10.41→10.67, box fills RED, element pops in at 10.87, done 10.97, releases →11.19
- 9.81 | Agent 06 (rose) | `work.card.3.num` [text] | flies 9.81→10.65, drags a BLUE box 10.65→10.91, types "03" 125 ms per character 10.91→11.16, releases →11.38
- 9.90 | Agent 07 (amber) | `work.card.3.title` [text] | flies 9.90→10.39, drags a BLUE box 10.39→10.65, types "YULYA — LOCAL AI MODELS" 36 ms per character 10.65→11.48, releases →11.70
- 9.99 | Agent 16 (green) | `work.card.3.meta` [text] | flies 9.99→10.55, drags a BLUE box 10.55→10.81, types "AI & ML / 2026" 40 ms per character 10.81→11.37, releases →11.59
- 10.08 | Agent 01 (teal) | `work.card.3.arrow` [shape] | flies 10.08→10.51, drags a BLUE box 10.51→10.77, box fills RED, element pops in at 10.97, done 11.07, releases →11.29
- 10.17 | Agent 05 (sky) | `work.prev` [shape] | flies 10.17→10.69, drags a BLUE box 10.69→10.95, box fills RED, element pops in at 11.15, done 11.25, releases →11.47
- 10.26 | Agent 08 (green) | `work.next` [shape] | flies 10.26→11.07, drags a BLUE box 11.07→11.33, box fills RED, element pops in at 11.53, done 11.63, releases →11.85
- 10.35 | Agent 11 (white) | `work.dots` [shape] | flies 10.35→10.90, drags a BLUE box 10.90→11.16, box fills RED, element pops in at 11.35, done 11.46, releases →11.68
- 10.44 | Agent 12 (violet) | `work.count` [text] | flies 10.44→11.01, drags a BLUE box 11.01→11.27, types "SEE ALL (11) •" 28 ms per character 11.27→11.66, releases →11.88

#### TECH STACK STRIP  (window 12.0–15.0 s, 14 layers, 23 agents on screen at the start)

- **t=12.00** EVENT: rulers fade IN (0.25 s)
- **t=12.00** EVENT: red snap-guide line appears at the left edge of #tech
- **t=12.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #work
- **t=12.40** EVENT: red snap-guide line fades out at the left edge of #work
- **t=13.20** EVENT: rulers fade OUT (0.25 s)
- **t=15.00** EVENT: rulers fade IN (0.25 s)
- **t=15.00** EVENT: red snap-guide line appears at the left edge of #highlights
- **t=15.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #tech
- **t=15.40** EVENT: red snap-guide line fades out at the left edge of #tech

- 12.00 | Agent 21 (sky) | `tech.rule` [shape] | flies 12.00→12.55, drags a BLUE box 12.55→12.81, box fills RED, element pops in at 13.00, done 13.11, releases →13.33
- 12.11 | Agent 22 (rose) | `tech.label.1` [text] | flies 12.11→12.61, drags a BLUE box 12.61→12.87, types "BUILT WITH" 40 ms per character 12.87→13.27, releases →13.49
- 12.23 | Agent 23 (amber) | `tech.label.2` [text] | flies 12.23→12.70, drags a BLUE box 12.70→12.96, types "THE RIGHT TOOLS." 31 ms per character 12.96→13.45, releases →13.67
- 12.34 | Agent 01 (teal) | `tech.fade.l` [shape] | flies 12.34→13.04, drags a BLUE box 13.04→13.30, box fills RED, element pops in at 13.49, done 13.60, releases →13.82
- 12.46 | Agent 02 (orange) | `tech.fade.r` [shape] | flies 12.46→13.08, drags a BLUE box 13.08→13.34, box fills RED, element pops in at 13.54, done 13.64, releases →13.86
- 12.57 | Agent 03 (white) | `tech.tile.1` [logo] | flies 12.57→13.11, drags a RED outline box 13.11→13.37, "Unity" tile pops in at 13.56, done 13.67, releases →13.89
- 12.68 | Agent 04 (violet) | `tech.tile.2` [logo] | flies 12.68→13.12, drags a RED outline box 13.12→13.38, "Blender" tile pops in at 13.58, done 13.68, releases →13.90
- 12.80 | Agent 05 (sky) | `tech.tile.3` [logo] | flies 12.80→13.50, drags a RED outline box 13.50→13.76, "Krita" tile pops in at 13.95, done 14.06, releases →14.28
- 12.91 | Agent 06 (rose) | `tech.tile.4` [logo] | flies 12.91→13.53, drags a RED outline box 13.53→13.79, "Live2D" tile pops in at 13.99, done 14.09, releases →14.31
- 13.03 | Agent 07 (amber) | `tech.tile.5` [logo] | flies 13.03→13.89, drags a RED outline box 13.89→14.15, "Python" tile pops in at 14.34, done 14.45, releases →14.67
- 13.14 | Agent 08 (green) | `tech.tile.6` [logo] | flies 13.14→13.72, drags a RED outline box 13.72→13.98, "JavaScript" tile pops in at 14.18, done 14.28, releases →14.50
- 13.25 | Agent 09 (teal) | `tech.tile.7` [logo] | flies 13.25→13.79, drags a RED outline box 13.79→14.04, "Electron" tile pops in at 14.24, done 14.35, releases →14.56
- 13.37 | Agent 10 (orange) | `tech.tile.8` [logo] | flies 13.37→14.10, drags a RED outline box 14.10→14.36, "Ollama" tile pops in at 14.55, done 14.66, releases →14.88
- 13.48 | Agent 11 (white) | `tech.tile.9` [logo] | flies 13.48→13.90, drags a RED outline box 13.90→14.16, "Hugging Face" tile pops in at 14.36, done 14.46, releases →14.68

#### HIGHLIGHTS & PROOF  (window 15.0–22.0 s, 52 layers, 23 agents on screen at the start)

- **t=15.00** EVENT: rulers fade IN (0.25 s)
- **t=15.00** EVENT: red snap-guide line appears at the left edge of #highlights
- **t=15.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #tech
- **t=15.40** EVENT: red snap-guide line fades out at the left edge of #tech
- **t=16.20** EVENT: rulers fade OUT (0.25 s)
- **t=22.00** EVENT: rulers fade IN (0.25 s)
- **t=22.00** EVENT: red snap-guide line appears at the left edge of #raw
- **t=22.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #highlights
- **t=22.40** EVENT: red snap-guide line fades out at the left edge of #highlights

- 15.00 | Agent 01 (teal) | `hl.panel` [shape] | flies 15.00→15.87, drags a BLUE box 15.87→16.13, box fills RED, element pops in at 16.32, done 16.43, releases →16.65
- 15.08 | Agent 02 (orange) | `hl.eyebrow` [text] | flies 15.08→15.84, drags a BLUE box 15.84→16.10, types "HIGHLIGHTS & PROOF" 30 ms per character 16.10→16.64, releases →16.86
- 15.16 | Agent 03 (white) | `hl.panel.glow` [shape] | flies 15.16→15.98, drags a BLUE box 15.98→16.24, box fills RED, element pops in at 16.44, done 16.54, releases →16.76
- 15.25 | Agent 04 (violet) | `hl.title.1` [text] | flies 15.25→16.11, drags a BLUE box 16.11→16.38, types "THE WORK." 41 ms per character 16.38→16.75, releases →16.96
- 15.33 | Agent 05 (sky) | `hl.title.2` [text] | flies 15.33→15.86, drags a BLUE box 15.86→16.12, types "THE PROOF." 31 ms per character 16.12→16.43, releases →16.65
- 15.41 | Agent 06 (rose) | `hl.laurel.l` [shape] | flies 15.41→16.03, drags a BLUE box 16.03→16.29, box fills RED, element pops in at 16.49, done 16.59, releases →16.81
- 15.49 | Agent 07 (amber) | `hl.big` [text] | flies 15.49→16.24, drags a BLUE box 16.24→16.50, types "10+" 83 ms per character 16.50→16.75, releases →16.97
- 15.58 | Agent 08 (green) | `hl.laurel.r` [shape] | flies 15.58→16.05, drags a BLUE box 16.05→16.31, box fills RED, element pops in at 16.51, done 16.61, releases →16.83
- 15.66 | Agent 09 (teal) | `hl.caption` [text] | flies 15.66→16.18, drags a BLUE box 16.18→16.44, types "PROJECTS SHIPPED" 40 ms per character 16.44→17.08, releases →17.30
- 15.74 | Agent 10 (orange) | `hl.text` [text] | flies 15.74→16.48, drags a BLUE box 16.48→16.74, types "No trophies yet. Just shipped products, publi…" word by word (long text) 16.74→18.84, releases →19.06
- 15.82 | Agent 11 (white) | `hl.link` [text] | flies 15.82→16.31, drags a BLUE box 16.31→16.57, types "VIEW GITHUB ↗" 36 ms per character 16.57→17.04, releases →17.26
- 15.91 | Agent 12 (violet) | `hl.list.title` [text] | flies 15.91→16.58, drags a BLUE box 16.58→16.84, types "SELECTED HIGHLIGHTS" 37 ms per character 16.84→17.54, releases →17.76
- 15.99 | Agent 13 (sky) | `hl.list.range` [text] | flies 15.99→16.44, drags a BLUE box 16.44→16.70, types "PUBLIC & VERIFIABLE" 38 ms per character 16.70→17.42, releases →17.64
- 16.07 | Agent 14 (rose) | `hl.row.1.rule` [shape] | flies 16.07→16.83, drags a BLUE box 16.83→17.09, box fills RED, element pops in at 17.28, done 17.39, releases →17.61
- 16.15 | Agent 15 (amber) | `hl.row.1.idx` [text] | flies 16.15→16.72, drags a BLUE box 16.72→16.98, types "01" 125 ms per character 16.98→17.23, releases →17.45
- 16.23 | Agent 16 (green) | `hl.row.1.title` [text] | flies 16.23→16.74, drags a BLUE box 16.74→17.00, types "Yulya Studio, a game maker in the browser" 33 ms per character 17.00→18.35, releases →18.57
- 16.32 | Agent 17 (teal) | `hl.row.1.sub` [text] | flies 16.32→17.07, drags a BLUE box 17.07→17.34, types "Monaco IDE, Gemini AI, live hosting and an on…" 35 ms per character 17.34→19.29, releases →19.51
- 16.40 | Agent 18 (orange) | `hl.row.1.metric` [text] | flies 16.40→17.12, drags a BLUE box 17.12→17.38, types "LIVE" 62 ms per character 17.38→17.63, releases →17.85
- 16.48 | Agent 01 (teal) | `hl.row.1.arrow` [shape] | flies 16.48→17.09, drags a BLUE box 17.09→17.35, box fills RED, element pops in at 17.54, done 17.65, releases →17.87
- 16.57 | Agent 03 (white) | `hl.row.2.rule` [shape] | flies 16.57→17.32, drags a BLUE box 17.32→17.58, box fills RED, element pops in at 17.77, done 17.88, releases →18.10
- 16.65 | Agent 02 (orange) | `hl.row.2.idx` [text] | flies 16.65→17.50, drags a BLUE box 17.50→17.76, types "02" 125 ms per character 17.76→18.01, releases →18.23
- 16.73 | Agent 05 (sky) | `hl.row.2.title` [text] | flies 16.73→17.29, drags a BLUE box 17.29→17.55, types "Yulya Discord bot" 34 ms per character 17.55→18.12, releases →18.34
- 16.81 | Agent 04 (violet) | `hl.row.2.sub` [text] | flies 16.81→17.39, drags a BLUE box 17.39→17.65, types "Voice AI, neural memory and a live simulated …" word by word (long text) 17.65→20.04, releases →20.25
- 16.89 | Agent 06 (rose) | `hl.row.2.metric` [text] | flies 16.89→17.73, drags a BLUE box 17.73→17.99, types "LIVE" 62 ms per character 17.99→18.24, releases →18.46
- 16.98 | Agent 07 (amber) | `hl.row.2.arrow` [shape] | flies 16.98→17.66, drags a BLUE box 17.66→17.92, box fills RED, element pops in at 18.11, done 18.22, releases →18.44
- 17.06 | Agent 24 (green) | `hl.row.3.rule` [shape] | flies 17.06→17.85, drags a BLUE box 17.85→18.11, box fills RED, element pops in at 18.31, done 18.41, releases →18.63
- 17.14 | Agent 08 (green) | `hl.row.3.idx` [text] | flies 17.14→17.75, drags a BLUE box 17.75→18.01, types "03" 125 ms per character 18.01→18.26, releases →18.48
- 17.22 | Agent 09 (teal) | `hl.row.3.title` [text] | flies 17.22→18.00, drags a BLUE box 18.00→18.26, types "Yulya model family on Hugging Face" 37 ms per character 18.26→19.52, releases →19.75
- 17.31 | Agent 11 (white) | `hl.row.3.sub` [text] | flies 17.31→17.92, drags a BLUE box 17.92→18.18, types "Fine-tuned local models, from tiny 135M to an…" 41 ms per character 18.18→20.38, releases →20.60
- 17.39 | Agent 14 (rose) | `hl.row.3.metric` [text] | flies 17.39→17.92, drags a BLUE box 17.92→18.18, types "8B" 125 ms per character 18.18→18.43, releases →18.65
- 17.47 | Agent 13 (sky) | `hl.row.3.arrow` [shape] | flies 17.47→17.96, drags a BLUE box 17.96→18.22, box fills RED, element pops in at 18.42, done 18.52, releases →18.74
- 17.55 | Agent 12 (violet) | `hl.row.4.rule` [shape] | flies 17.55→18.03, drags a BLUE box 18.03→18.29, box fills RED, element pops in at 18.48, done 18.59, releases →18.81
- 17.64 | Agent 15 (amber) | `hl.row.4.idx` [text] | flies 17.64→18.27, drags a BLUE box 18.27→18.53, types "04" 125 ms per character 18.53→18.78, releases →19.00
- 17.72 | Agent 01 (teal) | `hl.row.4.title` [text] | flies 17.72→18.26, drags a BLUE box 18.26→18.52, types "Desktop AI Companion" 29 ms per character 18.52→19.10, releases →19.32
- 17.80 | Agent 18 (orange) | `hl.row.4.sub` [text] | flies 17.80→18.48, drags a BLUE box 18.48→18.74, types "Live2D mascot with local AI and persistent me…" word by word (long text) 18.74→21.18, releases →21.40
- 17.88 | Agent 03 (white) | `hl.row.4.metric` [text] | flies 17.88→18.46, drags a BLUE box 18.46→18.72, types "OSS" 83 ms per character 18.72→18.97, releases →19.19
- 17.96 | Agent 19 (white) | `hl.row.4.arrow` [shape] | flies 17.96→18.64, drags a BLUE box 18.64→18.90, box fills RED, element pops in at 19.09, done 19.20, releases →19.42
- 18.05 | Agent 02 (orange) | `hl.row.5.rule` [shape] | flies 18.05→18.53, drags a BLUE box 18.53→18.79, box fills RED, element pops in at 18.99, done 19.09, releases →19.31
- 18.13 | Agent 05 (sky) | `hl.row.5.idx` [text] | flies 18.13→18.68, drags a BLUE box 18.68→18.94, types "05" 125 ms per character 18.94→19.19, releases →19.41
- 18.21 | Agent 20 (violet) | `hl.row.5.title` [text] | flies 18.21→18.74, drags a BLUE box 18.74→19.00, types "13 public repositories" 36 ms per character 19.00→19.79, releases →20.01
- 18.29 | Agent 06 (rose) | `hl.row.5.sub` [text] | flies 18.29→18.74, drags a BLUE box 18.74→19.00, types "AI, bots, games, desktop apps and websites on…" 34 ms per character 19.00→20.75, releases →20.97
- 18.38 | Agent 07 (amber) | `hl.row.5.metric` [text] | flies 18.38→19.09, drags a BLUE box 19.09→19.35, types "13" 125 ms per character 19.35→19.60, releases →19.82
- 18.46 | Agent 08 (green) | `hl.row.5.arrow` [shape] | flies 18.46→19.11, drags a BLUE box 19.11→19.37, box fills RED, element pops in at 19.57, done 19.67, releases →19.89
- 18.54 | Agent 13 (sky) | `hl.row.6.rule` [shape] | flies 18.54→19.13, drags a BLUE box 19.13→19.39, box fills RED, element pops in at 19.58, done 19.69, releases →19.91
- 18.62 | Agent 12 (violet) | `hl.row.6.idx` [text] | flies 18.62→19.24, drags a BLUE box 19.24→19.50, types "06" 125 ms per character 19.50→19.75, releases →19.97
- 18.70 | Agent 14 (rose) | `hl.row.6.title` [text] | flies 18.70→19.28, drags a BLUE box 19.28→19.54, types "Developer, artist and 3D in one" 28 ms per character 19.54→20.41, releases →20.63
- 18.79 | Agent 15 (amber) | `hl.row.6.sub` [text] | flies 18.79→19.32, drags a BLUE box 19.32→19.58, types "Code, Unity, Blender, Krita and Live2D, all b…" 37 ms per character 19.58→21.66, releases →21.88
- 18.87 | Agent 10 (orange) | `hl.row.6.metric` [text] | flies 18.87→19.39, drags a BLUE box 19.39→19.65, types "4+ YRS" 42 ms per character 19.65→19.90, releases →20.12
- 18.95 | Agent 16 (green) | `hl.row.6.arrow` [shape] | flies 18.95→19.50, drags a BLUE box 19.50→19.76, box fills RED, element pops in at 19.95, done 20.06, releases →20.28
- 19.04 | Agent 03 (white) | `hl.live.1` [text] | flies 19.04→19.55, drags a BLUE box 19.55→19.81, types "LATEST ACTIVITY" 30 ms per character 19.81→20.25, releases →20.47
- 19.12 | Agent 01 (teal) | `hl.live.2` [text] | flies 19.12→19.81, drags a BLUE box 19.81→20.07, types "REPOSITORIES" 38 ms per character 20.07→20.52, releases →20.75
- 19.20 | Agent 02 (orange) | `hl.live.3` [text] | flies 19.20→20.06, drags a BLUE box 20.06→20.32, types "FOLLOWERS" 38 ms per character 20.32→20.66, releases →20.88

#### FROM RAW. TO REAL.  (window 22.0–28.0 s, 14 layers, 25 agents on screen at the start)

- **t=22.00** EVENT: rulers fade IN (0.25 s)
- **t=22.00** EVENT: red snap-guide line appears at the left edge of #raw
- **t=22.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #highlights
- **t=22.40** EVENT: red snap-guide line fades out at the left edge of #highlights
- **t=23.20** EVENT: rulers fade OUT (0.25 s)
- **t=28.00** EVENT: rulers fade IN (0.25 s)
- **t=28.00** EVENT: red snap-guide line appears at the left edge of #about
- **t=28.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #raw
- **t=28.40** EVENT: red snap-guide line fades out at the left edge of #raw

- 22.00 | Agent 25 (teal) | `raw.eyebrow` [text] | flies 22.00→22.76, drags a BLUE box 22.76→23.02, types "A LOOK UNDER THE SURFACE" 34 ms per character 23.02→23.84, releases →24.06
- 22.29 | Agent 01 (teal) | `raw.title.1` [text] | flies 22.29→23.08, drags a BLUE box 23.08→23.34, types "FROM RAW." 30 ms per character 23.34→23.61, releases →23.83
- 22.57 | Agent 02 (orange) | `raw.title.2` [text] | flies 22.57→23.32, drags a BLUE box 23.32→23.58, types "TO REAL." 41 ms per character 23.58→23.91, releases →24.13
- 22.86 | Agent 03 (white) | `raw.text` [text] | flies 22.86→23.56, drags a BLUE box 23.56→23.82, types "One interface. Many iterations. Drag to watch…" word by word (long text) 23.82→25.68, releases →25.90
- 23.15 | Agent 04 (violet) | `raw.meta.1` [text] | flies 23.15→24.01, drags a BLUE box 24.01→24.27, types "YULYA STUDIO / 2026" 31 ms per character 24.27→24.85, releases →25.07
- 23.43 | Agent 05 (sky) | `raw.meta.2` [text] | flies 23.43→24.01, drags a BLUE box 24.01→24.27, types "UI DESIGN · FRONT-END · MOTION" 39 ms per character 24.27→25.45, releases →25.67
- 23.72 | Agent 01 (teal) | `raw.stage` [image] | flies 23.72→24.32, drags a BLUE box 24.32→24.58, box fills with the flat blue-grey placeholder + picture icon, real element blur-reveals at 24.93, done 25.53, releases →25.75
- 24.01 | Agent 02 (orange) | `raw.handle` [shape] | flies 24.01→24.80, drags a BLUE box 24.80→25.06, box fills RED, element pops in at 25.25, done 25.36, releases →25.58
- 24.29 | Agent 06 (rose) | `raw.wire` [image] | flies 24.29→24.96, drags a BLUE box 24.96→25.22, box fills with the flat blue-grey placeholder + picture icon, real element blur-reveals at 25.57, done 26.17, releases →26.39
- 24.58 | Agent 07 (amber) | `raw.final` [image] | flies 24.58→25.04, drags a BLUE box 25.04→25.30, box fills with the flat blue-grey placeholder + picture icon, real element blur-reveals at 25.65, done 26.25, releases →26.46
- 24.87 | Agent 04 (violet) | `raw.divider` [shape] | flies 24.87→25.41, drags a BLUE box 25.41→25.67, box fills RED, element pops in at 25.87, done 25.97, releases →26.19
- 25.15 | Agent 26 (orange) | `raw.label.1` [text] | flies 25.15→25.84, drags a BLUE box 25.84→26.10, types "WIREFRAME" 32 ms per character 26.10→26.39, releases →26.61
- 25.44 | Agent 02 (orange) | `raw.label.2` [text] | flies 25.44→26.15, drags a BLUE box 26.15→26.41, types "FINAL UI" 36 ms per character 26.41→26.70, releases →26.91
- 25.73 | Agent 01 (teal) | `raw.hint` [text] | flies 25.73→26.55, drags a BLUE box 26.55→26.81, types "DRAG TO SEE THE PROCESS" 37 ms per character 26.81→27.66, releases →27.88

#### ABOUT (BEHIND THE SCREEN)  (window 28.0–38.0 s, 75 layers, 27 agents on screen at the start)

- **t=28.00** EVENT: rulers fade IN (0.25 s)
- **t=28.00** EVENT: red snap-guide line appears at the left edge of #about
- **t=28.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #raw
- **t=28.40** EVENT: red snap-guide line fades out at the left edge of #raw
- **t=29.20** EVENT: rulers fade OUT (0.25 s)
- **t=38.00** EVENT: rulers fade IN (0.25 s)
- **t=38.00** EVENT: red snap-guide line appears at the left edge of #journey
- **t=38.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #about
- **t=38.40** EVENT: red snap-guide line fades out at the left edge of #about

- 28.00 | Agent 27 (white) | `about.rule` [shape] | flies 28.00→28.64, drags a BLUE box 28.64→28.89, box fills RED, element pops in at 29.09, done 29.20, releases →29.41
- 28.11 | Agent 01 (teal) | `about.eyebrow.rule` [shape] | flies 28.11→28.56, drags a BLUE box 28.56→28.82, box fills RED, element pops in at 29.01, done 29.12, releases →29.34
- 28.21 | Agent 02 (orange) | `about.eyebrow` [text] | flies 28.21→28.67, drags a BLUE box 28.67→28.93, types "02 / BEHIND THE SCREEN" 29 ms per character 28.93→29.57, releases →29.79
- 28.32 | Agent 03 (white) | `about.title.1` [text] | flies 28.32→29.17, drags a BLUE box 29.17→29.43, types "CODE THAT WORKS." 29 ms per character 29.43→29.90, releases →30.12
- 28.42 | Agent 04 (violet) | `about.title.2` [text] | flies 28.42→29.18, drags a BLUE box 29.18→29.44, types "DESIGN THAT FEELS." 29 ms per character 29.44→29.97, releases →30.19
- 28.53 | Agent 05 (sky) | `about.text` [text] | flies 28.53→29.19, drags a BLUE box 29.19→29.45, types "I'm Mohieth Mayura S Y, a full stack develope…" word by word (long text) 29.45→31.91, releases →32.13
- 28.63 | Agent 06 (rose) | `edu.title` [text] | flies 28.63→29.29, drags a BLUE box 29.29→29.55, types "EDUCATION & SKILLS" 39 ms per character 29.55→30.26, releases →30.48
- 28.74 | Agent 07 (amber) | `edu.label` [text] | flies 28.74→29.42, drags a BLUE box 29.42→29.68, types "EDUCATION" 32 ms per character 29.68→29.97, releases →30.19
- 28.84 | Agent 08 (green) | `edu.row.1.rule` [shape] | flies 28.84→29.37, drags a BLUE box 29.37→29.63, box fills RED, element pops in at 29.83, done 29.93, releases →30.15
- 28.95 | Agent 09 (teal) | `edu.row.1.title` [text] | flies 28.95→29.55, drags a BLUE box 29.55→29.81, types "SFGC" 62 ms per character 29.81→30.06, releases →30.28
- 29.05 | Agent 10 (orange) | `edu.row.1.sub` [text] | flies 29.05→29.88, drags a BLUE box 29.88→30.14, types "Bachelor of Computer Applications (BCA)" 34 ms per character 30.14→31.45, releases →31.67
- 29.16 | Agent 01 (teal) | `edu.row.1.tag` [text] | flies 29.16→29.66, drags a BLUE box 29.66→29.92, types "ONGOING" 36 ms per character 29.92→30.17, releases →30.39
- 29.26 | Agent 11 (white) | `edu.row.2.rule` [shape] | flies 29.26→29.88, drags a BLUE box 29.88→30.14, box fills RED, element pops in at 30.34, done 30.44, releases →30.66
- 29.37 | Agent 12 (violet) | `edu.row.2.title` [text] | flies 29.37→30.08, drags a BLUE box 30.08→30.34, types "Self-driven learning" 35 ms per character 30.34→31.03, releases →31.25
- 29.47 | Agent 13 (sky) | `edu.row.2.sub` [text] | flies 29.47→30.19, drags a BLUE box 30.19→30.45, types "LLM fine-tuning, game development, 3D and dig…" 41 ms per character 30.45→32.62, releases →32.84
- 29.58 | Agent 02 (orange) | `edu.row.2.tag` [text] | flies 29.58→30.20, drags a BLUE box 30.20→30.46, types "2022 — NOW" 32 ms per character 30.46→30.78, releases →31.00
- 29.68 | Agent 14 (rose) | `edu.row.3.rule` [shape] | flies 29.68→30.29, drags a BLUE box 30.29→30.55, box fills RED, element pops in at 30.74, done 30.85, releases →31.07
- 29.79 | Agent 15 (amber) | `edu.row.3.title` [text] | flies 29.79→30.27, drags a BLUE box 30.27→30.54, types "Languages" 29 ms per character 30.54→30.79, releases →31.01
- 29.89 | Agent 16 (green) | `edu.row.3.sub` [text] | flies 29.89→30.50, drags a BLUE box 30.50→30.77, types "English · Kannada · Hindi" 31 ms per character 30.77→31.53, releases →31.75
- 30.00 | Agent 03 (white) | `toolkit.label` [text] | flies 30.00→30.64, drags a BLUE box 30.64→30.90, types "CREATIVE TOOLKIT" 35 ms per character 30.90→31.46, releases →31.68
- 30.11 | Agent 04 (violet) | `software.rail` [shape] | flies 30.11→30.65, drags a BLUE box 30.65→30.91, box fills RED, element pops in at 31.11, done 31.21, releases →31.43
- 30.21 | Agent 01 (teal) | `toolkit.chip.1` [text] | flies 30.21→31.08, drags a BLUE box 31.08→31.34, types "Full Stack Development" 33 ms per character 31.34→32.06, releases →32.28
- 30.32 | Agent 06 (rose) | `toolkit.chip.2` [text] | flies 30.32→30.94, drags a BLUE box 30.94→31.20, types "AI & LLM Fine-Tuning" 31 ms per character 31.20→31.82, releases →32.04
- 30.42 | Agent 07 (amber) | `toolkit.chip.3` [text] | flies 30.42→31.24, drags a BLUE box 31.24→31.50, types "Discord Bots" 35 ms per character 31.50→31.91, releases →32.13
- 30.53 | Agent 08 (green) | `toolkit.chip.4` [text] | flies 30.53→31.15, drags a BLUE box 31.15→31.41, types "Game Development" 39 ms per character 31.41→32.03, releases →32.25
- 30.63 | Agent 09 (teal) | `toolkit.chip.5` [text] | flies 30.63→31.39, drags a BLUE box 31.39→31.65, types "3D Modelling" 29 ms per character 31.65→32.00, releases →32.22
- 30.74 | Agent 11 (white) | `toolkit.chip.6` [text] | flies 30.74→31.23, drags a BLUE box 31.23→31.50, types "Digital Art" 31 ms per character 31.50→31.83, releases →32.05
- 30.84 | Agent 02 (orange) | `toolkit.chip.7` [text] | flies 30.84→31.51, drags a BLUE box 31.51→31.77, types "Live2D Rigging" 30 ms per character 31.77→32.18, releases →32.40
- 30.95 | Agent 14 (rose) | `toolkit.chip.8` [text] | flies 30.95→31.80, drags a BLUE box 31.80→32.06, types "UI & Web Design" 37 ms per character 32.06→32.61, releases →32.83
- 31.05 | Agent 28 (violet) | `toolkit.chip.9` [text] | flies 31.05→31.81, drags a BLUE box 31.81→32.07, types "Desktop Apps" 29 ms per character 32.07→32.42, releases →32.64
- 31.16 | Agent 12 (violet) | `toolkit.chip.10` [text] | flies 31.16→31.85, drags a BLUE box 31.85→32.11, types "Python" 42 ms per character 32.11→32.36, releases →32.58
- 31.26 | Agent 04 (violet) | `toolkit.chip.11` [text] | flies 31.26→31.69, drags a BLUE box 31.69→31.95, types "JavaScript" 34 ms per character 31.95→32.29, releases →32.51
- 31.37 | Agent 15 (amber) | `software.1` [logo] | flies 31.37→32.17, drags a RED outline box 32.17→32.43, "Unity" tile pops in at 32.62, done 32.73, releases →32.95
- 31.48 | Agent 03 (white) | `software.2` [logo] | flies 31.48→32.09, drags a RED outline box 32.09→32.35, "Blender" tile pops in at 32.55, done 32.65, releases →32.87
- 31.58 | Agent 10 (orange) | `software.3` [logo] | flies 31.58→32.12, drags a RED outline box 32.12→32.38, "Krita" tile pops in at 32.57, done 32.67, releases →32.90
- 31.68 | Agent 16 (green) | `software.4` [logo] | flies 31.68→32.24, drags a RED outline box 32.24→32.50, "Live2D" tile pops in at 32.70, done 32.80, releases →33.02
- 31.79 | Agent 17 (teal) | `software.5` [logo] | flies 31.79→32.27, drags a RED outline box 32.27→32.53, "Python" tile pops in at 32.72, done 32.83, releases →33.05
- 31.90 | Agent 06 (rose) | `software.6` [logo] | flies 31.90→32.44, drags a RED outline box 32.44→32.70, "JavaScript" tile pops in at 32.90, done 33.00, releases →33.22
- 32.00 | Agent 05 (sky) | `software.7` [logo] | flies 32.00→32.62, drags a RED outline box 32.62→32.88, "Ollama" tile pops in at 33.07, done 33.18, releases →33.40
- 32.11 | Agent 01 (teal) | `software.8` [logo] | flies 32.11→32.66, drags a RED outline box 32.66→32.92, "Git" tile pops in at 33.12, done 33.22, releases →33.44
- 32.21 | Agent 02 (orange) | `process.title` [text] | flies 32.21→32.78, drags a BLUE box 32.78→33.05, types "FROM IDEA TO LAUNCH" 32 ms per character 33.05→33.65, releases →33.87
- 32.32 | Agent 04 (violet) | `process.spine` [shape] | flies 32.32→32.86, drags a BLUE box 32.86→33.12, box fills RED, element pops in at 33.32, done 33.42, releases →33.64
- 32.42 | Agent 07 (amber) | `process.1.num` [text] | flies 32.42→32.94, drags a BLUE box 32.94→33.20, types "01" 125 ms per character 33.20→33.45, releases →33.67
- 32.53 | Agent 08 (green) | `process.1.line` [shape] | flies 32.53→32.99, drags a BLUE box 32.99→33.25, box fills RED, element pops in at 33.44, done 33.55, releases →33.77
- 32.63 | Agent 09 (teal) | `process.1.node` [shape] | flies 32.63→33.15, drags a BLUE box 33.15→33.41, box fills RED, element pops in at 33.60, done 33.70, releases →33.92
- 32.74 | Agent 03 (white) | `process.1.title` [text] | flies 32.74→33.56, drags a BLUE box 33.56→33.83, types "THE IDEA" 38 ms per character 33.83→34.13, releases →34.35
- 32.84 | Agent 10 (orange) | `process.1.text` [text] | flies 32.84→33.49, drags a BLUE box 33.49→33.75, types "Understand the problem and who it is for. Def…" word by word (long text) 33.75→35.88, releases →36.10
- 32.95 | Agent 11 (white) | `process.2.num` [text] | flies 32.95→33.60, drags a BLUE box 33.60→33.86, types "02" 125 ms per character 33.86→34.11, releases →34.33
- 33.05 | Agent 06 (rose) | `process.2.line` [shape] | flies 33.05→33.65, drags a BLUE box 33.65→33.91, box fills RED, element pops in at 34.11, done 34.21, releases →34.43
- 33.16 | Agent 12 (violet) | `process.2.node` [shape] | flies 33.16→33.72, drags a BLUE box 33.72→33.98, box fills RED, element pops in at 34.17, done 34.28, releases →34.50
- 33.27 | Agent 01 (teal) | `process.2.title` [text] | flies 33.27→34.13, drags a BLUE box 34.13→34.39, types "THE PLAN" 38 ms per character 34.39→34.69, releases →34.91
- 33.37 | Agent 05 (sky) | `process.2.text` [text] | flies 33.37→33.93, drags a BLUE box 33.93→34.19, types "Pick the stack, sketch the architecture and w…" word by word (long text) 34.19→36.02, releases →36.24
- 33.48 | Agent 04 (violet) | `process.3.num` [text] | flies 33.48→34.27, drags a BLUE box 34.27→34.53, types "03" 125 ms per character 34.53→34.78, releases →35.00
- 33.58 | Agent 07 (amber) | `process.3.line` [shape] | flies 33.58→34.21, drags a BLUE box 34.21→34.47, box fills RED, element pops in at 34.67, done 34.77, releases →34.99
- 33.69 | Agent 02 (orange) | `process.3.node` [shape] | flies 33.69→34.12, drags a BLUE box 34.12→34.38, box fills RED, element pops in at 34.57, done 34.68, releases →34.90
- 33.79 | Agent 08 (green) | `process.3.title` [text] | flies 33.79→34.63, drags a BLUE box 34.63→34.89, types "THE BUILD" 42 ms per character 34.89→35.27, releases →35.49
- 33.90 | Agent 09 (teal) | `process.3.text` [text] | flies 33.90→34.44, drags a BLUE box 34.44→34.70, types "Code, draw and model together, one working pi…" 40 ms per character 34.70→37.07, releases →37.29
- 34.00 | Agent 13 (sky) | `process.4.num` [text] | flies 34.00→34.70, drags a BLUE box 34.70→34.97, types "04" 125 ms per character 34.97→35.22, releases →35.44
- 34.11 | Agent 14 (rose) | `process.4.line` [shape] | flies 34.11→34.75, drags a BLUE box 34.75→35.01, box fills RED, element pops in at 35.21, done 35.31, releases →35.53
- 34.21 | Agent 03 (white) | `process.4.node` [shape] | flies 34.21→34.66, drags a BLUE box 34.66→34.92, box fills RED, element pops in at 35.12, done 35.22, releases →35.44
- 34.32 | Agent 06 (rose) | `process.4.title` [text] | flies 34.32→34.85, drags a BLUE box 34.85→35.11, types "THE POLISH" 36 ms per character 35.11→35.46, releases →35.68
- 34.42 | Agent 11 (white) | `process.4.text` [text] | flies 34.42→34.90, drags a BLUE box 34.90→35.16, types "Speed, motion, accessibility and the small de…" word by word (long text) 35.16→37.58, releases →37.80
- 34.53 | Agent 12 (violet) | `process.5.num` [text] | flies 34.53→35.01, drags a BLUE box 35.01→35.27, types "05" 125 ms per character 35.27→35.52, releases →35.74
- 34.63 | Agent 15 (amber) | `process.5.node` [shape] | flies 34.63→35.43, drags a BLUE box 35.43→35.69, box fills RED, element pops in at 35.89, done 35.99, releases →36.21
- 34.74 | Agent 01 (teal) | `process.5.title` [text] | flies 34.74→35.56, drags a BLUE box 35.56→35.82, types "THE LAUNCH" 37 ms per character 35.82→36.19, releases →36.41
- 34.84 | Agent 02 (orange) | `process.5.text` [text] | flies 34.84→35.42, drags a BLUE box 35.42→35.68, types "Ship it, watch real usage, and keep improving…" 40 ms per character 35.68→37.66, releases →37.88
- 34.95 | Agent 04 (violet) | `quote.card` [shape] | flies 34.95→35.71, drags a BLUE box 35.71→35.97, box fills RED, element pops in at 36.16, done 36.27, releases →36.49
- 35.05 | Agent 07 (amber) | `quote.icon` [shape] | flies 35.05→35.79, drags a BLUE box 35.79→36.05, box fills RED, element pops in at 36.24, done 36.35, releases →36.57
- 35.16 | Agent 16 (green) | `quote.sheen` [shape] | flies 35.16→35.65, drags a BLUE box 35.65→35.91, box fills RED, element pops in at 36.10, done 36.21, releases →36.43
- 35.27 | Agent 03 (white) | `quote.l1` [text] | flies 35.27→35.85, drags a BLUE box 35.85→36.11, types "Build it like an engineer." 38 ms per character 36.11→37.10, releases →37.33
- 35.37 | Agent 08 (green) | `quote.l2` [text] | flies 35.37→36.11, drags a BLUE box 36.11→36.37, types "Finish it like an artist." 32 ms per character 36.37→37.17, releases →37.39
- 35.48 | Agent 06 (rose) | `quote.sig` [text] | flies 35.48→36.19, drags a BLUE box 36.19→36.45, types "Mayura" 42 ms per character 36.45→36.70, releases →36.92
- 35.58 | Agent 12 (violet) | `quote.foot.1` [text] | flies 35.58→36.07, drags a BLUE box 36.07→36.33, types "LET'S BUILD" 39 ms per character 36.33→36.76, releases →36.98
- 35.69 | Agent 13 (sky) | `quote.foot.2` [text] | flies 35.69→36.53, drags a BLUE box 36.53→36.79, types "SOMETHING WORTH USING" 31 ms per character 36.79→37.44, releases →37.66
- 35.79 | Agent 14 (rose) | `quote.star` [shape] | flies 35.79→36.65, drags a BLUE box 36.65→36.91, box fills RED, element pops in at 37.10, done 37.21, releases →37.43

#### THE JOURNEY  (window 38.0–45.0 s, 60 layers, 28 agents on screen at the start)

- **t=38.00** EVENT: rulers fade IN (0.25 s)
- **t=38.00** EVENT: red snap-guide line appears at the left edge of #journey
- **t=38.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #about
- **t=38.40** EVENT: red snap-guide line fades out at the left edge of #about
- **t=39.20** EVENT: rulers fade OUT (0.25 s)
- **t=45.00** EVENT: rulers fade IN (0.25 s)
- **t=45.00** EVENT: red snap-guide line appears at the left edge of #contact
- **t=45.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #journey
- **t=45.40** EVENT: red snap-guide line fades out at the left edge of #journey

- 38.00 | Agent 01 (teal) | `jr.rule` [shape] | flies 38.00→38.82, drags a BLUE box 38.82→39.08, box fills RED, element pops in at 39.27, done 39.38, releases →39.60
- 38.09 | Agent 02 (orange) | `jr.eyebrow` [text] | flies 38.09→38.71, drags a BLUE box 38.71→38.97, types "03 / THE JOURNEY" 41 ms per character 38.97→39.63, releases →39.85
- 38.18 | Agent 03 (white) | `jr.title` [text] | flies 38.18→38.65, drags a BLUE box 38.65→38.91, types "KEEP MOVING. KEEP BUILDING." 31 ms per character 38.91→39.76, releases →39.98
- 38.27 | Agent 04 (violet) | `jr.resume` [text] | flies 38.27→38.82, drags a BLUE box 38.82→39.08, types "RESUME ⤓" 41 ms per character 39.08→39.41, releases →39.63
- 38.35 | Agent 05 (sky) | `jr.spine` [shape] | flies 38.35→38.91, drags a BLUE box 38.91→39.17, box fills RED, element pops in at 39.37, done 39.47, releases →39.69
- 38.44 | Agent 06 (rose) | `jr.row.1.rule` [shape] | flies 38.44→38.96, drags a BLUE box 38.96→39.22, box fills RED, element pops in at 39.41, done 39.52, releases →39.74
- 38.53 | Agent 07 (amber) | `jr.row.1.date` [text] | flies 38.53→39.02, drags a BLUE box 39.02→39.28, types "2026 · NOW" 35 ms per character 39.28→39.64, releases →39.86
- 38.62 | Agent 08 (green) | `jr.row.1.node` [shape] | flies 38.62→39.05, drags a BLUE box 39.05→39.31, box fills RED, element pops in at 39.50, done 39.61, releases →39.83
- 38.71 | Agent 09 (teal) | `jr.row.1.role` [text] | flies 38.71→39.45, drags a BLUE box 39.45→39.71, types "Founder & Lead Developer" 40 ms per character 39.71→40.66, releases →40.88
- 38.79 | Agent 10 (orange) | `jr.row.1.sub` [text] | flies 38.79→39.30, drags a BLUE box 39.30→39.56, types "Yulya, the AI ecosystem" 40 ms per character 39.56→40.48, releases →40.70
- 38.88 | Agent 11 (white) | `jr.row.1.plus` [shape] | flies 38.88→39.42, drags a BLUE box 39.42→39.68, box fills RED, element pops in at 39.88, done 39.98, releases →40.20
- 38.97 | Agent 12 (violet) | `jr.row.1.desc` [text] | flies 38.97→39.55, drags a BLUE box 39.55→39.81, types "Building the whole Yulya world solo: a multim…" word by word (long text) 39.81→41.94, releases →42.16
- 39.06 | Agent 29 (sky) | `jr.row.2.rule` [shape] | flies 39.06→39.80, drags a BLUE box 39.80→40.06, box fills RED, element pops in at 40.26, done 40.36, releases →40.58
- 39.15 | Agent 13 (sky) | `jr.row.2.date` [text] | flies 39.15→39.90, drags a BLUE box 39.90→40.16, types "2025 · NOW" 31 ms per character 40.16→40.47, releases →40.69
- 39.23 | Agent 14 (rose) | `jr.row.2.node` [shape] | flies 39.23→39.89, drags a BLUE box 39.89→40.15, box fills RED, element pops in at 40.34, done 40.45, releases →40.67
- 39.32 | Agent 15 (amber) | `jr.row.2.role` [text] | flies 39.32→39.75, drags a BLUE box 39.75→40.01, types "BCA Student" 38 ms per character 40.01→40.43, releases →40.65
- 39.41 | Agent 01 (teal) | `jr.row.2.sub` [text] | flies 39.41→39.90, drags a BLUE box 39.90→40.16, types "SFGC, Bengaluru" 38 ms per character 40.16→40.74, releases →40.96
- 39.50 | Agent 04 (violet) | `jr.row.2.plus` [shape] | flies 39.50→40.22, drags a BLUE box 40.22→40.48, box fills RED, element pops in at 40.67, done 40.78, releases →41.00
- 39.59 | Agent 05 (sky) | `jr.row.3.rule` [shape] | flies 39.59→40.05, drags a BLUE box 40.05→40.31, box fills RED, element pops in at 40.51, done 40.61, releases →40.83
- 39.68 | Agent 02 (orange) | `jr.row.3.date` [text] | flies 39.68→40.10, drags a BLUE box 40.10→40.36, types "2024 · 2026" 37 ms per character 40.36→40.77, releases →40.99
- 39.77 | Agent 03 (white) | `jr.row.3.node` [shape] | flies 39.77→40.58, drags a BLUE box 40.58→40.84, box fills RED, element pops in at 41.04, done 41.14, releases →41.36
- 39.85 | Agent 06 (rose) | `jr.row.3.role` [text] | flies 39.85→40.60, drags a BLUE box 40.60→40.86, types "Full Stack & AI Developer" 38 ms per character 40.86→41.81, releases →42.03
- 39.94 | Agent 07 (amber) | `jr.row.3.sub` [text] | flies 39.94→40.58, drags a BLUE box 40.58→40.84, types "Independent projects" 34 ms per character 40.84→41.52, releases →41.74
- 40.03 | Agent 08 (green) | `jr.row.3.plus` [shape] | flies 40.03→40.80, drags a BLUE box 40.80→41.06, box fills RED, element pops in at 41.25, done 41.36, releases →41.58
- 40.12 | Agent 11 (white) | `jr.row.4.rule` [shape] | flies 40.12→40.86, drags a BLUE box 40.86→41.12, box fills RED, element pops in at 41.31, done 41.42, releases →41.64
- 40.21 | Agent 16 (green) | `jr.row.4.date` [text] | flies 40.21→40.72, drags a BLUE box 40.72→40.98, types "2022 · NOW" 32 ms per character 40.98→41.30, releases →41.52
- 40.29 | Agent 17 (teal) | `jr.row.4.node` [shape] | flies 40.29→40.99, drags a BLUE box 40.99→41.25, box fills RED, element pops in at 41.45, done 41.55, releases →41.77
- 40.38 | Agent 18 (orange) | `jr.row.4.role` [text] | flies 40.38→41.11, drags a BLUE box 41.11→41.37, types "Digital Artist & Designer" 34 ms per character 41.37→42.22, releases →42.44
- 40.47 | Agent 13 (sky) | `jr.row.4.sub` [text] | flies 40.47→41.25, drags a BLUE box 41.25→41.51, types "Krita · Live2D · Blender" 28 ms per character 41.51→42.19, releases →42.41
- 40.56 | Agent 10 (orange) | `jr.row.4.plus` [shape] | flies 40.56→41.21, drags a BLUE box 41.21→41.47, box fills RED, element pops in at 41.66, done 41.77, releases →41.99
- 40.65 | Agent 05 (sky) | `jr.row.5.rule` [shape] | flies 40.65→41.30, drags a BLUE box 41.30→41.56, box fills RED, element pops in at 41.76, done 41.86, releases →42.08
- 40.73 | Agent 09 (teal) | `jr.row.5.date` [text] | flies 40.73→41.59, drags a BLUE box 41.59→41.85, types "2022" 62 ms per character 41.85→42.10, releases →42.32
- 40.82 | Agent 01 (teal) | `jr.row.5.node` [shape] | flies 40.82→41.56, drags a BLUE box 41.56→41.82, box fills RED, element pops in at 42.01, done 42.12, releases →42.34
- 40.91 | Agent 02 (orange) | `jr.row.5.role` [text] | flies 40.91→41.52, drags a BLUE box 41.52→41.78, types "Where It Began" 37 ms per character 41.78→42.30, releases →42.52
- 41.00 | Agent 04 (violet) | `jr.row.5.sub` [text] | flies 41.00→41.87, drags a BLUE box 41.87→42.13, types "First scripts, first games, first designs" 30 ms per character 42.13→43.38, releases →43.60
- 41.09 | Agent 14 (rose) | `jr.row.5.plus` [shape] | flies 41.09→41.78, drags a BLUE box 41.78→42.04, box fills RED, element pops in at 42.24, done 42.34, releases →42.56
- 41.18 | Agent 03 (white) | `ms.label` [text] | flies 41.18→41.74, drags a BLUE box 41.74→42.00, types "A FEW MILESTONES" 34 ms per character 42.00→42.54, releases →42.76
- 41.27 | Agent 15 (amber) | `ms.rule` [shape] | flies 41.27→41.79, drags a BLUE box 41.79→42.05, box fills RED, element pops in at 42.24, done 42.35, releases →42.57
- 41.35 | Agent 16 (green) | `ms.title.1` [text] | flies 41.35→42.21, drags a BLUE box 42.21→42.47, types "LITTLE WINS." 32 ms per character 42.47→42.85, releases →43.07
- 41.44 | Agent 08 (green) | `ms.title.2` [text] | flies 41.44→42.23, drags a BLUE box 42.23→42.49, types "BIG MEANING." 31 ms per character 42.49→42.86, releases →43.08
- 41.53 | Agent 07 (amber) | `ms.row.1.rule` [shape] | flies 41.53→42.36, drags a BLUE box 42.36→42.62, box fills RED, element pops in at 42.82, done 42.92, releases →43.14
- 41.62 | Agent 11 (white) | `ms.row.1.idx` [text] | flies 41.62→42.44, drags a BLUE box 42.44→42.70, types "01" 125 ms per character 42.70→42.95, releases →43.16
- 41.71 | Agent 17 (teal) | `ms.row.1.title` [text] | flies 41.71→42.54, drags a BLUE box 42.54→42.80, types "Yulya Studio goes live" 30 ms per character 42.80→43.46, releases →43.68
- 41.79 | Agent 10 (orange) | `ms.row.1.year` [text] | flies 41.79→42.35, drags a BLUE box 42.35→42.61, types "2026" 62 ms per character 42.61→42.86, releases →43.08
- 41.88 | Agent 05 (sky) | `ms.row.1.arrow` [shape] | flies 41.88→42.42, drags a BLUE box 42.42→42.68, box fills RED, element pops in at 42.88, done 42.98, releases →43.20
- 41.97 | Agent 06 (rose) | `ms.row.2.rule` [shape] | flies 41.97→42.80, drags a BLUE box 42.80→43.06, box fills RED, element pops in at 43.26, done 43.36, releases →43.58
- 42.06 | Agent 12 (violet) | `ms.row.2.idx` [text] | flies 42.06→42.51, drags a BLUE box 42.51→42.77, types "02" 125 ms per character 42.77→43.02, releases →43.24
- 42.15 | Agent 01 (teal) | `ms.row.2.title` [text] | flies 42.15→42.73, drags a BLUE box 42.73→42.99, types "Yulya Discord bot launched, free" 36 ms per character 42.99→44.16, releases →44.38
- 42.23 | Agent 09 (teal) | `ms.row.2.year` [text] | flies 42.23→42.97, drags a BLUE box 42.97→43.23, types "2026" 62 ms per character 43.23→43.48, releases →43.70
- 42.32 | Agent 02 (orange) | `ms.row.2.arrow` [shape] | flies 42.32→42.83, drags a BLUE box 42.83→43.09, box fills RED, element pops in at 43.28, done 43.38, releases →43.60
- 42.41 | Agent 13 (sky) | `ms.row.3.rule` [shape] | flies 42.41→42.88, drags a BLUE box 42.88→43.14, box fills RED, element pops in at 43.33, done 43.44, releases →43.66
- 42.50 | Agent 14 (rose) | `ms.row.3.idx` [text] | flies 42.50→42.96, drags a BLUE box 42.96→43.22, types "03" 125 ms per character 43.22→43.47, releases →43.69
- 42.59 | Agent 03 (white) | `ms.row.3.title` [text] | flies 42.59→43.36, drags a BLUE box 43.36→43.62, types "Fine-tuned models on Hugging Face" 32 ms per character 43.62→44.66, releases →44.88
- 42.68 | Agent 15 (amber) | `ms.row.3.year` [text] | flies 42.68→43.45, drags a BLUE box 43.45→43.71, types "2026" 62 ms per character 43.71→43.96, releases →44.18
- 42.77 | Agent 18 (orange) | `ms.row.3.arrow` [shape] | flies 42.77→43.52, drags a BLUE box 43.52→43.78, box fills RED, element pops in at 43.98, done 44.08, releases →44.30
- 42.85 | Agent 16 (green) | `ms.row.4.rule` [shape] | flies 42.85→43.44, drags a BLUE box 43.44→43.70, box fills RED, element pops in at 43.90, done 44.00, releases →44.22
- 42.94 | Agent 07 (amber) | `ms.row.4.idx` [text] | flies 42.94→43.38, drags a BLUE box 43.38→43.64, types "04" 125 ms per character 43.64→43.89, releases →44.11
- 43.03 | Agent 05 (sky) | `ms.row.4.title` [text] | flies 43.03→43.59, drags a BLUE box 43.59→43.85, types "13 public repositories" 35 ms per character 43.85→44.63, releases →44.85
- 43.12 | Agent 08 (green) | `ms.row.4.year` [text] | flies 43.12→43.68, drags a BLUE box 43.68→43.94, types "NOW" 83 ms per character 43.94→44.19, releases →44.41
- 43.21 | Agent 10 (orange) | `ms.row.4.arrow` [shape] | flies 43.21→43.87, drags a BLUE box 43.87→44.13, box fills RED, element pops in at 44.33, done 44.43, releases →44.65

#### CONTACT  (window 45.0–49.4 s, 42 layers, 29 agents on screen at the start)

- **t=45.00** EVENT: rulers fade IN (0.25 s)
- **t=45.00** EVENT: red snap-guide line appears at the left edge of #contact
- **t=45.00** EVENT: blue commit sweep (0.7 s) runs along the bottom of #journey
- **t=45.40** EVENT: red snap-guide line fades out at the left edge of #journey
- **t=46.20** EVENT: rulers fade OUT (0.25 s)
- **t=49.40** EVENT: rulers fade IN (0.25 s)
- **t=49.40** EVENT: red snap-guide line appears at the left edge of #footer
- **t=49.40** EVENT: blue commit sweep (0.7 s) runs along the bottom of #contact
- **t=49.80** EVENT: red snap-guide line fades out at the left edge of #contact

- 45.00 | Agent 01 (teal) | `ct.rule` [shape] | flies 45.00→45.51, drags a BLUE box 45.51→45.77, box fills RED, element pops in at 45.97, done 46.07, releases →46.29
- 45.07 | Agent 02 (orange) | `ct.eyebrow` [text] | flies 45.07→45.53, drags a BLUE box 45.53→45.79, types "04 / YOUR NEXT PROJECT" 41 ms per character 45.79→46.69, releases →46.91
- 45.13 | Agent 03 (white) | `ct.title.1` [text] | flies 45.13→45.63, drags a BLUE box 45.63→45.89, types "LET'S WORK" 36 ms per character 45.89→46.25, releases →46.47
- 45.20 | Agent 04 (violet) | `ct.title.2` [text] | flies 45.20→45.73, drags a BLUE box 45.73→45.99, types "TOGETHER." 34 ms per character 45.99→46.30, releases →46.52
- 45.27 | Agent 05 (sky) | `ct.dot` [shape] | flies 45.27→45.95, drags a BLUE box 45.95→46.21, box fills RED, element pops in at 46.41, done 46.51, releases →46.73
- 45.33 | Agent 06 (rose) | `ct.text` [text] | flies 45.33→46.12, drags a BLUE box 46.12→46.38, types "Got an idea you want to bring to life? Let's …" word by word (long text) 46.38→48.10, releases →48.32
- 45.40 | Agent 07 (amber) | `ct.cta.circle` [shape] | flies 45.40→45.84, drags a BLUE box 45.84→46.10, box fills RED, element pops in at 46.29, done 46.40, releases →46.62
- 45.46 | Agent 08 (green) | `ct.cta.label` [text] | flies 45.46→46.33, drags a BLUE box 46.33→46.59, types "START A CONVERSATION" 42 ms per character 46.59→47.43, releases →47.65
- 45.53 | Agent 09 (teal) | `ct.row.1.rule` [shape] | flies 45.53→46.33, drags a BLUE box 46.33→46.59, box fills RED, element pops in at 46.79, done 46.89, releases →47.11
- 45.60 | Agent 10 (orange) | `ct.row.1.icon` [shape] | flies 45.60→46.27, drags a BLUE box 46.27→46.53, box fills RED, element pops in at 46.73, done 46.83, releases →47.05
- 45.66 | Agent 11 (white) | `ct.row.1.label` [text] | flies 45.66→46.48, drags a BLUE box 46.48→46.74, types "EMAIL" 50 ms per character 46.74→46.99, releases →47.21
- 45.73 | Agent 12 (violet) | `ct.row.1.value` [text] | flies 45.73→46.15, drags a BLUE box 46.15→46.41, types "moheithmayura@gmail.com" 32 ms per character 46.41→47.15, releases →47.37
- 45.80 | Agent 13 (sky) | `ct.row.1.arrow` [shape] | flies 45.80→46.35, drags a BLUE box 46.35→46.61, box fills RED, element pops in at 46.81, done 46.91, releases →47.13
- 45.86 | Agent 14 (rose) | `ct.row.2.rule` [shape] | flies 45.86→46.61, drags a BLUE box 46.61→46.87, box fills RED, element pops in at 47.06, done 47.17, releases →47.39
- 45.93 | Agent 15 (amber) | `ct.row.2.icon` [shape] | flies 45.93→46.76, drags a BLUE box 46.76→47.02, box fills RED, element pops in at 47.22, done 47.32, releases →47.54
- 45.99 | Agent 16 (green) | `ct.row.2.label` [text] | flies 45.99→46.52, drags a BLUE box 46.52→46.78, types "INSTAGRAM" 41 ms per character 46.78→47.15, releases →47.37
- 46.06 | Agent 17 (teal) | `ct.row.2.value` [text] | flies 46.06→46.51, drags a BLUE box 46.51→46.77, types "@moheith_mayura" 30 ms per character 46.77→47.23, releases →47.45
- 46.13 | Agent 01 (teal) | `ct.row.2.arrow` [shape] | flies 46.13→46.77, drags a BLUE box 46.77→47.03, box fills RED, element pops in at 47.23, done 47.33, releases →47.55
- 46.19 | Agent 18 (orange) | `ct.row.3.rule` [shape] | flies 46.19→46.71, drags a BLUE box 46.71→46.97, box fills RED, element pops in at 47.16, done 47.27, releases →47.49
- 46.26 | Agent 03 (white) | `ct.row.3.icon` [shape] | flies 46.26→46.83, drags a BLUE box 46.83→47.09, box fills RED, element pops in at 47.29, done 47.39, releases →47.61
- 46.33 | Agent 04 (violet) | `ct.row.3.label` [text] | flies 46.33→46.79, drags a BLUE box 46.79→47.05, types "WHATSAPP" 31 ms per character 47.05→47.30, releases →47.52
- 46.39 | Agent 19 (white) | `ct.row.3.value` [text] | flies 46.39→47.24, drags a BLUE box 47.24→47.50, types "+91 86602 27877" 30 ms per character 47.50→47.95, releases →48.17
- 46.46 | Agent 07 (amber) | `ct.row.3.arrow` [shape] | flies 46.46→47.09, drags a BLUE box 47.09→47.35, box fills RED, element pops in at 47.54, done 47.65, releases →47.87
- 46.52 | Agent 05 (sky) | `ct.row.4.rule` [shape] | flies 46.52→47.34, drags a BLUE box 47.34→47.59, box fills RED, element pops in at 47.79, done 47.90, releases →48.12
- 46.59 | Agent 20 (violet) | `ct.row.4.icon` [shape] | flies 46.59→47.29, drags a BLUE box 47.29→47.55, box fills RED, element pops in at 47.75, done 47.85, releases →48.07
- 46.66 | Agent 21 (sky) | `ct.row.4.label` [text] | flies 46.66→47.26, drags a BLUE box 47.26→47.52, types "BASED IN" 38 ms per character 47.52→47.82, releases →48.04
- 46.72 | Agent 02 (orange) | `ct.row.4.value` [text] | flies 46.72→47.29, drags a BLUE box 47.29→47.55, types "Bengaluru, India" 39 ms per character 47.55→48.17, releases →48.39
- 46.79 | Agent 22 (rose) | `ct.row.4.arrow` [shape] | flies 46.79→47.34, drags a BLUE box 47.34→47.60, box fills RED, element pops in at 47.80, done 47.90, releases →48.12
- 46.86 | Agent 10 (orange) | `ct.card` [card] | flies 46.86→47.61, drags a RED outline box 47.61→47.87, card pops in at 48.13, done 48.27, releases →48.49
- 46.92 | Agent 09 (teal) | `ct.card.term.1` [text] | flies 46.92→47.67, drags a BLUE box 47.67→47.93, types "$ whoami" 38 ms per character 47.93→48.23, releases →48.45
- 46.99 | Agent 13 (sky) | `ct.card.term.2` [text] | flies 46.99→47.76, drags a BLUE box 47.76→48.02, types "$ ls projects/" 34 ms per character 48.02→48.49, releases →48.72
- 47.06 | Agent 11 (white) | `ct.card.term.3` [text] | flies 47.06→47.91, drags a BLUE box 47.91→48.17, types "$ ./ship --now" 35 ms per character 48.17→48.67, releases →48.89
- 47.12 | Agent 23 (amber) | `ct.card.poster.1` [text] | flies 47.12→47.94, drags a BLUE box 47.94→48.20, types "BUILD IT." 38 ms per character 48.20→48.54, releases →48.76
- 47.19 | Agent 12 (violet) | `ct.card.poster.2` [text] | flies 47.19→48.03, drags a BLUE box 48.03→48.29, types "MAKE IT FEEL ALIVE." 31 ms per character 48.29→48.88, releases →49.10
- 47.25 | Agent 14 (rose) | `ct.card.label` [text] | flies 47.25→47.92, drags a BLUE box 47.92→48.18, types "MAYURA●" 36 ms per character 48.18→48.43, releases →48.65
- 47.32 | Agent 04 (violet) | `ct.card.btn` [shape] | flies 47.32→48.11, drags a BLUE box 48.11→48.37, box fills RED, element pops in at 48.57, done 48.67, releases →48.89
- 47.39 | Agent 01 (teal) | `ct.brief.input` [text] | flies 47.39→47.92, drags a BLUE box 47.92→48.18, types "Tell me about your project" 31 ms per character 48.18→48.99, releases →49.21
- 47.45 | Agent 03 (white) | `ct.brief.rule` [shape] | flies 47.45→47.91, drags a BLUE box 47.91→48.17, box fills RED, element pops in at 48.37, done 48.47, releases →48.69
- 47.52 | Agent 08 (green) | `ct.brief.bar` [shape] | flies 47.52→48.15, drags a BLUE box 48.15→48.41, box fills RED, element pops in at 48.60, done 48.71, releases →48.93
- 47.59 | Agent 15 (amber) | `ct.brief.icon.1` [shape] | flies 47.59→48.26, drags a BLUE box 48.26→48.52, box fills RED, element pops in at 48.72, done 48.82, releases →49.04
- 47.65 | Agent 07 (amber) | `ct.brief.icon.2` [shape] | flies 47.65→48.24, drags a BLUE box 48.24→48.50, box fills RED, element pops in at 48.70, done 48.80, releases →49.02
- 47.72 | Agent 16 (green) | `ct.brief.icon.3` [shape] | flies 47.72→48.50, drags a BLUE box 48.50→48.76, box fills RED, element pops in at 48.95, done 49.06, releases →49.28

#### FOOTER  (window 49.4–51.5 s, 16 layers, 30 agents on screen at the start)

- **t=49.40** EVENT: rulers fade IN (0.25 s)
- **t=49.40** EVENT: red snap-guide line appears at the left edge of #footer
- **t=49.40** EVENT: blue commit sweep (0.7 s) runs along the bottom of #contact
- **t=49.80** EVENT: red snap-guide line fades out at the left edge of #contact
- **t=50.60** EVENT: rulers fade OUT (0.25 s)
- **t=51.52** EVENT: blue commit sweep (0.7 s) runs along the bottom of #footer
- **t=51.92** EVENT: red snap-guide line fades out at the left edge of #footer

- 49.40 | Agent 30 (rose) | `ft.rule` [shape] | flies 49.40→49.79, drags a BLUE box 49.79→49.95, box fills RED, element pops in at 50.08, done 50.14, releases →50.28
- 49.40 | Agent 01 (teal) | `ft.logo` [text] | flies 49.40→49.84, drags a BLUE box 49.84→50.00, types "MAYURA" 27 ms per character 50.00→50.16, releases →50.30
- 49.40 | Agent 02 (orange) | `ft.dot` [shape] | flies 49.40→49.80, drags a BLUE box 49.80→49.97, box fills RED, element pops in at 50.09, done 50.16, releases →50.30
- 49.40 | Agent 03 (white) | `ft.copy` [text] | flies 49.40→49.83, drags a BLUE box 49.83→50.00, types "© 2026 MOHIETH MAYURA S Y. All rights reserve…" 26 ms per character 50.00→51.22, releases →51.36
- 49.40 | Agent 04 (violet) | `ft.time` [text] | flies 49.40→49.93, drags a BLUE box 49.93→50.09, types "Bengaluru · 17:04 IST" 21 ms per character 50.09→50.54, releases →50.68
- 49.40 | Agent 05 (sky) | `ft.social.1` [text] | flies 49.40→49.90, drags a BLUE box 49.90→50.07, types "GitHub" 27 ms per character 50.07→50.23, releases →50.37
- 49.40 | Agent 06 (rose) | `ft.social.2` [text] | flies 49.40→49.68, drags a BLUE box 49.68→49.84, types "LinkedIn" 22 ms per character 49.84→50.02, releases →50.16
- 49.40 | Agent 07 (amber) | `ft.social.3` [text] | flies 49.40→49.91, drags a BLUE box 49.91→50.08, types "X" 160 ms per character 50.08→50.23, releases →50.38
- 49.40 | Agent 08 (green) | `ft.social.4` [text] | flies 49.40→49.75, drags a BLUE box 49.75→49.92, types "Hugging Face" 20 ms per character 49.92→50.16, releases →50.30
- 49.40 | Agent 09 (teal) | `ft.social.5` [text] | flies 49.40→49.69, drags a BLUE box 49.69→49.86, types "Ollama" 27 ms per character 49.86→50.02, releases →50.16
- 49.40 | Agent 10 (orange) | `ft.social.6` [text] | flies 49.40→49.82, drags a BLUE box 49.82→49.98, types "Instagram" 18 ms per character 49.98→50.15, releases →50.29
- 49.40 | Agent 11 (white) | `ft.top` [text] | flies 49.40→49.92, drags a BLUE box 49.92→50.09, types "Back to top ↑" 24 ms per character 50.09→50.41, releases →50.55
- 49.40 | Agent 12 (violet) | `ft.accent.1` [shape] | flies 49.40→49.80, drags a BLUE box 49.80→49.97, box fills RED, element pops in at 50.09, done 50.16, releases →50.30
- 49.40 | Agent 13 (sky) | `ft.accent.2` [shape] | flies 49.40→49.88, drags a BLUE box 49.88→50.05, box fills RED, element pops in at 50.17, done 50.24, releases →50.38
- 49.40 | Agent 14 (rose) | `ft.accent.3` [shape] | flies 49.40→49.95, drags a BLUE box 49.95→50.12, box fills RED, element pops in at 50.24, done 50.31, releases →50.45
- 49.40 | Agent 15 (amber) | `ft.accent.4` [shape] | flies 49.40→49.70, drags a BLUE box 49.70→49.87, box fills RED, element pops in at 49.99, done 50.06, releases →50.20

#### JOIN TIMES (agents that appear while the page builds)

- t=6.0: Agent 19 (white) joins; it flies in from the top-right corner and takes the next layer.
- t=9.5: Agent 20 (violet) joins; it flies in from the top-right corner and takes the next layer.
- t=10.5: Agent 21 (sky) joins; it flies in from the top-right corner and takes the next layer.
- t=11.2: Agent 22 (rose) joins; it flies in from the top-right corner and takes the next layer.
- t=12.0: Agent 23 (amber) joins; it flies in from the top-right corner and takes the next layer.
- t=17.0: Agent 24 (green) joins; it flies in from the top-right corner and takes the next layer.
- t=21.0: Agent 25 (teal) joins; it flies in from the top-right corner and takes the next layer.
- t=25.0: Agent 26 (orange) joins; it flies in from the top-right corner and takes the next layer.
- t=28.0: Agent 27 (white) joins; it flies in from the top-right corner and takes the next layer.
- t=31.0: Agent 28 (violet) joins; it flies in from the top-right corner and takes the next layer.
- t=39.0: Agent 29 (sky) joins; it flies in from the top-right corner and takes the next layer.
- t=48.0: Agent 30 (rose) joins; it flies in from the top-right corner and takes the next layer.

#### FINALE (starts when the last layer is released at about t=51.4 s)

- The HUD morphs to `Rebuilt by 30 agents in 51.4s` (the number is the measured wall-clock time) with [🔊] [Go live] [Replay] [✕].
- Rulers/guides are removed, the `is-building` class is removed.
- Page scrolls so the contact poster card is vertically centred.
- Agents with index divisible by 3 (10 of them) orbit the TOP-RIGHT corner point (viewport width − 70, 80) on a radius of 62–110 px; the other 20 orbit the poster card centre on radii 110–224 px that slowly breathe (±25 %). Arrows stay tangent to the circle. They keep orbiting until the visitor clicks Go live (they fly off to the top-right in 0.8 s), Replay, or ✕.

### 5.10 Sound (synthesized, default OFF, toggled by the HUD speaker)
Use Web Audio: a 12 ms square-wave "tick" at 1800 Hz (gain .03) per typed word, a short filtered-noise "whoosh" when a section-commit sweep runs, and a soft two-note chime on "Rebuilt". Create the AudioContext only after the first user click (browser autoplay rules).

Implement it in `extras.js` as `window.SwarmSound = { set(on), tick(ch), whoosh(), chime() }`. The engine already calls `SwarmSound.tick(char)` for every typed character (play the tick only when `ch` is a space or the text just ended), `SwarmSound.whoosh()` when a commit sweep starts, and `SwarmSound.chime()` at the finale, each guarded by `window.SwarmSound &&`. When sound is off every method returns immediately. The HUD speaker button calls `SwarmSound.set(true|false)` (and creates the AudioContext inside that click).

---------------------------------------------------------------------
## PART 6 — SECTION-BY-SECTION SPEC (desktop 1440px reference; then responsive rules)

### 6.1 HERO (`#home`, min-height 100vh, min 720px)
Layering (back → front):
1. **Giant word `CONTENT.meta.heroWord` (default "PORTFOLIO")** — Anton, uppercase, `line-height:.8`, letter-spacing -0.02em. Use a `fitText()` helper (JS) that sets `font-size` so the word's rendered width = 94% of the viewport width (≈ 24vw at 1440). Positioned with its cap-top about 14% down the hero, `left:3vw`. Fill with a vertical gradient via `background-clip:text`: `linear-gradient(180deg,#ff3b30 0%, #c8231f 45%, rgba(70,10,10,.85) 80%, rgba(10,10,10,0) 100%)`. z-index 1.
2. **Cut-out portrait** (`assets/img/hero-cutout.png`, transparent PNG of me, already provided: dark hair, black blazer, centred, cropped at the chest): height 88vh, anchored to the bottom, horizontally centred around 56% of the width, `object-fit:contain; object-position:bottom`. His head overlaps the middle letters of "PORTFOLIO" (the "F" is almost hidden behind his head — this overlap is the key depth effect, do not move the photo in front of nothing). Add a faint red rim-light: `filter:drop-shadow(0 0 40px rgba(255,59,48,.25))`, and a mask fading the bottom 12% into the background. z-index 2. Fallback if the file is missing: an inline SVG silhouette (head + shoulders, black on dark red glow).
3. **Left text block** (z-index 3), at `left:4vw`, top ≈ 34vh:
   - `Hello, I'm` — script font 44px, white, rotate(-4deg), placed overlapping the top-left corner of the giant "P" (about 3vh above the name).
   - **Name** `MAYURA.` — Anton, `font-size:clamp(56px,7.3vw,128px)`, white, red square/dot at the end, subtle text-shadow `0 2px 0 rgba(0,0,0,.35), 0 10px 40px rgba(0,0,0,.5)`.
   - **Role** `FULL STACK DEV` / `& DESIGNER` — Plus Jakarta Sans 800, uppercase, 24px, line-height 1.05, colour `--accent`.
   - **Paragraph** — 15px/1.6, `--text-2`, max-width 300px (3-4 lines).
   - **CTA button** "See my work ↓" (scrolls to `#work`) — solid `--btn`, 190×44px, radius 2px, 13px/700 white, the arrow at the right. Hover: background lightens, arrow drops 4px, magnetic pull toward the cursor (max 8px).
   - **Location** — red pin icon + `BENGALURU, INDIA` (10px, 600, uppercase, .12em tracking, muted).
   - **Try Yulya button** — 36px circle with 1.5px red border and a white `↗` arrow, label `TRY YULYA` (11px/800 uppercase) and `AI DISCORD BOT` (9px muted) next to it, at the bottom-left of the hero. Click opens `CONTENT.links.yulyaBot` in a new tab. (I have no showreel video, so there is no play button.)
4. **Top micro-tags** (11px uppercase, muted): top-left under the nav `FULL STACK DEVELOPER / DESIGNER` + `GRAPHICS DESIGNER`; top-right `● OPEN TO WORK` (green-red pulsing 6px dot).
5. **Right column** (x ≈ 84% of width):
   - red asterisk `✳` icon + `Built with logic.` / `Finished with feeling.` (11px, 2 lines) at ≈ 35% height.
   - **Stats stack** at 45-70% height: three rows, each = big red Anton numeral (44px) + a 2-line 9px uppercase label to its right, separated by 1px hairlines with a short 28px red accent line above the first one: `4+` "Years of building & designing", `10+` "Projects shipped", `13+` "Public repositories on GitHub". Count up from 0 when first visible (1.4s, ease-out).
   - `↓ DOWNLOAD CV` (10px/700 uppercase, download icon) below the stats. The CV file does not exist yet: if `assets/cv/Mayura_CV.pdf` fails to load (check with a HEAD request on click), show the toast `CV coming soon` instead of downloading.
6. **Bottom bar**: centre `SCROLL TO DISCOVER ↓` (9px uppercase, with a tiny dot that bobs up and down 6px, 1.6s loop); right `SELECTED WORK · 2022 – 2026` (9px muted).
7. A short **red horizontal accent bar** (120×3px, `--red`) under the hero left block (visible at the top of the screen when the hero scrolls away).

Hero motion (after intro): giant word and portrait move at different parallax speeds on scroll (word 0.15, portrait 0.05, text 0); mouse-parallax ±14px on the portrait, ±26px on the word (lerped); a **spotlight**: a radial gradient (260px, rgba(255,120,100,.35)) follows the mouse inside the hero, blended `mix-blend-mode:screen` over the giant word.

### 6.2 SELECTED WORK (`#work`)
- Header row: left eyebrow `01 / SELECTED WORK` + H2 `WORK THAT SHIPS.` (bold-grotesk style, white, trailing dot). Right: link `ALL WORK →` (11px/700 uppercase, arrow slides 4px on hover) that opens `https://github.com/moheith` in a new tab.
- Filter row below: tabs `All · AI & ML · Full Stack · Bots · Desktop · Games · Web Design · Art & 3D` (13px, 500, muted → white when active). Active tab has a 2px red underline that SLIDES between tabs (animate `transform`/`width`). On the right of the row, a search field: magnifier icon + placeholder `Search title or category` (12px, no border, bottom hairline; focus → red hairline).
- Under it a **horizontal card slider**: 3 cards visible on desktop (2 on tablet, 1.15 on mobile so the next one peeks), gap 24px, CSS scroll-snap + drag-to-scroll with inertia, arrow buttons `‹ ›`, dot indicators, and a counter `SEE ALL (11) •`.
- **Card** anatomy (each part is its own layer):
  - 16:9 image area (radius 2px). I have NO screenshots yet, so every card must ship a **generated "code poster" fallback** that looks intentional: dark gradient background (each project gets its own hue from `--a1…--a8` at 18% opacity over `--surface`), a faint 24px dot-grid, the project's initials in huge Anton (opacity .10) bottom-right, and 2-3 tiny tech chips (e.g. `PYTHON`, `ELECTRON`) bottom-left. If `assets/img/work-XX.jpg` exists and loads, show it instead (use `onerror` to fall back).
  - Tag chip top-left (e.g. `AI / DISCORD BOT`, `BROWSER GAME ENGINE`, `FINE-TUNED LLMS`; 9px/800 uppercase on `rgba(0,0,0,.6)` with a red left border 2px).
  - Below the image on one row: big red Anton number `01` (34px), then title (Plus Jakarta Sans 800, uppercase, 13px, tracking -0.01em) with sub-line `AI & ML / 2026` (10px, muted), and a `↗` arrow icon at the far right.
  - Hover: image scales 1.05 (0.8s), 3D tilt ±6° following the mouse, red 1px outline appears, the arrow turns red and moves 4px up-right, the custom cursor becomes a red circle labelled `VIEW`.
  - Click → Project modal (7.7), which shows the description, tech list, and buttons `LIVE ↗` and `GITHUB ↗` for that project.
- The 11 projects are defined in `CONTENT.projects` (Part 8). Only the first three cards carry swarm layers; cards 4 to 11 are plain (the slider hides them off-screen during the intro). Do not invent others.
- Filtering uses a FLIP animation (cards fade/scale out, remaining cards glide to their new positions, 0.5s). Search filters live on title + category + tech and highlights the matched letters in red.

### 6.3 TECH STACK STRIP (replaces the client-logo strip)
- Left label (two lines, 10-11px bold uppercase, tight): `BUILT WITH` / `THE RIGHT TOOLS.`
- A single-row **infinite marquee** of 14 tool tiles from `CONTENT.tools`. Each tile ~170×64px, 72px gap: a 24px rounded-square glyph in the tool's brand colour (a letter or simple inline-SVG shape, NOT a downloaded logo) + the name in Plus Jakarta Sans 800 uppercase 13px. Tiles at 85% opacity → 100% on hover. The row is cut off at the right edge, edges fade with `mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)`. Speed 40px/s, pauses on hover, speeds up with scroll velocity (GSAP ticker). Tiles are `data-layer="logo"`.

### 6.4 HIGHLIGHTS & PROOF (`#highlights`) — replaces the awards section
I have no awards, so this section proves my work with real, checkable facts instead. Never write the words "award", "winner" or "certificate" anywhere on this site.
- Two columns (45% / 55%). The LEFT column sits on a panel with a maroon/red glow: `radial-gradient(120% 90% at 0% 0%, rgba(120,20,30,.55), transparent 60%), var(--bg-2)`, padding 56px.
  - eyebrow `HIGHLIGHTS & PROOF`
  - H2 (Anton): line 1 `THE WORK.` white, line 2 `THE PROOF.` `--accent`, ≈ 6.4vw.
  - **Big stat:** `10+` — Anton 120px white with a red `+`, flanked by two red **laurel-branch SVGs** (left one mirrored). Under it `PROJECTS SHIPPED` (10px/800, red, tracked). Count-up on enter. Laurel leaves draw in with a stroke-dashoffset animation.
  - Paragraph: `No trophies yet. Just shipped products, public code and a local AI model that real people download.`
  - Link `VIEW GITHUB ↗` (11px/700 uppercase) → `https://github.com/moheith`.
- RIGHT column: header row `SELECTED HIGHLIGHTS` (eyebrow) left and `PUBLIC & VERIFIABLE` right. Then a list of 6 rows separated by 1px hairlines, from `CONTENT.highlights`. Row = tiny red index `01` (9px), title (Plus Jakarta Sans 800, 20px, white), sub-line (11px muted), and a short **metric** at the far right (Anton 34px, `--red`, e.g. `8B`, `LIVE`, `13`). Each row is a link to its URL.
  Row hover: background `rgba(255,255,255,.03)`, title moves 8px right, metric moves 6px left, a red 1px line grows under the row; keyboard focusable.

### 6.5 FROM RAW. TO REAL. — wireframe vs final UI (`.raw`)
- Left column: eyebrow `A LOOK UNDER THE SURFACE`; H2 (Anton) `FROM RAW.` white / `TO REAL.` `--accent`, ≈ 7vw; paragraph `One interface. Many iterations. Drag to watch a screen go from grey boxes to a finished, living UI.`; meta lines (9px uppercase muted) `YULYA STUDIO / 2026` and `UI DESIGN · FRONT-END · MOTION`.
- Right column: a 16:10 comparison slider (about 62% width). I have no images, so BOTH layers are **built in HTML/CSS inside the same 16:10 box with identical layout** so they line up when the divider moves:
  - **Raw layer (WIREFRAME)**: background #14141a, every block drawn as a 1px dashed `rgba(255,255,255,.28)` rectangle with a tiny `×`-cross inside, grey bars instead of text, labels in a monospace font such as `header`, `card`, `chart`, `list`.
  - **Final layer (FINAL UI)** = a miniature of **Yulya Studio**, the browser game maker: top bar with the word `YULYA STUDIO`, tabs `Editor · Preview · Arcade` and a red `RUN ▶` button; a left file tree (`index.html`, `game.js`, `sprites/`, `sounds/`); a centre code editor with 9 lines of syntax-coloured JavaScript (keywords violet `#a893ff`, strings amber, comments grey) and a blinking caret; a right preview pane showing a tiny animated pixel spaceship game on a dark canvas (CSS keyframes only); a bottom chat bar `Ask Gemini to add a power-up…` with a send button. Palette: near-black `#0e0f14` background, violet `#a893ff` and `--red` accents, 1px `rgba(255,255,255,.08)` borders, 8px radius panels, subtle animated grain.
  - **Wireframe layer (WIREFRAME)** = the SAME grid as dashed boxes labelled in monospace `top bar`, `file tree`, `editor`, `preview`, `chat`, with grey bars instead of text and no colour.
  - If `assets/img/raw-wire.jpg` and `assets/img/raw-final.jpg` exist, use them instead of the generated layers.
  - The wireframe layer is clipped with `clip-path: inset(0 X% 0 0)`. A vertical 1px white line follows the divider; the **handle is a 40px red circle** with a faint white ring and a small ⇆ icon; labels top-left `WIREFRAME`, top-right `FINAL UI` (8px/800 uppercase, dark pill). Caption under it: `DRAG TO SEE THE PROCESS`. Drag with mouse/touch/pointer events and arrow keys (role="slider", aria-valuenow). On first scroll into view it auto-demos: slides to 15% then 85% then settles at 50% (2.4s, ease-in-out).

### 6.6 BEHIND THE SCREEN (`#about`)
- Eyebrow `02 / BEHIND THE SCREEN`; H2 (Anton) `CODE THAT WORKS.` white / `DESIGN THAT FEELS.` in `--accent`. To the right, a 4-line small paragraph (11px, muted, max-width 300px) from `CONTENT.en.about.text`.
- Three columns below:
  1. **EDUCATION & SKILLS** (bold-grotesk 20px). Red label `EDUCATION`. Rows (title 14px/700, sub 12px muted, a right-aligned tag in 10px muted) from `CONTENT.education`. Then red label `CREATIVE TOOLKIT`, a wrap of outlined chips (10px/600, 1px `--line-strong`, radius 3px) from `CONTENT.toolkit`, then 8 software tiles 28px from `CONTENT.software` (two letters in a rounded square plus the name, colours from the data: Unity white, Blender orange, Krita teal, Live2D violet, Python yellow, JavaScript yellow, Ollama white, Git orange).
  2. **FROM IDEA TO LAUNCH** — vertical timeline with a 1px red spine and 8px circle nodes (red ring, dark centre). Five steps from `CONTENT.process`, each: red Anton numeral `01`-`05` left, title (Plus Jakarta Sans 800, 12px uppercase) and 2-line description (11px muted). The red spine "draws" downward with scroll (`scaleY` linked to ScrollTrigger scrub) and each node lights up as it is reached.
  3. **Red quote card** — tall portrait card (about 280×420), background `linear-gradient(160deg,#d62d27,#8e1713)`, soft inner noise; top-left quote-mark icon `❝` in a lighter red; quote in Plus Jakarta Sans 300, 26px, white, 4 lines (`Build it like an engineer.` / `Finish it like an artist.` — the last two lines at 70% opacity); signature `Mayura` in the script font 34px white; bottom: `LET'S BUILD` / `SOMETHING WORTH USING` (8px uppercase) and a small white asterisk. Hover: card tilts in 3D and a light sheen sweeps across.

### 6.7 THE JOURNEY (`#journey`)
- Eyebrow `03 / THE JOURNEY`; H2 on ONE line, bold-grotesk (not condensed): `KEEP MOVING. KEEP BUILDING.` Top-right tiny link `RESUME ⤓` (placeholder, see Part 8 `links.resume`).
- Left (≈ 60%): an **accordion timeline** from `CONTENT.timeline`. Each row: date in 10px (current one, e.g. `2026 · NOW`, in red, others muted) in a narrow left column, a 1px red vertical spine just right of the dates, role title (Plus Jakarta Sans 800, 22px, white), sub (12px muted), and a `+` icon at far right (rotates to `×` when open). The FIRST row is open by default and shows a 3-line description (13px/1.6 muted). One open at a time; uses `grid-template-rows: 0fr → 1fr` for smooth height; keyboard accessible (`button` + `aria-expanded`).
- Right (≈ 30%): eyebrow `A FEW MILESTONES`, Anton H3 `LITTLE WINS.` white / `BIG MEANING.` `--accent`, then 4 compact rows from `CONTENT.milestones` (each with tiny index, title 12px/700, year 9px muted, `↗` icon).

### 6.8 YOUR NEXT STORY — contact (`#contact`)
- Eyebrow `04 / YOUR NEXT PROJECT`. H2 (Anton, huge, ≈ 7.5vw): `LET'S WORK` / `TOGETHER` + a small red square period. Paragraph (14px): `Got an idea you want to bring to life? Let's build something worth using.`
- CTA: 44px circle with 1.5px red border containing a red `↗`, followed by red 11px/800 uppercase text `START A CONVERSATION`. It opens WhatsApp: `https://wa.me/918660227877?text=Hi%20Mayura%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20talk.` in a new tab. Hover: circle fills red, arrow turns white and rotates 45° → 0.
- Middle column: **4 contact rows** — red outline icon 28px (envelope, Instagram, WhatsApp/phone, location pin) + tiny uppercase label (`EMAIL`, `INSTAGRAM`, `WHATSAPP`, `BASED IN`) over the value (14px/600 white), hairline between rows, `↗` at the far right. Values: `moheithmayura@gmail.com`, `@moheith_mayura`, `+91 86602 27877`, `Bengaluru, India`. The email row click copies to clipboard and shows a toast "Email copied ✓".
- Right: the **featured-project card** (≈ 460×300, 1px `--line` border, radius 4px). I have no showreel video, so this is a **poster built in CSS**: near-black frame with film grain, a fake terminal window top-left showing 5 lines typed on a loop (`$ whoami` → `mayura — full stack dev & designer`, `$ ls projects/` → `yulya  studio  desktop-ai-companion`, `$ ./ship --now`), and the Anton poster text `BUILD IT.` white / `MAKE IT FEEL ALIVE.` red. Small `MAYURA●` label top-left, a 44px **red circular button** bottom-right with `↗`. Click → opens `CONTENT.links.yulyaBot` (https://discord.yulya.me) in a new tab. If `assets/video/showreel.mp4` exists later, play it muted as the card background.
- Below, full width: the **quick-brief bar** — a single-line input `Tell me about your project` with three tiny icons on the right (attach, eye/preview, send ↗). Enter or the send icon opens `https://wa.me/918660227877?text=<encoded message>` (fallback `mailto:`).

### 6.9 FOOTER
Hairline top border; left: logo wordmark with red dot; centre: `© 2026 MOHIETH MAYURA S Y. All rights reserved.` (11px muted) and live local time with timezone (`Bengaluru · 17:04 IST`, updated every 30s, `Asia/Kolkata`); right: social icon links from `CONTENT.social` (GitHub, LinkedIn, X, Hugging Face, Ollama, Instagram) + `Back to top ↑` (smooth scroll). Also the accent-colour dots (7.13).

### 6.10 Responsive
Breakpoints: 1280, 1024, 860, 640.
- ≤1024: hero stats move under the paragraph in a horizontal row; cards 2-up; highlights stack (panel on top).
- ≤860: nav → hamburger; hero: "PORTFOLIO" fits 94vw on one line at the top, portrait centred below it (height 62vh), left block stacks under; journey and about become single column; before/after slider full width; contact: featured-project card first.
- ≤640: cards 1.15-up with peek; headings scale with `clamp`; HUD becomes a compact pill (the CSS in swarm.css already hides the rulers and shrinks the cursors); the swarm still runs with all 30 agents.
- No horizontal scroll at any width. Test 360, 390, 768, 1024, 1280, 1440, 1920, 2560.

---------------------------------------------------------------------
## PART 7 — "GOD-LEVEL" EXTRA FEATURES (on top of the reference)

**MUST-HAVE**
1. **Scroll playhead + timecode (timeline identity):** a thin 2px red vertical line fixed at the far-left edge whose height shows scroll progress, with a small timecode label that updates live in `HH:MM:SS:FF` format (progress mapped to 0-02:00 at 24 fps) near the bottom-left. Hover shows section names as "chapter markers" like an editor timeline; click a marker to jump.
2. **Custom site cursor:** 8px red dot (follows instantly) + 36px ring (follows with lerp .18). States: default; `VIEW` (over cards, ring grows to 80px and shows text); `OPEN` (over the Try Yulya button and the poster card); `DRAG` (over slider/compare); `×` on modal close; text-input I-beam. Hidden on touch devices. `mix-blend-mode:difference` for the dot.
3. **Magnetic buttons + link hover:** buttons, nav links, social icons are pulled toward the cursor up to 10px within a 90px radius (GSAP quickTo). Links have a letter-roll hover (each letter slides up and is replaced by a red copy).
4. **Text scramble** on eyebrows when they enter the viewport (characters randomise through `▮#/\` for 500ms then resolve).
5. **RGB-split glitch** on hover of display headings (two pseudo-element copies offset ±2px in cyan/red with `mix-blend-mode:screen`, 220ms).
6. **Cinema modal** for projects: full-screen black overlay with letterbox bars sliding in from top/bottom (cinematic 2.39:1 feel), a media area (`<video>` for mp4, an iframe for YouTube/Vimeo, or the code-poster when there is no video; custom red controls only when there is a video), title + meta + description + tools used, prev/next project arrows, keyboard (←/→/Esc/Space), focus trap, deep link `#work/<slug>` that opens it on load, closes with a reverse animation.
7. **Project modal** — the same cinema modal. If a project has a `video` it plays it; otherwise it shows the generated code-poster, the description, tech chips and `LIVE ↗` / `GITHUB ↗` buttons. (No showreel exists.)
8. **Compare slider** (6.5, wireframe vs final UI) with keyboard + touch.
9. **Motion-off toggle** (nav `▷ Motion off`): sets `html[data-motion="off"]`; disables swarm intro, parallax, marquee movement, grain, magnetic and reveal animations; persists in `localStorage`; defaults to ON-state of "off" if `prefers-reduced-motion: reduce`.
10. **Scroll spy + hash routing:** nav highlights the current section; clicking a link smooth-scrolls (Lenis `scrollTo` with offset -64) and updates the hash without a jump; opening `#highlights` directly scrolls there after load.

**SHOULD-HAVE**
11. **Command palette** (`Ctrl/Cmd + K`, also `/`): glass modal with fuzzy search over sections, projects, highlights, "Download CV", "Copy email", "Open WhatsApp", "Open GitHub", "Toggle sound", "Replay rebuild", "Change accent", "Open terminal". Arrow keys + Enter, Esc to close.
12. **Live GitHub stats widget** (replaces the old language switch; there is NO language switch): in the Highlights panel and footer, `fetch('https://api.github.com/users/moheith')` (public, no key) and show `public_repos`, `followers`, and the date of the latest push from `.../users/moheith/repos?sort=pushed&per_page=3` as three tiny rows `LATEST ACTIVITY`. Cache the result in `sessionStorage` for 10 minutes and ALWAYS fall back silently to the static numbers (`13`, `4`) when offline or rate-limited. Never show an error to the visitor.
13. **Accent colour switcher** (four dots in the footer: red `#ff3b30` default / violet `#a893ff` / electric blue `#3b82ff` / amber `#ffb020`) that changes `--red`, `--accent`, `--btn`, `--guide` live and persists.
14. **Idle swarm companions:** if the mouse is still for 4s inside the hero, 6 pastel agent cursors drift in (using `idleDrift`) and loosely follow the real cursor with delay, orbiting it; any click/mousemove > 40px sends them away. (Reuses the swarm cursor art as a brand signature.)
15. **Quick-brief bar** with WhatsApp deep-link (6.8) and copy-email toast.
16. **Live clock + availability badge** (footer and hero tag), pulsing dot.

**NICE-TO-HAVE**
21. **Mini terminal easter egg** (developer identity): press the backtick key `` ` `` or choose "Open terminal" in the command palette to open a bottom drawer styled like a terminal (monospace, red prompt `mayura@portfolio:~$`). Commands: `help`, `whoami` (name, role, city), `about`, `projects` (numbered list; `open 3` opens project 3), `skills`, `contact`, `github`, `yulya` (opens the bot site), `theme red|violet|blue|amber`, `replay`, `clear`, `exit`. Unknown commands print `command not found, try help`. Esc closes it. Fully keyboard accessible, `aria-live="polite"` output.
17. Press `R` (or type "replay") to replay the rebuild; hidden Konami code (↑↑↓↓←→←→BA) triggers the swarm finale circle around the cursor for 4 seconds.
18. **SEO & sharing:** `<title>Mayura | Full Stack Developer & Designer</title>`, meta description, canonical, Open Graph + Twitter card (`assets/img/og.jpg` 1200×630), JSON-LD `Person` schema (name Mohieth Mayura S Y, jobTitle Full Stack Developer and Designer, address Bengaluru, `sameAs` = my social links, url = `CONTENT.meta.siteUrl`), `manifest.webmanifest` (theme colour `#07070a`), favicon + apple-touch-icon, `<html lang="en">`.
19. **Performance:** lazy-load below-the-fold images (`loading="lazy" decoding="async"`), `preconnect` to fonts and CDNs, `font-display:swap`, WebP/AVIF with `<picture>` where available, videos only load on hover/click, `content-visibility:auto` on far sections, `will-change` only on animating elements, `ScrollTrigger.refresh()` after fonts load. Targets: Lighthouse Performance ≥ 90, Accessibility ≥ 95, CLS < 0.05, LCP < 2.5s (the intro overlay must not delay LCP of the hero).
20. **Accessibility:** skip-to-content link, visible focus ring (2px `--accent`, 3px offset), ARIA labels for icon buttons, `aria-live="polite"` on the HUD text, all modals trap focus and restore it on close, colour contrast ≥ 4.5:1 for body text, every animation honours Motion-off, the swarm overlay has `aria-hidden="true"` and `inert` on the page content is NOT used (visitors can scroll while it builds).

---------------------------------------------------------------------
## PART 8 — CONTENT (VERBATIM — create `js/content.js` exactly; this is Mayura's real data)

Rules: copy every string exactly. Do not translate, rename, shorten or add other languages. Lines marked `// EDIT` are honest placeholders; keep them in place and make the page look finished with them. Never invent awards, clients, employers or numbers.

**FILE: js/content.js**
```js
/* js/content.js — ALL visible text and links for the site. English only.
   Lines marked // EDIT are honest placeholders the owner will replace later. */
const CONTENT = {
  meta: {
    name: "MAYURA", fullName: "Mohieth Mayura S Y", initial: "M",
    heroWord: "PORTFOLIO",              // giant word behind the portrait; may be changed to "MAYURA"
    city: "BENGALURU, INDIA", tz: "Asia/Kolkata", tzLabel: "IST",
    email: "moheithmayura@gmail.com",
    instagram: "@moheith_mayura",
    phoneDisplay: "+91 86602 27877", whatsapp: "918660227877",
    siteUrl: "https://example.com"      // EDIT: replace when the domain is bought
  },
  links: {
    github: "https://github.com/moheith",
    githubRepos: "https://github.com/moheith?tab=repositories",
    linkedin: "https://linkedin.com/in/mohieth",
    x: "https://x.com/mohiethh",
    huggingface: "https://huggingface.co/moheith",
    ollama: "https://ollama.com/moheith",
    instagram: "https://instagram.com/moheith_mayura",
    yulyaBot: "https://discord.yulya.me",
    yulyaInvite: "https://invite.yulya.me",
    yulyaStudio: "https://studio.yulya.me",
    yulyaSpace: "https://huggingface.co/moheith/spaces",
    cv: "assets/cv/Mayura_CV.pdf",         // EDIT: placeholder. If the file is missing, show toast "CV coming soon"
    resume: "assets/cv/Mayura_Resume.pdf"  // EDIT: placeholder. Same toast behaviour
  },
  en: {
    nav: ["Work","Highlights","About","Journey","Contact"], motionOff: "Motion off", talk: "Let's talk",
    tags: ["FULL STACK DEVELOPER / DESIGNER","GRAPHICS DESIGNER","OPEN TO WORK"],
    hello: "Hello, I'm", role: ["FULL STACK DEV","& DESIGNER"],
    intro: "I build AI products, game tools and web experiences, then design the visuals around them, from Discord bots and local LLMs to Unity, Blender and Live2D art.",
    motto: "Code that works. Design that feels.",
    cta: "See my work", tagline: ["Built with logic.","Finished with feeling."],
    stats: [["4+","Years of building & designing"],["10+","Projects shipped"],["13+","Public repositories on GitHub"]],
    cv: "Download CV",
    demo: ["TRY YULYA","AI DISCORD BOT"],
    scroll: "SCROLL TO DISCOVER", range: "SELECTED WORK · 2022 – 2026",
    work: { eyebrow: "01 / SELECTED WORK", title: "WORK THAT SHIPS.", all: "ALL WORK", search: "Search title or category",
            filters: ["All","AI & ML","Full Stack","Bots","Desktop","Games","Web Design","Art & 3D"], seeAll: "SEE ALL" },
    logos: ["BUILT WITH","THE RIGHT TOOLS."],
    highlights: { eyebrow: "HIGHLIGHTS & PROOF", title: ["THE WORK.","THE PROOF."], big: "10+", caption: "PROJECTS SHIPPED",
                  text: "No trophies yet. Just shipped products, public code and local AI models that anyone can download.",
                  link: "VIEW GITHUB", listTitle: "SELECTED HIGHLIGHTS", range: "PUBLIC & VERIFIABLE",
                  live: ["LATEST ACTIVITY","REPOSITORIES","FOLLOWERS"] },
    raw: { eyebrow: "A LOOK UNDER THE SURFACE", title: ["FROM RAW.","TO REAL."],
           text: "One interface. Many iterations. Drag to watch a screen go from grey boxes to a finished, living UI.",
           meta: ["YULYA STUDIO / 2026","UI DESIGN · FRONT-END · MOTION"], solid: "WIREFRAME", final: "FINAL UI", hint: "DRAG TO SEE THE PROCESS" },
    about: { eyebrow: "02 / BEHIND THE SCREEN", title: ["CODE THAT WORKS.","DESIGN THAT FEELS."],
             text: "I'm Mohieth Mayura S Y, a full stack developer and graphics designer from Bengaluru. I build AI tools, bots and games, then design every pixel around them in Krita, Blender and Live2D. I speak English, Kannada and Hindi, and I'm studying BCA at SFGC.",
             eduTitle: "EDUCATION & SKILLS", eduLabel: "EDUCATION", toolkit: "CREATIVE TOOLKIT",
             processTitle: "FROM IDEA TO LAUNCH",
             quote: ["Build it like an engineer.","Finish it like an artist."], signature: "Mayura", quoteFoot: ["LET'S BUILD","SOMETHING WORTH USING"] },
    journey: { eyebrow: "03 / THE JOURNEY", title: "KEEP MOVING. KEEP BUILDING.", resume: "RESUME",
               milestonesLabel: "A FEW MILESTONES", milestonesTitle: ["LITTLE WINS.","BIG MEANING."] },
    contact: { eyebrow: "04 / YOUR NEXT PROJECT", title: ["LET'S WORK","TOGETHER."],
               text: "Got an idea you want to bring to life? Let's build something worth using.",
               cta: "START A CONVERSATION", labels: ["EMAIL","INSTAGRAM","WHATSAPP","BASED IN"],
               poster: ["BUILD IT.","MAKE IT FEEL ALIVE."], brief: "Tell me about your project",
               term: ["$ whoami","$ ls projects/","$ ./ship --now"] },
    footer: { rights: "All rights reserved.", top: "Back to top" },
    toasts: { emailCopied: "Email copied ✓", cvSoon: "CV coming soon", resumeSoon: "Resume coming soon" }
  },

  /* 11 projects. Real ones come from github.com/moheith, huggingface.co/moheith, discord.yulya.me and studio.yulya.me.
     "img" is optional: if the file is missing, draw the generated code-poster (see 6.2). "cats" = every filter the card belongs to. */
  projects: [
    { slug:"yulya-discord-bot", n:"01", title:"YULYA — AI DISCORD BOT", meta:"BOTS / 2026", tag:"AI / DISCORD BOT", cats:["Bots","AI & ML"],
      img:"assets/img/work-01.jpg", live:"https://discord.yulya.me", repo:"https://github.com/moheith/Yulya",
      desc:"A free, multimodal AI for Discord. Real-time voice and screen-share chat, rolling neural channel memory, image generation, live web research, and a simulated crypto stock market with heists, bounties and server leaderboards.",
      tech:["Python","Discord API","Gemini Live","WebRTC voice"] },
    { slug:"yulya-studio", n:"02", title:"YULYA STUDIO — GAME MAKER", meta:"GAMES / 2026", tag:"BROWSER GAME ENGINE", cats:["Games","Full Stack"],
      img:"assets/img/work-02.jpg", live:"https://studio.yulya.me", repo:"https://github.com/moheith?tab=repositories",   // EDIT: paste the exact studio repo link
      desc:"Make real games in your browser. A Monaco-powered IDE with a Gemini AI coding assistant, Canvas 2D and WebGL support, one-click live hosting, and an open online arcade to play what people build.",
      tech:["JavaScript","Monaco Editor","Gemini AI","Canvas 2D","WebGL"] },
    { slug:"yulya-model-family", n:"03", title:"YULYA — LOCAL AI MODELS", meta:"AI & ML / 2026", tag:"FINE-TUNED LLMS", cats:["AI & ML"],
      img:"assets/img/work-03.jpg", live:"https://huggingface.co/moheith", repo:"https://github.com/moheith/Yulya",
      desc:"A family of fine-tuned language models I trained and published on Hugging Face, from tiny 135M models to an 8B model. Shipped as GGUF and adapters so they run locally with llama.cpp, Ollama and LM Studio.",
      tech:["Python","Unsloth","GGUF","llama.cpp","Ollama","Hugging Face"] },
    { slug:"desktop-ai-companion", n:"04", title:"DESKTOP AI COMPANION", meta:"DESKTOP / 2026", tag:"DESKTOP APP", cats:["Desktop","AI & ML","Art & 3D"],
      img:"assets/img/work-04.jpg", live:"", repo:"https://github.com/moheith/desktop-ai-companion",
      desc:"A Live2D mascot that lives on your desktop in a transparent, click-through window. It chats with a local AI through Ollama, listens with whisper.cpp, and keeps persistent memory of you.",
      tech:["Electron","PixiJS","Live2D","Ollama","whisper.cpp","JavaScript"] },
    { slug:"yulya-api", n:"05", title:"YULYA API", meta:"FULL STACK / 2026", tag:"API / EMBEDDINGS", cats:["Full Stack","AI & ML"],
      img:"assets/img/work-05.jpg", live:"", repo:"https://github.com/moheith/Yulya-API",
      desc:"A Python API that generates unlimited embedding files, built to power Yulya's long-term memory.",
      tech:["Python","REST API","Embeddings"] },
    { slug:"neural-deck", n:"06", title:"YULYA NEURAL DECK", meta:"WEB DESIGN / 2026", tag:"WEBSITE & DASHBOARD", cats:["Web Design","Bots"],
      img:"assets/img/work-06.jpg", live:"https://discord.yulya.me", repo:"",
      desc:"The landing page and sign-in flow for the Yulya bot: a dark, animated site with a live command ledger, simulated market charts and Discord OAuth2 login.",
      tech:["HTML","CSS","JavaScript","Discord OAuth2"] },
    { slug:"mascot-live2d-art", n:"07", title:"MASCOT & LIVE2D ART", meta:"ART & 3D / 2026", tag:"KRITA + LIVE2D", cats:["Art & 3D","Desktop"],
      img:"assets/img/work-07.jpg", live:"", repo:"https://github.com/moheith/desktop-ai-companion",
      desc:"Original mascot artwork drawn in Krita and rigged as Live2D models for the desktop companion, with expressions, idle motion and custom model versions.",
      tech:["Krita","Live2D Cubism","PixiJS"] },
    { slug:"mascot-website", n:"08", title:"MASCOT WEBSITE TEMPLATE", meta:"WEB DESIGN / 2026", tag:"WEB TEMPLATE", cats:["Web Design","Art & 3D"],
      img:"assets/img/work-08.jpg", live:"", repo:"https://github.com/moheith/Mascot-Website",
      desc:"A reusable website template where people can learn about a mascot and download it.",
      tech:["HTML","CSS","JavaScript"] },
    { slug:"unity-blender", n:"09", title:"UNITY & BLENDER EXPERIMENTS", meta:"GAMES / 2022 – 2026", tag:"3D & GAME DEV", cats:["Games","Art & 3D"],   // EDIT: add real project names
      img:"assets/img/work-09.jpg", live:"", repo:"",
      desc:"Gameplay prototypes built in Unity and 3D models, props and scenes made in Blender. A growing sandbox for ideas that later become full games.",
      tech:["Unity","C#","Blender"] },
    { slug:"yulya-space", n:"10", title:"YULYA — LIVE DEMO SPACE", meta:"AI & ML / 2026", tag:"LIVE DEMO", cats:["AI & ML"],
      img:"assets/img/work-10.jpg", live:"https://huggingface.co/moheith/spaces", repo:"",
      desc:"A running Hugging Face Space where anyone can try Yulya in the browser without installing anything.",
      tech:["Hugging Face Spaces","Python"] },
    { slug:"college-project", n:"11", title:"COLLEGE PROJECT", meta:"FULL STACK / 2025", tag:"FULL STACK", cats:["Full Stack"],   // EDIT: confirm the year and add a better description
      img:"assets/img/work-11.jpg", live:"", repo:"https://github.com/moheith/College-Project",
      desc:"A JavaScript project built during my BCA at SFGC.",
      tech:["JavaScript"] }
  ],

  highlights: [
    { t:"Yulya Studio, a game maker in the browser", s:"Monaco IDE, Gemini AI, live hosting and an online arcade", m:"LIVE", url:"https://studio.yulya.me" },
    { t:"Yulya Discord bot", s:"Voice AI, neural memory and a live simulated crypto market. 100% free", m:"LIVE", url:"https://discord.yulya.me" },
    { t:"Yulya model family on Hugging Face", s:"Fine-tuned local models, from tiny 135M to an 8B model", m:"8B", url:"https://huggingface.co/moheith" },
    { t:"Desktop AI Companion", s:"Live2D mascot with local AI and persistent memory, open source", m:"OSS", url:"https://github.com/moheith/desktop-ai-companion" },
    { t:"13 public repositories", s:"AI, bots, games, desktop apps and websites on GitHub", m:"13", url:"https://github.com/moheith?tab=repositories" },
    { t:"Developer, artist and 3D in one", s:"Code, Unity, Blender, Krita and Live2D, all by one person", m:"4+ YRS", url:"#about" }
  ],

  education: [
    ["SFGC","Bachelor of Computer Applications (BCA)","ONGOING"],
    ["Self-driven learning","LLM fine-tuning, game development, 3D and digital art","2022 — NOW"],   // EDIT
    ["Languages","English · Kannada · Hindi",""]
  ],
  toolkit: ["Full Stack Development","AI & LLM Fine-Tuning","Discord Bots","Game Development","3D Modelling","Digital Art","Live2D Rigging","UI & Web Design","Desktop Apps","Python","JavaScript"],
  software: [["Un","Unity","#ffffff"],["Bl","Blender","#ea7600"],["Kr","Krita","#3bbecf"],["L2","Live2D","#7b61ff"],
             ["Py","Python","#ffd43b"],["JS","JavaScript","#f7df1e"],["Ol","Ollama","#f5f5f7"],["Gi","Git","#f05133"]],
  tools: ["Unity","Blender","Krita","Live2D","Python","JavaScript","Electron","Ollama","Hugging Face","Discord API","Gemini","Monaco","Git & GitHub","whisper.cpp"],

  process: [["01","THE IDEA","Understand the problem and who it is for. Define the goal, the features and the feel."],
            ["02","THE PLAN","Pick the stack, sketch the architecture and wireframe the screens before writing code."],
            ["03","THE BUILD","Code, draw and model together, one working piece at a time."],
            ["04","THE POLISH","Speed, motion, accessibility and the small details that make it feel premium."],
            ["05","THE LAUNCH","Ship it, watch real usage, and keep improving it."]],

  timeline: [   // EDIT: dates and wording are polished placeholders; check each one
    ["2026 · NOW","Founder & Lead Developer","Yulya, the AI ecosystem","Building the whole Yulya world solo: a multimodal Discord bot with voice, memory and a simulated crypto economy, Yulya Studio (a browser game maker with Gemini AI), a family of locally runnable fine-tuned models, and the web dashboards around them."],
    ["2025 · NOW","BCA Student","SFGC, Bengaluru","Studying Computer Applications while shipping real products alongside the coursework."],
    ["2024 · 2026","Full Stack & AI Developer","Independent projects","Designing and building apps, bots, APIs and fine-tuned models, from database to interface."],
    ["2022 · NOW","Digital Artist & Designer","Krita · Live2D · Blender","Mascot art, Live2D models, 3D assets and interface visuals, drawn in Krita, rigged in Live2D and built in Blender."],
    ["2022","Where It Began","First scripts, first games, first designs","Started with small websites, game experiments and drawings. Never stopped."]
  ],
  milestones: [["Yulya Studio goes live","2026"],["Yulya Discord bot launched, free","2026"],["Fine-tuned models on Hugging Face","2026"],["13 public repositories","NOW"]],

  social: [["GitHub","https://github.com/moheith"],["LinkedIn","https://linkedin.com/in/mohieth"],["X","https://x.com/mohiethh"],
           ["Hugging Face","https://huggingface.co/moheith"],["Ollama","https://ollama.com/moheith"],["Instagram","https://instagram.com/moheith_mayura"]]
};
```

---------------------------------------------------------------------
## PART 9 — `index.html` (VERBATIM — create the file exactly)

This is the complete markup. It already contains all 364 tagged layers, the HUD, the overlays, every script tag and the inline 4-second fail-safe. Style it (Part 10), do not restructure it. Class names are the contract between the HTML, your CSS and your JS. Note the `data-c*` attributes: `main.js` `hydrate()` (10.1) uses them to refresh text from `content.js` (`data-c` = path in CONTENT, `data-c-prefix`, `data-c-suffix`, `data-c-upper`).

**FILE: index.html**
```html
<!doctype html>
<html lang="en" class="is-building" data-motion="on">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Mayura | Full Stack Developer &amp; Designer</title>
<meta name="description" content="Mohieth Mayura S Y (Mayura) is a full stack developer and graphics designer from Bengaluru. AI products, game tools, Discord bots, Unity, Blender, Krita and Live2D.">
<meta name="theme-color" content="#07070a">
<link rel="canonical" href="https://example.com/">
<meta property="og:type" content="website"><meta property="og:title" content="Mayura | Full Stack Developer &amp; Designer">
<meta property="og:description" content="AI products, game tools, Discord bots and Live2D art by Mohieth Mayura S Y.">
<meta property="og:image" content="https://example.com/assets/img/og.jpg"><meta property="og:url" content="https://example.com/">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdnjs.cloudflare.com"><link rel="preconnect" href="https://cdn.jsdelivr.net">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@600&family=Inter:wght@400;500;600;700&family=Nothing+You+Could+Do&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/tokens.css"><link rel="stylesheet" href="css/base.css"><link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css"><link rel="stylesheet" href="css/swarm.css">
<!-- FAIL-SAFE: the page must never stay invisible. If the swarm has not started within 4 s, reveal everything. -->
<script>setTimeout(function(){ if(!window.Swarm || window.Swarm.state==='idle'){ document.documentElement.classList.remove('is-building'); } },4000);</script>
<noscript><style>html.is-building [data-layer]:not(.is-built){visibility:visible!important}</style></noscript>
</head>
<body>
<a class="skip" href="#work">Skip to content</a>
<canvas id="grain" aria-hidden="true"></canvas><div class="vignette" aria-hidden="true"></div>
<div id="scroll-playhead" aria-hidden="true"><i class="ph-line"></i><span class="ph-time">00:00:00:00</span></div>

<header class="nav" id="nav">
  <span class="nav__bg" data-layer="shape" data-layer-id="nav.bar"></span>
  <a class="nav__logo" href="#home"><span class="nav__wordmark" data-layer="text" data-layer-id="nav.logo" data-c="meta.name">MAYURA</span><i class="nav__dot" data-layer="shape" data-layer-id="nav.dot"></i></a>
  <nav class="nav__links" aria-label="Primary">
    <a class="nav__link" data-layer="text" data-layer-id="nav.link.1" data-c="en.nav.0" href="#work">Work</a><a class="nav__link" data-layer="text" data-layer-id="nav.link.2" data-c="en.nav.1" href="#highlights">Highlights</a><a class="nav__link" data-layer="text" data-layer-id="nav.link.3" data-c="en.nav.2" href="#about">About</a><a class="nav__link" data-layer="text" data-layer-id="nav.link.4" data-c="en.nav.3" href="#journey">Journey</a><a class="nav__link" data-layer="text" data-layer-id="nav.link.5" data-c="en.nav.4" href="#contact">Contact</a>
    <i class="nav__underline" aria-hidden="true"></i>
  </nav>
  <div class="nav__right">
    <button class="nav__motion" id="motion-toggle" type="button" aria-pressed="false"><svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M2 1 L9 5 L2 9 Z" fill="currentColor"/></svg><span data-layer="text" data-layer-id="nav.motion" data-c="en.motionOff">Motion off</span></button>
    <a class="nav__talk" data-layer="text" data-layer-id="nav.talk" data-c="en.talk" href="#contact">Let&#x27;s talk</a><span class="nav__chev" aria-hidden="true">›</span>
  </div>
  <button class="nav__burger" type="button" aria-label="Open menu" aria-expanded="false"><i></i><i></i></button>
</header>
<main id="main">
<section class="hero" id="home" aria-label="Introduction">
  <div class="hero__word" data-layer="shape" data-layer-id="hero.word" aria-hidden="true">PORTFOLIO</div>
  <picture class="hero__photo-wrap"><img class="hero__photo" data-layer="image" data-layer-id="hero.photo" src="assets/img/hero-cutout.png" alt="Portrait of Mohieth Mayura S Y" width="900" height="1200" fetchpriority="high"></picture>
  <div class="hero__glow" data-layer="shape" data-layer-id="hero.photo.glow" aria-hidden="true"></div>
  <div class="hero__inner" data-guide-anchor>
    <div class="hero__tags"><span class="hero__tag" data-layer="text" data-layer-id="hero.tag.1" data-c="en.tags.0">FULL STACK DEVELOPER / DESIGNER</span><span class="hero__tag" data-layer="text" data-layer-id="hero.tag.2" data-c="en.tags.1">GRAPHICS DESIGNER</span></div>
    <div class="hero__avail"><i class="pulse-dot" data-layer="shape" data-layer-id="hero.avail.dot"></i><span class="hero__tag" data-layer="text" data-layer-id="hero.tag.avail" data-c="en.tags.2">OPEN TO WORK</span></div>
    <div class="hero__left">
      <p class="hero__hello script" data-layer="text" data-layer-id="hero.hello" data-c="en.hello">Hello, I&#x27;m</p>
      <h1 class="hero__name"><span data-layer="text" data-layer-id="hero.name" data-c="meta.name" data-c-suffix=".">MAYURA.</span></h1>
      <h2 class="hero__role"><span class="hero__role-line" data-layer="text" data-layer-id="hero.role.1" data-c="en.role.0">FULL STACK DEV</span><span class="hero__role-line" data-layer="text" data-layer-id="hero.role.2" data-c="en.role.1">&amp; DESIGNER</span></h2>
      <p class="hero__intro" data-layer="text" data-layer-id="hero.intro" data-c="en.intro">I build AI products, game tools and web experiences, then design the visuals around them, from Discord bots and local LLMs to Unity, Blender and Live2D art.</p>
      <a class="btn hero__cta" data-layer="shape" data-layer-id="hero.cta" href="#work"><span data-layer="text" data-layer-id="hero.cta.label" data-c="en.cta" data-c-suffix=" ↓">See my work ↓</span></a>
      <div class="hero__loc"><svg class="pin" viewBox="0 0 12 16" width="10" height="13" aria-hidden="true"><path d="M6 0C2.7 0 0 2.6 0 5.8 0 10 6 16 6 16s6-6 6-10.2C12 2.6 9.3 0 6 0Zm0 8a2.2 2.2 0 1 1 0-4.4A2.2 2.2 0 0 1 6 8Z" fill="currentColor"/></svg><i class="hero__loc-icon" data-layer="shape" data-layer-id="hero.loc.icon"></i><span class="hero__loc-text" data-layer="text" data-layer-id="hero.loc" data-c="meta.city">BENGALURU, INDIA</span></div>
      <a class="hero__demo" href="https://discord.yulya.me" target="_blank" rel="noopener"><i class="hero__demo-btn" data-layer="shape" data-layer-id="hero.demo.btn">↗</i><span class="hero__demo-text"><b data-layer="text" data-layer-id="hero.demo.1" data-c="en.demo.0">TRY YULYA</b><em data-layer="text" data-layer-id="hero.demo.2" data-c="en.demo.1">AI DISCORD BOT</em></span></a>
    </div>
    <aside class="hero__right">
      <p class="hero__tagline"><i class="hero__star" data-layer="shape" data-layer-id="hero.tagline.icon">✳</i><span data-layer="text" data-layer-id="hero.tagline.1" data-c="en.tagline.0">Built with logic.</span><span data-layer="text" data-layer-id="hero.tagline.2" data-c="en.tagline.1">Finished with feeling.</span></p>
      <i class="hero__accent" data-layer="shape" data-layer-id="hero.accent"></i>
      <ul class="hero__stats">
        <li class="stat"><i class="stat__rule" data-layer="shape" data-layer-id="hero.stat.1.rule"></i><b class="stat__num" data-layer="text" data-layer-id="hero.stat.1.num" data-c="en.stats.0.0">4+</b><span class="stat__label" data-layer="text" data-layer-id="hero.stat.1.label" data-c="en.stats.0.1">Years of building &amp; designing</span></li><li class="stat"><i class="stat__rule" data-layer="shape" data-layer-id="hero.stat.2.rule"></i><b class="stat__num" data-layer="text" data-layer-id="hero.stat.2.num" data-c="en.stats.1.0">10+</b><span class="stat__label" data-layer="text" data-layer-id="hero.stat.2.label" data-c="en.stats.1.1">Projects shipped</span></li><li class="stat"><i class="stat__rule" data-layer="shape" data-layer-id="hero.stat.3.rule"></i><b class="stat__num" data-layer="text" data-layer-id="hero.stat.3.num" data-c="en.stats.2.0">13+</b><span class="stat__label" data-layer="text" data-layer-id="hero.stat.3.label" data-c="en.stats.2.1">Public repositories on GitHub</span></li>
      </ul>
      <a class="hero__cv" data-layer="text" data-layer-id="hero.cv" data-c="en.cv" data-c-prefix="↓ " data-c-upper="1" href="assets/cv/Mayura_CV.pdf" download>↓ DOWNLOAD CV</a>
    </aside>
    <div class="hero__bottom"><span class="hero__scroll" data-layer="text" data-layer-id="hero.scroll" data-c="en.scroll" data-c-suffix=" ↓">SCROLL TO DISCOVER ↓</span><span class="hero__range" data-layer="text" data-layer-id="hero.range" data-c="en.range">SELECTED WORK · 2022 – 2026</span></div>
  </div>
  <i class="hairline hairline--bottom" data-layer="shape" data-layer-id="hero.rule"></i>
</section>
<section class="work" id="work" aria-labelledby="work-title">
  <div class="wrap" data-guide-anchor>
    <i class="hairline" data-layer="shape" data-layer-id="work.rule"></i>
    <header class="work__head">
      <div><p class="eyebrow" data-layer="text" data-layer-id="work.eyebrow" data-c="en.work.eyebrow">01 / SELECTED WORK</p><h2 class="h2-bold" data-layer="text" data-layer-id="work.title" data-c="en.work.title" id="work-title">WORK THAT SHIPS.</h2></div>
      <a class="work__all" data-layer="text" data-layer-id="work.all" data-c="en.work.all" data-c-suffix=" →" href="https://github.com/moheith" target="_blank" rel="noopener">ALL WORK →</a>
    </header>
    <div class="work__filters">
      <div class="tabs" role="tablist" aria-label="Project categories">
        <button class="tab is-active" data-layer="text" data-layer-id="work.tab.1" data-c="en.work.filters.0" role="tab" type="button" data-filter="All" aria-selected="true">All</button><button class="tab" data-layer="text" data-layer-id="work.tab.2" data-c="en.work.filters.1" role="tab" type="button" data-filter="AI &amp; ML" aria-selected="false">AI &amp; ML</button><button class="tab" data-layer="text" data-layer-id="work.tab.3" data-c="en.work.filters.2" role="tab" type="button" data-filter="Full Stack" aria-selected="false">Full Stack</button><button class="tab" data-layer="text" data-layer-id="work.tab.4" data-c="en.work.filters.3" role="tab" type="button" data-filter="Bots" aria-selected="false">Bots</button><button class="tab" data-layer="text" data-layer-id="work.tab.5" data-c="en.work.filters.4" role="tab" type="button" data-filter="Desktop" aria-selected="false">Desktop</button><button class="tab" data-layer="text" data-layer-id="work.tab.6" data-c="en.work.filters.5" role="tab" type="button" data-filter="Games" aria-selected="false">Games</button><button class="tab" data-layer="text" data-layer-id="work.tab.7" data-c="en.work.filters.6" role="tab" type="button" data-filter="Web Design" aria-selected="false">Web Design</button><button class="tab" data-layer="text" data-layer-id="work.tab.8" data-c="en.work.filters.7" role="tab" type="button" data-filter="Art &amp; 3D" aria-selected="false">Art &amp; 3D</button>
        <i class="tabs__line" data-layer="shape" data-layer-id="work.tab.line"></i>
      </div>
      <i class="hairline" data-layer="shape" data-layer-id="work.tabs.rule"></i>
      <label class="work__search"><i class="work__search-icon" data-layer="shape" data-layer-id="work.search.icon"></i><span class="work__search-ph" data-layer="text" data-layer-id="work.search" data-c="en.work.search">Search title or category</span><input type="search" aria-label="Search projects" autocomplete="off"><i class="work__search-rule" data-layer="shape" data-layer-id="work.search.rule"></i></label>
    </div>
    <div class="work__slider">
      <ul class="cards" id="cards"><li class="card" data-layer="card" data-layer-id="work.card.1" data-slug="yulya-discord-bot" data-cats="Bots|AI &amp; ML">
          <a class="card__link" href="#work/yulya-discord-bot">
            <figure class="card__media" data-layer="image" data-layer-id="work.card.1.img"><span class="card__poster" aria-hidden="true">YU</span></figure>
            <span class="card__tagwrap"><i class="card__chip-rule" data-layer="shape" data-layer-id="work.card.1.chip.rule"></i><span class="card__tag" data-layer="text" data-layer-id="work.card.1.tag" data-c="projects.0.tag">AI / DISCORD BOT</span></span>
            <div class="card__row"><b class="card__num" data-layer="text" data-layer-id="work.card.1.num" data-c="projects.0.n">01</b><div class="card__titles"><h3 class="card__title" data-layer="text" data-layer-id="work.card.1.title" data-c="projects.0.title">YULYA — AI DISCORD BOT</h3><p class="card__meta" data-layer="text" data-layer-id="work.card.1.meta" data-c="projects.0.meta">BOTS / 2026</p></div><i class="card__arrow" data-layer="shape" data-layer-id="work.card.1.arrow">↗</i></div>
          </a></li><li class="card" data-layer="card" data-layer-id="work.card.2" data-slug="yulya-studio" data-cats="Games|Full Stack">
          <a class="card__link" href="#work/yulya-studio">
            <figure class="card__media" data-layer="image" data-layer-id="work.card.2.img"><span class="card__poster" aria-hidden="true">YU</span></figure>
            <span class="card__tagwrap"><i class="card__chip-rule" data-layer="shape" data-layer-id="work.card.2.chip.rule"></i><span class="card__tag" data-layer="text" data-layer-id="work.card.2.tag" data-c="projects.1.tag">BROWSER GAME ENGINE</span></span>
            <div class="card__row"><b class="card__num" data-layer="text" data-layer-id="work.card.2.num" data-c="projects.1.n">02</b><div class="card__titles"><h3 class="card__title" data-layer="text" data-layer-id="work.card.2.title" data-c="projects.1.title">YULYA STUDIO — GAME MAKER</h3><p class="card__meta" data-layer="text" data-layer-id="work.card.2.meta" data-c="projects.1.meta">GAMES / 2026</p></div><i class="card__arrow" data-layer="shape" data-layer-id="work.card.2.arrow">↗</i></div>
          </a></li><li class="card" data-layer="card" data-layer-id="work.card.3" data-slug="yulya-model-family" data-cats="AI &amp; ML">
          <a class="card__link" href="#work/yulya-model-family">
            <figure class="card__media" data-layer="image" data-layer-id="work.card.3.img"><span class="card__poster" aria-hidden="true">YU</span></figure>
            <span class="card__tagwrap"><i class="card__chip-rule" data-layer="shape" data-layer-id="work.card.3.chip.rule"></i><span class="card__tag" data-layer="text" data-layer-id="work.card.3.tag" data-c="projects.2.tag">FINE-TUNED LLMS</span></span>
            <div class="card__row"><b class="card__num" data-layer="text" data-layer-id="work.card.3.num" data-c="projects.2.n">03</b><div class="card__titles"><h3 class="card__title" data-layer="text" data-layer-id="work.card.3.title" data-c="projects.2.title">YULYA — LOCAL AI MODELS</h3><p class="card__meta" data-layer="text" data-layer-id="work.card.3.meta" data-c="projects.2.meta">AI &amp; ML / 2026</p></div><i class="card__arrow" data-layer="shape" data-layer-id="work.card.3.arrow">↗</i></div>
          </a></li><li class="card" data-slug="desktop-ai-companion" data-cats="Desktop|AI &amp; ML|Art &amp; 3D"><a class="card__link" href="#work/desktop-ai-companion"><figure class="card__media"><span class="card__poster" aria-hidden="true">DE</span></figure><span class="card__tag">DESKTOP APP</span><div class="card__row"><b class="card__num">04</b><div class="card__titles"><h3 class="card__title">DESKTOP AI COMPANION</h3><p class="card__meta">DESKTOP / 2026</p></div><i class="card__arrow">↗</i></div></a></li><li class="card" data-slug="yulya-api" data-cats="Full Stack|AI &amp; ML"><a class="card__link" href="#work/yulya-api"><figure class="card__media"><span class="card__poster" aria-hidden="true">YU</span></figure><span class="card__tag">API / EMBEDDINGS</span><div class="card__row"><b class="card__num">05</b><div class="card__titles"><h3 class="card__title">YULYA API</h3><p class="card__meta">FULL STACK / 2026</p></div><i class="card__arrow">↗</i></div></a></li><li class="card" data-slug="neural-deck" data-cats="Web Design|Bots"><a class="card__link" href="#work/neural-deck"><figure class="card__media"><span class="card__poster" aria-hidden="true">YU</span></figure><span class="card__tag">WEBSITE &amp; DASHBOARD</span><div class="card__row"><b class="card__num">06</b><div class="card__titles"><h3 class="card__title">YULYA NEURAL DECK</h3><p class="card__meta">WEB DESIGN / 2026</p></div><i class="card__arrow">↗</i></div></a></li><li class="card" data-slug="mascot-live2d-art" data-cats="Art &amp; 3D|Desktop"><a class="card__link" href="#work/mascot-live2d-art"><figure class="card__media"><span class="card__poster" aria-hidden="true">MA</span></figure><span class="card__tag">KRITA + LIVE2D</span><div class="card__row"><b class="card__num">07</b><div class="card__titles"><h3 class="card__title">MASCOT &amp; LIVE2D ART</h3><p class="card__meta">ART &amp; 3D / 2026</p></div><i class="card__arrow">↗</i></div></a></li><li class="card" data-slug="mascot-website" data-cats="Web Design|Art &amp; 3D"><a class="card__link" href="#work/mascot-website"><figure class="card__media"><span class="card__poster" aria-hidden="true">MA</span></figure><span class="card__tag">WEB TEMPLATE</span><div class="card__row"><b class="card__num">08</b><div class="card__titles"><h3 class="card__title">MASCOT WEBSITE TEMPLATE</h3><p class="card__meta">WEB DESIGN / 2026</p></div><i class="card__arrow">↗</i></div></a></li><li class="card" data-slug="unity-blender" data-cats="Games|Art &amp; 3D"><a class="card__link" href="#work/unity-blender"><figure class="card__media"><span class="card__poster" aria-hidden="true">UN</span></figure><span class="card__tag">3D &amp; GAME DEV</span><div class="card__row"><b class="card__num">09</b><div class="card__titles"><h3 class="card__title">UNITY &amp; BLENDER EXPERIMENTS</h3><p class="card__meta">GAMES / 2022 – 2026</p></div><i class="card__arrow">↗</i></div></a></li><li class="card" data-slug="yulya-space" data-cats="AI &amp; ML"><a class="card__link" href="#work/yulya-space"><figure class="card__media"><span class="card__poster" aria-hidden="true">YU</span></figure><span class="card__tag">LIVE DEMO</span><div class="card__row"><b class="card__num">10</b><div class="card__titles"><h3 class="card__title">YULYA — LIVE DEMO SPACE</h3><p class="card__meta">AI &amp; ML / 2026</p></div><i class="card__arrow">↗</i></div></a></li><li class="card" data-slug="college-project" data-cats="Full Stack"><a class="card__link" href="#work/college-project"><figure class="card__media"><span class="card__poster" aria-hidden="true">CO</span></figure><span class="card__tag">FULL STACK</span><div class="card__row"><b class="card__num">11</b><div class="card__titles"><h3 class="card__title">COLLEGE PROJECT</h3><p class="card__meta">FULL STACK / 2025</p></div><i class="card__arrow">↗</i></div></a></li></ul>
      <div class="work__controls"><button class="slider__btn" data-layer="shape" data-layer-id="work.prev" type="button" aria-label="Previous">‹</button><button class="slider__btn" data-layer="shape" data-layer-id="work.next" type="button" aria-label="Next">›</button><span class="slider__dots" data-layer="shape" data-layer-id="work.dots"></span><span class="work__count" data-layer="text" data-layer-id="work.count">SEE ALL (11) •</span></div>
    </div>
  </div>
</section>
<section class="tech" id="tech" aria-label="Tools">
  <div class="wrap" data-guide-anchor>
    <i class="hairline" data-layer="shape" data-layer-id="tech.rule"></i>
    <div class="tech__label"><span data-layer="text" data-layer-id="tech.label.1" data-c="en.logos.0">BUILT WITH</span><span data-layer="text" data-layer-id="tech.label.2" data-c="en.logos.1">THE RIGHT TOOLS.</span></div>
    <div class="tech__marquee"><i class="tech__fade tech__fade--l" data-layer="shape" data-layer-id="tech.fade.l"></i><i class="tech__fade tech__fade--r" data-layer="shape" data-layer-id="tech.fade.r"></i><ul class="tech__track"><li class="tile" data-layer="logo" data-layer-id="tech.tile.1"><i class="tile__glyph" style="--c:#ffffff">U</i><span class="tile__name">Unity</span></li><li class="tile" data-layer="logo" data-layer-id="tech.tile.2"><i class="tile__glyph" style="--c:#ea7600">B</i><span class="tile__name">Blender</span></li><li class="tile" data-layer="logo" data-layer-id="tech.tile.3"><i class="tile__glyph" style="--c:#3bbecf">K</i><span class="tile__name">Krita</span></li><li class="tile" data-layer="logo" data-layer-id="tech.tile.4"><i class="tile__glyph" style="--c:#7b61ff">L</i><span class="tile__name">Live2D</span></li><li class="tile" data-layer="logo" data-layer-id="tech.tile.5"><i class="tile__glyph" style="--c:#ffd43b">P</i><span class="tile__name">Python</span></li><li class="tile" data-layer="logo" data-layer-id="tech.tile.6"><i class="tile__glyph" style="--c:#f7df1e">J</i><span class="tile__name">JavaScript</span></li><li class="tile" data-layer="logo" data-layer-id="tech.tile.7"><i class="tile__glyph" style="--c:#9cdcfe">E</i><span class="tile__name">Electron</span></li><li class="tile" data-layer="logo" data-layer-id="tech.tile.8"><i class="tile__glyph" style="--c:#f5f5f7">O</i><span class="tile__name">Ollama</span></li><li class="tile" data-layer="logo" data-layer-id="tech.tile.9"><i class="tile__glyph" style="--c:#ffd21e">H</i><span class="tile__name">Hugging Face</span></li><li class="tile"><i class="tile__glyph" style="--c:#5865f2">D</i><span class="tile__name">Discord API</span></li><li class="tile"><i class="tile__glyph" style="--c:#8ab4f8">G</i><span class="tile__name">Gemini</span></li><li class="tile"><i class="tile__glyph" style="--c:#2d8cff">M</i><span class="tile__name">Monaco</span></li><li class="tile"><i class="tile__glyph" style="--c:#f05133">G</i><span class="tile__name">Git &amp; GitHub</span></li><li class="tile"><i class="tile__glyph" style="--c:#9bd">W</i><span class="tile__name">whisper.cpp</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">U</i><span class="tile__name">Unity</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">B</i><span class="tile__name">Blender</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">K</i><span class="tile__name">Krita</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">L</i><span class="tile__name">Live2D</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">P</i><span class="tile__name">Python</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">J</i><span class="tile__name">JavaScript</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">E</i><span class="tile__name">Electron</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">O</i><span class="tile__name">Ollama</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">H</i><span class="tile__name">Hugging Face</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">D</i><span class="tile__name">Discord API</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">G</i><span class="tile__name">Gemini</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">M</i><span class="tile__name">Monaco</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">G</i><span class="tile__name">Git &amp; GitHub</span></li><li class="tile" aria-hidden="true"><i class="tile__glyph">W</i><span class="tile__name">whisper.cpp</span></li></ul></div>
  </div>
</section>
<section class="highlights" id="highlights" aria-label="Highlights and proof">
  <div class="wrap hl__grid" data-guide-anchor>
    <div class="hl__panel" data-layer="shape" data-layer-id="hl.panel">
      <i class="hl__glow" data-layer="shape" data-layer-id="hl.panel.glow" aria-hidden="true"></i>
      <p class="eyebrow" data-layer="text" data-layer-id="hl.eyebrow" data-c="en.highlights.eyebrow">HIGHLIGHTS &amp; PROOF</p>
      <h2 class="h2-display"><span class="h2-line" data-layer="text" data-layer-id="hl.title.1" data-c="en.highlights.title.0">THE WORK.</span><span class="h2-line accent" data-layer="text" data-layer-id="hl.title.2" data-c="en.highlights.title.1">THE PROOF.</span></h2>
      <div class="hl__big"><i class="laurel laurel--l" data-layer="shape" data-layer-id="hl.laurel.l"><svg viewBox="0 0 60 120" width="44" height="88" aria-hidden="true"><path class="laurel__stem" d="M44 116 C14 98 6 54 28 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><g class="laurel__leaves" fill="currentColor"><ellipse cx="20" cy="94" rx="4" ry="9" transform="rotate(-30 20 94)"/><ellipse cx="14" cy="76" rx="4" ry="9" transform="rotate(-20 14 76)"/><ellipse cx="13" cy="58" rx="4" ry="9" transform="rotate(-8 13 58)"/><ellipse cx="16" cy="40" rx="4" ry="9" transform="rotate(8 16 40)"/><ellipse cx="22" cy="24" rx="4" ry="9" transform="rotate(22 22 24)"/></g></svg></i><b class="hl__bignum" data-layer="text" data-layer-id="hl.big" data-c="en.highlights.big">10+</b><i class="laurel laurel--r" data-layer="shape" data-layer-id="hl.laurel.r"><svg viewBox="0 0 60 120" width="44" height="88" aria-hidden="true"><path class="laurel__stem" d="M44 116 C14 98 6 54 28 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><g class="laurel__leaves" fill="currentColor"><ellipse cx="20" cy="94" rx="4" ry="9" transform="rotate(-30 20 94)"/><ellipse cx="14" cy="76" rx="4" ry="9" transform="rotate(-20 14 76)"/><ellipse cx="13" cy="58" rx="4" ry="9" transform="rotate(-8 13 58)"/><ellipse cx="16" cy="40" rx="4" ry="9" transform="rotate(8 16 40)"/><ellipse cx="22" cy="24" rx="4" ry="9" transform="rotate(22 22 24)"/></g></svg></i></div>
      <p class="hl__caption" data-layer="text" data-layer-id="hl.caption" data-c="en.highlights.caption">PROJECTS SHIPPED</p>
      <p class="hl__text" data-layer="text" data-layer-id="hl.text" data-c="en.highlights.text">No trophies yet. Just shipped products, public code and local AI models that anyone can download.</p>
      <a class="hl__link" data-layer="text" data-layer-id="hl.link" data-c="en.highlights.link" data-c-suffix=" ↗" href="https://github.com/moheith" target="_blank" rel="noopener">VIEW GITHUB ↗</a>
    </div>
    <div class="hl__list">
      <div class="hl__listhead"><p class="eyebrow" data-layer="text" data-layer-id="hl.list.title" data-c="en.highlights.listTitle">SELECTED HIGHLIGHTS</p><p class="eyebrow" data-layer="text" data-layer-id="hl.list.range" data-c="en.highlights.range">PUBLIC &amp; VERIFIABLE</p></div>
      <ol class="hl-rows"><li class="hl-row"><a href="https://studio.yulya.me" target="_blank" rel="noopener"><i class="hl-row__rule" data-layer="shape" data-layer-id="hl.row.1.rule"></i><span class="hl-row__idx" data-layer="text" data-layer-id="hl.row.1.idx">01</span><div class="hl-row__main"><h3 class="hl-row__title" data-layer="text" data-layer-id="hl.row.1.title" data-c="highlights.0.t">Yulya Studio, a game maker in the browser</h3><p class="hl-row__sub" data-layer="text" data-layer-id="hl.row.1.sub" data-c="highlights.0.s">Monaco IDE, Gemini AI, live hosting and an online arcade</p></div><b class="hl-row__metric" data-layer="text" data-layer-id="hl.row.1.metric" data-c="highlights.0.m">LIVE</b><i class="hl-row__arrow" data-layer="shape" data-layer-id="hl.row.1.arrow">↗</i></a></li><li class="hl-row"><a href="https://discord.yulya.me" target="_blank" rel="noopener"><i class="hl-row__rule" data-layer="shape" data-layer-id="hl.row.2.rule"></i><span class="hl-row__idx" data-layer="text" data-layer-id="hl.row.2.idx">02</span><div class="hl-row__main"><h3 class="hl-row__title" data-layer="text" data-layer-id="hl.row.2.title" data-c="highlights.1.t">Yulya Discord bot</h3><p class="hl-row__sub" data-layer="text" data-layer-id="hl.row.2.sub" data-c="highlights.1.s">Voice AI, neural memory and a live simulated crypto market. 100% free</p></div><b class="hl-row__metric" data-layer="text" data-layer-id="hl.row.2.metric" data-c="highlights.1.m">LIVE</b><i class="hl-row__arrow" data-layer="shape" data-layer-id="hl.row.2.arrow">↗</i></a></li><li class="hl-row"><a href="https://huggingface.co/moheith" target="_blank" rel="noopener"><i class="hl-row__rule" data-layer="shape" data-layer-id="hl.row.3.rule"></i><span class="hl-row__idx" data-layer="text" data-layer-id="hl.row.3.idx">03</span><div class="hl-row__main"><h3 class="hl-row__title" data-layer="text" data-layer-id="hl.row.3.title" data-c="highlights.2.t">Yulya model family on Hugging Face</h3><p class="hl-row__sub" data-layer="text" data-layer-id="hl.row.3.sub" data-c="highlights.2.s">Fine-tuned local models, from tiny 135M to an 8B model</p></div><b class="hl-row__metric" data-layer="text" data-layer-id="hl.row.3.metric" data-c="highlights.2.m">8B</b><i class="hl-row__arrow" data-layer="shape" data-layer-id="hl.row.3.arrow">↗</i></a></li><li class="hl-row"><a href="https://github.com/moheith/desktop-ai-companion" target="_blank" rel="noopener"><i class="hl-row__rule" data-layer="shape" data-layer-id="hl.row.4.rule"></i><span class="hl-row__idx" data-layer="text" data-layer-id="hl.row.4.idx">04</span><div class="hl-row__main"><h3 class="hl-row__title" data-layer="text" data-layer-id="hl.row.4.title" data-c="highlights.3.t">Desktop AI Companion</h3><p class="hl-row__sub" data-layer="text" data-layer-id="hl.row.4.sub" data-c="highlights.3.s">Live2D mascot with local AI and persistent memory, open source</p></div><b class="hl-row__metric" data-layer="text" data-layer-id="hl.row.4.metric" data-c="highlights.3.m">OSS</b><i class="hl-row__arrow" data-layer="shape" data-layer-id="hl.row.4.arrow">↗</i></a></li><li class="hl-row"><a href="https://github.com/moheith?tab=repositories" target="_blank" rel="noopener"><i class="hl-row__rule" data-layer="shape" data-layer-id="hl.row.5.rule"></i><span class="hl-row__idx" data-layer="text" data-layer-id="hl.row.5.idx">05</span><div class="hl-row__main"><h3 class="hl-row__title" data-layer="text" data-layer-id="hl.row.5.title" data-c="highlights.4.t">13 public repositories</h3><p class="hl-row__sub" data-layer="text" data-layer-id="hl.row.5.sub" data-c="highlights.4.s">AI, bots, games, desktop apps and websites on GitHub</p></div><b class="hl-row__metric" data-layer="text" data-layer-id="hl.row.5.metric" data-c="highlights.4.m">13</b><i class="hl-row__arrow" data-layer="shape" data-layer-id="hl.row.5.arrow">↗</i></a></li><li class="hl-row"><a href="#about"><i class="hl-row__rule" data-layer="shape" data-layer-id="hl.row.6.rule"></i><span class="hl-row__idx" data-layer="text" data-layer-id="hl.row.6.idx">06</span><div class="hl-row__main"><h3 class="hl-row__title" data-layer="text" data-layer-id="hl.row.6.title" data-c="highlights.5.t">Developer, artist and 3D in one</h3><p class="hl-row__sub" data-layer="text" data-layer-id="hl.row.6.sub" data-c="highlights.5.s">Code, Unity, Blender, Krita and Live2D, all by one person</p></div><b class="hl-row__metric" data-layer="text" data-layer-id="hl.row.6.metric" data-c="highlights.5.m">4+ YRS</b><i class="hl-row__arrow" data-layer="shape" data-layer-id="hl.row.6.arrow">↗</i></a></li></ol>
      <ul class="hl__live" aria-live="polite"><li><span class="hl__live-label" data-layer="text" data-layer-id="hl.live.1" data-c="en.highlights.live.0">LATEST ACTIVITY</span><b class="hl__live-val" data-live="latest">—</b></li><li><span class="hl__live-label" data-layer="text" data-layer-id="hl.live.2" data-c="en.highlights.live.1">REPOSITORIES</span><b class="hl__live-val" data-live="repos">—</b></li><li><span class="hl__live-label" data-layer="text" data-layer-id="hl.live.3" data-c="en.highlights.live.2">FOLLOWERS</span><b class="hl__live-val" data-live="followers">—</b></li></ul>
    </div>
  </div>
</section>
<section class="raw" id="raw" aria-label="From raw to real">
  <div class="wrap raw__grid" data-guide-anchor>
    <div class="raw__copy">
      <p class="eyebrow" data-layer="text" data-layer-id="raw.eyebrow" data-c="en.raw.eyebrow">A LOOK UNDER THE SURFACE</p>
      <h2 class="h2-display"><span class="h2-line" data-layer="text" data-layer-id="raw.title.1" data-c="en.raw.title.0">FROM RAW.</span><span class="h2-line accent" data-layer="text" data-layer-id="raw.title.2" data-c="en.raw.title.1">TO REAL.</span></h2>
      <p class="raw__text" data-layer="text" data-layer-id="raw.text" data-c="en.raw.text">One interface. Many iterations. Drag to watch a screen go from grey boxes to a finished, living UI.</p>
      <p class="micro" data-layer="text" data-layer-id="raw.meta.1" data-c="en.raw.meta.0">YULYA STUDIO / 2026</p><p class="micro" data-layer="text" data-layer-id="raw.meta.2" data-c="en.raw.meta.1">UI DESIGN · FRONT-END · MOTION</p>
    </div>
    <div class="raw__stage" id="compare" data-layer="image" data-layer-id="raw.stage" role="slider" tabindex="0" aria-label="Drag to compare wireframe and final UI" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
      <div class="raw__layer raw__layer--final" data-layer="image" data-layer-id="raw.final"><!-- JS/CSS builds the finished Yulya Studio UI mock here (see 6.5) --></div>
      <div class="raw__layer raw__layer--wire" data-layer="image" data-layer-id="raw.wire"><!-- JS/CSS builds the wireframe version of the same screen here --></div>
      <i class="raw__divider" data-layer="shape" data-layer-id="raw.divider"></i><button class="raw__handle" data-layer="shape" data-layer-id="raw.handle" type="button" tabindex="-1" aria-hidden="true">⇆</button>
      <span class="raw__label raw__label--l" data-layer="text" data-layer-id="raw.label.1" data-c="en.raw.solid">WIREFRAME</span><span class="raw__label raw__label--r" data-layer="text" data-layer-id="raw.label.2" data-c="en.raw.final">FINAL UI</span>
    </div>
    <p class="raw__hint micro" data-layer="text" data-layer-id="raw.hint" data-c="en.raw.hint">DRAG TO SEE THE PROCESS</p>
  </div>
</section>
<section class="about" id="about" aria-label="About">
  <div class="wrap" data-guide-anchor>
    <i class="hairline" data-layer="shape" data-layer-id="about.rule"></i>
    <header class="about__head">
      <div><i class="about__eyebrow-rule" data-layer="shape" data-layer-id="about.eyebrow.rule"></i><p class="eyebrow" data-layer="text" data-layer-id="about.eyebrow" data-c="en.about.eyebrow">02 / BEHIND THE SCREEN</p>
        <h2 class="h2-display"><span class="h2-line" data-layer="text" data-layer-id="about.title.1" data-c="en.about.title.0">CODE THAT WORKS.</span><span class="h2-line accent" data-layer="text" data-layer-id="about.title.2" data-c="en.about.title.1">DESIGN THAT FEELS.</span></h2></div>
      <p class="about__text" data-layer="text" data-layer-id="about.text" data-c="en.about.text">I&#x27;m Mohieth Mayura S Y, a full stack developer and graphics designer from Bengaluru. I build AI tools, bots and games, then design every pixel around them in Krita, Blender and Live2D. I speak English, Kannada and Hindi, and I&#x27;m studying BCA at SFGC.</p>
    </header>
    <div class="about__grid">
      <div class="about__col about__col--edu">
        <h3 class="h3-bold" data-layer="text" data-layer-id="edu.title" data-c="en.about.eduTitle">EDUCATION &amp; SKILLS</h3><p class="label-red" data-layer="text" data-layer-id="edu.label" data-c="en.about.eduLabel">EDUCATION</p>
        <ul class="edu-rows"><li class="edu-row"><i class="hairline" data-layer="shape" data-layer-id="edu.row.1.rule"></i><div><h4 class="edu-row__title" data-layer="text" data-layer-id="edu.row.1.title" data-c="education.0.0">SFGC</h4><p class="edu-row__sub" data-layer="text" data-layer-id="edu.row.1.sub" data-c="education.0.1">Bachelor of Computer Applications (BCA)</p></div><span class="edu-row__tag" data-layer="text" data-layer-id="edu.row.1.tag" data-c="education.0.2">ONGOING</span></li><li class="edu-row"><i class="hairline" data-layer="shape" data-layer-id="edu.row.2.rule"></i><div><h4 class="edu-row__title" data-layer="text" data-layer-id="edu.row.2.title" data-c="education.1.0">Self-driven learning</h4><p class="edu-row__sub" data-layer="text" data-layer-id="edu.row.2.sub" data-c="education.1.1">LLM fine-tuning, game development, 3D and digital art</p></div><span class="edu-row__tag" data-layer="text" data-layer-id="edu.row.2.tag" data-c="education.1.2">2022 — NOW</span></li><li class="edu-row"><i class="hairline" data-layer="shape" data-layer-id="edu.row.3.rule"></i><div><h4 class="edu-row__title" data-layer="text" data-layer-id="edu.row.3.title" data-c="education.2.0">Languages</h4><p class="edu-row__sub" data-layer="text" data-layer-id="edu.row.3.sub" data-c="education.2.1">English · Kannada · Hindi</p></div></li></ul>
        <p class="label-red" data-layer="text" data-layer-id="toolkit.label" data-c="en.about.toolkit">CREATIVE TOOLKIT</p>
        <ul class="chips"><li class="chip" data-layer="text" data-layer-id="toolkit.chip.1" data-c="toolkit.0">Full Stack Development</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.2" data-c="toolkit.1">AI &amp; LLM Fine-Tuning</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.3" data-c="toolkit.2">Discord Bots</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.4" data-c="toolkit.3">Game Development</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.5" data-c="toolkit.4">3D Modelling</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.6" data-c="toolkit.5">Digital Art</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.7" data-c="toolkit.6">Live2D Rigging</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.8" data-c="toolkit.7">UI &amp; Web Design</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.9" data-c="toolkit.8">Desktop Apps</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.10" data-c="toolkit.9">Python</li><li class="chip" data-layer="text" data-layer-id="toolkit.chip.11" data-c="toolkit.10">JavaScript</li></ul>
        <i class="hairline" data-layer="shape" data-layer-id="software.rail"></i>
        <ul class="sw-row"><li class="sw" data-layer="logo" data-layer-id="software.1"><i class="sw__glyph" style="--c:#ffffff">Un</i><span class="sw__name">Unity</span></li><li class="sw" data-layer="logo" data-layer-id="software.2"><i class="sw__glyph" style="--c:#ea7600">Bl</i><span class="sw__name">Blender</span></li><li class="sw" data-layer="logo" data-layer-id="software.3"><i class="sw__glyph" style="--c:#3bbecf">Kr</i><span class="sw__name">Krita</span></li><li class="sw" data-layer="logo" data-layer-id="software.4"><i class="sw__glyph" style="--c:#7b61ff">L2</i><span class="sw__name">Live2D</span></li><li class="sw" data-layer="logo" data-layer-id="software.5"><i class="sw__glyph" style="--c:#ffd43b">Py</i><span class="sw__name">Python</span></li><li class="sw" data-layer="logo" data-layer-id="software.6"><i class="sw__glyph" style="--c:#f7df1e">JS</i><span class="sw__name">JavaScript</span></li><li class="sw" data-layer="logo" data-layer-id="software.7"><i class="sw__glyph" style="--c:#f5f5f7">Ol</i><span class="sw__name">Ollama</span></li><li class="sw" data-layer="logo" data-layer-id="software.8"><i class="sw__glyph" style="--c:#f05133">Gi</i><span class="sw__name">Git</span></li></ul>
      </div>
      <div class="about__col about__col--proc">
        <h3 class="h3-bold" data-layer="text" data-layer-id="process.title" data-c="en.about.processTitle">FROM IDEA TO LAUNCH</h3>
        <i class="proc__spine" data-layer="shape" data-layer-id="process.spine"></i>
        <ol class="procs"><li class="proc"><b class="proc__num" data-layer="text" data-layer-id="process.1.num" data-c="process.0.0">01</b><i class="proc__node" data-layer="shape" data-layer-id="process.1.node"></i><div><h4 class="proc__title" data-layer="text" data-layer-id="process.1.title" data-c="process.0.1">THE IDEA</h4><p class="proc__text" data-layer="text" data-layer-id="process.1.text" data-c="process.0.2">Understand the problem and who it is for. Define the goal, the features and the feel.</p></div><i class="proc__line" data-layer="shape" data-layer-id="process.1.line"></i></li><li class="proc"><b class="proc__num" data-layer="text" data-layer-id="process.2.num" data-c="process.1.0">02</b><i class="proc__node" data-layer="shape" data-layer-id="process.2.node"></i><div><h4 class="proc__title" data-layer="text" data-layer-id="process.2.title" data-c="process.1.1">THE PLAN</h4><p class="proc__text" data-layer="text" data-layer-id="process.2.text" data-c="process.1.2">Pick the stack, sketch the architecture and wireframe the screens before writing code.</p></div><i class="proc__line" data-layer="shape" data-layer-id="process.2.line"></i></li><li class="proc"><b class="proc__num" data-layer="text" data-layer-id="process.3.num" data-c="process.2.0">03</b><i class="proc__node" data-layer="shape" data-layer-id="process.3.node"></i><div><h4 class="proc__title" data-layer="text" data-layer-id="process.3.title" data-c="process.2.1">THE BUILD</h4><p class="proc__text" data-layer="text" data-layer-id="process.3.text" data-c="process.2.2">Code, draw and model together, one working piece at a time.</p></div><i class="proc__line" data-layer="shape" data-layer-id="process.3.line"></i></li><li class="proc"><b class="proc__num" data-layer="text" data-layer-id="process.4.num" data-c="process.3.0">04</b><i class="proc__node" data-layer="shape" data-layer-id="process.4.node"></i><div><h4 class="proc__title" data-layer="text" data-layer-id="process.4.title" data-c="process.3.1">THE POLISH</h4><p class="proc__text" data-layer="text" data-layer-id="process.4.text" data-c="process.3.2">Speed, motion, accessibility and the small details that make it feel premium.</p></div><i class="proc__line" data-layer="shape" data-layer-id="process.4.line"></i></li><li class="proc"><b class="proc__num" data-layer="text" data-layer-id="process.5.num" data-c="process.4.0">05</b><i class="proc__node" data-layer="shape" data-layer-id="process.5.node"></i><div><h4 class="proc__title" data-layer="text" data-layer-id="process.5.title" data-c="process.4.1">THE LAUNCH</h4><p class="proc__text" data-layer="text" data-layer-id="process.5.text" data-c="process.4.2">Ship it, watch real usage, and keep improving it.</p></div></li></ol>
      </div>
      <div class="about__col about__col--quote">
        <figure class="quote" data-layer="shape" data-layer-id="quote.card">
          <i class="quote__sheen" data-layer="shape" data-layer-id="quote.sheen" aria-hidden="true"></i><i class="quote__icon" data-layer="shape" data-layer-id="quote.icon">❝</i>
          <blockquote><span class="quote__l1" data-layer="text" data-layer-id="quote.l1" data-c="en.about.quote.0">Build it like an engineer.</span><span class="quote__l2" data-layer="text" data-layer-id="quote.l2" data-c="en.about.quote.1">Finish it like an artist.</span></blockquote>
          <figcaption class="quote__sig script" data-layer="text" data-layer-id="quote.sig" data-c="en.about.signature">Mayura</figcaption>
          <p class="quote__foot"><span data-layer="text" data-layer-id="quote.foot.1" data-c="en.about.quoteFoot.0">LET&#x27;S BUILD</span><span data-layer="text" data-layer-id="quote.foot.2" data-c="en.about.quoteFoot.1">SOMETHING WORTH USING</span></p><i class="quote__star" data-layer="shape" data-layer-id="quote.star">✳</i>
        </figure>
      </div>
    </div>
  </div>
</section>
<section class="journey" id="journey" aria-label="Journey">
  <div class="wrap" data-guide-anchor>
    <i class="hairline" data-layer="shape" data-layer-id="jr.rule"></i>
    <header class="journey__head">
      <div><p class="eyebrow" data-layer="text" data-layer-id="jr.eyebrow" data-c="en.journey.eyebrow">03 / THE JOURNEY</p><h2 class="h2-bold" data-layer="text" data-layer-id="jr.title" data-c="en.journey.title">KEEP MOVING. KEEP BUILDING.</h2></div>
      <a class="journey__resume" data-layer="text" data-layer-id="jr.resume" data-c="en.journey.resume" data-c-suffix=" ⤓" href="assets/cv/Mayura_Resume.pdf" download>RESUME ⤓</a>
    </header>
    <div class="journey__grid">
      <div class="journey__list"><i class="jr__spine" data-layer="shape" data-layer-id="jr.spine"></i><ol class="jr-rows"><li class="jr-row is-open"><i class="hairline" data-layer="shape" data-layer-id="jr.row.1.rule"></i><button class="jr-row__btn" type="button" aria-expanded="true" aria-controls="jr-body-1"><span class="jr-row__date is-now" data-layer="text" data-layer-id="jr.row.1.date" data-c="timeline.0.0">2026 · NOW</span><i class="jr-row__node" data-layer="shape" data-layer-id="jr.row.1.node"></i><span class="jr-row__main"><span class="jr-row__role" data-layer="text" data-layer-id="jr.row.1.role" data-c="timeline.0.1">Founder &amp; Lead Developer</span><span class="jr-row__sub" data-layer="text" data-layer-id="jr.row.1.sub" data-c="timeline.0.2">Yulya, the AI ecosystem</span></span><i class="jr-row__plus" data-layer="shape" data-layer-id="jr.row.1.plus">+</i></button><div class="jr-row__body" id="jr-body-1"><div class="jr-row__inner"><p class="jr-row__desc" data-layer="text" data-layer-id="jr.row.1.desc" data-c="timeline.0.3">Building the whole Yulya world solo: a multimodal Discord bot with voice, memory and a simulated crypto economy, Yulya Studio (a browser game maker with Gemini AI), a family of locally runnable fine-tuned models, and the web dashboards around them.</p></div></div></li><li class="jr-row"><i class="hairline" data-layer="shape" data-layer-id="jr.row.2.rule"></i><button class="jr-row__btn" type="button" aria-expanded="false" aria-controls="jr-body-2"><span class="jr-row__date" data-layer="text" data-layer-id="jr.row.2.date" data-c="timeline.1.0">2025 · NOW</span><i class="jr-row__node" data-layer="shape" data-layer-id="jr.row.2.node"></i><span class="jr-row__main"><span class="jr-row__role" data-layer="text" data-layer-id="jr.row.2.role" data-c="timeline.1.1">BCA Student</span><span class="jr-row__sub" data-layer="text" data-layer-id="jr.row.2.sub" data-c="timeline.1.2">SFGC, Bengaluru</span></span><i class="jr-row__plus" data-layer="shape" data-layer-id="jr.row.2.plus">+</i></button><div class="jr-row__body" id="jr-body-2"><div class="jr-row__inner"><p class="jr-row__desc">Studying Computer Applications while shipping real products alongside the coursework.</p></div></div></li><li class="jr-row"><i class="hairline" data-layer="shape" data-layer-id="jr.row.3.rule"></i><button class="jr-row__btn" type="button" aria-expanded="false" aria-controls="jr-body-3"><span class="jr-row__date" data-layer="text" data-layer-id="jr.row.3.date" data-c="timeline.2.0">2024 · 2026</span><i class="jr-row__node" data-layer="shape" data-layer-id="jr.row.3.node"></i><span class="jr-row__main"><span class="jr-row__role" data-layer="text" data-layer-id="jr.row.3.role" data-c="timeline.2.1">Full Stack &amp; AI Developer</span><span class="jr-row__sub" data-layer="text" data-layer-id="jr.row.3.sub" data-c="timeline.2.2">Independent projects</span></span><i class="jr-row__plus" data-layer="shape" data-layer-id="jr.row.3.plus">+</i></button><div class="jr-row__body" id="jr-body-3"><div class="jr-row__inner"><p class="jr-row__desc">Designing and building apps, bots, APIs and fine-tuned models, from database to interface.</p></div></div></li><li class="jr-row"><i class="hairline" data-layer="shape" data-layer-id="jr.row.4.rule"></i><button class="jr-row__btn" type="button" aria-expanded="false" aria-controls="jr-body-4"><span class="jr-row__date" data-layer="text" data-layer-id="jr.row.4.date" data-c="timeline.3.0">2022 · NOW</span><i class="jr-row__node" data-layer="shape" data-layer-id="jr.row.4.node"></i><span class="jr-row__main"><span class="jr-row__role" data-layer="text" data-layer-id="jr.row.4.role" data-c="timeline.3.1">Digital Artist &amp; Designer</span><span class="jr-row__sub" data-layer="text" data-layer-id="jr.row.4.sub" data-c="timeline.3.2">Krita · Live2D · Blender</span></span><i class="jr-row__plus" data-layer="shape" data-layer-id="jr.row.4.plus">+</i></button><div class="jr-row__body" id="jr-body-4"><div class="jr-row__inner"><p class="jr-row__desc">Mascot art, Live2D models, 3D assets and interface visuals, drawn in Krita, rigged in Live2D and built in Blender.</p></div></div></li><li class="jr-row"><i class="hairline" data-layer="shape" data-layer-id="jr.row.5.rule"></i><button class="jr-row__btn" type="button" aria-expanded="false" aria-controls="jr-body-5"><span class="jr-row__date" data-layer="text" data-layer-id="jr.row.5.date" data-c="timeline.4.0">2022</span><i class="jr-row__node" data-layer="shape" data-layer-id="jr.row.5.node"></i><span class="jr-row__main"><span class="jr-row__role" data-layer="text" data-layer-id="jr.row.5.role" data-c="timeline.4.1">Where It Began</span><span class="jr-row__sub" data-layer="text" data-layer-id="jr.row.5.sub" data-c="timeline.4.2">First scripts, first games, first designs</span></span><i class="jr-row__plus" data-layer="shape" data-layer-id="jr.row.5.plus">+</i></button><div class="jr-row__body" id="jr-body-5"><div class="jr-row__inner"><p class="jr-row__desc">Started with small websites, game experiments and drawings. Never stopped.</p></div></div></li></ol></div>
      <aside class="journey__ms">
        <i class="hairline" data-layer="shape" data-layer-id="ms.rule"></i><p class="eyebrow" data-layer="text" data-layer-id="ms.label" data-c="en.journey.milestonesLabel">A FEW MILESTONES</p>
        <h3 class="h3-display"><span class="h2-line" data-layer="text" data-layer-id="ms.title.1" data-c="en.journey.milestonesTitle.0">LITTLE WINS.</span><span class="h2-line accent" data-layer="text" data-layer-id="ms.title.2" data-c="en.journey.milestonesTitle.1">BIG MEANING.</span></h3>
        <ul class="ms-rows"><li class="ms-row"><a href="#"><i class="hairline" data-layer="shape" data-layer-id="ms.row.1.rule"></i><span class="ms-row__idx" data-layer="text" data-layer-id="ms.row.1.idx">01</span><span class="ms-row__title" data-layer="text" data-layer-id="ms.row.1.title" data-c="milestones.0.0">Yulya Studio goes live</span><span class="ms-row__year" data-layer="text" data-layer-id="ms.row.1.year" data-c="milestones.0.1">2026</span><i class="ms-row__arrow" data-layer="shape" data-layer-id="ms.row.1.arrow">↗</i></a></li><li class="ms-row"><a href="#"><i class="hairline" data-layer="shape" data-layer-id="ms.row.2.rule"></i><span class="ms-row__idx" data-layer="text" data-layer-id="ms.row.2.idx">02</span><span class="ms-row__title" data-layer="text" data-layer-id="ms.row.2.title" data-c="milestones.1.0">Yulya Discord bot launched, free</span><span class="ms-row__year" data-layer="text" data-layer-id="ms.row.2.year" data-c="milestones.1.1">2026</span><i class="ms-row__arrow" data-layer="shape" data-layer-id="ms.row.2.arrow">↗</i></a></li><li class="ms-row"><a href="#"><i class="hairline" data-layer="shape" data-layer-id="ms.row.3.rule"></i><span class="ms-row__idx" data-layer="text" data-layer-id="ms.row.3.idx">03</span><span class="ms-row__title" data-layer="text" data-layer-id="ms.row.3.title" data-c="milestones.2.0">Fine-tuned models on Hugging Face</span><span class="ms-row__year" data-layer="text" data-layer-id="ms.row.3.year" data-c="milestones.2.1">2026</span><i class="ms-row__arrow" data-layer="shape" data-layer-id="ms.row.3.arrow">↗</i></a></li><li class="ms-row"><a href="#"><i class="hairline" data-layer="shape" data-layer-id="ms.row.4.rule"></i><span class="ms-row__idx" data-layer="text" data-layer-id="ms.row.4.idx">04</span><span class="ms-row__title" data-layer="text" data-layer-id="ms.row.4.title" data-c="milestones.3.0">13 public repositories</span><span class="ms-row__year" data-layer="text" data-layer-id="ms.row.4.year" data-c="milestones.3.1">NOW</span><i class="ms-row__arrow" data-layer="shape" data-layer-id="ms.row.4.arrow">↗</i></a></li></ul>
      </aside>
    </div>
  </div>
</section>
<section class="contact" id="contact" aria-label="Contact">
  <div class="wrap contact__grid" data-guide-anchor>
    <i class="hairline" data-layer="shape" data-layer-id="ct.rule"></i>
    <div class="contact__lead">
      <p class="eyebrow" data-layer="text" data-layer-id="ct.eyebrow" data-c="en.contact.eyebrow">04 / YOUR NEXT PROJECT</p>
      <h2 class="h2-display h2-xl"><span class="h2-line" data-layer="text" data-layer-id="ct.title.1" data-c="en.contact.title.0">LET&#x27;S WORK</span><span class="h2-line"><span data-layer="text" data-layer-id="ct.title.2" data-c="en.contact.title.1">TOGETHER.</span><i class="dot-sq" data-layer="shape" data-layer-id="ct.dot"></i></span></h2>
      <p class="contact__text" data-layer="text" data-layer-id="ct.text" data-c="en.contact.text">Got an idea you want to bring to life? Let&#x27;s build something worth using.</p>
      <a class="cta" href="https://wa.me/918660227877?text=Hi%20Mayura%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20talk." target="_blank" rel="noopener"><i class="cta__circle" data-layer="shape" data-layer-id="ct.cta.circle">↗</i><span class="cta__label" data-layer="text" data-layer-id="ct.cta.label" data-c="en.contact.cta">START A CONVERSATION</span></a>
    </div>
    <ul class="ct-rows"><li class="ct-row"><a href="mailto:moheithmayura@gmail.com" data-copy-email target="_self" rel="noopener"><i class="hairline" data-layer="shape" data-layer-id="ct.row.1.rule"></i><i class="ct-row__icon" data-layer="shape" data-layer-id="ct.row.1.icon"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M3 6h18v12H3z M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></i><span class="ct-row__txt"><span class="ct-row__label" data-layer="text" data-layer-id="ct.row.1.label" data-c="en.contact.labels.0">EMAIL</span><span class="ct-row__value" data-layer="text" data-layer-id="ct.row.1.value">moheithmayura@gmail.com</span></span><i class="ct-row__arrow" data-layer="shape" data-layer-id="ct.row.1.arrow">↗</i></a></li><li class="ct-row"><a href="https://instagram.com/moheith_mayura" target="_blank" rel="noopener"><i class="hairline" data-layer="shape" data-layer-id="ct.row.2.rule"></i><i class="ct-row__icon" data-layer="shape" data-layer-id="ct.row.2.icon"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/></svg></i><span class="ct-row__txt"><span class="ct-row__label" data-layer="text" data-layer-id="ct.row.2.label" data-c="en.contact.labels.1">INSTAGRAM</span><span class="ct-row__value" data-layer="text" data-layer-id="ct.row.2.value">@moheith_mayura</span></span><i class="ct-row__arrow" data-layer="shape" data-layer-id="ct.row.2.arrow">↗</i></a></li><li class="ct-row"><a href="https://wa.me/918660227877" target="_blank" rel="noopener"><i class="hairline" data-layer="shape" data-layer-id="ct.row.3.rule"></i><i class="ct-row__icon" data-layer="shape" data-layer-id="ct.row.3.icon"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></i><span class="ct-row__txt"><span class="ct-row__label" data-layer="text" data-layer-id="ct.row.3.label" data-c="en.contact.labels.2">WHATSAPP</span><span class="ct-row__value" data-layer="text" data-layer-id="ct.row.3.value">+91 86602 27877</span></span><i class="ct-row__arrow" data-layer="shape" data-layer-id="ct.row.3.arrow">↗</i></a></li><li class="ct-row"><a href="#" target="_self" rel="noopener"><i class="hairline" data-layer="shape" data-layer-id="ct.row.4.rule"></i><i class="ct-row__icon" data-layer="shape" data-layer-id="ct.row.4.icon"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></i><span class="ct-row__txt"><span class="ct-row__label" data-layer="text" data-layer-id="ct.row.4.label" data-c="en.contact.labels.3">BASED IN</span><span class="ct-row__value" data-layer="text" data-layer-id="ct.row.4.value">Bengaluru, India</span></span><i class="ct-row__arrow" data-layer="shape" data-layer-id="ct.row.4.arrow">↗</i></a></li></ul>
    <a class="poster" href="https://discord.yulya.me" target="_blank" rel="noopener" data-layer="card" data-layer-id="ct.card" aria-label="Open the Yulya project">
      <div class="poster__term"><span class="poster__line" data-layer="text" data-layer-id="ct.card.term.1" data-c="en.contact.term.0">$ whoami</span><span class="poster__line" data-layer="text" data-layer-id="ct.card.term.2" data-c="en.contact.term.1">$ ls projects/</span><span class="poster__line" data-layer="text" data-layer-id="ct.card.term.3" data-c="en.contact.term.2">$ ./ship --now</span></div>
      <p class="poster__title"><span class="poster__l1" data-layer="text" data-layer-id="ct.card.poster.1" data-c="en.contact.poster.0">BUILD IT.</span><span class="poster__l2" data-layer="text" data-layer-id="ct.card.poster.2" data-c="en.contact.poster.1">MAKE IT FEEL ALIVE.</span></p>
      <span class="poster__label" data-layer="text" data-layer-id="ct.card.label">MAYURA●</span><i class="poster__btn" data-layer="shape" data-layer-id="ct.card.btn">↗</i>
    </a>
    <form class="brief" id="brief" action="#" novalidate>
      <i class="hairline" data-layer="shape" data-layer-id="ct.brief.rule"></i><i class="brief__bar" data-layer="shape" data-layer-id="ct.brief.bar"></i>
      <label class="brief__field"><span class="brief__ph" data-layer="text" data-layer-id="ct.brief.input" data-c="en.contact.brief">Tell me about your project</span><input type="text" name="brief" aria-label="Tell me about your project" autocomplete="off"></label>
      <span class="brief__icons"><button class="brief__icon" data-layer="shape" data-layer-id="ct.brief.icon.1" type="button" aria-label="Attach">＋</button><button class="brief__icon" data-layer="shape" data-layer-id="ct.brief.icon.2" type="button" aria-label="Preview">◉</button><button class="brief__icon" data-layer="shape" data-layer-id="ct.brief.icon.3" type="button" aria-label="Send">↗</button></span>
    </form>
  </div>
</section>
</main>
<footer class="footer" id="footer">
  <div class="wrap footer__grid" data-guide-anchor>
    <i class="hairline" data-layer="shape" data-layer-id="ft.rule"></i>
    <a class="footer__logo" href="#home"><span class="nav__wordmark" data-layer="text" data-layer-id="ft.logo" data-c="meta.name">MAYURA</span><i class="nav__dot" data-layer="shape" data-layer-id="ft.dot"></i></a>
    <div class="footer__mid"><p class="footer__copy" data-layer="text" data-layer-id="ft.copy">© 2026 MOHIETH MAYURA S Y. All rights reserved.</p><p class="footer__time" data-layer="text" data-layer-id="ft.time" data-clock>Bengaluru · 17:04 IST</p></div>
    <div class="footer__right">
      <ul class="footer__social"><li><a class="footer__link" data-layer="text" data-layer-id="ft.social.1" data-c="social.0.0" href="https://github.com/moheith" target="_blank" rel="noopener">GitHub</a></li><li><a class="footer__link" data-layer="text" data-layer-id="ft.social.2" data-c="social.1.0" href="https://linkedin.com/in/mohieth" target="_blank" rel="noopener">LinkedIn</a></li><li><a class="footer__link" data-layer="text" data-layer-id="ft.social.3" data-c="social.2.0" href="https://x.com/mohiethh" target="_blank" rel="noopener">X</a></li><li><a class="footer__link" data-layer="text" data-layer-id="ft.social.4" data-c="social.3.0" href="https://huggingface.co/moheith" target="_blank" rel="noopener">Hugging Face</a></li><li><a class="footer__link" data-layer="text" data-layer-id="ft.social.5" data-c="social.4.0" href="https://ollama.com/moheith" target="_blank" rel="noopener">Ollama</a></li><li><a class="footer__link" data-layer="text" data-layer-id="ft.social.6" data-c="social.5.0" href="https://instagram.com/moheith_mayura" target="_blank" rel="noopener">Instagram</a></li></ul>
      <button class="footer__top" data-layer="text" data-layer-id="ft.top" data-c="en.footer.top" data-c-suffix=" ↑" type="button">Back to top ↑</button>
      <span class="accent-dots" role="group" aria-label="Accent colour"><button class="accent-dot" data-layer="shape" data-layer-id="ft.accent.1" type="button" data-accent="red" aria-label="red accent"></button><button class="accent-dot" data-layer="shape" data-layer-id="ft.accent.2" type="button" data-accent="violet" aria-label="violet accent"></button><button class="accent-dot" data-layer="shape" data-layer-id="ft.accent.3" type="button" data-accent="blue" aria-label="blue accent"></button><button class="accent-dot" data-layer="shape" data-layer-id="ft.accent.4" type="button" data-accent="amber" aria-label="amber accent"></button></span>
    </div>
  </div>
</footer>
<div id="swarm-bars" aria-hidden="true"><i class="bt"></i><i class="bl"></i></div>
<div id="swarm-rulers" aria-hidden="true"><i class="rt"></i><i class="rl"></i></div>
<div id="swarm-root" aria-hidden="true"></div>
<div id="hud" class="hud" data-state="scanning" role="status" aria-live="polite">
  <div data-show="scanning"><span>Scanning page…</span><i class="indeterminate"></i><button class="ghost" type="button" data-act="tour">Tour</button><button type="button" data-act="speed">1x</button><button type="button" data-act="sound" aria-pressed="false" aria-label="Toggle sound">🔇</button><button type="button" data-act="close" aria-label="Skip the intro">✕</button></div>
  <div data-show="building"><span class="avatars" aria-hidden="true"><i style="background:#5eead4"></i><i style="background:#fb923c"></i><i style="background:#fff"></i><i style="background:#a78bfa"></i><i style="background:#7dd3fc"></i></span><span data-bind="agents">18 agents</span><i class="sep"></i><span data-bind="layers">0 / 364 layers</span><i class="track"><b></b></i><button class="pill-blue" type="button" data-act="tour">Touring</button><button type="button" data-act="speed">1x</button><button type="button" data-act="sound" aria-pressed="false" aria-label="Toggle sound">🔇</button><button type="button" data-act="close" aria-label="Skip the intro">✕</button></div>
  <div data-show="done"><span data-bind="done">Rebuilt by 30 agents in 51.4s</span><button type="button" data-act="sound" aria-label="Toggle sound">🔇</button><button class="pill-blue" type="button" data-act="live">Go live</button><button class="ghost" type="button" data-act="replay">Replay</button><button type="button" data-act="close" aria-label="Close">✕</button></div>
</div>
<div id="toast" class="toast" role="status" aria-live="polite"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="js/content.js" defer></script>
<script src="js/swarm-script.js" defer></script>
<script src="js/swarm.js" defer></script>
<script src="js/hud.js" defer></script>
<script src="js/scroll.js" defer></script><script src="js/cursor.js" defer></script><script src="js/hero.js" defer></script>
<script src="js/work.js" defer></script><script src="js/compare.js" defer></script><script src="js/journey.js" defer></script>
<script src="js/extras.js" defer></script><script src="js/main.js" defer></script>
</body>
</html>
```

---------------------------------------------------------------------
## PART 10 — MODULE CONTRACTS AND BOOT ORDER (how the files you write must behave)

Every file below is yours to write. The HTML (Part 9) and the swarm files (5.7) are fixed. Read 10.1 first: it is the order in which things must happen, and getting it wrong breaks the intro.

### 10.1 Boot order (`js/main.js`) — this exact sequence
```
DOMContentLoaded →
 1. hydrate()            For every element with [data-c]: value = CONTENT path (e.g. "en.hero.intro" → CONTENT.en.intro, "projects.0.title"),
                         text = (data-c-prefix || "") + (data-c-upper ? value.toUpperCase() : value) + (data-c-suffix || "").
                         Set el.textContent = text. Also update data-full if it exists. (Do this BEFORE the swarm starts: the engine reads each text
                         layer's textContent once, at Swarm.start(), and types exactly that.)
                         Path syntax: dot-separated; numbers index arrays; "meta.*", "links.*", "en.*" resolve inside CONTENT.
                         Also set href/aria from CONTENT.links where the HTML has placeholders.
 2. Work.init()          Rebuild cards 4..N from CONTENT.projects (identical markup to the static ones, no data-layer), wire filters, search, slider, modal.
 3. Compare.build()      Build the two UI mock layers inside .raw__layer--final and .raw__layer--wire (see 6.5).
 4. Extras.initStatic()  Clock (updates BOTH textContent and dataset.full of [data-clock]), accent restore from localStorage, Motion-off restore, toasts.
 5. await Promise.race([document.fonts.ready, wait(1500)])
 6. Hero.fitText()       The giant word must have its FINAL size before the swarm measures boxes.
 7. Scroll.init()        Create Lenis and call lenis.stop() immediately (window.scrollTo still works while stopped). Register ScrollTrigger.
 8. const skip = localStorage.motion==='off' || matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('intro=off');
    if (skip) { Swarm.finishAll(); startSite(); } else { Swarm.start(); }
 9. document.addEventListener('swarmstate', e => { if (e.detail === 'finale' || e.detail === 'live') startSite(); });
startSite() (idempotent, runs once): lenis.start(); Cursor.enable(); Hero.startCounters(); Reveals.init(); ScrollTrigger.refresh().
```
**Reveals rule:** after the swarm has run, everything above the current scroll position is already visible. `Reveals.init()` may only animate elements whose top is BELOW the bottom of the viewport at that moment (this matters when the visitor pressed ✕ early). Never hide an element that is already on screen, and never run reveals while `Swarm.state === 'building'`.

**Never touch** a `[data-layer]` element's `textContent`, `classList` or `visibility` while `Swarm.state === 'building'`, except through the swarm. After the swarm finishes you may animate transforms/opacity freely, but never replace the element or its text with something different (the engine restores `textContent = data-full`).

### 10.2 `js/scroll.js`
- `Scroll.init()`: Lenis (`lerp:.09, smoothWheel:true`), `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`. Export `Scroll.stop()`, `Scroll.start()`, `Scroll.to(target, {offset:-64})`.
- Scroll spy with IntersectionObserver over `#home #work #highlights #about #journey #contact`: sets `.is-active` on the matching `.nav__link` and moves `.nav__underline` (2px red bar) under it with a transform transition (0.4s, `--ease`).
- Hash routing: link clicks call `Scroll.to`, update the hash with `history.pushState` (no jump). On load, if the hash is a section id, scroll there after startSite. `#work/<slug>` opens the project modal (work.js).
- **Playhead + timecode (7.1):** `#scroll-playhead .ph-line` height = scroll progress; `.ph-time` shows `HH:MM:SS:FF` where progress 0..1 maps to 00:00:00:00..00:02:00:00 at 24 fps. Chapter markers appear on hover (one tick per section).
- Nav: on scroll > 8px add `.is-scrolled` (adds the blurred background). Mobile burger toggles `.is-open` on `.nav` (full-screen overlay menu, big Anton links stacking in, Esc closes, focus trap).

### 10.3 `js/cursor.js`
Custom site cursor (7.2). `Cursor.enable()` is called only by `startSite()`; before that the normal OS cursor is used. Disabled on `(hover:none)` devices and when Motion-off. Elements opt in with `data-cursor="view|open|drag|close"`; add these attributes yourself in JS to: `.card__link` (view), `.hero__demo` and `.poster` (open), `.work__slider` and `.raw__stage` (drag), modal close button (close). Also contains the magnetic-button helper (7.3) and the letter-roll link hover.

### 10.4 `js/hero.js`
- `Hero.fitText()`: set the font-size of `.hero__word` so its rendered width = 94% of the viewport width (measure at 100px, scale linearly). Re-run on resize (debounced 120 ms) and after fonts load. Position: `left:3vw`, cap-top ≈ 14% down the hero. Use `background-clip:text` gradient from 6.1. The text of `.hero__word` is `CONTENT.meta.heroWord`.
- Photo fallback: on `error` of `.hero__photo` replace it with an inline SVG silhouette (head and shoulders, black on a dark-red glow) with the same size and position.
- `Hero.startCounters()`: count the numerals in `.stat__num` up from 0 (1.4 s, ease-out, only the digits; keep the `+`). Set `textContent` while counting and restore the exact original when finished. Only runs after the swarm is done.
- Parallax and spotlight exactly as in 6.1 (GSAP ScrollTrigger scrub for scroll; `quickTo` for the mouse, lerped). Skip in Motion-off.

### 10.5 `js/work.js`
- Cards: `Work.init()` replaces every `.card` WITHOUT `data-layer` by a fresh one built from `CONTENT.projects[i]` (the first three cards keep their layers; their text is hydrated by `data-c`). Template (identical to the static markup in Part 9): `li.card[data-slug][data-cats] > a.card__link[href="#work/<slug>"] > figure.card__media (img if the file loads, else span.card__poster = code poster), span.card__tag, div.card__row (b.card__num, div.card__titles (h3.card__title, p.card__meta), i.card__arrow)`.
- **Code poster** (when `assets/img/work-NN.jpg` does not exist): background = `linear-gradient(135deg, hsl(H 60% 14%), hsl(H 50% 8%))` with H = `(index*47)%360`, a 24px dot grid (`radial-gradient`), the first two letters of the title in Anton at 0.10 opacity bottom-right (font-size 9rem), and up to three tech chips bottom-left from `project.tech`.
- Filters: `.tab[data-filter]`. Click → `aria-selected`, move `.tabs__line` under the tab (transform + width), and filter by `data-cats` (pipe-separated, "All" shows everything) with a **FLIP** animation (record rects, toggle `hidden`, animate the delta 0.5 s). Update `.work__count` text to `SEE ALL (N) •` where N = visible cards. (Careful: `.work__count` is a text layer; only change it after the swarm is done.)
- Search: the visible `<input type="search">` overlays the `.work__search-ph` placeholder span (the span hides once the input has text). Fuzzy match on title + tag + tech; highlight matched letters in red; empty state text `No projects match.`
- Slider: `.cards` is a horizontal scroll-snap list (`scroll-snap-type:x mandatory`), pointer-drag with inertia, prev/next buttons (`.slider__btn`), dots (`.slider__dots` filled with one `<i>` per page), 3 cards visible on desktop, 2 on tablet, 1.15 on mobile.
- Hover: 3D tilt ±6° (GSAP quickTo), image scale 1.05, red outline.
- **Cinema modal** (7.6/7.7): built lazily on first open, deep link `#work/<slug>`, ←/→/Esc/Space, focus trap, restore focus.

### 10.6 `js/compare.js`
`Compare.build()` creates the finished Yulya Studio UI mock and its wireframe twin (6.5) with the SAME grid so they align. Slider: pointer events (mouse, touch, pen) on `.raw__stage`; keyboard ←/→ (±2%), Home/End; `aria-valuenow` updated; `clip-path: inset(0 X% 0 0)` on `.raw__layer--wire`; `.raw__divider` and `.raw__handle` follow X. Auto-demo (once, when first 60% visible and the swarm is done): 15% → 85% → 50% over 2.4 s.

### 10.7 `js/journey.js`
Accordion for `.jr-row`: only one open; `grid-template-rows: 0fr → 1fr` on `.jr-row__body` with the inner wrapper `overflow:hidden`; the plus icon rotates 45°; `aria-expanded` kept in sync; the red spine `.jr__spine` draws with scroll (scaleY from 0 to 1, scrub) after the swarm is done.

### 10.8 `js/extras.js`
Everything in Part 7 that is not covered above: command palette (7.11), mini terminal (7.21), GitHub stats (7.12), accent switcher (7.13), idle companions (7.14), konami/replay key (7.17), `SwarmSound` (5.10), clock, toast helper (`Extras.toast(msg)`), copy-email (`[data-copy-email]` click copies, toast `Email copied ✓`, still allows the mailto on middle-click), CV/resume placeholders (click on `.hero__cv` or `.journey__resume`: `fetch(href,{method:'HEAD'})`; if it fails or the page is opened from file://, prevent the download and toast `CV coming soon` / `Resume coming soon`), quick-brief form (Enter or the ↗ icon opens `https://wa.me/918660227877?text=` + encoded text, empty text opens the plain chat), Motion-off toggle (7.9).

### 10.9 CSS files
- `tokens.css`: Part 3 exactly. `base.css`: reset, fonts, typography utilities (`.eyebrow`, `.h2-bold`, `.h2-display`, `.h2-line`, `.accent`, `.script`, `.micro`, `.label-red`, `.hairline`, `.wrap`, `.btn`, `.chip`, `.toast`, `.skip`), `html{scroll-behavior:auto}`, focus ring, `[hidden]{display:none!important}`, reduced-motion rules, `.grain` canvas + `.vignette`.
- `layout.css`: nav, every section's grid at 1440px, then the breakpoints in 6.10. `components.css`: cards, tabs, chips, tiles, marquee, highlight rows, compare mocks, quote card, accordion, contact rows, poster card, brief bar, footer, modal, command palette, terminal, accent dots.
- Every class that appears in `index.html` must be styled. Run a script (in `tools/`, optional) that lists classes used in the HTML but missing in CSS and fix the gaps.
- Hard rule: **no element that carries `data-layer` may have `display:none` at desktop width** (the swarm skips hidden ones, which makes the layer count wrong). On mobile you may hide a few decorative layers, that is fine.
- **Layout stability:** reserve final sizes so nothing jumps when the swarm reveals things: `visibility:hidden` keeps layout, so never use `display`, `height:0` or `opacity` tricks on layers before they are built.

---------------------------------------------------------------------
## PART 11 — BUILD MILESTONES (do them in this order; update PROGRESS.md after each)

Run all commands from `./portfolio/`.

**M0 Scaffold.** Create the folder tree from Part 2 and copy the verbatim files: `index.html` (Part 9), `js/content.js` (Part 8), `js/swarm-script.js` (5.8), `js/swarm.js`, `js/hud.js`, `css/swarm.css` (5.7), `tools/check-layers.js`, `tools/test-swarm.js`. Add `assets/img/hero-cutout.png` if the file exists in the working directory or in `./assets`. Gate: `node tools/check-layers.js` prints `layers in html: 364, in script: 364` and exits 0.

**M1 Foundations.** Write `css/tokens.css`, `css/base.css`, `js/main.js` (boot order 10.1), `js/scroll.js`. Gate: the page opens with no console errors; the intro starts (rulers, flocks, HUD).

**M2 Nav + hero.** `css/layout.css` (nav + hero part), `js/hero.js`, `js/cursor.js`. Gate: after the intro the hero matches 6.1 at 1440×900: the giant word is behind the portrait's head, stats on the right, name and role on the left. Take a screenshot and compare.

**M3 Work + tech strip.** Work section CSS + `js/work.js`; tech marquee. Gate: filters, search, slider and modal work; first three cards show the code poster.

**M4 Highlights + compare.** CSS for highlights and the raw/real section, `js/compare.js`. Gate: the compare slider drags with mouse, touch and keys.

**M5 About + journey + contact + footer.** CSS, `js/journey.js`, contact poster terminal typing loop (6.8), brief bar. Gate: all links work; WhatsApp CTA opens `wa.me/918660227877`.

**M6 Extras.** `js/extras.js`: command palette, terminal, GitHub stats, accent switcher, motion toggle, idle companions, sound, toasts, CV placeholders. Gate: each feature works by keyboard and mouse.

**M7 Responsive.** Implement 6.10. Gate: no horizontal scroll at 360, 390, 768, 1024, 1280, 1440, 1920, 2560 (check with `document.documentElement.scrollWidth <= innerWidth`).

**M8 Swarm verification.** Install the test runner once: `npm init -y && npm i -D playwright && npx playwright install chromium` (these are dev-only tools, they do not become part of the site). Run `node tools/check-layers.js && node tools/test-swarm.js`. Gate: `ALL TESTS PASSED`. Look at the screenshots in `tools/shots/` (1440 and 390): at t=2s you must see blue wireframe boxes with size pills over the hero; at t=14s red-outlined tiles; at t=50s the contact section being built; the finale image must show cursors circling the poster card. Fix anything that looks wrong.

**M9 Polish and QA.** Run the checklist in Part 12. Lighthouse (if available): Performance ≥ 90, Accessibility ≥ 95. Write `README.md`: how to edit `js/content.js`, how to add project screenshots (`assets/img/work-01.jpg` … `work-11.jpg`, 1280×720), how to add a CV (`assets/cv/Mayura_CV.pdf`) and a showreel later, how to replay or disable the intro (`?intro=off`), how to deploy (GitHub Pages / Netlify / Vercel static), and how to set the domain (`CONTENT.meta.siteUrl`).

### 11.1 `tools/check-layers.js` (copy verbatim)
**FILE: tools/check-layers.js**
```js
/* tools/check-layers.js — no browser needed. Verifies that index.html and js/swarm-script.js agree on all layers.
   Run:  node tools/check-layers.js        (exit code 0 = OK) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/swarm-script.js'), 'utf8') + ';SWARM_SCRIPT');
const re = /data-layer="([a-z]+)"\s+data-layer-id="([^"]+)"/g;
const inHtml = new Map(); let m, dup = [];
while ((m = re.exec(html))) { if (inHtml.has(m[2])) dup.push(m[2]); inHtml.set(m[2], m[1]); }
const inScript = new Map(script.layers.map((l) => [l.id, l.k]));
const missing = [...inScript.keys()].filter((id) => !inHtml.has(id));
const extra = [...inHtml.keys()].filter((id) => !inScript.has(id));
const wrongType = [...inScript.keys()].filter((id) => inHtml.has(id) && inHtml.get(id) !== inScript.get(id));
const badText = [];   // text layers must contain plain text only: no "<" before the closing tag
const reText = /<(\w+)[^>]*data-layer="text"[^>]*>([\s\S]*?)<\/\1>/g;
while ((m = reText.exec(html))) if (/</.test(m[2])) badText.push(m[0].slice(0, 80));
console.log(`layers in html: ${inHtml.size}, in script: ${inScript.size}, agents: ${script.agentCount}, duration: ${script.duration}s`);
const problems = { missingInHtml: missing, extraInHtml: extra, wrongType, duplicates: dup, textLayersWithChildren: badText };
let bad = 0; for (const [k, v] of Object.entries(problems)) if (v.length) { bad++; console.error('PROBLEM', k, v.slice(0, 10)); }
if (inHtml.size !== 364 || inScript.size !== 364) { bad++; console.error('PROBLEM expected exactly 364 layers'); }
process.exit(bad ? 1 : 0);
```


### 11.2 `tools/test-swarm.js` (copy verbatim)
**FILE: tools/test-swarm.js**
```js
/* tools/test-swarm.js — runs the intro in headless Chromium at 6x speed and checks the result.
   Setup once:  npm init -y && npm i -D playwright && npx playwright install chromium
   Run:         node tools/test-swarm.js            (exit code 0 = OK; screenshots go to tools/shots/) */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..'); const shots = path.join(__dirname, 'shots'); fs.mkdirSync(shots, { recursive: true });
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const failures = []; const ok = (c, msg) => { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) failures.push(msg); };
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport: vp });
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'warning' && m.text().includes('[swarm]')) errors.push(m.text()); });
    await page.goto('file://' + path.join(root, 'index.html'));
    await page.waitForFunction(() => window.Swarm && Swarm.state !== undefined, null, { timeout: 15000 });
    await page.evaluate(() => { Swarm.setSpeed(6); if (Swarm.state === 'idle') Swarm.start(); });
    const marks = [2, 14, 30, 50]; let mi = 0;
    for (let i = 0; i < 3000; i++) {
      const s = await page.evaluate(() => ({ t: Swarm.t, st: Swarm.state }));
      if (mi < marks.length && s.t >= marks[mi]) { await page.screenshot({ path: path.join(shots, `${vp.width}-t${marks[mi]}.png`) }); mi++; }
      if (s.st === 'finale' || s.st === 'live') break; await page.waitForTimeout(40);
    }
    await page.waitForTimeout(800); await page.screenshot({ path: path.join(shots, `${vp.width}-finale.png`) });
    const r = await page.evaluate(() => ({
      built: Swarm.built, total: Swarm.total, state: Swarm.state, boxes: Swarm.boxes.size,
      notBuilt: [...document.querySelectorAll('[data-layer]')].filter((e) => !e.classList.contains('is-built')).length,
      textBad: [...document.querySelectorAll('[data-layer=text]')].filter((e) => e.textContent !== e.dataset.full).length,
      joined: Swarm.agents.filter((a) => a.joined).length, building: document.documentElement.classList.contains('is-building'),
      hscroll: document.documentElement.scrollWidth > innerWidth + 1, hud: document.querySelector('[data-bind=done]').textContent }));
    const tag = `[${vp.width}px] `;
    ok(r.built === 364 && r.total === 364, tag + `all 364 layers built (${r.built}/${r.total})`);
    ok(r.notBuilt === 0, tag + 'every [data-layer] has .is-built');
    ok(r.textBad === 0, tag + 'every text layer ends with its exact text');
    ok(r.boxes === 0, tag + 'no selection boxes left behind');
    ok(r.joined === 30, tag + `agents on screen: ${r.joined}`);
    ok(r.state === 'finale' && !r.building, tag + 'finale reached and .is-building removed');
    ok(!r.hscroll, tag + 'no horizontal scrollbar');
    ok(/^Rebuilt by \d+ agents in [\d.]+s$/.test(r.hud), tag + 'HUD done text: ' + r.hud);
    ok(errors.length === 0, tag + 'no page errors / missing layers ' + JSON.stringify(errors.slice(0, 3)));
    // Skip button must reveal everything instantly
    await page.evaluate(() => { document.querySelectorAll('[data-layer]').forEach((e) => e.classList.remove('is-built')); Swarm.states = []; document.documentElement.classList.add('is-building'); Swarm.start(); });
    await page.waitForTimeout(600); await page.evaluate(() => Swarm.finishAll());
    const sk = await page.evaluate(() => ({ nb: [...document.querySelectorAll('[data-layer]')].filter((e) => !e.classList.contains('is-built')).length, b: document.documentElement.classList.contains('is-building'), a: document.querySelectorAll('.agent-cursor').length }));
    ok(sk.nb === 0 && !sk.b && sk.a === 0, tag + 'finishAll() (✕ / reduced motion) reveals everything and removes the cursors');
    await page.close();
  }
  await browser.close();
  console.log(failures.length ? `\n${failures.length} FAILED` : '\nALL TESTS PASSED'); process.exit(failures.length ? 1 : 0);
})();
```


---------------------------------------------------------------------
## PART 12 — FINAL ACCEPTANCE CHECKLIST (tick each in PROGRESS.md)

**Intro (most important)**
- [ ] On load: black screen, faint "M" watermark, two flocks of pastel arrow cursors, HUD `Scanning page…`.
- [ ] At 0.8 s: flocks scatter to the edges as `+` and I-beam cursors, rulers fade in, blue bars flash along the top and left.
- [ ] At 1.2 to 2 s: blue wireframe boxes with white corner handles and `W × H` pills appear over every hero element; portrait area is a flat blue-grey box with a picture icon; text types into boxes with a blinking caret; the CTA is a solid red rectangle.
- [ ] A red 1.5px snap-guide line runs down the left content edge of the section being built.
- [ ] Cards and tiles use RED outlines; text, images use BLUE.
- [ ] Images: placeholder, then the real element blurs in (18px → 0, 0.6 s).
- [ ] Blue commit sweep with a glowing dot runs along the bottom of each finished section.
- [ ] Agent count climbs 18 → 30 (HUD), layer counter climbs to 364, auto-scroll follows the build front ("Touring"); scrolling with the wheel pauses it and the pill becomes the ghost "Tour" button.
- [ ] Finale: cursors orbit the contact poster card and the top-right corner, arrows tangent to the circles; HUD shows `Rebuilt by 30 agents in 51.4s` (measured time) with Go live / Replay / ✕.
- [ ] ✕ reveals everything instantly; Go live sends the cursors off to the top-right; Replay runs it again; speed button cycles 1x, 2x, 4x, 0.5x; the intro plays on every reload; `?intro=off` skips it; Motion-off and reduced-motion skip it; the page is never left invisible (4 s fail-safe).

**Design**
- [ ] Hero: giant gradient word behind my cut-out portrait (head overlaps the letters), name `MAYURA.`, role `FULL STACK DEV & DESIGNER`, stats 4+ / 10+ / 13+, `TRY YULYA` button, location `BENGALURU, INDIA`.
- [ ] Work: 11 projects, 8 filters, working search, slider, cinema modal with deep links; code posters when no image.
- [ ] Tech strip marquee, Highlights panel with maroon glow and laurels, compare slider with red handle (WIREFRAME / FINAL UI), About with education, toolkit, software tiles, process timeline, red quote card, Journey accordion + milestones, Contact with WhatsApp CTA, poster terminal and brief bar, footer with socials, clock, accent dots.
- [ ] Fonts: Anton headlines, Plus Jakarta Sans body, Nothing You Could Do for the "Hello, I'm" and signature.
- [ ] No Indonesian text, no language switch, no Figma/Photoshop, no "award/client/showreel/certificate" words anywhere (`grep -ri` to verify).

**Quality**
- [ ] No console errors or warnings on load, during the intro, or when using every feature.
- [ ] `check-layers` and `test-swarm` pass. No horizontal scroll at any tested width.
- [ ] Keyboard: every interactive element reachable, visible focus ring, modals trap focus, Esc closes overlays.
- [ ] Works with the CDN scripts blocked (no animation, but everything visible and usable).
- [ ] Final report printed (what to replace: CV, resume, domain, screenshots, real Unity/Blender entries, journey dates).

**BEGIN NOW. Start with Part A, then M0.**
