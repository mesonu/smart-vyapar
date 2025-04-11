const Joi = require('joi');

// Product creation schema
const createProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 3 characters long',
      'string.max': 'Product name cannot exceed 100 characters'
    }),

  description: Joi.string()
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Product description is required',
      'string.max': 'Description cannot exceed 1000 characters'
    }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative'
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative'
    }),

  categoryId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.empty': 'Category ID is required',
      'string.guid': 'Invalid category ID format'
    }),

  tags: Joi.array()
    .items(Joi.string().uuid())
    .optional()
    .messages({
      'array.base': 'Tags must be an array',
      'string.guid': 'Invalid tag ID format'
    }),

  images: Joi.array()
    .items(Joi.string().uri())
    .optional()
    .messages({
      'array.base': 'Images must be an array',
      'string.uri': 'Invalid image URL format'
    }),

  isActive: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'isActive must be a boolean'
    })
});

// Product update schema
const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'Product name must be at least 3 characters long',
      'string.max': 'Product name cannot exceed 100 characters'
    }),

  description: Joi.string()
    .max(1000)
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),

  price: Joi.number()
    .min(0)
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative'
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative'
    }),

  categoryId: Joi.string()
    .uuid()
    .messages({
      'string.guid': 'Invalid category ID format'
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
      'boolean.base': 'isActive must be a boolean'
    })
});

// Product ID schema
const productIdSchema = Joi.object({
  productId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.empty': 'Product ID is required',
      'string.guid': 'Invalid product ID format'
    })
});

// Product query schema
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
    .max(100)
    .messages({
      'string.max': 'Search query cannot exceed 100 characters'
    }),

  category: Joi.string()
    .uuid()
    .messages({
      'string.guid': 'Invalid category ID format'
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

  sortBy: Joi.string()
    .valid('name', 'price', 'createdAt', 'updatedAt')
    .default('createdAt')
    .messages({
      'any.only': 'Invalid sort field'
    }),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    })
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productQuerySchema
}; 