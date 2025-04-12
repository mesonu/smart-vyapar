const Joi = require('joi');

const createBatchSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  batch_number: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  manufacturing_date: Joi.date().allow(null),
  expiry_date: Joi.date().allow(null),
  purchase_price: Joi.number().positive().required(),
  selling_price: Joi.number().positive().required(),
  notes: Joi.string().allow('', null)
});

const updateBatchSchema = Joi.object({
  quantity: Joi.number().positive().required(),
  type: Joi.string().valid('add', 'remove').required()
});

const batchIdSchema = Joi.object({
  batch_id: Joi.number().integer().required()
});

const alertIdSchema = Joi.object({
  alert_id: Joi.number().integer().required()
});

module.exports = {
  createBatchSchema,
  updateBatchSchema,
  batchIdSchema,
  alertIdSchema
}; 