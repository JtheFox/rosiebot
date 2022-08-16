const Guild = require('./Guild');
const User = require('./User');
const GuildMember = require('./GuildMember');

Guild.belongsToMany(User, { through: GuildMember, foreignKey: 'guildId' });
User.belongsToMany(Guild, { through: GuildMember, foreignKey: 'userId' });

module.exports = { Guild, User, GuildMember }