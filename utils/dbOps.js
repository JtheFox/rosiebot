const db = require('./connection.js');
const { Guild, User } = require('../models');
const { error } = require('./logger.js');

const connect = async () => {
  try {
    await db.connect();
    return true;
  } catch (err) {
    error(err);
    return false;
  }
}

module.exports = {
  verifyDbConnect: async () => await connect(),
  initUserInGuild: async (userId) => {
    
  }
}