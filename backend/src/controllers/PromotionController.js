const { Promotion, Product, Category } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class PromotionController extends BaseController {
  constructor() {
    super(Promotion);
  }

  createPromotion = async (req, res) => {
    try {
      const {
        name,
        description,
        discountType,
        discountValue,
        startDate,
        endDate,
        minPurchaseAmount,
        maxDiscountAmount,
        isActive,
        productIds,
        categoryIds
      } = req.body;

      // Validate dates
      if (new Date(startDate) >= new Date(endDate)) {
        return this.ResponseHandler.badRequest(res, 'End date must be after start date');
      }

      // Validate discount value based on type
      if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
        return this.ResponseHandler.badRequest(res, 'Percentage discount must be between 0 and 100');
      }

      if (discountType === 'fixed' && discountValue <= 0) {
        return this.ResponseHandler.badRequest(res, 'Fixed discount must be greater than 0');
      }

      const promotion = await Promotion.create({
        name,
        description,
        discountType,
        discountValue,
        startDate,
        endDate,
        minPurchaseAmount,
        maxDiscountAmount,
        isActive
      });

      // Associate products if provided
      if (productIds && productIds.length > 0) {
        const products = await Product.findAll({ where: { id: productIds } });
        if (products.length !== productIds.length) {
          await promotion.destroy();
          return this.ResponseHandler.badRequest(res, 'One or more products not found');
        }
        await promotion.setProducts(products);
      }

      // Associate categories if provided
      if (categoryIds && categoryIds.length > 0) {
        const categories = await Category.findAll({ where: { id: categoryIds } });
        if (categories.length !== categoryIds.length) {
          await promotion.destroy();
          return this.ResponseHandler.badRequest(res, 'One or more categories not found');
        }
        await promotion.setCategories(categories);
      }

      logger.info('Promotion created successfully', { promotionId: promotion.id });
      return this.ResponseHandler.created(res, promotion, 'Promotion created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllPromotions = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, isActive, discountType } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ search, isActive, discountType });

      const { count, rows: promotions } = await Promotion.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'price']
          },
          {
            model: Category,
            attributes: ['id', 'name']
          }
        ],
        order: [['startDate', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        promotions,
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

  getPromotionById = async (req, res) => {
    try {
      const promotion = await Promotion.findByPk(req.params.id, {
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'price']
          },
          {
            model: Category,
            attributes: ['id', 'name']
          }
        ]
      });

      if (!promotion) {
        return this.ResponseHandler.notFound(res, 'Promotion not found');
      }

      return this.ResponseHandler.success(res, promotion);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updatePromotion = async (req, res) => {
    try {
      const promotion = await Promotion.findByPk(req.params.id);
      if (!promotion) {
        return this.ResponseHandler.notFound(res, 'Promotion not found');
      }

      const {
        name,
        description,
        discountType,
        discountValue,
        startDate,
        endDate,
        minPurchaseAmount,
        maxDiscountAmount,
        isActive,
        productIds,
        categoryIds
      } = req.body;

      // Validate dates if provided
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return this.ResponseHandler.badRequest(res, 'End date must be after start date');
      }

      // Validate discount value if provided
      if (discountValue) {
        if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
          return this.ResponseHandler.badRequest(res, 'Percentage discount must be between 0 and 100');
        }
        if (discountType === 'fixed' && discountValue <= 0) {
          return this.ResponseHandler.badRequest(res, 'Fixed discount must be greater than 0');
        }
      }

      const updatedPromotion = await promotion.update({
        name,
        description,
        discountType,
        discountValue,
        startDate,
        endDate,
        minPurchaseAmount,
        maxDiscountAmount,
        isActive
      });

      // Update product associations if provided
      if (productIds) {
        const products = await Product.findAll({ where: { id: productIds } });
        if (products.length !== productIds.length) {
          return this.ResponseHandler.badRequest(res, 'One or more products not found');
        }
        await promotion.setProducts(products);
      }

      // Update category associations if provided
      if (categoryIds) {
        const categories = await Category.findAll({ where: { id: categoryIds } });
        if (categories.length !== categoryIds.length) {
          return this.ResponseHandler.badRequest(res, 'One or more categories not found');
        }
        await promotion.setCategories(categories);
      }

      logger.info('Promotion updated successfully', { promotionId: promotion.id });
      return this.ResponseHandler.success(res, updatedPromotion, 'Promotion updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deletePromotion = async (req, res) => {
    try {
      const promotion = await Promotion.findByPk(req.params.id);
      if (!promotion) {
        return this.ResponseHandler.notFound(res, 'Promotion not found');
      }

      await promotion.destroy();

      logger.info('Promotion deleted successfully', { promotionId: promotion.id });
      return this.ResponseHandler.success(res, null, 'Promotion deleted successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getActivePromotions = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: promotions } = await Promotion.findAndCountAll({
        where: {
          isActive: true,
          startDate: { [Op.lte]: new Date() },
          endDate: { [Op.gte]: new Date() }
        },
        limit,
        offset,
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'price']
          },
          {
            model: Category,
            attributes: ['id', 'name']
          }
        ],
        order: [['startDate', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        promotions,
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

  buildWhereClause = (filters) => {
    const where = {};
    const { search, isActive, discountType } = filters;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (discountType) {
      where.discountType = discountType;
    }

    return where;
  };
}

module.exports = new PromotionController(); 