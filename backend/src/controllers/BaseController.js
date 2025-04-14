const { logger } = require("../utils/logger");
const ResponseHandler = require("../utils/ResponseHandler");
const { Op } = require("sequelize");

class BaseController {
  constructor() {
    this.ResponseHandler = ResponseHandler;
    this.errorMappings = {
      // Validation Errors
      ValidationError: (res, error) =>
        this.ResponseHandler.validationError(res, error),
      JoiValidationError: (res, error) =>
        this.ResponseHandler.validationError(res, error),

      // Database Errors
      SequelizeUniqueConstraintError: (res, error) =>
        this.ResponseHandler.databaseError(res, error),
      SequelizeForeignKeyConstraintError: (res, error) =>
        this.ResponseHandler.databaseError(res, error),
      SequelizeValidationError: (res, error) =>
        this.ResponseHandler.databaseError(res, error),

      // Authentication/Authorization Errors
      JsonWebTokenError: (res) =>
        this.ResponseHandler.authError(res, "Invalid token"),
      TokenExpiredError: (res) =>
        this.ResponseHandler.authError(res, "Token expired"),
      UnauthorizedError: (res, error) =>
        this.ResponseHandler.unauthorized(res, error.message),
      ForbiddenError: (res, error) =>
        this.ResponseHandler.forbidden(res, error.message),

      // Business Logic Errors
      NotFoundError: (res, error) =>
        this.ResponseHandler.notFound(res, error.message),
      ConflictError: (res, error) =>
        this.ResponseHandler.conflict(res, error.message),

      // Rate Limiting
      RateLimitError: (res, error) =>
        this.ResponseHandler.rateLimitError(res, error.message),

      // Service Errors
      ServiceUnavailableError: (res, error) =>
        this.ResponseHandler.serviceUnavailable(res, error.message),
    };
  }

  /**
   * Enhanced error handling with automatic error type detection
   * @param {Object} res - Express response object
   * @param {Error} error - Error object
   * @param {string} [customMessage] - Optional custom error message
   * @returns {Object} Formatted error response
   */
  handleError(res, error, customMessage = null) {
    logger.error("Error occurred:", {
      message: error.message,
      stack: error.stack,
      customMessage,
    });

    // Handle specific error types
    if (error.name === "SequelizeValidationError") {
      return this.ResponseHandler.validationError(
        res,
        "Validation failed",
        error.errors
      );
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return this.ResponseHandler.badRequest(res, "Duplicate entry found");
    }

    if (error.name === "SequelizeDatabaseError") {
      return this.ResponseHandler.databaseError(
        res,
        "Database operation failed"
      );
    }

    if (error.name === "JsonWebTokenError") {
      return this.ResponseHandler.unauthorized(res, "Invalid token");
    }

    if (error.name === "TokenExpiredError") {
      return this.ResponseHandler.unauthorized(res, "Token expired");
    }

    // Default to server error
    return this.ResponseHandler.serverError(
      res,
      customMessage || "An unexpected error occurred"
    );
  }

  /**
   * Create a custom error with specific type
   * @param {string} type - Error type (must match errorMappings)
   * @param {string} message - Error message
   * @returns {Error} Custom error object
   */
  createError(type, message) {
    const error = new Error(message);
    error.name = type;
    return error;
  }

  /**
   * Throw a not found error
   * @param {string} message - Error message
   * @throws {Error} NotFoundError
   */
  throwNotFound(message = "Resource not found") {
    throw this.createError("NotFoundError", message);
  }

  /**
   * Throw a validation error
   * @param {string} message - Error message
   * @throws {Error} ValidationError
   */
  throwValidationError(message = "Validation failed") {
    throw this.createError("ValidationError", message);
  }

  /**
   * Throw a conflict error
   * @param {string} message - Error message
   * @throws {Error} ConflictError
   */
  throwConflictError(message = "Resource conflict") {
    throw this.createError("ConflictError", message);
  }

  /**
   * Validate request body against schema
   * @param {Object} req - Express request object
   * @param {Object} schema - Joi validation schema
   * @returns {Object|null} Validation error or null
   */
  validateRequest(req, schema) {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return null;
  }

