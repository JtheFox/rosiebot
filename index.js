// Imports
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const { readdir } = require('fs').promises;
const logger = require('./utils/logger.js');
const { intents, partials, permLevels } = require('./config.js');
const sequelize = require('./db/connection.js');

// Instantiate client
const client = new Client({ intents, partials });

// Instantiate commands collections
const commands = new Collection();
const aliases = new Collection();

// Create map for guild bets
process.env.BETS = new Map();

// Store things in a single property of the client
client.container = {
  commands,
  aliases,
  bets
};

// Init function
const init = async () => {
  // Read commands and events directories
  const [cmdFiles, evtFiles] = await Promise.all([readdir('./commands'), readdir('./events')]);

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

  // Load events
  logger.log(`Loading ${evtFiles.length} events`);
  evtFiles.filter(file => file.endsWith('.js')).forEach(file => {
    const eventName = file.split('.')[0];
    logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  });

  // Ensure database connection
  try {
    await sequelize.authenticate();
    logger.ready('Connection to the database has been established successfully.');
  } catch (error) {
    logger.error(['Unable to connect to the database:', error]);
    process.exit(1);
  }

  // Login the client after connection to db
  sequelize.sync({ force: false }).then(() => {
    client.login(process.env.BOT_TOKEN,);
  });
}

init();