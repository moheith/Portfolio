/* sw.js — offline cache. Registered by js/polish.js on https only.
   HTML / CSS / JS / JSON / text: NETWORK-FIRST (so a deploy is seen on the very next load; the cache is only the offline fallback).
   Fonts, images, icons, video, vendor libraries: cache-first (they are big and never change under the same name).
   Bump V to purge every old cache on the next visit. (v2 was cache-first for everything, which served visitors stale CSS/JS
   next to fresh HTML after a deploy: the unstyled terminal at the bottom of the page.) */
const V = 'mayura-v4';
const STATIC = /\.(?:woff2?|ttf|png|jpe?g|webp|avif|gif|svg|ico|mp4|webm|mp3|ogg|wav)$|\/assets\/vendor\//i;
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  const put = (x) => { if (x && x.ok) { const c = x.clone(); caches.open(V).then((k) => k.put(r, c)); } return x; };
  if (STATIC.test(u.pathname)) {
    e.respondWith(caches.match(r).then((m) => m || fetch(r).then(put)));
  } else {
    e.respondWith(fetch(r, { cache: 'no-cache' }).then(put).catch(() => caches.match(r).then((m) => m || (r.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
  }
});
