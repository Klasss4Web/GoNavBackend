import { useState } from "react";

export const useBluetooth = () => {
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [error, setError] = useState(null);

  // Request device from user
  const requestDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // or use filters for specific devices
        optionalServices: ["battery_service"], // services you want
      });

      setDevice(device);

      // Connect to GATT server
      const server = await device.gatt.connect();
      setServer(server);

      console.log("Connected to:", device.name);
    } catch (err) {
      console.error("Bluetooth error:", err);
      setError(err);
    }
  };

  // Read battery level example
  const readBatteryLevel = async () => {
    if (!server) return;

    const service = await server.getPrimaryService("battery_service");
    const characteristic = await service.getCharacteristic("battery_level");
    const value = await characteristic.readValue();
    const batteryLevel = value.getUint8(0);

    console.log(`Battery level: ${batteryLevel}%`);
    return batteryLevel;
  };

  return {
    device,
    server,
    error,
    requestDevice,
    readBatteryLevel,
  };
};
