const BaseRepository = require('./BaseRepository');
const { User } = require('../models');
const { logger } = require('../utils/logger');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} User object
   */
  async findByEmail(email, options = {}) {
    try {
      const {
        attributes = null,
        include = [],
        raw = true
      } = options;

      return await this.findOne({
        where: { email },
        attributes,
        include,
        raw
      });
    } catch (error) {
      logger.error('Error in findByEmail:', error);
      throw error;
    }
  }

  /**
   * Find user by phone
   * @param {string} phone - User phone number
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} User object
   */
  async findByPhone(phone, options = {}) {
    try {
      const {
        attributes = null,
        include = [],
        raw = true
      } = options;

      return await this.findOne({
        where: { phone },
        attributes,
        include,
        raw
      });
    } catch (error) {
      logger.error('Error in findByPhone:', error);
      throw error;
    }
  }

  /**
   * Update user password
   * @param {number} userId - User ID
   * @param {string} newPassword - New password hash
   * @returns {Promise<Object>} Update result
   */
  async updatePassword(userId, newPassword) {
    try {
      return await this.update(
        { password: newPassword },
        { where: { id: userId } }
      );
    } catch (error) {
      logger.error('Error in updatePassword:', error);
      throw error;
    }
  }

  /**
   * Update user status
   * @param {number} userId - User ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Update result
   */
  async updateStatus(userId, status) {
    try {
      return await this.update(
        { status },
        { where: { id: userId } }
      );
    } catch (error) {
      logger.error('Error in updateStatus:', error);
      throw error;
    }
  }

  /**
   * Update last login timestamp
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Update result
   */
  async updateLastLogin(userId) {
    try {
      return await this.update(
        { lastLogin: new Date() },
        { where: { id: userId } }
      );
    } catch (error) {
      logger.error('Error in updateLastLogin:', error);
      throw error;
    }
  }

  /**
   * Get users by role
   * @param {string} role - User role
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of users
   */
  async findByRole(role, options = {}) {
    try {
      const {
        attributes = null,
        include = [],
        order = [['createdAt', 'DESC']],
        limit = 10,
        offset = 0,
        raw = true
      } = options;

      return await this.findAll({
        where: { role },
        attributes,
        include,
        order,
        limit,
        offset,
        raw
      });
    } catch (error) {
      logger.error('Error in findByRole:', error);
      throw error;
    }
  }

  /**
   * Get active users
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of active users
   */
  async findActiveUsers(options = {}) {
    try {
      const {
        attributes = null,
        include = [],
        order = [['createdAt', 'DESC']],
        limit = 10,
        offset = 0,
        raw = true
      } = options;

      return await this.findAll({
        where: { status: 'active' },
        attributes,
        include,
        order,
        limit,
        offset,
        raw
      });
    } catch (error) {
      logger.error('Error in findActiveUsers:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository(); 