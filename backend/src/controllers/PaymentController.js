const { Payment, Order, User } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class PaymentController extends BaseController {
  constructor() {
    super(Payment);
  }

  createPayment = async (req, res) => {
    try {
      const {
        orderId,
        amount,
        paymentMethod,
        transactionId,
        status = 'pending'
      } = req.body;

      // Validate order exists
      const order = await Order.findByPk(orderId);
      if (!order) {
        return this.ResponseHandler.notFound(res, 'Order not found');
      }

      // Validate amount matches order total
      if (amount !== order.totalAmount) {
        return this.ResponseHandler.badRequest(
          res,
          'Payment amount does not match order total'
        );
      }

      // Check if payment already exists for this order
      const existingPayment = await Payment.findOne({ where: { orderId } });
      if (existingPayment) {
        return this.ResponseHandler.conflict(res, 'Payment already exists for this order');
      }

      const payment = await Payment.create({
        orderId,
        userId: order.userId,
        amount,
        paymentMethod,
        transactionId,
        status
      });

      // Update order status based on payment status
      if (status === 'completed') {
        await order.update({ status: 'processing' });
      }

      logger.info('Payment created successfully', { paymentId: payment.id });
      return this.ResponseHandler.created(res, payment, 'Payment created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllPayments = async (req, res) => {
    try {
      const { page = 1, limit = 10, status, paymentMethod, startDate, endDate } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ status, paymentMethod, startDate, endDate });

      const { count, rows: payments } = await Payment.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Order,
            attributes: ['id', 'status', 'totalAmount']
          },
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        payments,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getPaymentById = async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [
          {
            model: Order,
            attributes: ['id', 'status', 'totalAmount', 'shippingAddress']
          },
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          }
        ]
      });

      if (!payment) {
        return this.ResponseHandler.notFound(res, 'Payment not found');
      }

      return this.ResponseHandler.success(res, payment);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updatePaymentStatus = async (req, res) => {
    try {
      const { status, transactionId } = req.body;
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) {
        return this.ResponseHandler.notFound(res, 'Payment not found');
      }

      // Validate status transition
      const validTransitions = {
        pending: ['completed', 'failed'],
        completed: ['refunded'],
        failed: ['pending'],
        refunded: []
      };

      if (!validTransitions[payment.status]?.includes(status)) {
        return this.ResponseHandler.badRequest(
          res,
          `Invalid status transition from ${payment.status} to ${status}`
        );
      }

      const updateData = { status };
      if (transactionId) {
        updateData.transactionId = transactionId;
      }

      const updatedPayment = await payment.update(updateData);

      // Update order status based on payment status
      const order = await Order.findByPk(payment.orderId);
      if (order) {
        if (status === 'completed') {
          await order.update({ status: 'processing' });
        } else if (status === 'refunded') {
          await order.update({ status: 'cancelled' });
        }
      }

      logger.info('Payment status updated', {
        paymentId: payment.id,
        oldStatus: payment.status,
        newStatus: status
      });

      return this.ResponseHandler.success(res, updatedPayment, 'Payment status updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getUserPayments = async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const where = {
        userId: req.params.userId,
        ...(status && { status })
      };

      const { count, rows: payments } = await Payment.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Order,
            attributes: ['id', 'status', 'totalAmount']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        payments,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  processRefund = async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) {
        return this.ResponseHandler.notFound(res, 'Payment not found');
      }

      if (payment.status !== 'completed') {
        return this.ResponseHandler.badRequest(
          res,
          'Only completed payments can be refunded'
        );
      }

      const order = await Order.findByPk(payment.orderId);
      if (!order) {
        return this.ResponseHandler.notFound(res, 'Order not found');
      }

      if (order.status === 'delivered') {
        return this.ResponseHandler.badRequest(
          res,
          'Cannot refund payment for delivered order'
        );
      }

      // Update payment status
      const updatedPayment = await payment.update({ status: 'refunded' });

      // Update order status
      await order.update({ status: 'cancelled' });

      logger.info('Payment refunded', { paymentId: payment.id });
      return this.ResponseHandler.success(res, updatedPayment, 'Payment refunded successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { status, paymentMethod, startDate, endDate } = filters;

    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      where.createdAt = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      where.createdAt = { [Op.lte]: new Date(endDate) };
    }

    return where;
  };
}

module.exports = new PaymentController(); 