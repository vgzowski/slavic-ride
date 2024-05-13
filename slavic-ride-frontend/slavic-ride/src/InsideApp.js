import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import UserInterface from './components/UserInterface';
import DriverInterface from './components/DriverInterface';
import FirstLoginPage from './components/FirstLoginPage';
import PassengerLoginPage from './components/PassengerLoginPage';
import DriverLoginPage from './components/DriverLoginPage';

class InsideApp extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    {/* Default route */}
                    <Route element={<FirstLoginPage />} />

                    <Route path="/login" element={<FirstLoginPage />} />
                    <Route path="/login/passenger" element={<PassengerLoginPage />} />
                    <Route path="/login/driver" element={<DriverLoginPage />} />

                    <Route path="/onlyMap" element={<MapComponent />} />
                    <Route path="/passenger" element={<UserInterface />} />
                    <Route path="/driver" element={<DriverInterface />} />
                </Routes>
            </Router>
        );
    }
}

export default InsideApp;
