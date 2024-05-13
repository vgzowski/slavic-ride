import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import axios from "axios";
import { useLocation } from 'react-router-dom';

const DriverInterface = () => {
    const locationLOL = useLocation();

    useEffect(() => {
        sendLocation();
    }, []);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        resolve(location);
                    },
                    error => {
                        console.error('Error getting location:', error);
                        reject(error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                reject('Geolocation not supported');
            }
        });
    }

    const sendLocation = async () => {
        setInterval(async () => {
            try {
                const location = await getLocation();
                if (location && locationLOL.state.driverId) {
                    const requestBody = {
                        "location": {
                            "lat": location.lat,
                            "lng": location.lng
                        },
                        "id": {
                            "id": locationLOL.state.driverId
                        }};
                    await axios.put(`http://localhost:8080/drivers/${locationLOL.state.driverId}/location`, requestBody);
                    console.log(`Location successfully sent to server: ${location}, ${locationLOL.state.driverId}`);
                }
                else {
                    if (!location) {
                        console.log('No location');
                    }
                    if (!locationLOL.state.driverId) {
                        console.log('No driver id');
                    }
                }
            } catch (error) {
                console.log('Something went wrong in sending location...', error);
            }
        }, 5000);

    }
    
    return (
        <div>
            <MapComponent />
        </div>
    );
}

export default DriverInterface;
