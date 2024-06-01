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

        // Make sure both source and destination are provided
        if (!source || !destination) {
            alert("Please provide both source and destination addresses.");
            return;
        }

        try {
            setLookingForDriver(true); // Show the "looking for driver" message

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

    const handleCurrentLocationReceived = (currentLocation) => {
        setSource(currentLocation);
    };

    const handleLogout = async () => {
        navigate("/");
        await axios.put('http://localhost:8080/auth/deactivate', {
            id: location.state.passengerId,
            username: location.state.username
        });
    };

    return (
        <div>
            <MapComponent userLocation={source} userDestination={destination} onCurrentLocationReceived={handleCurrentLocationReceived} />
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

            <button onClick={orderTaxi}>Order Taxi</button>
            <button onClick={handleLogout}>Log out</button>

            {lookingForDriver && <p>We are looking for a driver...</p>}
        </div>
    );
}

export default UserInterface;
