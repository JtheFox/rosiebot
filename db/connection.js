const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.RDS_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD,
  {
    host: process.env.RDS_HOST,
    dialect: 'mysql',
    port: process.env.RDS_PORT
  }
);

module.exports = sequelize;