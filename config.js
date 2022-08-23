require('dotenv').config();
const { GatewayIntentBits, Partials } = require('discord.js');
const { isAdmin } = require('./utils/helpers');

const config = {
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel],
  defaultSettings: {
    prefix: '.rosie ',
    embedColor: '#96baff',
  },
  permLevels: [
    {
      level: 0,
      name: 'User',
      check: () => true
    },
    {
      level: 4,
      name: 'Administrator',
      check: (message) => message.guild ? isAdmin(message.member) : false
    },
    {
      level: 8,
      name: 'Bot Owner',
      check: (message) => message.author.id === process.env.OWNER_ID
    },
  ],
  customEmojis: {
    success: '868928333101023232',
    fail: '868928333096824882',
    warn: '868929112188801024',
    heads: '871808092130664488',
    tails: '871808092092891156',
  },
}

module.exports = config;