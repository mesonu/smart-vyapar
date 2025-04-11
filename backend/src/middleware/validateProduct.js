const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().max(1000),
  sku: Joi.string().max(50),
  barcode: Joi.string().max(50),
  category: Joi.string().max(50),
  unit: Joi.string().required().max(20),
  purchasePrice: Joi.number().required().min(0),
  sellingPrice: Joi.number().required().min(0),
  mrp: Joi.number().min(0),
  taxRate: Joi.number().min(0).max(100),
  hsnCode: Joi.string().max(20),
  stockQuantity: Joi.number().required().min(0),
  minStockLevel: Joi.number().min(0),
  maxStockLevel: Joi.number().min(0),
  reorderPoint: Joi.number().min(0),
  manufacturer: Joi.string().max(100),
  brand: Joi.string().max(100),
  status: Joi.string().valid('active', 'inactive', 'discontinued'),
  images: Joi.array().items(Joi.string()),
  specifications: Joi.object(),
  notes: Joi.string().max(500)
});

const stockUpdateSchema = Joi.object({
  quantity: Joi.number().required().min(0),
  type: Joi.string().required().valid('add', 'remove')
});

const bulkProductSchema = Joi.array().items(productSchema).min(1).max(100);

const bulkStockUpdateSchema = Joi.array().items(
  Joi.object({
    productId: Joi.number().required(),
    quantity: Joi.number().required().min(0),
    type: Joi.string().required().valid('add', 'remove')
  })
).min(1).max(100);

const categorySchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  description: Joi.string().max(500)
});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateStockUpdate = (req, res, next) => {
  const { error } = stockUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateBulkProducts = (req, res, next) => {
  const { error } = bulkProductSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateBulkStockUpdate = (req, res, next) => {
  const { error } = bulkStockUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateProduct,
  validateStockUpdate,
  validateBulkProducts,
  validateBulkStockUpdate,
  validateCategory
}; 