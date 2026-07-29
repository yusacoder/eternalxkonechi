/* ==========================================================================
   sw.js — Eternal Production Service Worker
   Cache-first stratejisiyle offline destek sağlar.
   ========================================================================== */

const CACHE_NAME = "eternal-production-v2";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/dublaj.html",
  "/css/style.css",
  "/js/main.js",
  "/js/social.js",
  "/js/dublaj.js",
  "/data/data.json",
  "/data/dublaj.json",
  "/manifest.json"
];

/* --------------------------------------------------------------------------
   Install
-------------------------------------------------------------------------- */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* --------------------------------------------------------------------------
   Activate
-------------------------------------------------------------------------- */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

/* --------------------------------------------------------------------------
   Fetch
-------------------------------------------------------------------------- */

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Sadece kendi domainimiz için özel yönlendirme.
  let cacheKey = event.request;

  if (url.origin === self.location.origin) {
    let pathname = url.pathname;

    // Gereksiz "/" karakterini kaldır.
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    // Temiz URL desteği.
    if (pathname === "/" || pathname === "/index") {
      cacheKey = new Request("/index.html");
    } else if (pathname === "/dublaj") {
      cacheKey = new Request("/dublaj.html");
    }
  }

  event.respondWith(
    caches.match(cacheKey).then((cachedResponse) => {
      // Cache varsa direkt döndür.
      if (cachedResponse) {
        return cachedResponse;
      }

      // Ağdan çek.
      return fetch(event.request)
        .then((networkResponse) => {

          // Başarılı cevapları cache'e kaydet.
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(cacheKey, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          // Offline durumunda index sayfasını göstermeyi dene.
          return caches.match("/index.html");
        });
    })
  );
});
