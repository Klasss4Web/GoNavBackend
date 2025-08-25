import { Page, Icon, Link } from "framework7-react";
import { motion } from "framer-motion";
import { useGlobalContext } from "../context/globalContext.jsx"; // use context if you want reactive updates
import { isSelectedTrackerValid } from "../js/mapComponent";
import "../css/app.css";
import "../css/landingPage.css";

const LandingPage = () => {
  const { selectedTracker } = useGlobalContext();

  // Check if tracker exists in context or LocalStorage
  const hasTracker = selectedTracker || isSelectedTrackerValid();

  // Dynamic text and href
  const linkText = hasTracker ? "Start Tracking" : "Select Route";
  const linkHref = hasTracker ? "/track-map/" : "/route-page/";

  return (
    <Page name="landingPage" className="landing-content">
      <div className="overlay">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: -40 }}
          transition={{ duration: 1 }}
          style={{ marginTop: "0%" }}
          className="align-vertically"
        >
          <img
            src="../assets/img/gonav.png"
            alt="App Logo"
            style={{ height: "18%", width: "auto", opacity: "90%" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1>Smart Bus Tracker</h1>
            <p>Navigate with Swag</p>
          </motion.div>

          <motion.div whileTap={{ scale: 0.9 }} className="align-horizontally">
            <Link
              animate={true}
              ignoreCache={true}
              style={{
                padding: "10px",
                background: "#FFF",
                borderRadius: "10px",
              }}
              href={linkHref} // dynamically choose target page
            >
              <h2 style={{ margin: 0 }}>{linkText}</h2> {/* dynamic text */}
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
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Page>
  );
};

export default LandingPage;
