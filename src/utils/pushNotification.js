// src/subscribe.js
// const publicVapidKey = import.meta.env.VITE_VAPID_KEY;

import { BASE_URL } from "../service/endPointConstants";

const publicVapidKey =
  "BGniIxi9J8sN2MMP1MvPVxSaRW6qnSGrUutrZJkZwXXTFJJ5vuF5--Jk79ZOY3fvecuzP5h4HjXe0l3L-EsgwYw";

export async function pushNotificationSubscribeUser(routeCode) {
  console.log({ publicVapidKey });
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("❌ Push not supported in this browser.");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("❌ Notifications denied.");
    return;
  }
  if ("serviceWorker" in navigator && "PushManager" in window) {
    // const registration = await navigator.serviceWorker.register(
    //   "/service-worker.js"
    // );
    const registration = await navigator.serviceWorker.ready;
    console.log("HELLO PUSH", registration);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    try {
      // Send subscription to your backend
      const response = await fetch(
        `${BASE_URL}/push-notification/save-subscription`,
        {
          method: "POST",
          body: JSON.stringify({ routeCode, subscription }),
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(`Push notification sent successfully: ${response}`);
    } catch (error) {
      console.log(`Error sending push notification ${error}`);
    }
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
