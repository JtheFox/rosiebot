const { arrayRandom } = require('../utils/helpers.js');

exports.run = async (client, message, args) => {
  const choices = args.join(' ').split('|').map(e => e.trim()).filter(e => !/^\s?$/.test(e));
  console.log(choices)
  const choice = arrayRandom(choices);
  await message.reply(`I choose **${choice}**`);
};

exports.config = {
  name: 'choose',
  alias: [],
  description: 'Choose a random item from a list, separated by |',
  usage: 'choose red | orange | yellow | green',
  enabled: true,
  guildOnly: false,
  permLevel: 'User',
};