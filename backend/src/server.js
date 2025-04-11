const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config/config');
const { initializeDatabase, sequelize } = require('./models');
const app = require('./app');
const logger = require('./utils/logger');

const PORT = config.port || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Configure Socket.IO with security settings
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://smartvyapar.com', 'https://www.smartvyapar.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6, // 1MB
  connectTimeout: 45000,
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  const clientIp = socket.handshake.address;
  logger.info(`New socket connection: ${socket.id} from IP: ${clientIp}`);
  
  socket.on('disconnect', (reason) => {
    logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on('error', (error) => {
    logger.error(`Socket error: ${socket.id}`, error);
  });
});

// Start the server first
const server = httpServer.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
  
  // After server is running, initialize database using the existing function
  try {
    await initializeDatabase();
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    process.exit(1);
  }
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Handle graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server...');
  
  // Close all socket connections
  io.close(() => {
    logger.info('Socket.IO server closed');
  });

  // Close HTTP server
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      // Close database connection
      await sequelize.close();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error closing database connection:', error);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app; 