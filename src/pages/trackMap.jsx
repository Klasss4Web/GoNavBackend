import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Page, Icon, Link } from "framework7-react";

import "../css/map.css";
import MapComponent from "../components/map.jsx";
import NotificationDot from "../components/component";
import { useMqttGps, useBusStops } from "../js/mapComponent";
import { useGlobalContext } from "../context/globalContext.jsx";
import SwipeableFooter from "../components/collapsibleFooter.jsx";
import { getNextStop } from "../utils/busStopDistance.js";
import { triggerPushNotification } from "../service/notification.js";

const TrackMap = () => {
  const { selectedTracker, setSelectedTracker } = useGlobalContext();
  const [currentLocation, setCurrentLocation] = useState(0);
  const { gpsData } = useMqttGps();
  const [speed, setSpeed] = useState(0);
  const [deviceId, setDeviceId] = useState(0);
  const busStopsMap = useBusStops();
  const [lastBusStop, setLastBusStop] = useState(null);

  console.log({ busStopsMap, gpsData }); // Call the hook
  const status = true;
  useEffect(() => {
    if (gpsData && typeof gpsData.speed !== "undefined") {
      setSpeed(gpsData.speed);
      setCurrentLocation([Number(gpsData.lat), Number(gpsData.lon)]);
      setDeviceId(gpsData.id);
      console.log("speed is " + gpsData.speed);
    }
    // const timeToNextBusStop = getTimeToNextStop(
    //   { lat: 6.428334, lng: 3.429 },
    //   busStopsMap,
    //   1000
    // );
    // console.log({ timeToNextBusStop, busStopsMap });
    const payload = {
      title: "Bus Stop Alert🔔",
      body: `We are approaching ${gpsData?.busstopName} bus stop!`,
      url: "/",
      routeCode: selectedTracker?.routeCode,
    };

    if (gpsData.busStopFlag && gpsData.busstopName !== "non") {
      triggerPushNotification(payload);
      setLastBusStop(gpsData.busstopName);
      setSelectedTracker((prev) => ({
        ...prev,
        busSpeed: gpsData?.speed,
        busStopName: gpsData?.busstopName,
      })); // ensure it fires once per stop
    }

    // reset lastBusStop when flag goes false (so it can fire again next time)
    if (!gpsData.busStopFlag) {
      setLastBusStop(null);
    }
  }, [gpsData]);

  return (
    <Page style={{ height: "100%", width: "100%" }}>
      <div
        style={{
          position: "fixed",
          top: "5%",
          left: "2%",
          width: "100%",
          // padding: "10px",
          display: "flex",
          alignItems: "center",
          // background: "transparent",
          zIndex: 1000,
          justifyContent: "space-between",
        }}
      >
        <div className="compass-icon">
          <img src="/icons/compass.png" alt="" width="40" height="40" />
        </div>
        <motion.div
          whileTap={{ scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 10,
            bounce: 0.5,
          }}
          className="align-horizontally"
        >
          <Link
            round
            style={{
              background: "black",
              width: "40px",
              height: "40px",
              border: "2px solid white",
              display: "inline-flex", // makes it behave like a flex container
              alignItems: "center", // vertically centers the icon
              justifyContent: "center",
              padding: "0",
              borderRadius: "50%",
            }}
            href="/route-page/"
            routerDirection="back"
            color="white"
          >
            <Icon material="chevron_left" size={35}></Icon>
          </Link>
        </motion.div>

        <div
          style={{
            // marginTop: "2%",
            // transform: 'translateY(0%)',
            background: "rgba(255 255 255 / 0.5)",
            borderRadius: 20,
            width: "80%",
            maxWidth: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "8px 12px",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
          className="align-horizontally-space"
        >
          {selectedTracker?.routeCode}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1, // prevent zero or negative duration
              repeat: speed > 0 ? Infinity : 1,
              ease: "easeInOut",
            }}
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "8px",
            }}
            key={speed} // this forces remount when speed changes
          >
            <Icon ios="f7:arrow_right" md="f7:arrow_right" />
            <Icon material="airport_shuttle"></Icon>
          </motion.div>
          {speed > 0 ? "  Moving" : "Stop"} <span></span>
          <div
            style={{
              width: "2px", // thickness
              height: "1.8rem", // length
              backgroundColor: "black", // color
              display: "inline-block", // inline behavior
              margin: "0 10px", // optional spacing
            }}
          ></div>
          <Icon material="satellite_alt"></Icon>
          {deviceId}{" "}
          <NotificationDot
            color={
              status == true ? "var(--success-light)" : "var(--error-rose)"
            }
          />
        </div>
      </div>

      <MapComponent gpsLocation={currentLocation} busStops={busStopsMap} />

      <SwipeableFooter
        newSpeed={speed}
        totalStop={busStopsMap.length - 1}
        nextStop={
          getNextStop(
            {
              latitude: currentLocation[0],
              longitude: currentLocation[1],
            },
            busStopsMap
          )?.name || "Final destination"
        }
      />
    </Page>
  );
};

export default TrackMap;
