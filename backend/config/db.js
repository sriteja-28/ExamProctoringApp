const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8',
    },
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
    logging: false, 
  }
);

module.exports = sequelize;
