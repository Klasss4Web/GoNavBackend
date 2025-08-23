import { useState } from "react";
import { motion } from "framer-motion";
import { Page, Button, Icon } from "framework7-react";

import "../css/app.css";
import "../css/routePage.css";
import { routeFetch } from "../js/mapComponent";
import NotificationDot from "../components/component.jsx";
import { CardSkeleton } from "../components/skeleton.jsx";
import TransportCard from "../components/reusableCard.jsx";

export let selectedRouteCode = "";

const RoutePage = () => {
  const { route, error, loading } = routeFetch(); // Call the hook
  const [searchTerm, setSearchTerm] = useState("");

  console.log({ route });

  const filteredRoutes = route.filter(
    (r) =>
      r?.route?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      r?.routeCode?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      r?.destination?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  console.log({ route });

  return (
    <Page>
      <div className="route-content">
        <div className="route-overlay">
          <div className="route-header">
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div
                style={{ width: "100%", marginTop: "3%" }}
                className="align-horizontally"
              >
                <Button
                  size="default"
                  shape="round"
                  style={{ color: "white" }}
                  href="/"
                  routerDirection="back"
                >
                  <Icon ios="f7:arrow_left" md="f7:arrow_left" />
                </Button>
                <h1
                  style={{
                    // transform: "translateX(0%)",
                    flex: 1,
                    fontWeight: "bold",
                    // textAlign: "center",
                    marginRight: "50px",
                  }}
                >
                  Bus Routes
                </h1>
              </div>

              <div
                style={{
                  background: "rgba(255 255 255 / 0.15)",
                  borderRadius: 20,
                  maxWidth: "60%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  padding: "8px 12px",
                  fontWeight: "400",
                  fontSize: "18px",
                }}
                className="align-horizontally"
              >
                {!loading && (
                  <>
                    <Icon material="alt_route"></Icon>
                    Available Routes{" "}
                    <b style={{ marginLeft: "5%" }}>{route.length}</b>
                  </>
                )}
                {loading && <div>Loading Routes...</div>}

                {/* <NotificationDot color="var(--success-emerald)" /> */}
              </div>
            </motion.div>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search for a route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div style={{ padding: "16px", width: "100%", marginTop: "10px" }}>
              {loading && <CardSkeleton count={10} />}
              {error && (
                <p className="error-paragraph">Oops Something went wrong!!!</p>
              )}
              {!error &&
                searchTerm &&
                filteredRoutes.length < 1 &&
                !loading && (
                  <p className="error-paragraph">
                    No route found for this search criteria
                  </p>
                )}
              {!error &&
                Array.isArray(route) &&
                filteredRoutes.map((route, index) => (
                  <TransportCard
                    key={index}
                    routeCode={route.routeCode}
                    routeName={route.route}
                    stops={route.stops - 1}
                    destination={route.destination}
                    trackerId={route.trackerId}
                    busType={route.bus}
                    plateNumber={route.plateNumber}
                    routeColor="#ef4444"
                    iconImageUrl="../assets/img/mark.png"
                  />
                ))}
              {/* <TransportCard
                routeCode="IPJ221"
                routeName="Ipaja - Interswitch"
                stops="12"
                status={false}
                routeColor="#ef4444"
                iconImageUrl="../assets/img/mark.png"
                onCardClick={(code) => {
                  console.log("Clicked route:", code);
                }}

              /> */}

              {/* <TransportCard
              routeName="Iyana-Ipaja"
              routeCode="LME-001"
              destination="Marina Terminal"
              distance="24.5"
              duration="45 min"
              iconBgColor="#ef4444"
              iconImageUrl="../assets/img/marker.png"
            /> */}
            </div>
          </motion.div>
        </div>
      </div>
    </Page>
  );
};

export default RoutePage;
