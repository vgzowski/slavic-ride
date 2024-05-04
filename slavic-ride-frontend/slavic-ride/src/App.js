import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MapComponent from './components/mapComponent';
import UserInterface from './components/UserInterface';

class App extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/onlyMap" element={<MapComponent />} />
                    <Route path="/user" element={<UserInterface />} />
                </Routes>
            </Router>
        );
    }
}

export default App;
