const { ProductVariant, Product } = require('../models');
const { Op } = require('sequelize');

const productVariantController = {
  async getAllVariants(req, res) {
    try {
      const { productId, search, status, page = 1, limit = 10 } = req.query;
      const where = {};

      if (productId) where.productId = productId;
      if (status) where.status = status;
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { sku: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const variants = await ProductVariant.findAndCountAll({
        where,
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku']
        }],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        total: variants.count,
        page: parseInt(page),
        totalPages: Math.ceil(variants.count / limit),
        variants: variants.rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getVariantById(req, res) {
    try {
      const variant = await ProductVariant.findByPk(req.params.id, {
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku']
        }]
      });

      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      res.json(variant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createVariant(req, res) {
    try {
      const variant = await ProductVariant.create(req.body);
      res.status(201).json(variant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateVariant(req, res) {
    try {
      const variant = await ProductVariant.findByPk(req.params.id);
      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      await variant.update(req.body);
      res.json(variant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteVariant(req, res) {
    try {
      const variant = await ProductVariant.findByPk(req.params.id);
      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      await variant.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateVariantStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity, type } = req.body;

      const variant = await ProductVariant.findByPk(id);
      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      if (type === 'remove' && variant.stockQuantity < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      const newStock = type === 'add' 
        ? variant.stockQuantity + quantity 
        : variant.stockQuantity - quantity;

      await variant.update({ stockQuantity: newStock });
      res.json(variant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productVariantController; 