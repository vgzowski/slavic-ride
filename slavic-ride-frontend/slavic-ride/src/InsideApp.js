import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import UserInterface from './components/UserInterface';
import DriverInterface from './components/DriverInterface';
import FirstLoginPage from './components/FirstLoginPage';
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

class InsideApp extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<FirstLoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/onlyMap" element={<MapComponent />} />
                    <Route path="/passenger" element={<UserInterface />} />
                    <Route path="/driver" element={<DriverInterface />} />
                </Routes>
            </Router>
        );
    }
}

export default InsideApp;
