const Joi = require('joi');

const createReviewSchema = Joi.object({
    productId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Product ID must be a valid UUID',
            'any.required': 'Product ID is required'
        }),
    rating: Joi.number()
        .required()
        .min(1)
        .max(5)
        .integer()
        .messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating cannot exceed 5',
            'number.integer': 'Rating must be an integer',
            'any.required': 'Rating is required'
        }),
    comment: Joi.string()
        .required()
        .max(1000)
        .messages({
            'string.empty': 'Comment is required',
            'string.max': 'Comment cannot exceed 1000 characters',
            'any.required': 'Comment is required'
        }),
    title: Joi.string()
        .max(100)
        .messages({
            'string.max': 'Title cannot exceed 100 characters'
        })
});

const updateReviewSchema = Joi.object({
    rating: Joi.number()
        .min(1)
        .max(5)
        .integer()
        .messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating cannot exceed 5',
            'number.integer': 'Rating must be an integer'
        }),
    comment: Joi.string()
        .max(1000)
        .messages({
            'string.max': 'Comment cannot exceed 1000 characters'
        }),
    title: Joi.string()
        .max(100)
        .messages({
            'string.max': 'Title cannot exceed 100 characters'
        })
});

const reviewIdSchema = Joi.object({
    reviewId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Review ID must be a valid UUID',
            'any.required': 'Review ID is required'
        })
});

const reviewQuerySchema = Joi.object({
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
    rating: Joi.number()
        .min(1)
        .max(5)
        .integer()
        .messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating cannot exceed 5',
            'number.integer': 'Rating must be an integer'
        }),
    productId: Joi.string()
        .uuid()
        .messages({
            'string.guid': 'Product ID must be a valid UUID'
        }),
    userId: Joi.string()
        .uuid()
        .messages({
            'string.guid': 'User ID must be a valid UUID'
        }),
    sortBy: Joi.string()
        .valid('rating', 'createdAt', 'updatedAt')
        .default('createdAt')
        .messages({
            'string.base': 'Sort field must be a string',
            'any.only': 'Sort field must be one of: rating, createdAt, updatedAt'
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
    createReviewSchema,
    updateReviewSchema,
    reviewIdSchema,
    reviewQuerySchema
}; 