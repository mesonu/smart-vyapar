const { Op } = require('sequelize');
const { Promotion, Customer, Product, PromotionHistory, Invoice, InvoiceItem } = require('../models');
const whatsappService = require('../services/whatsappService');
const sequelize = require('sequelize');
const promotionAnalyticsService = require('../services/promotionAnalyticsService');
const promotionNotificationService = require('../services/promotionNotificationService');

exports.getAllPromotions = async (req, res) => {
  try {
    const { 
      is_active, 
      start_date, 
      end_date, 
      search,
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    
    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    if (start_date) {
      where.start_date = { [Op.gte]: new Date(start_date) };
    }

    if (end_date) {
      where.end_date = { [Op.lte]: new Date(end_date) };
    }

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const promotions = await Promotion.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: 'products',
          through: { attributes: [] }
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      data: promotions.rows,
      pagination: {
        total: promotions.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(promotions.count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'products',
          through: { attributes: [] }
        },
        {
          model: PromotionHistory,
          as: 'history',
          include: ['user']
        }
      ]
    });

    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create({
      ...req.body,
      user_id: req.user.id
    });

    if (req.body.product_ids) {
      await promotion.setProducts(req.body.product_ids);
    }

    // Send notification
    await promotionNotificationService.notifyPromotionCreated(promotion);

    res.status(201).json(promotion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    await promotion.update(req.body);

    if (req.body.product_ids) {
      await promotion.setProducts(req.body.product_ids);
    }

    // Check if promotion is expiring soon
    const daysUntilExpiry = Math.ceil((promotion.end_date - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 7) {
      await promotionNotificationService.notifyPromotionExpiring(promotion);
    }

    res.json(promotion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    await promotion.destroy({
      userId: req.user.id
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.togglePromotionStatus = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    await promotion.update({
      is_active: !promotion.is_active
    }, {
      userId: req.user.id
    });

    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromotionHistory = async (req, res) => {
  try {
    const history = await PromotionHistory.findAll({
      where: { promotion_id: req.params.id },
      include: ['user'],
      order: [['created_at', 'DESC']]
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendPromotionalMessage = async (req, res) => {
  try {
    const { message, customerIds } = req.body;
    const where = { userId: req.user.id };

    if (customerIds && customerIds.length > 0) {
      where.id = {
        [Op.in]: customerIds
      };
    }

    const customers = await Customer.findAll({ where });

    const results = await Promise.allSettled(
      customers.map(customer => 
        whatsappService.sendPromotionalMessage(customer, message)
      )
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failedCount = results.filter(r => r.status === 'rejected').length;

    res.json({
      message: 'Promotional messages sent',
      total: customers.length,
      success: successCount,
      failed: failedCount
    });
  } catch (error) {
    res.status(400).json({ message: 'Error sending promotional messages', error: error.message });
  }
};

exports.getPromotionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { userId: req.user.id };

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const customers = await Customer.findAll({ where });

    res.json({
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.isActive).length,
      creditCustomers: customers.filter(c => c.creditLimit > 0).length,
      totalOutstanding: customers.reduce((sum, c) => sum + c.outstandingBalance, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching promotion stats', error: error.message });
  }
};

// Get promotion analytics
exports.getPromotionAnalytics = async (req, res) => {
  try {
    const analytics = await promotionAnalyticsService.getPromotionAnalytics(req.params.id);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get promotion usage by product
exports.getPromotionProductUsage = async (req, res) => {
  try {
    const { promotion_id } = req.params;
    const usage = await Product.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('invoice_items.id')), 'times_used'],
        [sequelize.fn('SUM', sequelize.col('invoice_items.quantity')), 'total_quantity'],
        [sequelize.fn('SUM', sequelize.col('invoice_items.total')), 'total_revenue']
      ],
      include: [{
        model: InvoiceItem,
        as: 'invoice_items',
        where: { promotion_id },
        attributes: []
      }],
      group: ['Product.id']
    });

    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active promotions for a product
exports.getActivePromotionsForProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const promotions = await Promotion.findAll({
      where: {
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { [Op.gte]: new Date() }
      },
      include: [{
        model: Product,
        as: 'products',
        where: { id: product_id },
        through: { attributes: [] }
      }]
    });

    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validate promotion code
exports.validatePromotionCode = async (req, res) => {
  try {
    const { code, product_ids, total_amount } = req.body;
    
    const promotion = await Promotion.findOne({
      where: {
        code,
        is_active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { [Op.gte]: new Date() }
      },
      include: [{
        model: Product,
        as: 'products',
        where: { id: { [Op.in]: product_ids } },
        through: { attributes: [] }
      }]
    });

    if (!promotion) {
      return res.status(404).json({ error: 'Invalid or expired promotion code' });
    }

    // Check minimum purchase amount
    if (promotion.min_purchase_amount && total_amount < promotion.min_purchase_amount) {
      return res.status(400).json({ 
        error: `Minimum purchase amount of ${promotion.min_purchase_amount} required` 
      });
    }

    // Calculate discount
    let discount_amount = 0;
    if (promotion.discount_type === 'percentage') {
      discount_amount = (total_amount * promotion.discount_value) / 100;
    } else {
      discount_amount = promotion.discount_value;
    }

    // Apply maximum discount limit
    if (promotion.max_discount_amount && discount_amount > promotion.max_discount_amount) {
      discount_amount = promotion.max_discount_amount;
    }

    res.json({
      valid: true,
      promotion,
      discount_amount,
      final_amount: total_amount - discount_amount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerSegments = async (req, res) => {
  try {
    const segments = await promotionAnalyticsService.getCustomerSegments(req.params.id);
    res.json(segments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTimeBasedAnalysis = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    const analysis = await promotionAnalyticsService.getTimeBasedAnalysis(req.params.id, period);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductPerformance = async (req, res) => {
  try {
    const performance = await promotionAnalyticsService.getProductPerformance(req.params.id);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromotionEffectiveness = async (req, res) => {
  try {
    const effectiveness = await promotionAnalyticsService.getPromotionEffectiveness(req.params.id);
    res.json(effectiveness);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompetitorAnalysis = async (req, res) => {
  try {
    const analysis = await promotionAnalyticsService.getCompetitorAnalysis(req.params.id);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMarketTrends = async (req, res) => {
  try {
    const { category, period = 'week' } = req.query;
    const trends = await promotionAnalyticsService.getMarketTrends(category, period);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromotionImpact = async (req, res) => {
  try {
    const impact = await promotionAnalyticsService.getPromotionImpact(req.params.id);
    res.json(impact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromotionROI = async (req, res) => {
  try {
    const roi = await promotionAnalyticsService.getPromotionROI(req.params.id);
    res.json(roi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 