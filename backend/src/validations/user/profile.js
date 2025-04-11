const Joi = require('joi');

const updateProfileSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .messages({
            'string.min': 'First name must be at least 2 characters long',
            'string.max': 'First name cannot exceed 50 characters'
        }),
    lastName: Joi.string()
        .min(2)
        .max(50)
        .messages({
            'string.min': 'Last name must be at least 2 characters long',
            'string.max': 'Last name cannot exceed 50 characters'
        }),
    email: Joi.string()
        .email()
        .messages({
            'string.email': 'Please provide a valid email address'
        }),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .messages({
            'string.pattern.base': 'Phone number must be 10 digits'
        }),
    address: Joi.object({
        street: Joi.string()
            .max(100)
            .messages({
                'string.max': 'Street address cannot exceed 100 characters'
            }),
        city: Joi.string()
            .max(50)
            .messages({
                'string.max': 'City name cannot exceed 50 characters'
            }),
        state: Joi.string()
            .max(50)
            .messages({
                'string.max': 'State name cannot exceed 50 characters'
            }),
        country: Joi.string()
            .max(50)
            .messages({
                'string.max': 'Country name cannot exceed 50 characters'
            }),
        zipCode: Joi.string()
            .pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)
            .messages({
                'string.pattern.base': 'Invalid ZIP code format'
            })
    })
});

const userIdSchema = Joi.object({
    userId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'User ID must be a valid UUID',
            'any.required': 'User ID is required'
        })
});

const userQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be at least 1'
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit cannot exceed 100'
        }),
    search: Joi.string()
        .allow('')
        .messages({
            'string.base': 'Search term must be a string'
        }),
    role: Joi.string()
        .valid('user', 'admin', 'customer')
        .messages({
            'any.only': 'Role must be one of: user, admin, customer'
        }),
    isActive: Joi.boolean()
        .messages({
            'boolean.base': 'Active status must be a boolean'
        }),
    sortBy: Joi.string()
        .valid('firstName', 'lastName', 'email', 'createdAt', 'updatedAt')
        .default('firstName')
        .messages({
            'string.base': 'Sort field must be a string',
            'any.only': 'Sort field must be one of: firstName, lastName, email, createdAt, updatedAt'
        }),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .default('asc')
        .messages({
            'string.base': 'Sort order must be a string',
            'any.only': 'Sort order must be either asc or desc'
        })
});

module.exports = {
    updateProfileSchema,
    userIdSchema,
    userQuerySchema
}; 