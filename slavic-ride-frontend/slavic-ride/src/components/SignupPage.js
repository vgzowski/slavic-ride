import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import '../css/SignupPage.css'; // Import the CSS file

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
            const responseActivator = await axios.put('http://localhost:8080/auth/activate', {
                "id": response.data.id,
                "username": username
            });
            console.log('Response activator data:', responseActivator.data);
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
                navigate('/driver', { state: { driverId: id, username: username } });
            } else {
                navigate('/passenger', { state: { passengerId: id, username: username } });
            }
        }
    }, [id, role, navigate]);

    return (
        <div className="signup-container">
            <label className="signup-label">Username:</label>
            <input className="signup-input" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label className="signup-label">Name:</label>
            <input className="signup-input" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            <br />

            <label className="signup-label">Email:</label>
            <input className="signup-input" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <br />

            <label className="signup-label">Phone Number:</label>
            <input className="signup-input" type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <br />

            <label className="signup-label">Username:</label>
            <input className="signup-input" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />

            <label className="signup-label">Password:</label>
            <input className="signup-input" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <label className="signup-label">You really want to drive?</label>
            <input className="signup-input"
                type="checkbox"
                checked={role}
                onChange={(e) => {
                    setRole(e.target.checked);
                    if (e.target.checked === true) {
                        setCar('usual');
                    }
                    else {
                        setCar('');
                    }
                }}
            />
            <br />

            {role && (
                <>
                    <label className="signup-label" htmlFor="car">Car:</label>
                    <select className="signup-input" id="car" name="car" value={car} onChange={(e) => setCar(e.target.value)}>
                        <option value="usual">Usual</option>
                        <option value="premium">Premium</option>
                    </select>
                    <br />
                </>
            )}
            <button className="signup-button" onClick={handleSubmit}>Sign Up</button>
        </div>
    );
};

export default SignupPage;
