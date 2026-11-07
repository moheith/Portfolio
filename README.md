# Mayura — Personal Portfolio (V3 God-Level Architecture)

A personal portfolio website for **Mohieth Mayura S Y ("Mayura")** — Full Stack Developer & UI/Graphics Designer from Bengaluru, India.

## Signature Feature: Autonomous Multi-Agent Swarm Build Intro
When the page loads, an autonomous swarm of **18 → 30 pastel arrow cursors ("AI agents")** builds the entire website live in front of the visitor in ~51 seconds:
- Cursors fly dynamically to DOM elements with quadratic bezier curves.
- Wireframe selection boxes drag out with live `W × H` size indicators.
- Text is typed character by character with I-beam cursors, including simulated Figma-style human edits (typo fixes and replace passes with blue selection highlights and double-click ripples).
- Image boxes resize with corner handles and progress bars before blurring in.
- Button color-swatch pickers glide to red fill.
- Rulers and full-height red snap-guides drop in per section.
- Section-commit sweeps with glowing white dots finalize sections.
- Finale: All 30 agents orbit in a breathing ring around the contact poster card.
- Floating HUD control bar with live layer counts, auto-scroll tour toggle, 1x/2x/4x/0.5x speed control, audio toggle, and Go Live / Replay buttons.

## What's new in this revision (audit + polish)
**Fixes**
- Restored the 18 → 30 agent build (~51 s). The agent count had been cut to 18 because idle cursors wiggled or drifted to a screen corner. The real cause is fixed instead: an agent with nothing left to build now runs a visible *QA pass* (flies to a finished element, drags a selection box with handles and a W×H pill, clicks, releases) or shadows a busy agent. It never loiters. The strict "one section at a time" gate is now a soft rule (stay in view, look half a screen ahead after ~0.4 s idle), so 30 agents stay busy.
- Project images and `raw-final/raw-wireframe.jpg` pointed to files that don't exist (404s). Project cards/modal now use the built-in CSS posters; images are optional (set `img:` in `js/content.js` when you have screenshots).
- "From Sketch to Shipped" compare panel was half empty (its CSS depended on a removed `<img>`).
- Phone layout: About now collapses to one column, the highlights list and the contact form no longer widen the page (360 px and 1280 px), timeline dates no longer touch the spine.
- The `000% · HOME` scroll readout overlapped hero buttons and content; it is now a vertical label on the left rail.
- Fonts, tech icons, GSAP, ScrollTrigger and Lenis are **self-hosted** (`assets/fonts`, `assets/icons/tech`, `assets/vendor`): no Google Fonts/CDN requests, works offline, no font flash.

**New features**
- Project modal: prev / next buttons, `←` `→` keys, `03 / 11` counter, focus moved into the dialog and trapped there.
- *Save Contact (.vcf)* in the `Ctrl+K` palette (`Polish.vcard()`).
- Back-to-top button, "skip to content" link, visible focus rings, print stylesheet.
- Tab title changes when you switch away.
- Offline PWA service worker (`sw.js`, https only), `404.html`, `robots.txt`, `sitemap.xml`, Open Graph image (`assets/img/og.jpg`).
- `css/polish.css` + `js/polish.js` hold all of this, so your original files stay readable.

## Revision 2 (live-site bug sweep)
- **Scroll drift during the build:** the tour camera could slide back up while cursors were building. It is now monotonic per section (`cameraSection()` + `camMax` in `js/swarm.js`) and the browser's scroll anchoring is off while building. Measured: 0 upward scroll steps across a full 51 s run.
- **Cursors idling around the mouse after the build:** the old "idle companions" feature is removed on purpose (`setupIdleCompanions` in `js/extras.js` is a no-op). After Go live no agent cursor remains.
- **Hand / grab cursor under the custom cursor:** the system cursor is now hidden everywhere the custom one is active. Context tags (VIEW, DRAG, OPEN ↗, COPY, CHAT, TOP …), a click ripple and a drag puck are in `js/fx.js` + `css/hover.css`.
- **Hover animations:** every component has its own personality (spotlight, liquid fill, magnetic, tilt, shine sweep, tooltips on tech tiles…) instead of one shared lift. See `css/hover.css`.
- Empty state for search/filter ("No projects match…" + *Clear filters*).
- Modal history: stepping through projects replaces the history entry, closing doesn't add one, and the browser Back button closes the modal.
- Accessibility: axe-core reports 0 violations (valid card roles, inert mobile menu, matching accessible names, contrast on the wireframe mock-up); one skip link instead of two; the hero role no longer reads "DEVELOPER&DESIGNER".

**Still yours to fill in:** project 11 ("Brand identity — your project") is a placeholder in `js/content.js`; put a real CV at `assets/Mayura-CV.pdf` (the CV button shows a "coming soon" toast until then); add real screenshots to `assets/img/` and set `img:` per project.

## Run the checks
```
python3 -m http.server 8765      # then in another terminal:
node tests/swarm-check.js && node tests/layout-check.js && node tests/css-coverage.js && node tools/qa.js
```

## Key Features & Customizations
- **Stylized `MAYURA●` Watermark**: High-contrast, condensed Anton watermark displayed during the scanning stage.
- **Left-Edge Scroll Playhead**: Live scroll tracking with numeric percentage and section name (`042% · PROOF`).
- **Custom Site Cursor**: Dual-element cursor (8px red dot + 36px ring) with context states (`VIEW`, `OPEN`, `DRAG`, `×`) and magnetic pull.
- **Selected Work**: Filter tabs (`All`, `Full-Stack`, `AI / ML`, `Discord`, `Web Apps`, `Design`, `Open Source`), FLIP animations, real-time live search with `<mark>` keyword highlighting, inertia drag card slider, and cinema-style modal with deep-linking (`#work/<slug>`).
- **From Sketch to Shipped**: Interactive before/after comparison slider with pointer drag, touch support, keyboard navigation (Home/End/Arrows), and auto-demo.
- **Behind the Code & The Journey**: Process timeline with dynamically lit nodes, single-open accordion, and milestone trackers.
- **Command Palette (`Ctrl+K` or `/`)**: Instant keyboard-driven command interface.
- **Accent Switcher**: Four theme colors (Crimson, Electric Blue, Violet, Amber) persisted via `localStorage`.
- **Zero Forbidden Words**: Fully compliant with professional specifications.

## Running the Verification Suite
```bash
# 1. Check CSS coverage (all classes styled)
node tests/css-coverage.js

# 2. Check responsive layout & geometry contract (8 widths)
node tests/layout-check.js

# 3. Check swarm build intro end-to-end
node tests/swarm-check.js

# 4. Functional QA check
node tools/qa.js
```
