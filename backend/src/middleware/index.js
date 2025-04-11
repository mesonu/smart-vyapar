const { authMiddleware, checkRole, checkOwnership, checkPermission, ROLES } = require('./auth');
const { validateRequest, validateParams, validateQuery } = require('./validation');
const { errorHandler, AppError } = require('./errorHandler');

module.exports = {
    // Auth middleware
    authMiddleware,
    checkRole,
    checkOwnership,
    checkPermission,
    ROLES,

    // Validation middleware
    validateRequest,
    validateParams,
    validateQuery,

    // Error handling
    errorHandler,
    AppError
}; 