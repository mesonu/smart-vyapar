const express = require('express');
const router = express.Router();
const AIController = require('../controllers/AIController');
const { validate } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/authMiddleware');
const {
  billingAnalysisSchema,
  inventoryOptimizationSchema,
  voiceCommandSchema,
  customerBehaviorSchema,
  translationSchema,
  gstComplianceSchema
} = require('../validations/ai/ai');

const aiController = new AIController();

// Billing Analysis
router.post(
  '/billing/analyze',
  auth,
  checkRole(['ADMIN', 'MANAGER']),
  validate(billingAnalysisSchema),
  aiController.analyzeBilling.bind(aiController)
);

// Inventory Optimization
router.post(
  '/inventory/optimize',
  auth,
  checkRole(['ADMIN', 'MANAGER']),
  validate(inventoryOptimizationSchema),
  aiController.optimizeInventory.bind(aiController)
);

// Voice Command Processing
router.post(
  '/voice/process',
  auth,
  validate(voiceCommandSchema),
  aiController.processVoiceCommand.bind(aiController)
);

// Customer Behavior Analysis
router.post(
  '/customer/analyze',
  auth,
  checkRole(['ADMIN', 'MANAGER']),
  validate(customerBehaviorSchema),
  aiController.analyzeCustomerBehavior.bind(aiController)
);

// Text Translation
router.post(
  '/translate',
  auth,
  validate(translationSchema),
  aiController.translateText.bind(aiController)
);

// GST Compliance Analysis
router.post(
  '/gst/analyze',
  auth,
  checkRole(['ADMIN', 'MANAGER']),
  validate(gstComplianceSchema),
  aiController.analyzeGSTCompliance.bind(aiController)
);

module.exports = router; 