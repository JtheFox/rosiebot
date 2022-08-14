const logger = require('../utils/logger.js');

module.exports = async (client, interaction) => {
  logger.log(interaction)
  // Exit if not command
  if (!interaction.isChatInputCommand()) return;

  // Get command name from stored slash commands
  const cmd = client.container.slashcmds.get(interaction.commandName);

  // Exit if not a valid command
  if (!cmd) return;

  // Otherwise, run command
  try {
    await cmd.run(client, interaction);
    logger.log(`${interaction.user.id} ran slash command ${interaction.commandName}`, 'cmd');
  } catch (e) {
    console.error(e);
    if (interaction.replied)
      interaction.followUp({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
        .catch(e => console.error('An error occurred following up on an error', e));
    else
      if (interaction.deferred)
        interaction.editReply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
          .catch(e => console.error('An error occurred following up on an error', e));
      else
        interaction.reply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
          .catch(e => console.error('An error occurred replying on an error', e));
  }
};