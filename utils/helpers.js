const logger = require('../utils/logger');
const { Guild } = require('../db/models');

// Catch and format logging of unhandled exceptions and rejections
process.on('uncaughtException', err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
  logger.error(errorMsg);
});

process.on('unhandledRejection', err => {
  logger.error(err);
  console.error(err);
});

module.exports = {
  // Get default or guild settings
  getSettings: async (guild) => {
    const id = !guild ? 
      undefined :
      typeof guild === 'string' ? guild : guild.id
    const options = { raw: true, nest: true };
    let settings;
    if (id) settings = await Guild.findByPk(id, options);
    if (!guild || !settings) settings = await Guild.findByPk('default', options);
    return settings;
  },
  // Grab a single reply with 1 minute timeout
  awaitReply: async (message, prompt, limit = 60000) => {
    const filter = msg => msg.author.id === message.author.id;
    await message.channel.send(prompt);
    try {
      const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (err) {
      logger.error(err);
      return false;
    }
  },
  // Get random element from array
  arrayRandom: (arr) => arr[Math.floor(Math.random() * arr.length)],
  // Check if user has admin perms
  isAdmin: (member) => member.permissions.has('ADMINISTRATOR'),
  // Empty line in Discord embed
  embedBreak: { name: '\u200B', value: '\u200B' },
  // Auto pluralize based on length
  pluralize: (str, length) => {
    const len = typeof length === 'number' ? length : length.length;
    str += len === 1 ? '' : 's';
    return str;
  },    
}