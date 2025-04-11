const Joi = require('joi');

const createPromotionSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            'string.empty': 'Promotion name is required',
            'string.min': 'Promotion name must be at least 2 characters long',
            'string.max': 'Promotion name cannot exceed 100 characters',
            'any.required': 'Promotion name is required'
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
    startDate: Joi.date()
        .required()
        .min('now')
        .messages({
            'date.base': 'Start date must be a valid date',
            'date.min': 'Start date cannot be in the past',
            'any.required': 'Start date is required'
        }),
    endDate: Joi.date()
        .required()
        .min(Joi.ref('startDate'))
        .messages({
            'date.base': 'End date must be a valid date',
            'date.min': 'End date must be after start date',
            'any.required': 'End date is required'
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

const updatePromotionSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .messages({
            'string.min': 'Promotion name must be at least 2 characters long',
            'string.max': 'Promotion name cannot exceed 100 characters'
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
    startDate: Joi.date()
        .min('now')
        .messages({
            'date.base': 'Start date must be a valid date',
            'date.min': 'Start date cannot be in the past'
        }),
    endDate: Joi.date()
        .min(Joi.ref('startDate'))
        .messages({
            'date.base': 'End date must be a valid date',
            'date.min': 'End date must be after start date'
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

const promotionIdSchema = Joi.object({
    promotionId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Promotion ID must be a valid UUID',
            'any.required': 'Promotion ID is required'
        })
});

const promotionQuerySchema = Joi.object({
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
    startDate: Joi.date()
        .messages({
            'date.base': 'Start date must be a valid date'
        }),
    endDate: Joi.date()
        .messages({
            'date.base': 'End date must be a valid date'
        }),
    sortBy: Joi.string()
        .valid('name', 'startDate', 'endDate', 'createdAt', 'updatedAt')
        .default('startDate')
        .messages({
            'string.base': 'Sort field must be a string',
            'any.only': 'Sort field must be one of: name, startDate, endDate, createdAt, updatedAt'
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
    createPromotionSchema,
    updatePromotionSchema,
    promotionIdSchema,
    promotionQuerySchema
}; 