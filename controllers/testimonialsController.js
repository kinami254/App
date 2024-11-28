// controllers/testimonialsController.js

const { body, validationResult } = require('express-validator');
const Testimonial = require('../models/Testimonial');
const logger = require('../config/logger');

exports.getTestimonialsPage = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.render('testimonials', { title: 'Testimonials', testimonials });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    logger.error(`Error fetching testimonials: ${err.message}`);
    req.flash('error', 'An error occurred while fetching testimonials.');
    res.status(500).redirect('/');
  }
};

exports.submitTestimonial = [
  // Validation rules
  body('message').trim().notEmpty().withMessage('Testimonial message is required.'),
  
  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      req.flash('error', errorMessages.join(' '));
      return res.status(400).redirect('/testimonials');
    }
    next();
  },
  
  // Proceed with submitting testimonial
  async (req, res) => {
    const { message } = req.body;
    const userName = req.user.name;

    try {
      await Testimonial.create({ userName, message });
      logger.info(`New testimonial submitted by ${userName}`);
      req.flash('success', 'Thank you for your testimonial!');
      res.redirect('/testimonials');
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      logger.error(`Error submitting testimonial: ${err.message}`);
      req.flash('error', 'An error occurred while submitting your testimonial.');
      res.status(500).redirect('/testimonials');
    }
  }
];
