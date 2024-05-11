import React, { Component } from 'react';
import MapComponent from './MapComponent';

class DriverInterface extends Component {
    constructor (props) {
        super(props);
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