const { ProductReview, Product, User } = require('../models');
const { Op } = require('sequelize');

const productReviewController = {
  async getAllReviews(req, res) {
    try {
      const { productId, userId, status, rating, page = 1, limit = 10 } = req.query;
      const where = {};

      if (productId) where.productId = productId;
      if (userId) where.userId = userId;
      if (status) where.status = status;
      if (rating) where.rating = rating;

      const reviews = await ProductReview.findAndCountAll({
        where,
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        total: reviews.count,
        page: parseInt(page),
        totalPages: Math.ceil(reviews.count / limit),
        reviews: reviews.rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getReviewById(req, res) {
    try {
      const review = await ProductReview.findByPk(req.params.id, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createReview(req, res) {
    try {
      const review = await ProductReview.create({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateReview(req, res) {
    try {
      const review = await ProductReview.findByPk(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Only allow the review owner or admin to update
      if (review.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await review.update(req.body);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteReview(req, res) {
    try {
      const review = await ProductReview.findByPk(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Only allow the review owner or admin to delete
      if (review.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await review.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateReviewStatus(req, res) {
    try {
      const review = await ProductReview.findByPk(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Only allow admin to update status
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await review.update({ status: req.body.status });
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async voteHelpful(req, res) {
    try {
      const review = await ProductReview.findByPk(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      await review.increment('helpfulVotes');
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productReviewController; 