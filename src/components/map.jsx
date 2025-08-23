import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
// import {UpdateMapView,busStopsMap } from "../js/mqttClient";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import {
  useMqttGps,
  UpdateMapView,
  customIcon,
  bustopIcon,
  officeIcon,
} from "../js/mapComponent";
import "leaflet/dist/leaflet.css";
import "../css/leaflet-routing-machine.css";
import RoutineMachine from "./RoutingMachine";
import { motion } from "framer-motion";
// Fix for Leaflet icon paths in bundlers like Vite/Webpack
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { getNextStop, getNextStopAhead } from "../utils/busStopDistance";

// import { useGps } from '../context/globalContext.jsx'; // adjust path

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// const defaultCurrentLocation = [6.5244, 3.3762]; // Lagos coords
const defaultCurrentLocation = [6.428334, 3.429]; // Interswitch coords

const MapComponent = ({ gpsLocation, busStops }) => {
  // destructure prop
  const [currentLocation, setCurrentLocation] = useState(
    gpsLocation || defaultCurrentLocation
  );
  // const { gpsData } =  useMqttGps();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!gpsLocation) return;

    const [lat1, lng1] = currentLocation;
    const [lat2, lng2] = gpsLocation;

    let steps = 20; // number of steps for animation
    let step = 0;

    const latStep = (lat2 - lat1) / steps;
    const lngStep = (lng2 - lng1) / steps;

    const interval = setInterval(() => {
      step++;
      setCurrentLocation([lat1 + latStep * step, lng1 + lngStep * step]);
      if (step >= steps) clearInterval(interval);
    }, 50); // adjust speed (50ms per step)

    return () => clearInterval(interval);
  }, [gpsLocation]);

  const commonAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ';
  // '&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a> | ' +
  // '&copy; <a href="https://www.stamen.com/">Stamen Design</a> | ' +
  // '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> | ' +
  // 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>';

  // // Update state when GPS data changes
  // useEffect(() => {
  //   if (gpsData) {
  //     // setCurrentLocation(gpsData.currentLocation);
  //     console.log("GPS data received: yes oooo", gpsData);
  //   setCurrentLocation([Number(gpsData.lat), Number(gpsData.lon)]);
  //   }
  // }, [gpsData]);

  return (
    <MapContainer
      center={currentLocation}
      zoom={17}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      {currentLocation && (
        <RoutineMachine
          // key={key}
          lat1={busStops?.[0]?.latitude}
          lon1={busStops?.[0]?.longitude}
          lat2={busStops?.at(-1)?.latitude}
          lon2={busStops?.at(-1)?.longitude}
        />
      )}

      <UpdateMapView center={currentLocation} />

      <ZoomControl position="bottomleft" />
      <LayersControl position="bottomright">
        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution={commonAttribution}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={commonAttribution}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Street Map">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            attribution={commonAttribution}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Simple Map">
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
            attribution={commonAttribution}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <Marker ref={markerRef} position={currentLocation}>
        <Popup>
          Heading to{" "}
          {getNextStop(
            {
              latitude: currentLocation[0],
              longitude: currentLocation[1],
            },
            busStops
          )?.name
            ? getNextStop(
                {
                  latitude: currentLocation[0],
                  longitude: currentLocation[1],
                },
                busStops
              )?.name
            : selectedTracker?.busStopName}
        </Popup>
      </Marker>
      {/* Markers for Bus Stops */}
      {busStops.map((stop, index) => (
        <Marker
          key={index}
          position={[stop.latitude, stop.longitude]}
          icon={index == busStops.length - 1 ? officeIcon : bustopIcon}
        >
          <div className="relative">
            <Popup>
              <span className="map-tooltip">{stop.name}</span>
            </Popup>
          </div>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
