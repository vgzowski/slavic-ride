import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GeolocationComponent() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);

  const apiKey = 'AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs';

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`);
        setLocation({
          lat: response.data.location.lat,
          lng: response.data.location.lng,
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchLocation();
  }, []);
}

export default GeolocationComponent;
