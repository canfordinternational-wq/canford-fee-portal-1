<<<<<<< HEAD
const CACHE_NAME = 'canford-fee-portal-v12-client-portal-qr';;
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/books-data.js',
  '/js/books-expenses.js',
  '/js/books-invoices.js',
  '/js/books-master.js',
  '/js/books-reports.js',
  '/js/books-settings.js',
  '/js/payment.js',
  '/js/students-data.js',
  '/js/admin.js',
  '/assets/logo.png',
  '/assets/logo-white.png',
  '/assets/logo-white-mix.png',
  '/assets/letterhead-bg.png',
  '/assets/iaap-logo.png'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
=======
const CACHE_NAME = 'canford-fee-portal-v13-mobile-pwa';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './js/books-data.js',
  './js/books-expenses.js',
  './js/books-invoices.js',
  './js/books-master.js',
  './js/books-reports.js',
  './js/books-settings.js',
  './js/payment.js',
  './js/client-portal.js',
  './js/students-data.js',
  './js/admin.js',
  './assets/logo.png',
  './assets/logo-white.png',
  './assets/logo-white-mix.png',
  './assets/letterhead-bg.png',
  './assets/iaap-logo.png',
  './assets/pwa-180.png',
  './assets/pwa-192.png',
  './assets/pwa-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(err => console.warn('Cache install warning:', err))
>>>>>>> e97eb7281dc71d0540d9897e8fa87f185f528c33
  );
  self.skipWaiting();
});

<<<<<<< HEAD
// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
=======
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
>>>>>>> e97eb7281dc71d0540d9897e8fa87f185f528c33
    )
  );
  self.clients.claim();
});

<<<<<<< HEAD
// Fetch: serve from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
=======
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Cache same-origin static resources for faster repeat loads.
        if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
>>>>>>> e97eb7281dc71d0540d9897e8fa87f185f528c33
  );
});
