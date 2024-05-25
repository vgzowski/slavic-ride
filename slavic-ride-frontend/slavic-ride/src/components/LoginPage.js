import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

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
                    alert('Invalid username or password hui');
                    return;
                }
                alert('Login successful');
                if (role === 'driver') {
                    navigate('/driver', { state: { driverId: id } });
                } else {
                    navigate('/passenger', { state: { passengerId: id } });
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
        <div>
            <label>Username:</label>
            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />

            <label>Password:</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
