import "./swUpdateToast.css";

import { useServiceWorkerUpdater } from "../../hooks/useServiceWorkerUpdater";
import { useState } from "react";

export default function SWUpdaterToast() {
  const { waitingWorker, updateServiceWorker, setWaitingWorker } =
    useServiceWorkerUpdater();

  const [closing, setClosing] = useState(false);

  if (!waitingWorker) return null;

  const handleClose = (action) => {
    setClosing(true);
    setTimeout(() => {
      if (action === "update") {
        updateServiceWorker();
      } else {
        setWaitingWorker(null);
      }
    }, 300); // ⏳ match CSS animation duration
  };

  return (
    <div className="update-toast-container">
      <div className={`update-app-toast ${closing ? "closing" : ""}`}>
        <div
          className="toast-update-app-close"
          onClick={() => handleClose("close")}
        >
          X
        </div>
        <p>🚀 A new version of this app is available.</p>
        <button onClick={() => handleClose("update")}>Update</button>
      </div>
    </div>
  );
}
