const CACHE_NAME = 'tokyo95-v1.2'; // Bump version for new assets
const ASSETS = [
    './',
    'index.html',
    'style.css',
    'game.js',
    'ui.js',
    'manifest.json',
    'assets/1_dot.png',
    'assets/2_dots.png',
    'assets/3_dots.png',
    'assets/4_dots.png',
    'assets/5_dots.png',
    'assets/6_dots.png',
    'assets/roll.wav',
    'assets/wrong.wav',
    'assets/right.wav',
    'icons/favicon.ico',
    'icons/favicon.svg',
    'icons/apple-touch-icon.png',
    'icons/web-app-manifest-192x192.png',
    'icons/web-app-manifest-512x512.png'
];

// Install: Cache all assets
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Caching Assets');
            return cache.addAll(ASSETS);
        })
    );
});

// Activate: Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('SW: Clearing Old Cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Serve from cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
