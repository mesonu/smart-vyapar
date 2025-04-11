const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const promotionScheduleController = require('../controllers/promotionScheduleController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation middleware
const scheduleValidationRules = [
  body('template_id').isInt().withMessage('Template ID is required'),
  body('start_date').isISO8601().withMessage('Invalid start date'),
  body('end_date').isISO8601().withMessage('Invalid end date'),
  body('end_date').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.start_date)) {
      throw new Error('End date must be after start date');
    }
    return true;
  })
];

const scheduleIdValidation = [
  param('id').isInt().withMessage('Invalid schedule ID')
];

// Routes
router.get('/', promotionScheduleController.getAllSchedules);
router.get('/:id', scheduleIdValidation, promotionScheduleController.getScheduleById);
router.post('/', scheduleValidationRules, promotionScheduleController.createSchedule);
router.put('/:id', [...scheduleIdValidation, ...scheduleValidationRules], promotionScheduleController.updateSchedule);
router.delete('/:id', scheduleIdValidation, promotionScheduleController.deleteSchedule);
router.post('/:id/cancel', scheduleIdValidation, promotionScheduleController.cancelSchedule);

module.exports = router; 