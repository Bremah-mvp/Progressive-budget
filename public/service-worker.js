const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/index.js',
    '/manifest.webmanifest',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/db.js',
    '/https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
    '/https://cdn.jsdelivr.net/npm/chart.js@2.8.0'

  ];
  
  const PRECACHE  = 'precache-v1';
  const RUNTIME = 'runtime';
  
  // Install and add service worker
  self.addEventListener('install', function(evt) {
    evt.waitUntil(
      caches.open(PRECACHE).then(cache => {
        console.log('Your files were pre-cached successfully!');
       // return 
        cache.addAll(FILES_TO_CACHE);
        self.skipWaiting();
      })
    );
  
    
  });
  
  // Activate the service worker and remove old data from the cache
  self.addEventListener('activate', function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList =>
        Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log('Removing old cache data', key);
              return caches.delete(key);
            }
          })
        )
      )
    );
  
    self.clients.claim();
  });
  
  // Enable the service worker to intercept network requests
  self.addEventListener('fetch', function(evt) {
    if (evt.request.url.includes('/api/')) {
      evt.respondWith(
        caches
          .open(DATA_CACHE_NAME)
          .then(cache =>
            fetch(evt.request)
              .then(response => {
                // If the response was good, clone it and store it in the cache.
                if (response.status === 200) {
                  cache.put(evt.request.url, response.clone());
                }
  
                return response;
              })
              .catch(err => {
                // Network request failed, try to get it from the cache.
               return cache.match(evt.request)
              }) 
          )
          .catch(err => console.log(err))
      );
  
      return;
    }
    
    // Allows the page to be accessible offline, shows files from the cache
    evt.respondWith(
      caches
        .open(CACHE_NAME)
      .then(cache =>
         cache
            .match(evt.request)
            .then(response => response || fetch(evt.request))
        )
    );
  });