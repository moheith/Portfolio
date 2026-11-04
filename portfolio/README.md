# Mayura — Personal Developer & Graphics Designer Portfolio (V2)

A cutting-edge, cinematic developer and graphics designer portfolio for **Mohieth Mayura S Y ("Mayura")**, featuring a deterministic 30-agent swarm construction intro, editorial layout, and interactive features.

---

## 🚀 Live Build Experience (30-Agent Swarm)

When the site loads:
1. **Scanning phase:** Rulers and snap-guides fade in; 18 pastel agent cursors appear in coordinated flocks.
2. **Construction phase:** 30 agents progressively build and type all 364 DOM layers with zero stutter, idle drift, or pauses. Wireframe layout boxes with real-time measurement pills (`W × H`), element type badges, and progressive typing simulations populate the screen.
3. **Commit sweeps:** Glowing blue sweeps lock in finished sections.
4. **Finale:** All 30 agents orbit smoothly around the contact poster card and the top-right focal point, while the bottom HUD displays: `Rebuilt by 30 agents in 51.4s` (wall-clock time) with sound toggle, **Go live**, **Replay**, and **✕** buttons.

---

## 🛠️ God-Level Features Built-in

- **Scroll Playhead & Timecode:** Left-edge progress bar with live `HH:MM:SS:FF` timecode mapped to 24fps film playback, with hoverable section markers.
- **Custom Adaptive Cursor:** Dot and ring cursor with context awareness (`VIEW`, `OPEN`, `DRAG`, `×`), magnetic button pull, and smooth lerping.
- **Hero Stacking & Depth:** Cutout portrait of Mayura overlapping the giant gradient `PORTFOLIO` typography, mouse parallax, and radial spotlight.
- **Selected Work & Code Posters:** 11 projects with FLIP tab filtering, live fuzzy search with highlighted text matches, horizontal inertia slider, and cinema project modal (`#work/<slug>`). Cards without local image assets automatically generate vibrant, personalized CSS code posters.
- **Infinite Tech Marquee:** Continuous looping ribbons of development and creative tools with hover pause and scroll velocity acceleration.
- **Highlights & Proof:** Maroon glow panel, animated SVG laurel branches, big metrics (`10+`, `8B`, `LIVE`, `13 repos`), and live GitHub stats integration.
- **From Raw to Real Compare Slider:** Interactive split screen comparing dashed wireframe grey boxes with a live miniature of **Yulya Studio** (Monaco IDE with syntax coloring, file tree, blinking caret, and animated spaceship canvas). Keyboard accessible with auto-demo scan on first view.
- **Behind the Screen / Process:** Education & software tiles, vertical process timeline with scrub-animated spine, and 3D tilting quote card with light sheen.
- **The Journey Accordion:** Milestone timeline with smooth CSS grid transition (`0fr -> 1fr`) and active milestone dots.
- **Contact & WhatsApp Quick Brief:** WhatsApp CTA button, copy-email with toast feedback, live contact card with pseudo-terminal loop, and single-line quick brief form.
- **Command Palette (`Ctrl+K` or `/`):** Instant search over sections, projects, contact, sound toggle, accent themes, and terminal.
- **Interactive Developer Terminal (`` ` ``):** Mono drawer with interactive CLI commands (`help`, `whoami`, `about`, `projects`, `open <N>`, `skills`, `contact`, `github`, `yulya`, `theme`, `replay`, `clear`, `exit`).
- **Web Audio Synthesis:** Synthesized square-wave typing clicks, filtered noise sweep whoosh, and harmonic finale chimes.
- **4-Accent Theme Switcher:** Instant runtime switching between Red (`#ff3b30`), Violet (`#8b5cf6`), Blue (`#3b82ff`), and Amber (`#ffb020`).
- **Responsive Across All Screens:** 100% responsive without horizontal scrolling from 360px mobile to 2560px ultra-wide.

---

## ⚙️ Customization & Editing Guide

### 1. Updating Content & Links (`js/content.js`)
All text, project metadata, links, social profiles, and journey milestones are centralized in [`js/content.js`](file:///C:/Users/adith/OneDrive/Desktop/mayur/protfolio/js/content.js):
- **Hero word:** Change `CONTENT.meta.heroWord` (default: `"PORTFOLIO"`, or `"MAYURA"`).
- **Domain:** Update `CONTENT.meta.siteUrl` when your custom domain is connected.
- **Projects:** Add or edit entries in `CONTENT.projects`.
- **Social profiles:** Update handles in `CONTENT.links` and `CONTENT.social`.

### 2. Adding Project Screenshots
Place 16:9 images (1280×720 or 1920×1080 JPEG/WebP) in `assets/img/`:
- `assets/img/work-01.jpg`
- `assets/img/work-02.jpg`
- ... up to `work-11.jpg`

If an image is absent, the portfolio automatically displays the generated code poster fallback.

### 3. Adding Your CV & Resume
Place your PDF files at:
- `assets/cv/Mayura_CV.pdf` (for the hero download button)
- `assets/cv/Mayura_Resume.pdf` (for the journey resume link)

If a file is missing, clicking the button displays a toast message (`CV coming soon` / `Resume coming soon`) without broken link errors.

### 4. Swarm Intro Controls
- **Replay Swarm:** Press `R` on your keyboard, select **Replay** in the HUD or command palette, or run `replay` in the mini terminal.
- **Skip Swarm:** Append `?intro=off` to the URL, toggle **Motion off** in the top navigation, or click **✕** in the HUD.
- **Speed Adjustment:** Click the `1x` speed button in the HUD to cycle between `0.5x`, `1x`, `2x`, and `4x`.

---

## 🧪 Testing & Verification

1. **Verify 364/364 Swarm Layer Agreement:**
   ```bash
   node tools/check-layers.js
   ```
   *Expected output: `layers in html: 364, in script: 364, agents: 30, duration: 51.36s` (exit code 0).*

2. **Run Headless Chromium Swarm Test:**
   ```bash
   node tools/test-swarm.js
   ```
   *Expected output: `ALL TESTS PASSED` (exit code 0).*

3. **Verify All Viewports (360px - 2560px):**
   ```bash
   node tools/test-viewports.js
   ```
   *Expected output: `ALL VIEWPORTS PASSED WITH ZERO HORIZONTAL SCROLL!`*

---

## 🚢 Deployment

The portfolio is 100% static (HTML, CSS, Vanilla JS) with zero server-side build step required:
- **GitHub Pages:** Push to `main` and enable GitHub Pages on the root directory.
- **Vercel / Netlify:** Import the repository and set publish directory to `./` (or `./portfolio`).
