# Progress

| Milestone | Status | Verified with |
|---|---|---|
| M0 Scaffold (verbatim files, hero-cutout.png) | DONE | `node tools/check-layers.js` -> 364 / 364, exit 0 |
| M1 Foundations (tokens, base, main, scroll) | DONE | page loads, intro starts, no page errors |
| M2 Nav + hero | DONE | screenshot 1440x900 (word behind head, stats right, name left) |
| M3 Work + tech strip | DONE | `node tools/qa.js` (filters, search, slider, modal, deep link) |
| M4 Highlights + compare | DONE | qa.js (compare slider Home/End keys); pointer + touch handlers in compare.js |
| M5 About + journey + contact + footer | DONE | qa.js (accordion, WhatsApp link); poster terminal loop |
| M6 Extras | DONE | qa.js (palette, terminal, accent, motion toggle, CV toast) |
| M7 Responsive | DONE | qa.js: no horizontal scroll at 360, 390, 768, 1024, 1280, 1440, 1920, 2560 |
| M8 Swarm verification | DONE | `node tools/test-swarm.js` -> ALL TESTS PASSED; screenshots in tools/shots/ |
| M9 Polish + QA | DONE | README.md, ASSUMPTIONS.md; Lighthouse not available in the sandbox (not run) |

## Part 12 checklist
- [x] Intro: scan screen, rulers, wireframe boxes with pills, red cards / blue text, commit sweeps, 18 -> 30 agents, finale orbit, HUD "Rebuilt by 30 agents in Ns", skip / go live / replay / speed, ?intro=off, 4 s fail-safe
- [x] Design: hero, 11 projects + 8 filters + search + slider + modal, tech marquee, highlights, compare slider, about, journey, contact, footer
- [x] No language switch, no forbidden words in visible text (checked by qa.js)
- [x] check-layers and test-swarm pass; no horizontal scroll at tested widths
- [x] Keyboard: focus ring, modal / palette / terminal trap or close on Esc
- [x] Works with CDN scripts blocked (this is how it was tested)
- [ ] Not verified here: Lighthouse scores, Lenis smooth scroll, real web fonts (sandbox had no network). See ASSUMPTIONS.md.
