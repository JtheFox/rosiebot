const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = process.env.DB_ENV === 'local' ?
  new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  })
  : new Sequelize(
    process.env.RDS_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD,
    {
      host: process.env.RDS_HOST,
      dialect: 'mysql',
      port: process.env.RDS_PORT,
      logging: false
    }
  );

module.exports = sequelize;