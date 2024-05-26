import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [car, setCar] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [id, setId] = useState('');
    const [role, setRole] = useState(false);
    const navigate = useNavigate();

    const checkUserExists = async () => {
        try {
            const response = await axios.post('http://localhost:8080/auth/checkUserExists', {
                // email, phone,
                username
            });
            return response.data.exists;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false;
        }
    };

    const handleSubmit = async () => {
        const userExists = await checkUserExists();
        if (userExists) {
            alert('User with this username, email, or phone number already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        try {
            const requestBody = {
                name, email, phone,
                car: role ? car : '', // Only include car if role is true
                username, password: hashedPassword,
            };
            console.log('Request body:', requestBody);
            const response = await axios.post('http://localhost:8080/auth/signup', requestBody);
            console.log('Signup response:', response.data);
            console.log('id before setId:', id);
            console.log('response id', response.data.id);
            setId(response.data.id);
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Error signing up');
        }
    };

    useEffect(() => {
        if (id) {
            console.log('Updated id:', id);
            alert('Signup successful');
            if (role) {
                navigate('/driver', { state: { driverId: id } });
            } else {
                navigate('/passenger', { state: { passengerId: id } });
            }
        }
    }, [id, role, navigate]);

    return (
        <div>
            {/*<label>Name:</label>*/}
            {/*<input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />*/}
            {/*<br />*/}

            {/*<label>Email:</label>*/}
            {/*<input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />*/}
            {/*<br />*/}

            {/*<label>Phone Number:</label>*/}
            {/*<input type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />*/}
            {/*<br />*/}

            <label>Username:</label>
            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />

            <label>Password:</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />

            <label>You really want to drive?</label>
            <input
                type="checkbox"
                checked={role}
                onChange={(e) => setRole(e.target.checked)}
            />
            <br />

            {role && (
                <>
                    <label>Car:</label>
                    <input type="text" name="car" value={car} onChange={(e) => setCar(e.target.value)} />
                    <br />
                </>
            )}

            <button onClick={handleSubmit}>Sign Up</button>
        </div>
    );
};

export default SignupPage;
