const Joi = require('joi');

// Schema for billing analysis
const billingAnalysisSchema = Joi.object({
  invoiceData: Joi.object({
    transactions: Joi.array().items(
      Joi.object({
        amount: Joi.number().required(),
        date: Joi.date().required(),
        category: Joi.string().required(),
        customerId: Joi.string().required()
      })
    ).required(),
    timeRange: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().required()
    }).required()
  }).required()
});

// Schema for inventory optimization
const inventoryOptimizationSchema = Joi.object({
  inventoryData: Joi.object({
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        currentStock: Joi.number().required(),
        salesHistory: Joi.array().items(
          Joi.object({
            date: Joi.date().required(),
            quantity: Joi.number().required()
          })
        ).required(),
        leadTime: Joi.number().required(),
        reorderPoint: Joi.number().required()
      })
    ).required(),
    warehouseCapacity: Joi.number().required()
  }).required()
});

// Schema for voice command processing
const voiceCommandSchema = Joi.object({
  audioData: Joi.string().required(),
  language: Joi.string().valid('en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa').required()
});

// Schema for customer behavior analysis
const customerBehaviorSchema = Joi.object({
  customerData: Joi.object({
    customerId: Joi.string().required(),
    purchaseHistory: Joi.array().items(
      Joi.object({
        date: Joi.date().required(),
        amount: Joi.number().required(),
        products: Joi.array().items(Joi.string()).required()
      })
    ).required(),
    demographics: Joi.object({
      age: Joi.number().integer().min(0).max(120),
      gender: Joi.string().valid('male', 'female', 'other'),
      location: Joi.string()
    })
  }).required()
});

// Schema for text translation
const translationSchema = Joi.object({
  text: Joi.string().required(),
  targetLanguage: Joi.string().valid('en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa').required()
});

// Schema for GST compliance analysis
const gstComplianceSchema = Joi.object({
  transactionData: Joi.object({
    transactions: Joi.array().items(
      Joi.object({
        date: Joi.date().required(),
        amount: Joi.number().required(),
        gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).required(),
        type: Joi.string().valid('sale', 'purchase').required()
      })
    ).required(),
    timeRange: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().required()
    }).required()
  }).required()
});

module.exports = {
  billingAnalysisSchema,
  inventoryOptimizationSchema,
  voiceCommandSchema,
  customerBehaviorSchema,
  translationSchema,
  gstComplianceSchema
}; 