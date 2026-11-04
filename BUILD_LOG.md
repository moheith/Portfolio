# BUILD LOG — "MAYURA." Portfolio V3 Architecture

## Architecture Overview
- **V3 Dynamic Swarm Engine (`js/swarm.js`, `js/hud.js`, `css/swarm.css`)**:
  - Dynamically discovers 382 `[data-layer]` elements across all sections.
  - 18 -> 30 pastel arrow cursors ("agents") visibly build the page in 51.4s (or 4x speed for testing).
  - Micro-interactions: wireframe previews with live W x H size pills, text typing letter-by-letter, typo-fixes with double-click blue selection ripples (`.sw-sel`), image box resizing and blur-ins, button color-swatch popovers, red outlines, full-height red snap-guides, and section commit sweeps.
  - Finale: 30 agents orbit around the `#poster` card in a breathing ring.
  - Control bar HUD (`#sw-hud`) with live progress, Touring toggle, 1x/2x/4x/0.5x speed switcher, sound toggle, Go Live, Replay, and Abort controls.
- **Custom Watermark**:
  - Replaced the single letter "M" with a sleek, stylized `MAYURA●` watermark in bold condensed Anton typography with letter-spacing.
- **Layout & Typography (`css/base.css`, `css/layout.css`, `css/components.css`)**:
  - Near-black palette (`#07070a`) with coral and crimson accents (`#ff3b30`, `#ff4d5a`).
  - Layer-geometry contract: zero inline text layers, zero text-layer child elements, perfectly stable shrink-wrapped boxes.
  - Complete responsiveness across 8 viewports: 360, 390, 768, 1024, 1280, 1440, 1920, 2560px with zero horizontal scroll.
- **God-Level Features**:
  - Custom site cursor with context states (`VIEW`, `OPEN`, `DRAG`, `×`) and magnetic pull.
  - Left-edge scroll playhead with live percentage and section readout (`042% · PROOF`).
  - Interactive "From Sketch to Shipped" before/after comparison slider with touch, pointer, and keyboard (Home/End/Arrows) navigation.
  - Cinema-style project modal with deep-linking `#work/<slug>`.
  - Command palette (`Ctrl+K` or `/`) with live fuzzy filtering.
  - Accent color switcher (Crimson, Electric Blue, Violet, Amber) with instant CSS variable updates and `localStorage` persistence.
  - Single-open accordion for The Journey.
  - WhatsApp quick-brief bar and one-click email copy.
  - Zero forbidden words in visible text.

## Test Verification
- `node tests/css-coverage.js`: 100% coverage (all 232 classes styled).
- `node tests/layout-check.js`: 10/10 PASS across all 8 viewports.
- `node tests/swarm-check.js`: 15/15 PASS (4x run, 382 layers, 30 agents, Go live, replay, tour toggle, reduced motion, phone).
- `node tools/qa.js`: 21/21 PASS.
