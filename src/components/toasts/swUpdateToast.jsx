import "./swUpdateToast.css";

import { useServiceWorkerUpdater } from "../../hooks/useServiceWorkerUpdater";

export default function SWUpdaterToast() {
  const { waitingWorker, updateServiceWorker, setWaitingWorker } =
    useServiceWorkerUpdater();

  if (!waitingWorker) return null;

  return (
    <div className="update-app-toast">
      <div
        className="toast-update-app-close"
        onClick={() => setWaitingWorker(null)}
      >
        X
      </div>
      <p>🚀 A new version of this app is available.</p>
      <button onClick={updateServiceWorker}>Update</button>
    </div>
  );
}
