const Joi = require('joi');

const createTemplateSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            'string.empty': 'Template name is required',
            'string.min': 'Template name must be at least 2 characters long',
            'string.max': 'Template name cannot exceed 100 characters',
            'any.required': 'Template name is required'
        }),
    description: Joi.string()
        .max(500)
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),
    discountType: Joi.string()
        .required()
        .valid('percentage', 'fixed')
        .messages({
            'string.empty': 'Discount type is required',
            'any.only': 'Discount type must be either percentage or fixed',
            'any.required': 'Discount type is required'
        }),
    discountValue: Joi.number()
        .required()
        .min(0)
        .messages({
            'number.base': 'Discount value must be a number',
            'number.min': 'Discount value cannot be negative',
            'any.required': 'Discount value is required'
        }),
    minPurchaseAmount: Joi.number()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Minimum purchase amount must be a number',
            'number.min': 'Minimum purchase amount cannot be negative'
        }),
    maxDiscountAmount: Joi.number()
        .min(0)
        .messages({
            'number.base': 'Maximum discount amount must be a number',
            'number.min': 'Maximum discount amount cannot be negative'
        }),
    duration: Joi.number()
        .required()
        .min(1)
        .messages({
            'number.base': 'Duration must be a number',
            'number.min': 'Duration must be at least 1 day',
            'any.required': 'Duration is required'
        }),
    isActive: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': 'Active status must be a boolean'
        }),
    productIds: Joi.array()
        .items(Joi.string().uuid())
        .messages({
            'array.base': 'Product IDs must be an array',
            'string.guid': 'Invalid product ID format'
        }),
    categoryIds: Joi.array()
        .items(Joi.string().uuid())
        .messages({
            'array.base': 'Category IDs must be an array',
            'string.guid': 'Invalid category ID format'
        })
});

const updateTemplateSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .messages({
            'string.min': 'Template name must be at least 2 characters long',
            'string.max': 'Template name cannot exceed 100 characters'
        }),
    description: Joi.string()
        .max(500)
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),
    discountType: Joi.string()
        .valid('percentage', 'fixed')
        .messages({
            'any.only': 'Discount type must be either percentage or fixed'
        }),
    discountValue: Joi.number()
        .min(0)
        .messages({
            'number.base': 'Discount value must be a number',
            'number.min': 'Discount value cannot be negative'
        }),
    minPurchaseAmount: Joi.number()
        .min(0)
        .messages({
            'number.base': 'Minimum purchase amount must be a number',
            'number.min': 'Minimum purchase amount cannot be negative'
        }),
    maxDiscountAmount: Joi.number()
        .min(0)
        .messages({
            'number.base': 'Maximum discount amount must be a number',
            'number.min': 'Maximum discount amount cannot be negative'
        }),
    duration: Joi.number()
        .min(1)
        .messages({
            'number.base': 'Duration must be a number',
            'number.min': 'Duration must be at least 1 day'
        }),
    isActive: Joi.boolean()
        .messages({
            'boolean.base': 'Active status must be a boolean'
        }),
    productIds: Joi.array()
        .items(Joi.string().uuid())
        .messages({
            'array.base': 'Product IDs must be an array',
            'string.guid': 'Invalid product ID format'
        }),
    categoryIds: Joi.array()
        .items(Joi.string().uuid())
        .messages({
            'array.base': 'Category IDs must be an array',
            'string.guid': 'Invalid category ID format'
        })
});

const templateIdSchema = Joi.object({
    templateId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Template ID must be a valid UUID',
            'any.required': 'Template ID is required'
        })
});

const templateQuerySchema = Joi.object({
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
    discountType: Joi.string()
        .valid('percentage', 'fixed')
        .messages({
            'any.only': 'Discount type must be either percentage or fixed'
        }),
    isActive: Joi.boolean()
        .messages({
            'boolean.base': 'Active status must be a boolean'
        }),
    sortBy: Joi.string()
        .valid('name', 'duration', 'createdAt', 'updatedAt')
        .default('name')
        .messages({
            'string.base': 'Sort field must be a string',
            'any.only': 'Sort field must be one of: name, duration, createdAt, updatedAt'
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
    createTemplateSchema,
    updateTemplateSchema,
    templateIdSchema,
    templateQuerySchema
}; 