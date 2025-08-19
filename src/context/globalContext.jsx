// src/context/GlobalContext.jsx
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [selectedTracker, setSelectedTracker] = useState(null);

  return (
    <GlobalContext.Provider value={{ selectedTracker, setSelectedTracker }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
