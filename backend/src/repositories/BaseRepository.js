const { logger } = require('../utils/logger');
const { ResponseHandler } = require('../utils/ResponseHandler');

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Get all records with optional filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    try {
      const {
        where = {},
        attributes = null,
        include = [],
        order = [['createdAt', 'DESC']],
        limit = 10,
        offset = 0,
        raw = false
      } = options;

      const result = await this.model.findAll({
        where,
        attributes,
        include,
        order,
        limit,
        offset,
        raw
      });

      return result;
    } catch (error) {
      logger.error(`Error in findAll for ${this.model.name}:`, error);
      throw error;
    }
  }

  /**
   * Find one record by ID or conditions
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Single record
   */
  async findOne(options = {}) {
    try {
      const {
        where = {},
        attributes = null,
        include = [],
        raw = false
      } = options;

      const result = await this.model.findOne({
        where,
        attributes,
        include,
        raw
      });

      return result;
    } catch (error) {
      logger.error(`Error in findOne for ${this.model.name}:`, error);
      throw error;
    }
  }

  /**
   * Find record by ID
   * @param {number|string} id - Record ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Single record
   */
  async findById(id, options = {}) {
    try {
      const {
        attributes = null,
        include = [],
        raw = false
      } = options;

      const result = await this.model.findByPk(id, {
        attributes,
        include,
        raw
      });

      return result;
    } catch (error) {
      logger.error(`Error in findById for ${this.model.name}:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Created record
   */
  async create(data, options = {}) {
    try {
      const { raw = false } = options;
      const result = await this.model.create(data, { raw });
      return result;
    } catch (error) {
      logger.error(`Error in create for ${this.model.name}:`, error);
      throw error;
    }
  }

  /**
   * Update a record
   * @param {Object} data - Update data
   * @param {Object} options - Update conditions
   * @returns {Promise<Array>} Updated records count
   */
  async update(data, options = {}) {
    try {
      const { where = {}, returning = true, raw = false } = options;
      const [affectedCount, affectedRows] = await this.model.update(data, {
        where,
        returning,
        raw
      });
      return { affectedCount, affectedRows };
    } catch (error) {
      logger.error(`Error in update for ${this.model.name}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record
   * @param {Object} options - Delete conditions
   * @returns {Promise<number>} Number of deleted records
   */
  async delete(options = {}) {
    try {
      const { where = {} } = options;
      const result = await this.model.destroy({ where });
      return result;
    } catch (error) {
      logger.error(`Error in delete for ${this.model.name}:`, error);
      throw error;
    }
  }

  /**
   * Count records
   * @param {Object} options - Count conditions
   * @returns {Promise<number>} Number of records
   */
  async count(options = {}) {
    try {
      const { where = {} } = options;
      const result = await this.model.count({ where });
      return result;
    } catch (error) {
      logger.error(`Error in count for ${this.model.name}:`, error);
      throw error;
    }
  }

  /**
   * Get paginated results
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated results
   */
  async paginate(options = {}) {
    try {
      const {
        where = {},
        attributes = null,
        include = [],
        order = [['createdAt', 'DESC']],
        page = 1,
        limit = 10,
        raw = false
      } = options;

      const offset = (page - 1) * limit;

      const { count, rows } = await this.model.findAndCountAll({
        where,
        attributes,
        include,
        order,
        limit,
        offset,
        raw
      });

      return {
        data: rows,
        pagination: {
          total: count,
          page,
          pageSize: limit,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      logger.error(`Error in paginate for ${this.model.name}:`, error);
      throw error;
    }
  }
}

module.exports = BaseRepository; 