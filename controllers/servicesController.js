// controllers/servicesController.js

const db = require('../config/db');
const { body, validationResult } = require('express-validator');
const logger = require('../config/logger'); // Import Winston logger

// Fetch and render the services page
exports.getServicesPage = (req, res) => {
  const servicesQuery = 'SELECT * FROM services';

  db.query(servicesQuery, (err, servicesResults) => {
    if (err) {
      console.error('Error fetching services:', err);
      logger.error(`Error fetching services: ${err.message}`);
      req.flash('error', 'An error occurred while fetching services.');
      res.status(500).send('An error occurred while fetching services.');
    } else {
      const name = req.session && req.session.userName ? req.session.userName : 'Guest'; // Safely define 'name'

      res.render('services', {
        services: servicesResults,
        title: 'Services',
        name: name, // Pass 'name' to the view
      });
    }
  });
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
  (req, res) => {
    const { name, description, icon } = req.body; // Get values from the request body

    // Check for duplicates
    const checkDuplicateQuery = `
      SELECT * FROM services 
      WHERE name = ? AND description = ? AND icon = ?
    `;

    db.query(checkDuplicateQuery, [name, description, icon], (err, results) => {
      if (err) {
        console.error('Error checking duplicates:', err);
        logger.error(`Error checking duplicates: ${err.message}`);
        req.flash('error', 'An error occurred while checking for duplicates.');
        return res.status(500).redirect('/services');
      } else if (results.length > 0) {
        console.log('Service already exists, skipping insert.');
        logger.warn(`Attempt to insert duplicate service: ${name}`);
        req.flash('error', 'Service already exists.');
        return res.status(409).redirect('/services');
      } else {
        // Insert new service
        const insertQuery = `
          INSERT INTO services (name, description, icon)
          VALUES (?, ?, ?)
        `;
        db.query(insertQuery, [name, description, icon], (insertErr) => {
          if (insertErr) {
            console.error('Error inserting service:', insertErr);
            logger.error(`Error inserting service: ${insertErr.message}`);
            req.flash('error', 'An error occurred while inserting the service.');
            return res.status(500).redirect('/services');
          } else {
            logger.info(`New service inserted: ${name}`);
            req.flash('success', 'Service inserted successfully.');
            res.status(201).redirect('/services');
          }
        });
      }
    });
  }
];
