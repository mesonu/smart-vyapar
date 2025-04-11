const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/WebhookController');
const { validateRequest } = require('../middleware/validation');
const { auth } = require('../middleware/bkp-auth');
const {
  webhookSchema,
  webhookIdSchema,
  eventSchema
} = require('../validations/webhookValidation');

// Apply auth middleware to all routes
router.use(auth);

// Webhook management routes
router.get('/', webhookController.getAllWebhooks);
router.post('/', validateRequest(webhookSchema), webhookController.createWebhook);
router.get('/:id', validateRequest(webhookIdSchema), webhookController.getWebhookById);
router.put('/:id', validateRequest(webhookIdSchema), validateRequest(webhookSchema), webhookController.updateWebhook);
router.delete('/:id', validateRequest(webhookIdSchema), webhookController.deleteWebhook);

// Webhook event routes
router.post('/events', validateRequest(eventSchema), webhookController.processEvent);
router.get('/deliveries', webhookController.getEventDeliveries);
router.post('/deliveries/:id/retry', webhookController.retryDelivery);

module.exports = router; 