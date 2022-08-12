const logger = require('../utils/logger.js');
const { Guild } = require('../db/models');
const config = require('../config.js');

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
    let settings;
    if (guild) settings = await Guild.findByPk(guild.id);
    if (!guild || !settings) settings = await Guild.findByPk('default');
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
}