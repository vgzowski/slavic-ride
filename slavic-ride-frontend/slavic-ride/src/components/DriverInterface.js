import React, { useEffect, useRef, useState } from 'react';
import MapComponent from './MapComponent';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from './../services/webSocketService.js';
import RideRequestMenu from './RideRequestMenu';

const DriverInterface = () => {
    const location_properties = useLocation();
    // console.log('location_properties:', location_properties);

    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [route, setRoute] = useState(null);
    const [passengerTaken, setPassengerTaken] = useState(false);
    const [hasOrderState, setHasOrderState] = useState(false);

    const navigate = useNavigate();
    const [rideRequestDetails, setRideRequestDetails] = useState(null);

    // Use ref to ensure WebSocket connection and interval are managed properly
    const stompClientRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        sendLocation();
        return () => {
            clearInterval(intervalRef.current);
        };
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
        intervalRef.current = setInterval(async () => {
            try {
                const location = await getLocation();
                if (location && location_properties?.state?.driverId) {
                    const requestBody = {
                        location: {
                            lat: location.lat,
                            lng: location.lng
                        },
                        id: {
                            id: location_properties.state.driverId
                        }
                    };
                    setSource(location);
                    await axios.put(`http://localhost:8080/drivers/${location_properties.state.driverId}/location`, requestBody);
                    console.log(`Location successfully sent to server: ${location}, ${location_properties.state.driverId}`);
                } else {
                    if (!location) console.log('No location');
                    if (!location_properties?.state?.driverId) console.log('No driver id');
                }
            } catch (error) {
                console.log('Something went wrong in sending location...', error);
            }
        }, 5000);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (location_properties?.state?.driverId) {
                if (!stompClientRef.current) {
                    const locationD = await getLocation();
                    stompClientRef.current = connect(
                        location_properties.state.driverId,
                        (location_lat, location_lng, destination_lat, destination_lng) => {
                            setShowMenu(true);
                            const calc_source = { lat: location_lat, lng: location_lng };
                            const calc_destination = { lat: destination_lat, lng: destination_lng };
                            setRideRequestDetails({
                                source: calc_source,
                                destination: calc_destination,
                            });
                        },
                        (location_lat, location_lng, destination_lat, destination_lng) => {
                            setSource(locationD);
                            setDestination({ lat: location_lat, lng: location_lng });
                        },
                        () => {
                            setShowMenu(false);
                        }
                    );
                }
            }
        }

        fetchData();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
                stompClientRef.current = null;
            }
        };
    }, [location_properties.state.driverId]);

    const handleLogout = async () => {
        localStorage.removeItem('driverId');
        navigate("/");
        await axios.put(`http://localhost:8080/auth/deactivate`, {
            id: location_properties.state.driverId,
            username: location_properties.state.username
        });
    }

    const handleTakePassenger = async () => {
        const response = await axios.get(`http://localhost:8080/drivers/${location_properties.state.driverId}/order`);
        await axios.post(`http://localhost:8080/notifications/take-passenger`, { passenger_id: response.data.passengerId });
        const cur_location = await getLocation();
        setSource(cur_location);
        setDestination(response.data.destination);
        setPassengerTaken(true);
        await fetchOrder();
    }

    const handleFinishOrder = async () => {
        const response = await axios.put(`http://localhost:8080/drivers/${location_properties.state.driverId}/finish-order`);

        console.log("Response for finishing order and rating obtaining: ", response);

        await axios.post(`http://localhost:8080/notifications/finish-order-passenger`, response.data);
        setSource(null);
        setDestination(null);
        setPassengerTaken(false);
        sendLocation();
        await fetchOrder();
    }

    const handleAcceptRide = async () => {
        try {
            setShowMenu(false);
            await axios.post(`http://localhost:8080/notifications/driver-response`, {
                driverId: location_properties.state.driverId,
                accepted: true
            });
        } catch (error) {
            console.error('Error accepting ride:', error);
        } finally {
            await fetchOrder();
        }
    };    

    const handleRejectRide = async () => {
        setShowMenu(false);
        await axios.post(`http://localhost:8080/notifications/driver-response`, {
            driverId: location_properties.state.driverId,
            accepted: false
        });
        await fetchOrder();
    }

    const hasOrder = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/drivers/${location_properties.state.driverId}/get-order`);
            return response.data;
        } catch (error) {
            console.error("Error fetching order:", error);
            return false;
        }
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchOrder = async () => {
        let orderStatus = await hasOrder();
        let retries = 5;
        const delayTime = 50;

        while (!orderStatus && retries > 0) {
            await delay(delayTime);
            orderStatus = await hasOrder();
            retries--;
        }

        setHasOrderState(orderStatus);
    };

    useEffect(() => {
        fetchOrder();
    }, [location_properties.state.driverId]);

    useEffect(() => {
        console.log("hasOrderState changed:", hasOrderState);
    }, [hasOrderState]);

    const handleSidebar = () => {
        navigate("/sidebar", { state: { who: 'driver', id: location_properties.state.driverId } });
    }

    return (
        <div>
            <MapComponent
                userLocation={source}
                userDestination={destination}
                route={route}
            />

            {showMenu && (
                <RideRequestMenu
                    onAccept={handleAcceptRide}
                    onReject={handleRejectRide}
                    source={rideRequestDetails?.source}
                    destination={rideRequestDetails?.destination}
                />
            )}
            <button onClick={handleLogout}>Log out</button>
            {(hasOrderState && !passengerTaken) && <button onClick={handleTakePassenger}>Passenger taken</button>}
            {(hasOrderState && passengerTaken) && <button onClick={handleFinishOrder}>Finish order</button>}
            <button onClick={handleSidebar}>Sidebar</button>
        </div>
    );
}

export default DriverInterface;
