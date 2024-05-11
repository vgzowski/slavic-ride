import React, { Component } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import Directions from './RoutesComponent.js';

class MapComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userLocationButton: null,
            userLocation : props.userLocation,
            userDestination: props.userDestination,
            error: null,
            reloadMap: true,
        };
        this.apiKey = "AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs";
    }

    handleLocationClick = () => {
        console.log("hui");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.success, this.handleError);
        } else {
            this.setState({ error: "Geolocation not supported" });
        }
    }

    componentDidMount () {
        this.handleLocationClick();
    }

    success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        if (!isNaN(latitude) && !isNaN(longitude)) {
            this.setState({
                userLocationButton: { lat: latitude, lng: longitude },
            });
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            this.props.onCurrentLocationReceived({ lat: latitude, lng: longitude }); 
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
        this.setState({ userLocationButton: newLocation });
        console.log("New Marker Position:", this.userLocationButton);
    }

    render() {
        const { userLocationButton, error, reloadMap } = this.state;
        return (
            <div>
                <APIProvider apiKey={this.apiKey}>
                    <Map
                        key={reloadMap}
                        style={{ width: '100vw', height: '60vh' }}
                        defaultCenter={(this.props.userLocation ? this.props.userLocation : userLocationButton) ? (this.props.userLocation ? this.props.userLocation : userLocationButton) : { lat: 0, lng: 0 }}
                        defaultZoom={15}
                        mapTypeControl={false}
                        streetViewControl={false}
                        options={{
                            mapTypeId: 'blank',
                            mapTypeControl: false,
                            streetViewControl: false,
                        }}
                    >
                        {userLocationButton && (
                            <Marker
                                position={userLocationButton}
                                draggable={true}
                                onDragEnd={this.handleMarkerDragEnd}
                            />
                        )}

                        {(this.props.userLocation || userLocationButton) && this.props.userDestination && 
                            <Directions 
                                userLocation={this.props.userLocation ? this.props.userLocation : userLocationButton} 
                                userDestination={this.props.userDestination} />}
                    </Map>
                </APIProvider>
                
                {error && <p>{error}</p>}
            </div>
        );
    }
}    

export default MapComponent;