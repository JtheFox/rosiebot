const logger = require('../utils/logger');
const moment = require('moment');
const { EmbedBuilder } = require('discord.js');
const { ensureGuildMember } = require('../db/dbOps');
const { embedBreak } = require('../utils/helpers');

exports.run = async (client, interaction) => {
  // Initialize and descture variables
  const { guild, member, user, settings } = interaction;
  const { emojis } = client.container;

  try {
    const dbMemberData = await ensureGuildMember(guild.id, member.user.id);
    const { betWins, betLosses } = dbMemberData.get({ plain: true });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(settings.embedColor)
          .setAuthor({ name: user.tag, iconURL: member.displayAvatarURL() })
          .setDescription(`Member of **${guild.name}** since\n${moment(member.joinedAt).format('LL')} (${moment(member.joinedAt).fromNow()})`)
          .addFields(
            { ...embedBreak, inline: true },
            { name: 'Betting', value: `Wins: ${betWins}\nLosses: ${betLosses}`, inline: true },
            { ...embedBreak, inline: true },
          )
          .setFooter({ text: `User since ${moment(user.createdAt).format('LL')}`, iconURL: user.displayAvatarURL() })
      ]
    })
  } catch (err) {
    logger.error(err);
    await interaction.reply({ content: `${emojis['fail']} An error occurred while running this command`, ephemeral: true })
  }
}

exports.cmd = {
  "name": "me",
  "description": "View your server profile",
  "dm_permission": false,
  "options": [],
}