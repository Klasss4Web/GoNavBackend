import React from "react";
import { motion } from "framer-motion";

// Props: color (string)
const NotificationDot = ({ color = "red" }) => {
  return (
    <motion.div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}55, 0 0 20px ${color}33, 0 0 30px ${color}22`,
        margin: 10,
      }}
      animate={{
        scale: [1, 1.4, 1],
        opacity: [1, 0.6, 1],
        boxShadow: [
          `0 0 10px ${color}55, 0 0 20px ${color}33, 0 0 30px ${color}22`,
          `0 0 20px ${color}88, 0 0 30px ${color}55, 0 0 40px ${color}33`,
          `0 0 10px ${color}55, 0 0 20px ${color}33, 0 0 30px ${color}22`,
        ],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default NotificationDot;
