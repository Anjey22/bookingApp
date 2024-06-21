import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Tag } from "antd";
import 'react-tabs/style/react-tabs.css';

function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        window.location.href = '/login';
      }
    };

    fetchUserDetails();
  }, [token]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return;
      try {
        const response = await axios.get(`/api/booked/getbookingsbyuserid/${currentUser._id}`);
        console.log('Bookings response:', response.data); // Add logging to confirm data
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, [currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  async function cancelBooking(bookingid, roomsid) {
    try {
      const result = await axios.post('/api/booked/cancelbooking', { bookingid, roomsid });
      console.log(result.data);
      Swal.fire('Congrats', 'Your booking has been cancelled', 'success');

      // Update the state to reflect the cancellation
      setBookings(bookings.map(booking => 
        booking._id === bookingid ? { ...booking, status: 'CANCELLED' } : booking
      ));
    } catch (error) {
      console.log(error);
      Swal.fire('Oops', 'Something went wrong', 'error');
    }
  }

  return (
    <div className="profile-container">
      <div className='profile'>
        <Tabs>
          <TabList>
            <Tab><b>Profile</b></Tab>
            <Tab><b>Bookings</b></Tab>
          </TabList>

          <TabPanel>
            <h1>My Profile</h1>
            <hr />
            <h1>Name: {currentUser.name}</h1>
            <h1>Email: {currentUser.email}</h1>
            <h1>isAdmin: {currentUser.isAdmin ? 'YES' : 'NO'}</h1>
          </TabPanel>
          <TabPanel>
            <h1>My Bookings</h1>
            <hr />
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking._id}>
                  <h2>{booking.rooms}</h2>
                  <br></br>
                  <h5>Booking ID: {booking.roomsid}</h5>
                  <p>Check-in Date: {booking.fromdate}</p>
                  <p>Check-out Date: {booking.todate}</p>
                  <p>Amount: {booking.totalamount}</p>
                  <p>
                    Status: 
                    <b> <Tag color={booking.status === 'Booked' ? 'green' : 'red'}>
                      {booking.status === 'Booked' ? 'CONFIRMED' : 'CANCELLED'}
                    </Tag></b>
                  </p>
                  <div className='text-right'>
                    {booking.status === 'Booked' && (
                      <button onClick={() => cancelBooking(booking._id, booking.roomsid)}>Cancel Booking</button>
                    )}
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <p>No bookings found.</p>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
