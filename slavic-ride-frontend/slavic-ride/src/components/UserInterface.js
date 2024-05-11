import React, { Component } from 'react';
import MapComponent from './MapComponent';
import axios from 'axios';

class UserInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: '',
            destination: ''
        };
    }

    handleSourceChange = (e) => {
        this.setState({ source: e.target.value });
    }

    handleDestinationChange = (e) => {
        this.setState({ destination: e.target.value });
    }

    orderTaxi = () => {
        console.log("Taxi has been called");
        axios.post('/passengers/order-taxi', {
            source: {
                latitude: this.state.source.latitude,
                longitude: this.state.source.longitude
            },
            destination: {
                latitude: this.state.destination.latitude,
                longitude: this.state.destination.longitude
            }
        })
        .then(response => {
            console.log("Taxi ordered successfully:", response.data);
            const expectedTime = response.data.expectedTime;
            console.log("Expected time of ride:", expectedTime);
        })
        .catch(error => {
            // Handle error
            console.error("Error ordering taxi:", error);
        });
    }
    
    
    render () {
        const { source, destination } = this.state;

        return (
            <div>
                <MapComponent userLocation={source} userDestination={destination} handleLocationClick={this.handleLocationClick} />
                <h1>
                    Enter Source and Destination
                </h1>

                <div>
                    <label htmlFor="source">
                        Source Address:
                    </label>
                    <input type="text" id="source" value={source} onChange={this.handleSourceChange} />
                </div> 

                <div>
                    <label htmlFor="destination">
                        Destination Address:
                    </label>
                    <input type="text" id="destination" value={destination} onChange={this.handleDestinationChange} />
                </div>         


                <p> {this.props.userLocation} </p>
                <p> {JSON.stringify(this.userLocationButton)} </p>
                <p> {this.props.userDestination} </p>
                <button onClick={this.orderTaxi}>Order Taxi</button>

                {/* Assuming handleLocationClick is defined elsewhere */}
                <button onClick={this.handleLocationClick}>Update Location</button>
            </div>
        );
    }
}

export default UserInterface;
