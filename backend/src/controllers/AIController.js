const BaseController = require('./BaseController');
const AIService = require('../services/AIService');
const { logger } = require('../utils/logger');

class AIController extends BaseController {
  constructor() {
    super();
  }

  // Analyze billing patterns
  analyzeBilling = async (req, res) => {
    try {
      const { invoiceData } = req.body;
      const analysis = await AIService.analyzeBillingPatterns(invoiceData);
      return this.ResponseHandler.success(res, { analysis });
    } catch (error) {
      logger.error('Error in billing analysis:', error);
      return this.handleError(error, res);
    }
  };

  // Optimize inventory
  optimizeInventory = async (req, res) => {
    try {
      const { inventoryData } = req.body;
      const optimization = await AIService.optimizeInventory(inventoryData);
      return this.ResponseHandler.success(res, { optimization });
    } catch (error) {
      logger.error('Error in inventory optimization:', error);
      return this.handleError(error, res);
    }
  };

  // Process voice command
  processVoiceCommand = async (req, res) => {
    try {
      const { audioData, language } = req.body;
      const result = await AIService.processVoiceCommand(audioData, language);
      return this.ResponseHandler.success(res, { result });
    } catch (error) {
      logger.error('Error in voice command processing:', error);
      return this.handleError(error, res);
    }
  };

  // Analyze customer behavior
  analyzeCustomerBehavior = async (req, res) => {
    try {
      const { customerData } = req.body;
      const analysis = await AIService.analyzeCustomerBehavior(customerData);
      return this.ResponseHandler.success(res, { analysis });
    } catch (error) {
      logger.error('Error in customer behavior analysis:', error);
      return this.handleError(error, res);
    }
  };

  // Translate text
  translateText = async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      const translation = await AIService.translateText(text, targetLanguage);
      return this.ResponseHandler.success(res, { translation });
    } catch (error) {
      logger.error('Error in text translation:', error);
      return this.handleError(error, res);
    }
  };

  // Analyze GST compliance
  analyzeGSTCompliance = async (req, res) => {
    try {
      const { transactionData } = req.body;
      const analysis = await AIService.analyzeGSTCompliance(transactionData);
      return this.ResponseHandler.success(res, { analysis });
    } catch (error) {
      logger.error('Error in GST compliance analysis:', error);
      return this.handleError(error, res);
    }
  };
}

module.exports = new AIController(); 