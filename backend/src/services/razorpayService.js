'use strict';
const Razorpay = require('razorpay');
const config = require('../config/config');

class RazorpayService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret
    });
  }

  async createOrder(amount, currency = 'INR', receipt = null) {
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1
      };

      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  async verifyPayment(paymentId, orderId, signature) {
    try {
      const crypto = require('crypto');
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', config.razorpay.keySecret)
        .update(body)
        .digest('hex');

      if (expectedSignature === signature) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  async createPaymentLink(amount, currency = 'INR', customer = null) {
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency,
        accept_partial: true,
        first_min_partial_amount: 100,
        description: 'Payment for invoice',
        customer: customer || {
          name: 'Customer',
          email: 'customer@example.com'
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        callback_url: `${process.env.APP_URL}/payment/callback`,
        callback_method: 'get'
      };

      const paymentLink = await this.razorpay.paymentLink.create(options);
      return paymentLink;
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw error;
    }
  }

  async refundPayment(paymentId, amount, notes = {}) {
    try {
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: amount * 100, // Convert to paise
        notes
      });
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  }
}

module.exports = new RazorpayService(); 