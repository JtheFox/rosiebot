require('dotenv').config()
const { GatewayIntentBits, Partials } = require('discord.js');

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
      check: (message) => message.guild ? (message.member.permissions.has('ADMINISTRATOR') ? true : false) : false
    },
    {
      level: 8,
      name: 'Bot Owner',
      check: (message) => message.author.id === process.env.OWNER_ID
    },
  ],
}

module.exports = config;