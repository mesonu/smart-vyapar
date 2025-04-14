const twilio = require('twilio');
const { logger } = require('../utils/logger');
const config = require('../config/config');

class TwilioService {
  constructor() {
    this.client = twilio(
      config.twilio.accountSid,
      config.twilio.authToken
    );
  }

  /**
   * Send SMS using Twilio
   * @param {string} to - Recipient phone number
   * @param {string} message - Message content
   * @returns {Promise<Object>} Twilio message response
   */
  async sendSMS(to, message) {
    try {
      const response = await this.client.messages.create({
        body: message,
        to,
        from: config.twilio.phoneNumber
      });

      logger.info('SMS sent successfully', {
        to,
        messageId: response.sid
      });

      return response;
    } catch (error) {
      logger.error('Failed to send SMS', {
        to,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Send OTP via SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} otp - OTP code
   * @returns {Promise<Object>} Twilio message response
   */
  async sendOTP(phoneNumber, otp) {
    const message = `Your OTP for verification is: ${otp}. This OTP will expire in 5 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send password reset link via SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} resetLink - Password reset link
   * @returns {Promise<Object>} Twilio message response
   */
  async sendPasswordResetLink(phoneNumber, resetLink) {
    const message = `Click the following link to reset your password: ${resetLink}. This link will expire in 1 hour.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send welcome message
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} name - User's name
   * @returns {Promise<Object>} Twilio message response
   */
  async sendWelcomeMessage(phoneNumber, name) {
    const message = `Welcome ${name} to our platform! We're excited to have you on board.`;
    return this.sendSMS(phoneNumber, message);
  }
}

module.exports = new TwilioService(); 