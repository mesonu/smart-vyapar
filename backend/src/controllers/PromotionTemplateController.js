const { PromotionTemplate, Promotion } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class PromotionTemplateController extends BaseController {
  constructor() {
    super(PromotionTemplate);
  }

  createTemplate = async (req, res) => {
    try {
      const {
        name,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        isActive = true,
        conditions = {},
        restrictions = {}
      } = req.body;

      // Validate discount type and value
      if (!['percentage', 'fixed'].includes(discountType)) {
        return this.ResponseHandler.badRequest(res, 'Invalid discount type');
      }

      if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
        return this.ResponseHandler.badRequest(res, 'Percentage discount must be between 0 and 100');
      }

      if (discountType === 'fixed' && discountValue <= 0) {
        return this.ResponseHandler.badRequest(res, 'Fixed discount must be greater than 0');
      }

      // Check if template name is unique
      const existingTemplate = await PromotionTemplate.findOne({ where: { name } });
      if (existingTemplate) {
        return this.ResponseHandler.conflict(res, 'Template name already exists');
      }

      const template = await PromotionTemplate.create({
        name,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        isActive,
        conditions,
        restrictions
      });

      logger.info('Promotion template created successfully', { templateId: template.id });
      return this.ResponseHandler.created(res, template, 'Promotion template created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllTemplates = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        isActive,
        discountType,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({
        isActive,
        discountType,
        search
      });

      const { count, rows: templates } = await PromotionTemplate.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]]
      });

      return this.ResponseHandler.success(res, {
        templates,
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

  getTemplateById = async (req, res) => {
    try {
      const template = await PromotionTemplate.findByPk(req.params.id);
      if (!template) {
        return this.ResponseHandler.notFound(res, 'Template not found');
      }

      return this.ResponseHandler.success(res, template);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateTemplate = async (req, res) => {
    try {
      const template = await PromotionTemplate.findByPk(req.params.id);
      if (!template) {
        return this.ResponseHandler.notFound(res, 'Template not found');
      }

      const {
        name,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        isActive,
        conditions,
        restrictions
      } = req.body;

      // Validate discount type and value if being updated
      if (discountType && !['percentage', 'fixed'].includes(discountType)) {
        return this.ResponseHandler.badRequest(res, 'Invalid discount type');
      }

      if (discountType === 'percentage' && discountValue && (discountValue <= 0 || discountValue > 100)) {
        return this.ResponseHandler.badRequest(res, 'Percentage discount must be between 0 and 100');
      }

      if (discountType === 'fixed' && discountValue && discountValue <= 0) {
        return this.ResponseHandler.badRequest(res, 'Fixed discount must be greater than 0');
      }

      // Check if template name is unique if being updated
      if (name && name !== template.name) {
        const existingTemplate = await PromotionTemplate.findOne({ where: { name } });
        if (existingTemplate) {
          return this.ResponseHandler.conflict(res, 'Template name already exists');
        }
      }

      const updatedTemplate = await template.update({
        name,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        isActive,
        conditions,
        restrictions
      });

      logger.info('Template updated successfully', { templateId: template.id });
      return this.ResponseHandler.success(res, updatedTemplate, 'Template updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteTemplate = async (req, res) => {
    try {
      const template = await PromotionTemplate.findByPk(req.params.id);
      if (!template) {
        return this.ResponseHandler.notFound(res, 'Template not found');
      }

      // Check if template is being used by any promotions
      const promotions = await Promotion.count({ where: { templateId: template.id } });
      if (promotions > 0) {
        return this.ResponseHandler.badRequest(
          res,
          'Cannot delete template that is being used by promotions'
        );
      }

      await template.destroy();

      logger.info('Template deleted successfully', { templateId: template.id });
      return this.ResponseHandler.success(res, null, 'Template deleted successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  createPromotionFromTemplate = async (req, res) => {
    try {
      const template = await PromotionTemplate.findByPk(req.params.id);
      if (!template) {
        return this.ResponseHandler.notFound(res, 'Template not found');
      }

      const {
        name,
        description,
        startDate,
        endDate,
        isActive = true,
        productIds = [],
        categoryIds = []
      } = req.body;

      // Create promotion from template
      const promotion = await Promotion.create({
        name: name || template.name,
        description: description || template.description,
        discountType: template.discountType,
        discountValue: template.discountValue,
        minPurchaseAmount: template.minPurchaseAmount,
        maxDiscountAmount: template.maxDiscountAmount,
        usageLimit: template.usageLimit,
        startDate,
        endDate,
        isActive,
        templateId: template.id,
        conditions: template.conditions,
        restrictions: template.restrictions
      });

      // Associate products and categories if provided
      if (productIds.length > 0) {
        await promotion.setProducts(productIds);
      }

      if (categoryIds.length > 0) {
        await promotion.setCategories(categoryIds);
      }

      logger.info('Promotion created from template', {
        templateId: template.id,
        promotionId: promotion.id
      });

      return this.ResponseHandler.created(
        res,
        promotion,
        'Promotion created from template successfully'
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { isActive, discountType, search } = filters;

    if (isActive !== undefined) where.isActive = isActive;
    if (discountType) where.discountType = discountType;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    return where;
  };
}

module.exports = new PromotionTemplateController(); 