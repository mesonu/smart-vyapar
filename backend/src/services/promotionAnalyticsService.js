const { Promotion, Invoice, InvoiceItem, Customer, Product } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

class PromotionAnalyticsService {
  async getPromotionAnalytics(promotionId) {
    const promotion = await Promotion.findByPk(promotionId, {
      include: [
        {
          model: Product,
          as: 'products',
          through: { attributes: [] }
        }
      ]
    });

    if (!promotion) {
      throw new Error('Promotion not found');
    }

    // Get basic analytics
    const analytics = {
      promotion: promotion,
      totalSales: await this.getTotalSales(promotionId),
      customerCount: await this.getCustomerCount(promotionId),
      productPerformance: await this.getProductPerformance(promotionId),
      timeBasedAnalysis: await this.getTimeBasedAnalysis(promotionId),
      roi: await this.calculateROI(promotionId)
    };

    return analytics;
  }

  async getCustomerSegments(promotionId) {
    const customers = await Customer.findAll({
      include: [
        {
          model: Invoice,
          where: { promotion_id: promotionId },
          include: [
            {
              model: InvoiceItem,
              include: [Product]
            }
          ]
        }
      ]
    });

    // Segment customers based on purchase behavior
    const segments = {
      highValue: customers.filter(c => c.totalSpent > 1000),
      mediumValue: customers.filter(c => c.totalSpent > 500 && c.totalSpent <= 1000),
      lowValue: customers.filter(c => c.totalSpent <= 500),
      frequent: customers.filter(c => c.purchaseCount > 5),
      occasional: customers.filter(c => c.purchaseCount <= 5)
    };

    return segments;
  }

