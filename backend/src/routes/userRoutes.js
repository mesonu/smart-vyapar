const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validateRequest } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
// const {
//   registerSchema,
//   loginSchema,
//   updateProfileSchema,
//   changePasswordSchema,
//   userIdSchema
// } = require('../../../bkp/userValidation');

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
// router.post('/register', validateRequest(registerSchema), (req, res) => authController.register(req, res));
// router.post('/login', validateRequest(loginSchema), (req, res) => authController.login(req, res));

// Protected routes
// router.use(auth);
router.get('/profile', (req, res) => AuthController.getProfile(req, res));
// router.put('/profile', validateRequest(updateProfileSchema), (req, res) => AuthController.updateProfile(req, res));
// router.post('/change-password', validateRequest(changePasswordSchema), (req, res) => AuthController.changePassword(req, res));

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
// router.get('/', (req, res) => AuthController.getAllUsers(req, res));

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
// router.get('/:id', validateRequest(userIdSchema), (req, res) => AuthController.getUserById(req, res));

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
router.post('/', AuthController.register);

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
// router.put('/:id', validateRequest(userIdSchema), validateRequest(updateProfileSchema), (req, res) => AuthController.updateUser(req, res));

// router.delete('/:id', validateRequest(userIdSchema), (req, res) => AuthController.deleteUser(req, res));

module.exports = router; 