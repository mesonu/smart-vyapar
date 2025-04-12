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

// Routes
router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
// router.post('/logout', AuthController.logout);
// router.get('/me', AuthController.getCurrentUser);

// Public routes
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), AuthController.resetPassword);
router.post('/verify-reset-token', validateRequest(verifyResetTokenSchema), AuthController.verifyResetToken);

// OTP routes
router.post('/send-otp', validateRequest(sendOTPSchema), AuthController.sendOTP);
router.post('/verify-otp', validateRequest(verifyOTPSchema), AuthController.verifyOTP);

// Email verification routes
router.post('/send-verification-email', AuthController.sendVerificationEmail);
router.post('/verify-email', validateRequest(verifyEmailSchema), AuthController.verifyEmail);

// Protected routes
router.use(checkRole([ROLES.ADMIN, ROLES.USER]));

router.post('/change-password', validateRequest(changePasswordSchema), AuthController.changePassword);
router.get('/profile', AuthController.getProfile);
router.put('/profile', validateRequest(updateProfileSchema), AuthController.updateProfile);

// 2FA routes (admin only)
router.post('/2fa/:userId', checkRole([ROLES.ADMIN]), validateRequest(toggle2FASchema), AuthController.toggle2FA);

module.exports = router; 