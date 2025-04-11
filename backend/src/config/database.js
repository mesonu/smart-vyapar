const { Sequelize } = require('sequelize');
const config = require('../../config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: {
      underscored: true,
      timestamps: true,
      paranoid: true
    }
  }
);

module.exports = sequelize; 