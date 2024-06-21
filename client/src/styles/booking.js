import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Loading from '../components/loading';
import Error from '../components/Error';
import Swal from 'sweetalert2';
import { differenceInDays, parse } from 'date-fns';
import StripeCheckout from 'react-stripe-checkout';
import './booking.css';

function Booking() {
  const { roomsid, fromdate, todate } = useParams();
  const [rooms, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false); // New state variable

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/api/rooms/getroomsbyid/${roomsid}`);
        setRoom(response.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setName(response.data.name);
          setUserId(response.data._id);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };

    fetchRoomDetails();
    fetchUserProfile();
  }, [roomsid]);

  async function onToken(tokens) {
    const fromDateParsed = parse(fromdate, 'MM-dd-yyyy', new Date());
    const toDateParsed = parse(todate, 'MM-dd-yyyy', new Date());
    const totalDays = differenceInDays(toDateParsed, fromDateParsed) + 1;
    const totalAmount = rooms ? totalDays * rooms.rentprice : 0;

    const bookingDetails = {
      rooms: {
        name: rooms.name,
        _id: rooms._id
      },
      userid: userId,
      fromdate,
      todate,
      totalamount: totalAmount,
      totaldays: totalDays,
      transactionid: generateTransactionId(),
      tokens
    };

    try {
      setLoading(true);
      await axios.post('/api/booked/bookRoom', bookingDetails);
      Swal.fire('Congratulations!', 'Your room is booked. Enjoy your stay.');
      setPaymentSuccess(true); // Update payment status
      setLoading(false);
    } catch (error) {
      console.error("Booking failed", error);
      Swal.fire('Oops', 'Something went wrong', 'error');
      setLoading(false);
    }
  }

  const generateTransactionId = () => {
    return 'txn_' + Math.random().toString(36).substr(2, 9);
  };

  if (loading) return <Loading />;
  if (error) return <Error />;
  if (!rooms) return null;

  const fromDateParsed = parse(fromdate, 'MM-dd-yyyy', new Date());
  const toDateParsed = parse(todate, 'MM-dd-yyyy', new Date());
  const totalDays = differenceInDays(toDateParsed, fromDateParsed) + 1;
  const totalAmount = rooms ? totalDays * rooms.rentprice : 0;

  return (
    <div className="booking-container">
      {rooms && (
        <div className="booking-content">
          <div className="photo">
            <img src={rooms.imageurl[0]} className="booked" alt="Room" />
          </div>
          <div className="details">
            <div>
              <h1 className="roomsname">{rooms.name}</h1>
              <h2>Booking Details</h2>
              <hr />
              <b>
                <p>Name: {name}</p>
                <p>From: {fromdate}</p>
                <p>To: {todate}</p>
                <p>Max Count: {rooms.maxcount}</p>
              </b>
            </div>
            <div>
              <br />
              <b>
                <h2>Amount</h2>
                <hr />
                <p>Total days: {totalDays}</p>
                <p>Rent per day: {rooms.rentprice}</p>
                <p>Total Amount: {totalAmount}</p>
              </b>
            </div>
            <div>
              <Link to={`/home`}>
                <button className="btn btn-primary mx-2">Back</button>
              </Link>
              {!paymentSuccess && (
                <StripeCheckout
                  amount={totalAmount * 100}
                  token={onToken}
                  currency='INR'
                  stripeKey="pk_test_51PNzdq2Mp1mGrLqyo6oNs14Jg4cdq3KE8E6i6HEj0Lk9L8bpYze92uUxmYCmqU5PIPnm3RXAQJOTVqUphYZUPswM00NBJVAfXR"
                >
                  <button className="btn btn-primary mx-2" disabled={!name}>Pay Now</button>
                </StripeCheckout>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;
