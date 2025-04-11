const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const promotionTemplateController = require('../controllers/promotionTemplateController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation middleware
const templateValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional(),
  body('discount_type').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
  body('discount_value').isFloat({ min: 0 }).withMessage('Discount value must be a positive number'),
  body('schedule_type').isIn(['one_time', 'daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid schedule type'),
  body('schedule_config').optional().isObject().withMessage('Schedule config must be an object'),
  body('min_purchase_amount').optional().isFloat({ min: 0 }).withMessage('Minimum purchase amount must be a positive number'),
  body('max_discount_amount').optional().isFloat({ min: 0 }).withMessage('Maximum discount amount must be a positive number'),
  body('product_ids').optional().isArray().withMessage('Product IDs must be an array'),
  body('product_ids.*').optional().isInt().withMessage('Invalid product ID')
];

// Routes
router.get('/', promotionTemplateController.getAllTemplates);
router.get('/:id', promotionTemplateController.getTemplateById);
router.post('/', templateValidationRules, promotionTemplateController.createTemplate);
router.put('/:id', templateValidationRules, promotionTemplateController.updateTemplate);
router.delete('/:id', promotionTemplateController.deleteTemplate);

module.exports = router; 