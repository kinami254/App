// models/index.js

const sequelize = require('../config/db');
const User = require('./User');
const Service = require('./Service');
const Booking = require('./Booking');
const Testimonial = require('./Testimonial');
const GalleryImage = require('./GalleryImage');
const Contact = require('./Contact');

// Define associations

// User and Booking
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

// Service and Booking
Service.hasMany(Booking, { foreignKey: 'serviceId' });
Booking.belongsTo(Service, { foreignKey: 'serviceId' });

// User and Testimonial
User.hasMany(Testimonial, { foreignKey: 'userId' });
Testimonial.belongsTo(User, { foreignKey: 'userId' });

// Export all models
module.exports = {
  sequelize,
  User,
  Service,
  Booking,
  Testimonial,
  GalleryImage,
  Contact
};
