const VERSION = "m0b1li7y-v10";
const APP_SHELL = `app-shell-${VERSION}`;
const REMOTE_IMAGES = `remote-images-${VERSION}`;
const MAX_REMOTE_IMAGE_ENTRIES = 40;
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./src/app.js",
  "./src/routineImages.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./img/armcircles.png",
  "./img/briskwalk.png",
  "./img/childspose.png",
  "./img/counterpushups.png",
  "./img/kneestochest.png",
  "./img/legswings.png",
  "./img/lyingfigurefour.png",
  "./img/overheadreach.png",
  "./img/plank.png",
  "./img/sidebends.png",
  "./img/toetouchtwist.png",
  "./img/trunkrotation.png"
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
    return;
  }

  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
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
  if (response?.ok) {
    await cache.put(request, response.clone());
    await trimRemoteImageCache(cache);
  }
  return response;
}

async function trimRemoteImageCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_REMOTE_IMAGE_ENTRIES) return;

  const toDelete = keys.slice(0, keys.length - MAX_REMOTE_IMAGE_ENTRIES);
  await Promise.all(toDelete.map((request) => cache.delete(request)));
}
