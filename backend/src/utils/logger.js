'use strict';

const winston = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const { format } = winston;
const { combine, timestamp, printf, colorize, json, errors } = format;

// Define log levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  verbose: 5,
  silly: 6
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
  verbose: 'cyan',
  silly: 'white'
};

// Add colors to winston
winston.addColors(colors);

// Custom format for console output
const consoleFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  colorize({ all: true }),
  printf(({ timestamp, level, message, ...meta }) => {
    let logMessage = `${timestamp} ${level}: ${message}`;
    if (Object.keys(meta).length > 0) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }
    return logMessage;
  })
);

// Custom format for file output
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
require('fs').mkdirSync(logsDir, { recursive: true });

// Configure daily rotate file transport
const dailyRotateFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat
});

// Configure error file transport
const errorFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: fileFormat
});

// Create logger instance
const logger = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  transports: [
    dailyRotateFileTransport,
    errorFileTransport
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'exceptions.log'),
      format: fileFormat
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'rejections.log'),
      format: fileFormat
    })
  ]
});

// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Helper methods for common logging scenarios
class LoggerHelper {
  static errorWithContext(message, error, context = {}) {
    logger.error(`${message} - ${error.message}`, {
      ...context,
      stack: error.stack,
      error: error.toString()
    });
  }

  static infoWithContext(message, context = {}) {
    logger.info(message, context);
  }

  static debugWithContext(message, context = {}) {
    logger.debug(message, context);
  }

  static httpRequest(req, res, responseTime) {
    logger.http(`${req.method} ${req.url}`, {
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  }

  static performance(operation, duration, context = {}) {
    logger.info(`Performance: ${operation}`, {
      ...context,
      duration: `${duration}ms`
    });
  }

  static security(event, context = {}) {
    logger.warn(`Security Event: ${event}`, context);
  }

  static audit(action, user, context = {}) {
    logger.info(`Audit: ${action}`, {
      ...context,
      user: user.id,
      timestamp: new Date().toISOString()
    });
  }
}

// Add helper methods to logger
Object.assign(logger, LoggerHelper);

// Export logger instance
module.exports = logger; 


/**
// Example of use Helper method:
// Error logging with context
logger.errorWithContext('Failed to process request', error, { userId: 123 });

// Info logging with context
logger.infoWithContext('User logged in', { userId: 123, ip: '127.0.0.1' });

// Debug logging with context
logger.debugWithContext('Processing request', { method: 'GET', path: '/api/users' });

// HTTP request logging
logger.httpRequest(req, res, responseTime);

// Performance logging
logger.performance('Database query', 150, { query: 'SELECT * FROM users' });

// Security event logging
logger.security('Failed login attempt', { ip: '127.0.0.1', username: 'test' });

// Audit logging
logger.audit('User deleted', user, { targetId: 456 });




//////////////////////////////////////////////////////////////

// Basic logging:

const logger = require('./utils/logger');

// Basic logging
logger.error('This is an error message');
logger.warn('This is a warning message');
logger.info('This is an info message');
logger.debug('This is a debug message');

// Using helper methods
try {
  // Some code that might throw an error
} catch (error) {
  logger.errorWithContext('Operation failed', error, { operationId: 123 });
}

// Logging HTTP requests (use in middleware)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.httpRequest(req, res, duration);
  });
  next();
});

*/