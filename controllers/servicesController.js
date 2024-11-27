// controllers/servicesController.js

const db = require('../config/db');

// Fetch and render the services page
exports.getServicesPage = (req, res) => {
  const servicesQuery = 'SELECT * FROM services';

  db.query(servicesQuery, (err, servicesResults) => {
    if (err) {
      console.error('Error fetching services:', err);
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
exports.checkAndInsertService = (req, res) => {
  const { name, description, icon } = req.body; // Get values from the request body

  if (!name || !description || !icon) {
    return res.status(400).send('Missing required fields: name, description, or icon.');
  }

  // Check for duplicates
  const checkDuplicateQuery = `
    SELECT * FROM services 
    WHERE name = ? AND description = ? AND icon = ?
  `;

  db.query(checkDuplicateQuery, [name, description, icon], (err, results) => {
    if (err) {
      console.error('Error checking duplicates:', err);
      res.status(500).send('An error occurred while checking for duplicates.');
    } else if (results.length > 0) {
      console.log('Service already exists, skipping insert.');
      res.status(409).send('Service already exists.');
    } else {
      // Insert new service
      const insertQuery = `
        INSERT INTO services (name, description, icon)
        VALUES (?, ?, ?)
      `;
      db.query(insertQuery, [name, description, icon], (insertErr) => {
        if (insertErr) {
          console.error('Error inserting service:', insertErr);
          res.status(500).send('An error occurred while inserting the service.');
        } else {
          res.status(201).send('Service inserted successfully.');
        }
      });
    }
  });
};
