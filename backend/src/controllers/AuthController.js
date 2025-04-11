const { User } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

class AuthController extends BaseController {
  constructor() {
    super(User);
  }

  register = async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        role = 'customer',
        firstName,
        lastName,
        phone
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return this.ResponseHandler.conflict(
          res,
          'User with this email or username already exists'
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName,
        phone
      });

      // Generate token
      const token = this.generateToken(user);

      logger.info('User registered successfully', { userId: user.id });
      return this.ResponseHandler.created(res, {
        user: this.sanitizeUser(user),
        token
      }, 'User registered successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return this.ResponseHandler.unauthorized(res, 'Invalid email or password');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return this.ResponseHandler.unauthorized(res, 'Invalid email or password');
      }

      // Generate token
      const token = this.generateToken(user);

      logger.info('User logged in successfully', { userId: user.id });
      return this.ResponseHandler.success(res, {
        user: this.sanitizeUser(user),
        token
      }, 'Login successful');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return this.ResponseHandler.unauthorized(res, 'Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await user.update({ password: hashedPassword });

      logger.info('Password changed successfully', { userId });
      return this.ResponseHandler.success(res, null, 'Password changed successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user.id, type: 'reset' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // TODO: Send reset email with token
      // For now, we'll just return the token
      // In production, this should be sent via email

      logger.info('Password reset token generated', { userId: user.id });
      return this.ResponseHandler.success(res, { resetToken }, 'Password reset token generated');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  verifyResetToken = async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'reset') {
        return this.ResponseHandler.unauthorized(res, 'Invalid reset token');
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await user.update({ password: hashedPassword });

      logger.info('Password reset successfully', { userId: user.id });
      return this.ResponseHandler.success(res, null, 'Password reset successfully');
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return this.ResponseHandler.unauthorized(res, 'Invalid or expired reset token');
      }
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

      return this.ResponseHandler.success(res, this.sanitizeUser(user));
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateProfile = async (req, res) => {
    try {
      const { firstName, lastName, phone } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      const updatedUser = await user.update({
        firstName,
        lastName,
        phone
      });

      logger.info('Profile updated successfully', { userId });
      return this.ResponseHandler.success(res, {
        user: this.sanitizeUser(updatedUser)
      }, 'Profile updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  generateToken = (user) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  };

  sanitizeUser = (user) => {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  };
}

module.exports = new AuthController(); 