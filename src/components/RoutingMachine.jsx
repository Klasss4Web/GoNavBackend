import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "lrm-graphhopper";

export default function RoutingMachine({
  lat1,
  lon1,
  lat2,
  lon2,
  onRouteFound,
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(lat1, lon1), L.latLng(lat2, lon2)],
      router: new L.Routing.GraphHopper("2c4f062b-4df5-4a4d-84af-253c44c99aaf"),
      lineOptions: {
        styles: [
          { color: "black", opacity: 0.5, weight: 10 },
          { color: "white", opacity: 1, weight: 6 },
          { color: "blue", opacity: 1, weight: 4 },
        ],
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
      createMarker: () => null,
    }).addTo(map);

    routingControl.on("routesfound", function (e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      const distance = summary.totalDistance / 1000; // Distance in kilometers
      const time = summary.totalTime / 60; // Time in minutes

      if (onRouteFound) {
        onRouteFound({ distance, time });
      }
    });

    return () => map.removeControl(routingControl);
  }, [map, lat1, lon1, lat2, lon2]);

  return null;
}
