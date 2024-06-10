import React, { useEffect, useState } from 'react';
import axios from "axios";
import '../css/RideRequestMenu.css'; // Import the CSS file

const RideRequestMenu = ({ onAccept, onReject, source, destination }) => {
    const [duration, setDuration] = useState('Calculating');
    const [distance, setDistance] = useState('Calculating');

    useEffect(() => {
        const fetchDistanceAndDuration = async () => {
            console.log('Source:', source);
            console.log('Destination:', destination);
            console.log('Requesting distance and duration');

            const requestBody = {
                origin: { lat: source.lat, lng: source.lng },
                destination: { lat: destination.lat, lng: destination.lng },
            };

            console.log("RequestBody for obtaining durations is: ", requestBody);

            try {
                const response = await axios.post('http://localhost:8080/distance/distance/AIzaSyA7m1gPyySkRNZWzJgn7q1cPcEQF_OXC0c', requestBody);

                console.log('Response for duration :', response);

                setDuration(response.data.duration);
                setDistance(response.data.distance);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (source && destination) {
            fetchDistanceAndDuration();
        }

        // No cleanup function needed here as there are no subscriptions or side effects to clean up
        return undefined;
    }, [source, destination]);

    const [sourceAddress, setSourceAddress] = useState('In process...');
    const [destinationAddress, setDestinationAddress] = useState('In process...');

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

    useEffect(() => {
        const fetchAdresses = async () => {
            const sourcea = await fetchAddress(source);
            const destinationa = await fetchAddress(destination);

            setSourceAddress(sourcea);
            setDestinationAddress(destinationa);
        }

        fetchAdresses();

    }, [source, destination]);

    return (
        <div className="ride-request-menu">
            <h3 className="ride-request-title">You have a new ride request.</h3>
            <p className="ride-request-info">Source: {sourceAddress}</p>
            <p className="ride-request-info">Destination: {destinationAddress}</p>
            <p className="ride-request-info">Duration: {duration}</p>
            <p className="ride-request-info">Distance: {distance}</p>
            <button className="ride-request-button" onClick={onAccept}>Accept</button>
            <button className="ride-request-button" onClick={onReject}>Reject</button>
        </div>
    );
};

export default RideRequestMenu;
