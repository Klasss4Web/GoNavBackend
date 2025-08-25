import React, { useState } from 'react';
import {
  Popup,
  Page,
  Navbar,
  Block,
  Icon,
  Preloader
} from 'framework7-react';
import './bluetooth.css';
import '../../css/app.css';

import { motion } from "framer-motion";

const BluetoothPopup = ({ opened, onClose }) => {

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);

    // Simulate connection delay (replace with actual logic)
    setTimeout(() => {
      setIsConnecting(false);
    //   alert("Connected!"); // Or navigate to next page
    }, 3000);
  };










  return (
    <Popup
      push
      swipeToClose
      backdrop
      animate
      opened={opened}
      onPopupClosed={onClose}
      className="bluetooth-popup"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent:'flex-start'
        }}
       className='bluetooth-overlay'
       >
      
        <div
             className="link popup-close" 
          onClick={onClose}
            style={{
              width: "100px",
              height: "5px",
              marginTop: "10px",
              background: "#aaa",
              borderRadius: "3px",
              alignSelf: "center",
              cursor: "pointer",
              marginRight: "auto",
              marginLeft: "auto"

            }}
          />








            
         {/* Footer Section */}
   <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        textAlign: "center",
        padding: "20px 0",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
      }}
      className="align-vertically"
    >

<div style={{
  height: '1px',
  backgroundColor: '#ccc',
  width: '80%',
  margin: '20px 0',
  position:'fixed',
  bottom:'30%'
}}>
</div>
     
      {isConnecting ? (
        // Loader View
        <div style={{ opacity: 0.8 }}>
          <Preloader size="50px" color="#FFD60A" />
          <p style={{ fontSize: "0.9rem", marginTop: "40%" }}>
            Connecting to host...
          </p>
        </div>
      ) : (
        // Bluetooth + Instructions View
        <>
          {/* Instructions */}
          <div style={{ opacity: 0.7 }}>
            <span style={{ fontSize: "0.98rem", fontWeight: "500", marginBottom: "1.2spanx" }}>
              Tap to connect your device
            </span>
            <p style={{ fontSize: "0.8rem", opacity: 0.6, lineHeight: "1.4" }}>
              Connect your device to track the bus<br />
              location
            </p>
          </div>

          {/* Bluetooth Icons */}
          <div style={{ marginBottom: "10px", opacity: 0.9 }} className="align-horizontally-space">
            <Icon f7="device_phone_portrait" size={60}></Icon>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "flex", alignItems: "center", marginRight: "8px" }}
            >
              <Icon material="bluetooth_searching" size={30}></Icon>
            </motion.div>
            <Icon material="bluetooth_drive" size={60}></Icon>
          </div>

          {/* Connect Button */}
           <motion.div
                              whileTap={{ translateY: 2.9 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 10,
                                bounce: 0.5,
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                              }}
                              className="align-horizontally"
                            >
          <button
            style={{
              width: "50%",
              height: "30px",
              backgroundColor: "#FFD60A",
              color: "#000",
              border: "none",
              borderRadius: "28px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={handleConnect}
          >
            Connect as Host
          </button>
          </motion.div>
        </>
      )}
    </div>


       </div>
      
    </Popup>
  );
};

export default BluetoothPopup;
