const staticFilesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/main.js',
  '/styles/index.css',
  '/manifest.json',
  '/assets/welcome_card.jpg',
  '/assets/icons/icon-256.png',
  '/scripts/firebase-code.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/earlyaccess/notosanstc.css'
];

const staticCacheName = 'static-cache-v7';
const dynamicCache = 'dynamic-cache-v7';

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    })
  })
}
//install service worker
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

// activate event
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


// fetch event  Listen and respond
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
        }).catch(error => {

          // TODO 6 - Respond with custom offline page

        })
    );
  }
});
