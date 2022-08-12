const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.CHAR(18),
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = User;