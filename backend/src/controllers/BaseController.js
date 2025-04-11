const ResponseHandler = require('../utils/ResponseHandler');
const { logger } = require('../utils/logger');

class BaseController {
  constructor(model) {
    this.model = model;
    this.ResponseHandler = ResponseHandler;
  }

  async handleError(error, res) {
    logger.error(`Error in ${this.constructor.name}:`, { error: error.message });
    
    if (error.name === 'SequelizeValidationError') {
      return this.ResponseHandler.validationError(res, error);
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return this.ResponseHandler.conflict(res, 'Duplicate entry found');
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return this.ResponseHandler.error(res, 'Foreign key constraint violation', 400);
    }
    
    return this.ResponseHandler.databaseError(res, error);
  }

  async create(req, res) {
    try {
      const data = await this.model.create(req.body);
      logger.info(`${this.model.name} created successfully`, { id: data.id });
      return this.ResponseHandler.created(res, data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: data } = await this.model.findAndCountAll({
        where: this.buildWhereClause(filters),
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        data,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async getById(req, res) {
    try {
      const data = await this.model.findByPk(req.params.id);
      if (!data) {
        return this.ResponseHandler.notFound(res, `${this.model.name} not found`);
      }
      return this.ResponseHandler.success(res, data);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async update(req, res) {
    try {
      const data = await this.model.findByPk(req.params.id);
      if (!data) {
        return this.ResponseHandler.notFound(res, `${this.model.name} not found`);
      }

      const updated = await data.update(req.body);
      logger.info(`${this.model.name} updated`, { id: data.id });
      return this.ResponseHandler.success(res, updated);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async delete(req, res) {
    try {
      const data = await this.model.findByPk(req.params.id);
      if (!data) {
        return this.ResponseHandler.notFound(res, `${this.model.name} not found`);
      }

      await data.destroy();
      logger.info(`${this.model.name} deleted`, { id: data.id });
      return this.ResponseHandler.success(res, null, `${this.model.name} deleted successfully`);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  buildWhereClause(filters) {
    const where = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        where[key] = value;
      }
    });
    return where;
  }
}

module.exports = BaseController; 