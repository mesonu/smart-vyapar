const { ProductVariant, Product, Inventory } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class ProductVariantController extends BaseController {
  constructor() {
    super(ProductVariant);
  }

  createVariant = async (req, res) => {
    try {
      const {
        productId,
        sku,
        name,
        description,
        price,
        compareAtPrice,
        cost,
        weight,
        weightUnit,
        dimensions,
        options,
        stock,
        isActive = true
      } = req.body;

      // Validate product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return this.ResponseHandler.notFound(res, 'Product not found');
      }

      // Check if SKU is unique
      const existingVariant = await ProductVariant.findOne({ where: { sku } });
      if (existingVariant) {
        return this.ResponseHandler.conflict(res, 'SKU already exists');
      }

      const variant = await ProductVariant.create({
        productId,
        sku,
        name,
        description,
        price,
        compareAtPrice,
        cost,
        weight,
        weightUnit,
        dimensions,
        options,
        isActive
      });

      // Create inventory record
      await Inventory.create({
        variantId: variant.id,
        quantity: stock || 0,
        lowStockThreshold: 10 // Default threshold
      });

      logger.info('Variant created successfully', { variantId: variant.id });
      return this.ResponseHandler.created(res, variant, 'Variant created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllVariants = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        productId,
        isActive,
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({
        productId,
        isActive,
        minPrice,
        maxPrice,
        search
      });

      const { count, rows: variants } = await ProductVariant.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Product,
            attributes: ['id', 'name']
          },
          {
            model: Inventory,
            attributes: ['quantity', 'lowStockThreshold']
          }
        ],
        order: [[sortBy, sortOrder]]
      });

      return this.ResponseHandler.success(res, {
        variants,
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

  getVariantById = async (req, res) => {
    try {
      const variant = await ProductVariant.findByPk(req.params.id, {
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'description']
          },
          {
            model: Inventory,
            attributes: ['quantity', 'lowStockThreshold']
          }
        ]
      });

      if (!variant) {
        return this.ResponseHandler.notFound(res, 'Variant not found');
      }

      return this.ResponseHandler.success(res, variant);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateVariant = async (req, res) => {
    try {
      const variant = await ProductVariant.findByPk(req.params.id);
      if (!variant) {
        return this.ResponseHandler.notFound(res, 'Variant not found');
      }

      const {
        sku,
        name,
        description,
        price,
        compareAtPrice,
        cost,
        weight,
        weightUnit,
        dimensions,
        options,
        isActive,
        stock
      } = req.body;

      // Check if SKU is unique if being updated
      if (sku && sku !== variant.sku) {
        const existingVariant = await ProductVariant.findOne({ where: { sku } });
        if (existingVariant) {
          return this.ResponseHandler.conflict(res, 'SKU already exists');
        }
      }

      const updatedVariant = await variant.update({
        sku,
        name,
        description,
        price,
        compareAtPrice,
        cost,
        weight,
        weightUnit,
        dimensions,
        options,
        isActive
      });

      // Update inventory if stock is provided
      if (stock !== undefined) {
        const inventory = await Inventory.findOne({ where: { variantId: variant.id } });
        if (inventory) {
          await inventory.update({ quantity: stock });
        }
      }

      logger.info('Variant updated successfully', { variantId: variant.id });
      return this.ResponseHandler.success(res, updatedVariant, 'Variant updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteVariant = async (req, res) => {
    try {
      const variant = await ProductVariant.findByPk(req.params.id);
      if (!variant) {
        return this.ResponseHandler.notFound(res, 'Variant not found');
      }

      // Check if variant has inventory
      const inventory = await Inventory.findOne({ where: { variantId: variant.id } });
      if (inventory && inventory.quantity > 0) {
        return this.ResponseHandler.badRequest(
          res,
          'Cannot delete variant with existing inventory'
        );
      }

      await variant.destroy();

      logger.info('Variant deleted successfully', { variantId: variant.id });
      return this.ResponseHandler.success(res, null, 'Variant deleted successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getProductVariants = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        isActive,
        minPrice,
        maxPrice,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;
      const offset = (page - 1) * limit;

      const where = {
        productId: req.params.productId,
        ...this.buildWhereClause({ isActive, minPrice, maxPrice })
      };

      const { count, rows: variants } = await ProductVariant.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Inventory,
            attributes: ['quantity', 'lowStockThreshold']
          }
        ],
        order: [[sortBy, sortOrder]]
      });

      return this.ResponseHandler.success(res, {
        variants,
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

  updateVariantStatus = async (req, res) => {
    try {
      const { isActive } = req.body;
      const variant = await ProductVariant.findByPk(req.params.id);

      if (!variant) {
        return this.ResponseHandler.notFound(res, 'Variant not found');
      }

      const updatedVariant = await variant.update({ isActive });

      logger.info('Variant status updated', {
        variantId: variant.id,
        status: isActive ? 'active' : 'inactive'
      });

      return this.ResponseHandler.success(res, updatedVariant, 'Variant status updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { productId, isActive, minPrice, maxPrice, search } = filters;

    if (productId) where.productId = productId;
    if (isActive !== undefined) where.isActive = isActive;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    return where;
  };
}

module.exports = new ProductVariantController(); 