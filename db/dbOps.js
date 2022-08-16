const logger = require('../utils/logger.js');
const { Guild, User, GuildMember } = require('./models');
const { Op } = require('sequelize');

// Precheck to find or create user in the database
const ensureUser = async (userId) => {
  try {
    const [user, created] = await User.findOrCreate({
      where: { userId: userId }
    });
    if (!user) throw new Error('Operation failed');
    created ? logger.log('User created') : logger.log('User found');
    return user;
  } catch (err) {
    logger.error(err);
  }
}

// Precheck to find or create guild in the database
const ensureGuild = async (guildId) => {
  try {
    const [guild, created] = await Guild.findOrCreate({
      where: { guildId: guildId }
    });
    if (!guild) throw new Error('Operation failed');
    created ? logger.log('Guild created') : logger.log('Guild found');
    return guild;
  } catch (err) {
    logger.error(err);
  }
}

// Update or create guild in the database
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
  }
}

// Precheck to find or create guild member in the join table
const ensureGuildMember = async (guildId, userId) => {
  try {
    const guild = await ensureGuild(guildId);
    const user = await ensureUser(userId);
    if (!(guild && user)) throw new Error('Operation failed');
    if (!guild.hasUser(user)) await guild.addUser(user, { through: {} });
    logger.log(guild)
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
    const mems = await GuildMember.findAll();
    logger.log(mems);
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