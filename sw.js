const CACHE_NAME = 'canford-fee-portal-v1';
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
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
