const logger = require('../utils/logger');
const sequelize = require('../db/connection');

exports.forceSync = async () => {
  logger.log('Syncing all tables...');
  await sequelize.sync({force: true});
  logger.log('Sync complete');
}