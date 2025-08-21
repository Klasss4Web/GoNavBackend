function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const isAhead = (busLocation, stop, stops) => {
  const busLat = busLocation.lat || busLocation.latitude;
  const busLng = busLocation.lng || busLocation.longitude;
  const stopLat = stop.lat || stop.latitude;
  const stopLng = stop.lng || stop.longitude;
  const busIndex = stops.findIndex((s) => s.lat === busLat && s.lng === busLng);
  const stopIndex = stops.findIndex(
    (s) => s.lat === stopLat && s.lng === stopLng
  );

  // Check if the stop is ahead of the bus in the route
  return busIndex !== -1 && stopIndex !== -1 && stopIndex > busIndex;
};

function getNextStopAhead(busLocation, stops) {
  let closest = null;
  let closestDist = Infinity;

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];
    const dist = getDistance(
      busLocation.lat || busLocation.latitude,
      busLocation.lng || busLocation.longitude,
      stop.lat || stop.latitude,
      stop.lng || stop.longitude
    );

    // Only consider stops ahead
    if (dist < closestDist && isAhead(busLocation, stop, stops)) {
      closest = stop;
      closestDist = dist;
    }
  }
  return closest;
}

let lastPassedIndex = 0;

export const getNextStop = (busLocation, stops) => {
  for (let i = lastPassedIndex; i < stops?.length; i++) {
    const dist = getDistance(
      busLocation.lat || busLocation.latitude,
      busLocation.lng || busLocation.longitude,
      stops[i].lat || stops[i].latitude,
      stops[i].lng || stops[i].longitude
    );

    // If bus is within 100m of this stop, mark it as passed
    if (dist < 100) {
      lastPassedIndex = i;
    } else {
      return stops[i]; // this is the next ahead stop
    }
  }
  return null; // end of route
};

// const nextStop = getNextStop(busLocation, busStops);
// console.log("Next stop ahead:", nextStop?.name);

// speed = distance / time
// time = distance / speed;

const timeToNextStop = (busLocation, stops, speed) => {
  const nextStop = getNextStopAhead(busLocation, stops);
  console.log({ nextStop, speed, busLocation });
  if (!nextStop) return null;
  const distance = getDistance(
    busLocation.lat || busLocation.latitude,
    busLocation.lng || busLocation.longitude,
    nextStop.lat || nextStop.latitude,
    nextStop.lng || nextStop.longitude
  );
  if (speed <= 0) return null; // avoid division by zero
  const timeInSeconds = distance / speed; // speed in m/s
  return timeInSeconds;
};

export const getTimeToNextStop = (busLocation, stops, speed) => {
  const timeInSeconds = timeToNextStop(busLocation, stops, speed);
  if (timeInSeconds === null) return "N/A";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.round(timeInSeconds % 60);
  return `${minutes}m ${seconds}s`;
};
