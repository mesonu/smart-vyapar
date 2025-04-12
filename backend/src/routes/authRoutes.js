const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { loginSchema, registerSchema, passwordSchema } = require('../validations/auth/index');
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

module.exports = router; 