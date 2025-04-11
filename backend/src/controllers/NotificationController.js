const { Notification, NotificationTemplate, User } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class NotificationController extends BaseController {
  constructor() {
    super(Notification);
  }

  createNotification = async (req, res) => {
    try {
      const { userId, templateId, data } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      const template = await NotificationTemplate.findByPk(templateId);
      if (!template) {
        return this.ResponseHandler.notFound(res, 'Template not found');
      }

      const notification = await Notification.create({
        userId,
        templateId,
        data,
        status: 'pending'
      });

      logger.info('Notification created successfully', { notificationId: notification.id });
      return this.ResponseHandler.created(res, notification, 'Notification created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllNotifications = async (req, res) => {
    try {
      const { page = 1, limit = 10, userId, status, type } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ userId, status, type });

      const { count, rows: notifications } = await Notification.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: NotificationTemplate,
            attributes: ['id', 'name', 'type', 'content']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        notifications,
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

  getNotificationById = async (req, res) => {
    try {
      const notification = await Notification.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: NotificationTemplate,
            attributes: ['id', 'name', 'type', 'content']
          }
        ]
      });

      if (!notification) {
        return this.ResponseHandler.notFound(res, 'Notification not found');
      }

      return this.ResponseHandler.success(res, notification);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateNotificationStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const notification = await Notification.findByPk(req.params.id);

      if (!notification) {
        return this.ResponseHandler.notFound(res, 'Notification not found');
      }

      const updatedNotification = await notification.update({ status });

      logger.info('Notification status updated successfully', { 
        notificationId: notification.id, 
        status 
      });
      return this.ResponseHandler.success(res, updatedNotification, 'Notification status updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  markAsRead = async (req, res) => {
    try {
      const notification = await Notification.findByPk(req.params.id);
      if (!notification) {
        return this.ResponseHandler.notFound(res, 'Notification not found');
      }

      const updatedNotification = await notification.update({ 
        status: 'read',
        readAt: new Date()
      });

      logger.info('Notification marked as read', { notificationId: notification.id });
      return this.ResponseHandler.success(res, updatedNotification, 'Notification marked as read');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { userId, status, type } = filters;

    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (type) {
      where['$template.type$'] = type;
    }

    return where;
  };
}

module.exports = new NotificationController(); 