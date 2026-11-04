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
