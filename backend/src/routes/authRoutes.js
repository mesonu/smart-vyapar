const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
// const { loginSchema, registerSchema, passwordSchema } = require('../validations/auth/index');
const {
    loginSchema,
    registerSchema,
    passwordSchema,
    resetPasswordSchema,
    verifyResetTokenSchema,
    sendOTPSchema,
    verifyOTPSchema,
    verifyEmailSchema,
    changePasswordSchema,
    updateProfileSchema,
    toggle2FASchema
} = require('../validations/auth/auth');

const {
    // Auth middleware
    auth,
    checkRole,
    checkOwnership,
    checkPermission,
    ROLES,

    // Validation middleware
    validateRequest,
    validateParams,
    validateQuery,

    // Error handling
    errorHandler,
    AppError  
} = require('../middleware/index');

// Create an instance of AuthController
const authController = new AuthController();

// Public routes
router.post('/register', validateRequest(registerSchema), (req, res) => authController.register(req, res));
router.post('/login', validateRequest(loginSchema), (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/me', (req, res) => authController.getCurrentUser(req, res));

// Password reset routes
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', validateRequest(resetPasswordSchema), (req, res) => authController.resetPassword(req, res));
router.post('/verify-reset-token', validateRequest(verifyResetTokenSchema), (req, res) => authController.verifyResetToken(req, res));

// OTP routes
router.post('/send-otp', validateRequest(sendOTPSchema), (req, res) => authController.sendOTP(req, res));
router.post('/verify-otp', validateRequest(verifyOTPSchema), (req, res) => authController.verifyOTP(req, res));

// Email verification routes
router.post('/send-verification-email', (req, res) => authController.sendVerificationEmail(req, res));
router.post('/verify-email', validateRequest(verifyEmailSchema), (req, res) => authController.verifyEmail(req, res));

// Protected routes
router.use(auth); // Add authentication middleware first
router.use(checkRole([ROLES.ADMIN, ROLES.USER])); // Then check role

router.post('/change-password', validateRequest(changePasswordSchema), (req, res) => authController.changePassword(req, res));
router.get('/profile', (req, res) => authController.getProfile(req, res));
router.put('/profile', validateRequest(updateProfileSchema), (req, res) => authController.updateProfile(req, res));

// 2FA routes (admin only)
router.post('/2fa/:userId', checkRole([ROLES.ADMIN]), validateRequest(toggle2FASchema), (req, res) => authController.toggle2FA(req, res));

module.exports = router; 