import React, { useEffect, useState } from "react";
import { getDevice } from "framework7/lite-bundle";
import { f7, f7ready, App, View } from "framework7-react";

import capacitorApp from "../js/capacitor-app";
import routes from "../js/routes";
import store from "../js/store";
import { GlobalProvider } from "../context/globalContext";

const MyApp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const device = getDevice();

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
        : {},
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

  return (
    // <GpsProvider>
    <GlobalProvider>
      <App {...f7params}>
        <View main className="safe-areas" url="/" />
      </App>
    </GlobalProvider>
  );
};

export default MyApp;