  async getTimeBasedAnalysis(promotionId, period = 'daily') {
    const invoices = await Invoice.findAll({
      where: { promotion_id: promotionId },
      include: [InvoiceItem],
      order: [['created_at', 'ASC']]
    });

    // Group by time period
    const analysis = {};
    invoices.forEach(invoice => {
      const date = new Date(invoice.created_at);
      let key;
      
      if (period === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (period === 'weekly') {
        key = `${date.getFullYear()}-W${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
      } else if (period === 'monthly') {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      }

      if (!analysis[key]) {
        analysis[key] = {
          totalSales: 0,
          orderCount: 0,
          averageOrderValue: 0
        };
      }

      analysis[key].totalSales += invoice.total_amount;
      analysis[key].orderCount += 1;
      analysis[key].averageOrderValue = analysis[key].totalSales / analysis[key].orderCount;
    });

    return analysis;
  }

  async getProductPerformance(promotionId) {
    const products = await Product.findAll({
      include: [
        {
          model: InvoiceItem,
          include: [
            {
              model: Invoice,
              where: { promotion_id: promotionId }
            }
          ]
        }
      ]
    });

    const performance = products.map(product => ({
      productId: product.id,
      name: product.name,
      totalSales: product.invoice_items.reduce((sum, item) => sum + item.total, 0),
      quantitySold: product.invoice_items.reduce((sum, item) => sum + item.quantity, 0),
      averagePrice: product.invoice_items.reduce((sum, item) => sum + item.unit_price, 0) / product.invoice_items.length
    }));

    return performance;
  }

  async getPromotionEffectiveness(promotionId) {
    const promotion = await Promotion.findByPk(promotionId);
    const invoices = await Invoice.findAll({
      where: { promotion_id: promotionId },
      include: [InvoiceItem]
    });

    const effectiveness = {
      totalRevenue: invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0),
      totalOrders: invoices.length,
      averageOrderValue: invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0) / invoices.length,
      conversionRate: await this.calculateConversionRate(promotionId),
      customerRetention: await this.calculateCustomerRetention(promotionId)
    };

    return effectiveness;
  }

  async getCompetitorAnalysis(promotionId) {
    // This would typically integrate with external market data
    // For now, returning mock data
    return {
      marketShare: 0.15,
      competitorPromotions: [
        {
          name: 'Competitor Promotion 1',
          discount: 20,
          duration: 7
        },
        {
          name: 'Competitor Promotion 2',
          discount: 15,
          duration: 14
        }
      ],
      priceComparison: {
        ourPrice: 100,
        competitorPrice: 95
      }
    };
  }

  async getMarketTrends(category, period = 'week') {
    // This would typically integrate with external market data
    // For now, returning mock data
    return {
      category: category,
      period: period,
      trends: {
        priceTrend: 'stable',
        demandTrend: 'increasing',
        competitorActivity: 'high'
      },
      recommendations: [
        'Consider increasing promotion duration',
        'Adjust pricing strategy',
        'Target specific customer segments'
      ]
    };
  }

  async getPromotionImpact(promotionId) {
    const promotion = await Promotion.findByPk(promotionId);
    const invoices = await Invoice.findAll({
      where: { promotion_id: promotionId },
      include: [InvoiceItem]
    });

    const impact = {
      financial: {
        totalRevenue: invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0),
        totalDiscount: invoices.reduce((sum, invoice) => sum + (invoice.discount_amount || 0), 0),
        netRevenue: invoices.reduce((sum, invoice) => sum + invoice.total_amount - (invoice.discount_amount || 0), 0)
      },
      customer: {
        newCustomers: await this.getNewCustomers(promotionId),
        returningCustomers: await this.getReturningCustomers(promotionId),
        customerSatisfaction: await this.calculateCustomerSatisfaction(promotionId)
      },
      product: {
        topProducts: await this.getTopProducts(promotionId),
        inventoryImpact: await this.calculateInventoryImpact(promotionId)
      }
    };

    return impact;
  }

  async getPromotionROI(promotionId) {
    const promotion = await Promotion.findByPk(promotionId);
    const invoices = await Invoice.findAll({
      where: { promotion_id: promotionId },
      include: [InvoiceItem]
    });

    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);
    const totalCost = promotion.cost || 0;
    const totalDiscount = invoices.reduce((sum, invoice) => sum + (invoice.discount_amount || 0), 0);

    const roi = {
      investment: totalCost,
      revenue: totalRevenue,
      discount: totalDiscount,
      netProfit: totalRevenue - totalCost - totalDiscount,
      roiPercentage: ((totalRevenue - totalCost - totalDiscount) / totalCost) * 100
    };

    return roi;
  }

  // Helper methods
  async getTotalSales(promotionId) {
    const result = await Invoice.sum('total_amount', {
      where: { promotion_id: promotionId }
    });
    return result || 0;
  }

  async getCustomerCount(promotionId) {
    const result = await Invoice.count({
      where: { promotion_id: promotionId },
      distinct: true,
      col: 'customer_id'
    });
    return result;
  }

  async calculateROI(promotionId) {
    const totalSales = await this.getTotalSales(promotionId);
    const promotion = await Promotion.findByPk(promotionId);
    const cost = promotion.cost || 0;

    return {
      investment: cost,
      return: totalSales,
      roi: cost > 0 ? (totalSales - cost) / cost : 0
    };
  }

  async calculateConversionRate(promotionId) {
    const totalViews = 1000; // This would come from analytics
    const totalOrders = await Invoice.count({
      where: { promotion_id: promotionId }
    });

    return totalViews > 0 ? (totalOrders / totalViews) * 100 : 0;
  }

  async calculateCustomerRetention(promotionId) {
    const customers = await Customer.findAll({
      include: [
        {
          model: Invoice,
          where: { promotion_id: promotionId }
        }
      ]
    });

    const returningCustomers = customers.filter(c => c.invoices.length > 1).length;
    return customers.length > 0 ? (returningCustomers / customers.length) * 100 : 0;
  }

  async getNewCustomers(promotionId) {
    return await Customer.count({
      include: [
        {
          model: Invoice,
          where: { promotion_id: promotionId }
        }
      ],
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
  }

  async getReturningCustomers(promotionId) {
    const customers = await Customer.findAll({
      include: [
        {
          model: Invoice,
          where: { promotion_id: promotionId }
        }
      ]
    });

    return customers.filter(c => c.invoices.length > 1).length;
  }

  async calculateCustomerSatisfaction(promotionId) {
    // This would typically come from customer feedback
    return 85; // Mock data
  }

  async getTopProducts(promotionId) {
    const products = await Product.findAll({
      include: [
        {
          model: InvoiceItem,
          include: [
            {
              model: Invoice,
              where: { promotion_id: promotionId }
            }
          ]
        }
      ]
    });

    return products
      .map(product => ({
        id: product.id,
        name: product.name,
        sales: product.invoice_items.reduce((sum, item) => sum + item.total, 0)
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }

  async calculateInventoryImpact(promotionId) {
    const products = await Product.findAll({
      include: [
        {
          model: InvoiceItem,
          include: [
            {
              model: Invoice,
              where: { promotion_id: promotionId }
            }
          ]
        }
      ]
    });

    return products.map(product => ({
      id: product.id,
      name: product.name,
      stockChange: product.invoice_items.reduce((sum, item) => sum - item.quantity, 0),
      currentStock: product.stock_quantity
    }));
  }
}

module.exports = new PromotionAnalyticsService(); 