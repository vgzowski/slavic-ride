import React, { useEffect, useRef, useState } from 'react';
import MapComponent from './MapComponent';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AutocompleteInput from "./AutocompleteInput";
import { connectPassenger } from '../services/webSocketService';
import RatingComponent from './RatingComponent';
import "../css/UserInterface.css"

const UserInterface = () => {
    const location = useLocation();
    const [source, setSource] = useState(sessionStorage.getItem('location') ? JSON.parse(sessionStorage.getItem('location')) : '');
    const [destination, setDestination] = useState('');
    const [lookingForDriver, setLookingForDriver] = useState(false);
    const [rideType, setRideType] = useState('usual'); // State to store the user's chosen ride type
    const [RideStatus, setRideStatus] = useState(0);
    // 0 - no ride
    // 1 - waiting for driver
    // 2 - in a car

    const [driverChosen, setDriverChosen] = useState(null);

    const navigate = useNavigate();

    const stompClientRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!location.state || location.state.passengerId == null) {
            navigate("/");
        }
        const getLocationFromDB = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/passengers/${location.state.passengerId}/get-location`);
                console.log(response);
                setSource({
                    lat: response.data.lat,
                    lng: response.data.lng,
                });
                console.log('mama');
                sessionStorage.setItem('location', JSON.stringify({
                    lat: response.data.lat,
                    lng: response.data.lng,
                }));
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        }

        console.log('mama');
        getLocationFromDB();
    }, [location, navigate]);

    const handleSourceChange = (e) => {
        // setSource(e.target.value);
    };

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
    };

    const handleSourceSelect = (place) => {
        // setSource({
        //     lat: place.geometry.location.lat(),
        //     lng: place.geometry.location.lng(),
        //     address: place.formatted_address,
        // });
    };

    const handleDestinationSelect = (place) => {
        setDestination({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
        });
    };

    const handleRideTypeSelect = (type) => {
        setRideType(type);
    };

    const getCoordinates = async (address) => {
        try {
            const apiKey = 'AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs';
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
            console.log('Response data:', response.data); // Log the response data

            // Check if the response status is OK
            if (response.data.status === 'OK') {
                // Access the coordinates from the response data
                const location = response.data.results[0].geometry.location;
                return {
                    lat: location.lat,
                    lng: location.lng
                };
            } else {
                throw new Error('Error fetching coordinates for address: ' + response.data.status);
            }
        } catch (error) {
            console.error('Error fetching coordinates for address:', error);
            throw new Error('Error fetching coordinates for address');
        }
    };

    const [locationUser, setLocationUser] = useState({ lat: null, lng: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const apiKey = 'AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs';
                const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`);
                console.log(response);
                // setLocationUser({
                //     lat: response.data.location.lat,
                //     lng: response.data.location.lng,
                // });

                // const responseSecond = await axios.put(`http://localhost:8080/passengers/${location.state.passengerId}/set-location`, {
                //     lat: response.data.location.lat,
                //     lng: response.data.location.lng
                // });

            } catch (error) {
                setError(error.message);
            }
        };

        let intervalId;
    
        if (RideStatus !== 0) {
            fetchLocation();
            intervalId = setInterval(fetchLocation, 1000);
        }
    
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [RideStatus]);

    const handleMoveToCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // console.log(position);
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                        const newLocation = { lat: lat, lng: lng };
                        const address = await fetchAddress(newLocation);
                        // setSource({ lat: lat, lng: lng, address: address });
                    } else {
                        console.error("Invalid coordinates received");
                    }
                },
                (error) => {
                    console.error("Error getting current position:", error);
                }
            );
        } else {
            console.error("Geolocation not supported");
        }
    };

    const orderTaxi = async () => {
        console.log('Ordering taxi');
        console.log('source: ', source);
        console.log('destination: ', destination);
        console.log('rideType: ', rideType);
        // Make sure both source and destination are provided
        if (!source || !destination) {
            alert("Please provide both source and destination addresses.");
            return;
        }

        try {
            // Get coordinates for source address
            let sourceCoords = null;
            console.log('source: ', source);

            if (source.lat != null && source.lng != null) {
                sourceCoords = {
                    lat: source.lat,
                    lng: source.lng
                }
                console.log('sourceCoords: ', sourceCoords);
            } else if (source != null) {
                sourceCoords = await getCoordinates(source);
            } else {
                console.log("Something went wrong with passenger coords (source): ", source);
                throw new Error('Error fetching coordinates for address');
            }


            // Get coordinates for destination address
            let destinationCoords = null;
            console.log('destination: ', destination);

            if (destination.lat != null && destination.lng != null) {
                destinationCoords = {
                    lat: destination.lat,
                    lng: destination.lng
                }
                console.log('destinationCoords: ', destinationCoords);
            } else if (destination != null) {
                destinationCoords = await getCoordinates(destination);
            } else {
                console.log("Something went wrong with passenger coords (destination): ", destination);
                throw new Error('Error fetching coordinates for address');
            }

            setLookingForDriver(true);

            // Define the request body
            const requestBody = {
                source: {
                    lat: sourceCoords.lat,
                    lng: sourceCoords.lng
                },
                destination: {
                    lat: destinationCoords.lat,
                    lng: destinationCoords.lng
                },
                id: {
                    id: location.state.passengerId
                },
                rideType: {
                    rideType: rideType
                }
            };

            console.log('Request body:', requestBody);
            // Send POST request to order taxi
            const response = await axios.post('http://localhost:8080/passengers/order-taxi', requestBody);

            console.log('Assigned driver ID:', response.data);

            setLookingForDriver(false);

            if (response.data !== "") {
                setRideStatus(1);
                setDriverChosen(response.data);
            }
            else {
                handleMoveToCurrentLocation();
                setDestination("");
                setRideStatus(0);
                setDriverChosen(null);
            }
        } catch (error) {
            console.error('Error ordering taxi:', error);
            setLookingForDriver(false); // Hide the "looking for driver" message in case of an error
        }
    };

    useEffect(() => {
        if (RideStatus !== 0) {
            handleMoveToCurrentLocation();
            const intervalId = setInterval(() => {
                handleMoveToCurrentLocation();
            }, 5000);
            return () => clearInterval(intervalId);
        }
    }, [RideStatus]);

    const fetchAddress = async (coords) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs`
            );
            const data = await response.json();
            return data.results[0].formatted_address;
        } catch (error) {
            console.error('Error fetching address:', error);
            return null;
        }
    }

    const handleCurrentLocationReceived = async (currentLocation) => {
        const fetched = await fetchAddress(currentLocation);

        // setSource({
        //     lat: currentLocation.lat,
        //     lng: currentLocation.lng,
        //     address: fetched
        // });
    };

    const handleCurrentLocationReceivedDestination = async (currentLocation) => {
        const fetched = await fetchAddress(currentLocation);

        setDestination({
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            address: fetched,
        });

    };

    const handleLogout = async () => {
        navigate("/");
        await axios.put('http://localhost:8080/auth/deactivate', {
            id: location.state.passengerId,
            username: location.state.username
        });
        sessionStorage.removeItem('location');
    };

    const [ratingMenuActive, setRatingMenuActive] = useState(false);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (location?.state?.passengerId) {
                if (!stompClientRef.current) {
                    stompClientRef.current = connectPassenger(
                        location.state.passengerId,
                        (order_id) => { // onFinishOrder
                            setDriverChosen(null);
                            setRideStatus(0);
                            setDestination("");
                            handleMoveToCurrentLocation();
                            setOrderId(order_id);
                            setRatingMenuActive(true);
                        },
                        () => { // onPassengerTaken
                            setRideStatus(2);
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
    }, [location.state.passengerId]);

    const handleRate = async (rating) => {
        console.log("Order ", orderId, " rated with ", rating);
        await axios.post('http://localhost:8080/rating/rateDriver', { orderId: orderId, rating: rating });
        setRatingMenuActive(false);
    };

    // console.log(RideStatus);

    const handleSidebar = () => {
        navigate("/sidebar", { state: { who: 'passenger', id: location.state.passengerId } });
    }

    const [distanceShown, setDistanceShown] = useState('');

    const calculateDistance = async () => {
        const apiKey = 'AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs';
        if (RideStatus === 1) {
            const responseDriver = await axios.get(`http://localhost:8080/drivers/${driverChosen.id}/get-location`);

            const requestBody = {
                origin: source,
                destination: responseDriver.data
            }

            console.log(source);
            console.log(responseDriver.data);

            const respone = await axios.post(`http://localhost:8080/distance/distance/${apiKey}`, requestBody);
            console.log("Current distance (to driver) is: ", respone.data);
            setDistanceShown(respone.data.duration);
        }
        else if (RideStatus === 2) {
            const requestBody = {
                origin: source,
                destination: destination
            }
            const respone = await axios.post(`http://localhost:8080/distance/distance/${apiKey}`, requestBody);
            console.log("Current distance (to destinaiition) is: ", respone.data);
            setDistanceShown(respone.data.duration);
        }
        else {
            setDistanceShown(null);
        }
    }

    useEffect(() => {
        calculateDistance();
        const intervalId = setInterval(calculateDistance, 2000);
        return () => clearInterval(intervalId);
    }, [source, RideStatus])

    return (
        <div className="user-page-container">
            <div className="user-page-map-container">
                <MapComponent
                    userLocation={source}
                    userDestination={destination}
                    onCurrentLocationReceived={handleCurrentLocationReceived}
                    onCurrentLocationReceivedDestination={handleCurrentLocationReceivedDestination}
                    //draggable={!lookingForDriver && RideStatus === 0 && !ratingMenuActive}
                    draggable={false}
                />
            </div>
            <div className="user-page-controls-container">
                <h1>Enter Source and Destination</h1>
                <div>
                    <label htmlFor="source">Source Address:</label>
                    <AutocompleteInput
                        id="source"
                        value={typeof source === 'object' ? source.address : source}
                        onChange={handleSourceChange}
                        onSelect={handleSourceSelect}
                        userLocation={source}
                        Status={ratingMenuActive || lookingForDriver || driverChosen !== null}
                    />
                </div>
                 <div>
                    <label htmlFor="destination">Destination Address:</label>
                    <AutocompleteInput
                        id="destination"
                        value={typeof destination === 'object' ? destination.address : destination}
                        onChange={handleDestinationChange}
                        onSelect={handleDestinationSelect}
                        userLocation={source}
                        Status={ratingMenuActive || lookingForDriver || driverChosen !== null}
                    />
                </div>
                <div className="ride-type-buttons">
                    <button
                        disabled={ratingMenuActive}
                        onClick={() => handleRideTypeSelect('usual')}
                        style={{ backgroundColor: rideType === 'usual' ? 'lightblue' : 'white' }}
                    >
                        Usual
                    </button>
                    <button
                        disabled={ratingMenuActive}
                        onClick={() => handleRideTypeSelect('premium')}
                        style={{ backgroundColor: rideType === 'premium' ? 'lightblue' : 'white' }}
                    >
                        Premium
                    </button>
                </div>
                <button className="order-button" disabled={ratingMenuActive || lookingForDriver || driverChosen !== null} onClick={orderTaxi}>
                    Order Taxi
                </button>
                <div className="user-page-ride-info">
                    {RideStatus !== 0 && (
                        <p>
                            {RideStatus === 1 ? 'Your driver is ' : 'You are '} {distanceShown} away from {RideStatus === 1 ? 'you' : 'your destination'}
                            {driverChosen !== null && <p>Your driver is: {driverChosen.name}</p>}
                        </p>
                    )}
                </div>
                <div className="bottom-buttons">
                    <button disabled={ratingMenuActive || lookingForDriver || driverChosen !== null} onClick={handleMoveToCurrentLocation}>Move to Current Location</button>
                    <button disabled={ratingMenuActive || lookingForDriver || driverChosen !== null} onClick={handleSidebar}>Sidebar</button>
                    <button disabled={ratingMenuActive || lookingForDriver || driverChosen !== null} onClick={handleLogout}>Log out</button>
                </div>
                {lookingForDriver && <p>We are looking for a driver...</p>}
                {ratingMenuActive && (
                    <div className="user-page-rating-menu">
                        <RatingComponent onRate={handleRate} orderId={orderId} />
                    </div>
                )}
            </div>
        </div>
    );

}

export default UserInterface;