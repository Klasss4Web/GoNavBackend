import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function RotateMap({ bearing, mode }) {
  const map = useMap();
  useEffect(() => {
    const mapPane = map.getPane("mapPane");
    if (mode === "heading" && bearing != null) {
      mapPane.style.transformOrigin = "center center";
      mapPane.style.transform = `rotate(${-bearing}deg)`;
    } else {
      mapPane.style.transform = "rotate(0deg)";
    }
  }, [bearing, mode, map]);
  return null;
}
