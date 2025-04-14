const express = require('express');
const router = express.Router();
const { validateRequest, validateParams, validateQuery } = require('../middleware');
const { checkRole, checkOwnership, ROLES } = require('../middleware');
const orderController = require('../controllers/OrderController');
const {
    createOrderSchema,
    updateOrderStatusSchema,
    orderIdSchema,
    orderQuerySchema
} = require('../validations/order/order');

// Get all orders (admin/manager only)
// router.get('/',
//     checkRole([ROLES.ADMIN, ROLES.MANAGER]),
//     validateQuery(orderQuerySchema),
//     orderController.getAll
// );

// Get order by ID
// router.get('/:orderId',
//     validateParams(orderIdSchema),
//     checkOwnership('orderId', async (userId, orderId) => {
//         const order = await Order.findByPk(orderId);
//         return order && (order.userId === userId || [ROLES.ADMIN, ROLES.MANAGER].includes(req.user.role));
//     }),
//     orderController.getById
// );

// // Create order (authenticated users)
// router.post('/',
//     validateRequest(createOrderSchema),
//     orderController.create
// );

// Update order status (admin/manager only)
// router.put('/:orderId/status',
//     checkRole([ROLES.ADMIN, ROLES.MANAGER]),
//     validateParams(orderIdSchema),
//     validateRequest(updateOrderStatusSchema),
//     orderController.updateStatus
// );

// // Cancel order
// router.post('/:orderId/cancel',
//     validateParams(orderIdSchema),
//     checkOwnership('orderId', async (userId, orderId) => {
//         const order = await Order.findByPk(orderId);
//         return order && (order.userId === userId || [ROLES.ADMIN, ROLES.MANAGER].includes(req.user.role));
//     }),
//     orderController.cancel
// );

// // Get user's orders
// router.get('/user/orders',
//     validateQuery(orderQuerySchema),
//     orderController.getUserOrders
// );

// // Order items routes
// router.get('/:orderId/items',
//     validateParams(orderIdSchema),
//     checkOwnership('orderId', async (userId, orderId) => {
//         const order = await Order.findByPk(orderId);
//         return order && (order.userId === userId || [ROLES.ADMIN, ROLES.MANAGER].includes(req.user.role));
//     }),
//     orderController.getOrderItems
// );

// // Order payment routes
// router.get('/:orderId/payment',
//     validateParams(orderIdSchema),
//     checkOwnership('orderId', async (userId, orderId) => {
//         const order = await Order.findByPk(orderId);
//         return order && (order.userId === userId || [ROLES.ADMIN, ROLES.MANAGER].includes(req.user.role));
//     }),
//     orderController.getOrderPayment
// );

module.exports = router; 