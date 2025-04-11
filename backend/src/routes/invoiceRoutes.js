'use strict';
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const invoiceController = require('../controllers/invoiceController');
const { auth } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       required:
 *         - customerId
 *         - items
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the invoice
 *         customerId:
 *           type: integer
 *           description: The ID of the customer
 *         invoiceNumber:
 *           type: string
 *           description: The unique invoice number
 *         date:
 *           type: string
 *           format: date
 *           description: The invoice date
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The due date for payment
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *         subtotal:
 *           type: number
 *           description: The subtotal amount
 *         tax:
 *           type: number
 *           description: The tax amount
 *         discount:
 *           type: number
 *           description: The discount amount
 *         total:
 *           type: number
 *           description: The total amount
 *         status:
 *           type: string
 *           enum: [draft, sent, paid, cancelled]
 *           description: The invoice status
 *         notes:
 *           type: string
 *           description: Additional notes
 */

// Validation middleware
const validateInvoice = [
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('invoiceNumber').notEmpty().withMessage('Invoice number is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('dueDate').notEmpty().withMessage('Due date is required'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.description').notEmpty().withMessage('Item description is required'),
  body('items.*.quantity').isNumeric().withMessage('Quantity must be a number'),
  body('items.*.unitPrice').isNumeric().withMessage('Unit price must be a number')
];

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management
 */

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
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
 *           enum: [draft, sent, viewed, paid, partially_paid, overdue, cancelled, refunded]
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: integer
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
 *         description: List of invoices
 */
router.get('/', auth, invoiceController.getAllInvoices);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
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
 *         description: Invoice details
 *       404:
 *         description: Invoice not found
 */
router.get('/:id', auth, invoiceController.getInvoiceById);

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create new invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - items
 *             properties:
 *               customerId:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - unitPrice
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: number
 *                     unitPrice:
 *                       type: number
 *     responses:
 *       201:
 *         description: Invoice created
 */
router.post('/', auth, invoiceController.createInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update invoice
 *     tags: [Invoices]
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
 *               status:
 *                 type: string
 *                 enum: [draft, sent, viewed, paid, partially_paid, overdue, cancelled, refunded]
 *     responses:
 *       200:
 *         description: Invoice updated
 *       404:
 *         description: Invoice not found
 */
router.put('/:id', auth, invoiceController.updateInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete invoice
 *     tags: [Invoices]
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
 *         description: Invoice deleted
 *       404:
 *         description: Invoice not found
 */
router.delete('/:id', auth, invoiceController.deleteInvoice);

/**
 * @swagger
 * /api/invoices/{id}/status:
 *   put:
 *     summary: Update invoice status
 *     tags: [Invoices]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, sent, viewed, paid, partially_paid, overdue, cancelled, refunded]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Invoice not found
 */
router.put('/:id/status', auth, invoiceController.updateInvoiceStatus);

/**
 * @swagger
 * /api/invoices/{id}/payments:
 *   post:
 *     summary: Record payment
 *     tags: [Invoices]
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
 *             required:
 *               - amount
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, credit_card, bank_transfer, check, online_payment]
 *               transactionId:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment recorded
 *       404:
 *         description: Invoice not found
 */
router.post('/:id/payments', auth, invoiceController.recordPayment);

/**
 * @swagger
 * /api/invoices/recurring:
 *   get:
 *     summary: Get recurring invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recurring invoices
 */
router.get('/recurring', auth, invoiceController.getRecurringInvoices);

/**
 * @swagger
 * /api/invoices/{id}/generate-next:
 *   post:
 *     summary: Generate next recurring invoice
 *     tags: [Invoices]
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
 *         description: Next invoice generated
 *       400:
 *         description: Not a recurring invoice
 */
router.post('/:id/generate-next', auth, invoiceController.generateNextRecurringInvoice);

module.exports = router; 