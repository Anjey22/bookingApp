import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'react-tabs/style/react-tabs.css';

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newRoom, setNewRoom] = useState({
    name: '',
    maxcount: '',
    phone: '',
    rentprice: '',
    imageurl: '',
    roomtype: '',
    description: ''
  });

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
          setIsAdmin(response.data.isAdmin);
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to fetch user details:', error);
          setIsLoading(false);
          window.location.href = '/home';
        }
      };
      fetchUserDetails();
    } else {
      setIsLoading(false);
      window.location.href = '/home';
    }
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post('/api/booked/getallbookings');
        console.log('Bookings response:', response.data);
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch all bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/getallusers');
        console.log('Users response:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch all users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/rooms/getallrooms');
        console.log('Rooms response:', response.data);
        setRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch all rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      // Convert imageurl to an array if it's a string
      let imageUrlsArray = newRoom.imageurl;
      if (typeof newRoom.imageurl === 'string') {
        imageUrlsArray = newRoom.imageurl.split(',').map(url => url.trim());
      }

      const roomData = { ...newRoom, imageurl: imageUrlsArray };
      const response = await axios.post('/api/rooms/addroom', roomData);
      console.log('New room added:', response.data);
      setRooms([...rooms, response.data]);
      setNewRoom({
        name: '',
        maxcount: '',
        phone: '',
        rentprice: '',
        imageurl: '',
        roomtype: '',
        maps: '',
        description: ''
      });
      Swal.fire('Congrats','New Room added', 'success');

    } catch (error) {
      console.error('Failed to add new room:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        alert(`Error: ${error.response.data.message}`);
      } else {
        Swal.fire('Failed to add new room', 'Network or server error', 'error');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && !isAdmin) {
    window.location.href = '/home';
    return null;
  }

  return (
    <div className="profile-container">
      <h2 className="text-center mt-3" style={{ fontSize: '45px' }}><b>Admin Panel</b></h2>
      <div className="admin">
        <Tabs>
          <TabList>
            <Tab><h1>Users</h1></Tab>
            <Tab><h1>Bookings</h1></Tab>
            <Tab><h1>Rooms</h1></Tab>
            <Tab><h1>Add Room</h1></Tab>
          </TabList>

          <TabPanel>
            <h2>Details: There are a total of {users.length} users</h2>
            {users.length > 0 ? (
              <div className="table-container">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>isAdmin</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <h1>No users available</h1>
            )}
          </TabPanel>
          <TabPanel>
            <h2>Details: There are a total of {bookings.length} bookings</h2>
            {bookings.length > 0 ? (
              <div className="table-container">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Room</th>
                      <th>User ID</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking._id}</td>
                        <td>{booking.room}</td>
                        <td>{booking.userId}</td>
                        <td>{new Date(booking.fromDate).toLocaleDateString()}</td>
                        <td>{new Date(booking.toDate).toLocaleDateString()}</td>
                        <td>{booking.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <h1>No bookings available</h1>
            )}
          </TabPanel>
          <TabPanel>
            <h2>Details: There are a total of {rooms.length} rooms</h2>
            {rooms.length > 0 ? (
              <div className="table-container">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Room ID</th>
                      <th>Type</th>
                      <th>Rent Price</th>
                      <th>Max Count</th>
                      <th>Phone</th>
                      <th>Loacation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room._id}>
                        <td>{room.name}</td>
                        <td>{room._id}</td>
                        <td>{room.roomtype}</td>
                        <td>{room.rentprice}</td>
                        <td>{room.maxcount}</td>
                        <td>{room.phone}</td>
                        <td>{room.maps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <h1>No rooms available</h1>
            )}
          </TabPanel>
          <TabPanel>
            <h2>Add New Room</h2>
            <form onSubmit={handleAddRoom} className="add-room-form">
              <label>
                Room Name:
                <input type="text" name="name" value={newRoom.name} onChange={handleInputChange} required />
              </label>
              <label>
                Max Count:
                <input type="number" name="maxcount" value={newRoom.maxcount} onChange={handleInputChange} required />
              </label>
              <label>
                Phone Number:
                <input type="number" name="phone" value={newRoom.phone} onChange={handleInputChange} placeholder="Don't input numbers with space" required />
              </label>
              <label>
                Rent Price:
                <input type="number" name="rentprice" value={newRoom.rentprice} onChange={handleInputChange} required />
              </label>
              <label>
                Image URL(s):
                <input type="text" name="imageurl" value={newRoom.imageurl} onChange={handleInputChange} required />
                <small>Separate multiple URLs with commas</small>
              </label>
              <label>
                Room Type:
                <input type="text" name="roomtype" value={newRoom.roomtype} onChange={handleInputChange} placeholder="Deluxe or Non-Deluxe" required />
              </label>
              <label>
                Location(Maps):
                <input type="text" name="maps" value={newRoom.maps} onChange={handleInputChange} placeholder="Hotel map links" required />
              </label>
              <label>
                Description:
                <textarea name="description" value={newRoom.description} onChange={handleInputChange} placeholder='Rooms Details' required></textarea>
              </label>

              <button type="submit">Add Room</button>
            </form>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default Admin;
