import mqtt from "mqtt";
// import * as mqtt from "mqtt/dist/mqtt.min.js"; // Sometimes works in CRA/Vite

import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
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



export const useMqttSubscription = (inputTopic) => {
  const { mqttClient, isConnected } = useGlobalContext();
  const [messages, setMessages] = useState({});
  const subscribedRef = useRef(new Set());
  const messageHandlerRef = useRef(null);

  // Normalize topics
  const topics = Array.isArray(inputTopic)
    ? inputTopic.filter(t => t && typeof t === 'string')
    : inputTopic && typeof inputTopic === 'string' ? [inputTopic] : [];

  // Main effect: subscribe to topics and attach message handler
  useEffect(() => {
    if (!mqttClient || !isConnected || topics.length === 0) return;

    const messageHandler = (topic, message) => {
      if (!topics.includes(topic)) return;
      try {
        const data = JSON.parse(message.toString());
        setMessages(prev => ({ ...prev, [topic]: data }));
      } catch (err) {
        setMessages(prev => ({ ...prev, [topic]: { error: 'Parse error', raw: message.toString() } }));
      }
    };

    messageHandlerRef.current = messageHandler;

    topics.forEach(topic => {
      if (!subscribedRef.current.has(topic)) {
        mqttClient.subscribe(topic, (err) => {
          if (!err) console.log(`✅ Subscribed to ${topic}`);
        });
        subscribedRef.current.add(topic);
      }
    });

    mqttClient.on('message', messageHandler);

    // Cleanup for this effect: remove listener only on re-run
    return () => {
      if (messageHandlerRef.current) mqttClient.off('message', messageHandlerRef.current);
    };
  }, [JSON.stringify(topics.sort()), mqttClient, isConnected]);

  // Separate effect: unsubscribe all topics on unmount
  useEffect(() => {
    return () => {
      subscribedRef.current.forEach(topic => {
        mqttClient.unsubscribe(topic, (err) => {
          if (!err) console.log(`🛑 Unsubscribed from ${topic}`);
        });
      });
    };
  }, [mqttClient]);

  return messages;
};

export const useMqttStatus = (trackerId) => {
  const statusTopic = `GoNaV/status/${trackerId}`;
  const message = useMqttSubscription(statusTopic);
  const status = message?.status === "online"; // boolean
  return status;
};
