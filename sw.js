const CACHE_NAME = "work-cal-v1";
const ASSETS = ["./", "./index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(e.request, { ignoreSearch: true }).then((cached) => {
        const fetched = fetch(e.request)
          .then((netRes) => {
            if (netRes && netRes.status === 200) {
              cache.put(e.request, netRes.clone());
            }
            return netRes;
          })
          .catch(() => cached || cache.match("./index.html"));
        return cached || fetched;
      })
    )
  );
});
