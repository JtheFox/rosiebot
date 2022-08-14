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
    // Bot operations go here
    await leaveGuild('578648253235724317');

    logger.ready('All operations completed');
    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

// Perform specific operations on the bot
const leaveGuild = async (guildId) => {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    logger.error(`Guild ${guildId} not found`);
    return;
  }
  logger.warn(`Leaving Guild ${guildId}`);
  await guild.leave();
}

init();