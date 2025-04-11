'use strict';

module.exports = {
  apiVersion: 'v17.0',
  baseUrl: 'https://graph.facebook.com',
  templates: {
    payment_success: {
      name: 'payment_success',
      language: 'en',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: '{{invoice_number}}' },
            { type: 'text', text: '{{amount}}' }
          ]
        }
      ]
    },
    payment_failed: {
      name: 'payment_failed',
      language: 'en',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: '{{invoice_number}}' },
            { type: 'text', text: '{{amount}}' }
          ]
        }
      ]
    },
    refund_initiated: {
      name: 'refund_initiated',
      language: 'en',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: '{{invoice_number}}' },
            { type: 'text', text: '{{amount}}' }
          ]
        }
      ]
    },
    refund_processed: {
      name: 'refund_processed',
      language: 'en',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: '{{invoice_number}}' },
            { type: 'text', text: '{{amount}}' }
          ]
        }
      ]
    }
  },
  // Default message templates
  messages: {
    orderConfirmation: 'Your order #{{invoice_number}} has been confirmed. Total amount: {{amount}}',
    paymentReminder: 'Reminder: Payment of {{amount}} for invoice #{{invoice_number}} is due on {{due_date}}',
    lowStockAlert: 'Alert: Product {{product_name}} is running low on stock. Current quantity: {{quantity}}',
    paymentSuccess: 'Payment of {{amount}} for invoice #{{invoice_number}} has been successfully processed.',
    paymentFailed: 'Payment of {{amount}} for invoice #{{invoice_number}} has failed. Please try again.',
    refundInitiated: 'Refund of {{amount}} for invoice #{{invoice_number}} has been initiated.',
    refundProcessed: 'Refund of {{amount}} for invoice #{{invoice_number}} has been processed.'
  }
}; 