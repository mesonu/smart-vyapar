'use strict';
const axios = require('axios');
const config = require('../config/config');
const whatsappConfig = require('../config/whatsapp');
const { logger } = require('../utils/logger');
const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');

class WhatsAppService {
  constructor() {
    this.apiUrl = `${whatsappConfig.baseUrl}/${whatsappConfig.apiVersion}`;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.validateConfig();
    this.redis = null;
    this.initializeRedis();
  }

  initializeRedis() {
    try {
      this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      
      this.redis.on('error', (error) => {
        logger.error('Redis connection error:', error);
      });

      this.redis.on('connect', () => {
        logger.info('Redis connected successfully');
      });
    } catch (error) {
      logger.error('Failed to initialize Redis:', error);
    }
  }

  validateConfig() {
    if (!this.phoneNumberId || !this.accessToken) {
      logger.error('WhatsApp credentials not configured properly');
      throw new Error('WhatsApp credentials not configured');
    }
  }

  async makeRequest(url, data, retryCount = 0) {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (retryCount < this.maxRetries && this.isRetryableError(error)) {
        logger.warn(`Retrying request (${retryCount + 1}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.makeRequest(url, data, retryCount + 1);
      }
      throw error;
    }
  }

  isRetryableError(error) {
    const status = error.response?.status;
    return status === 429 || // Rate limit
           status === 500 || // Server error
           status === 503 || // Service unavailable
           status === 504;   // Gateway timeout
  }

  async checkRateLimit(phoneNumber) {
    try {
      if (!this.redis || !this.redis.status === 'ready') {
        logger.warn('Redis not available, skipping rate limit check');
        return;
      }

      const key = `whatsapp:rate:${phoneNumber}`;
      const current = await this.redis.incr(key);
      
      if (current === 1) {
        await this.redis.expire(key, 3600); // 1 hour window
      }
      
      if (current > 10) { // Max 10 messages per hour per number
        throw new Error('Rate limit exceeded for this phone number');
      }
    } catch (error) {
      logger.error('Rate limit check failed:', error);
      // Don't throw error, just log it
    }
  }

  async sendMessage(to, message) {
    try {
      logger.info(`Sending WhatsApp message to ${to}`);
      
      await this.checkRateLimit(to);
      
      const result = await this.makeRequest(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        }
      );

      logger.info(`WhatsApp message sent successfully to ${to}`);
      return result;
    } catch (error) {
      logger.error('Error sending WhatsApp message:', {
        error: error.response?.data || error.message,
        to,
        message
      });
      throw new Error('Failed to send WhatsApp message');
    }
  }

  async sendTemplateMessage(to, templateName, parameters = {}) {
    try {
      logger.info(`Sending WhatsApp template message to ${to} using template ${templateName}`);
      
      const template = whatsappConfig.templates[templateName];
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }

      const components = template.components.map(component => ({
        ...component,
        parameters: component.parameters.map(param => ({
          ...param,
          text: parameters[param.text.replace('{{', '').replace('}}', '')] || param.text
        }))
      }));

      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: template.name,
            language: {
              code: template.language
            },
            components: components
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`WhatsApp template message sent successfully to ${to}`);
      return response.data;
    } catch (error) {
      logger.error('Error sending WhatsApp template message:', {
        error: error.response?.data || error.message,
        to,
        templateName,
        parameters
      });
      throw new Error('Failed to send WhatsApp template message');
    }
  }

  formatMessage(template, parameters) {
    let message = template;
    Object.entries(parameters).forEach(([key, value]) => {
      message = message.replace(`{{${key}}}`, value);
    });
    return message;
  }

  async sendPaymentSuccessTemplate(to, invoiceNumber, amount) {
    const message = this.formatMessage(whatsappConfig.messages.paymentSuccess, {
      invoice_number: invoiceNumber,
      amount: `₹${amount / 100}`
    });
    return this.sendMessage(to, message);
  }

  async sendPaymentFailedTemplate(to, invoiceNumber, amount) {
    const message = this.formatMessage(whatsappConfig.messages.paymentFailed, {
      invoice_number: invoiceNumber,
      amount: `₹${amount / 100}`
    });
    return this.sendMessage(to, message);
  }

  async sendRefundInitiatedTemplate(to, invoiceNumber, amount) {
    const message = this.formatMessage(whatsappConfig.messages.refundInitiated, {
      invoice_number: invoiceNumber,
      amount: `₹${amount / 100}`
    });
    return this.sendMessage(to, message);
  }

  async sendRefundProcessedTemplate(to, invoiceNumber, amount) {
    const message = this.formatMessage(whatsappConfig.messages.refundProcessed, {
      invoice_number: invoiceNumber,
      amount: `₹${amount / 100}`
    });
    return this.sendMessage(to, message);
  }

  async sendOrderConfirmation(customer, invoice) {
    const message = this.formatMessage(whatsappConfig.messages.orderConfirmation, {
      invoice_number: invoice.invoiceNumber,
      amount: `₹${invoice.totalAmount / 100}`
    });
    return this.sendMessage(customer.phone, message);
  }

  async sendPaymentReminder(customer, invoice) {
    const message = this.formatMessage(whatsappConfig.messages.paymentReminder, {
      invoice_number: invoice.invoiceNumber,
      amount: `₹${invoice.totalAmount / 100}`,
      due_date: new Date(invoice.dueDate).toLocaleDateString()
    });
    return this.sendMessage(customer.phone, message);
  }

  async sendLowStockAlert(user, product) {
    const message = this.formatMessage(whatsappConfig.messages.lowStockAlert, {
      product_name: product.name,
      quantity: product.quantity
    });
    return this.sendMessage(user.phone, message);
  }

  async sendPromotionalMessage(customer, message) {
    return this.sendMessage(customer.phone, message);
  }

  // Add method to close Redis connection
  async closeRedis() {
    if (this.redis) {
      try {
        await this.redis.quit();
        logger.info('Redis connection closed');
      } catch (error) {
        logger.error('Error closing Redis connection:', error);
      }
    }
  }
}

// Create rate limiter middleware with memory store as fallback
const whatsappRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  store: new rateLimit.MemoryStore() // Use memory store instead of Redis
});

// Export a singleton instance
const whatsappService = new WhatsAppService();

// Add cleanup handler for process exit
process.on('SIGINT', async () => {
  await whatsappService.closeRedis();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await whatsappService.closeRedis();
  process.exit(0);
});

module.exports = {
  whatsappService,
  whatsappRateLimiter
}; 