require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'druvika',
    password: process.env.DB_PASSWORD || 'druvika',
    database: process.env.DB_NAME || 'invoice_system',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'mvp_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'mvp_prod',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false
  }
}; 