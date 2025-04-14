const { ValidationError } = require('joi');
const { logger } = require('../utils/logger');
const ResponseHandler = require('../utils/ResponseHandler');

/**
 * Middleware to validate request data against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {string} [source='body'] - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            // Get the data to validate based on source
            const data = req[source];

            // Validate data against schema
            const { error, value } = schema.validate(data, {
                abortEarly: false,
                stripUnknown: true,
                allowUnknown: source === 'query' // Allow unknown fields in query params
            });

            if (error) {
                // Format validation errors
                const errors = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }));

                logger.warn('Validation failed:', {
                    path: req.path,
                    method: req.method,
                    source,
                    errors
                });

                return ResponseHandler.badRequest(res, 'Validation failed', errors);
            }

            // Replace request data with validated data
            req[source] = value;
            next();
        } catch (err) {
            logger.error('Validation middleware error:', err);
            return ResponseHandler.serverError(res, 'Internal server error during validation');
        }
    };
};

/**
 * Middleware to validate request parameters
 * @param {Object} schema - Joi validation schema for params
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => validateRequest(schema, 'params');

/**
 * Middleware to validate query parameters
 * @param {Object} schema - Joi validation schema for query
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => validateRequest(schema, 'query');

module.exports = {
    validateRequest,
    validateParams,
    validateQuery
}; 