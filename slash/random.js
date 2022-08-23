const { getAllChampions, getAllItems } = require('../utils/ddragon.js');
const { arrayRandom, indexRandom, countArray } = require('../utils/helpers.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { joinImages } = require('join-images');
const axios = require('axios');

exports.run = async (client, interaction) => {
  // Destructure and initialize variables
  const { emojis } = client.container;
  const { _subcommand, _hoistedOptions } = interaction.options
  const replyEmbed = new EmbedBuilder().setColor(interaction.settings.embedColor);
  const replyFiles = [];

  // Quickchart API
  const getBarChart = ({ label, x_labels, data }) =>
    encodeURI(`https://quickchart.io/chart?bkg=white&c={type:'bar',data:{labels:[${x_labels}],datasets:[{label:'${label}',data:[${data}]}]}}`);

  switch (_subcommand) {
    // Get random League of Legends Champion
    case 'champion':
      const champList = await getAllChampions();
      const { name, title, version, id } = arrayRandom(champList);
      replyEmbed
        .setAuthor({ name: 'View on U.GG', url: `https://u.gg/lol/champions/${name.replace(' ', '')}/build` })
        .setTitle(name)
        .setDescription(title.charAt(0).toUpperCase() + title.slice(1))
        .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${id}.png`)
      break;
    // Get random League of Legends item build
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
      let legendaryItems = legendary.filter(({ name }) => name !== 'The Golden Spatula');
      const manaItems = ["Winter's Approach", "Manamune", "Archangel's Staff"];
      const penItems = ["Serylda's Grudge", "Lord Dominik's Regards"];
      for (let i = 0; i < 4; i++) {
        randInd = indexRandom(legendaryItems);
        const [item] = legendaryItems.splice(randInd, 1);
        if (manaItems.includes(item)) legendaryItems = legendaryItems.filter(({ name }) => manaItems.includes(name));
        if (penItems.includes(item)) legendaryItems = legendaryItems.filter(({ name }) => penItems.includes(name));
        build.push(getImgUrl(item));
        buildName += '⚔ ' + item.name + '\n';
      }
      const buffers = await Promise.all(build.map(async (url) => {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
      }));
      const buildImg = await joinImages(buffers, { direction: 'horizontal' });
      await buildImg.toFile('assets/build.png');
      replyFiles.push(new AttachmentBuilder('./assets/build.png'));
      replyEmbed
        .setTitle(buildName)
        .setImage('attachment://build.png')
      break;
    // TODO: Find a way to get runes data from the datadragon API
    case 'runes':
      throw new Error('This command has not been implemented yet');
    // Flip a coin <1-50> times, default 1
    case 'coinflip':
      const flip = () => Math.ceil(Math.random() * 2);
      const flipsInput = _hoistedOptions[0]?.value;
      const numFlips = flipsInput > 0 && flipsInput <= 50 ? flipsInput : 1;
      const flipResults = [];
      for (let i = 0; i < numFlips; i++) flipResults.push(flip());
      if (flipResults.length === 1) {
        const flipValue = flipResults[0] === 1 ? 'heads' : 'tails';
        replyEmbed
          .setTitle(`You got ${flipValue}`)
          .setDescription(emojis[flipValue])
      } else {
        replyEmbed.setDescription(flipResults.map(r => r === 1 ? emojis['heads'] : emojis['tails']).join(''));
        flipResults.sort((a, b) => a - b);
        const flipCount = countArray(flipResults);
        replyEmbed.addFields([{ name: 'Results', value: `Heads: ${flipCount['1'] || 0}\nTails: ${flipCount['2'] || 0}` }]);
      }
      break;
    // Roll <3-20>-sided die <1-50> times, default 2
    case 'diceroll':
      const roll = (sides) => Math.ceil(Math.random() * sides);
      let sidesInput, rollsInput;
      _hoistedOptions?.forEach(({ name, value }) =>
        name === 'sides' ?
          sidesInput = value > 2 && value < 99 ? value : 6
          : rollsInput = value > 0 && value <= 50 ? value : 2
      );
      sidesInput ??= 6;
      rollsInput ??= 2;
      const rollResults = [];
      for (let i = 0; i < rollsInput; i++) rollResults.push(roll(sidesInput));
      replyEmbed.setDescription(rollResults.map(n => `[${n}]`).join(''));
      if (rollResults.length > 5) { // Display bar chart if more than 10 results
        rollResults.sort((a, b) => a - b);
        const rollCount = countArray(rollResults);
        const rollGraph = getBarChart({
          label: 'Roll',
          x_labels: Object.keys(rollCount),
          data: Object.values(rollCount)
        })
        replyEmbed.setImage(rollGraph);
      }
      break;
    default: throw new Error('Invalid option');
  }

  await interaction.reply({ embeds: [replyEmbed], files: replyFiles })
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
    },
    {
      "type": 1,
      "name": "coinflip",
      "description": "Flip a coin, heads or tails",
      "options": [
        {
          "type": 4,
          "name": "amount",
          "description": "Number of coins to flip (1-50, default 1)"
        }
      ]
    },
    {
      "type": 1,
      "name": "diceroll",
      "description": "Roll the dice",
      "options": [
        {
          "type": 4,
          "name": "sides",
          "description": "Number of sides on the die (3-20, default 6)"
        },
        {
          "type": 4,
          "name": "amount",
          "description": "Number of dice to roll (1-50, default 2)"
        }
      ]
    }
  ]
}