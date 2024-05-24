import React from 'react';
import { useNavigate } from 'react-router-dom';

function FirstLoginPage () {
    const navigate = useNavigate();

    const handleClickLogin = () => {
        navigate('/login');
    };

    const handleClickSignUp = () => {
        navigate('/signup');
    }

    return (
        <div>
            <h1>Welcome to Slavic Ride</h1>
            <p>Slavic Ride is a ride-sharing service that connects passengers with drivers in real-time.</p>
            <p>Get started by entering your role in our eco-system</p>
            <button onClick={handleClickLogin}>Login</button>
            <button onClick={handleClickSignUp}>Sign Up</button>
        </div>
    );
}

export default FirstLoginPage;
