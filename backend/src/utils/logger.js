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
  format(info => {
    info.level = info.level.toUpperCase();
    return info;
  })(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  colorize({ all: true, colors }),
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
  colorize({ all: true, colors }),
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

// Create the logger instance
const logger = winston.createLogger({
  levels,
  format: fileFormat,
  transports: [
    // Console transport - always active with error handling
    new winston.transports.Console({
      format: consoleFormat,
      handleExceptions: true,
      handleRejections: true
    }),
    // File transports
    dailyRotateFileTransport,
    errorFileTransport
  ],
  exitOnError: false
});

// Create a stream object with a 'write' function that will be used by Morgan
logger.stream = {
  write: function(message) {
    logger.http(message.trim());
  }
};

// Helper class for structured logging
class LoggerHelper {
  static errorWithContext(message, error, context = {}) {
    logger.error(message, {
      error: error?.message || error,
      stack: error?.stack,
      ...context
    });
  }

  static warnWithContext(message, context = {}) {
    logger.warn(message, context);
  }

  static infoWithContext(message, context = {}) {
    logger.info(message, context);
  }

  static debugWithContext(message, context = {}) {
    logger.debug(message, context);
  }

  static httpRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    if (res.statusCode >= 500) {
      logger.error('HTTP Request Error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request Warning', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  }

  static performance(operation, duration, context = {}) {
    logger.info('Performance', {
      operation,
      duration: `${duration}ms`,
      ...context
    });
  }

  static security(event, context = {}) {
    logger.warn('Security Event', { event, ...context });
  }

  static audit(action, user, context = {}) {
    logger.info('Audit', {
      action,
      user: user?.id || 'anonymous',
      ...context
    });
  }
}

// Export both the logger instance and the helper class
module.exports = {
  logger,
  LoggerHelper
};

/* Example usage:

// Basic logging:
const { logger } = require('./utils/logger');

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