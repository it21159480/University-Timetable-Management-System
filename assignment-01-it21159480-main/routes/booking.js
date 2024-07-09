const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your authentication middleware
const roleCheck = require('../middleware/roleCheck'); // Your role-checking middleware
const bookingController = require('../controller/bookingController');

// Create a new booking
router.post('/add',auth , roleCheck(['Admin','Faculty']), bookingController.createBooking);

// Get all bookings
router.get('/view',auth , roleCheck(['Admin','Faculty']),  bookingController.getAllBookings);

// Get a specific booking by ID
router.get('/view/:id',auth , roleCheck(['Admin','Faculty']),  bookingController.getBookingById);

// Update a specific booking by ID
router.put('/update/:id',auth , roleCheck(['Admin','Faculty']),  bookingController.updateBooking);

// Delete a specific booking by ID
router.delete('/delete/:id',auth , roleCheck(['Admin','Faculty']),  bookingController.deleteBooking);

module.exports = router;