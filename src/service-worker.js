/* eslint-disable no-undef */

// ✅ Import Workbox runtime from CDN (or bundle it yourself if preferred)
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

// ✅ Precache assets injected by Workbox
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// ✅ Navigation (SPA) caching
workbox.routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "pages",
  })
);

// ✅ Cache CSS/JS/images
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "assets",
  })
);

// ✅ Push Notifications
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  let data = {
    title: "New Notification",
    body: "You have a new notification.",
  };

  try {
    if (event.data) {
      data = event.data.json(); // 👈 must be valid JSON
    }
  } catch (e) {
    console.warn("Push payload was not valid JSON, using fallback.", e);
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "New Notification", {
      body: data.body || "You’ve got a message!",
      icon: "/icons/andoird-chrome-192x192.png",
      badge: "/icons/favicon-32x32.png",
      data: data.url || "/",
    })
  );
});

// ✅ Click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
