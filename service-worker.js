// Box Breathing PWA Service Worker

const CACHE_NAME = 'box-breathing-app-v1';
const OFFLINE_URL = 'index.html';

const ASSETS_TO_CACHE = [
    'index.html',
    'exercise.html',
    'css/styles.css',
    'css/animations.css',
    'js/app.js',
    'js/settings.js',
    'js/animation.js',
    'manifest.json',
    'icons/icon-192.png',
    'icons/icon-512.png'
];

// Install event - cache the app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                // Force this service worker to become active
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all clients as soon as it activates
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
    // Don't cache API calls or external resources
    if (event.request.url.includes('/api/') || 
        !event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return the response
                if (response) {
                    return response;
                }
                
                // Clone the request because it's a one-time use stream
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if we got a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response because it's a one-time use stream
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // If the network fails, serve the offline page for navigate requests
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                    });
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-cache') {
        event.waitUntil(updateCache());
    }
});

// Function to update the cache with latest files
async function updateCache() {
    const cache = await caches.open(CACHE_NAME);
    return Promise.all(ASSETS_TO_CACHE.map(url => {
        return fetch(url)
            .then(response => cache.put(url, response))
            .catch(error => console.error(`Error updating cache for ${url}:`, error));
    }));
}
