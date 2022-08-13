const { Guild, User, GuildMember } = require('../models');
const logger = require('../utils/logger.js');

const ensureUser = async (userId) => {
  try {
    const [user, created] = await User.findOrCreate({
      userId: userId
    });
    if (!user) throw new Error('Operation failed');
    created ? logger.log('User created') : logger.log('User found');
    return user;
  } catch (err) {
    logger.error(err);
    return err;
  }
}

const ensureGuild = async (guildId) => {
  try {
    const [guild, created] = await Guild.findOrCreate({
      guildId: guildId
    });
    if (!guild) throw new Error('Operation failed');
    created ? logger.log('Guild created') : logger.log('Guild found');
    return guild;
  } catch (err) {
    logger.error(err);
    return err;
  }
}

const updateGuild = async (guildId, settings = {}) => {
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
}

const ensureGuildMember = async (guildId, userId) => {
  try {
    const guild = await ensureGuild(guildId);
    const user = await ensureUser(userId);
    if (!guild || !user) throw new Error('Operation failed');
    if (!guild.hasUser(user)) await guild.addUser(user, { through: {} });
  } catch (err) {
    logger.error(err);
    return err;
  }
}

const deleteGuildMember = async (guildId, userId) => {
  try {
    const guild = await ensureGuild(guildId);
    const user = await ensureUser(userId);
    if (!guild || !user) throw new Error('Operation failed');
    if (guild.hasUser(user)) await guild.removeUser(user, { through: {} });
  } catch (err) {
    logger.error(err);
    return err;
  }
}

const payoutBet = async (guildId, winners = [], losers = []) => {
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

module.exports = { ensureUser, ensureGuild, updateGuild, ensureGuildMember, deleteGuildMember, payoutBet }