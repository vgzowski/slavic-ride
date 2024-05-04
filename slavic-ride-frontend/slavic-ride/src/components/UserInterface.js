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
  };

  handleDestinationChange = (e) => {
    this.setState({ destination: e.target.value });
  };

  handleDirections = () => {
    const { destination } = this.state;
    if (destination) {
      const directionsService = new DirectionsService();
      directionsService.getDirections(destination);
    } else {
      alert('Please enter a destination address');
    }
  };

  render() {
    const { source, destination } = this.state;

    return (
      <div>
        <MapComponent />
        <h1>Enter Source and Destination</h1>
        <div>
          <label htmlFor="source">Source Address:</label>
          <input
            type="text"
            id="source"
            value={source}
            onChange={this.handleSourceChange}
          />
        </div>
        <div>
          <label htmlFor="destination">Destination Address:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={this.handleDestinationChange}
          />
        </div>
        <button onClick={this.handleDirections}>Get Directions</button>
      </div>
    );
  }
}

class DirectionsService {
  getDirections(address) {
    console.log('Getting directions for:', address);
    // Implement logic to get directions based on the address
    // For demonstration, I'm just logging the address to the console
  }
}

export default UserInterface;
