const Razorpay = require('razorpay');
const config = require('../config/config');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: config.razorpayKeyId,
      key_secret: config.razorpayKeySecret
    });
  }

  async createOrder(amount, currency = 'INR') {
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: `order_${Date.now()}`
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
        .createHmac('sha256', config.razorpayKeySecret)
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

  async createPaymentLink(invoice, customer) {
    try {
      const options = {
        amount: invoice.total * 100,
        currency: 'INR',
        accept_partial: false,
        description: `Payment for Invoice #${invoice.invoiceNumber}`,
        customer: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        callback_url: `${config.frontendUrl}/payment/callback`,
        callback_method: 'get'
      };

      const paymentLink = await this.razorpay.paymentLink.create(options);
      return paymentLink;
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw error;
    }
  }

  async refundPayment(paymentId, amount) {
    try {
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: amount * 100
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

module.exports = new PaymentService(); 