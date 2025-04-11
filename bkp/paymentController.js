'use strict';
const { Payment, Invoice, User } = require('../models');
const { Op } = require('sequelize');
const config = require('../config/config');
const whatsappService = require('../services/whatsappService');
const razorpayService = require('../services/razorpayService');

// Initialize Razorpay only if keys are available
let razorpay;
if (config.razorpayKeyId && config.razorpayKeySecret) {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpayKeySecret
  });
}

const paymentController = {
  // Get all payments with filtering and pagination
  async getAllPayments(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        paymentMethod,
        startDate,
        endDate,
        search
      } = req.query;

      const where = {};
      if (status) where.status = status;
      if (paymentMethod) where.payment_method = paymentMethod;
      if (startDate && endDate) {
        where.payment_date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
      if (search) {
        where[Op.or] = [
          { transaction_id: { [Op.iLike]: `%${search}%` } },
          { reference_number: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Payment.findAndCountAll({
        where,
        include: [
          {
            model: Invoice,
            as: 'invoice',
            attributes: ['id', 'invoice_number', 'total_amount']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['payment_date', 'DESC']],
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

  // Get payment by ID
  async getPaymentById(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [
          {
            model: Invoice,
            as: 'invoice',
            attributes: ['id', 'invoice_number', 'total_amount', 'status']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create payment order
  async createPaymentOrder(req, res) {
    try {
      const { invoice_id, amount } = req.body;

      const invoice = await Invoice.findByPk(invoice_id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      const order = await razorpayService.createOrder(
        amount,
        invoice.currency || 'INR',
        `invoice_${invoice_id}`
      );

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Verify payment
  async verifyPayment(req, res) {
    const t = await Payment.sequelize.transaction();
    try {
      const { order_id, payment_id, signature, invoice_id, amount } = req.body;

      const isValid = await razorpayService.verifyPayment(
        payment_id,
        order_id,
        signature
      );

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }

      const paymentDetails = await razorpayService.getPaymentDetails(payment_id);

      // Create payment record
      const payment = await Payment.create({
        invoice_id,
        user_id: req.user.id,
        amount,
        payment_method: paymentDetails.method,
        transaction_id: payment_id,
        reference_number: order_id,
        status: 'completed',
        metadata: paymentDetails
      }, { transaction: t });

      // Update invoice status
      const invoice = await Invoice.findByPk(invoice_id);
      const totalPaid = await Payment.sum('amount', {
        where: {
          invoice_id,
          status: ['completed', 'partially_refunded']
        },
        transaction: t
      });

      const newStatus = totalPaid >= invoice.total_amount ? 'paid' : 'partially_paid';
      await invoice.update({
        status: newStatus,
        paid_amount: totalPaid,
        balance_amount: invoice.total_amount - totalPaid
      }, { transaction: t });

      await t.commit();
      res.json(payment);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Create payment link
  async createPaymentLink(req, res) {
    try {
      const { invoice_id, amount } = req.body;

      const invoice = await Invoice.findByPk(invoice_id, {
        include: [{
          model: User,
          as: 'customer',
          attributes: ['name', 'email']
        }]
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      const paymentLink = await razorpayService.createPaymentLink(
        amount,
        invoice.currency || 'INR',
        {
          name: invoice.customer.name,
          email: invoice.customer.email
        }
      );

      res.json({
        paymentLink: paymentLink.short_url,
        paymentLinkId: paymentLink.id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Process refund
  async processRefund(req, res) {
    const t = await Payment.sequelize.transaction();
    try {
      const { payment_id, amount, reason } = req.body;

      const payment = await Payment.findByPk(payment_id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (payment.status !== 'completed') {
        return res.status(400).json({ error: 'Only completed payments can be refunded' });
      }

      if (amount > payment.amount) {
        return res.status(400).json({ error: 'Refund amount cannot exceed payment amount' });
      }

      // Process refund with Razorpay
      const refund = await razorpayService.refundPayment(
        payment.transaction_id,
        amount,
        { reason }
      );

      // Update payment status
      const newStatus = amount === payment.amount ? 'refunded' : 'partially_refunded';
      await payment.update({
        status: newStatus,
        refund_amount: amount,
        refund_date: new Date(),
        refund_reason: reason,
        metadata: {
          ...payment.metadata,
          refund_id: refund.id
        }
      }, { transaction: t });

      // Update invoice status
      const invoice = await Invoice.findByPk(payment.invoice_id);
      const totalPaid = await Payment.sum('amount', {
        where: {
          invoice_id: payment.invoice_id,
          status: ['completed', 'partially_refunded']
        },
        transaction: t
      });

      const newInvoiceStatus = totalPaid >= invoice.total_amount ? 'paid' : 'partially_paid';
      await invoice.update({
        status: newInvoiceStatus,
        paid_amount: totalPaid,
        balance_amount: invoice.total_amount - totalPaid
      }, { transaction: t });

      await t.commit();
      res.json(payment);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Get payment history for an invoice
  async getInvoicePayments(req, res) {
    try {
      const payments = await Payment.findAll({
        where: { invoice_id: req.params.invoiceId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['payment_date', 'DESC']]
      });

      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = paymentController; 