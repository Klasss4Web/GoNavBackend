// src/components/SplashScreen.jsx
import { useEffect, useState } from "react";
import "./splashScreen.css";
import { Spinner } from "../spinner/spinner";

export default function SplashScreen({ onLoaded }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [themeColor, setThemeColor] = useState("#2563eb"); // fallback
  const [bgColor, setBgColor] = useState("#131936"); // fallback

  const loadManifest = () => {
    const metaTheme = document.querySelector("meta[name='theme-color']");
    if (metaTheme) {
      setThemeColor(metaTheme.getAttribute("content"));
    }

    // Force fresh manifest.json fetch
    fetch(`/manifest.json?ts=${Date.now()}`)
      .then((res) => res.json())
      .then((manifest) => {
        if (manifest.background_color) setBgColor(manifest.background_color);
        if (manifest.theme_color) {
          setThemeColor(manifest.theme_color);
          metaTheme?.setAttribute("content", manifest.theme_color);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadManifest();

    const handleFocus = () => loadManifest();
    window.addEventListener("focus", handleFocus);

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        if (onLoaded) onLoaded();
      }, 500);
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", handleFocus);
    };
  }, [onLoaded]);

  return (
    <div
      className={`splash-screen ${fadeOut ? "fade-out" : ""}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="splash-content align-vertically">
        <img
          src="/icons/android-chrome-192x192.png"
          alt="App Logo"
          className="logo"
        />
        <img
          src="../assets/img/gonav.png"
          alt="App Logo"
          style={{
            width: "30%",
            height: "auto",
            mixBlendMode: "overlay", // or multiply, overlay, etc.
          }}
        />
        <Spinner themeColor={themeColor} />
      </div>
    </div>
  );
}
