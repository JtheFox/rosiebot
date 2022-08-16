const logger = require('../utils/logger.js');
const { paginate } = require('./opsUtils.js');

exports.viewEmojis = async (client, limit = 50) => {
  logger.log('Retrieving client emojis');
  const emojis = Array.from(client.emojis.cache.values()).map(g => ({ name: g.name, id: g.id }));

  const emojiPages = paginate(emojis, limit);

  logger.log([`Page ${1}`, ...emojiPages[0]]);
}

exports.searchEmoji = async (client, key) => {
  // Ensure valid key provided
  if (typeof key !== 'string') throw new TypeError('Invalid emoji identifier');
  // Perform regex validation on the key and check client emoji cache for matching id/name
  const emoji = client.emojis.cache.find(e => [e.name, e.id].contains(key) && e.guild.id === process.env.EMOJI_GUILD);
  if (!emoji) throw new Error('Emoji not found ' + key);
  logger.log(emoji);
}