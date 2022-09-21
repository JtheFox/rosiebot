const { getAllChampions } = require('../utils/ddragon.js');
const { arrayRandom } = require('../utils/helpers.js');
const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
  const champList = await getAllChampions();
  const { name, alias, id } = arrayRandom(champList);
  const champEmbed = new EmbedBuilder()
    .setColor(message.settings.embedColor)
    .setAuthor({ name: 'View on U.GG', url: `https://u.gg/lol/champions/${alias}/build` })
    .setTitle(name)
    // .setDescription(title.charAt(0).toUpperCase() + title.slice(1))
    .setThumbnail('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/' + id + '.png')
  message.channel.send({ embeds: [champEmbed] })
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