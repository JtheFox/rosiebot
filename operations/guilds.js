const logger = require('../utils/logger.js');
const { paginate } = require('./opsUtils.js');

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

exports.viewGuilds = async (client, limit = 50) => {
  logger.log('Retrieving client guilds');
  const guilds = Array.from(client.guilds.cache.values()).map(g => ( { name: g.name, id: g.id } ));

  const guildPages = paginate(guilds, limit);
  logger.log([`Page ${1}`, ...emojiPages[0]]);

}