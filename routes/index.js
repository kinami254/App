const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const contactController = require('../controllers/contactController');
const aboutController = require('../controllers/aboutController');
const servicesController = require('../controllers/servicesController');
const testimonialsController = require('../controllers/testimonialsController');
const galleryController = require('../controllers/galleryController');

// Home Page
router.get('/', homeController.getHomePage);

// Contact Page
router.get('/contact', contactController.getContactPage);
router.post('/contact', contactController.submitContactForm);

// About Us Page
router.get('/about', aboutController.getAboutPage);

// Services Page
router.get('/services', servicesController.getServicesPage);

// Testimonials Page
router.get('/testimonials', testimonialsController.getTestimonialsPage);

// Gallery Page
router.get('/gallery', galleryController.getGalleryPage);

module.exports = router;
