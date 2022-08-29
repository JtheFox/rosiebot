const { EmbedBuilder } = require('discord.js');
// Help command
exports.run = async (client, message, args) => {
  // Destructuring for shorter code
  const { container } = client;
  const { prefix, embedColor } = message.settings;

  // Initialize output embed
  let output = new EmbedBuilder().setColor(embedColor)

  // Filter enabled and guildOnly commands (if applicable)
  const commandName = args[0];
  const commandList = message.guild ?
    container.commands.filter(cmd => cmd.config.enabled === true) :
    container.commands.filter(cmd => cmd.config.enabled === true && cmd.conf.guildOnly === false);

  // If no command specified show all commands
  if (!commandName) {
    // Begin creating display output
    output.setTitle(`Command List | Prefix: \`${prefix}\` `).setDescription(`Use \`${prefix}help <command>\` for more details\nAlso check out [Rosiebot Docs](https://jthefox.github.io/rosiebot)`);
    // Add available commands to display output
    commandList.sort().forEach(cmd => {
      const { name, description } = cmd.config;
      output.addFields({ name: name, value: !description.length ? 'No description provided' : description });
    });
  } else {
    // Check if command exists
    commandHelp = commandList.find(cmd => cmd.config.name === commandName);
    if (!commandHelp) return message.reply('This command is not available');
    // Create display output for command details
    const { name, description, alias, usage } = commandHelp.config;
    output
      .setTitle(name)
      .setDescription(!description.length ? 'No description provided' : description)
      .addFields(
        { name: 'Aliases', value: alias.join(', ') },
        { name: 'Usage', value: `\`${usage}\`` }
      );
  }
  // Reply with help embed
  message.reply({ embeds: [output] });
};

exports.config = {
  name: 'help',
  alias: ['h'],
  description: 'Display all commands or show details for a specific command',
  usage: 'help <command>',
  enabled: true,
  guildOnly: false,
  permLevel: 'User',
};