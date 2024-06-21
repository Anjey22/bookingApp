// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Create an Express router
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Route for user registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists, try a different email' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        const user = await newUser.save();

        // Create and sign a JWT
        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'User registered successfully', token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    try {
        // Extract login credentials from request body
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // If user not found, return error
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send success response with token
        res.status(200).json({ token });
    } catch (error) {
        // Send error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for fetching user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.get('/getallusers', async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      return res.status(400).json({ error });
    }
  });

/*
router.get('/getcurrentuser', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      res.send(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }); */

// Export the router
module.exports = router;
