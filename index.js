// Imports
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const { readdir } = require('fs').promises;
const logger = require('./utils/logger.js');
const { token, intents, partials, permLevels } = require('./config.js');
const db = require('./utils/connection.js');

// Instantiate client
const client = new Client({ intents, partials });

// Instantiate commands collections
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

// Store things in a single property of the client
client.container = {
  commands,
  aliases,
  slashcmds
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
  // logger.log(`Loading ${slashFiles.length} commands`);
  // slashFiles.filter(file => file.endsWith('.js')).forEach(slash => {
  //   try {
  //     logger.log(`Loading Slash Command: ${slash}`);
  //     const props = require(`./slash/${slash}`);
  //     client.container.slashcmds.set(props.commandData.name, props);
  //   } catch (err) {
  //     logger.error(`Failed to load command ${command}: ${err}`);
  //   }
  // });

  // Load events
  logger.log(`Loading ${evtFiles.length} events`);
  evtFiles.filter(file => file.endsWith('.js')).forEach(file => {
    const eventName = file.split('.')[0];
    logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  });

  // Login the client after connection to db
  db.once('open', () => {
    client.login(process.env.BOT_TOKEN,);
  });
}

init();