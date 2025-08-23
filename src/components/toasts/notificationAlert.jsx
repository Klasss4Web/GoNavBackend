import { useEffect, useState } from "react";
import "./notificationToast.css";

export const NotificationAlert = ({ show, onClose, title, message, icon }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`toast ${visible ? "show" : ""}`}>
      {icon && <img src={icon} alt="icon" />}
      <div className="toast-content">
        <div className="toast-title">🔔 {title}</div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
};
