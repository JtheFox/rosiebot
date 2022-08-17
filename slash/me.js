const logger = require('../utils/logger');
const moment = require('moment');
const { EmbedBuilder } = require('discord.js');
const { ensureGuildMember } = require('../db/dbOps');

exports.run = async (client, interaction) => {
  // Initialize and descture variables
  const { guild, member, user } = interaction;
  const { emojis } = client.container;

  try {
    const dbMemberData = await ensureGuildMember(guild.id, member.user.id);
    const { betWins, betLosses } = dbMemberData.get({ plain: true });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: member.nickname, iconURL: member.displayAvatarURL() })
          .setTitle(user.name)
          .setDescription(`User since ${moment(user.createdAt).format('LL')} (${moment(user.createdAt).fromNow()})`)
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            { name: 'Betting' },
            { name: 'Wins', value: `${betWins}`, inline: true },
            { name: 'Losses', value: `${betLosses}`, inline: true },
          )
          .setFooter({ name: `Member of ${guild.name} since ${moment(member.joinedAt).format('LL')}`, iconURL: guild.iconURL() })
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