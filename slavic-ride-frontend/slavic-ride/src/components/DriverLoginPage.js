import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DriverLoginPage () {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [car, setCar] = useState('');
    const navigate = useNavigate();

    const createDriverRequest = async () => {
        console.log('Creating driver request');
        const requestBody = {
            "name": name,
            "email": email,
            "phone": phone,
            "car": car
        };
        try {
            const response = await axios.post('http://localhost:8080/drivers', requestBody);
            if (response.data && response.data.id) {
                console.log(response.data.id);
                navigate('/driver', { state: { driverId: response.data.id } });
            }
            else {
                console.error('Response data or driver id not found:', response);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Driver Login Page</h1>
            <label>Name:</label>
            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
            <br/>

            <label>Email:</label>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <br/>

            <label>Phone Number:</label>
            <input type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            <br/>

            <label>Car:</label>
            <input type="text" name="car" value={car} onChange={(e) => setCar(e.target.value)}/>
            <br/>

            <button onClick={createDriverRequest}>Submit</button>
        </div>
    );
}

export default DriverLoginPage;