const Joi = require('joi');

const createVariantSchema = Joi.object({
    productId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Product ID must be a valid UUID',
            'any.required': 'Product ID is required'
        }),
    name: Joi.string()
        .required()
        .max(100)
        .messages({
            'string.empty': 'Variant name is required',
            'string.max': 'Variant name cannot exceed 100 characters',
            'any.required': 'Variant name is required'
        }),
    sku: Joi.string()
        .required()
        .max(50)
        .messages({
            'string.empty': 'SKU is required',
            'string.max': 'SKU cannot exceed 50 characters',
            'any.required': 'SKU is required'
        }),
    price: Joi.number()
        .required()
        .min(0)
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative',
            'any.required': 'Price is required'
        }),
    stock: Joi.number()
        .required()
        .min(0)
        .integer()
        .messages({
            'number.base': 'Stock must be a number',
            'number.min': 'Stock cannot be negative',
            'number.integer': 'Stock must be an integer',
            'any.required': 'Stock is required'
        }),
    attributes: Joi.object()
        .pattern(
            Joi.string(),
            Joi.string().max(50)
        )
        .messages({
            'object.base': 'Attributes must be an object',
            'string.max': 'Attribute values cannot exceed 50 characters'
        }),
    isActive: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': 'Active status must be a boolean'
        })
});

const updateVariantSchema = Joi.object({
    name: Joi.string()
        .max(100)
        .messages({
            'string.max': 'Variant name cannot exceed 100 characters'
        }),
    sku: Joi.string()
        .max(50)
        .messages({
            'string.max': 'SKU cannot exceed 50 characters'
        }),
    price: Joi.number()
        .min(0)
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative'
        }),
    stock: Joi.number()
        .min(0)
        .integer()
        .messages({
            'number.base': 'Stock must be a number',
            'number.min': 'Stock cannot be negative',
            'number.integer': 'Stock must be an integer'
        }),
    attributes: Joi.object()
        .pattern(
            Joi.string(),
            Joi.string().max(50)
        )
        .messages({
            'object.base': 'Attributes must be an object',
            'string.max': 'Attribute values cannot exceed 50 characters'
        }),
    isActive: Joi.boolean()
        .messages({
            'boolean.base': 'Active status must be a boolean'
        })
});

const variantIdSchema = Joi.object({
    variantId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Variant ID must be a valid UUID',
            'any.required': 'Variant ID is required'
        })
});

const variantQuerySchema = Joi.object({
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
    productId: Joi.string()
        .uuid()
        .messages({
            'string.guid': 'Product ID must be a valid UUID'
        }),
    isActive: Joi.boolean()
        .messages({
            'boolean.base': 'Active status must be a boolean'
        }),
    sortBy: Joi.string()
        .valid('name', 'price', 'stock', 'createdAt')
        .default('createdAt')
        .messages({
            'string.base': 'Sort field must be a string',
            'any.only': 'Sort field must be one of: name, price, stock, createdAt'
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
    createVariantSchema,
    updateVariantSchema,
    variantIdSchema,
    variantQuerySchema
}; 