# Mayura's portfolio

A cinematic red-and-black single-page site that **builds itself with 30 AI cursors**. Plain HTML, CSS and vanilla JavaScript. No build step.

## Open it
Double-click `index.html`, or serve the folder with any static server (`npx serve .`, `python3 -m http.server`).

## Edit the content
All text and links live in **`js/content.js`**. Lines marked `// EDIT` are placeholders to replace: studio repo link, Unity/Blender project names, college project year, journey dates, education dates, `siteUrl`.
Do not rename or remove `data-layer` / `data-layer-id` attributes in `index.html` (364 layers). After any markup change run `node tools/check-layers.js`.

## Add images
- Project screenshots: `assets/img/work-01.jpg` ... `work-11.jpg` (1280x720). Without them the generated code posters are used.
- Portrait: `assets/img/hero-cutout.png` (transparent, 900x1200).
- Social preview: `assets/img/og.jpg` (1200x630).
- Optional real compare images: `assets/img/raw-wire.jpg` and `assets/img/raw-final.jpg`.

## Add a CV / resume / showreel later
Put `assets/cv/Mayura_CV.pdf` and `assets/cv/Mayura_Resume.pdf` in place. Until then the buttons show a "coming soon" toast. For a video, add a `video` field (an `.mp4` path or YouTube/Vimeo URL) to a project in `content.js`; the project modal will play it.

## The intro
Plays on every visit. Skip it with the HUD ✕ button, `?intro=off`, the nav "Motion off" toggle, or the OS reduced-motion setting. Press `R` (or type `replay`) to replay it.

## Shortcuts
`Ctrl/Cmd + K` or `/` command palette · `` ` `` terminal · `R` replay · Konami code for a surprise.

## Test
```
npm init -y && npm i -D playwright && npx playwright install chromium   # once, dev only
node tools/check-layers.js
node tools/test-swarm.js      # prints ALL TESTS PASSED
node tools/qa.js              # optional functional checks
```

## Deploy
Static hosting: GitHub Pages (push the folder, enable Pages), Netlify (drag the folder), or Vercel (`vercel --prod`).
When you buy a domain, set `CONTENT.meta.siteUrl` in `js/content.js`; canonical, Open Graph and JSON-LD all use it.
