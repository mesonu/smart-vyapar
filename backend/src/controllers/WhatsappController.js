const { WhatsappMessage, WhatsappTemplate, User } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class WhatsappController extends BaseController {
  constructor() {
    super(WhatsappMessage);
  }

  sendMessage = async (req, res) => {
    try {
      const { userId, templateId, data } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      const template = await WhatsappTemplate.findByPk(templateId);
      if (!template) {
        return this.ResponseHandler.notFound(res, 'Template not found');
      }

      const message = await WhatsappMessage.create({
        userId,
        templateId,
        data,
        status: 'pending'
      });

      logger.info('WhatsApp message created successfully', { messageId: message.id });
      return this.ResponseHandler.created(res, message, 'WhatsApp message created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllMessages = async (req, res) => {
    try {
      const { page = 1, limit = 10, userId, status, templateId } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ userId, status, templateId });

      const { count, rows: messages } = await WhatsappMessage.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'phone']
          },
          {
            model: WhatsappTemplate,
            attributes: ['id', 'name', 'templateId', 'content']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        messages,
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

  getMessageById = async (req, res) => {
    try {
      const message = await WhatsappMessage.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'phone']
          },
          {
            model: WhatsappTemplate,
            attributes: ['id', 'name', 'templateId', 'content']
          }
        ]
      });

      if (!message) {
        return this.ResponseHandler.notFound(res, 'Message not found');
      }

      return this.ResponseHandler.success(res, message);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateMessageStatus = async (req, res) => {
    try {
      const { status, errorMessage } = req.body;
      const message = await WhatsappMessage.findByPk(req.params.id);

      if (!message) {
        return this.ResponseHandler.notFound(res, 'Message not found');
      }

      const updateData = { status };
      if (errorMessage) {
        updateData.errorMessage = errorMessage;
      }

      const updatedMessage = await message.update(updateData);

      logger.info('Message status updated successfully', { 
        messageId: message.id, 
        status 
      });
      return this.ResponseHandler.success(res, updatedMessage, 'Message status updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  createTemplate = async (req, res) => {
    try {
      const { name, templateId, content, variables } = req.body;

      const existingTemplate = await WhatsappTemplate.findOne({ 
        where: { templateId } 
      });
      if (existingTemplate) {
        return this.ResponseHandler.conflict(res, 'Template with this ID already exists');
      }

      const template = await WhatsappTemplate.create({
        name,
        templateId,
        content,
        variables,
        status: 'active'
      });

      logger.info('WhatsApp template created successfully', { templateId: template.id });
      return this.ResponseHandler.created(res, template, 'Template created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllTemplates = async (req, res) => {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildTemplateWhereClause({ status, search });

      const { count, rows: templates } = await WhatsappTemplate.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        templates,
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
    const { userId, status, templateId } = filters;

    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (templateId) where.templateId = templateId;

    return where;
  };

  buildTemplateWhereClause = (filters) => {
    const where = {};
    const { status, search } = filters;

    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { templateId: { [Op.like]: `%${search}%` } }
      ];
    }

    return where;
  };
}

module.exports = new WhatsappController(); 