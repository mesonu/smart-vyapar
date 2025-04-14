const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });
  }

  /**
   * Send email using Nodemailer
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} [options.html] - HTML content
   * @returns {Promise<Object>} Nodemailer response
   */
  async sendEmail({ to, subject, text, html }) {
    try {
      const mailOptions = {
        from: `"${config.email.fromName}" <${config.email.user}>`,
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      logger.info('Email sent successfully', {
        to,
        messageId: info.messageId
      });

      return info;
    } catch (error) {
      logger.error('Failed to send email', {
        to,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Send welcome email
   * @param {string} email - Recipient email
   * @param {string} name - User's name
   * @returns {Promise<Object>} Nodemailer response
   */
  async sendWelcomeEmail(email, name) {
    const subject = 'Welcome to Our Platform';
    const text = `Welcome ${name} to our platform! We're excited to have you on board.`;
    const html = `
      <h1>Welcome ${name}!</h1>
      <p>We're excited to have you on board.</p>
      <p>If you have any questions, feel free to contact us.</p>
    `;

    return this.sendEmail({ to: email, subject, text, html });
  }

  /**
   * Send password reset email
   * @param {string} email - Recipient email
   * @param {string} resetLink - Password reset link
   * @returns {Promise<Object>} Nodemailer response
   */
  async sendPasswordResetEmail(email, resetLink) {
    const subject = 'Password Reset Request';
    const text = `Click the following link to reset your password: ${resetLink}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>Click the button below to reset your password:</p>
      <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    return this.sendEmail({ to: email, subject, text, html });
  }

  /**
   * Send verification email
   * @param {string} email - Recipient email
   * @param {string} verificationLink - Email verification link
   * @returns {Promise<Object>} Nodemailer response
   */
  async sendVerificationEmail(email, verificationLink) {
    const subject = 'Verify Your Email';
    const text = `Click the following link to verify your email: ${verificationLink}`;
    const html = `
      <h1>Verify Your Email</h1>
      <p>Click the button below to verify your email address:</p>
      <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    return this.sendEmail({ to: email, subject, text, html });
  }

  /**
   * Send OTP email
   * @param {string} email - Recipient email
   * @param {string} otp - OTP code
   * @returns {Promise<Object>} Nodemailer response
   */
  async sendOTPEmail(email, otp) {
    const subject = 'Your OTP Code';
    const text = `Your OTP code is: ${otp}. This code will expire in 5 minutes.`;
    const html = `
      <h1>Your OTP Code</h1>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `;

    return this.sendEmail({ to: email, subject, text, html });
  }
}

module.exports = new EmailService(); 