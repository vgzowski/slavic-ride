import React, { useEffect, useState } from 'react';
import axios from "axios";

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

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            zIndex: '100',
            textAlign: 'center'
        }}>
            <h3>You have a new ride request.</h3>
            <p>Source: {source?.lat}, {source?.lng}</p>
            <p>Destination: {destination?.lat}, {destination?.lng}</p>
            <p>Duration: {duration}</p>
            <p>Distance: {distance}</p>
            <button onClick={onAccept} style={{ margin: '10px' }}>Accept</button>
            <button onClick={onReject} style={{ margin: '10px' }}>Reject</button>
        </div>
    );
};

export default RideRequestMenu;
