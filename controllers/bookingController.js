// controllers/bookingController.js

const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const logger = require('../config/logger');

exports.showBookingForm = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.render('booking', { title: 'Book a Service', services });
  } catch (err) {
    console.error('Error fetching services for booking:', err);
    logger.error(`Error fetching services for booking: ${err.message}`);
    req.flash('error', 'An error occurred while preparing the booking form.');
    res.status(500).redirect('/');
  }
};

exports.submitBooking = [
  // Validation rules
  body('serviceId').isInt().withMessage('Invalid service selected.'),
  body('appointmentDate').isISO8601().toDate().withMessage('Invalid appointment date.'),
  
  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      req.flash('error', errorMessages.join(' '));
      return res.status(400).redirect('/booking');
    }
    next();
  },

  // Proceed with booking
  async (req, res) => {
    const { serviceId, appointmentDate } = req.body;
    const userId = req.user.id;

    try {
      // Check if the service exists
      const service = await Service.findByPk(serviceId);
      if (!service) {
        req.flash('error', 'Selected service does not exist.');
        return res.status(404).redirect('/booking');
      }

      // Create booking
      await Booking.create({
        userId,
        serviceId,
        appointmentDate,
      });

      logger.info(`New booking created by User ID ${userId} for Service ID ${serviceId} on ${appointmentDate}`);
      req.flash('success', 'Booking successful!');
      res.redirect('/my-bookings');
    } catch (err) {
      console.error('Error creating booking:', err);
      logger.error(`Error creating booking: ${err.message}`);
      req.flash('error', 'An error occurred while creating your booking.');
      res.status(500).redirect('/booking');
    }
  }
];

exports.viewBookings = async (req, res) => {
  const userId = req.user.id;
  try {
    const bookings = await Booking.findAll({
      where: { userId },
      include: ['Service'],
      order: [['appointmentDate', 'ASC']],
    });
    res.render('myBookings', { title: 'My Bookings', bookings });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    logger.error(`Error fetching bookings for User ID ${userId}: ${err.message}`);
    req.flash('error', 'An error occurred while fetching your bookings.');
    res.status(500).redirect('/');
  }
};
