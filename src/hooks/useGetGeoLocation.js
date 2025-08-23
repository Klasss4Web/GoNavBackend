import { useEffect, useState } from "react";

export function useLiveGeolocation() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);
  console.log({ position });
  return position;
}
