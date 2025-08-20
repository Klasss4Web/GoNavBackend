// src/subscribe.js
const publicVapidKey = "BEXAMPLEc9nGm..."; // same as generated above

export async function pushNotificationSubscribeUser() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    // Send subscription to your backend
    await fetch("/api/save-subscription", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper
function urlBase64ToUint8Array(base64String) {
  if (!base64String) return;
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
