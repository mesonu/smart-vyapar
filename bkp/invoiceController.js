'use strict';
const { Invoice, InvoiceItem, InvoiceHistory, Customer, User, Payment, Product } = require('../models');
const { Op } = require('sequelize');
const whatsappService = require('../services/whatsappService');

const generateInvoiceNumber = (userId) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${userId.slice(0, 4)}-${timestamp}-${random}`;
};

const invoiceController = {
  // Get all invoices with filtering and pagination
  async getAllInvoices(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        customerId,
        startDate,
        endDate,
        search
      } = req.query;

      const where = {};
      if (status) where.status = status;
      if (customerId) where.customer_id = customerId;
      if (startDate && endDate) {
        where.issue_date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
      if (search) {
        where[Op.or] = [
          { invoice_number: { [Op.iLike]: `%${search}%` } },
          { '$customer.name$': { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Invoice.findAndCountAll({
        where,
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: (page - 1) * limit
      });

      res.json({
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        data: rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get invoice by ID
  async getInvoiceById(req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id, {
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'phone', 'address', 'gst_number']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: InvoiceItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'sku', 'description']
              }
            ]
          },
          {
            model: Payment,
            as: 'payments',
            attributes: ['id', 'amount', 'payment_method', 'status', 'payment_date']
          },
          {
            model: InvoiceHistory,
            as: 'history',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'name']
              }
            ],
            order: [['created_at', 'DESC']]
          }
        ]
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new invoice
  async createInvoice(req, res) {
    const t = await Invoice.sequelize.transaction();
    try {
      const { items, ...invoiceData } = req.body;
      
      // Create invoice
      const invoice = await Invoice.create(invoiceData, { transaction: t });

      // Create invoice items
      if (items && items.length > 0) {
        const invoiceItems = items.map(item => ({
          ...item,
          invoice_id: invoice.id
        }));
        await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
      }

      // Create history record
      await InvoiceHistory.create({
        invoice_id: invoice.id,
        user_id: req.user.id,
        action: 'create',
        changes: { ...invoiceData, items }
      }, { transaction: t });

      await t.commit();
      res.status(201).json(invoice);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Update invoice
  async updateInvoice(req, res) {
    const t = await Invoice.sequelize.transaction();
    try {
      const { items, ...invoiceData } = req.body;
      const invoice = await Invoice.findByPk(req.params.id);

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      // Update invoice
      await invoice.update(invoiceData, { transaction: t });

      // Update items if provided
      if (items) {
        // Delete existing items
        await InvoiceItem.destroy({
          where: { invoice_id: invoice.id },
          transaction: t
        });

        // Create new items
        const invoiceItems = items.map(item => ({
          ...item,
          invoice_id: invoice.id
        }));
        await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
      }

      // Create history record
      await InvoiceHistory.create({
        invoice_id: invoice.id,
        user_id: req.user.id,
        action: 'update',
        changes: { ...invoiceData, items }
      }, { transaction: t });

      await t.commit();
      res.json(invoice);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Delete invoice
  async deleteInvoice(req, res) {
    const t = await Invoice.sequelize.transaction();
    try {
      const invoice = await Invoice.findByPk(req.params.id);

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      if (invoice.status !== 'draft') {
        return res.status(400).json({ error: 'Only draft invoices can be deleted' });
      }

      // Create history record before deletion
      await InvoiceHistory.create({
        invoice_id: invoice.id,
        user_id: req.user.id,
        action: 'delete'
      }, { transaction: t });

      await invoice.destroy({ transaction: t });
      await t.commit();
      res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Update invoice status
  async updateInvoiceStatus(req, res) {
    const t = await Invoice.sequelize.transaction();
    try {
      const { status } = req.body;
      const invoice = await Invoice.findByPk(req.params.id);

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      const oldStatus = invoice.status;
      await invoice.update({ status }, { transaction: t });

      // Create history record
      await InvoiceHistory.create({
        invoice_id: invoice.id,
        user_id: req.user.id,
        action: 'status_change',
        changes: { oldStatus, newStatus: status }
      }, { transaction: t });

      await t.commit();
      res.json(invoice);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Record payment
  async recordPayment(req, res) {
    const t = await Invoice.sequelize.transaction();
    try {
      const { amount, paymentMethod, transactionId, notes } = req.body;
      const invoice = await Invoice.findByPk(req.params.id);

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      // Create payment record
      const payment = await Payment.create({
        invoice_id: invoice.id,
        amount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        notes,
        status: 'completed'
      }, { transaction: t });

      // Update invoice paid amount
      const newPaidAmount = invoice.paid_amount + amount;
      await invoice.update({ paid_amount: newPaidAmount }, { transaction: t });

      // Create history record
      await InvoiceHistory.create({
        invoice_id: invoice.id,
        user_id: req.user.id,
        action: 'payment',
        changes: { payment }
      }, { transaction: t });

      await t.commit();
      res.json(payment);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Get recurring invoices
  async getRecurringInvoices(req, res) {
    try {
      const invoices = await Invoice.findAll({
        where: {
          is_recurring: true,
          status: 'active'
        },
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Generate next recurring invoice
  async generateNextRecurringInvoice(req, res) {
    const t = await Invoice.sequelize.transaction();
    try {
      const invoice = await Invoice.findByPk(req.params.id);

      if (!invoice || !invoice.is_recurring) {
        return res.status(400).json({ error: 'Not a recurring invoice' });
      }

      // Create new invoice based on the recurring one
      const newInvoice = await Invoice.create({
        ...invoice.toJSON(),
        id: undefined,
        invoice_number: undefined,
        status: 'draft',
        issue_date: new Date(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        paid_amount: 0,
        balance_amount: invoice.total_amount
      }, { transaction: t });

      // Copy invoice items
      const items = await InvoiceItem.findAll({
        where: { invoice_id: invoice.id }
      });

      const newItems = items.map(item => ({
        ...item.toJSON(),
        id: undefined,
        invoice_id: newInvoice.id
      }));

      await InvoiceItem.bulkCreate(newItems, { transaction: t });

      // Create history record
      await InvoiceHistory.create({
        invoice_id: newInvoice.id,
        user_id: req.user.id,
        action: 'create',
        changes: { source_invoice_id: invoice.id }
      }, { transaction: t });

      await t.commit();
      res.json(newInvoice);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = invoiceController; 