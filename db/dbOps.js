const logger = require('../utils/logger');
const { Guild, User, GuildMember } = require('./models');
const { Op } = require('sequelize');

const logCreated = (created, type) => {
  logger.log(`${type} ${created ? 'added to' : 'found/updated in'} the database`)
}

// Precheck to find or create user in the database
const ensureUser = async (userId) => {
  try {
    const [user, created] = await User.findOrCreate({
      where: { id: userId },
      include: Guild
    });
    if (!user) throw new Error('Operation failed');
    logCreated(created, 'User');
    return user;
  } catch (err) {
    logger.error(err);
  }
}

// Precheck to find or create guild in the database
const ensureGuild = async (guildId) => {
  try {
    const [guild, created] = await Guild.findOrCreate({
      where: { id: guildId },
      include: User
    });
    if (!guild) throw new Error('Operation failed');
    logCreated(created, 'Guild');
    return guild;
  } catch (err) {
    logger.error(err);
  }
}

// Update or create guild in the database
const updateGuild = async (guildId, settings = {}) => {
  try {
    const [guild, created] = await Guild.upsert({
      id: guildId,
      ...settings
    });
    if (!guild) throw new Error('Operation failed');
    logCreated(created, 'Guild');
  } catch (err) {
    logger.error(err);
  }
}

const deleteGuild = async (guildId) => {
  logger.log('Removing Guild from the database');
  await GuildMember.destroy({ where: { guildId: guildId } });
  await Guild.destroy({ where: { id: guildId } });
  logger.log('Guild successfully removed from database');
}

// Precheck to find or create guild member in the join table
const ensureGuildMember = async (guildId, userId) => {
  try {
    await ensureGuild(guildId);
    await ensureUser(userId);
    const [member, created] = await GuildMember.findOrCreate({ where: { guildId: guildId, userId: userId } })
    if (!member) throw new Error('Operation failed');
    logCreated(created, 'GuildMember');
    return (member);
  } catch (err) {
    logger.error(err);
  }
}

// Delete guild member from the join table
const deleteGuildMember = async (guildId, userId) => {
  try {
    logger.log('Removing GuildMember from the database');
    await GuildMember.destroy({ where: { guildId: guildId, userId: userId } });
    logger.log('GuildMember successfully removed from database');
  } catch (err) {
    logger.error(err);
  }
}

// Update guild member data for betting feature
const payoutBet = async (guildId, [winners = [], losers = []]) => {
  try {
    const guild = await GuildMember.findAll()
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
  }
}

module.exports = { ensureUser, ensureGuild, updateGuild, deleteGuild, ensureGuildMember, deleteGuildMember, payoutBet }