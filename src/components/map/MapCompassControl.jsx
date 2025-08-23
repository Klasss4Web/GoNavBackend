import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export function CompassControl({ heading }) {
  <div
    style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      width: "60px",
      height: "60px",
      backgroundImage: "url('./icons/compass.png')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      transform: `rotate(${heading}deg)`,
      zIndex: 1000,
      pointerEvents: "none", // don’t block map drag
    }}
  />;

  return null;
}
