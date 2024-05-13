import React from 'react';
import { useNavigate } from 'react-router-dom';

function FirstLoginPage () {
    const navigate = useNavigate();

    const handleClickPassenger = () => {
        navigate('/login/passenger');
    };

    const handleClickDriver = () => {
        navigate('/login/driver');
    }

    return (
        <div>
            <h1>Welcome to Slavic Ride</h1>
            <p>Slavic Ride is a ride-sharing service that connects passengers with drivers in real-time.</p>
            <p>Get started by entering your role in our eco-system</p>
            <button onClick={handleClickPassenger}>Passenger</button>
            <button onClick={handleClickDriver}>Driver</button>
        </div>
    );
}

export default FirstLoginPage;