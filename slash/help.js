const { EmbedBuilder } = require('discord.js');

exports.run = async (client, interaction) => {
  const { embedColor } = interaction.settings;

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('Check out [Rosiebot Docs](https://jthefox.github.io/rosiebot)')
    ], ephemeral: true
  })
}

exports.cmd = {
  "name": "help",
  "description": "Rosiebot help",
  "dm_permission": true,
  "options": [],
}