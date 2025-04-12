const { Product, InventoryBatch, InventoryAlert, User } = require('../models');
const BaseController = require('./BaseController');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class InventoryController extends BaseController {
  constructor() {
    super(InventoryBatch);
  }

  // Create a new inventory batch
  createBatch = async (req, res) => {
    try {
      const { product_id, batch_number, quantity, manufacturing_date, expiry_date, purchase_price, selling_price, notes } = req.body;
      const created_by = req.user.id;

      const product = await Product.findByPk(product_id);
      if (!product) {
        return this.ResponseHandler.notFound(res, 'Product not found');
      }

      const batch = await InventoryBatch.create({
        product_id,
        batch_number,
        quantity,
        remaining_quantity: quantity,
        manufacturing_date,
        expiry_date,
        purchase_price,
        selling_price,
        notes,
        created_by
      });

      // Update product stock
      await product.increment('stock_quantity', { by: quantity });

      // Check for alerts
      await this._checkAlerts(product_id, batch.id);

      logger.info('Inventory batch created successfully', { batchId: batch.id });
      return this.ResponseHandler.created(res, batch, 'Inventory batch created successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  // Get all batches for a product
  getProductBatches = async (req, res) => {
    try {
      const { product_id } = req.params;
      const { status, include_expired } = req.query;

      const where = { product_id };
      if (status) where.status = status;
      if (include_expired !== 'true') {
        where[Op.or] = [
          { expiry_date: { [Op.gt]: new Date() } },
          { expiry_date: null }
        ];
      }

      const batches = await InventoryBatch.findAll({
        where,
        include: [
          { model: Product, as: 'product' },
          { model: User, as: 'creator' }
        ],
        order: [['expiry_date', 'ASC']]
      });

      return this.ResponseHandler.success(res, batches);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  // Update batch quantity
  updateBatchQuantity = async (req, res) => {
    try {
      const { batch_id } = req.params;
      const { quantity, type } = req.body;

      const batch = await InventoryBatch.findByPk(batch_id);
      if (!batch) {
        return this.ResponseHandler.notFound(res, 'Batch not found');
      }

      if (type === 'add') {
        batch.quantity += quantity;
        batch.remaining_quantity += quantity;
      } else if (type === 'remove') {
        if (batch.remaining_quantity < quantity) {
          return this.ResponseHandler.badRequest(res, 'Insufficient quantity');
        }
        batch.remaining_quantity -= quantity;
      }

      await batch.save();

      // Update product stock
      const product = await Product.findByPk(batch.product_id);
      if (type === 'add') {
        await product.increment('stock_quantity', { by: quantity });
      } else {
        await product.decrement('stock_quantity', { by: quantity });
      }

      // Check for alerts
      await this._checkAlerts(batch.product_id, batch.id);

      logger.info('Batch quantity updated successfully', { batchId: batch.id });
      return this.ResponseHandler.success(res, batch, 'Batch quantity updated successfully');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  // Get active alerts
  getAlerts = async (req, res) => {
    try {
      const { type, status, severity } = req.query;

      const where = {};
      if (type) where.alert_type = type;
      if (status) where.status = status;
      if (severity) where.severity = severity;

      const alerts = await InventoryAlert.findAll({
        where,
        include: [
          { model: Product, as: 'product' },
          { model: InventoryBatch, as: 'batch' },
          { model: User, as: 'creator' }
        ],
        order: [['created_at', 'DESC']]
      });

      return this.ResponseHandler.success(res, alerts);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  // Acknowledge alert
  acknowledgeAlert = async (req, res) => {
    try {
      const { alert_id } = req.params;

      const alert = await InventoryAlert.findByPk(alert_id);
      if (!alert) {
        return this.ResponseHandler.notFound(res, 'Alert not found');
      }

      alert.status = 'acknowledged';
      await alert.save();

      logger.info('Alert acknowledged', { alertId: alert.id });
      return this.ResponseHandler.success(res, alert, 'Alert acknowledged');
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  // Private method to check and create alerts
  _checkAlerts = async (product_id, batch_id = null) => {
    const product = await Product.findByPk(product_id);
    if (!product) return;

    // Check low stock alert
    if (product.min_stock_level && product.stock_quantity <= product.min_stock_level) {
      await this._createAlert({
        product_id,
        batch_id,
        alert_type: 'low_stock',
        severity: product.stock_quantity <= product.reorder_point ? 'critical' : 'high',
        message: `Low stock alert: ${product.name} has ${product.stock_quantity} units remaining`
      });
    }

    // Check expiry alert for batches
    if (batch_id) {
      const batch = await InventoryBatch.findByPk(batch_id);
      if (batch && batch.expiry_date && product.has_expiry) {
        const daysUntilExpiry = Math.ceil((batch.expiry_date - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= product.expiry_alert_days) {
          await this._createAlert({
            product_id,
            batch_id,
            alert_type: 'expiry',
            severity: daysUntilExpiry <= 7 ? 'critical' : 'high',
            message: `Expiry alert: Batch ${batch.batch_number} of ${product.name} expires in ${daysUntilExpiry} days`
          });
        }
      }
    }
  };

  // Private method to create alerts
  _createAlert = async (alertData) => {
    const existingAlert = await InventoryAlert.findOne({
      where: {
        product_id: alertData.product_id,
        batch_id: alertData.batch_id,
        alert_type: alertData.alert_type,
        status: 'active'
      }
    });

    if (!existingAlert) {
      await InventoryAlert.create({
        ...alertData,
        created_by: 1 // System user
      });
    }
  };
}

module.exports = new InventoryController(); 