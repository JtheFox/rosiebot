const logger = require('../utils/logger.js');
const { getSettings } = require('../utils/helpers.js');
const { embedColor, permLevels } = require('../config.js');
// On message received
module.exports = async (client, message) => {
  const { container } = client;
  // Ignore bots
  if (message.author.bot) return;

  // Get settings for prefix
  message.settings = await getSettings(message.guild);
  message.settings.embedColor = embedColor;
  
  // Reply with prefix if bot was mentioned
  const prefixMention = new RegExp(`^<@!?${client.user.id}> ?$`);
  if (message.content.match(prefixMention)) return message.reply(`My prefix is \`${message.settings.prefix}\``);

  // Stop execution if prefix is not used
  const prefix = new RegExp(`^<@!?${client.user.id}> |^\\${message.settings.prefix}`).exec(message.content);
  if (!prefix) return;

  // Split command and args
  const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Check if command exists
  const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));
  if (!cmd) return;

  // Fetch non-cached/invisible guild members
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);

  // Check for guildOnly requirement
  if (cmd && !message.guild && cmd.conf.guildOnly) return message.reply('This command can only be run in a server');

  // Validate perm level for command
  const permLvl = permLevels.filter(level => level.name === cmd.config.permLevel)[0];
  if (!permLvl.check(message)) return message.reply('You do not have permission to use this command');

  // Check for -flags in message
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }

  // Run the command
  logger.cmd(`${message.author.username} (${message.author.id}) ran command ${cmd.config.name}${message.guild ? ` in ${message.guild.name} (${message.guild.id})` : ''}`);
  cmd.run(client, message, args);
};
