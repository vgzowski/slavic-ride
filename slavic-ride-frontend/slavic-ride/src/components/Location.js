import React, { useState } from 'react';

function Location () {
    const [location, setLocation] = useState(null);

    function handleLocationClick () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }
        else {
            console.log("Geolocation not supported");
        }
    }

    function error () {
        console.log("Unable to retrieve your location");
    }

    function success (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({latitude, longitude});
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    return location;
}

export default Location;