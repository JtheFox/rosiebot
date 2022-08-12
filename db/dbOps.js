const db = require('./connection.js');
const { Guild, User } = require('../models');
const logger = require('../utils/logger.js');

const connect = async () => {
  try {
    await sequelize.authenticate();
    logger.ready('Connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
}

module.exports = {
  initGuildInGuilds: async (guildId) => {
    
  },
  initUserInUsers: async (userId) => {

  },
  initUserInGuild: async (userId, guildId) => {

  }
}