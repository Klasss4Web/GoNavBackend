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
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setWaitingWorker(newWorker);
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
        console.log({ e });
        if (e.target.state === "activated") {
          window.location.reload();
          setWaitingWorker(null);
        }
      });
    }
  };

  return { waitingWorker, updateServiceWorker, setWaitingWorker };
}
