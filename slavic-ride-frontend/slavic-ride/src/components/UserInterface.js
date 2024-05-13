import React, { useState } from 'react';
import MapComponent from './MapComponent';
import axios from 'axios';
import { useLocation } from "react-router-dom";

const UserInterface = () => {
    const location = useLocation();
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');

    const handleSourceChange = (e) => {
        setSource(e.target.value);
    }

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
    }

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
    }


    const orderTaxi = async () => {
        console.log('Ordering taxi');
        console.log('source: ', source);
        console.log('destination: ', destination);
        // const { passengerId } = location.state.passengerId;

        // Make sure both source and destination are provided
        if (!source || !destination) {
            alert("Please provide both source and destination addresses.");
            return;
        }

        try {
            // Get coordinates for source address
            let sourceCoords = null;
            console.log('source: ', source);

            if (typeof source == 'object') {
                sourceCoords = {
                    lat: source.lat,
                    lng: source.lng
                }
                console.log('sourceCoords: ', sourceCoords);
            }
            else {
                sourceCoords = await getCoordinates(source);
            }
            // Get coordinates for destination address
            const destinationCoords = await getCoordinates(destination);

            // Define the request body
            const requestBody = {
                source: {
                    "lat": sourceCoords.lat,
                    "lng": sourceCoords.lng
                },
                destination: {
                    "lat": destinationCoords.lat,
                    "lng": destinationCoords.lng
                }
            };

            console.log('Request body:', requestBody);

            // Send POST request to order taxi
            const response = await axios.post('http://localhost:8080/passengers/order-taxi', requestBody);
            console.log('Assigned driver ID:', response.data);
            // console.log("passengerId: ", passengerId);
        } catch (error) {
            console.error('Error ordering taxi:', error);
        }
    }

    const handleCurrentLocationReceived = (currentLocation) => {
        setSource(currentLocation);
    }

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
                <input type="text" id="source" value={(typeof source === 'object') ? 'Your current location' : source} onChange={handleSourceChange} />
            </div>

            <div>
                <label htmlFor="destination">
                    Destination Address:
                </label>
                <input type="text" id="destination" value={destination} onChange={handleDestinationChange} />
            </div>

            <button onClick={orderTaxi}>Order Taxi</button>
        </div>
    );
}

export default UserInterface;
