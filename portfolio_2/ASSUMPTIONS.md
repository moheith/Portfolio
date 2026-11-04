# Assumptions

1. The verbatim files (index.html, content.js, swarm-script.js, swarm.js, hud.js, swarm.css, check-layers.js, test-swarm.js) were diffed against the prompt and are byte-identical. None was edited.
2. The stat counters (4+ / 10+ / 13+) start when the stats are first visible, not at the finale, so text layers always end with their exact text when the swarm ends.
3. Missing optional images (work-NN.jpg, raw-wire.jpg, raw-final.jpg, og.jpg) are probed with `new Image()`. Browsers log a "failed to load resource" line in the console for each missing file; the page itself never shows a broken image. Add the files and the lines disappear.
4. Letter-roll link hover wraps letters in spans only AFTER the swarm ends, so `textContent` still equals the layer text.
5. Heading reveals use opacity + translate (not clip-path) because a fully clipped element is never reported by IntersectionObserver.
6. Missing hero portrait: `hero.js` swaps the image `src` for an inline SVG silhouette (same element, so the swarm layer stays valid).
7. The words award / certificate / client / showreel / Figma / Photoshop do not appear in any visible text. They appear only in code identifiers (for example the browser API `getBoundingClientRect`), which cannot be renamed.
8. CDN scripts (GSAP, Lenis) could not be loaded in the build sandbox (no network). Every use is guarded with `if (window.gsap)` / `if (window.Lenis)`; motion code (cursor, parallax, tilt, counters, reveals) uses plain requestAnimationFrame / IntersectionObserver, so it works with or without the CDNs. Lenis smooth scroll itself was therefore not exercised here.
9. Fonts could not be loaded offline in the sandbox, so screenshots used fallback fonts (Anton looks narrower in reality; headings will take less width).
10. `tools/qa.js` is an extra functional test (filters, search, modal, palette, terminal, accent, motion toggle, widths 360 to 2560).
11. Portrait enhanced on request: halo removed from the cutout edge, shadows lifted on the suit, gentle contrast and sharpening, faint red rim light. Your untouched file is kept as `assets/img/hero-cutout.original.png` (copy it back over `hero-cutout.png` to undo).
12. The intro watermark is now an outlined "MAYURA." wordmark (css/base.css, `html.is-building::before`) instead of the letter M. The favicon is still the M.
