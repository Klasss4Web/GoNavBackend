import { useEffect, useState } from "react";

export const useMapControls = () => {
  const [heading, setHeading] = useState(0);
  const [position, setPosition] = useState(null); // ✅ store lat/lng

  useEffect(() => {
    let watchId;

    const success = (pos) => {
      const { latitude, longitude, heading } = pos.coords;

      // ✅ Save position
      setPosition({ lat: latitude, lng: longitude });

      // ✅ Save heading if available
      if (heading !== null) {
        setHeading(heading);
      }
    };

    const error = (err) => {
      console.warn("Geolocation error:", err);

      // If timeout, retry with low accuracy
      if (err.code === 3) {
        console.log("Retrying with low accuracy...");
        navigator.geolocation.getCurrentPosition(success, console.error, {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
        });
      }
    };

    if ("geolocation" in navigator) {
      // Start watching position
      watchId = navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 20000, // give GPS up to 20s
        maximumAge: 5000,
      });
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { heading, position };
};
