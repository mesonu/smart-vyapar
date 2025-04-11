const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');
const ResponseHandler = require('../utils/ResponseHandler');
const logger = require('../utils/logger');

// Define available roles
const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    CUSTOMER: 'customer',
    STAFF: 'staff'
};

/**
 * Authentication middleware to verify JWT token and attach user to request
 * @returns {Function} Express middleware function
 */
const auth = async (req, res, next) => {
    try {
        const {secret, expiresIn} = config.jwt;
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            logger.warn('Authentication failed: No token provided', {
                path: req.path,
                method: req.method
            });
            return ResponseHandler.unauthorized(res, 'No token, authorization denied');
        }

        // Verify token
        const decoded = jwt.verify(token, secret);
        
        // Get user from database
        const user = await User.findByPk(decoded.id);
        if (!user) {
            logger.warn('Authentication failed: Invalid token', {
                path: req.path,
                method: req.method,
                userId: decoded.id
            });
            return ResponseHandler.unauthorized(res, 'Token is not valid');
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        logger.error('Authentication error:', {
            error: error.message,
            path: req.path,
            method: req.method
        });
        
        if (error instanceof jwt.JsonWebTokenError) {
            return ResponseHandler.unauthorized(res, 'Token is not valid');
        }
        
        return ResponseHandler.serverError(res, 'Authentication error');
    }
};

/**
 * Role-based access control middleware
 * @param {string[]} allowedRoles - Array of roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return ResponseHandler.unauthorized(res, 'User not authenticated');
            }

            if (!allowedRoles.includes(req.user.role)) {
                logger.warn('Access denied: Insufficient permissions', {
                    path: req.path,
                    method: req.method,
                    userRole: req.user.role,
                    requiredRoles: allowedRoles
                });
                return ResponseHandler.forbidden(res, 'Insufficient permissions');
            }

            next();
        } catch (error) {
            logger.error('Role check error:', {
                error: error.message,
                path: req.path,
                method: req.method
            });
            return ResponseHandler.serverError(res, 'Error checking user role');
        }
    };
};

/**
 * Middleware to check if user is the owner of the resource
 * @param {string} resourceIdParam - Name of the parameter containing the resource ID
 * @param {Function} checkOwnership - Function to check if user owns the resource
 * @returns {Function} Express middleware function
 */
const checkOwnership = (resourceIdParam, checkOwnership) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return ResponseHandler.unauthorized(res, 'User not authenticated');
            }

            const resourceId = req.params[resourceIdParam];
            const isOwner = await checkOwnership(req.user.id, resourceId);

            if (!isOwner && req.user.role !== ROLES.ADMIN) {
                logger.warn('Access denied: Not resource owner', {
                    path: req.path,
                    method: req.method,
                    userId: req.user.id,
                    resourceId
                });
                return ResponseHandler.forbidden(res, 'You do not have permission to access this resource');
            }

            next();
        } catch (error) {
            logger.error('Ownership check error:', {
                error: error.message,
                path: req.path,
                method: req.method
            });
            return ResponseHandler.serverError(res, 'Error checking resource ownership');
        }
    };
};

/**
 * Middleware to check if user has permission to perform an action
 * @param {string} action - The action to check permission for
 * @returns {Function} Express middleware function
 */
const checkPermission = (action) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return ResponseHandler.unauthorized(res, 'User not authenticated');
            }

            // Example permission check - can be expanded based on your needs
            const hasPermission = await checkUserPermission(req.user.id, action);

            if (!hasPermission) {
                logger.warn('Access denied: Insufficient permissions for action', {
                    path: req.path,
                    method: req.method,
                    userId: req.user.id,
                    action
                });
                return ResponseHandler.forbidden(res, `You do not have permission to ${action}`);
            }

            next();
        } catch (error) {
            logger.error('Permission check error:', {
                error: error.message,
                path: req.path,
                method: req.method
            });
            return ResponseHandler.serverError(res, 'Error checking user permissions');
        }
    };
};

// Helper function to check user permissions (to be implemented based on your needs)
async function checkUserPermission(userId, action) {
    // Implement your permission checking logic here
    // This could involve checking a permissions table, role-based rules, etc.
    return true; // Placeholder
}

module.exports = {
    auth,
    checkRole,
    checkOwnership,
    checkPermission,
    ROLES
}; 