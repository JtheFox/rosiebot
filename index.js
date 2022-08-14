// Imports
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const { readdir } = require('fs').promises;
const logger = require('./utils/logger.js');
const { intents, partials, permLevels } = require('./config.js');
const sequelize = require('./db/connection.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

// Instantiate client
const client = new Client({ intents, partials });

// Instantiate commands collections
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

// Create map for guild bets
global.bets = new Map();

// Store things in a single property of the client
client.container = {
  commands,
  aliases,
  slashcmds,
};

// Init function
const init = async () => {
  // Read commands and events directories
  const [cmdFiles, slashFiles, evtFiles] = await Promise.all([readdir('./commands'), readdir('./slash'), readdir('./events')]);

  // Load commands
  logger.log(`Loading ${cmdFiles.length} commands`);
  cmdFiles.filter(file => file.endsWith('.js')).forEach(command => {
    try {
      logger.log(`Loading Command: ${command}`);
      const props = require(`./commands/${command}`);
      client.container.commands.set(props.config.name, props);
      props.config.alias.forEach(alias => client.container.aliases.set(alias, props.config.name));
    } catch (err) {
      logger.error(`Failed to load command ${command}: ${err}`);
    }
  });

  // Load slash commands
  logger.log(`Loading ${slashFiles.length} commands`);
  slashFiles.filter(file => file.endsWith('.js')).forEach(slash => {
    try {
      logger.log(`Loading Slash Command: ${slash}`);
      const props = require(`./slash/${slash}`);
      client.container.slashcmds.set(props.cmd.name, props);
    } catch (err) {
      logger.error(`Failed to load slash command ${slash}: ${err}`);
    }
  });

  // Load events
  logger.log(`Loading ${evtFiles.length} events`);
  evtFiles.filter(file => file.endsWith('.js')).forEach(file => {
    try {
      const eventName = file.split('.')[0];
      logger.log(`Loading Event: ${eventName}`);
      const event = require(`./events/${file}`);
      client.on(eventName, event.bind(null, client));
    } catch (err) {
      logger.error(`Failed to load event ${file}: ${err}`);
    }
  });

  // Ensure database connection
  try {
    await sequelize.authenticate();
    logger.log('Connection to the database has been established successfully.');
  } catch (error) {
    logger.error(['Unable to connect to the database:', error]);
    process.exit(1);
  }

  // Login the client after connection to db
  sequelize.sync({ force: false }).then(async () => {
    await client.login(process.env.BOT_TOKEN);
    // Put slash command routes
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    try {
      logger.log('Putting global slash command routes');
      await rest.put(
        Routes.applicationCommands(client.application.id),
        { body: commands.values() },
      );
      logger.log('Global slash command routes put successfully')
    } catch (err) {
      logger.error(`Error putting slash command routes: ${err.stack}`);
    }
  });
}

init();