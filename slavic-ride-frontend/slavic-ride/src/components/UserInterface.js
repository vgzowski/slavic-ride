import React, { Component } from 'react';
import MapComponent from './mapComponent';

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

    render () {
        const { source, destination } = this.state;

        return (
            <div>
                <MapComponent userLocation={source} userDestination={destination} />
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
            </div>
        );
    }
}

export default UserInterface;
