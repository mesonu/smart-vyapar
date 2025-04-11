const Joi = require('joi');

const createCustomerSchema = Joi.object({
    firstName: Joi.string()
        .required()
        .min(2)
        .max(50)
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters long',
            'string.max': 'First name cannot exceed 50 characters',
            'any.required': 'First name is required'
        }),
    lastName: Joi.string()
        .required()
        .min(2)
        .max(50)
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 2 characters long',
            'string.max': 'Last name cannot exceed 50 characters',
            'any.required': 'Last name is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            'string.pattern.base': 'Phone number must be 10 digits',
            'string.empty': 'Phone number is required',
            'any.required': 'Phone number is required'
        }),
    address: Joi.object({
        street: Joi.string()
            .required()
            .max(100)
            .messages({
                'string.empty': 'Street address is required',
                'string.max': 'Street address cannot exceed 100 characters',
                'any.required': 'Street address is required'
            }),
        city: Joi.string()
            .required()
            .max(50)
            .messages({
                'string.empty': 'City is required',
                'string.max': 'City name cannot exceed 50 characters',
                'any.required': 'City is required'
            }),
        state: Joi.string()
            .required()
            .max(50)
            .messages({
                'string.empty': 'State is required',
                'string.max': 'State name cannot exceed 50 characters',
                'any.required': 'State is required'
            }),
        country: Joi.string()
            .required()
            .max(50)
            .messages({
                'string.empty': 'Country is required',
                'string.max': 'Country name cannot exceed 50 characters',
                'any.required': 'Country is required'
            }),
        zipCode: Joi.string()
            .required()
            .pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)
            .messages({
                'string.empty': 'ZIP code is required',
                'string.pattern.base': 'Invalid ZIP code format',
                'any.required': 'ZIP code is required'
            })
    }).required(),
    isActive: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': 'Active status must be a boolean'
        })
});

const updateCustomerSchema = Joi.object({
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
    }),
    isActive: Joi.boolean()
        .messages({
            'boolean.base': 'Active status must be a boolean'
        })
});

const customerIdSchema = Joi.object({
    customerId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Customer ID must be a valid UUID',
            'any.required': 'Customer ID is required'
        })
});

const customerQuerySchema = Joi.object({
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
    createCustomerSchema,
    updateCustomerSchema,
    customerIdSchema,
    customerQuerySchema
}; 