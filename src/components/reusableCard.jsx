import { motion } from "framer-motion";
import { Link, Icon } from "framework7-react";

import "../css/app.css";
import NotificationDot from "./component";
import { navigate } from "../utils/f7Utils";
import { useMqttSubscription } from "../js/mqttClient";
import { useGlobalContext } from "../context/globalContext";
import { pushNotificationSubscribeUser } from "../utils/pushNotification";

const TransportCard = ({
  routeName,
  routeCode,
  destination,
  stops,
  routeColor = "",
  trackerId,
  iconImageUrl,
  plateNumber,
  busType = "Bus",
}) => {
  const message = useMqttSubscription(`GoNaV/status/${trackerId}`);
  const status = message?.status === "online";
  const { setSelectedTracker } = useGlobalContext();
  const handleClick = () => {
    const selected = {
      routeName,
      trackerId,
      routeCode,
      busType,
      plateNumber,
      destination,
    };
    setSelectedTracker(selected); // ✅ store globally
    pushNotificationSubscribeUser(routeCode);
    navigate("/track-map/");
  };

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <div
        style={{
          borderRadius: "25px",
          margin: "5% auto",
          boxShadow: "0 4px 8px rgba(3, 18, 68, 0.64)",
          background: "white",
          width: "100%",
        }}
      >
        <Link noLinkClass routerDirection="forward" onClick={handleClick}>
          {/* <Block style={{ padding: '1%', borderRadius:"55px" }}> */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left side */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "left",
                width: "60%",
              }}
            >
              {iconImageUrl && (
                <motion.div
                  style={{
                    width: "20%",
                    height: "20%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <motion.img
                    src={iconImageUrl}
                    alt="icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}

              <div style={{ marginLeft: "0px" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.4rem",
                    color: routeColor,
                  }}
                >
                  {routeCode}
                </div>

                <div
                  style={{
                    marginBottom: "5%",
                    fontSize: "1rem",
                    color: "#70747dff",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Icon material="directions_bus"></Icon>
                  <span style={{ marginLeft: "0px", fontFamily: "" }}>
                    {routeName} - {destination}
                  </span>
                </div>

                <div
                  style={{
                    background: "#b8b9f52f",
                    borderRadius: "10px",
                    height: "3%",
                    // width: '60%',
                    padding: "1px",
                    textAlign: "center",
                    color: "#4b5563c3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    material="location_on"
                    style={{ color: "var(--f7-theme-color)" }}
                    size={20}
                  />
                  <div style={{ fontSize: "0.7rem", marginLeft: "5px" }}>
                    {stops} stops
                  </div>
                  <Icon
                    f7="arrow_right"
                    style={{ marginLeft: "10px" }}
                    size={"20"}
                  />
                </div>
              </div>
            </div>

            {/* Right side status */}
            <div
              style={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="../assets/img/routeImage.png"
                style={{ width: "4rem", height: "4rem", marginBottom: "1%" }}
                alt="Route"
              />
              <div
                style={{
                  fontSize: "90%",
                  color: "#6b7280",
                  marginBottom: "1%",
                }}
              >
                GPS <b>{trackerId} </b>Status
              </div>
              <div
                style={{
                  borderRadius: "10px",
                  width: "100%",
                  // padding: '4%',
                  textAlign: "center",
                  color:
                    status == true
                      ? "var(--success-light)"
                      : "var(--error-rose)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NotificationDot
                  color={
                    status == true
                      ? "var(--success-light)"
                      : "var(--error-rose)"
                  }
                />
                <span style={{ fontWeight: "bold" }}>
                  {status == true ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
          {/* </Block> */}
        </Link>
      </div>
    </motion.div>
  );
};

export default TransportCard;
