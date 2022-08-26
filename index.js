// Imports
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const { readdir } = require('fs').promises;
const logger = require('./utils/logger');
const { intents, partials, customEmojis } = require('./config.js');
const sequelize = require('./db/connection.js');
const cron = require('node-cron');
const ddragon = require('./utils/ddragon');
const server = require('./server');

// Instantiate client
const client = new Client({ intents, partials });

// Instantiate commands collections
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

// Emoji search function
const emojis = (key) => {
  return Object.keys(customEmojis).includes(key) ?
    client.emojis.cache.get(customEmojis[key]) :
    client.emojis.cache.find(e => e.name === key || e.id === key);
}

// Create map for guild bets
global.bets = new Map();

// Store things in a single property of the client
client.container = {
  commands,
  aliases,
  slashcmds,
  emojis
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
    await sequelize.sync({ force: false });
    logger.log('Database connection and sync successful.');
  } catch (error) {
    logger.error(['Unable to connect to the database:', error]);
    process.exit(1);
  }

  // Schedule LoL version checker
  logger.log('Getting latest Datadragon version');
  global.ddragVersion = await ddragon.getLatestVersion();
  cron.schedule('* * * * Thursday', async () => {
    console.log('Checking for new LoL game version');
    global.ddragVersion = await ddragon.getLatestVersion();
  });

  // Login the client and start the api
  try {
    await Promise.race([
      client.login(process.env.BOT_TOKEN),
      new Promise((_r, rej) => setTimeout(() => rej('No login detected after 30 seconds'), 1000 * 30))
    ]);
    logger.log('Client login successful');
    await server.start(client);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

init();