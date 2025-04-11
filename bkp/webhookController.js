'use strict';
const crypto = require('crypto');
const { Payment, Invoice, User } = require('../models');
const config = require('../config/config');
const notificationService = require('../services/notificationService');

class WebhookController {
  async handleRazorpayWebhook(req, res) {
    try {
      // Verify webhook signature
      const signature = req.headers['x-razorpay-signature'];
      const body = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', config.razorpay.webhookSecret)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(400).json({ error: 'Invalid signature' });
      }

      const event = req.body.event;
      const payload = req.body.payload;

      switch (event) {
        case 'payment.authorized':
          await this.handlePaymentAuthorized(payload);
          break;
        case 'payment.captured':
          await this.handlePaymentCaptured(payload);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(payload);
          break;
        case 'refund.created':
          await this.handleRefundCreated(payload);
          break;
        case 'refund.processed':
          await this.handleRefundProcessed(payload);
          break;
        default:
          console.log(`Unhandled event: ${event}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async handlePaymentAuthorized(payload) {
    const { payment } = payload;
    const invoice = await Invoice.findOne({
      where: { id: payment.notes.invoice_id }
    });

    if (invoice) {
      await notificationService.sendPaymentAuthorizedNotification(
        invoice,
        payment
      );
    }
  }

  async handlePaymentCaptured(payload) {
    const { payment } = payload;
    const invoice = await Invoice.findOne({
      where: { id: payment.notes.invoice_id },
      include: [{
        model: User,
        as: 'customer',
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });

    if (invoice) {
      // Update payment status
      await Payment.update(
        { status: 'completed' },
        { where: { transaction_id: payment.id } }
      );

      // Update invoice status
      const totalPaid = await Payment.sum('amount', {
        where: {
          invoice_id: invoice.id,
          status: ['completed', 'partially_refunded']
        }
      });

      const newStatus = totalPaid >= invoice.total_amount ? 'paid' : 'partially_paid';
      await invoice.update({
        status: newStatus,
        paid_amount: totalPaid,
        balance_amount: invoice.total_amount - totalPaid
      });

      // Send notifications
      await notificationService.sendPaymentSuccessNotification(
        invoice,
        payment,
        invoice.customer
      );
    }
  }

  async handlePaymentFailed(payload) {
    const { payment } = payload;
    const invoice = await Invoice.findOne({
      where: { id: payment.notes.invoice_id },
      include: [{
        model: User,
        as: 'customer',
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });

    if (invoice) {
      await Payment.update(
        { status: 'failed' },
        { where: { transaction_id: payment.id } }
      );

      await notificationService.sendPaymentFailedNotification(
        invoice,
        payment,
        invoice.customer
      );
    }
  }

  async handleRefundCreated(payload) {
    const { refund } = payload;
    const payment = await Payment.findOne({
      where: { transaction_id: refund.payment_id }
    });

    if (payment) {
      await payment.update({
        status: 'partially_refunded',
        refund_amount: refund.amount / 100,
        refund_date: new Date(),
        refund_reason: refund.notes.reason
      });

      const invoice = await Invoice.findByPk(payment.invoice_id);
      if (invoice) {
        await notificationService.sendRefundInitiatedNotification(
          invoice,
          payment,
          refund
        );
      }
    }
  }

  async handleRefundProcessed(payload) {
    const { refund } = payload;
    const payment = await Payment.findOne({
      where: { transaction_id: refund.payment_id }
    });

    if (payment) {
      const newStatus = refund.amount === payment.amount * 100 ? 'refunded' : 'partially_refunded';
      await payment.update({
        status: newStatus,
        refund_amount: refund.amount / 100,
        refund_date: new Date(),
        refund_reason: refund.notes.reason
      });

      const invoice = await Invoice.findByPk(payment.invoice_id);
      if (invoice) {
        await notificationService.sendRefundProcessedNotification(
          invoice,
          payment,
          refund
        );
      }
    }
  }
}

module.exports = new WebhookController(); 