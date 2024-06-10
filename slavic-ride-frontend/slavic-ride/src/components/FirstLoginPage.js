import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FirstLoginPage.css'; // Import the CSS file

function FirstLoginPage () {
    const navigate = useNavigate();

    const handleClickLogin = () => {
        navigate('/login');
    };

    const handleClickSignUp = () => {
        navigate('/signup');
    }

    return (
        <div className="first-login-container">
            <div>
            <h1 className="first-login-title">Welcome to Slavic Ride</h1>
            <p className="first-login-description">Slavic Ride is a ride-sharing service that connects passengers with drivers in real-time.</p>
            <p className="first-login-description">Get started by entering your role in our eco-system</p>
            <button className="first-login-button" onClick={handleClickLogin}>Login</button>
            <button className="first-login-button" onClick={handleClickSignUp}>Sign Up</button>
            </div>
            {/*<div>*/}
            {/*    <img src="https://drive.google.com/file/d/17VP_i43q87wPtLAzt-G7eSGXV7HbkxR0/view?usp=drive_link" alt="Slavic Ride Logo" className="first-login-logo" /> /!* Add the image *!/*/}
            {/*</div>*/}
        </div>
    );
}

export default FirstLoginPage;
