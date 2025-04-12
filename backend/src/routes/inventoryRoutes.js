const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/InventoryController');
const { validate } = require('../middleware/validation');
const { auth, checkRole } = require('../middleware/authMiddleware');
const {
  createBatchSchema,
  updateBatchSchema,
  batchIdSchema,
  alertIdSchema
} = require('../validations/inventory/inventory');

// Batch management routes
router.post(
  '/batches',
  auth,
  checkRole(['ADMIN', 'MANAGER']),
  validate(createBatchSchema),
  InventoryController.createBatch.bind(InventoryController)
);

router.get(
  '/products/:product_id/batches',
  auth,
  validate(batchIdSchema),
  InventoryController.getProductBatches.bind(InventoryController)
);

router.patch(
  '/batches/:batch_id/quantity',
  auth,
  checkRole(['ADMIN', 'MANAGER']),
  validate(updateBatchSchema),
  InventoryController.updateBatchQuantity.bind(InventoryController)
);

// Alert management routes
router.get(
  '/alerts',
  auth,
  InventoryController.getAlerts.bind(InventoryController)
);

router.patch(
  '/alerts/:alert_id/acknowledge',
  auth,
  checkRole(['ADMIN', 'MANAGER']),
  validate(alertIdSchema),
  InventoryController.acknowledgeAlert.bind(InventoryController)
);

module.exports = router; 