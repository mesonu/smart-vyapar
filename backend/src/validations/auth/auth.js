const Joi = require("joi");

// Registration schema
const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  role: Joi.string().valid("admin", "user", "customer").required(),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/),
  businessName: Joi.string().required(),
  businessType: Joi.string().required(),
  gstNumber: Joi.string().required(),
  address: Joi.string().required(),
  // gstNumber: Joi.string().pattern(
  //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  // ),
  // address: Joi.object({
  //   street: Joi.string().required(),
  //   city: Joi.string().required(),
  //   state: Joi.string().required(),
  //   pincode: Joi.string().required().pattern(/^[0-9]{6}$/),
  //   country: Joi.string().required()
  // }).required()
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Change password schema
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(8),
});

// Reset password schemas
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().required().min(8),
});

const verifyResetTokenSchema = Joi.object({
  token: Joi.string().required(),
});

// Profile update schema
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  businessName: Joi.string(),
  businessType: Joi.string(),
  address: Joi.string(),
  gstNumber: Joi.string(),
  // gstNumber: Joi.string().pattern(
  //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  // ),
  // address: Joi.object({
  //   street: Joi.string(),
  //   city: Joi.string(),
  //   state: Joi.string(),
  //   pincode: Joi.string().pattern(/^[0-9]{6}$/),
  //   country: Joi.string(),
  // }),
});

// OTP schemas
const sendOTPSchema = Joi.object({
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/),
});

const verifyOTPSchema = Joi.object({
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]{10}$/),
  otp: Joi.string()
    .required()
    .pattern(/^[0-9]{6}$/),
});

// Email verification schema
const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

// 2FA schema
const toggle2FASchema = Joi.object({
  enable: Joi.boolean().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  verifyResetTokenSchema,
  updateProfileSchema,
  sendOTPSchema,
  verifyOTPSchema,
  verifyEmailSchema,
  toggle2FASchema,
};
