import "../css/skeleton.css";

export const Skeleton = ({ width, height, isCircle }) => {
  const classes = ["skeleton-box"];
  if (isCircle) {
    classes.push("skeleton-circle");
  }

  return <div className={classes.join(" ")} style={{ width, height }} />;
};

export const CardSkeleton = ({ count }) => {
  return (
    <>
      {[...Array(count)].map((_, c) => (
        <div key={c} style={{ display: "flex", width: "100%" }}>
          {/* <Skeleton width="48px" height="48px" /> */}
          <div
            style={{
              width: "100%",
              //   marginLeft: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Skeleton width="100%" height="10px" />
            <Skeleton width="100%" height="10px" />
          </div>
        </div>
      ))}
    </>
  );
};
