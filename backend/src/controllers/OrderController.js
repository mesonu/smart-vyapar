const { Order, OrderItem, Product, User, Payment } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class OrderController extends BaseController {
  constructor() {
    super(Order);
  }

  createOrder = async (req, res) => {
    try {
      const {
        userId,
        items,
        shippingAddress,
        billingAddress,
        paymentMethod,
        promotionCode
      } = req.body;

      // Validate user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, 'User not found');
      }

      // Validate products and calculate total
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          return this.ResponseHandler.notFound(res, `Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          return this.ResponseHandler.badRequest(
            res,
            `Insufficient stock for product ${product.name}`
          );
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal
        });
      }

      // Create order
      const order = await Order.create({
        userId,
        totalAmount,
        status: 'pending',
        shippingAddress,
        billingAddress,
        paymentMethod,
        promotionCode
      });

      // Create order items
      await OrderItem.bulkCreate(
        orderItems.map(item => ({
          ...item,
          orderId: order.id
        }))
      );

      // Update product stock
      for (const item of items) {
        await Product.decrement('stock', {
          by: item.quantity,
          where: { id: item.productId }
        });
      }

      logger.info('Order created successfully', { orderId: order.id });
      return this.ResponseHandler.created(res, order, 'Order created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllOrders = async (req, res) => {
    try {
      const { page = 1, limit = 10, status, userId, startDate, endDate } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ status, userId, startDate, endDate });

      const { count, rows: orders } = await Order.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: OrderItem,
            include: [{
              model: Product,
              attributes: ['id', 'name', 'price']
            }]
          },
          {
            model: Payment,
            attributes: ['id', 'status', 'amount', 'paymentMethod']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        orders,
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

  getOrderById = async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: OrderItem,
            include: [{
              model: Product,
              attributes: ['id', 'name', 'price', 'description']
            }]
          },
          {
            model: Payment,
            attributes: ['id', 'status', 'amount', 'paymentMethod', 'transactionId']
          }
        ]
      });

      if (!order) {
        return this.ResponseHandler.notFound(res, 'Order not found');
      }

      return this.ResponseHandler.success(res, order);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateOrderStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return this.ResponseHandler.notFound(res, 'Order not found');
      }

      // Validate status transition
      const validTransitions = {
        pending: ['processing', 'cancelled'],
        processing: ['shipped', 'cancelled'],
        shipped: ['delivered'],
        delivered: [],
        cancelled: []
      };

      if (!validTransitions[order.status]?.includes(status)) {
        return this.ResponseHandler.badRequest(
          res,
          `Invalid status transition from ${order.status} to ${status}`
        );
      }

      const updatedOrder = await order.update({ status });

      logger.info('Order status updated', {
        orderId: order.id,
        oldStatus: order.status,
        newStatus: status
      });

      return this.ResponseHandler.success(res, updatedOrder, 'Order status updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  cancelOrder = async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return this.ResponseHandler.notFound(res, 'Order not found');
      }

      if (order.status !== 'pending' && order.status !== 'processing') {
        return this.ResponseHandler.badRequest(
          res,
          'Only pending or processing orders can be cancelled'
        );
      }

      // Restore product stock
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
        include: [Product]
      });

      for (const item of orderItems) {
        await Product.increment('stock', {
          by: item.quantity,
          where: { id: item.productId }
        });
      }

      const updatedOrder = await order.update({ status: 'cancelled' });

      logger.info('Order cancelled', { orderId: order.id });
      return this.ResponseHandler.success(res, updatedOrder, 'Order cancelled successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getUserOrders = async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const where = {
        userId: req.params.userId,
        ...(status && { status })
      };

      const { count, rows: orders } = await Order.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: OrderItem,
            include: [{
              model: Product,
              attributes: ['id', 'name', 'price']
            }]
          },
          {
            model: Payment,
            attributes: ['id', 'status', 'amount', 'paymentMethod']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        orders,
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

  buildWhereClause = (filters) => {
    const where = {};
    const { status, userId, startDate, endDate } = filters;

    if (status) where.status = status;
    if (userId) where.userId = userId;

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

module.exports = new OrderController(); 