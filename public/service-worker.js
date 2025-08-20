import { precacheAndRoute } from "workbox-precaching";

// Precache files (injected at build time)
precacheAndRoute(self.__WB_MANIFEST || []);

// Example: runtime caching (optional)
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate()
);

// ✅ Push notifications
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "New Notification", {
      body: data.body || "You’ve got a message!",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      data: data.url || "/",
    })
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
