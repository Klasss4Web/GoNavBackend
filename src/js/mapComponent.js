import { useEffect, useState } from "react";

import { useMap } from "react-leaflet";
// import {timeTracking} from "../js/component";
import { connectToMqtt, useMqttSubscription } from "./mqttClient";

const customIconUrl = "/assets/img/mark.png";
const busStopUrl = "/assets/img/BusStop.png";
const officeUrl = "/assets/img/office.png";
import { useGlobalContext } from "../context/globalContext";
import { compareTime } from "../utils/compareTime";

const gpsTopic = "location/yaba";
export const useMqttGps = () => {
  const gpsData = useMqttSubscription(gpsTopic);
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

  console.log({ selectedTracker });

  useEffect(() => {
    if (!selectedTracker?.routeName) return;

    const routeFile = `${selectedTracker.routeName}Route.json`;

    fetch(`https://obiot.duckdns.org/GoNav/route/${routeFile}`)
      .then((res) => res.json())
      .then((data) => {
        const allRoutes =
          // selectedTracker.destination?.toLowerCase() === "interswitch"
          compareTime === "monring" ? data : [...data].reverse();
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
  iconSize: [50, 50],
  iconAnchor: [19, 50],
  popupAnchor: [8, -50],
});

export const bustopIcon = new L.Icon({
  iconUrl: busStopUrl,
  iconSize: [30, 30],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export const officeIcon = new L.Icon({
  iconUrl: officeUrl,
  iconSize: [40, 40],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export const busStopsMap = [
  {
    name: "Unilag Bus Stop",
    latitude: 6.517689,
    longitude: 3.384223,
    returnValue: 1,
  },
  {
    name: "Abule-Oja Bus Stop",
    latitude: 6.516592,
    longitude: 3.381157,
    returnValue: 2,
  },
  {
    name: "Onike Bus Stop",
    latitude: 6.50964,
    longitude: 3.383816,
    returnValue: 3,
  },
  {
    name: "Sabo Bus Stop",
    latitude: 6.505617,
    longitude: 3.377856,
    returnValue: 4,
  },
  {
    name: "Alagomeji Bus Stop",
    latitude: 6.499548,
    longitude: 3.378231,
    returnValue: 5,
  },
  {
    name: "Alagomeji Bus Stop",
    latitude: 6.500541,
    longitude: 3.379448,
    returnValue: 5,
  },
  {
    name: "iFitness Bus Stop",
    latitude: 6.497126,
    longitude: 3.379595,
    returnValue: 6,
  },
  {
    name: "Casino Bus Stop",
    latitude: 6.497265,
    longitude: 3.38035,
    returnValue: 7,
  },
  {
    name: "Adekunle Bus Stop",
    latitude: 6.4915,
    longitude: 3.382831,
    returnValue: 8,
  },
  {
    name: "InterSwitch VI",
    latitude: 6.428334,
    longitude: 3.429,
    returnValue: 9,
  },

  // Add more bus stops as needed
];

export const busStops = () => {
  const hours = timeTracking(); // Ensure you call timeTracking to get the current time
  if (hours >= 0 && hours <= 12) {
    return [
      {
        name: "Unilag",
        latitude: 6.517689,
        longitude: 3.384223,
        returnValue: 1,
      },
      {
        name: "Abule-Oja",
        latitude: 6.516592,
        longitude: 3.381157,
        returnValue: 2,
      },
      { name: "Onike", latitude: 6.50964, longitude: 3.383816, returnValue: 3 },
      { name: "Sabo", latitude: 6.505617, longitude: 3.377856, returnValue: 4 },
      {
        name: "Alagomeji",
        latitude: 6.499548,
        longitude: 3.378231,
        returnValue: 5,
      },
      {
        name: "iFitness",
        latitude: 6.497126,
        longitude: 3.379595,
        returnValue: 6,
      },
      {
        name: "Adekunle",
        latitude: 6.4915,
        longitude: 3.382831,
        returnValue: 7,
      },
      {
        name: "InterSwitch VI",
        latitude: 6.428334,
        longitude: 3.429,
        returnValue: 8,
      },
    ];
  } else {
    return [
      {
        name: "Unilag",
        latitude: 6.517689,
        longitude: 3.384223,
        returnValue: 1,
      },
      {
        name: "Abule-Oja",
        latitude: 6.516592,
        longitude: 3.381157,
        returnValue: 2,
      },
      { name: "Onike", latitude: 6.50964, longitude: 3.383816, returnValue: 3 },
      { name: "Sabo", latitude: 6.505617, longitude: 3.377856, returnValue: 4 },
      {
        name: "Alagomeji",
        latitude: 6.500541,
        longitude: 3.379448,
        returnValue: 5,
      },
      {
        name: "Casino",
        latitude: 6.497265,
        longitude: 3.38035,
        returnValue: 6,
      },
      {
        name: "Adekunle",
        latitude: 6.4915,
        longitude: 3.382831,
        returnValue: 7,
      },
      {
        name: "InterSwitch VI",
        latitude: 6.428334,
        longitude: 3.429,
        returnValue: 8,
      },
    ];
  }
};
