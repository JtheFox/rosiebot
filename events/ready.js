// TODO: Sequelize migration
const logger = require('../utils/logger');
const { Guild } = require('../utils/models.js');
const { defaultSettings } = require('../config.js');
const { getSettings } = require('../utils/helpers.js');
// On client ready
module.exports = async client => {
  // Ensure default settings exist and update if modified since last start
  try {
    logger.log('Ensuring default settings');
    await Guild.updateOne({ guildId: 'default' }, defaultSettings, { new: true, runValidators: true });
    const def = await getSettings();
    if (!def) {
      logger.warn('No default found, creating...');
      await Guild.create({ guildId: 'default', prefix: '.' });
    }
  } catch (err) {
    logger.error(err)
    logger.error('Encountered an error while ensuring defaults, exiting process');
    process.exit(1);
  }

  logger.ready(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`);
  client.user.setActivity(`${defaultSettings.prefix}`, { type: 'PLAYING' });
};
