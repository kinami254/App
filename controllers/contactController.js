// controllers/contactController.js

const db = require('../config/db');

exports.getContactPage = (req, res) => {
  const sql = 'SELECT * FROM contacts';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching contacts:', err);
      res.status(500).send(`An error occurred while fetching contacts: ${err.message}`);
    } else {
      res.render('contact', {
        title: 'Contact Us',
        contacts: results,
        success: req.query.success || false, // Pass success flag
      });
    }
  });
};

exports.submitContactForm = (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Name, email, and message are required.');
  }

  const sql = 'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, subject, message], (err, result) => {
    if (err) {
      console.error('Error inserting contact data:', err);
      res.status(500).send(`An error occurred: ${err.message}`);
    } else {
      res.redirect('/contact?success=true'); // Redirect with success flag
    }
  });
};
