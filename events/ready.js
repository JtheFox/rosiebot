const logger = require('../utils/logger');
const { Guild } = require('../db/models');
const { defaultSettings } = require('../config.js');
// On client ready
module.exports = async client => {
  // Ensure default settings exist and update if modified since last start
  try {
    logger.log('Ensuring default settings');
    const [def, created] = await Guild.upsert({
      id: 'default',
      ...defaultSettings
    });
    if (!def) throw new Error('Operation failed');
    global.cache.guilds.set('default', def.dataValues);
    logger.log(`Default settings ${created ? 'created' : 'loaded'}`);
  } catch (err) {
    logger.error(err)
    logger.error('Encountered an error while ensuring defaults, exiting process');
    process.exit(1);
  }

  logger.ready(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`);
  client.user.setPresence({ activities: [{ name: `${defaultSettings.prefix} help` }], type: 'PLAYING' });
};
