import React, { useState } from 'react';
import { getDevice } from 'framework7/lite-bundle';
import {
  f7,
  f7ready,
  App,
  View
} from 'framework7-react';

import capacitorApp from '../js/capacitor-app';
import routes from '../js/routes';
import store from '../js/store';
import { GlobalProvider } from '../context/globalContext'; 

const MyApp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const device = getDevice();

  const f7params = {
    name: 'GoNavApp',
    theme: 'auto',
    store: store,
    routes: routes,
    serviceWorker: process.env.NODE_ENV === 'production' ? {
      path: '/service-worker.js',
    } : {},
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };

  f7ready(() => {
    if (f7.device.capacitor) {
      capacitorApp.init(f7);
    }
  });

  return (
    // <GpsProvider> 
     <GlobalProvider> 
      <App {...f7params}>
        <View main className="safe-areas" url="/" />
      </App>
      </GlobalProvider>
  
  );
};

export default MyApp;
