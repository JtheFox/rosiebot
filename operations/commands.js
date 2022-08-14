const { readdir } = require('fs').promises;
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();
const logger = require('../utils/logger');
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// Deploy slash commands to Discord
exports.deploy = async () => {
  // Read slash directory
  const commands = [];
  const cmdFiles = await readdir('./slash')
  
  // Load slash commands
  logger.log(`Loading ${cmdFiles.length} commands`);
  cmdFiles.filter(file => file.endsWith('.js')).forEach(slash => {
    try {
      logger.log(`Loading Command: ${slash}`);
      const { cmd } = require(`./slash/${slash}`);
      commands.push(cmd);
    } catch (err) {
      logger.error(`Failed to load slash command ${slash}: ${err}`);
    }
  });

  // Put slash commands
  logger.log(`Deploying ${commands.length} commands`);
  try {
    logger.log('Sending put request for slash commands');
    await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: commands },
    );
    logger.ready('Slash commands deployed');
  } catch (err) {
    logger.error(`Error deploying slash commands: ${err.stack}`);
  }
}

// Get slash commands from Discord
exports.retrieve = async () => {
  try {
    logger.log('Sending get request for slash commands');
    const res = await rest.get(Routes.applicationCommands(process.env.APP_ID));
    logger.log(res);
  } catch (err) {
    logger.error(`Error deploying slash commands: ${err.stack}`);
  }
}