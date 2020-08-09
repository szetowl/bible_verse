const staticFilesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/welcome_card.jpg',
  '/scripts/app.js',
  '/scripts/main.js',
  '/scripts/firebase-code.js',
  '/styles/index.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/earlyaccess/notosanstc.css'
];

const staticCacheName = 'static-cache-v3';
const dynamicCache = 'dynamic-cache-v3';

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    })
  })
}
self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        console.log('caching shell assets');
        return cache.addAll(staticFilesToCache);
      })
      .catch(err => console.error(err))
  );
});

self.addEventListener('activate', function (event) {
  // Perform some task
  console.log('Service worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames
        .filter(cacheNames => cacheNames != staticCacheName)
        .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.indexOf('firestore.googleapis.com') === -1) {
    //console.log('Fetching:', event.request.url);
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // return response || fetch(event.request) 
          if (response) {
            //console.log('Found ', event.request.url, ' in cache');
            return response;
          }
          //console.log('Network request for ', event.request.url);
          return fetch(event.request).then(fetchRes => {
            return caches.open(dynamicCache).then(cache => {
              cache.put(event.request.url, fetchRes.clone());
              //limitCacheSize(dynamicCache,10);
              return fetchRes;
            })
          });

          // TODO 4 - Add fetched files to the cache

        }).catch(error => {

          // TODO 6 - Respond with custom offline page

        })
    );
  }
});