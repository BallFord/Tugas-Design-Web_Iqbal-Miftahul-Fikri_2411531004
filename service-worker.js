const CACHE_NAME = 'my-website-cache-v1';
const urlsToCache = [
  '.',
  'index.html',
  'about.html',
  'contact.html',
  'offline.html',
  'images/BgUnand.jpg',
  'images/Iqbalslebew.jpeg'
];

// Event 'install' tetap sama
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch' diperbarui dengan logika yang lebih baik
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Jika ada di cache, langsung kembalikan
        if (cachedResponse) {
          return cachedResponse;
        }

        // Jika tidak ada di cache, coba ambil dari network
        return fetch(event.request).catch(() => {
          // Jika network gagal DAN ini adalah permintaan untuk sebuah halaman
          if (event.request.destination === 'document') {
            return caches.match('offline.html');
          }
          // Untuk aset lain yang gagal (gambar, dll), biarkan saja gagal
          // tanpa menampilkan halaman offline.
        });
      })
  );
});

// Event 'activate' tetap sama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
