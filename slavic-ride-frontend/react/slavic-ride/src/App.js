import React from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey="AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs">
    <Map
      style={{width: '100%', height: '100%'}}
      defaultCenter={{lat: 22.54992, lng: 0}}
      zoom={9}
      // gestureHandling={'greedy'}
      // disableDefaultUI={true}
    />
  </APIProvider>
);

export default App;