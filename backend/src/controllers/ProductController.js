const { Product, Tag, ProductTag } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class ProductController extends BaseController {
  constructor() {
    super(Product);
  }

  createProduct = async (req, res) => {
    try {
      const { name, description, price, stock, category, sku, imageUrl, tags } = req.body;

      const existingProduct = await Product.findOne({ where: { sku } });
      if (existingProduct) {
        return this.ResponseHandler.conflict(res, 'Product with this SKU already exists');
      }

      const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        sku,
        imageUrl
      });

      if (tags && tags.length > 0) {
        await this._handleProductTags(product.id, tags);
      }

      logger.info('Product created successfully', { productId: product.id });
      return this.ResponseHandler.created(res, product, 'Product created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllProducts = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, category, minPrice, maxPrice, inStock } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({
        search,
        category,
        minPrice,
        maxPrice,
        inStock
      });

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        limit,
        offset,
        include: [{
          model: Tag,
          through: { attributes: [] }
        }]
      });

      return this.ResponseHandler.success(res, {
        products,
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

  getProductById = async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [{
          model: Tag,
          through: { attributes: [] }
        }]
      });

      if (!product) {
        return this.ResponseHandler.notFound(res, 'Product not found');
      }

      return this.ResponseHandler.success(res, product);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateProduct = async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return this.ResponseHandler.notFound(res, 'Product not found');
      }

      const { tags, ...updateData } = req.body;
      const updatedProduct = await product.update(updateData);

      if (tags) {
        await this._handleProductTags(product.id, tags);
      }

      logger.info('Product updated successfully', { productId: product.id });
      return this.ResponseHandler.success(res, updatedProduct, 'Product updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return this.ResponseHandler.notFound(res, 'Product not found');
      }

      await product.destroy();
      logger.info('Product deleted successfully', { productId: product.id });
      return this.ResponseHandler.success(res, null, 'Product deleted successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { search, category, minPrice, maxPrice, inStock } = filters;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (category) where.category = category;
    if (minPrice) where.price = { [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };
    if (inStock === 'true') where.stock = { [Op.gt]: 0 };

    return where;
  };

  _handleProductTags = async (productId, tags) => {
    await ProductTag.destroy({ where: { productId } });

    const tagInstances = await Promise.all(
      tags.map(tagName => 
        Tag.findOrCreate({
          where: { name: tagName },
          defaults: { name: tagName }
        })
      )
    );

    await ProductTag.bulkCreate(
      tagInstances.map(([tag]) => ({
        productId,
        tagId: tag.id
      }))
    );
  };
}

module.exports = new ProductController(); 