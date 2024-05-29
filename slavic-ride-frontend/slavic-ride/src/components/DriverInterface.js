import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import connect from './../services/webSocketService.js';
import RideRequestMenu from './RideRequestMenu'; // Import the RideRequestMenu component

const DriverInterface = () => {
    const locationLOL = useLocation();
    console.log('locationLOL:', locationLOL);

    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [showMenu, setShowMenu] = useState(false); // State to control menu visibility

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
        const fetchData = async () => {
            if (locationLOL && locationLOL.state && locationLOL.state.driverId) {
                const locationD = await getLocation();
                const stompClient = connect(
                    locationLOL.state.driverId,
                    (location_lat, location_lng, destination_lat, destination_lng) => {
                        setSource(locationD);
                        setDestination({lat: location_lat, lng: location_lng});
                        setShowMenu(true); // Show the menu when ride is requested
                    });

                return () => {
                    stompClient.disconnect();
                };
            }
        }

        fetchData();

    }, [locationLOL.state.driverId]);

    const handleLogout = () => {
        // Clear any stored state related to the driver
        localStorage.removeItem('driverId'); // Clear driverId from localStorage, if used
        navigate("/"); // Navigate to the login page
    }

    const handleTakePassenger = async () => {
        const response = await axios.get(`http://localhost:8080/drivers/${locationLOL.state.driverId}/order`);

        console.log(response.data.orderId);
        console.log(response.data.driverId);
        console.log(response.data.passengerId);
        console.log(response.data.destination);

        const cur_location = await getLocation();

        setSource(cur_location);
        setDestination(response.data.destination);
    }

    const handleFinishOrder = async () => {
        const response = await axios.get(`http://localhost:8080/drivers/${locationLOL.state.driverId}/order`);

        console.log(response.data.orderId);
        console.log(response.data.driverId);
        console.log(response.data.passengerId);
        console.log(response.data.destination);

        setSource(null);
        setDestination(null);

        await axios.put(`http://localhost:8080/drivers/${locationLOL.state.driverId}/finish-order`);
    }

    const handleAcceptRide = async () => {
        // Handle accepting the ride
        setShowMenu(false); // Hide the menu after accepting the ride
        // Send acceptance to the backend
        console.log("driver accepted the ride");
        await axios.post(`http://localhost:8080/notifications/driver-response`, {
            driverId: locationLOL.state.driverId,
            accepted: true
        });
    }

    const handleRejectRide = async () => {
        // Handle rejecting the ride
        setShowMenu(false); // Hide the menu after rejecting the ride
        // Send rejection to the backend
        console.log("driver rejected the ride");
        await axios.post(`http://localhost:8080/notifications/driver-response`, {
            driverId: locationLOL.state.driverId,
            accepted: false
        });
    }

    return (
        <div>
            <MapComponent userLocation={source} userDestination={destination} />
            {showMenu && (
                <RideRequestMenu
                    onAccept={handleAcceptRide}
                    onReject={handleRejectRide}
                />
            )}
            <button onClick={handleLogout}>Log out</button>
            <button onClick={handleTakePassenger}>Passenger taken</button>
            <button onClick={handleFinishOrder}>Finish order</button>
            {/*<ToastContainer />*/}
        </div>
    );
}

export default DriverInterface;
