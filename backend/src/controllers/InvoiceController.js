const { Invoice, InvoiceItem, Product, User } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class InvoiceController extends BaseController {
  constructor() {
    super(Invoice);
  }

  createInvoice = async (req, res) => {
    try {
      const { customerId, items, discount, tax, notes } = req.body;

      const customer = await User.findByPk(customerId);
      if (!customer) {
        return this.ResponseHandler.notFound(res, 'Customer not found');
      }

      const invoice = await Invoice.create({
        customerId,
        discount,
        tax,
        notes,
        status: 'pending'
      });

      const invoiceItems = await Promise.all(
        items.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}`);
          }

          await product.update({ stock: product.stock - item.quantity });

          return InvoiceItem.create({
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
          });
        })
      );

      const total = invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const finalTotal = total - (total * (discount || 0) / 100) + (total * (tax || 0) / 100);

      await invoice.update({ total: finalTotal });

      logger.info('Invoice created successfully', { invoiceId: invoice.id });
      return this.ResponseHandler.created(res, { invoice, items: invoiceItems }, 'Invoice created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  getAllInvoices = async (req, res) => {
    try {
      const { page = 1, limit = 10, status, customerId, startDate, endDate } = req.query;
      const offset = (page - 1) * limit;

      const where = this.buildWhereClause({ status, customerId, startDate, endDate });

      const { count, rows: invoices } = await Invoice.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: InvoiceItem,
            include: [{
              model: Product,
              attributes: ['id', 'name', 'price']
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return this.ResponseHandler.success(res, {
        invoices,
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

  getInvoiceById = async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: InvoiceItem,
            include: [{
              model: Product,
              attributes: ['id', 'name', 'price']
            }]
          }
        ]
      });

      if (!invoice) {
        return this.ResponseHandler.notFound(res, 'Invoice not found');
      }

      return this.ResponseHandler.success(res, invoice);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  updateInvoiceStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const invoice = await Invoice.findByPk(req.params.id);

      if (!invoice) {
        return this.ResponseHandler.notFound(res, 'Invoice not found');
      }

      const updatedInvoice = await invoice.update({ status });

      logger.info('Invoice status updated successfully', { invoiceId: invoice.id, status });
      return this.ResponseHandler.success(res, updatedInvoice, 'Invoice status updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  buildWhereClause = (filters) => {
    const where = {};
    const { status, customerId, startDate, endDate } = filters;

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    return where;
  };
}

module.exports = new InvoiceController(); 