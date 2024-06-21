

const express = require("express");
const router = express.Router();
const Room = require('../models/rooms');


// routes for  homeScreen/roomsRoute.js
router.get("/getallrooms", async (req, res) => {
    try {
        const rooms = await Room.find({});
        return res.status(200).json(rooms); // Use 200 status for successful GET requests and simplify the response object
    } catch (error) {
        console.error('Error fetching rooms:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Error occurred while fetching rooms' }); // Use 500 for server errors
    }
});

// routes/roomsRoute.js

router.get('/getroomsbyid/:roomsid', async (req, res) => {
    try {
      const rooms = await Room.findById(req.params.roomsid);
      if (!rooms) {
        return res.status(404).send({ message: 'Room not found' });
      }
      res.status(200).send(rooms);
    } catch (error) {
      res.status(400).send({ message: 'Room not found', error });
    }
  });

// routes for admin/roomsRoute.js
router.get('/getroomslist', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.send(rooms);
  } catch (error) {
    return res.status(400).json({ error });
  }
});


// Add a new room
router.post('/addroom', async (req, res) => {
  try {
    const { name, maxcount, phone, rentprice, imageurl, roomtype, maps, description } = req.body;

    // Validate required fields
    if (!name || !maxcount || !phone || !rentprice || !Array.isArray(imageurl) || !roomtype || !maps  || !description) {
      return res.status(400).json({ message: 'All fields are required and imageurl should be an array' });
    }

    // Create new room
    const newRoom = new Room({
      name,
      maxcount,
      phone,
      rentprice,
      imageurl,
      roomtype,
      maps,
      description
    });

    // Save room to database
    await newRoom.save();

    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error adding new room:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
