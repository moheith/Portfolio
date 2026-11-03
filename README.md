# Mohieth — Developer · Designer · Builder

A responsive portfolio for Mohieth Mayura S Y. It uses plain HTML, CSS and JavaScript modules, with the portfolio copy centralized in `src/content.js`. The custom interface illustrations are made with CSS and are labelled illustrative; they are not product screenshots.

## Run locally

This site has no build dependency. From the project directory run:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`. Stop the server with Ctrl+C. A local web server is required because the application uses JavaScript modules.

## Build and deploy

There is no compile step. Publish the contents of this folder to a static host such as GitHub Pages, Cloudflare Pages or Netlify. Set the published directory to the repository root. The site intentionally does not declare a canonical URL or domain because the final domain has not been supplied.

For GitHub Pages, choose the `main` branch and `/ (root)` as the publishing source in the repository's Pages settings after the site is pushed.

## Editing owner and project content

Edit `src/content.js` to change the name, contact details, social URLs, project records, skills, process steps or journey entries. Each project has a summary, stage, stack, case-study narrative and exact public link. Discord bot source is marked owner-only and is not exposed as a public repository link. The Yulya Studio product URL is omitted until it can be confirmed as reachable.

Project art is rendered from CSS in `src/app.js` and `styles.css`. It is explanatory interface artwork, not a claim that those screens exist in the running products. Keep that label when replacing or extending the art.

## Replacing the portrait

The optimized `assets/img/mayura.webp` is used for the page; the original PNG remains at `assets/img/mayura.png`. Update `person.portrait` in `src/content.js` to replace the display image with another owner-approved asset. The portrait is presented as a studio photograph with its grey background; the fallback monogram appears if the image cannot load.

The original portrait is about 2.8 MB and the WebP display copy is about 82 KB at the same 1086 × 1448 dimensions. The original is kept in the assets folder for future edits.

## Controls

- `Ctrl/Cmd + K` or `/`: open the command palette.
- Motion and accent controls are in the footer and persist in local storage.
- Project cards open a keyboard-accessible case-study dialog. Use Escape to close and left/right arrows to change projects.
- The contact form validates locally and opens WhatsApp with the entered brief; it does not submit to a server.
- The build intro can be skipped, replayed, or disabled with the Motion control. Content stays available underneath it.

## Owner assets still useful

- Transparent portrait cut-out (optional; the current studio portrait remains valid).
- Approved project screenshots or videos (the current original illustrations are explicitly illustrative).
- Actual CV PDF and showreel if they become available.
- Final domain, once purchased and hosted, for canonical URL and social preview metadata.

