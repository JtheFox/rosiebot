const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const GuildMember = sequelize.define('GuildMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  betWins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  betLosses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
});

module.exports = GuildMember;