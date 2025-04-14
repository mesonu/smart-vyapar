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



// Public routes
router.post('/register', validateRequest(registerSchema), (req, res) => AuthController.register(req, res));
router.post('/login', validateRequest(loginSchema), (req, res) => AuthController.login(req, res));
router.post('/logout', (req, res) => AuthController.logout(req, res));
router.get('/me', (req, res) => AuthController.getCurrentUser(req, res));

// Password reset routes
router.post('/forgot-password', (req, res) => AuthController.forgotPassword(req, res));
router.post('/reset-password', validateRequest(resetPasswordSchema), (req, res) => AuthController.resetPassword(req, res));
router.post('/verify-reset-token', validateRequest(verifyResetTokenSchema), (req, res) => AuthController.verifyResetToken(req, res));

// OTP routes
router.post('/send-otp', validateRequest(sendOTPSchema), (req, res) => AuthController.sendOTP(req, res));
router.post('/verify-otp', validateRequest(verifyOTPSchema), (req, res) => AuthController.verifyOTP(req, res));

// Email verification routes
router.post('/send-verification-email', (req, res) => AuthController.sendVerificationEmail(req, res));
router.post('/verify-email', validateRequest(verifyEmailSchema), (req, res) => AuthController.verifyEmail(req, res));

// Protected routes
router.use(auth); // Add authentication middleware first
router.use(checkRole([ROLES.ADMIN, ROLES.USER])); // Then check role

router.post('/change-password', validateRequest(changePasswordSchema), (req, res) => AuthController.changePassword(req, res));
router.get('/profile', (req, res) => AuthController.getProfile(req, res));
router.put('/profile', validateRequest(updateProfileSchema), (req, res) => AuthController.updateProfile(req, res));

// 2FA routes (admin only)
router.post('/2fa/:userId', checkRole([ROLES.ADMIN]), validateRequest(toggle2FASchema), (req, res) => AuthController.toggle2FA(req, res));

module.exports = router; 