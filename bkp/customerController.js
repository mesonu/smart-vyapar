const { Op } = require('sequelize');
const { Customer, Invoice, Payment } = require('../models');
const sequelize = require('sequelize');

const customerController = {
  async getAllCustomers(req, res) {
    try {
      const {
        search,
        status,
        customerType,
        minCreditLimit,
        maxOutstanding,
        sortBy = 'name',
        sortOrder = 'ASC',
        page = 1,
        limit = 10
      } = req.query;

      const where = { userId: req.user.id };
      const order = [[sortBy, sortOrder]];

      // Search functionality
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Filter by status
      if (status) {
        where.status = status;
      }

      // Filter by customer type
      if (customerType) {
        where.customerType = customerType;
      }

      // Filter by credit limit
      if (minCreditLimit) {
        where.creditLimit = {
          [Op.gte]: parseFloat(minCreditLimit)
        };
      }

      // Filter by outstanding balance
      if (maxOutstanding) {
        where.outstandingBalance = {
          [Op.lte]: parseFloat(maxOutstanding)
        };
      }

      const offset = (page - 1) * limit;

      const { count, rows: customers } = await Customer.findAndCountAll({
        where,
        order,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: Invoice,
            attributes: ['id', 'totalAmount', 'status', 'createdAt'],
            limit: 5,
            order: [['createdAt', 'DESC']]
          },
          {
            model: Payment,
            attributes: ['id', 'amount', 'status', 'createdAt'],
            limit: 5,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      res.json({
        customers,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
  },

  async createCustomer(req, res) {
    try {
      const customer = await Customer.create({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ message: 'Error creating customer', error: error.message });
    }
  },

  async getCustomerById(req, res) {
    try {
      const customer = await Customer.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        },
        include: [
          {
            model: Invoice,
            attributes: ['id', 'totalAmount', 'status', 'createdAt'],
            order: [['createdAt', 'DESC']]
          },
          {
            model: Payment,
            attributes: ['id', 'amount', 'status', 'createdAt'],
            order: [['createdAt', 'DESC']]
          }
        ]
      });
      
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
  },

  async updateCustomer(req, res) {
    try {
      const [updated] = await Customer.update(req.body, {
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      
      if (!updated) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      const updatedCustomer = await Customer.findByPk(req.params.id, {
        include: [
          {
            model: Invoice,
            attributes: ['id', 'totalAmount', 'status', 'createdAt'],
            order: [['createdAt', 'DESC']]
          },
          {
            model: Payment,
            attributes: ['id', 'amount', 'status', 'createdAt'],
            order: [['createdAt', 'DESC']]
          }
        ]
      });
      
      res.json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
  },

  async deleteCustomer(req, res) {
    try {
      const deleted = await Customer.destroy({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      
      if (!deleted) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
  },

  async getCustomerStats(req, res) {
    try {
      const stats = await Customer.findAll({
        where: { userId: req.user.id },
        attributes: [
          'status',
          'customerType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('outstandingBalance')), 'totalOutstanding'],
          [sequelize.fn('SUM', sequelize.col('creditLimit')), 'totalCreditLimit']
        ],
        group: ['status', 'customerType']
      });

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customer stats', error: error.message });
    }
  }
};

module.exports = customerController; 