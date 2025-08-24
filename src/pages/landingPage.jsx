import { Page, Icon, Link } from "framework7-react";
import { motion } from "framer-motion";
import "../css/app.css";
import "../css/landingPage.css";

const LandingPage = () => {
  return (
    <Page name="langingPage" className="landing-content">
      <div className="overlay">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: -40 }}
          transition={{ duration: 1 }}
          style={{ marginTop: "0%" }}
          className="align-vertically"
        >
          <img src="../assets/img/gonav.png" alt="App Logo" style={{ height: "18%", width: "auto", opacity: "90%" }} />

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
              //  onClick={goToRoutePage}
              style={{
                padding: "10px",
                background: "#FFF",
                borderRadius: "10px",
              }}
              href="/route-page/"
            >
              {/* Animated arrow */}
              <h2 style={{ margin: 0 }}>Select Route</h2>
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
