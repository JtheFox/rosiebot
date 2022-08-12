const Guild = require('./Guild');
const User = require('./User');
const GuildMember = require('./GuildMember');

Guild.belongsToMany(User, { through: GuildMember });
User.belongsToMany(Guild, { through: GuildMember });

module.exports = { Guild, User, GuildMember }