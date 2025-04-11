const { Tag, Product, ProductTag } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class TagController extends BaseController {
  constructor() {
    super(Tag);
  }

  createTag = async (req, res) => {
    try {
      const { name, description } = req.body;

      const existingTag = await Tag.findOne({ where: { name } });
      if (existingTag) {
        return this.ResponseHandler.conflict(res, 'Tag with this name already exists');
      }

      const tag = await Tag.create({
        name,
        description
      });

      logger.info('Tag created successfully', { tagId: tag.id });
      return this.ResponseHandler.created(res, tag, 'Tag created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllTags = async (req, res) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ search });

      const { count, rows: tags } = await Tag.findAndCountAll({
        where,
        limit,
        offset,
        include: [{
          model: Product,
          through: { attributes: [] }
        }],
        order: [['name', 'ASC']]
      });

      return this.ResponseHandler.success(res, {
        tags,
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

  getTagById = async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id, {
        include: [{
          model: Product,
          through: { attributes: [] }
        }]
      });

      if (!tag) {
        return this.ResponseHandler.notFound(res, 'Tag not found');
      }

      return this.ResponseHandler.success(res, tag);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateTag = async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return this.ResponseHandler.notFound(res, 'Tag not found');
      }

      const { name, description } = req.body;
      if (name && name !== tag.name) {
        const existingTag = await Tag.findOne({ where: { name } });
        if (existingTag) {
          return this.ResponseHandler.conflict(res, 'Tag with this name already exists');
        }
      }

      const updatedTag = await tag.update({ name, description });

      logger.info('Tag updated successfully', { tagId: tag.id });
      return this.ResponseHandler.success(res, updatedTag, 'Tag updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteTag = async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return this.ResponseHandler.notFound(res, 'Tag not found');
      }

      await ProductTag.destroy({ where: { tagId: tag.id } });
      await tag.destroy();

      logger.info('Tag deleted successfully', { tagId: tag.id });
      return this.ResponseHandler.success(res, null, 'Tag deleted successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getProductsByTag = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return this.ResponseHandler.notFound(res, 'Tag not found');
      }

      const { count, rows: products } = await Product.findAndCountAll({
        include: [{
          model: Tag,
          where: { id: tag.id },
          through: { attributes: [] }
        }],
        limit,
        offset,
        order: [['name', 'ASC']]
      });

      return this.ResponseHandler.success(res, {
        tag,
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

  buildWhereClause = (filters) => {
    const where = {};
    const { search } = filters;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    return where;
  };
}

module.exports = new TagController(); 