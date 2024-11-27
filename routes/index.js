// routes/index.js

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // Import rate limiter

const homeController = require('../controllers/homeController');
const contactController = require('../controllers/contactController');
const aboutController = require('../controllers/aboutController');
const servicesController = require('../controllers/servicesController');
const testimonialsController = require('../controllers/testimonialsController');
const galleryController = require('../controllers/galleryController');

// Define rate limit for service insertion
const serviceInsertionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many service submissions from this IP, please try again after 15 minutes.',
});

// Home Page
router.get('/', homeController.getHomePage);

// Contact Page
router.get('/contact', contactController.getContactPage);
router.post('/contact', contactController.submitContactForm);

// About Us Page
router.get('/about', aboutController.getAboutPage);

// Services Page
router.get('/services', servicesController.getServicesPage);
router.post('/services', serviceInsertionLimiter, servicesController.checkAndInsertService); // Apply rate limiter

// Testimonials Page
router.get('/testimonials', testimonialsController.getTestimonialsPage);

// Gallery Page
router.get('/gallery', galleryController.getGalleryPage);

module.exports = router;
