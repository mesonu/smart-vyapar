const { OpenAI } = require('openai');
const { logger } = require('../utils/logger');
const config = require('../config/config');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // Smart Billing Analysis
  async analyzeBillingPatterns(invoiceData) {
    try {
      const prompt = `Analyze the following billing data and provide insights:
        ${JSON.stringify(invoiceData)}
        Please provide:
        1. Peak sales hours
        2. Most popular products
        3. Customer purchase patterns
        4. Revenue trends
        5. Recommendations for inventory management`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('Error in billing analysis:', error);
      throw error;
    }
  }

  // Inventory Optimization
  async optimizeInventory(inventoryData) {
    try {
      const prompt = `Analyze the following inventory data and provide optimization recommendations:
        ${JSON.stringify(inventoryData)}
        Please provide:
        1. Stock level recommendations
        2. Reorder points
        3. Slow-moving items
        4. Seasonal trends
        5. Inventory cost optimization`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('Error in inventory optimization:', error);
      throw error;
    }
  }

  // Voice Command Processing
  async processVoiceCommand(audioData, language = 'en') {
    try {
      // First, convert speech to text
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioData,
        model: "whisper-1",
        language: language
      });

      // Then, process the text command
      const prompt = `Process this voice command for a retail business:
        "${transcription.text}"
        Please:
        1. Identify the intent
        2. Extract relevant parameters
        3. Format as a structured command`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });

      return {
        originalText: transcription.text,
        processedCommand: JSON.parse(response.choices[0].message.content)
      };
    } catch (error) {
      logger.error('Error in voice command processing:', error);
      throw error;
    }
  }

  // Customer Behavior Analysis
  async analyzeCustomerBehavior(customerData) {
    try {
      const prompt = `Analyze the following customer data and provide insights:
        ${JSON.stringify(customerData)}
        Please provide:
        1. Customer segmentation
        2. Purchase patterns
        3. Loyalty indicators
        4. Personalized recommendations
        5. Retention strategies`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('Error in customer behavior analysis:', error);
      throw error;
    }
  }

  // Multi-language Support
  async translateText(text, targetLanguage) {
    try {
      const prompt = `Translate the following text to ${targetLanguage}:
        "${text}"
        Please provide only the translation without any additional text.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('Error in text translation:', error);
      throw error;
    }
  }

  // GST Compliance Analysis
  async analyzeGSTCompliance(transactionData) {
    try {
      const prompt = `Analyze the following transaction data for GST compliance:
        ${JSON.stringify(transactionData)}
        Please provide:
        1. GST calculation verification
        2. Compliance checklist
        3. Potential issues
        4. Recommendations
        5. Documentation requirements`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('Error in GST compliance analysis:', error);
      throw error;
    }
  }
}

module.exports = new AIService(); 