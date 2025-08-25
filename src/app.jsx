import { useEffect, useState } from "react";
import { getDevice } from "framework7/lite-bundle";
import { f7, f7ready, App, View } from "framework7-react";

import store from "./js/store";
import routes from "./js/routes";
import capacitorApp from "./js/capacitor-app";
import { GlobalProvider } from "./context/globalContext";
import { NotificationAlert } from "./components/toasts/notificationAlert";
import SWUpdaterToast from "./components/toasts/swUpdateToast";
import PullToRefreshWrapper from "./components/pullRefresh/PullToRefreshWrapper";
import SplashScreen from "./components/splashScreens/dynamicSplashScreen";
import { ErrorBoundary } from "./components/errorBoundary";

const MyApp = () => {
  const device = getDevice();
  const [showSplash, setShowSplash] = useState(true);

  const f7params = {
    name: "GoNavApp",
    theme: "auto",
    store: store,
    routes: routes,
    serviceWorker:
      process.env.NODE_ENV === "production"
        ? {
            path: "/service-worker.js",
          }
        : { path: "/service-worker.js" },
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
    view: {
      browserHistory: true, // 👈 enables browser history
      browserHistoryRoot: window.location.origin, // 👈 makes sure history is relative to root
      browserHistorySeparator: "", // optional: removes `#!` hash
    },
  };

  f7ready(() => {
    if (f7.device.capacitor) {
      capacitorApp.init(f7);
    }
  });

  useEffect(() => {
    if ("Notification" in window && navigator.serviceWorker) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("✅ Notifications enabled!");
        } else if (permission === "denied") {
          console.log("❌ Notifications denied by user.");
        } else {
          console.log("⚠️ Permission request dismissed (default).");
        }
      });
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "✅ Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch((err) => {
            console.error("❌ Service Worker registration failed:", err);
          });
      });
    }
  }, []);

  const [customPopData, setCustomPopupData] = useState({
    showPopup: false,
    data: {},
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const handler = async (event) => {
        console.log("Message from SW:", event.data);
        if (event.data?.type === "CUSTOM_POPUP") {
          setCustomPopupData((prev) => ({
            ...prev,
            showPopup: true,
            data: event.data.payload,
          }));
        }
      };
      navigator.serviceWorker.addEventListener("message", handler);

      return () => {
        navigator.serviceWorker.removeEventListener("message", handler);
      };
    }
  }, []);

  return (
    // <GpsProvider>
    <GlobalProvider>
      {showSplash ? (
        <SplashScreen onLoaded={() => setShowSplash(false)} />
      ) : (
        <ErrorBoundary>
          <App {...f7params}>
            <View main className="safe-areas" url="/" />

            <NotificationAlert
              show={customPopData.showPopup}
              onClose={() =>
                setCustomPopupData((prev) => ({ ...prev, showPopup: false }))
              }
              title={customPopData?.data?.title}
              message={customPopData?.data?.body}
              icon="/icons/apple-touch-icon.png"
            />

            <SWUpdaterToast />
          </App>
        </ErrorBoundary>
      )}
    </GlobalProvider>
  );
};

export default MyApp;
