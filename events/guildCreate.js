const logger = require('../utils/logger');
// On bot joinning a server
module.exports = (client, guild) => {
  logger.warn(`Bot has joined ${guild.name} (${guild.id})`);
};