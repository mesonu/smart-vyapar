const { Category, Product } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class CategoryController extends BaseController {
  constructor() {
    super(Category);
  }

  createCategory = async (req, res) => {
    try {
      const { name, description, parentId } = req.body;

      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return this.ResponseHandler.conflict(res, 'Category with this name already exists');
      }

      if (parentId) {
        const parentCategory = await Category.findByPk(parentId);
        if (!parentCategory) {
          return this.ResponseHandler.notFound(res, 'Parent category not found');
        }
      }

      const category = await Category.create({
        name,
        description,
        parentId
      });

      logger.info('Category created successfully', { categoryId: category.id });
      return this.ResponseHandler.created(res, category, 'Category created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllCategories = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, parentId } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ search, parentId });

      const { count, rows: categories } = await Category.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Category,
            as: 'parent',
            attributes: ['id', 'name']
          },
          {
            model: Product,
            attributes: ['id', 'name']
          }
        ],
        order: [['name', 'ASC']]
      });

      return this.ResponseHandler.success(res, {
        categories,
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

  getCategoryById = async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id, {
        include: [
          {
            model: Category,
            as: 'parent',
            attributes: ['id', 'name']
          },
          {
            model: Product,
            attributes: ['id', 'name', 'price']
          }
        ]
      });

      if (!category) {
        return this.ResponseHandler.notFound(res, 'Category not found');
      }

      return this.ResponseHandler.success(res, category);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateCategory = async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return this.ResponseHandler.notFound(res, 'Category not found');
      }

      const { name, description, parentId } = req.body;
      if (name && name !== category.name) {
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
          return this.ResponseHandler.conflict(res, 'Category with this name already exists');
        }
      }

      if (parentId) {
        const parentCategory = await Category.findByPk(parentId);
        if (!parentCategory) {
          return this.ResponseHandler.notFound(res, 'Parent category not found');
        }
      }

      const updatedCategory = await category.update({ name, description, parentId });

      logger.info('Category updated successfully', { categoryId: category.id });
      return this.ResponseHandler.success(res, updatedCategory, 'Category updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteCategory = async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return this.ResponseHandler.notFound(res, 'Category not found');
      }

      const hasProducts = await Product.count({ where: { categoryId: category.id } });
      if (hasProducts > 0) {
        return this.ResponseHandler.badRequest(res, 'Cannot delete category with associated products');
      }

      const hasChildren = await Category.count({ where: { parentId: category.id } });
      if (hasChildren > 0) {
        return this.ResponseHandler.badRequest(res, 'Cannot delete category with child categories');
      }

      await category.destroy();

      logger.info('Category deleted successfully', { categoryId: category.id });
      return this.ResponseHandler.success(res, null, 'Category deleted successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getProductsByCategory = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return this.ResponseHandler.notFound(res, 'Category not found');
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where: { categoryId: category.id },
        limit,
        offset,
        order: [['name', 'ASC']]
      });

      return this.ResponseHandler.success(res, {
        category,
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
    const { search, parentId } = filters;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (parentId) {
      where.parentId = parentId;
    }

    return where;
  };
}

module.exports = new CategoryController(); 