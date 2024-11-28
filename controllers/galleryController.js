// controllers/galleryController.js

const GalleryImage = require('../models/GalleryImage');
const logger = require('../config/logger');

exports.getGalleryPage = async (req, res) => {
  try {
    const galleryImages = await GalleryImage.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.render('gallery', { title: 'Gallery', galleryImages });
  } catch (err) {
    console.error('Error fetching gallery images:', err);
    logger.error(`Error fetching gallery images: ${err.message}`);
    req.flash('error', 'An error occurred while fetching gallery images.');
    res.status(500).redirect('/');
  }
};
