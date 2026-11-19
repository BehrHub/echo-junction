// Echo Junction: network first (so a new upload shows up right away), the saved copy when there's no connection.
const CACHE = "echo-junction-site-v1";
const SHELL = ["./", "index.html", "game.enc", "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || /family\.json$/.test(u.pathname)) return;   // fonts etc. and the family file go straight to the network
  e.respondWith(fetch(r, { cache: "no-cache" }).then((res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)).catch(() => {}); } return res; }).catch(() => caches.match(r, { ignoreSearch: true })));
});
