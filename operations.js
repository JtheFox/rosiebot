require('dotenv').config();
const { Client } = require('discord.js');
const logger = require('./utils/logger.js');
const { intents, partials } = require('./config.js');
const client = new Client({ intents, partials });

// TODO: Change this into an inquirer based interface
const init = async () => {
  logger.log('Logging in the client');
  await client.login(process.env.BOT_TOKEN);
  logger.log('Client logged in, performing operations...');
  try {
    leaveGuild('578648253235724317');
  } catch (err) {
    logger.error(err);
  }
}

// Perform specific operations on the bot
const leaveGuild = (guildId) => {
  client.guilds.cache.get(guildId).leave();
}

init();