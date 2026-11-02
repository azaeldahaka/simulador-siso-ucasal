/**
 * Service Worker para funcionamiento 100% Offline (PWA)
 * Estrategia Híbrida: Network-First para Código (.js, .css, .html) + Cache-First para Medios
 */

const CACHE_NAME = "siso-simulador-v3.9.0";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/css/main.css",
  "./assets/css/components.css",
  "./assets/css/modes.css",
  "./assets/icons/icon.svg",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./src/main.js",
  "./src/app.js",
  "./src/core/state.js",
  "./src/core/storage.js",
  "./src/core/timer.js",
  "./src/core/evaluator.js",
  "./src/data/questions-choice.js",
  "./src/data/questions-open.js",
  "./src/data/problems-generator.js",
  "./src/data/cheatsheet-data.js",
  "./src/components/navbar.js",
  "./src/components/choice-view.js",
  "./src/components/open-view.js",
  "./src/components/generator-view.js",
  "./src/components/exam-view.js",
  "./src/components/cheatsheet-view.js"
];

// Instalación: Forzar activación inmediata
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Pre-cacheando assets actualizados v3.8.0...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activación: Purgar inmediatamente todas las caches antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Purgando cache antigua obsoleta:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Handler Inteligente
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Ignorar llamadas a APIs externas como Gemini
  if (url.origin.includes("googleapis.com")) {
    return;
  }

  // 2. Solo manejar peticiones GET
  if (event.request.method !== "GET") {
    return;
  }

  const isCodeOrHtml = 
    event.request.mode === "navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith("/") ||
    url.search.includes("v=");

  if (isCodeOrHtml) {
    // ESTRATEGIA NETWORK-FIRST: Si hay internet, siempre la versión más reciente
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Si está offline o falla la red, recurrir a la copia en caché
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.mode === "navigate") {
              return caches.match("./index.html");
            }
          });
        })
    );
  } else {
    // ESTRATEGIA CACHE-FIRST: Para imágenes, iconos y fuentes
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
