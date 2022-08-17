const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const GuildMember = sequelize.define('GuildMember', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  guildId: {
    type: DataTypes.STRING,
    references: {
      model: 'Guild',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.STRING,
    references: {
      model: 'User',
      key: 'id'
    }
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