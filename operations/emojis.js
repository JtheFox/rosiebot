const logger = require('../utils/logger.js');
const { paginate, navigatePages } = require('./opsUtils.js');

// View all client emojis
exports.viewEmojis = async (client, limit = 50) => {
  logger.log('Retrieving client emojis');
  const emojis = Array.from(client.emojis.cache.values()).map(g => ({ name: g.name, id: g.id }));
  const emojiPages = paginate(emojis, limit);
  await navigatePages(emojiPages);
}

// Search emoji by id or name
exports.searchEmojis = async (client, key) => {
  if (typeof key !== 'string') throw new TypeError('Invalid emoji identifier');
  const emoji = client.emojis.cache.find(e => [e.name, e.id].contains(key) && e.guild.id === process.env.EMOJI_GUILD);
  if (!emoji) throw new Error('Emoji not found ' + key);
  logger.log(emoji);
}