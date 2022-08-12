const { CHAR } = require('sequelize');
const { Model, DataTypes } = require('sequelize');
const { GuildMember } = require('.');
const sequelize = require('../connection');

const GuildMember = sequelize.define('GuildMember', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  guildId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Guild',
      key: 'guildId'
    }
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'User',
      key: 'userId'
    }
  },
  betWins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  betLosses: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = GuildMember;