import React, { useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

function MapComponent() {
    const apiKey = "AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs"; // Replace "YOUR_API_KEY_HERE" with your actual API key
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [reloadMap, setReloadMap] = useState(false);


    function handleLocationClick() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, handleError);
        } else {
            setError("Geolocation not supported");
        }
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        if (!isNaN(latitude) && !isNaN(longitude)) {
            setUserLocation({ lat: latitude, lng: longitude });
            setReloadMap(prev => !prev); // Toggle reloadMap state to trigger map reload
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        } else {
            setError("Invalid coordinates received");
        }
    }

    function handleError(error) {
        setError("Unable to retrieve your location");
        console.error(error);
    }

    return (
        <div>
            <APIProvider apiKey={apiKey}>
                <Map
                    key={reloadMap}
                    style={{ width: '100%', height: '700px' }}
                    defaultCenter={userLocation ? userLocation : { lat: 0, lng: 0 }}
                    defaultZoom={9}
                />
            </APIProvider>
            <button onClick={handleLocationClick}>Get Current Location</button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default MapComponent;
