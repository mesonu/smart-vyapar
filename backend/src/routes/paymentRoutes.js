'use strict';
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController');
const { validateRequest } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
// const {
//   paymentSchema,
//   paymentIdSchema,
//   paymentStatusSchema,
//   paymentFilterSchema,
//   refundSchema
// } = require('../validations/paymentValidation');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, refunded, partially_refunded]
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [cash, credit_card, bank_transfer, check, online_payment]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of payments
 */
// router.get('/', validateRequest(paymentFilterSchema), paymentController.getAllPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
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
 *         description: Payment details
 *       404:
 *         description: Payment not found
 */
// router.get('/:id', validateRequest(paymentIdSchema), paymentController.getPaymentById);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Process payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice_id
 *               - amount
 *               - payment_method
 *             properties:
 *               invoice_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               payment_method:
 *                 type: string
 *                 enum: [cash, credit_card, bank_transfer, check, online_payment]
 *               transaction_id:
 *                 type: string
 *               reference_number:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       404:
 *         description: Invoice not found
 *       400:
 *         description: Invalid payment data
 */
// router.post('/', validateRequest(paymentSchema), paymentController.createPayment);

/**
 * @swagger
 * /api/payments/order:
 *   post:
 *     summary: Create payment order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice_id
 *               - amount
 *             properties:
 *               invoice_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment order created
 *       404:
 *         description: Invoice not found
 */
// router.post('/order', paymentController.createPaymentOrder);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - payment_id
 *               - signature
 *               - invoice_id
 *               - amount
 *             properties:
 *               order_id:
 *                 type: string
 *               payment_id:
 *                 type: string
 *               signature:
 *                 type: string
 *               invoice_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment verified and processed
 *       400:
 *         description: Invalid payment signature
 */
// router.post('/verify', paymentController.verifyPayment);

/**
 * @swagger
 * /api/payments/link:
 *   post:
 *     summary: Create payment link
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice_id
 *               - amount
 *             properties:
 *               invoice_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment link created
 *       404:
 *         description: Invoice not found
 */
// router.post('/link', paymentController.createPaymentLink);

/**
 * @swagger
 * /api/payments/refund:
 *   post:
 *     summary: Process refund
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_id
 *               - amount
 *               - reason
 *             properties:
 *               payment_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *       404:
 *         description: Payment not found
 *       400:
 *         description: Invalid refund data
 */
// router.post('/refund', validateRequest(paymentIdSchema), validateRequest(refundSchema), paymentController.processRefund);

/**
 * @swagger
 * /api/payments/invoice/{invoiceId}:
 *   get:
 *     summary: Get payments for an invoice
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of payments for the invoice
 */
// router.get('/invoice/:invoiceId', validateRequest(paymentIdSchema), paymentController.getInvoicePayments);

// User-specific payment routes
// router.get('/user/:userId', validateRequest(paymentFilterSchema), paymentController.getUserPayments);

module.exports = router; 