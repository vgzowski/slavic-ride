/* global google */

import React, { Component } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import Directions from './RoutesComponent.js';

class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLocationButton: null,
            userLocation: props.userLocation,
            userDestination: props.userDestination,
            error: null,
            reloadMap: true
        };
        this.apiKey = "AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs";
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userLocation !== prevState.userLocation) {
            return {
                userLocation: nextProps.userLocation,
                userLocationButton: nextProps.userLocation
            };
        }
        return null;
    }

    handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.success, this.handleError);
        } else {
            this.setState({ error: "Geolocation not supported" });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userLocation !== this.props.userLocation) {
            this.setState({
                userLocation: this.props.userLocation,
                userLocationButton: this.props.userLocation
            });
        }
        if (prevProps.userDestination !== this.props.userDestination) {
            this.setState({
                userDestination: this.props.userDestination
            });
        }
    }

    componentDidMount() {
        this.handleLocationClick();
    }

    success = (position) => {
        if (!this.props.fetchable) return;
        console.log("success")
        console.log(position);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (!isNaN(lat) && !isNaN(lng)) {
            this.setState({
                userLocationButton: { lat: lat, lng: lng },
            });
            console.log(`lat: ${lat}, lng: ${lng}`);
            if (this.props.onCurrentLocationReceived) {
                this.props.onCurrentLocationReceived({ lat: lat, lng: lng });
            }
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
        if (this.props.onCurrentLocationReceived) {
            this.props.onCurrentLocationReceived(newLocation);
        }
    }



    handleMarkerDestinationDragEnd = (event) => {
        const { latLng } = event;
        const newLocation = {
            lat: latLng.lat(),
            lng: latLng.lng()
        };
        this.setState({ userDestination: newLocation });
        if (this.props.onCurrentLocationReceivedDestination) {
            this.props.onCurrentLocationReceivedDestination(newLocation);
        }
    }

    render() {
        const { userLocationButton, error, reloadMap } = this.state;
        // console.log("user location:", this.props.userLocation);
        // console.log("default center:", (this.props.userLocation ? this.props.userLocation : userLocationButton) ? (this.props.userLocation ? this.props.userLocation : userLocationButton) : { lat: 0, lng: 0 })

        const blueCircleWithBorderIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="blue" stroke="white" stroke-width="2"/></svg>',
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
        };

        let center;

        if (this.props.userLocation) {
            center = {
                lat: this.props.userLocation.lat,
                lng: this.props.userLocation.lng
            };
        }
        else if (userLocationButton) {
            center = {
                lat: userLocationButton.lat,
                lng: userLocationButton.lng
            };
        }

        return (
            <div className="map-component">
                <APIProvider apiKey={this.apiKey}>
                    {center && (
                        <Map
                            key={reloadMap}
                            style={{ width: '100%', height: '100%' }}
                            defaultCenter={center}
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
                                    draggable={this.props.draggable}
                                    onDragEnd={this.handleMarkerDragEnd}
                                    icon={blueCircleWithBorderIcon}
                                />
                            )}

                            {this.state.userDestination && (
                                <Marker
                                    position={this.state.userDestination}
                                    draggable={this.props.draggableDestination}
                                    onDragEnd={this.handleMarkerDestinationDragEnd}
                                />
                            )}

                            <Directions
                                userLocation={this.props.userLocation ? this.props.userLocation : userLocationButton}
                                userDestination={this.props.userDestination}
                            />
                        </Map>
                    )}
                </APIProvider>

                {error && <p>{error}</p>}
            </div>
        );
    }
}

export default MapComponent;
