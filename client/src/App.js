// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar'; // Ensure correct path and filename case
import Homescreen from './styles/HomeScreen'; // Ensure correct path
import Booking from './styles/booking';
import Register from './styles/Register';
import Login from './styles/Login';
import Profile from './styles/Profile';
import Admin from './styles/Admin';
import Landingpage from './styles/Landingpage';


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Homescreen />} />
        <Route path="/booking/:roomsid/:fromdate/:todate" element={<Booking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/" element={<Landingpage/>} />
      </Routes>
    </Router>
  );
}

export default App;
