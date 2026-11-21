/* Astro Tree service worker: hand-written, no build step. Bump VERSION to drop old caches. */
const VERSION = "v1";
const CACHE = `astro-tree-${VERSION}`;
const SCOPE = self.registration.scope; // e.g. https://host/astro-tree/
const INDEX = new URL("index.html", SCOPE).href;
const SHELL = [SCOPE, INDEX];

// Cache a response only if it is a full, same-origin 200 (never errors, opaque or partial).
const cacheable = (res) => res && res.status === 200 && res.type === "basic";

async function put(request, response) {
  if (!cacheable(response)) return;
  const cache = await caches.open(CACHE);
  await cache.put(request, response);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(SHELL);
      // Best effort: also precache the hashed JS/CSS the shell references, so the very
      // first visit works offline (that page load happened before this SW controlled it).
      const html = await (await cache.match(INDEX)).text();
      const refs = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)]
        .map((m) => new URL(m[1], INDEX).href)
        .filter((url) => url.startsWith(SCOPE));
      await Promise.allSettled(refs.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("astro-tree-") && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only same-origin GETs inside our scope; Google Fonts and everything else go straight to network.
  if (request.method !== "GET" || !request.url.startsWith(SCOPE)) return;

  if (request.mode === "navigate") {
    // Network-first so a new deploy is picked up immediately; offline, any route
    // (e.g. /card/leo) falls back to the cached SPA shell.
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(request);
          if (request.url === SCOPE || request.url === INDEX) event.waitUntil(put(INDEX, res.clone()));
          return res;
        } catch {
          const cache = await caches.open(CACHE);
          return (await cache.match(INDEX)) || (await cache.match(SCOPE)) || Response.error();
        }
      })(),
    );
    return;
  }

  // Stale-while-revalidate for assets: serve the cache now, refresh it in the background.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      const network = fetch(request).then(async (res) => {
        if (cacheable(res)) await cache.put(request, res.clone());
        return res;
      });
      if (cached) {
        event.waitUntil(network.catch(() => {}));
        return cached;
      }
      return network;
    })(),
  );
});
