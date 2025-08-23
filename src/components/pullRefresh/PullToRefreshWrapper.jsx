import { useState, useEffect, useRef } from "react";

export default function PullToRefreshWrapper({ children }) {
  const [pulling, setPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const onTouchStart = (e) => {
      if (container?.scrollTop === 0) {
        setStartY(e?.touches?.[0]?.clientY);
      }
    };

    const onTouchMove = (e) => {
      if (startY && e?.touches?.[0]?.clientY - startY > 60) {
        setPulling(true);
      }
    };

    const onTouchEnd = () => {
      if (pulling) {
        window.location.reload(); // refresh PWA
      }
      setPulling(false);
      setStartY(0);
    };

    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove);
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [pulling, startY]);

  return (
    <div ref={containerRef} style={{ overflowY: "auto", height: "100vh" }}>
      {children}
    </div>
  );
}
