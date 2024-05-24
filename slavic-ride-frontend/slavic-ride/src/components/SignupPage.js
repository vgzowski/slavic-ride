import React, { useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [car, setCar] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const generateId = async () => {
        const response = await axios.get('http://localhost:8080/auth/generateId');
        return response.data.id;
    }

    const handleSubmit = async (e) => {
        const id = await generateId();
        e.preventDefault();
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const requestBody = {
                "name": name,
                "email": email,
                "phone": phone,
                "id": id,
                "car": car,
                "username": username,
                "password": hashedPassword,
            };
            console.log('Request body:', requestBody);
            const response = await axios.post('http://localhost:8080/auth/signup', requestBody);
            console.log(response.data);
            alert('Signup successful');
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Error signing up');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
            />
            <input
                type="text"
                value={car}
                onChange={(e) => setCar(e.target.value)}
                placeholder="Car"
            />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignupPage;