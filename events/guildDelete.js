const logger = require('../utils/logger');
// On bot leaving a server
module.exports = (client, guild) => {
  // Check for outage
  if (!guild.available) return;
  logger.warn(`Bot has left ${guild.name} (${guild.id})`);
};
