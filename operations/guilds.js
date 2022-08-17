const logger = require('../utils/logger');
const { paginate, navigatePages, arrayFromCollection } = require('./opsUtils.js');

const parseGuilds = (guilds) => guilds.map(g => ({ name: g.name, id: g.id }))

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
exports.viewGuilds = async (client, limit = 30) => {
  logger.log('Retrieving client guilds');
  const guilds = arrayFromCollection(client.guilds.cache);
  const guildPages = paginate(parseGuilds(guilds), limit);
  await navigatePages(guildPages);
}