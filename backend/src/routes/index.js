const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const promotionRoutes = require('./promotionRoutes');
const reviewRoutes = require('./productReviewRoutes');
const webhookRoutes = require('./webhookRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const whatsappRoutes = require('./whatsappRoutes');
const customerRoutes = require('./customerRoutes');
const promotionScheduleRoutes = require('./promotionScheduleRoutes');
const promotionTemplateRoutes = require('./promotionTemplateRoutes');

// Import middleware
const { authMiddleware, checkRole, ROLES } = require('../middleware');

// Public routes (no authentication required)
router.use('/auth', authRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/whatsapp', whatsappRoutes);

// Protected routes (authentication required)
router.use(authMiddleware);

// Customer routes
router.use('/customers', customerRoutes);

// Product-related routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/reviews', reviewRoutes);

// Order and payment routes
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/invoices', invoiceRoutes);

// Promotion-related routes
router.use('/promotions', promotionRoutes);
router.use('/promotion-schedules', promotionScheduleRoutes);
router.use('/promotion-templates', promotionTemplateRoutes);

// Admin-only routes
router.use('/admin', checkRole([ROLES.ADMIN]), (req, res) => {
    res.json({ message: 'Admin dashboard' });
});

module.exports = router; 