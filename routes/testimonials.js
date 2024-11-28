// routes/testimonials.js

const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { ensureAuthenticated } = require('../middleware/auth.js');

// View Testimonials
router.get('/', testimonialsController.getTestimonialsPage);

// Submit a Testimonial
router.post('/', ensureAuthenticated, testimonialsController.submitTestimonial);

module.exports = router;
