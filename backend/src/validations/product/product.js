const Joi = require('joi');

const createProductSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            'string.empty': 'Product name is required',
            'string.min': 'Product name must be at least 2 characters long',
            'string.max': 'Product name cannot exceed 100 characters',
            'any.required': 'Product name is required'
        }),
    description: Joi.string()
        .max(1000)
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 1000 characters'
        }),
    price: Joi.number()
        .required()
        .min(0)
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative',
            'any.required': 'Price is required'
        }),
    sku: Joi.string()
        .required()
        .pattern(/^[A-Z0-9-]+$/)
        .messages({
            'string.empty': 'SKU is required',
            'string.pattern.base': 'SKU can only contain uppercase letters, numbers, and hyphens',
            'any.required': 'SKU is required'
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
    categoryId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Category ID must be a valid UUID',
            'any.required': 'Category ID is required'
        }),
    tags: Joi.array()
        .items(Joi.string().uuid())
        .messages({
            'array.base': 'Tags must be an array',
            'string.guid': 'Invalid tag ID format'
        }),
    images: Joi.array()
        .items(Joi.string().uri())
        .messages({
            'array.base': 'Images must be an array',
            'string.uri': 'Invalid image URL format'
        }),
    isActive: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': 'Active status must be a boolean'
        }),
    attributes: Joi.object()
        .pattern(
            Joi.string(),
            Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean())
        )
        .messages({
            'object.base': 'Attributes must be an object',
            'object.pattern': 'Invalid attribute format'
        })
});

const updateProductSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .messages({
            'string.min': 'Product name must be at least 2 characters long',
            'string.max': 'Product name cannot exceed 100 characters'
        }),
    description: Joi.string()
        .max(1000)
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 1000 characters'
        }),
    price: Joi.number()
        .min(0)
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative'
        }),
    sku: Joi.string()
        .pattern(/^[A-Z0-9-]+$/)
        .messages({
            'string.pattern.base': 'SKU can only contain uppercase letters, numbers, and hyphens'
        }),
    stock: Joi.number()
        .min(0)
        .integer()
        .messages({
            'number.base': 'Stock must be a number',
            'number.min': 'Stock cannot be negative',
            'number.integer': 'Stock must be an integer'
        }),
    categoryId: Joi.string()
        .uuid()
        .messages({
            'string.guid': 'Category ID must be a valid UUID'
        }),
    tags: Joi.array()
        .items(Joi.string().uuid())
        .messages({
            'array.base': 'Tags must be an array',
            'string.guid': 'Invalid tag ID format'
        }),
    images: Joi.array()
        .items(Joi.string().uri())
        .messages({
            'array.base': 'Images must be an array',
            'string.uri': 'Invalid image URL format'
        }),
    isActive: Joi.boolean()
        .messages({
            'boolean.base': 'Active status must be a boolean'
        }),
    attributes: Joi.object()
        .pattern(
            Joi.string(),
            Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean())
        )
        .messages({
            'object.base': 'Attributes must be an object',
            'object.pattern': 'Invalid attribute format'
        })
});

const productIdSchema = Joi.object({
    productId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Product ID must be a valid UUID',
            'any.required': 'Product ID is required'
        })
});

const productQuerySchema = Joi.object({
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
    categoryId: Joi.string()
        .uuid()
        .messages({
            'string.guid': 'Category ID must be a valid UUID'
        }),
    minPrice: Joi.number()
        .min(0)
        .messages({
            'number.base': 'Minimum price must be a number',
            'number.min': 'Minimum price cannot be negative'
        }),
    maxPrice: Joi.number()
        .min(0)
        .messages({
            'number.base': 'Maximum price must be a number',
            'number.min': 'Maximum price cannot be negative'
        }),
    inStock: Joi.boolean()
        .messages({
            'boolean.base': 'In stock filter must be a boolean'
        }),
    isActive: Joi.boolean()
        .messages({
            'boolean.base': 'Active status must be a boolean'
        }),
    sortBy: Joi.string()
        .valid('name', 'price', 'createdAt', 'updatedAt')
        .default('name')
        .messages({
            'string.base': 'Sort field must be a string',
            'any.only': 'Sort field must be one of: name, price, createdAt, updatedAt'
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
    createProductSchema,
    updateProductSchema,
    productIdSchema,
    productQuerySchema
}; 