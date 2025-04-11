const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { validateRequest } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  userIdSchema
} = require('../validations/userValidation');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         role:
 *           type: string
 *           description: The user's role
 *         phone:
 *           type: string
 *           description: The user's phone
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: The user's status
 */

// Public routes
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);

// Protected routes
// router.use(auth);
router.get('/profile', authController.getProfile);
router.put('/profile', validateRequest(updateProfileSchema), authController.updateProfile);
router.post('/change-password', validateRequest(changePasswordSchema), authController.changePassword);

// /**
//  * @swagger
//  * /api/users:
//  *   get:
//  *     summary: Returns the list of all users
//  *     tags: [Users]
//  *     responses:
//  *       200:
//  *         description: The list of users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/User'
//  */
// router.get('/', authController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */
// router.get('/:id', validateRequest(userIdSchema), authController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.post('/', authController.register);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some error happened
 */
// router.put('/:id', validateRequest(userIdSchema), validateRequest(updateProfileSchema), authController.updateUser);

// router.delete('/:id', validateRequest(userIdSchema), authController.deleteUser);

module.exports = router; 