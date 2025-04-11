const { User } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  register = async (req, res) => {
    try {
      const { username, email, password, role, firstName, lastName, phone } = req.body;

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        return this.ResponseHandler.conflict(res, 'User with this email or username already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName,
        phone
      });

      logger.info('User registered successfully', { userId: user.id });
      return this.ResponseHandler.created(res, user, 'User registered successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  login = async (req, res) => {
    try {
      const {secret, expiresIn} = this.config.jwt;
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return this.ResponseHandler.unauthorized(res, 'Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return this.ResponseHandler.unauthorized(res, 'Invalid credentials');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: expiresIn }
      );

      logger.info('User logged in successfully', { userId: user.id });
      return this.ResponseHandler.success(res, { token, user }, 'Login successful');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getProfile = async (req, res) => {
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
  };

  updateProfile = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      const { password, ...updateData } = req.body;
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await user.update(updateData);
      const { password: _, ...userWithoutPassword } = updatedUser.toJSON();

      logger.info('Profile updated successfully', { userId: user.id });
      return this.ResponseHandler.success(res, userWithoutPassword, 'Profile updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return this.ResponseHandler.unauthorized(res, 'Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      logger.info('Password changed successfully', { userId: user.id });
      return this.ResponseHandler.success(res, null, 'Password changed successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const { page = 1, limit = 10, role, search } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ role, search });

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
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { role, search } = filters;

    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } }
      ];
    }

    return where;
  };
}

module.exports = new UserController(); 