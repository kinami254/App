// controllers/galleryController.js

const db = require('../config/db');

exports.getGalleryPage = (req, res) => {
  const galleryQuery = 'SELECT * FROM gallery';

  db.query(galleryQuery, (err, galleryResults) => {
    if (err) {
      console.error('Error fetching gallery images:', err);
      res.status(500).send('An error occurred.');
    } else {
      res.render('gallery', {
        gallery: galleryResults,
        title: 'Gallery',
      });
    }
  });
};
