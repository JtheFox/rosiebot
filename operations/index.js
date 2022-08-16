// Module imports
require('dotenv').config();
const inquirer = require('inquirer');
const logger = require('../utils/logger.js');
const { Client } = require('discord.js');
const { intents, partials } = require('../config.js');
const client = new Client({ intents, partials });
// Operations imports
const { deployCmds, retrieveCmds } = require('./commands.js');
const { leaveGuild, viewGuilds } = require('./guilds.js');
const { viewEmojis } = require('./emojis.js');

// Create internal operations to handle prompt inputs
const exit = () => {
  logger.log('Exiting operations');
  process.exit(0);
}

const promptGuildId = async () => {
  const guildId = await inquirer.prompt({
    type: 'input',
    name: 'value',
    message: 'Enter the id of the guild for the bot to leave:'
  });
  return guildId.value;
}

const promptContinue = async () => {
  await inquirer.prompt({
    type: 'input',
    name: 'value',
    message: 'Press enter to continue'
  });
}

const init = async () => {
  try {
    const choice = await inquirer.prompt({
      type: 'list',
      name: 'value',
      message: 'What do you want to do?',
      choices: [
        { name: 'Deploy slash commands', value: 'deployCmds' },
        { name: 'View deployed slash commands', value: 'retrieveCmds' },
        { name: 'View guilds', value: 'viewGuilds' },
        { name: 'Leave guild', value: 'leaveGuild' },
        { name: 'View emojis', value: 'viewEmojis' },
        { name: 'Exit', value: 'exit' }
      ]
    });

    switch (choice.value) {
      case 'deployCmds':
        await deployCmds();
        break;
      case 'retrieveCmds':
        await retrieveCmds();
        break;
      case 'viewGuilds':
        await viewGuilds(client);
        break;
      case 'leaveGuild':
        const guildId = await promptGuildId();
        await leaveGuild(client, guildId);
        break;
      case 'viewEmojis':
        await viewEmojis(client);
        break;
      case 'exit':
        exit();
        break;
      default: throw new Error('No choice provided');
    }

    await promptContinue();
    init();
  } catch (err) {
    logger.error(err);
    await promptContinue();
    init();
  }
}

(async () => {
  logger.log('Logging in the client...');
  await client.login(process.env.BOT_TOKEN);
  logger.ready('Client logged in successfully\n');
  init();
})();