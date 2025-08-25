import { useEffect, useState } from "react";

import { useMap } from "react-leaflet";
// import {timeTracking} from "../js/component";
import { connectToMqtt, useMqttSubscription } from "./mqttClient";

const customIconUrl = "/assets/img/mark.png";
const busStopUrl = "/assets/img/BusStop.png";
const officeUrl = "/assets/img/office.png";
import { useGlobalContext } from "../context/globalContext";
import { compareTime } from "../utils/compareTime";

const gpsTopic = "location/";

export const useMqttGps = () => {
    const { selectedTracker } = useGlobalContext();
  const gpsData = useMqttSubscription(`${gpsTopic}${selectedTracker?.routeName}`);
  return { gpsData };
};

// Custom component to update the map view
export const UpdateMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const useBusStops = () => {
  const { selectedTracker } = useGlobalContext();
  const [busStopsMap, setBusStopsMap] = useState([]);

  // console.log({ selectedTracker });

  useEffect(() => {
    if (!selectedTracker?.routeName) return;

    const routeFile = `${selectedTracker.routeName}Route.json`;

    fetch(`https://obiot.duckdns.org/GoNav/route/${routeFile}`)
      .then((res) => res.json())
      .then((data) => {
        const transformData = data.filter((stop) => stop.latitude && stop.longitude);
        const allRoutes =
          // selectedTracker.destination?.toLowerCase() === "interswitch"
          compareTime === "morning" ? transformData : [...transformData].reverse();
        setBusStopsMap(allRoutes);
        console.log("Fetched route:", selectedTracker.routeName);
      })
      .catch((err) => console.error("Failed to load bus stops:", err));
  }, [selectedTracker?.routeName]); // ✅ Dependency array updated

  return busStopsMap;
};

export const routeFetch = () => {
  const [route, setRoute] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://obiot.duckdns.org/GoNav/route/route.json")
      .then((res) => res.json())
      .then((data) => {
        setError(null);
        setRoute(data);
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [loading]);

  return { route, error, loading };
};

// Icon configurations for custom markers
export const customIcon = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [40, 40],
  iconAnchor: [19, 50],
  popupAnchor: [8, -50],
});

export const personIcon = L.divIcon({
  html: '<div style="font-size:40px; line-height:40px;">🧍</div>',
  className: "person-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32], // center bottom
});

export const bustopIcon = new L.Icon({
  iconUrl: busStopUrl,
  iconSize: [50, 50],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export const officeIcon = new L.Icon({
  iconUrl: officeUrl,
  iconSize: [60, 60],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});


export const isSelectedTrackerValid = () => {
  const stored = localStorage.getItem('selectedTracker');
  if (!stored) return false;

  try {
    const tracker = JSON.parse(stored);
    const requiredKeys = ['routeName', 'trackerId', 'routeCode', 'busType', 'plateNumber', 'destination'];
    return requiredKeys.every(key => tracker[key]);
  } catch {
    return false;
  }
};
