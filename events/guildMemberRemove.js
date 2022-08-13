const logger = require('../utils/logger');
const { deleteGuildMember } = require('../db/dbOps');
// On member leaving a server
module.exports = async (client, member) => {
  try {
    await deleteGuildMember(member.guild.id, member.id);
    logger.warn('GuildMember successfully deleted from database', member.id)
  } catch (err) {
    logger.error(['Failed to delete GuildMember', member.id, err]);
  }
};
