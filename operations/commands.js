require('dotenv').config();
const logger = require('../utils/logger');
const { readdir } = require('fs').promises;
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// Deploy slash commands to Discord
exports.deployCmds = async () => {
  // Read slash directory
  const commands = [];
  const dirPath = path.join(__dirname, '..', 'slash');
  const cmdFiles = await readdir(dirPath)

  // Load slash commands
  logger.log(`Loading ${cmdFiles.length} commands`);
  cmdFiles.filter(file => file.endsWith('.js')).forEach(file => {
    try {
      logger.log(`Loading Command: ${file}`);
      const filePath = path.join(dirPath, file)
      const { cmd } = require(filePath);
      commands.push(cmd);
    } catch (err) {
      logger.error(`Failed to load slash command ${file}: ${err}`);
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
exports.retrieveCmds = async () => {
  try {
    logger.log('Sending get request for slash commands');
    const res = await rest.get(Routes.applicationCommands(process.env.APP_ID));
    logger.log(JSON.stringify(res, null, 2));
  } catch (err) {
    logger.error(`Error deploying slash commands: ${err.stack}`);
  }
}