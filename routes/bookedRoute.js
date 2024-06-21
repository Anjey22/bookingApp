const express = require('express');
const router = express.Router();
const Booked = require('../models/Booked');
const Room = require('../models/rooms');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51PNzdq2Mp1mGrLqyzyq6PWEl4z8QZKDrDbkmLhvUifx3l3z0Fu8CI2xgj3RqUqu4NZkqEWvK3cciBgrT24ngjT3I00ZyzTij6N');

// Route to book a room
router.post('/bookRoom', async (req, res) => {
  const { rooms, userid, name, fromdate, todate, totalamount, totaldays, tokens } = req.body;

  console.log('Received booking request:', req.body);

  try {
    const customer = await stripe.customers.create({
      email: tokens.email,
      source: tokens.id
    });

    console.log('Customer created:', customer.id);

    const payment = await stripe.charges.create({
      amount: totalamount * 100, // Stripe amounts are in cents
      customer: customer.id,
      currency: 'inr', // Indian Rupees
      receipt_email: tokens.email
    }, {
      idempotencyKey: uuidv4()  // Unique id to prevent duplicate charges
    });

    console.log('Payment successful:', payment);

    if (payment.status === 'succeeded') {
      try {
        const newBook = new Booked({
          rooms: rooms.name,
          roomsid: rooms._id,
          userid,
          name,
          fromdate,
          todate,
          totalamount,
          totaldays,
          transactionid: payment.id
        });

        const bookedRoom = await newBook.save();
        console.log('Booking saved:', bookedRoom);

        const roomstemp = await Room.findOne({ _id: rooms._id });
        if (!roomstemp) {
          return res.status(404).json({ message: "Room not found" });
        }

        roomstemp.currentbooking.push({
          bookedRoom: bookedRoom._id,
          fromdate,
          todate,
          userid,
          status: bookedRoom.status
        });

        await roomstemp.save();
        console.log('Room booking updated:', roomstemp);

        res.status(201).json(bookedRoom);
      } catch (error) {
        console.error('Booking save failed:', error);
        res.status(500).json({ message: "Booking save failed", error });
      }
    } else {
      console.error('Payment did not succeed:', payment);
      res.status(400).json({ message: "Payment did not succeed", payment });
    }

  } catch (error) {
    console.error('Payment process failed:', error);
    res.status(400).json({ message: 'Payment process failed', error });
  }
});

// Route to get bookings by user ID
router.get('/getbookingsbyuserid/:userid', async (req, res) => {
  try {
    const bookings = await Booked.find({ userid: req.params.userid }); // Corrected the property name to 'userid'
    console.log('Received request for user ID:', req.params.userid);
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Error occurred while fetching bookings' });
  }
});

// Route to cancel a booking
router.post('/cancelbooking', async (req, res) => {
  const { bookingid, roomsid } = req.body;

  try {
    const bookingItem = await Booked.findOne({ _id: bookingid });
    bookingItem.status = 'CANCELLED';
    await bookingItem.save();

    const room = await Room.findOne({ _id: roomsid });

    room.currentbooking = room.currentbooking.filter(booking => booking.bookedRoom.toString() !== bookingid);
    await room.save();

    res.send('Your booking was cancelled successfully.');

  } catch (error) {
    return res.status(400).json({ error });
    
  }
});

router.post("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booked.find();
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
