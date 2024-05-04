import React, { Component } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import Directions from './routesComponent.js';

class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLocation: props.userLocation,
            userDestination: props.userDestination,
            error: null,
            reloadMap: false,
        };
        this.apiKey = "AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs";
    }

    handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.success, this.handleError);
        } else {
            this.setState({ error: "Geolocation not supported" });
        }
    }

    success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        if (!isNaN(latitude) && !isNaN(longitude)) {
            this.setState({
                userLocation: { lat: latitude, lng: longitude },
                reloadMap: !this.state.reloadMap
            });
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        } else {
            this.setState({ error: "Invalid coordinates received" });
        }
    }

    handleError = (error) => {
        this.setState({ error: "Unable to retrieve your location" });
        console.error(error);
    }

    handleMarkerDragEnd = (event) => {
        const { latLng } = event;
        const newLocation = {
            lat: latLng.lat(),
            lng: latLng.lng()
        };
        this.setState({ userLocation: newLocation });
        console.log("New Marker Position:", newLocation);
    }

    handleUserLocationChange = (source) => {
        this.setState({ userLocation: source });
        console.log("Me in MapComponent: " + this.state.userLocation);
    }

    handleDestinationChange = (destination) => {
        this.setState({ userDestination: destination });
        console.log("Me in MapComponent: " + this.state.userDestination);
    };

    render() {
        const { userLocation, error, reloadMap, userDestination } = this.state;
        return (
            <div>
                <APIProvider apiKey={this.apiKey}>
                    <Map
                        key={reloadMap}
                        style={{ width: '100%', height: '700px' }}
                        defaultCenter={userLocation ? userLocation : { lat: 0, lng: 0 }}
                        defaultZoom={15}
                        mapTypeControl={false}
                        streetViewControl={false}
                        options={{
                            mapTypeId: 'blank',
                            mapTypeControl: false,
                            streetViewControl: false,
                        }}
                    >
                        {userLocation && (
                            <Marker
                                position={userLocation}
                                draggable={true}
                                onDragEnd={this.handleMarkerDragEnd}
                            />
                        )}

                        {userLocation && <Directions userLocation={this.props.userLocation} userDestination={this.props.userDestination} />}
                    </Map>
                </APIProvider>
                
                <button onClick={this.handleLocationClick}>Get Current Location</button>
                <p> {this.props.userLocation} </p>
                <p> {this.props.userDestination} </p>
                {error && <p>{error}</p>}
            </div>
        );
    }
}    

export default MapComponent;