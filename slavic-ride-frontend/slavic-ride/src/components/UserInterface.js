import React, { useEffect, useState } from 'react';
import MapComponent from './MapComponent';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AutocompleteInput from "./AutocompleteInput";

const UserInterface = () => {
    const location = useLocation();
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [lookingForDriver, setLookingForDriver] = useState(false);
    const [rideType, setRideType] = useState('usual'); // State to store the user's chosen ride type
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state || location.state.passengerId == null) {
            navigate("/");
        }
    }, [location, navigate]);

    const handleSourceChange = (e) => {
        setSource(e.target.value);
    };

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
    };

    const handleSourceSelect = (place) => {
        setSource({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
        });
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

            setLookingForDriver(false); // Hide the "looking for driver" message when the driver is assigned
        } catch (error) {
            console.error('Error ordering taxi:', error);
            setLookingForDriver(false); // Hide the "looking for driver" message in case of an error
        }
    };

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

        setSource({
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            address: fetched
        });
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
    };

    console.log('destination: ', destination);

    const handleMoveToCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    if (!isNaN(lat) && !isNaN(lng)) {
                        const newLocation = {
                            lat: lat,
                            lng: lng,
                        };
                        setSource(newLocation);
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

    const handleSidebar = () => {
        navigate("/sidebar", { state: { who: 'passenger', id: location.state.passengerId } });
    }

    return (
        <div>
            <MapComponent
                userLocation={source}
                userDestination={destination}
                onCurrentLocationReceived={handleCurrentLocationReceived}
                onCurrentLocationReceivedDestination={handleCurrentLocationReceivedDestination}
                draggable={!lookingForDriver}
            />
            <h1>
                Enter Source and Destination
            </h1>

            <div>
                <label htmlFor="source">
                    Source Address:
                </label>
                <AutocompleteInput
                    id="source"
                    value={(typeof source === 'object') ? source.address : source}
                    onChange={handleSourceChange}
                    onSelect={handleSourceSelect}
                />
            </div>

            <div>
                <label htmlFor="destination">
                    Destination Address:
                </label>
                <AutocompleteInput
                    id="destination"
                    value={(typeof destination === 'object') ? destination.address : destination}
                    onChange={handleDestinationChange}
                    onSelect={handleDestinationSelect}
                />
            </div>

            <div>
                {/* Apply different styles based on the chosen ride type */}
                <button
                    onClick={() => handleRideTypeSelect('usual')}
                    style={{ marginRight: '10px', backgroundColor: rideType === 'usual' ? 'lightblue' : 'white' }}
                >
                    Usual
                </button>
                <button
                    onClick={() => handleRideTypeSelect('premium')}
                    style={{ backgroundColor: rideType === 'premium' ? 'lightblue' : 'white' }}
                >
                    Premium
                </button>
            </div>

            <button onClick={orderTaxi}>Order Taxi</button>
            <button onClick={handleLogout}>Log out</button>
            <button onClick={handleMoveToCurrentLocation}>Move to Current Location</button>

            {lookingForDriver && <p>We are looking for a driver...</p>}
            <button onClick={handleSidebar}>Sidebar</button>
        </div>
    );
}

export default UserInterface;