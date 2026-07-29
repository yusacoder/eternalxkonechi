/* ==========================================================================
   sw.js — Eternal Production Service Worker
   Basit cache-first stratejisiyle offline destek sağlar.
   ========================================================================== */

var CACHE_NAME = "eternal-production-v1";
var CORE_ASSETS = [
  "index.html",
  "dublaj.html",
  "css/style.css",
  "js/main.js",
  "js/social.js",
  "js/dublaj.js",
  "data/data.json",
  "data/dublaj.json",
  "manifest.json"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  var url = new URL(event.request.url);
  var cacheKey = event.request;

  if (url.origin === self.location.origin) {
    var pathname = url.pathname;
    // Remove trailing slash if any (except for "/")
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    if (pathname === "/" || pathname === "/index") {
      cacheKey = new URL("/index.html", self.location.href).toString();
    } else if (pathname === "/dublaj") {
      cacheKey = new URL("/dublaj.html", self.location.href).toString();
    }
  }

  event.respondWith(
    caches.match(cacheKey).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            var clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(function (error) {
          throw error;
        });
    })
  );
});
