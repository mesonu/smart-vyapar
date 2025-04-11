'use strict';
const nodemailer = require('nodemailer');
const config = require('../config/config');
const whatsappService = require('./whatsappService');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendPaymentAuthorizedNotification(invoice, payment) {
    const subject = 'Payment Authorized';
    const message = `
      Payment of ₹${payment.amount / 100} has been authorized for Invoice #${invoice.invoice_number}.
      Waiting for payment capture.
    `;

    await this.sendEmail(invoice.customer.email, subject, message);
    await this.sendWhatsApp(invoice.customer.phone, message);
  }

  async sendPaymentSuccessNotification(invoice, payment, customer) {
    const subject = 'Payment Successful';
    const message = `
      Payment of ₹${payment.amount / 100} has been successfully processed for Invoice #${invoice.invoice_number}.
      Thank you for your payment!
    `;

    await this.sendEmail(customer.email, subject, message);
    await this.sendWhatsApp(customer.phone, message);
  }

  async sendPaymentFailedNotification(invoice, payment, customer) {
    const subject = 'Payment Failed';
    const message = `
      Payment of ₹${payment.amount / 100} for Invoice #${invoice.invoice_number} has failed.
      Please try again or contact support.
    `;

    await this.sendEmail(customer.email, subject, message);
    await this.sendWhatsApp(customer.phone, message);
  }

  async sendRefundInitiatedNotification(invoice, payment, refund) {
    const subject = 'Refund Initiated';
    const message = `
      A refund of ₹${refund.amount / 100} has been initiated for Invoice #${invoice.invoice_number}.
      The refund will be processed shortly.
    `;

    await this.sendEmail(invoice.customer.email, subject, message);
    await this.sendWhatsApp(invoice.customer.phone, message);
  }

  async sendRefundProcessedNotification(invoice, payment, refund) {
    const subject = 'Refund Processed';
    const message = `
      A refund of ₹${refund.amount / 100} has been processed for Invoice #${invoice.invoice_number}.
      The amount will be credited to your account within 5-7 business days.
    `;

    await this.sendEmail(invoice.customer.email, subject, message);
    await this.sendWhatsApp(invoice.customer.phone, message);
  }

  async sendEmail(to, subject, text) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendWhatsApp(to, message) {
    try {
      await whatsappService.sendMessage(to, message);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  }
}

module.exports = new NotificationService(); 