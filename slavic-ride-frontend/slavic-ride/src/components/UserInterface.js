import React, { Component } from 'react';
import MapComponent from './MapComponent';
import axios from 'axios';

class UserInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: props.currentLocation || '',
            destination: ''
        };
    }

    handleSourceChange = (e) => {
        this.setState({ source: e.target.value });
    }

    handleDestinationChange = (e) => {
        this.setState({ destination: e.target.value });
    }

    orderTaxi = async () => {
        const { source, destination } = this.state;

        // Make sure both source and destination are provided
        if (!source || !destination) {
            alert("Please provide both source and destination addresses.");
            return;
        }

        try {
            // Get coordinates for source address
            let sourceCoords = null;
            console.log('source: ', source);

            if (typeof source == 'object') {
                sourceCoords = {
                    lat: source.lat,
                    lng: source.lng
                }
                console.log('sourceCoords: ', sourceCoords);
            }
            else {
                sourceCoords = await this.getCoordinates(source);
            }
            // Get coordinates for destination address
            const destinationCoords = await this.getCoordinates(destination);

            // Define the request body
            const requestBody = {
                source: {
                    "lat": sourceCoords.lat,
                    "lng": sourceCoords.lng
                },
                destination: {
                    "lat": destinationCoords.lat,
                    "lng": destinationCoords.lng
                }
            };

            // Send POST request to order taxi
            const response = await axios.post('http://localhost:8080/passengers/order-taxi', requestBody);
            console.log('Assigned driver ID:', response.data);
        } catch (error) {
            console.error('Error ordering taxi:', error);
        }
    }

    getCoordinates = async (address) => {
        try {
            const apiKey = 'AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs'; // Replace 'YOUR_API_KEY' with your actual API key
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
            console.log('Response data:', response.data); // Log the response data
    
            // Check if the response status is OK
            if (response.data.status === 'OK') {
                // Access the coordinates from the response data
                const location = response.data.results[0].geometry.location;
                return {
                    lat: location.lat,
                    lng: location.lng
                };
            } else {
                throw new Error('Error fetching coordinates for address: ' + response.data.status);
            }
        } catch (error) {
            console.error('Error fetching coordinates for address:', error);
            throw new Error('Error fetching coordinates for address');
        }
    }

    handleCurrentLocationReceived = (currentLocation) => {
        this.setState({ source: currentLocation });
    }


    render () {
        const { source, destination } = this.state;

        return (
            <div>
                <MapComponent userLocation={source} userDestination={destination} onCurrentLocationReceived={this.handleCurrentLocationReceived} />
                <h1>
                    Enter Source and Destination
                </h1>

                <div>
                    <label htmlFor="source">
                        Source Address:
                    </label>
                    <input type="text" id="source" value={((typeof source == 'object') ? 'Your current location' : source)} onChange={this.handleSourceChange} />
                </div> 

                <div>
                    <label htmlFor="destination">
                        Destination Address:
                    </label>
                    <input type="text" id="destination" value={destination} onChange={this.handleDestinationChange} />
                </div>         

                <button onClick={this.orderTaxi}>Order Taxi</button>

                <button onClick={this.handleLocationClick}>Update Location</button>
            </div>
        );
    }
}

export default UserInterface;
