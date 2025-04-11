const ResponseHandler = require('../utils/ResponseHandler');
const { ValidationError } = require('joi');
const { JsonWebTokenError } = require('jsonwebtoken');
const { logger } = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode, context = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

const logError = (err, req) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    statusCode: err.statusCode || 500,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    },
    context: err.context || {},
    user: req.user ? {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    } : null,
    body: req.body,
    query: req.query,
    params: req.params
  };

  if (err.statusCode >= 500) {
    logger.error('Server Error:', errorLog);
  } else if (err.statusCode >= 400) {
    logger.warn('Client Error:', errorLog);
  } else {
    logger.info('Application Error:', errorLog);
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logError(err, req);

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
      path: req.originalUrl
    });
  }

  // Handle specific error types
  if (err instanceof ValidationError) {
    return ResponseHandler.validationError(res, err);
  }

  if (err instanceof JsonWebTokenError) {
    return ResponseHandler.unauthorized(res, 'Invalid token. Please log in again!');
  }

  if (err.name === 'CastError') {
    return ResponseHandler.error(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    return ResponseHandler.error(res, `Duplicate field value: ${value}. Please use another value!`, 400);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return ResponseHandler.error(res, `Invalid input data. ${errors.join('. ')}`, 400);
  }

  // Handle operational errors
  if (err.isOperational) {
    return ResponseHandler.error(res, err.message, err.statusCode);
  }

  // Handle unknown errors
  return ResponseHandler.error(res, 'Something went wrong!', 500);
};

// Error tracking middleware
const errorTracker = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      user: req.user ? {
        id: req.user.id,
        email: req.user.email
      } : null,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    if (res.statusCode >= 500) {
      logger.error('Request Error:', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request Warning:', logData);
    } else {
      logger.info('Request Success:', logData);
    }
  });
  next();
};

module.exports = {
  errorHandler,
  AppError,
  errorTracker
}; 