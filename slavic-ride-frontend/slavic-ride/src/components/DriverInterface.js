import React, { useEffect, useRef, useState } from 'react';
import MapComponent from './MapComponent';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from './../services/webSocketService.js';
import RideRequestMenu from './RideRequestMenu';
import RideRequestNotification from "./RideRequestNotification";
import RatingComponent from './RatingComponent.js';
import "../css/DriverInterface.css";

const DriverInterface = () => {
    const location_properties = useLocation();
    // console.log('location_properties:', location_properties);

    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [route, setRoute] = useState(null);
    const [passengerTaken, setPassengerTaken] = useState(false);
    const [hasOrderState, setHasOrderState] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [ratingMenuActive, setRatingMenuActive] = useState(false);

    console.log(source);

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
                // const location = await getLocation();
                // if (location && location_properties?.state?.driverId) {
                //     const requestBody = {
                //         location: {
                //             lat: location.lat,
                //             lng: location.lng
                //         },
                //         id: {
                //             id: location_properties.state.driverId
                //         }
                //     };
                //     await axios.put(`http://localhost:8080/drivers/${location_properties.state.driverId}/location`, requestBody);
                //     console.log(`Location successfully sent to server: ${location}, ${location_properties.state.driverId}`);
                // } else {
                //     if (!location) console.log('No location');
                //     if (!location_properties?.state?.driverId) console.log('No driver id');
                // }
            } catch (error) {
                console.log('Something went wrong in sending location...', error);
            }
        }, 1000);
    }

    const fetchLocationFromDatabase = async () => {
        const response = await axios.get(`http://localhost:8080/drivers/${location_properties.state.driverId}/get-location`);
        setSource(response.data);
        console.log("Obtained location for driver ", location_properties.state.driverId, " from database: ", response.data);
    }

    useEffect(() => {
        let intervalIdd = setInterval(fetchLocationFromDatabase, 1000);
        return () => clearInterval(intervalIdd);
    }, [])


    useEffect(() => {
        const fetchData = async () => {
            if (location_properties?.state?.driverId) {
                if (!stompClientRef.current) {
                    // const locationD = await getLocation();
                    stompClientRef.current = connect(
                        location_properties.state.driverId,
                        (location_lat, location_lng, destination_lat, destination_lng) => {
                        },
                        (location_lat, location_lng, destination_lat, destination_lng, order_id) => {
                            setSource(source);
                            setDestination({ lat: location_lat, lng: location_lng });
                            console.log("Starting order: ", orderId);
                            setOrderId(order_id);
                        },
                        () => {
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
        setSource('');
        setDestination('');
        setPassengerTaken(false);
        setRatingMenuActive(true);
        sendLocation();
        await fetchOrder();
    }

    const hasOrder = async () => {
        console.log("Checking for order...")
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
        // Check if the session is already activated
        const sessionActivated = sessionStorage.getItem('driverSessionActivated' + location_properties.state.driverId);

        if (!sessionActivated) {
            // Increment active session count if the session is not already activated
            axios.post(`http://localhost:8080/drivers/${location_properties.state.driverId}/activate`);
            console.log('Session activated');
            // Set flag to indicate session activation
            sessionStorage.setItem('driverSessionActivated' + location_properties.state.driverId, 'true');
        }


        return () => {
            // Only deactivate the session when leaving the DriverInterface page if not navigating to the Sidebar
            const nextPage = window.location.pathname;
            if (nextPage !== '/sidebar') {
                // Decrement active session count on logout or page close
                axios.post(`http://localhost:8080/drivers/${location_properties.state.driverId}/deactivate`);
                console.log('Session deactivated');
                // Remove flag indicating session activation
                sessionStorage.removeItem('driverSessionActivated' + location_properties.state.driverId);
            }
        };
    }, []);

    useEffect(() => {
        fetchOrder();
    }, [location_properties.state.driverId, location_properties.state.source, location_properties.state.destination]);

    useEffect(() => {
        console.log("hasOrderState changed:", hasOrderState);
    }, [hasOrderState]);

    const handleSidebar = () => {
        if (hasOrderState !== false) {
            alert("Look at the road! Behave yourself!");
            return;
        }
        navigate("/sidebar", { state: { who: 'driver', id: location_properties.state.driverId } });
    }

    const handleRate = async (rating) => {
        console.log("Order ", orderId, " rated with ", rating);
        await axios.post('http://localhost:8080/rating/ratePassenger', { orderId: orderId, rating: rating });
        setRatingMenuActive(false);
    };



    return (
        <div className="driver-interface">
            <RideRequestNotification driverId={location_properties.state.driverId} />

            <div className="driver-map-container">
                <MapComponent
                    userLocation={source}
                    userDestination={hasOrderState ? destination : ""}
                    route={route}
                    fetchable={false}
            />
                <div className="driver-ride-info">
                    {/* The ride information will be placed here */}
                </div>
            </div>

            <div className="driver-buttons-container">
                {(hasOrderState && !passengerTaken) && <button onClick={handleTakePassenger}>Passenger taken</button>}
                {(hasOrderState && passengerTaken) && <button onClick={handleFinishOrder}>Finish order</button>}
                <button onClick={handleSidebar}>Sidebar</button>
                <button onClick={handleLogout}>Log out</button>
            </div>

            {ratingMenuActive && (
                <div className="driver-rating-menu">
                    <RatingComponent onRate={handleRate} orderId={orderId} />
                </div>
            )}
        </div>
    );

}

export default DriverInterface;
