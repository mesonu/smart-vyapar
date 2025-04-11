const Joi = require('joi');

const createOrderSchema = Joi.object({
    userId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'User ID must be a valid UUID',
            'any.required': 'User ID is required'
        }),
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string()
                    .uuid()
                    .required()
                    .messages({
                        'string.guid': 'Product ID must be a valid UUID',
                        'any.required': 'Product ID is required'
                    }),
                quantity: Joi.number()
                    .required()
                    .min(1)
                    .integer()
                    .messages({
                        'number.base': 'Quantity must be a number',
                        'number.min': 'Quantity must be at least 1',
                        'number.integer': 'Quantity must be an integer',
                        'any.required': 'Quantity is required'
                    })
            })
        )
        .min(1)
        .required()
        .messages({
            'array.base': 'Items must be an array',
            'array.min': 'At least one item is required',
            'any.required': 'Items are required'
        }),
    shippingAddress: Joi.object({
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
    notes: Joi.string()
        .max(500)
        .allow('')
        .messages({
            'string.max': 'Notes cannot exceed 500 characters'
        })
});

const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .required()
        .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
        .messages({
            'string.empty': 'Status is required',
            'any.only': 'Status must be one of: pending, processing, shipped, delivered, cancelled',
            'any.required': 'Status is required'
        })
});

const orderIdSchema = Joi.object({
    orderId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Order ID must be a valid UUID',
            'any.required': 'Order ID is required'
        })
});

const orderQuerySchema = Joi.object({
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
    userId: Joi.string()
        .uuid()
        .messages({
            'string.guid': 'User ID must be a valid UUID'
        }),
    status: Joi.string()
        .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
        .messages({
            'any.only': 'Status must be one of: pending, processing, shipped, delivered, cancelled'
        }),
    startDate: Joi.date()
        .messages({
            'date.base': 'Start date must be a valid date'
        }),
    endDate: Joi.date()
        .messages({
            'date.base': 'End date must be a valid date'
        }),
    sortBy: Joi.string()
        .valid('createdAt', 'updatedAt', 'totalAmount')
        .default('createdAt')
        .messages({
            'string.base': 'Sort field must be a string',
            'any.only': 'Sort field must be one of: createdAt, updatedAt, totalAmount'
        }),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .default('desc')
        .messages({
            'string.base': 'Sort order must be a string',
            'any.only': 'Sort order must be either asc or desc'
        })
});

module.exports = {
    createOrderSchema,
    updateOrderStatusSchema,
    orderIdSchema,
    orderQuerySchema
}; 