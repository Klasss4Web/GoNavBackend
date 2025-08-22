import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Gauge, Icon } from "framework7-react";
import { useMqttGps } from "../js/mapComponent";
import "../css/app.css";
import { getTimeToNextStop } from "../utils/busStopDistance";
import { useGlobalContext } from "../context/globalContext";
const maxSpeed = 240;

const SwipeableFooter = ({ newSpeed, totalStop, nextStop }) => {
  const { selectedTracker } = useGlobalContext();

  const [isOpen, setIsOpen] = useState(false);
  const [speed, setSpeed] = useState(newSpeed || 0);
  const [speedPercent, setSpeedPercent] = useState(0);
  // const { gpsData } =  useState(0);    //useMqttGps();

  const constraintsRef = useRef(null);

  useEffect(() => {
    //  if (gpsData && typeof gpsData.speed !== 'undefined') {
    if (newSpeed) {
      setSpeed(newSpeed);

      setSpeedPercent(speed / maxSpeed);
      //  console.log('speed is ' + gpsData.speed);
    }
  }, [newSpeed]);

  return (
    <div
      ref={constraintsRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none", // container doesn't block
        zIndex: 1000,
      }}
    >
      <motion.div
        drag="y"
        dragConstraints={constraintsRef} // hard physical limit
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          // Snap to closest state
          if (info.offset.y > 50) setIsOpen(false);
          else if (info.offset.y < -50) setIsOpen(true);
          else setIsOpen(isOpen); // stay as is if small drag
        }}
        initial={{ y: "60%" }}
        animate={{ y: isOpen ? "0%" : "60%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          pointerEvents: "auto", // re-enable clicks for the drawer
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          backgroundImage:
            "linear-gradient(135deg, #0f0f0fda 0%, #302f31f6 100%)",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
          borderTop: "1px solid white",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          overflow: "hidden",
          padding: "5px 5px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Handle */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "40px",
            height: "5px",
            background: "#aaa",
            borderRadius: "3px",
            alignSelf: "center",
            cursor: "pointer",
          }}
        />

        {/* Footer Content */}
        <div
          style={{ position: "relative", top: "-120px", color: "white" }}
          className="align-vertically"
        >
          <div className="align-horizontally">
            <div className="grid grid-cols-3 ">
              <div className="small-block">
                <div style={{ width: "60%", height: "60%", marginTop: "2%" }}>
                  <Gauge
                    type="semicircle"
                    value={speed / 240}
                    valueText={speed > 0 ? Math.round(speed) : "0"}
                    valueTextColor="rgb(229, 231, 234)"
                    valueFontSize={47}
                    valueFontWeight={700}
                    borderWidth={8}
                    borderColor="#c2782d"
                    borderBgColor="transparent"
                  />
                </div>
                <span style={{ color: "gray" }}>Speed Km/hr</span>
              </div>
              <div className="small-block">
                <div className="align-horizontally-space">
                  <Icon material="transfer_within_a_station"></Icon>

                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "8px",
                    }}
                  >
                    <Icon ios="f7:arrow_right" md="f7:arrow_right" />
                  </motion.div>
                  <span
                    id="busStop"
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "500",
                      marginLeft: "10%",
                    }}
                  >
                    {" "}
                    {totalStop >= 0 ? totalStop : 0}
                  </span>
                </div>
                <span style={{ color: "gray", fontSize: "0.8rem" }}>
                  {" "}
                  Stops Left{" "}
                </span>
              </div>

              <div className="small-block">
                <span> {nextStop}</span>

                <span style={{ color: "gray", fontSize: "0.8rem" }}>
                  Next Stop
                </span>
              </div>
            </div>
          </div>

          <div
            className="align-horizontally"
            style={{ position: "absolute", top: "80px" }}
          >
            <div className="grid grid-cols-4 bus-details">
              {/* <div className="small-block"></div> */}
              <div className="small-block">
                <div className="arrow-box bus-plate">
                  {selectedTracker?.busType} {selectedTracker?.plateNumber}
                </div>
              </div>
              <div className="small-block">
                <img
                  src={
                    selectedTracker?.busType === "coaster"
                      ? "../assets/img/costerBus.png"
                      : "../assets/img/hiace.png"
                  }
                  style={{ width: "auto", height: "5rem", marginLeft: "50%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SwipeableFooter;
