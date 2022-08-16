const logger = require('../utils/logger.js');

exports.viewEmojis = async (client) => {
  logger.log('Retrieving client emojis');
  const emojis = Array.from(client.emojis.cache.values()).map(g => ( { name: g.name, id: g.id } ));
  logger.log(emojis);
}