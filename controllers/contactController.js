// controllers/contactController.js

const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const logger = require('../config/logger');

exports.getContactPage = (req, res) => {
  res.render('contact', { title: 'Contact Us' });
};

exports.submitContactForm = [
  // Validation rules
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('message').trim().notEmpty().withMessage('Message is required.'),
  
  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      req.flash('error', errorMessages.join(' '));
      return res.status(400).redirect('/contact');
    }
    next();
  },

  // Proceed with saving contact
  async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    try {
      await Contact.create({ name, email, phone, subject, message });
      logger.info(`New contact form submitted by ${name} (${email})`);
      req.flash('success', 'Your message has been sent successfully!');
      res.redirect('/contact');
    } catch (err) {
      console.error('Error submitting contact form:', err);
      logger.error(`Error submitting contact form: ${err.message}`);
      req.flash('error', 'An error occurred while sending your message.');
      res.status(500).redirect('/contact');
    }
  }
];
