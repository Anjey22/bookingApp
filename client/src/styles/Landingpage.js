import React from 'react';
import { Link } from 'react-router-dom';
// Landingpage style in booking.css'

function Landingpage() {
    return (
        <div className="landing-page">
        <div className="content">
            <div className='landing'>
                <h3 style={{ marginTop: '170px', fontSize: '78px' }}><b>WhoTell.com</b></h3>
                <h1 style={{ fontSize: '20px' }}><b>Discover Your Perfect Stay</b></h1>
            </div>
            <Link to='/home'><button style={{ marginTop: '50px' }}><b>Discover Now</b></button></Link>
        </div>
    </div>
    );
}

export default Landingpage;
