'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

// Initialize Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,  //console.log, // Enable for debugging
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
      paranoid: false // Enable if you want soft deletes
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /TimeoutError/,
        /SequelizeDatabaseError/
      ],
      max: 3, // Maximum number of retries
      backoffBase: 1000, // Initial delay in milliseconds
      backoffExponent: 1.5 // Exponential backoff factor
    }
  });
}

// Phase 1: Load all models first
const modelFiles = [
  // Core models first
  'User.js',
  'Customer.js',
  
  // Product-related models
  'Category.js',
  'Product.js',
  'Tag.js',
  'ProductVariant.js',
  'ProductReview.js',
  'ProductTag.js',
  'ProductHistory.js',
  
  // Promotion models
  'PromotionTemplate.js',
  'Promotion.js',
  'PromotionHistory.js',
  'PromotionSchedule.js',
  'PromotionProduct.js',
  
  // Order & Invoice models
  'Order.js',
  'OrderItem.js',
  'Invoice.js',
  'InvoiceItem.js',
  'InvoiceHistory.js',
  
  // Payment models
  'Payment.js',
  'PaymentStatus.js',
  
  // Inventory
  'InventoryTransaction.js',
  
  // Notification
  'Notification.js',
  'NotificationTemplate.js',
  'WhatsappTemplate.js',
  'WhatsappMessage.js'
];

modelFiles.forEach(file => {
  try {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    // console.log(`Loaded model: ${model.name}`);
  } catch (error) {
    console.error(`Error loading model ${file}:`, error);
    throw error; // Fail fast in development
  }
});

// Phase 2: Set up associations
Object.keys(db).forEach(modelName => {
  try {
    if (typeof db[modelName].associate === 'function') {
      // console.log(`Setting associations for ${modelName}`);
      db[modelName].associate(db);
    }
  } catch (error) {
    console.error(`Error setting associations for ${modelName}:`, error);
    throw error;
  }
});

// Phase 3: Database sync with safety checks
// const initializeDatabase = async (options = {}) => {
//   const maxRetries = 3;
//   let retryCount = 0;

//   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//   // const shouldForceSync = process.env.NODE_ENV === 'test' || options.force === true;
//   // const shouldAlterSync = process.env.NODE_ENV !== 'production' && options.alter === true;

//   // const syncOptions = {
//   //   force: shouldForceSync,
//   //   alter: shouldAlterSync,
//   //   logging: console.log,
//   //   hooks: true
//   // };

//   // if (process.env.NODE_ENV === 'production' && shouldForceSync) {
//   //   throw new Error('❌ Force sync is not allowed in production environment.');
//   // }

//   const attemptConnection = async () => {
//     try {
//       await sequelize.authenticate();
//       console.log('✅ Database connection established.');

//       await sequelize.sync(syncOptions);
//       console.log('✅ Database synchronized successfully.');
//       return true;

//     } catch (error) {
//       retryCount++;
//       if (retryCount <= maxRetries) {
//         const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
//         console.warn(
//           `Database connection attempt ${retryCount} failed. ` +
//           `Retrying in ${waitTime/1000} seconds... Error: ${error.message}`
//         );
//         await delay(waitTime);
//         return attemptConnection();
//       } else {
//         console.error('Database connection failed after max retries:', error);
//         throw error;
//       }
//     }
//   };

//   try {
//     await attemptConnection();
//   } catch (err) {
//     console.error('Database initialization failed:', err);
//     throw err;
//   }
// };

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initializeDatabase = async (options = {}) => {
  const maxRetries = 3;
  let retryCount = 0;

  const attemptConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection established.');

      // const syncOptions = {
      //   force: process.env.NODE_ENV === 'test' || options.force === true,
      //   alter: process.env.NODE_ENV !== 'production' && options.alter === true,
      //   logging: console.log,
      //   hooks: true
      // };

      // if (process.env.NODE_ENV === 'production' && syncOptions.force) {
      //   throw new Error('Force sync is not allowed in production');
      // }

      await sequelize.sync();
      console.log('Database synchronized successfully.');

      return true;
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
        
        console.warn(
          `Database connection attempt ${retryCount} failed. ` +
          `Retrying in ${waitTime/1000} seconds... Error: ${error.message}`
        );
        
        await delay(waitTime)
        return attemptConnection();
      }
      
      console.error('Failed to connect to the database after multiple retries:', error);
      throw error;
    }
  };

  try {
    await attemptConnection();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.initializeDatabase = initializeDatabase;

module.exports = db;





















// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.js')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, {
//     host: config.host,
//     dialect: config.dialect,
//     logging: false,
//     define: {
//       underscored: true,
//       freezeTableName: true,
//       timestamps: true
//     }
//   });
// }

// // // Load models in specific order to handle dependencies
// // const modelFiles = [
// //   'User.js',
// //   'Customer.js',
// //   'Category.js',
// //   'Product.js',
// //   'Tag.js',
// //   'ProductVariant.js',
// //   'ProductTag.js',
// //   'PromotionTemplate.js',
// //   'Promotion.js',
// //   'PromotionHistory.js',
// //   'PromotionSchedule.js',
// //   'PromotionProduct.js',
// //   'Order.js',
// //   'OrderItem.js',
// //   'Invoice.js',
// //   'InvoiceItem.js',
// //   'InvoiceHistory.js',
// //   'Payment.js',
// //   'PaymentStatus.js',
// //   'InventoryTransaction.js',
// //   'Notification.js',
// //   'NotificationTemplate.js',
// //   'WhatsappTemplate.js',
// //   'WhatsappMessage.js'
// // ];

// // // First, load all models
// // modelFiles.forEach(file => {
// //   const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
// //   db[model.name] = model;
// // });


// fs
// .readdirSync(__dirname)
// .filter(file => {
//   return (
//     file.indexOf('.') !== 0 &&
//     file !== basename &&
//     file.slice(-3) === '.js' &&
//     file.indexOf('.test.js') === -1
//   );
// })
// .forEach(file => {
//   const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//   db[model.name] = model;
// });

// console.log("db loaded=====>", db);

// // Then, set up associations
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// // Database connection and sync
// const initializeDatabase = async () => {
//   try {
//     // Test the connection
//     await sequelize.authenticate();
//     console.log('Database connection has been established successfully.');

//     await sequelize.sync({
//       force: true,  // Drops all tables and recreates them
//       alter: false,
//       logging: console.log
//     });
//     console.log('All models were synchronized successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     throw error;
//   }
// };

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// db.initializeDatabase = initializeDatabase;

// module.exports = db;

