export const compareTime = () => {
  const now = new Date();

  // Create a Date object for 5:30 PM today
  const target = new Date();
  target.setHours(10, 30, 0, 0); // 10 = 10 AM, 30 minutes, 0 seconds, 0 ms
  let time;
  if (now < target) {
    console.log("⏳ It's before 5:30 PM");
    time = "morning";
  } else if (now > target) {
    let time = "evening";
    console.log("✅ It's after 5:30 PM");
  } else {
    console.log("🕠 It's exactly 5:30 PM!");
  }
};
