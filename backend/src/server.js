const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config/config');
const { initializeDatabase, sequelize } = require('./models');
const app = require('./app');
const logger = require('./utils/logger');

const PORT = config.port || 3000;

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('\n=== Uncaught Exception ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('==================\n');
  
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack
  });
  
  // Don't exit immediately, give time to log
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n=== Unhandled Rejection ===');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  console.error('==================\n');
  
  logger.error('Unhandled Rejection:', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
});

// Create HTTP server
const httpServer = createServer(app);

// Error handler for HTTP server
httpServer.on('error', (error) => {
  console.error('\n=== HTTP Server Error ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('==================\n');
  
  logger.error('HTTP Server Error:', {
    error: error.message,
    stack: error.stack
  });
});

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
    console.error('\n=== Socket Error ===');
    console.error('Socket ID:', socket.id);
    console.error('Error:', error);
    console.error('==================\n');
    
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
    console.error('\n=== Database Initialization Error ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('==================\n');
    
    logger.error('Database initialization failed:', {
      error: error.message,
      stack: error.stack
    });
    
    // Don't exit immediately, give time to log
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
});

// Graceful shutdown
const shutdown = async () => {
  console.log('\n=== Shutting down server ===');
  logger.info('Shutting down server...');
  
  try {
    // Close HTTP server
    await new Promise((resolve) => {
      httpServer.close(() => {
        console.log('HTTP server closed');
        resolve();
      });
    });
    
    // Close Socket.IO
    io.close(() => {
      console.log('Socket.IO server closed');
    });
    
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed');
    
    logger.info('Server shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('\n=== Shutdown Error ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('==================\n');
    
    logger.error('Error during shutdown:', {
      error: error.message,
      stack: error.stack
    });
    
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app; 