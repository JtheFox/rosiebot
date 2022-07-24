const { getAllChampions } = require('../utils/ddragon.js');
const { arrayRandom } = require('../utils/helpers.js');
const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
  const champList = await getAllChampions();
  const randChamp = arrayRandom(champList);
  const champEmbed = new EmbedBuilder()
    .setColor(message.settings.embedColor)
    .setTitle(randChamp.name)
    .setDescription(randChamp.title.charAt(0).toUpperCase() + randChamp.title.slice(1))
    .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${randChamp.version}/img/champion/${randChamp.id}.png`);
  message.reply({ embeds: [champEmbed] })
};

exports.config = {
  name: 'random',
  alias: ['r', 'rc'],
  description: 'Generates a random League of Legends champion',
  usage: 'random',
  enabled: true,
  guildOnly: false,
  permLevel: 'User',
};