const logger = require('../utils/logger.js');
exports.viewEmojis = async (client) => {
  logger.log('Retrieving client emojis');
  const emojis = Array.from(client.emojis.cache.values()).map(g => ({ name: g.name, id: g.id }));
  logger.log(emojis);
}

exports.searchEmoji = async (client, key) => {
  if (typeof key !== 'string') throw new TypeError('Invalid emoji identifier');
  // Perform regex validation on the key and check client emoji cache for matching id/name
  const emoji = client.emojis.cache.find(e => [e.name, e.id].contains(key) && e.guild.id === process.env.EMOJI_GUILD);
  if (!emoji) throw new Error('Emoji not found ' + key);
  logger.log(emoji);
}