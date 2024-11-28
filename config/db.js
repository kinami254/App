// config/db.js

require('dotenv').config();
const { Sequelize } = require('sequelize');
const logger = require('./logger');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: (msg) => logger.info(msg), // Integrate with Winston
});

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    logger.info('Database connected successfully.');
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
    logger.error(`Database connection failed: ${err.message}`);
    process.exit(1); // Exit process if connection fails
  });

module.exports = sequelize;
