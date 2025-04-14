const express = require('express');
const router = express.Router();
const { validateRequest, validateParams, validateQuery } = require('../middleware');
const { checkRole, checkOwnership, ROLES } = require('../middleware');
const productController = require('../controllers/ProductController');
const productVariantController = require('../controllers/ProductVariantController');

const {
  createProductSchema,
  updateProductSchema,
  productQuerySchema
} = require('../validations/product/product');
const {
  createVariantSchema,
  updateVariantSchema,
  variantIdSchema,
  variantQuerySchema
} = require('../validations/product/variant');
const {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
  reviewQuerySchema
} = require('../validations/product/review');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - unit
 *         - purchasePrice
 *         - sellingPrice
 *         - stockQuantity
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         sku:
 *           type: string
 *           description: The SKU of the product
 *         barcode:
 *           type: string
 *           description: The barcode of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         category:
 *           type: string
 *           description: The category of the product
 *         unit:
 *           type: string
 *           description: The unit of measurement
 *         purchasePrice:
 *           type: number
 *           description: The purchase price of the product
 *         sellingPrice:
 *           type: number
 *           description: The selling price of the product
 *         stockQuantity:
 *           type: number
 *           description: The current stock quantity
 *         minStockLevel:
 *           type: number
 *           description: The minimum stock level
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: The status of the product
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name, SKU, or barcode
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *       - in: query
 *         name: minStock
 *         schema:
 *           type: number
 *         description: Filter by minimum stock level
 *       - in: query
 *         name: maxStock
 *         schema:
 *           type: number
 *         description: Filter by maximum stock level
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
// router.get('/', 
//     validateQuery(productQuerySchema),
//     productController.getAll
// );

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
// router.post('/',
//     checkRole([ROLES.ADMIN, ROLES.MANAGER]),
//     validateRequest(createProductSchema),
//     productController.create
// );

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
// router.get('/:productId',
//     productController.getById
// );

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
// router.put('/:productId',
//     checkRole([ROLES.ADMIN, ROLES.MANAGER]),
//     validateRequest(updateProductSchema),
//     productController.update
// );

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 */
// router.delete('/:productId',
//     checkRole([ROLES.ADMIN]),
//     productController.delete
// );

/**
 * @swagger
 * /api/products/stats:
 *   get:
 *     summary: Get product statistics
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                 activeProducts:
 *                   type: integer
 *                 lowStockProducts:
 *                   type: integer
 *                 totalStockValue:
 *                   type: number
 *                 totalStockQuantity:
 *                   type: number
 */
// router.get('/stats', productController.getProductStats);

/**
 * @swagger
 * /api/products/low-stock:
 *   get:
 *     summary: Get products with low stock
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products with low stock
 *         content:
 *           application/json:
 *             schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Product'
 */
//router.get('/low-stock', productController.getLowStockProducts);

/**
 * @swagger
 * /api/products/{id}/stock:
 *   put:
 *     summary: Update product stock
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - type
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Quantity to add or remove
 *               type:
 *                 type: string
 *                 enum: [add, remove]
 *                 description: Type of stock update
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
//router.put('/:id/stock', validateRequest(productIdSchema), validateRequest(stockUpdateSchema), productController.updateProductStock);

/**
 * @swagger
 * /api/products/bulk:
 *   post:
 *     summary: Create multiple products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Products created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
//router.post('/bulk', validateRequest(bulkProductsSchema), productController.bulkCreateProducts);

/**
 * @swagger
 * /api/products/bulk:
 *   put:
 *     summary: Update multiple products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 stock:
 *                   type: number
 *     responses:
 *       200:
 *         description: Products updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
// router.put('/bulk', validateRequest(bulkProductsSchema), productController.bulkUpdateProducts);

/**
 * @swagger
 * /api/products/bulk/stock:
 *   put:
 *     summary: Update stock for multiple products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - productId
 *                 - quantity
 *                 - type
 *               properties:
 *                 productId:
 *                   type: integer
 *                 quantity:
 *                   type: number
 *                 type:
 *                   type: string
 *                   enum: [add, remove]
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
// router.put('/bulk/stock', validateRequest(bulkProductsSchema), productController.bulkUpdateStock);

// Product variant routes
router.post('/:productId/variants',
    checkRole([ROLES.ADMIN, ROLES.MANAGER]),
    validateRequest(createVariantSchema),
    productVariantController.createVariant
);

router.get('/:productId/variants',
    validateQuery(variantQuerySchema),
    productVariantController.getProductVariants
);

router.get('/variants/:variantId',
    validateParams(variantIdSchema),
    productVariantController.getVariantById
);

router.put('/variants/:variantId',
    checkRole([ROLES.ADMIN, ROLES.MANAGER]),
    validateParams(variantIdSchema),
    validateRequest(updateVariantSchema),
    productVariantController.updateVariant
);

router.delete('/variants/:variantId',
    checkRole([ROLES.ADMIN]),
    validateParams(variantIdSchema),
    productVariantController.deleteVariant
);

router.put('/variants/:variantId/status',
    checkRole([ROLES.ADMIN, ROLES.MANAGER]),
    validateParams(variantIdSchema),
    validateRequest(updateVariantSchema),
    productVariantController.updateVariantStatus
);

// // Product reviews routes
// router.post('/:productId/reviews',
//     validateParams(productIdSchema),
//     validateRequest(createReviewSchema),
//     productController.createReview
// );

// router.get('/:productId/reviews',
//     validateParams(productIdSchema),
//     validateQuery(reviewQuerySchema),
//     productController.getProductReviews
// );

// router.put('/:productId/reviews/:reviewId',
//     validateParams({ ...productIdSchema, ...reviewIdSchema }),
//     validateRequest(updateReviewSchema),
//     productController.updateReview
// );

// router.delete('/:productId/reviews/:reviewId',
//     validateParams({ ...productIdSchema, ...reviewIdSchema }),
//     productController.deleteReview
// );

// // Product categories routes
// router.get('/:productId/categories',
//     validateParams(productIdSchema),
//     productController.getProductCategories
// );

// // Product tags routes
// router.get('/:productId/tags',
//     validateParams(productIdSchema),
//     productController.getProductTags
// );

// // Product promotions routes
// router.get('/:productId/promotions',
//     validateParams(productIdSchema),
//     productController.getProductPromotions
// );

module.exports = router; 