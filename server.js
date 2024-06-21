const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConfig = require('./database');
const roomsRoute = require('./routes/roomsRoute');
const usersRoute = require('./routes/usersRoute');
const bookedRoute = require('./routes/bookedRoute');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute);
app.use('/api/booked', bookedRoute);

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
