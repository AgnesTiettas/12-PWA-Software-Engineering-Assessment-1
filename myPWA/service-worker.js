const CACHE_NAME = 'Movies-For-Me-cache-v1';
const urlsToCache = [
    '/12-PWA-Software-Engineeing-Assessment-1/myPWA/frontend/Watchlist.html',
    '/12-PWA-Software-Engineeing-Assessment-1/myPWA/frontend/Watchlist_style.css',
    '/12-PWA-Software-Engineeing-Assessment-1/myPWA/frontend/Watchlist.js',
    '/12-PWA-Software-Engineeing-Assessment-1/myPWA/frontend/Movies.html',
    '/12-PWA-Software-Engineeing-Assessment-1/myPWA/frontend/Movies_style.css',
    '/12-PWA-Software-Engineeing-Assessment-1/myPWA/frontend/Home.html',
    '/12-PWA-Software-Engineeing-Assessment-1/myPWA/frontend/Home_Style.css',
    
];


// Installs event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache:', error);
            })
    );
});



// Fetch requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Return the cached response if found, otherwise fetch from network
            return response || fetch(event.request).catch(() => {
                caches.match('/12-PWA-Software-Engineeing-Assessment-1/myPWA/frontend/Watchlist.html');

            }); 
           
        })
    );
});


// Activate the service worker




// Activate event
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
