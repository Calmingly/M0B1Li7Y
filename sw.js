const VERSION = "m0b1li7y-v2";
const APP_SHELL = `app-shell-${VERSION}`;
const REMOTE_IMAGES = `remote-images-${VERSION}`;
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./src/app.js",
  "./src/routineImages.js",
  "./manifest.webmanifest",
  "./icons/icon.svg"
];

let enableRemoteImageCaching = false;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(APP_SHELL).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![APP_SHELL, REMOTE_IMAGES].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SETTINGS_UPDATE") {
    enableRemoteImageCaching = Boolean(event.data.payload?.enableRemoteImageCaching);
  }
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET") return;

  const isRemoteBendImage =
    requestUrl.hostname.includes("bend.com") &&
    event.request.destination === "image";

  if (isRemoteBendImage) {
    if (!enableRemoteImageCaching) return;
    event.respondWith(cacheFirst(event.request, REMOTE_IMAGES));
    return;
  }

  if (requestUrl.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(event.request, APP_SHELL));
  }
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response?.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response?.ok) cache.put(request, response.clone());
  return response;
}
