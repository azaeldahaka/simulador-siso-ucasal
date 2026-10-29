/**
 * Service Worker para funcionamiento 100% Offline (PWA)
 * Cache-First Strategy con auto-actualización
 */

const CACHE_NAME = "siso-simulador-v2";
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

// Instalación: Cachear todos los recursos estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Cacheando assets para offline...");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpiar caches viejas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Borrando cache vieja:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Responder desde cache, fallback a red
self.addEventListener("fetch", (event) => {
  // Ignorar llamadas a APIs externas como Gemini
  if (event.request.url.includes("googleapis.com")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      // Fallback offline a index.html si es navegación
      if (event.request.mode === "navigate") {
        return caches.match("./index.html");
      }
    })
  );
});
