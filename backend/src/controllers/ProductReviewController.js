const { ProductReview, Product, User } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class ProductReviewController extends BaseController {
  constructor() {
    super(ProductReview);
  }

  createReview = async (req, res) => {
    try {
      const { productId, rating, comment } = req.body;
      const userId = req.user.id;

      // Validate product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return this.ResponseHandler.notFound(res, 'Product not found');
      }

      // Check if user has already reviewed this product
      const existingReview = await ProductReview.findOne({
        where: { userId, productId }
      });

      if (existingReview) {
        return this.ResponseHandler.conflict(res, 'You have already reviewed this product');
      }

      // Validate rating
      if (rating < 1 || rating > 5) {
        return this.ResponseHandler.badRequest(res, 'Rating must be between 1 and 5');
      }

      const review = await ProductReview.create({
        userId,
        productId,
        rating,
        comment
      });

      // Update product average rating
      await this.updateProductRating(productId);

      logger.info('Review created successfully', { reviewId: review.id });
      return this.ResponseHandler.created(res, review, 'Review created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllReviews = async (req, res) => {
    try {
      const { page = 1, limit = 10, productId, userId, rating, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ productId, userId, rating });

      const { count, rows: reviews } = await ProductReview.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: Product,
            attributes: ['id', 'name']
          }
        ],
        order: [[sortBy, sortOrder]]
      });

      return this.ResponseHandler.success(res, {
        reviews,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getReviewById = async (req, res) => {
    try {
      const review = await ProductReview.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: Product,
            attributes: ['id', 'name']
          }
        ]
      });

      if (!review) {
        return this.ResponseHandler.notFound(res, 'Review not found');
      }

      return this.ResponseHandler.success(res, review);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateReview = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const review = await ProductReview.findByPk(req.params.id);

      if (!review) {
        return this.ResponseHandler.notFound(res, 'Review not found');
      }

      // Check if user owns the review
      if (review.userId !== req.user.id) {
        return this.ResponseHandler.unauthorized(res, 'You can only update your own reviews');
      }

      // Validate rating if provided
      if (rating && (rating < 1 || rating > 5)) {
        return this.ResponseHandler.badRequest(res, 'Rating must be between 1 and 5');
      }

      const updatedReview = await review.update({
        rating: rating || review.rating,
        comment: comment || review.comment
      });

      // Update product average rating
      await this.updateProductRating(review.productId);

      logger.info('Review updated successfully', { reviewId: review.id });
      return this.ResponseHandler.success(res, updatedReview, 'Review updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteReview = async (req, res) => {
    try {
      const review = await ProductReview.findByPk(req.params.id);

      if (!review) {
        return this.ResponseHandler.notFound(res, 'Review not found');
      }

      // Check if user owns the review or is an admin
      if (review.userId !== req.user.id && req.user.role !== 'admin') {
        return this.ResponseHandler.unauthorized(res, 'You can only delete your own reviews');
      }

      const productId = review.productId;
      await review.destroy();

      // Update product average rating
      await this.updateProductRating(productId);

      logger.info('Review deleted successfully', { reviewId: review.id });
      return this.ResponseHandler.success(res, null, 'Review deleted successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getProductReviews = async (req, res) => {
    try {
      const { page = 1, limit = 10, rating, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

      const where = {
        productId: req.params.productId,
        ...(rating && { rating })
      };

      const { count, rows: reviews } = await ProductReview.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [[sortBy, sortOrder]]
      });

      return this.ResponseHandler.success(res, {
        reviews,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getUserReviews = async (req, res) => {
    try {
      const { page = 1, limit = 10, rating, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

      const where = {
        userId: req.params.userId,
        ...(rating && { rating })
      };

      const { count, rows: reviews } = await ProductReview.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Product,
            attributes: ['id', 'name']
          }
        ],
        order: [[sortBy, sortOrder]]
      });

      return this.ResponseHandler.success(res, {
        reviews,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateProductRating = async (productId) => {
    const result = await ProductReview.findOne({
      where: { productId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
      ]
    });

    await Product.update(
      {
        averageRating: result.getDataValue('averageRating'),
        reviewCount: result.getDataValue('reviewCount')
      },
      { where: { id: productId } }
    );
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { productId, userId, rating } = filters;

    if (productId) where.productId = productId;
    if (userId) where.userId = userId;
    if (rating) where.rating = rating;

    return where;
  };
}

module.exports = new ProductReviewController(); 