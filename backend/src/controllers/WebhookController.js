const { Webhook, WebhookEvent, WebhookDelivery } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');
const crypto = require('crypto');
const axios = require('axios');

class WebhookController extends BaseController {
  constructor() {
    super(Webhook);
  }

  createWebhook = async (req, res) => {
    try {
      const {
        name,
        url,
        events,
        isActive = true,
        secret,
        headers = {}
      } = req.body;

      // Validate URL
      try {
        new URL(url);
      } catch (error) {
        return this.ResponseHandler.badRequest(res, 'Invalid webhook URL');
      }

      // Check if webhook URL is unique
      const existingWebhook = await Webhook.findOne({ where: { url } });
      if (existingWebhook) {
        return this.ResponseHandler.conflict(res, 'Webhook URL already registered');
      }

      // Generate secret if not provided
      const webhookSecret = secret || crypto.randomBytes(32).toString('hex');

      const webhook = await Webhook.create({
        name,
        url,
        events,
        isActive,
        secret: webhookSecret,
        headers
      });

      logger.info('Webhook created successfully', { webhookId: webhook.id });
      return this.ResponseHandler.created(res, webhook, 'Webhook created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllWebhooks = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        isActive,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({
        isActive,
        search
      });

      const { count, rows: webhooks } = await Webhook.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]]
      });

      return this.ResponseHandler.success(res, {
        webhooks,
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

  getWebhookById = async (req, res) => {
    try {
      const webhook = await Webhook.findByPk(req.params.id);
      if (!webhook) {
        return this.ResponseHandler.notFound(res, 'Webhook not found');
      }

      return this.ResponseHandler.success(res, webhook);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateWebhook = async (req, res) => {
    try {
      const webhook = await Webhook.findByPk(req.params.id);
      if (!webhook) {
        return this.ResponseHandler.notFound(res, 'Webhook not found');
      }

      const {
        name,
        url,
        events,
        isActive,
        secret,
        headers
      } = req.body;

      // Validate URL if being updated
      if (url && url !== webhook.url) {
        try {
          new URL(url);
        } catch (error) {
          return this.ResponseHandler.badRequest(res, 'Invalid webhook URL');
        }

        // Check if new URL is unique
        const existingWebhook = await Webhook.findOne({ where: { url } });
        if (existingWebhook) {
          return this.ResponseHandler.conflict(res, 'Webhook URL already registered');
        }
      }

      const updatedWebhook = await webhook.update({
        name,
        url,
        events,
        isActive,
        secret,
        headers
      });

      logger.info('Webhook updated successfully', { webhookId: webhook.id });
      return this.ResponseHandler.success(res, updatedWebhook, 'Webhook updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  deleteWebhook = async (req, res) => {
    try {
      const webhook = await Webhook.findByPk(req.params.id);
      if (!webhook) {
        return this.ResponseHandler.notFound(res, 'Webhook not found');
      }

      await webhook.destroy();

      logger.info('Webhook deleted successfully', { webhookId: webhook.id });
      return this.ResponseHandler.success(res, null, 'Webhook deleted successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  processEvent = async (eventType, data) => {
    try {
      // Create event record
      const event = await WebhookEvent.create({
        type: eventType,
        data
      });

      // Find active webhooks subscribed to this event
      const webhooks = await Webhook.findAll({
        where: {
          isActive: true,
          events: { [Op.contains]: [eventType] }
        }
      });

      // Process each webhook
      for (const webhook of webhooks) {
        await this.deliverEvent(webhook, event);
      }

      return event;
    } catch (error) {
      logger.error('Error processing webhook event', { error: error.message });
      throw error;
    }
  };

  deliverEvent = async (webhook, event) => {
    try {
      const payload = {
        event: event.type,
        data: event.data,
        timestamp: new Date().toISOString()
      };

      // Generate signature
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        ...webhook.headers
      };

      // Create delivery record
      const delivery = await WebhookDelivery.create({
        webhookId: webhook.id,
        eventId: event.id,
        status: 'pending'
      });

      try {
        // Send webhook
        const response = await axios.post(webhook.url, payload, { headers });

        // Update delivery status
        await delivery.update({
          status: 'success',
          responseStatus: response.status,
          responseBody: response.data
        });

        logger.info('Webhook delivered successfully', {
          webhookId: webhook.id,
          eventId: event.id,
          deliveryId: delivery.id
        });
      } catch (error) {
        // Update delivery status with error
        await delivery.update({
          status: 'failed',
          responseStatus: error.response?.status,
          responseBody: error.response?.data,
          error: error.message
        });

        logger.error('Webhook delivery failed', {
          webhookId: webhook.id,
          eventId: event.id,
          deliveryId: delivery.id,
          error: error.message
        });
      }
    } catch (error) {
      logger.error('Error delivering webhook event', { error: error.message });
      throw error;
    }
  };

  getEventDeliveries = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        webhookId,
        eventId,
        status,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (webhookId) where.webhookId = webhookId;
      if (eventId) where.eventId = eventId;
      if (status) where.status = status;

      const { count, rows: deliveries } = await WebhookDelivery.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Webhook,
            attributes: ['id', 'name', 'url']
          },
          {
            model: WebhookEvent,
            attributes: ['id', 'type']
          }
        ],
        order: [[sortBy, sortOrder]]
      });

      return this.ResponseHandler.success(res, {
        deliveries,
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

  retryDelivery = async (req, res) => {
    try {
      const delivery = await WebhookDelivery.findByPk(req.params.id, {
        include: [
          {
            model: Webhook,
            attributes: ['id', 'url', 'secret', 'headers']
          },
          {
            model: WebhookEvent,
            attributes: ['id', 'type', 'data']
          }
        ]
      });

      if (!delivery) {
        return this.ResponseHandler.notFound(res, 'Delivery not found');
      }

      if (delivery.status === 'success') {
        return this.ResponseHandler.badRequest(res, 'Cannot retry successful delivery');
      }

      await this.deliverEvent(delivery.Webhook, delivery.WebhookEvent);

      return this.ResponseHandler.success(res, null, 'Delivery retry initiated');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { isActive, search } = filters;

    if (isActive !== undefined) where.isActive = isActive;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { url: { [Op.like]: `%${search}%` } }
      ];
    }

    return where;
  };
}

module.exports = new WebhookController(); 