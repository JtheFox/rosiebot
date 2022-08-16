const logger = require('../utils/logger.js');
const { paginate, navigatePages } = require('./opsUtils.js');

// Leave a guild by id
exports.leaveGuild = async (client, guildId) => {
  logger.log(`Checking client for guild ${guildId}`);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return logger.error('No guild found with that id');
  try {
    await guild.leave();
    return logger.log(`Bot has left guild ${guildId}`);
  } catch (err) {
    return logger.error(err)
  }
}

// View all client guilds
exports.viewGuilds = async (client, limit = 50) => {
  logger.log('Retrieving client guilds');
  const guilds = Array.from(client.guilds.cache.values()).map(g => ( { name: g.name, id: g.id } ));
  const guildPages = paginate(guilds, limit);
  await navigatePages(guildPages);
}