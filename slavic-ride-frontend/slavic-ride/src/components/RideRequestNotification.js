// RideRequestNotification.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from '../services/webSocketService';
import RideRequestMenu from "./RideRequestMenu";
import axios from "axios";

const RideRequestNotification = ({ driverId }) => {
    const [rideRequest, setRideRequest] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const stompClient = connect(
            driverId,
            (location_lat, location_lng, destination_lat, destination_lng) => {
                setRideRequest({
                    source: { lat: location_lat, lng: location_lng },
                    destination: { lat: destination_lat, lng: destination_lng }
                });
                setShowMenu(true);
            },
            () => {},
            () => {
                setShowMenu(false);
                alert('Time exceeded for the ride request');
            }
        );

        return () => {
            stompClient.disconnect();
        };
    }, [driverId]);

    const handleAcceptRide = async () => {
        try {
            setShowMenu(false);
            await axios.post(`http://localhost:8080/notifications/driver-response`, {
                driverId: driverId,
                accepted: true
            });
            navigate('/driver', { state: { driverId: driverId,
                    destination: rideRequest.source} })
        } catch (error) {
            console.error('Error accepting ride:', error);
        }
    };

    const handleRejectRide = async () => {
        setShowMenu(false);
        await axios.post(`http://localhost:8080/notifications/driver-response`, {
            driverId: driverId,
            accepted: false
        });
    };

    return (
        showMenu && rideRequest && (
            <RideRequestMenu
                onAccept={handleAcceptRide}
                onReject={handleRejectRide}
                source={rideRequest?.source}
                destination={rideRequest?.destination}
            />
        )
    );
};

export default RideRequestNotification;
