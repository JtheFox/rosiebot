const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Guild = sequelize.define('Guild', {
  guildId: {
    type: DataTypes.CHAR(18),
    allowNull: false,
    primaryKey: true,
  },
  prefix: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Guild;