import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// Navbar style in index.css'

function Navbar() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserDetails = async () => {
                try {
                    const response = await axios.get('/api/users/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log('User profile fetched:', response.data);
                    setCurrentUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                    logout();
                }
            };

            fetchUserDetails();
        }
    }, []);

    function logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return (
        <nav className="navbar navbar-expand-lg bg-gradient px-4 sticky-navbar">
            <div className="container-fluid">
            <Link className="navbar-brand" to="/home">
                <img
                    src='./logo4.png'
                    alt="WhoTell"
                    style={{
                        marginRight: '10px',
                        height: '70px',
                        borderRadius: '50%', // Makes the image circular
                        border: '2px solid white', // Example border style
                    }}
                />
                <b>WhoTell.com</b>
            </Link>
                <button className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav" 
                        aria-controls="navbarNav" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" style={{ border: 'white' }}></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {currentUser ? (
                            <>
                
                                <li className="nav-item">
                                    <div className="dropdown">
                                        <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fa-solid fa-user"></i> {currentUser.name}
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                            <li><button className="dropdown-item" onClick={logout}>Log Out</button></li>
                                        </ul>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register"><b>Register</b></Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login"><b>Log In</b></Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
