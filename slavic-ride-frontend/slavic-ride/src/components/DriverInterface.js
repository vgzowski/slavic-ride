import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import axios from "axios";
import { Navigate, renderMatches, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import connect from './../services/webSocketService.js';

const DriverInterface = () => {
    const locationLOL = useLocation();
    console.log('locationLOL:', locationLOL);

    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        sendLocation();
        return () => {
            clearInterval(interval);
        }
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

    let interval;

    const sendLocation = async () => {
        interval = setInterval(async () => {
            try {
                const location = await getLocation();
                if (location && locationLOL && locationLOL.state && locationLOL.state.driverId) {
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
                } else {
                    if (!location) {
                        console.log('No location');
                    }
                    if (!locationLOL || !locationLOL.state || !locationLOL.state.driverId) {
                        console.log('No driver id');
                    }
                }
            } catch (error) {
                console.log('Something went wrong in sending location...', error);
            }
        }, 5000);
    }


    useEffect(() => {
        if (locationLOL && locationLOL.state && locationLOL.state.driverId) {
            const stompClient = connect(
                locationLOL.state.driverId,
                (location_lat, location_lng, destination_lat, destination_lng) => {
                    setSource({lat: location_lat, lng: location_lng});
                    setDestination({lat: destination_lat, lng: destination_lng});
                });

            return () => {
                stompClient.disconnect();
            };
        }
    }, [locationLOL.state.driverId]);

    const handleLogout = () => {
        // Clear any stored state related to the driver
        localStorage.removeItem('driverId'); // Clear driverId from localStorage, if used
        navigate("/"); // Navigate to the login page
    }
    
    
    return (
        <div>
            <MapComponent userLocation={source} userDestination={destination} />
            <button onClick = {handleLogout}>Log out</button>
            <ToastContainer />
        </div>
    );
}

export default DriverInterface;
