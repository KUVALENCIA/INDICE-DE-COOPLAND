// ¡ACTUALIZADO! Cambiamos de 'v2' a 'v3' para forzar la actualización con el nuevo campo de Edad
const CACHE_NAME = 'coopland-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalar el Service Worker y forzar que tome el control inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting(); // Le dice al teléfono: "¡Usa esta versión ahora mismo!"
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar y borrar la memoria caché antigua (limpieza automática)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si el nombre de la caché antigua no coincide con la versión actual (v3), se borra
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia "Network First" (Internet Primero)
self.addEventListener('fetch', event => {
  event.respondWith(
    // 1. Intenta descargar la versión más reciente de internet
    fetch(event.request).then(response => {
      // Si hay internet y se descarga bien, actualizamos la memoria guardada silenciosamente
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch(() => {
      // 2. Si falla (porque no hay internet), usa la versión que guardamos en el teléfono
      return caches.match(event.request);
    })
  );
});