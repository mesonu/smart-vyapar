const express = require('express');
const router = express.Router();
const productReviewController = require('../controllers/productReviewController');
const { auth } = require('../middleware/authMiddleware');
const { validateReview, validateStatusUpdate } = require('../middleware/validators/reviewValidator');

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductReview:
 *       type: object
 *       required:
 *         - productId
 *         - rating
 *         - comment
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the review
 *         productId:
 *           type: integer
 *           description: The ID of the product being reviewed
 *         userId:
 *           type: integer
 *           description: The ID of the user who wrote the review
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: The rating given to the product (1-5 stars)
 *         title:
 *           type: string
 *           description: The title of the review
 *         comment:
 *           type: string
 *           description: The detailed review comment
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *           description: The moderation status of the review
 *         helpfulVotes:
 *           type: integer
 *           default: 0
 *           description: Number of users who found this review helpful
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs attached to the review
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all product reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filter reviews by product ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter reviews by user ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter reviews by status
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter reviews by rating
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductReview'
 */
router.get('/', productReviewController.getAllReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The review ID
 *     responses:
 *       200:
 *         description: The review data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *       404:
 *         description: Review not found
 */
router.get('/:id', productReviewController.getReviewById);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductReview'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, validateReview, productReviewController.createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductReview'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */
router.put('/:id', auth, validateReview, productReviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The review ID
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */
router.delete('/:id', auth, productReviewController.deleteReview);

/**
 * @swagger
 * /api/reviews/{id}/status:
 *   put:
 *     summary: Update review status (admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Review status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */
router.put('/:id/status', auth, validateStatusUpdate, productReviewController.updateReviewStatus);

/**
 * @swagger
 * /api/reviews/{id}/helpful:
 *   post:
 *     summary: Vote a review as helpful
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The review ID
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *       404:
 *         description: Review not found
 */
router.post('/:id/helpful', auth, productReviewController.voteHelpful);

module.exports = router; 