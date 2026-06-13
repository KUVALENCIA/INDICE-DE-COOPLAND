// Nombre de la memoria caché y archivos a guardar
const CACHE_NAME = 'coopland-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // Si agregas imágenes de íconos, puedes sumarlas a esta lista así:
  // './icon-192.png',
  // './icon-512.png'
];

// Instalar el Service Worker y guardar los archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché guardados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar las peticiones de red para servir los archivos guardados si no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en caché, devuélvelo. Si no, búscalo en internet.
        return response || fetch(event.request);
      })
  );
});