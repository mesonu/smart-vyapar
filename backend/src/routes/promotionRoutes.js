const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/PromotionController');
const promotionScheduleController = require('../controllers/PromotionScheduleController');
const promotionTemplateController = require('../controllers/PromotionTemplateController');
const { validateRequest } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
// const {
//   promotionSchema,
//   promotionIdSchema,
//   scheduleSchema,
//   templateSchema
// } = require('../validations/promotionValidation');

// Apply auth middleware to all routes
router.use(auth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Promotion:
 *       type: object
 *       required:
 *         - name
 *         - discountType
 *         - discountValue
 *         - startDate
 *         - endDate
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the promotion
 *         name:
 *           type: string
 *           description: The name of the promotion
 *         description:
 *           type: string
 *           description: The description of the promotion
 *         discountType:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: The type of discount (percentage or fixed amount)
 *         discountValue:
 *           type: number
 *           description: The value of the discount
 *         startDate:
 *           type: string
 *           format: date
 *           description: The start date of the promotion
 *         endDate:
 *           type: string
 *           format: date
 *           description: The end date of the promotion
 *         minPurchaseAmount:
 *           type: number
 *           description: Minimum purchase amount required
 *         maxDiscountAmount:
 *           type: number
 *           description: Maximum discount amount
 *         isActive:
 *           type: boolean
 *           description: Whether the promotion is active
 *         applicableProducts:
 *           type: array
 *           items:
 *             type: integer
 *           description: List of product IDs this promotion applies to
 */

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Promotion management endpoints
 */

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by promotion status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by promotion type
 *     responses:
 *       200:
 *         description: List of promotions
 *       401:
 *         description: Unauthorized
 */
router.get('/', promotionController.getAllPromotions);

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [discount, bundle, free_shipping]
 *               value:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Promotion created successfully
 *       400:
 *         description: Invalid input
 */
// router.post('/', validateRequest(promotionSchema), promotionController.createPromotion);

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Get promotion by ID
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promotion details
 *       404:
 *         description: Promotion not found
 */
// router.get('/:id', validateRequest(promotionIdSchema), promotionController.getPromotionById);

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Update a promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [discount, bundle, free_shipping]
 *               value:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *       404:
 *         description: Promotion not found
 */
// router.put('/:id', validateRequest(promotionIdSchema), validateRequest(promotionSchema), promotionController.updatePromotion);

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Delete a promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promotion deleted successfully
 *       404:
 *         description: Promotion not found
 */
// router.delete('/:id', validateRequest(promotionIdSchema), promotionController.deletePromotion);

/**
 * @swagger
 * /api/promotions/{id}/analytics:
 *   get:
 *     summary: Get promotion analytics
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promotion analytics data
 *       404:
 *         description: Promotion not found
 */
// router.get('/:id/analytics', validateRequest(promotionIdSchema), promotionController.getPromotionAnalytics);

/**
 * @swagger
 * /api/promotions/{id}/customer-segments:
 *   get:
 *     summary: Get customer segments for promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer segments data
 *       404:
 *         description: Promotion not found
 */
// router.get('/:id/customer-segments', validateRequest(promotionIdSchema), promotionController.getCustomerSegments);

/**
 * @swagger
 * /api/promotions/{id}/time-analysis:
 *   get:
 *     summary: Get time-based analysis for promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *         description: Time period for analysis
 *     responses:
 *       200:
 *         description: Time-based analysis data
 *       404:
 *         description: Promotion not found
 */
// router.get('/:id/time-analysis', validateRequest(promotionIdSchema), promotionController.getTimeBasedAnalysis);

/**
 * @swagger
 * /api/promotions/{id}/product-performance:
 *   get:
 *     summary: Get product performance for promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product performance data
 *       404:
 *         description: Promotion not found
 */
// router.get('/:id/product-performance', validateRequest(promotionIdSchema), promotionController.getProductPerformance);

/**
 * @swagger
 * /api/promotions/{id}/effectiveness:
 *   get:
 *     summary: Get promotion effectiveness metrics
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promotion effectiveness data
 *       404:
 *         description: Promotion not found
 */
// router.get('/:id/effectiveness', validateRequest(promotionIdSchema), promotionController.getPromotionEffectiveness);

/**
 * @swagger
 * /api/promotions/{id}/competitor-analysis:
 *   get:
 *     summary: Get competitor analysis for promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Competitor analysis data
 *       404:
 *         description: Promotion not found
 */
// router.get('/:id/competitor-analysis', validateRequest(promotionIdSchema), promotionController.getCompetitorAnalysis);

/**
 * @swagger
 * /api/promotions/market-trends:
 *   get:
 *     summary: Get market trends
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Product category
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter]
 *         description: Time period
 *     responses:
 *       200:
 *         description: Market trends data
 */
// router.get('/market-trends', promotionController.getMarketTrends);

/**
 * @swagger
 * /api/promotions/{id}/impact:
 *   get:
 *     summary: Get promotion impact analysis
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promotion impact data
 *       404:
 *         description: Promotion not found
 */
// router.get('/:id/impact', validateRequest(promotionIdSchema), promotionController.getPromotionImpact);

/**
 * @swagger
 * /api/promotions/{id}/roi:
 *   get:
 *     summary: Get promotion ROI analysis
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promotion ROI data
 *       404:
 *         description: Promotion not found
 */
// router.get('/:id/roi', validateRequest(promotionIdSchema), promotionController.getPromotionROI);

// Promotion schedule routes
// router.get('/schedules', promotionScheduleController.getAllSchedules);
// router.post('/schedules', validateRequest(scheduleSchema), promotionScheduleController.createSchedule);
// router.get('/schedules/:id', promotionScheduleController.getScheduleById);
// router.put('/schedules/:id', validateRequest(scheduleSchema), promotionScheduleController.updateSchedule);
// router.delete('/schedules/:id', promotionScheduleController.deleteSchedule);
// router.get('/schedules/active', promotionScheduleController.getActiveSchedules);
// router.get('/schedules/upcoming', promotionScheduleController.getUpcomingSchedules);

// // Promotion template routes
// router.get('/templates', promotionTemplateController.getAllTemplates);
// router.post('/templates', validateRequest(templateSchema), promotionTemplateController.createTemplate);
// router.get('/templates/:id', promotionTemplateController.getTemplateById);
// router.put('/templates/:id', validateRequest(templateSchema), promotionTemplateController.updateTemplate);
// router.delete('/templates/:id', promotionTemplateController.deleteTemplate);
// router.post('/templates/:id/create-promotion', promotionTemplateController.createPromotionFromTemplate);

module.exports = router; 