import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import '../css/LoginPage.css'; // Import the CSS file

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/auth/login?username=${username}`);
            console.log('Response data:', response.data);

            if (response.data.success) {
                const { role, id, passwordFromBack } = response.data;
                if (!await bcrypt.compare(password, passwordFromBack)) {
                    alert('Invalid username or password');
                    return;
                }
                alert('Login successful');
                const responseActivator = await axios.put('http://localhost:8080/auth/activate', {
                    "id": id,
                    "username": username
                });
                console.log('Response activator data:', responseActivator.data);
                if (role === 'driver') {
                    navigate('/driver', { state: { driverId: id, username: username } });
                } else {
                    navigate('/passenger', { state: { passengerId: id, username: username } });
                }
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in');
        }
    };

    return (
        <div className="login-container">
            <label className="login-label">Username:</label>
            <input className="login-input" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <label className="login-label">Password:</label>
            <input className="login-input" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button className="login-button" onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
