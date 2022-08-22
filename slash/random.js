const { getAllChampions, getAllItems } = require('../utils/ddragon.js');
const { arrayRandom } = require('../utils/helpers.js');
const { EmbedBuilder } = require('discord.js');

exports.run = async (client, interaction) => {
  const replyEmbed = new EmbedBuilder();
  console.log(interaction.options)

  switch (interaction.options._subcommand) {
    case 'champion':
      const champList = await getAllChampions();
      const randChamp = arrayRandom(champList);
      replyEmbed
        .setColor(message.settings.embedColor)
        .setTitle(randChamp.name)
        .setDescription(randChamp.title.charAt(0).toUpperCase() + randChamp.title.slice(1))
        .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${randChamp.version}/img/champion/${randChamp.id}.png`);
      break;
    case 'items':
      const items = await getAllItems();
      console.log(items)
      break;
    case 'runes':
      break;
    default: throw new Error('Invalid option');
  }

  await interaction.reply({ embeds: [replyEmbed] });
}

exports.cmd = {
  "name": "random",
  "description": "Get a random thing",
  "dm_permission": true,
  "options": [
    {
      "type": 1,
      "name": "champion",
      "description": "Get a random League of legends champion"
    },
    {
      "type": 1,
      "name": "items",
      "description": "Get a random League of Legends item build"
    }
  ]
}