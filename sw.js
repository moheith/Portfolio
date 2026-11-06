/* sw.js — tiny offline cache (cache-first for same-origin GETs; network-first for the HTML). Registered by js/polish.js on https only. */
const V = 'mayura-v2';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const html = r.mode === 'navigate';
  e.respondWith(html
    ? fetch(r).then((x) => { const c = x.clone(); caches.open(V).then((k) => k.put(r, c)); return x; }).catch(() => caches.match(r).then((m) => m || caches.match('./index.html')))
    : caches.match(r).then((m) => m || fetch(r).then((x) => { const c = x.clone(); if (x.ok) caches.open(V).then((k) => k.put(r, c)); return x; })));
});
