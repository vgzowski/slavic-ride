import React from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

function MapComponent () {
    const apiKey = "AIzaSyCcGid1vTF4zEMmDMWgS5sX3fOxrAtGhDs";
    const position = {lat: 53.217, lng: 29.183};
    return (
        <APIProvider apiKey={apiKey}>
            <Map
            style={{width: '100%', height: '700px'}}
            defaultCenter={position}
            defaultZoom={9}
            />

        </APIProvider>
    )
};

export default MapComponent;
