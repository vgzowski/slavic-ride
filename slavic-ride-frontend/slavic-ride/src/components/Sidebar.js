import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import RideRequestNotification from './RideRequestNotification';
import '../css/Sidebar.css'; // Import the CSS file

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const who = location.state.who;
    const id = location.state.id;

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [rating, setRating] = useState('');
    const [orders, setOrders] = useState([]);

    const fetchAddress = async (coords) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs`
            );
            const data = await response.json();
            return data.results[0].formatted_address;
        } catch (error) {
            console.error('Error fetching address:', error);
            return null;
        }
    }

    const coordsToAddress = async (coords) => {
        const address = await fetchAddress(coords);
        return { address };
    }

    const getInfo = async () => {
        const response = await axios.post('http://localhost:8080/sidebar/getinfo', {who, id});
        const sortedOrders = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setName(response.data.name);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setRating(response.data.rating);

        const ordersWithAddresses = await Promise.all(sortedOrders.map(async order => {
            const source = await coordsToAddress(order.source);
            const destination = await coordsToAddress(order.destination);
            return { ...order, source, destination };
        }));
        console.log(ordersWithAddresses);
        setOrders(ordersWithAddresses);
    }

    useEffect(() => {
        if (who === 'driver') {
            // Check if the session is already activated
            const sessionActivated = sessionStorage.getItem('driverSessionActivated' + id);
            if (!sessionActivated) {
                // Increment active session count if the session is not already activated
                axios.post(`http://localhost:8080/drivers/${id}/activate`);
                console.log('Session activated')
                // Set flag to indicate session activation
                sessionStorage.setItem('driverSessionActivated'+ id, 'true');
            }

            return () => {
                // Decrement active session count on page close
                const nextPage = window.location.pathname;
                if (nextPage !== '/driver') {
                    // Decrement active session count on page close
                    axios.post(`http://localhost:8080/drivers/${id}/deactivate`);
                    console.log('Session deactivated')
                    // Remove flag indicating session activation
                    sessionStorage.removeItem('driverSessionActivated' + id);
                }
            };
        }
    }, [])


    useEffect(() => {
        getInfo();
    }, []);

    const handleGoBackClick = () => {
        if (who === 'driver') {
            navigate('/driver', { state: { driverId: id,
                    destination: null} });
        }
        else {
            navigate('/passenger', { state: { passengerId: id,
                    destination: null} });
        }
    }

    return (
        <div className="sidebar">
            <RideRequestNotification driverId={id}/>
            <h1 className="sidebar-title">User Info</h1>
            <div className="sidebar-content user-info">
                <p><span className="label">Name:</span> {name}</p>
                <p><span className="label">Email:</span> {email}</p>
                <p><span className="label">Rating:</span> {rating}</p>
            </div>
            <h2 className="sidebar-title">Orders</h2>
            <ul className="orders-list">
                {orders.map(order => (
                    <li key={order.orderId} className="order-item">
                        <p><span className="label">Driver:</span> {order.driverId}</p>
                        <p><span className="label">Date:</span> {order.date}</p>
                        <p><span className="label">From:</span> {order.source.address} </p>
                        <p><span className="label">To:</span> {order.destination.address} </p>
                    </li>
                ))}
            </ul>
            <button className="sidebar-button" onClick={handleGoBackClick}>Go back</button>
        </div>
    );
}

export default Sidebar;
