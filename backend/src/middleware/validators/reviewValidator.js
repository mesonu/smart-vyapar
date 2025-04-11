const Joi = require('joi');

const reviewSchema = Joi.object({
  productId: Joi.number().integer().required().messages({
    'number.base': 'Product ID must be a number',
    'number.integer': 'Product ID must be an integer',
    'any.required': 'Product ID is required'
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number',
    'number.integer': 'Rating must be an integer',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5',
    'any.required': 'Rating is required'
  }),
  title: Joi.string().max(100).messages({
    'string.max': 'Title cannot exceed 100 characters'
  }),
  comment: Joi.string().required().min(10).max(1000).messages({
    'string.empty': 'Comment is required',
    'string.min': 'Comment must be at least 10 characters long',
    'string.max': 'Comment cannot exceed 1000 characters',
    'any.required': 'Comment is required'
  }),
  images: Joi.array().items(Joi.string().uri()).max(5).messages({
    'array.max': 'Cannot upload more than 5 images',
    'string.uri': 'Image URLs must be valid URIs'
  })
});

const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required().messages({
    'string.empty': 'Status is required',
    'any.only': 'Status must be one of: pending, approved, rejected',
    'any.required': 'Status is required'
  })
});

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    return res.status(400).json({ errors });
  }
  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { error } = statusUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = {
  validateReview,
  validateStatusUpdate
}; 