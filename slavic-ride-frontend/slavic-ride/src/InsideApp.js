import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import UserInterface from './components/UserInterface';
import DriverInterface from './components/DriverInterface';

class InsideApp extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/onlyMap" element={<MapComponent />} />
                    <Route path="/passenger" element={<UserInterface />} />
                    <Route path="/driver" element={<DriverInterface />} />
                </Routes>
            </Router>
        );
    }
}

export default InsideApp;
