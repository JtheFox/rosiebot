const { getAllChampions, getAllItems } = require('../utils/ddragon.js');
const { arrayRandom, indexRandom } = require('../utils/helpers.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { joinImages } = require('join-images');
const axios = require('axios');

exports.run = async (client, interaction) => {
  const replyEmbed = new EmbedBuilder().setColor(interaction.settings.embedColor);

  switch (interaction.options._subcommand) {
    case 'champion':
      const champList = await getAllChampions();
      const { name, title, version, id } = arrayRandom(champList);
      replyEmbed
        .setAuthor({ name: 'View on U.GG', url: `https://u.gg/lol/champions/${name.replace(' ', '')}/build` })
        .setTitle(name)
        .setDescription(title.charAt(0).toUpperCase() + title.slice(1))
        .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${id}.png`)
      await interaction.reply({ embeds: [replyEmbed] });
      break;
    case 'items':
      const getImgUrl = ({ image }) => `http://ddragon.leagueoflegends.com/cdn/${global.ddragVersion}/img/item/${image.full}`
      const items = await getAllItems();
      const { boots, mythic, legendary } = items;
      const build = [];
      let buildName = '';
      let randInd = indexRandom(boots);
      build.push(getImgUrl(boots[randInd]));
      buildName += '🥾 ' + boots[randInd].name + '\n';
      randInd = indexRandom(mythic);
      build.push(getImgUrl(mythic[randInd]));
      buildName += '👑 ' + mythic[randInd].name + '\n';
      const legendaryBuild = Array.from(legendary);
      for (let i = 0; i < 4; i++) {
        randInd = indexRandom(legendaryBuild);
        const [item] = legendaryBuild.splice(randInd, 1);
        build.push(getImgUrl(item));
        buildName += '⚔ ' + item.name + '\n';
      }
      const buffers = await Promise.all(build.map(async (url) => {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
      }));
      const buildImg = await joinImages(buffers, { direction: 'horizontal' });
      await buildImg.toFile('assets/build.png');
      const buildAtt = new AttachmentBuilder('./assets/build.png');
      replyEmbed
        .setTitle(buildName)
        .setImage('attachment://build.png')
      await interaction.reply({ embeds: [replyEmbed], files: [buildAtt] });
      break;
    case 'runes':
      break;
    default: throw new Error('Invalid option');
  }
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