const db = require('./connection.js');
const { Guild, User, GuildMember } = require('../models');
const logger = require('../utils/logger.js');

module.exports = {
  updateGuild: async (guildId, settings = {}) => {
    try {
      const [guild, created] = await Guild.upsert({
        guildId: guildId,
        ...settings
      });
      if (!guild) throw new Error('Operation failed');
      created ? logger.log('Guild added to database') : logger.log('Guild updated in database');
    } catch (err) {
      logger.error(err);
      return err;
    }
  },
  updateUser: async (userId) => {
    try {
      const [user, created] = await User.upsert({
        userId: userId
      });
      if (!user) throw new Error('Operation failed');
      created ? logger.log('User added to database') : logger.log('User updated in database');
    } catch (err) {
      logger.error(err);
      return err;
    }
  },
  updateGuildMember: async (guildId, userId, data = {}) => {
    try {
      const [guildMember, created] = await GuildMember.upsert({
        id: guildId + userId,
        ...data
      });
      if (!guildMember) throw new Error('Operation failed');
      created ? logger.log('GuildMember added to database') : logger.log('GuildMember updated in database');
    } catch (err) {
      logger.error(err);
      return err;
    }
  },
  payoutBet: async (guildId, winners = [], losers = []) => {
    try {
      winners.length && GuildMember.increment('betWins', {
        by: 1,
        where: {
          guildId: guildId,
          userId: {
            [Op.in]: winners
          }
        }
      });
      winners.length && GuildMember.increment('betLosses', {
        by: 1,
        where: {
          guildId: guildId,
          userId: {
            [Op.in]: losers
          }
        }
      });
      logger.log('Bet has been paid out');
    } catch (err) {
      logger.error(err);
      return err;
    }
  }
}