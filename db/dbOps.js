const logger = require('../utils/logger.js');
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

// Precheck to find or create guild member in the join table
const ensureGuildMember = async (guildId, userId) => {
  try {
    const [member, created] = await GuildMember.findOrCreate({ where: { guildId: guildId, userId: userId } })
    if (!member) throw new Error('Operation failed');
    logCreated(created, 'GuildMember');
  } catch (err) {
    logger.error(err);
  }
}

// Delete guild member from the join table
const deleteGuildMember = async (guildId, userId) => {
  try {
    const guild = await ensureGuild(guildId);
    const user = await ensureUser(userId);
    if (!guild || !user) throw new Error('Operation failed');
    if (guild.hasUser(user)) await guild.removeUser(user, { through: {} });
  } catch (err) {
    logger.error(err);
  }
}

// Update guild member data for betting feature
const payoutBet = async (guildId, [winners = [], losers = []]) => {
  try {
    const guild = await GuildMember.findAll()
    logger.log(guild)
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

module.exports = { ensureUser, ensureGuild, updateGuild, ensureGuildMember, deleteGuildMember, payoutBet }