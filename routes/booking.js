// routes/booking.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { ensureAuthenticated } = require('../middleware/auth.js');
const rateLimit = require('express-rate-limit');

// Rate limiter for booking
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 bookings per windowMs
  message: 'Too many bookings from this IP, please try again after 15 minutes.',
});

// Show booking form
router.get('/booking', ensureAuthenticated, bookingController.showBookingForm);

// Handle booking submission
router.post('/booking', ensureAuthenticated, bookingLimiter, bookingController.submitBooking);

// View user bookings
router.get('/my-bookings', ensureAuthenticated, bookingController.viewBookings);

module.exports = router;
