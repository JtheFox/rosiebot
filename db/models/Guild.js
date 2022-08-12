const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Guild = sequelize.define('Guild', {
  guildId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  prefix: {
    type: DataTypes.STRING,
    defaultValue: '.rosie '
  },
  embedColor: {
    type: DataTypes.STRING,
    defaultValue: '#96baff'
  }
});

module.exports = Guild;