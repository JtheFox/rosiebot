const logger = require('../utils/logger');
const { deleteGuild } = require('../db/dbOps');
// On bot leaving a server
module.exports = (client, guild) => {
  // Check for outage
  if (!guild.available) return;
  logger.warn(`Bot has left ${guild.name} (${guild.id})`);
  deleteGuild(guild.id)
};
