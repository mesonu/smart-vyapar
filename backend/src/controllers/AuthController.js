const { User } = require("../models");
const BaseController = require("./BaseController");
const { logger } = require("../utils/logger");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const crypto = require("crypto");
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const { ResponseHandler } = require("../utils/ResponseHandler");
const userRepository = require("../repositories/UserRepository");
// const { sendSMS } = require('../services/twilioService');
const { sendEmail } = require("../services/emailService");

class AuthController extends BaseController {
  constructor() {
    super();
    // Initialize Twilio client
    // this.twilioClient = new twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async register(req, res) {
    try {
      const {
        name,
        email,
        password,
        role,
        phone,
        businessName,
        businessType,
        gstNumber,
        address,
      } = req.body;

      console.log("request body=====>", req.body);

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return this.error(res, "Email already registered", 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await userRepository.create({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        businessName,
        businessType,
        gstNumber,
        address,
      });

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // TODO: Send welcome email
      // await sendEmail({
      //   to: email,
      //   subject: "Welcome to SmartVyapar",
      //   text: `Welcome ${name}! Your account has been created successfully.`,
      // });

      // TODO: Send welcome SMS
      // await sendSMS({
      //   to: phone,
      //   body: `Welcome to SmartVyapar! Your account has been created successfully.`,
      // });

      logger.info("User registered successfully", { userId: user.id });

      return this.success(
        res,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            businessName: user.businessName,
            businessType: user.businessType,
            gstNumber: user.gstNumber,
            address: user.address,
          },
          token,
        },
        "Registration successful"
      );
    } catch (error) {
      return this.handleError(res, error, "Failed to register user");
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await userRepository.findByEmail(email, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return ResponseHandler.notFound(res, "User not found");
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return ResponseHandler.unauthorized(res, "Invalid credentials");
      }

      // Check user status
      if (user.status !== "active") {
        return ResponseHandler.forbidden(res, "Account is not active");
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Update last login
      await userRepository.updateLastLogin(user.id);

      logger.info("User logged in successfully", { userId: user.id });

      return ResponseHandler.success(res, "Login successful", {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          businessName: user.businessName,
          businessType: user.businessType,
        },
        token,
      });
    } catch (error) {
      logger.error("Login error:", error);
      return this.handleError(res, error, "Login failed");
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, "User not found");
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return this.ResponseHandler.unauthorized(
          res,
          "Current password is incorrect"
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      logger.info("Password changed successfully", { userId });
      return this.ResponseHandler.success(
        res,
        null,
        "Password changed successfully"
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return this.ResponseHandler.notFound(res, "User not found");
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      await user.update({
        resetToken,
        resetTokenExpiry,
      });

      // Send email with reset token
      await this.sendResetPasswordEmail(user.email, resetToken);

      logger.info("Password reset token generated", { userId: user.id });
      return this.ResponseHandler.success(
        res,
        null,
        "Password reset instructions sent to your email"
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findOne({
        where: {
          resetToken: token,
          resetTokenExpiry: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        return this.ResponseHandler.unauthorized(
          res,
          "Invalid or expired reset token"
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });

      logger.info("Password reset successfully", { userId: user.id });
      return this.ResponseHandler.success(
        res,
        null,
        "Password reset successfully"
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async verifyResetToken(req, res) {
    try {
      const { token } = req.body;

      const user = await User.findOne({
        where: {
          resetToken: token,
          resetTokenExpiry: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        return this.ResponseHandler.unauthorized(
          res,
          "Invalid or expired reset token"
        );
      }

      return this.ResponseHandler.success(res, null, "Token is valid");
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async sendOTP(req, res) {
    try {
      const { phone } = req.body;

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 600000); // 10 minutes

      const user = await User.findOne({ where: { phone } });
      if (!user) {
        return this.ResponseHandler.notFound(res, "User not found");
      }

      await user.update({
        otp,
        otpExpiry,
      });

      // Send OTP via SMS
      await this.twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });

      logger.info("OTP sent successfully", { userId: user.id });
      return this.ResponseHandler.success(res, null, "OTP sent successfully");
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async verifyOTP(req, res) {
    try {
      const { phone, otp } = req.body;

      const user = await User.findOne({
        where: {
          phone,
          otp,
          otpExpiry: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        return this.ResponseHandler.unauthorized(res, "Invalid or expired OTP");
      }

      await user.update({
        otp: null,
        otpExpiry: null,
        isPhoneVerified: true,
      });

      logger.info("OTP verified successfully", { userId: user.id });
      return this.ResponseHandler.success(
        res,
        null,
        "OTP verified successfully"
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async sendVerificationEmail(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, "User not found");
      }

      const verificationToken = crypto.randomBytes(32).toString("hex");
      await user.update({ emailVerificationToken: verificationToken });

      // Send verification email
      await this.sendEmailVerification(user.email, verificationToken);

      logger.info("Verification email sent", { userId });
      return this.ResponseHandler.success(res, null, "Verification email sent");
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      const user = await User.findOne({
        where: { emailVerificationToken: token },
      });

      if (!user) {
        return this.ResponseHandler.unauthorized(
          res,
          "Invalid verification token"
        );
      }

      await user.update({
        emailVerificationToken: null,
        isEmailVerified: true,
      });

      logger.info("Email verified successfully", { userId: user.id });
      return this.ResponseHandler.success(
        res,
        null,
        "Email verified successfully"
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, "User not found");
      }

      return this.ResponseHandler.success(res, this.sanitizeUser(user));
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // Remove sensitive fields
      delete updateData.password;
      delete updateData.role;

      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, "User not found");
      }

      await user.update(updateData);

      logger.info("Profile updated successfully", { userId });
      return this.ResponseHandler.success(
        res,
        this.sanitizeUser(user),
        "Profile updated successfully"
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async toggle2FA(req, res) {
    try {
      const { userId } = req.params;
      const { enabled } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return this.ResponseHandler.notFound(res, "User not found");
      }

      await user.update({ is2FAEnabled: enabled });

      logger.info("2FA status updated", { userId, enabled });
      return this.ResponseHandler.success(
        res,
        null,
        `2FA ${enabled ? "enabled" : "disabled"} successfully`
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  }

  sanitizeUser(user) {
    const sanitized = user.toJSON();
    delete sanitized.password;
    delete sanitized.resetToken;
    delete sanitized.resetTokenExpiry;
    delete sanitized.otp;
    delete sanitized.otpExpiry;
    delete sanitized.emailVerificationToken;
    return sanitized;
  }

  async sendResetPasswordEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
        <p>If you didn't request this, please ignore this email</p>
      `,
    });
  }

  async sendEmailVerification(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await this.transporter.sendMail({
      to: email,
      subject: "Email Verification",
      html: `
        <p>Please verify your email address</p>
        <p>Click this <a href="${verificationUrl}">link</a> to verify your email</p>
      `,
    });
  }
}

module.exports = new AuthController();
