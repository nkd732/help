const config = require('../config/config');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    logging: false,
  });

const Event = sequelize.define('Event', {
  event_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    primaryKey: true
  },
  event_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  event_type: {
    type: DataTypes.ENUM('GSB', 'personal'),
    allowNull: false
  },
  event_details: {
    type: DataTypes.STRING(180),
    allowNull: false
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  venue: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  created_by: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'events',
  timestamps: false, // Since we manually manage createdAt and updatedAt
  underscored: true, // Optional: if you want to match the snake_case naming convention
});

module.exports = Event;

