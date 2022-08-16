const logger = require('../utils/logger.js');
const { paginate, navigatePages, arrayFromCollection } = require('./opsUtils.js');

const parseEmojis = (emojis) => emojis.map(e => ({ name: e.name, id: e.id, guild: e.guild.name }))

// View all client emojis
exports.viewEmojis = async (client, limit = 50) => {
  logger.log('Retrieving client emojis');
  const emojis = parseEmojis(arrayFromCollection(client.emojis.cache));
  const emojiPages = paginate(emojis, limit);
  await navigatePages(emojiPages);
}

// Search emoji by id or name
exports.searchEmojis = async (client, key) => {
  if (typeof key !== 'string') throw new TypeError('Invalid emoji identifier');
  const emojis = arrayFromCollection(client.emojis.cache).filter(e => e.id === key || new RegExp(key, 'i').test(e.name))
  if (!emojis.length) throw new Error('Emoji not found: ' + key);
  logger.log(parseEmojis(emojis));
}