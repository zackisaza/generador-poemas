// Service worker: makes the app installable and fully offline-capable.
// App shell is precached on install; everything else (Google Fonts, Lucide)
// is cached at runtime the first time it's fetched. Cache-first strategy.
// Relative paths so it works both at the domain root and under a /repo/ subpath.
const CACHE = 'poemstudio-v12';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './css/fonts.css',
  './js/engine.js',
  './js/fontpicker.js',
  './js/animations.js',
  './js/tabs.js',
  './js/interactive.js',
  './js/library.js',
  './js/wheel.js',
  './js/previewpeek.js',
  './js/sectionsmenu.js',
  './icon.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        const copy = res.clone(); // runtime-cache GETs (incl. opaque cross-origin)
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
    })
  );
});
