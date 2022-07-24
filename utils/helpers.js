const logger = require('./logger.js');
const { Guild } = require('./models.js');
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
    if (guild) settings = await Guild.findOne({ guildId: guild.id });
    if (!guild || !settings) settings = await Guild.findOne({ guildId: 'default' });
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
  }
}