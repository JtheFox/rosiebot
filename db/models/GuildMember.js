const { CHAR } = require('sequelize');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection');

const User = sequelize.define('GuildMember', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  guildId: {
    type: CHAR(18),
    allowNull: false,
    references: {
      model: 'Guild',
      key: 'guildId'
    }
  },
  userId: {
    type: CHAR(18),
    allowNull: false,
    references: {
      model: 'User',
      key: 'userId'
    }
  },
  betWins: {
    type: DataTypes.INTEGER
  },
  betLosses: {
    type: DataTypes.INTEGER
  }
});

module.exports = User;