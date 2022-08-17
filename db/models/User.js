const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    required: true
  },
});

module.exports = User;