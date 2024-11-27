// controllers/testimonialsController.js

const db = require('../config/db');

exports.getTestimonialsPage = (req, res) => {
  const testimonialsQuery = 'SELECT * FROM testimonials';

  db.query(testimonialsQuery, (err, testimonialsResults) => {
    if (err) {
      console.error('Error fetching testimonials:', err);
      res.status(500).send('An error occurred.');
    } else {
      res.render('testimonials', {
        testimonials: testimonialsResults,
        title: 'Testimonials',
      });
    }
  });
};
