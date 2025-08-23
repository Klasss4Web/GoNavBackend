import { useEffect, useRef, useState } from "react";
import "./notificationToast.css";

export const NotificationAlert = ({ show, onClose, title, message, icon }) => {
  const [visible, setVisible] = useState(false);
  const [startX, setStartX] = useState(null);
  const toastRef = useRef(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;

    // Move toast horizontally
    if (toastRef.current) {
      toastRef.current.style.transform = `translateX(${diffX}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    // If swipe is large enough → dismiss
    if (Math.abs(diffX) > 100) {
      if (toastRef.current) {
        toastRef.current.style.transition =
          "transform 0.3s ease-out, opacity 0.3s";
        toastRef.current.style.transform = `translateX(${
          diffX > 0 ? "100%" : "-100%"
        })`;
        toastRef.current.style.opacity = "0";
      }
      setTimeout(() => setWaitingWorker(null), 300);
    } else {
      // Reset position if swipe not enough
      if (toastRef.current) {
        toastRef.current.style.transition = "transform 0.3s ease";
        toastRef.current.style.transform = "translateX(0)";
      }
    }
    setStartX(null);
  };

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`toast ${visible ? "show" : ""}`}
      ref={toastRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {icon && <img src={icon} alt="icon" />}
      <div className="toast-content">
        <div className="toast-title">🔔 {title}</div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
};
