const logger = require('../utils/logger');
const { deleteGuildMember } = require('../db/dbOps');
// On member leaving a server
module.exports = async (client, member) => {
  try {
    logger.warn(`User ${member.id} has left ${member.guild.id}`);
    deleteGuildMember(member.guild.id, member.id);
  } catch (err) {
    logger.error(err);
  }
};
