const { Sequelize } = require('sequelize');
const { sequelize } = require('../../src/models');
const { whatsappService } = require('../../src/services/whatsappService');
const env = process.env.NODE_ENV || 'test';
const config = require('../../src/config/config')[env];

// Test database configuration
const testConfig = {
  ...config,
  database: 'invoice_system_test',
  username: 'druvika',
  password: 'druvika',
  host: 'localhost',
  port: 5432,
  logging: false
};

console.log("Test Config:", {
  database: testConfig.database,
  username: testConfig.username,
  host: testConfig.host,
  port: testConfig.port
});

// Setup test environment
beforeAll(async () => {
  try {
    // Create test database if it doesn't exist
    const tempSequelize = new Sequelize({
      database: 'postgres',
      username: 'druvika',
      password: 'druvika',
      host: 'localhost',
      port: 5432,
      dialect: 'postgres'
    });

    // Check if database exists
    const result = await tempSequelize.query(
      "SELECT 1 FROM pg_database WHERE datname = :database",
      {
        replacements: { database: testConfig.database },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    // Create database if it doesn't exist
    if (result.length === 0) {
      await tempSequelize.query(`CREATE DATABASE ${testConfig.database}`);
      console.log(`Created database ${testConfig.database}`);
    }

    await tempSequelize.close();

    // Connect to test database
    await sequelize.authenticate();
    console.log('Test database connection established successfully');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
});

// Clean up after tests
afterAll(async () => {
  try {
    // Close Redis connection
    if (whatsappService && typeof whatsappService.closeRedis === 'function') {
      await whatsappService.closeRedis();
      console.log('Redis connection closed');
    }

    // Close database connection
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});

// Reset database before each test
beforeEach(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Test database reset successfully');
  } catch (error) {
    console.error('Error resetting test database:', error);
    throw error;
  }
});

module.exports = {
  testConfig,
  sequelize
}; 