const Joi = require('joi');

const categorySchema = {
    createCategory: Joi.object({
        name: Joi.string()
            .required()
            .min(2)
            .max(50)
            .messages({
                'string.empty': 'Category name is required',
                'string.min': 'Category name must be at least 2 characters long',
                'string.max': 'Category name cannot exceed 50 characters',
                'any.required': 'Category name is required'
            }),
        description: Joi.string()
            .max(500)
            .allow('')
            .messages({
                'string.max': 'Description cannot exceed 500 characters'
            }),
        parentId: Joi.string()
            .uuid()
            .allow(null)
            .messages({
                'string.guid': 'Parent category ID must be a valid UUID'
            }),
        isActive: Joi.boolean()
            .default(true)
            .messages({
                'boolean.base': 'Active status must be a boolean'
            })
    }),

    updateCategory: Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .messages({
                'string.min': 'Category name must be at least 2 characters long',
                'string.max': 'Category name cannot exceed 50 characters'
            }),
        description: Joi.string()
            .max(500)
            .allow('')
            .messages({
                'string.max': 'Description cannot exceed 500 characters'
            }),
        parentId: Joi.string()
            .uuid()
            .allow(null)
            .messages({
                'string.guid': 'Parent category ID must be a valid UUID'
            }),
        isActive: Joi.boolean()
            .messages({
                'boolean.base': 'Active status must be a boolean'
            })
    }),

    categoryId: Joi.object({
        id: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.guid': 'Category ID must be a valid UUID',
                'any.required': 'Category ID is required'
            })
    }),

    categoryQuery: Joi.object({
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
        parentId: Joi.string()
            .uuid()
            .allow(null)
            .messages({
                'string.guid': 'Parent category ID must be a valid UUID'
            }),
        isActive: Joi.boolean()
            .messages({
                'boolean.base': 'Active status must be a boolean'
            }),
        sortBy: Joi.string()
            .valid('name', 'createdAt', 'updatedAt')
            .default('name')
            .messages({
                'string.base': 'Sort field must be a string',
                'any.only': 'Sort field must be one of: name, createdAt, updatedAt'
            }),
        sortOrder: Joi.string()
            .valid('asc', 'desc')
            .default('asc')
            .messages({
                'string.base': 'Sort order must be a string',
                'any.only': 'Sort order must be either asc or desc'
            })
    })
};

module.exports = categorySchema; 