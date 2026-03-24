const CACHE_NAME = "orcamento-app-v3"; // MUDE A VERSÃO SEMPRE

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json"
];

// INSTALAÇÃO
self.addEventListener("install", event => {
  self.skipWaiting(); // força atualizar
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ATIVAÇÃO
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME){
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH (sempre tenta pegar versão nova primeiro)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request))
  );
});
