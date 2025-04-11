const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const customerController = require('../controllers/customerController');
const auth = require('../middlewares/auth');

// Validation middleware
const validateCustomer = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('creditLimit').optional().isFloat({ min: 0 }).withMessage('Credit limit must be a positive number'),
  body('outstandingBalance').optional().isFloat({ min: 0 }).withMessage('Outstanding balance must be a positive number'),
  body('status').optional().isIn(['active', 'inactive', 'blocked']).withMessage('Invalid status'),
  body('customerType').optional().isIn(['regular', 'premium', 'wholesale']).withMessage('Invalid customer type'),
  body('communicationPreferences').optional().isObject().withMessage('Communication preferences must be an object'),
  body('communicationPreferences.whatsapp').optional().isBoolean().withMessage('WhatsApp preference must be a boolean'),
  body('communicationPreferences.email').optional().isBoolean().withMessage('Email preference must be a boolean'),
  body('communicationPreferences.sms').optional().isBoolean().withMessage('SMS preference must be a boolean')
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the customer
 *         name:
 *           type: string
 *           description: The customer's name
 *         email:
 *           type: string
 *           description: The customer's email
 *         phone:
 *           type: string
 *           description: The customer's phone number
 *         alternatePhone:
 *           type: string
 *           description: The customer's alternate phone number
 *         address:
 *           type: string
 *           description: The customer's address
 *         city:
 *           type: string
 *           description: The customer's city
 *         state:
 *           type: string
 *           description: The customer's state
 *         pincode:
 *           type: string
 *           description: The customer's pincode
 *         gstNumber:
 *           type: string
 *           description: The customer's GST number
 *         creditLimit:
 *           type: number
 *           description: The customer's credit limit
 *         outstandingBalance:
 *           type: number
 *           description: The customer's outstanding balance
 *         status:
 *           type: string
 *           enum: [active, inactive, blocked]
 *           description: The customer's status
 *         customerType:
 *           type: string
 *           enum: [regular, premium, wholesale]
 *           description: The customer's type
 *         communicationPreferences:
 *           type: object
 *           properties:
 *             whatsapp:
 *               type: boolean
 *             email:
 *               type: boolean
 *             sms:
 *               type: boolean
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Returns the list of all customers with pagination and filtering
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, blocked]
 *         description: Filter by status
 *       - in: query
 *         name: customerType
 *         schema:
 *           type: string
 *           enum: [regular, premium, wholesale]
 *         description: Filter by customer type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: The list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', auth, customerController.getAllCustomers);

/**
 * @swagger
 * /api/customers/stats:
 *   get:
 *     summary: Get customer statistics
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Customer statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   customerType:
 *                     type: string
 *                   count:
 *                     type: integer
 *                   totalOutstanding:
 *                     type: number
 *                   totalCreditLimit:
 *                     type: number
 */
router.get('/stats', auth, customerController.getCustomerStats);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: The customer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 */
router.post('/', auth, validateCustomer, customerController.createCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get the customer by id
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The customer id
 *     responses:
 *       200:
 *         description: The customer description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: The customer was not found
 */
router.get('/:id', auth, customerController.getCustomerById);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update the customer by id
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The customer id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The customer was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: The customer was not found
 */
router.put('/:id', auth, validateCustomer, customerController.updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Remove the customer by id
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The customer id
 *     responses:
 *       200:
 *         description: The customer was deleted
 *       404:
 *         description: The customer was not found
 */
router.delete('/:id', auth, customerController.deleteCustomer);

module.exports = router; 