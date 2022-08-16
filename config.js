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
  emojis: {
    success: '<:success:868928333101023232>',
    fail: '<:fail:868928333096824882>',
    warn: '<:fail:868928333096824882>',
    betOption1: '<:betOption1:869114178386927687>',
    betOption2: '<:betOption2:869114234083094558>',
    betUsers1: '<:betUsers1:869067283643924540>',
    betUsers2: '<:betUsers2:869067283748753458>',
    medalWin: '<:medalWin:869067283748753458>',
  },
}

module.exports = config;