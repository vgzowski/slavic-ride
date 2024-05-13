import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function DriverLoginPage () {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const createPassengerRequest = async () => {
        console.log('Creating passenger request');
        const requestBody = {
            "name": name,
            "email": email,
            "phone": phone
        };
        try {
            const response = await axios.post('http://localhost:8080/passengers', requestBody);
            if (response.data && response.data.id) {
                console.log(response.data.id);
                navigate('/passenger', { state: { passengerId: response.data.id } });
            }
            else {
                console.error('Response data or passenger id not found:', response);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Passenger Login Page</h1>
            <label>Name:</label>
            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
            <br/>

            <label>Email:</label>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <br/>

            <label>Phone Number:</label>
            <input type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            <br/>

            <button onClick={createPassengerRequest}>Submit</button>
        </div>
    );
}

export default DriverLoginPage;