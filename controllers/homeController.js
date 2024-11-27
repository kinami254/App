// controllers/homeController.js

const db = require('../config/db');

exports.getHomePage = (req, res) => {
  const servicesQuery = 'SELECT * FROM services LIMIT 3';
  const testimonialsQuery = 'SELECT * FROM testimonials LIMIT 3';
  const galleryQuery = 'SELECT * FROM gallery LIMIT 6';

  db.query(servicesQuery, (err, servicesResults) => {
    if (err) {
      console.error('Error fetching services:', err);
      res.status(500).send('An error occurred.');
    } else {
      db.query(testimonialsQuery, (err, testimonialsResults) => {
        if (err) {
          console.error('Error fetching testimonials:', err);
          res.status(500).send('An error occurred.');
        } else {
          db.query(galleryQuery, (err, galleryResults) => {
            if (err) {
              console.error('Error fetching gallery images:', err);
              res.status(500).send('An error occurred.');
            } else {
              res.render('index', {
                services: servicesResults,
                testimonials: testimonialsResults,
                gallery: galleryResults,
                title: 'Home',
              });
            }
          });
        }
      });
    }
  });
};
