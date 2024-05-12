import React, { Component } from 'react';
import MapComponent from './MapComponent';
import axios from "axios";

class DriverInterface extends Component {
    constructor (props) {
        super(props);
        this.state = {
            location: null,
            driverId: 'a5355e18-27db-4aa4-b873-c53d3545f12c'
        }
    }

    componentDidMount() {
        // if (!this.state.driverId) {
        //     this.createDriver();
        // }
        this.sendLocation();
    }

    createDriver = async () => {
        try {
            const requestBody = {}
            const response = await axios.post('http://localhost:8080/drivers', requestBody);
            this.setState({ driverId: response.data.id });
            console.log('Driver ID:', response.data);
        } catch (error) {
            console.error(error);
        }
    }

    getLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        resolve(location);
                    },
                    error => {
                        console.error('Error getting location:', error);
                        reject(error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                reject('Geolocation not supported');
            }
        });
    }

    sendLocation = async () => {
        setInterval(async () => {
            try {
                const { driverId } = this.state;
                const location = await this.getLocation();
                if (location && driverId) {
                    const requestBody = {
                        "location": {
                            "lat": location.lat,
                            "lng": location.lng
                        },
                        "id": {
                            "id": driverId
                        }};
                    console.log('Sending location:', requestBody)
                    await axios.put('http://localhost:8080/drivers/${driverId}/location', requestBody);
                    console.log(`Location successfully sent to server: ${location}, ${driverId}`);
                }
                else {
                    if (!location) {
                        console.log('No location');
                    }
                    if (!driverId) {
                        console.log('No driver id');
                    }
                }
            } catch (error) {
                console.log('Something went wrong in sending location...');
            }
        }, 10000);
    }

    render () {
        return (
            <div>
                <MapComponent />
                
            </div>
        );
    }
}

export default DriverInterface;