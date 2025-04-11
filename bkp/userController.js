const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User } = require('../models');
const config = require('../config/config');
const { sendResponse, sendErrorResponse, ErrorTypes } = require('../utils/responseUtils');
const ResponseHandler = require('../utils/ResponseHandler');
const { logger } = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const BaseController = require('./BaseController');

console.log("Users Controller", User);

const generateAuthToken = async (user) => {
  const {secret, expiresIn} = config.jwt;
  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: expiresIn
  });
  return token;
};

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  async register(req, res) {
    try {
      const { email, password, name, phone, businessName, businessType } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return this.ResponseHandler.conflict(res, 'Email already registered');
      }

      const user = await User.create({
        email,
        password,
        name,
        phone,
        businessName,
        businessType
      });

      logger.info('User registered successfully', { userId: user.id });
      return this.ResponseHandler.created(res, user, 'User registered successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return this.ResponseHandler.unauthorized(res, 'Invalid email or password');
      }

      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return this.ResponseHandler.unauthorized(res, 'Invalid email or password');
      }

      const token = user.generateAuthToken();
      logger.info('User logged in successfully', { userId: user.id });
      return this.ResponseHandler.success(res, { token, user }, 'Login successful');
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      return this.ResponseHandler.success(res, user);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      const updatedUser = await user.update(req.body);
      logger.info('User profile updated', { userId: user.id });
      return this.ResponseHandler.success(res, updatedUser, 'Profile updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      const isPasswordValid = await user.validatePassword(currentPassword);
      if (!isPasswordValid) {
        return this.ResponseHandler.unauthorized(res, 'Current password is incorrect');
      }

      await user.update({ password: newPassword });
      logger.info('Password changed successfully', { userId: user.id });
      return this.ResponseHandler.success(res, null, 'Password changed successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: users } = await User.findAndCountAll({
        where,
        limit,
        offset,
        attributes: { exclude: ['password'] }
      });

      return this.ResponseHandler.success(res, {
        users,
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

  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      return this.ResponseHandler.success(res, user);
    } catch (error) {
      logger.error('Failed to get user', { error: error.message });
      return this.ResponseHandler.databaseError(res, error);
    }
  }

  async updateUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      const updatedUser = await user.update(req.body);
      logger.info('User updated', { userId: user.id });
      return this.ResponseHandler.success(res, updatedUser, 'User updated successfully');
    } catch (error) {
      logger.error('Failed to update user', { error: error.message });
      if (error.name === 'SequelizeValidationError') {
        return this.ResponseHandler.validationError(res, error);
      }
      return this.ResponseHandler.databaseError(res, error);
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      await user.destroy();
      logger.info('User deleted', { userId: user.id });
      return this.ResponseHandler.success(res, null, 'User deleted successfully');
    } catch (error) {
      logger.error('Failed to delete user', { error: error.message });
      return this.ResponseHandler.databaseError(res, error);
    }
  }
}

module.exports = new UserController(); 