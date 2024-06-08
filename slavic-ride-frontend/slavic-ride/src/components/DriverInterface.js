import React, { useEffect, useRef, useState } from 'react';
import MapComponent from './MapComponent';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import connect from './../services/webSocketService.js';
import RideRequestMenu from './RideRequestMenu';

const DriverInterface = () => {
    const location_properties = useLocation();
    console.log('location_properties:', location_properties);

    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showMenu, setShowMenu] = useState(false); // State to control menu visibility
    const [route, setRoute] = useState(null); // State to hold the route information
    const [passengerTaken, setPassengerTaken] = useState(false);
    const [hasOrderState, setHasOrderState] = useState(false);

    const navigate = useNavigate();

    // Use ref to ensure WebSocket connection is managed properly
    const stompClientRef = useRef(null);

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
                if (location && location_properties && location_properties.state && location_properties.state.driverId) {
                    const requestBody = {
                        "location": {
                            "lat": location.lat,
                            "lng": location.lng
                        },
                        "id": {
                            "id": location_properties.state.driverId
                        }
                    };
                    await axios.put(`http://localhost:8080/drivers/${location_properties.state.driverId}/location`, requestBody);
                    console.log(`Location successfully sent to server: ${location}, ${location_properties.state.driverId}`);
                } else {
                    if (!location) {
                        console.log('No location');
                    }
                    if (!location_properties || !location_properties.state || !location_properties.state.driverId) {
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
            if (location_properties && location_properties.state && location_properties.state.driverId) {
                if (!stompClientRef.current) {
                    const locationD = await getLocation();
                    stompClientRef.current = connect(
                        location_properties.state.driverId,
                        (location_lat, location_lng, destination_lat, destination_lng) => {
                            setShowMenu(true); // Show the menu when ride is requested
                        },
                        (location_lat, location_lng, destination_lat, destination_lng) => {
                            setSource(locationD);
                            setDestination({lat: location_lat, lng: location_lng});
                            // setRoute({
                            //     source: { lat: parseFloat(location_lat), lng: parseFloat(location_lng) },
                            //     destination: { lat: parseFloat(destination_lat), lng: parseFloat(destination_lng) }
                            // });
                        }
                    );
                }
            }
        }

        fetchData();

        // Cleanup function to disconnect the WebSocket when the component unmounts
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
                stompClientRef.current = null;
            }
        };

    }, [location_properties.state.driverId]);

    const handleLogout = async () => {
        // Clear any stored state related to the driver
        localStorage.removeItem('driverId'); // Clear driverId from localStorage, if used
        navigate("/"); // Navigate to the login page
        await axios.put(`http://localhost:8080/auth/deactivate`, {
            "id": location_properties.state.driverId,
            "username": location_properties.state.username
        });
    }

    const handleTakePassenger = async () => {
        const response = await axios.get(`http://localhost:8080/drivers/${location_properties.state.driverId}/order`);

        const cur_location = await getLocation();
        setSource(cur_location);
        setDestination(response.data.destination);
        setPassengerTaken(true);

        await fetchOrder(); // Ensure fetchOrder is awaited
    }

    const handleFinishOrder = async () => {
        const response = await axios.get(`http://localhost:8080/drivers/${location_properties.state.driverId}/order`);

        setSource(null);
        setDestination(null);
        setPassengerTaken(false);

        await axios.put(`http://localhost:8080/drivers/${location_properties.state.driverId}/finish-order`);

        await fetchOrder(); // Ensure fetchOrder is awaited
    }

    const handleAcceptRide = async () => {
        try {
            setShowMenu(false); // Hide the menu after accepting the ride
            await axios.post(`http://localhost:8080/notifications/driver-response`, {
                driverId: location_properties.state.driverId,
                accepted: true
            });
            console.log('The driver accepted the ride.');
        } catch (error) {
            console.error('Error accepting ride:', error);
        } finally {
            await fetchOrder(); // Ensure fetchOrder is awaited
        }
    }

    const handleRejectRide = async () => {
        setShowMenu(false); // Hide the menu after rejecting the ride
        await axios.post(`http://localhost:8080/notifications/driver-response`, {
            driverId: location_properties.state.driverId,
            accepted: false
        });
        await fetchOrder(); // Ensure fetchOrder is awaited
        console.log('The driver rejected the ride.')
    }

    const hasOrder = async () => {
        console.log("Passenger taken for ", location_properties.state.driverId, ": ", passengerTaken);
        try {
            const response = await axios.get(`http://localhost:8080/drivers/${location_properties.state.driverId}/get-order`);
            console.log("huihuihui:", response, response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching order:", error);
            return false;
        }
    }

    const fetchOrder = async () => {
        const orderStatus = await hasOrder();
        console.log("Order status fetched:", orderStatus); // Debug log
        setHasOrderState(orderStatus);
    };

    useEffect(() => {
        fetchOrder();
    }, [location_properties.state.driverId]);

    useEffect(() => {
        console.log("hasOrderState changed:", hasOrderState); // Debug log
    }, [hasOrderState]);

    return (
        <div>
            <MapComponent userLocation={source} userDestination={destination} route={route} />
            {showMenu && (
                <RideRequestMenu
                    onAccept={handleAcceptRide}
                    onReject={handleRejectRide}
                />
            )}
            <button onClick={handleLogout}>Log out</button>
            {(hasOrderState === true) && (passengerTaken === false) && <button onClick={handleTakePassenger}>Passenger taken</button>}
            {(hasOrderState === true) && (passengerTaken === true) && <button onClick={handleFinishOrder}>Finish order</button>}
        </div>
    );
}

export default DriverInterface;
