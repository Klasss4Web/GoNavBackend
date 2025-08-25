import { createContext, useContext, useState, useEffect } from 'react';
import mqtt from 'mqtt';

const GlobalContext = createContext();

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
    reschedulePings: false,    // Disable worker-based ping
    keepalive: 0,              // Disable keepalive worker
  },
};

export const GlobalProvider = ({ children }) => {
  // Hydrate from LocalStorage on mount
  const [selectedTracker, setSelectedTracker] = useState(() => {
    const saved = localStorage.getItem('selectedTracker');
    return saved ? JSON.parse(saved) : null;
  });

  const [mqttClient, setMqttClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Sync LocalStorage whenever selectedTracker changes
  useEffect(() => {
    if (selectedTracker) {
      localStorage.setItem('selectedTracker', JSON.stringify(selectedTracker));
    } else {
      localStorage.removeItem('selectedTracker');
    }
  }, [selectedTracker]);






  // MQTT connection setup
  useEffect(() => {
    const client = mqtt.connect(mqttConfig.brokerUrl, {
      ...mqttConfig.clientOptions,
      username: mqttConfig.username,
      password: mqttConfig.password,
    });

    client.on('connect', () => {
      console.log('✅ Connected to MQTT broker');
      setIsConnected(true);
    });

    client.on('error', (err) => {
      console.error('❌ MQTT Connection error:', err);
      client.end();
    });

    client.on('close', () => {
      console.log('⚠️ Disconnected from MQTT broker');
      setIsConnected(false);
    });

    setMqttClient(client);

    return () => {
      client.end();
    };
  }, []);

  return (
    <GlobalContext.Provider value={{
      selectedTracker,
      setSelectedTracker,
      mqttClient,
      isConnected
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
