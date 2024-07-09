const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send('User already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = new User({
      ...req.body,
      password: hashedPassword
    });

    // Save the user in the database
    await user.save();

    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).send('Error in Saving');
  }
});




const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    // Find the user by email
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Check the password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send('Incorrect password');
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('Error in login');
  }
});

module.exports = router;