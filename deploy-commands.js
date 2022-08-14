const { readdir } = require('fs').promises;
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();
const logger = require('./utils/logger');

const deploy = async () => {
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

  // Put slash command routes
  logger.log(`Deploying ${commands.length} commands`);
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  try {
    logger.log('Sending put request for slash commands');
    const res = await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: commands },
    );
    logger.log(res)
    logger.ready('Slash commands deployed');
  } catch (err) {
    logger.error(`Error deploying slash commands: ${err.stack}`);
  }
}

deploy();