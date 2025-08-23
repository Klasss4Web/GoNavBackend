import { useEffect, useState } from "react";

export function useServiceWorkerUpdater() {
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                // ✅ Only show toast if already controlled (means it's an update)
                if (navigator.serviceWorker.controller) {
                  console.log("[SW] New update ready");
                  setWaitingWorker(newWorker);
                } else {
                  console.log("[SW] First install, skip showing toast");
                }
              }
            });
          }
        });
      });
    }
  }, []);

  const updateServiceWorker = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });

      waitingWorker.addEventListener("statechange", (e) => {
        if (e.target.state === "activated") {
          window.location.reload();
        }
      });

      setWaitingWorker(null); // close toast
    }
  };

  return { waitingWorker, updateServiceWorker, setWaitingWorker };
}
