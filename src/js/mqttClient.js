import mqtt from "mqtt";
// import * as mqtt from "mqtt/dist/mqtt.min.js"; // Sometimes works in CRA/Vite

import React, { useEffect, useState } from "react";
// MQTT configuration object

const mqttConfig = {
  brokerUrl: "wss://obiot.duckdns.org:8084/",
  username: "BusTracker",
  password: "GoNavTracker#01",
  clientOptions: {
    clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
    clean: false,
    reconnectPeriod: 5000,
    connectTimeout: 3000,
    rejectUnauthorized: false, // Only for development!
    reschedulePings: false, // Disable worker-based ping
    keepalive: 0, // Disable keepalive worker
  },
};

let client = null;

export const connectToMqtt = () => {
  if (!client) {
    client = mqtt.connect(mqttConfig.brokerUrl, {
      ...mqttConfig.clientOptions,
      username: mqttConfig.username,
      password: mqttConfig.password,
    });

    client.on("connect", () => console.log("MQTT connected"));
    client.on("error", (err) => console.error("MQTT error:", err));
    client.on("close", () => console.log("MQTT connection closed"));
  }
  return client;
};

export const useMqttSubscription = (topic) => {
  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    if (!topic) return;

    const client = connectToMqtt(); // or getMqttClient() if singleton

    const messageHandler = (msgTopic, message) => {
      if (msgTopic !== topic) return; // only handle this topic
      try {
        const data = JSON.parse(message.toString());
        setMessageData(data);
      } catch (err) {
        console.error("MQTT parse error:", err);
      }
    };

    client.on("message", messageHandler);

    // Subscribe to the topic
    client.subscribe(topic, (err) => {
      if (err) console.error(`Subscribe error for ${topic}:`, err);
    });

    // Cleanup on unmount or topic change
    return () => {
      client.unsubscribe(topic, (err) => {
        if (err) console.error(`Unsubscribe error for ${topic}:`, err);
      });
      client.off("message", messageHandler);
      setMessageData(null);
    };
  }, [topic]);

  return messageData;
};

export const useMqttStatus = (trackerId) => {
  const statusTopic = `GoNaV/status/${trackerId}`;
  const message = useMqttSubscription(statusTopic);
  const status = message?.status === "online"; // boolean
  return status;
};
