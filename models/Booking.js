// models/Booking.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Service = require('./Service');
const User = require('./User');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service,
      key: 'id',
    },
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

// Associations
Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = Booking;