  /**
   * Check if user has required role
   * @param {Object} user - User object
   * @param {string|Array} requiredRole - Required role(s)
   * @returns {boolean} Whether user has required role
   */
  hasRequiredRole(user, requiredRole) {
    if (!user || !user.role) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }

    return user.role === requiredRole;
  }

  /**
   * Check if user has required permissions
   * @param {Object} user - User object
   * @param {string|Array} requiredPermission - Required permission(s)
   * @returns {boolean} Whether user has required permission
   */
  hasRequiredPermission(user, requiredPermission) {
    if (!user || !user.permissions) return false;

    if (Array.isArray(requiredPermission)) {
      return requiredPermission.some((permission) =>
        user.permissions.includes(permission)
      );
    }

    return user.permissions.includes(requiredPermission);
  }

  /**
   * Get pagination parameters from request
   * @param {Object} req - Express request object
   * @returns {Object} Pagination parameters
   */
  getPaginationParams(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  /**
   * Get sorting parameters from request
   * @param {Object} req - Express request object
   * @param {Array} allowedFields - Allowed sort fields
   * @returns {Array} Sort parameters
   */
  getSortParams(req, allowedFields = []) {
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "DESC";

    if (allowedFields.length && !allowedFields.includes(sortBy)) {
      return [["createdAt", "DESC"]];
    }

    return [[sortBy, sortOrder]];
  }

  /**
   * Get filter parameters from request
   * @param {Object} req - Express request object
   * @param {Array} allowedFields - Allowed filter fields
   * @returns {Object} Filter parameters
   */
  getFilterParams(req, allowedFields = []) {
    const filters = {};
    const query = req.query;

    Object.keys(query).forEach((key) => {
      if (allowedFields.includes(key) && query[key]) {
        filters[key] = query[key];
      }
    });

    return filters;
  }

  /**
   * Sanitize data by removing sensitive fields
   * @param {Object} data - Data object
   * @param {Array} sensitiveFields - Fields to remove
   * @returns {Object} Sanitized data
   */
  sanitizeData(data, sensitiveFields = ["password", "token", "secret"]) {
    const sanitized = { ...data };
    sensitiveFields.forEach((field) => {
      delete sanitized[field];
    });
    return sanitized;
  }

  /**
   * Format success response
   * @param {Object} res - Express response object
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @returns {Object} Formatted response
   */
  success(res, data, message = "Success") {
    return this.ResponseHandler.success(res, data, message);
  }

  /**
   * Format error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Formatted error response
   */
  error(res, message, statusCode = 400) {
    return this.ResponseHandler.error(res, message, statusCode);
  }

  /**
   * Transform data using provided mapping
   * @param {Object} data - Data to transform
   * @param {Object} mapping - Field mapping
   * @returns {Object} Transformed data
   */
  transformData(data, mapping) {
    const transformed = {};
    Object.entries(mapping).forEach(([newKey, oldKey]) => {
      if (data[oldKey] !== undefined) {
        transformed[newKey] = data[oldKey];
      }
    });
    return transformed;
  }

  /**
   * Format date fields in data
   * @param {Object} data - Data object
   * @param {Array} dateFields - Fields to format
   * @param {string} format - Date format
   * @returns {Object} Data with formatted dates
   */
  formatDates(
    data,
    dateFields = ["createdAt", "updatedAt"],
    format = "YYYY-MM-DD HH:mm:ss"
  ) {
    const formatted = { ...data };
    dateFields.forEach((field) => {
      if (formatted[field]) {
        formatted[field] = new Date(formatted[field]).toISOString();
      }
    });
    return formatted;
  }

  /**
   * Build search query for text fields
   * @param {Object} searchParams - Search parameters
   * @param {Array} searchableFields - Fields to search in
   * @returns {Object} Sequelize where clause
   */
  buildSearchQuery(searchParams, searchableFields) {
    if (!searchParams.q || !searchableFields.length) return {};

    return {
      [Op.or]: searchableFields.map((field) => ({
        [field]: {
          [Op.iLike]: `%${searchParams.q}%`,
        },
      })),
    };
  }
}

module.exports = BaseController;
