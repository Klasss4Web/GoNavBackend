export function CompassControl({ heading }) {
  return (
    <div
      src="'/icons/compass.png'"
      style={{
        position: "absolute",
        top: "0px",
        right: "0px",
        width: "60px",
        height: "60px",
        backgroundImage: "url('/icons/compass.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        transform: `rotate(${heading}deg)`,
        zIndex: 1000,
        pointerEvents: "none", // don’t block map drag
      }}
    />
  );
}
