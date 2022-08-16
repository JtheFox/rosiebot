const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const GuildMember = sequelize.define('GuildMember', {
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