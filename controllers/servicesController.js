// controllers/servicesController.js

const db = require('../config/db');
const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');
const Service = require('../models/Service'); // Assuming you have a Service model

// Fetch and render the services page
exports.getServicesPage = async (req, res) => {
  try {
    const servicesResults = await Service.findAll();
    const name = req.session && req.session.userName ? req.session.userName : 'Guest';

    res.render('services', {
      services: servicesResults,
      title: 'Services',
      name: name,
    });
  } catch (err) {
    console.error('Error fetching services:', err);
    logger.error(`Error fetching services: ${err.message}`);
    req.flash('error', 'An error occurred while fetching services.');
    res.status(500).redirect('/');
  }
};

// Check and insert a service (used with a POST request)
exports.checkAndInsertService = [
  // Validation rules
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('icon').trim().notEmpty().withMessage('Icon is required.'),
  
  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Collect error messages
      const errorMessages = errors.array().map(err => err.msg);
      req.flash('error', errorMessages.join(' '));
      return res.status(400).redirect('/services');
    }
    next();
  },
  
  // Proceed with checking duplicates and inserting
  async (req, res) => {
    const { name, description, icon } = req.body;

    try {
      // Check for duplicates
      const existingService = await Service.findOne({ where: { name, description, icon } });
      if (existingService) {
        logger.warn(`Duplicate service attempted: ${name}`);
        req.flash('error', 'Service already exists.');
        return res.status(409).redirect('/services');
      }

      // Insert new service
      await Service.create({ name, description, icon });
      logger.info(`New service inserted: ${name}`);
      req.flash('success', 'Service inserted successfully.');
      res.status(201).redirect('/services');
    } catch (err) {
      console.error('Error inserting service:', err);
      logger.error(`Error inserting service: ${err.message}`);
      req.flash('error', 'An error occurred while inserting the service.');
      res.status(500).redirect('/services');
    }
  }
];
