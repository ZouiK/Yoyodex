// Service Worker pour le cache
const CACHE_NAME = 'yoyodata-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/character-detail.html',
  '/clan-detail.html',
  '/styles.css',
  '/script.js',
  '/admin.js',
  '/character-detail.js',
  '/clan-detail.js',
  '/admin-data.js',
  '/img/solve logo.png',
  '/img/solve logo.webp',
  '/img/konoha-emblem.png',
  '/img/suna-emblem.png',
  '/img/oto-emblem.png',
  '/img/nukenin-emblem.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
