'use strict';

const express = require('express');
const router = express.Router();
const { whatsappService, whatsappRateLimiter } = require('../services/whatsappService');
const { logger } = require('../utils/logger');
const { body, validationResult } = require('express-validator');

// Phone number validation middleware
const validatePhoneNumber = (value) => {
  // Remove any non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Check if it's a valid Indian phone number
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    throw new Error('Invalid phone number format');
  }
  
  return `+91${cleaned}`;
};

// Apply rate limiter to all WhatsApp routes
router.use(whatsappRateLimiter);

// Test sending a simple message
router.post('/test-message', 
  [
    body('phone').custom(validatePhoneNumber),
    body('message').isLength({ min: 1, max: 1000 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { phone, message } = req.body;
      const result = await whatsappService.sendMessage(phone, message);
      
      res.json({
        success: true,
        message: 'WhatsApp message sent successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error in test-message endpoint:', error);
      const statusCode = error.message.includes('Rate limit') ? 429 : 500;
      res.status(statusCode).json({
        success: false,
        message: 'Failed to send WhatsApp message',
        error: error.message
      });
    }
  }
);

// Test sending a payment success template
router.post('/test-payment-success',
  [
    body('phone').custom(validatePhoneNumber),
    body('invoiceNumber').isLength({ min: 1, max: 50 }),
    body('amount').isInt({ min: 1 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { phone, invoiceNumber, amount } = req.body;
      const result = await whatsappService.sendPaymentSuccessTemplate(phone, invoiceNumber, amount);
      
      res.json({
        success: true,
        message: 'Payment success template sent successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error in test-payment-success endpoint:', error);
      const statusCode = error.message.includes('Rate limit') ? 429 : 500;
      res.status(statusCode).json({
        success: false,
        message: 'Failed to send payment success template',
        error: error.message
      });
    }
  }
);

module.exports = router; 