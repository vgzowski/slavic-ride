import React, { useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

function MapComponent() {
    const apiKey = "AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs";
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
            setReloadMap(prev => !prev);
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        } else {
            setError("Invalid coordinates received");
        }
    }

    function handleError(error) {
        setError("Unable to retrieve your location");
        console.error(error);
    }

    function handleMarkerDragEnd(event) {
        const { latLng } = event;
        const newLocation = {
            lat: latLng.lat(),
            lng: latLng.lng()
        };
        setUserLocation(newLocation);
        console.log("New Marker Position:", newLocation);
    }

    return (
        <div>
            <APIProvider apiKey={apiKey}>
                <Map
                    key={reloadMap}
                    style={{ width: '100%', height: '700px' }}
                    defaultCenter={userLocation ? userLocation : { lat: 0, lng: 0 }}
                    defaultZoom={15}
                    mapTypeControl={false} 
                    streetViewControl={false} 
                    options={{
                        mapTypeId: 'blank',
                        mapTypeControl: false,
                        streetViewControl: false,
                    }}
>

                    {userLocation && (
                        <Marker
                            position={userLocation}
                            draggable={true}
                            onDragEnd={handleMarkerDragEnd}
                        />
                    )}

                </Map>
            </APIProvider>
            <button onClick={handleLocationClick}>Get Current Location</button>
            {error && <p>{error}</p>}
        </div>
    );
}

export default MapComponent;
