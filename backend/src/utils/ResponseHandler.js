class ResponseHandler {
  // Success Responses
  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  static noContent(res, message = "No content") {
    return res.status(204).json({
      success: true,
      message,
    });
  }

  // Error Responses
  static error(res, message, statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors || undefined,
    });
  }

  static badRequest(res, message = "Bad Request", errors = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res, message = "Unauthorized access") {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = "Forbidden access") {
    return this.error(res, message, 403);
  }

  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  static conflict(res, message = "Resource conflict", errors = null) {
    return this.error(res, message, 409, errors);
  }

  // Server Error Response
  static serverError(res, message = "Internal server error", errors = null) {
    return this.error(res, message, 500, errors);
  }

  // Validation Error Response
  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors.details
        ? errors.details.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }))
        : errors,
    });
  }

  // Database Error Response
  static databaseError(res, error) {
    const message =
      error.name === "SequelizeUniqueConstraintError"
        ? "Duplicate entry found"
        : "Database operation failed";

    return this.error(res, message, 500, {
      code: error.name,
      details: error.errors || error.message,
    });
  }

  // Authentication Error Response
  static authError(res, message = "Authentication failed") {
    return this.error(res, message, 401);
  }

  // Authorization Error Response
  static permissionError(res, message = "Insufficient permissions") {
    return this.error(res, message, 403);
  }

  // Rate Limit Error Response
  static rateLimitError(res, message = "Too many requests") {
    return this.error(res, message, 429);
  }

  // Service Unavailable Response
  static serviceUnavailable(res, message = "Service temporarily unavailable") {
    return this.error(res, message, 503);
  }
}

module.exports = ResponseHandler;
