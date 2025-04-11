'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      Invoice.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Invoice.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
      Invoice.hasMany(models.InvoiceItem, {
        foreignKey: 'invoice_id',
        as: 'items'
      });
      Invoice.hasMany(models.Payment, {
        foreignKey: 'invoice_id',
        as: 'payments'
      });
      Invoice.hasMany(models.InvoiceHistory, {
        foreignKey: 'invoice_id',
        as: 'history'
      });
    }
  }

  Invoice.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'invoice_number'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'customer_id',
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'issue_date'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date'
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded'),
      allowNull: false,
      defaultValue: 'draft'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_amount'
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'tax_amount'
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'discount_amount'
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'paid_amount'
    },
    balanceAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'balance_amount'
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    exchangeRate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      field: 'exchange_rate'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_recurring'
    },
    recurringFrequency: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly'),
      allowNull: true,
      field: 'recurring_frequency'
    },
    nextRecurringDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'next_recurring_date'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['customer_id']
      },
      {
        unique: true,
        fields: ['invoice_number']
      },
      {
        fields: ['status']
      },
      {
        fields: ['issue_date']
      },
      {
        fields: ['due_date']
      },
      {
        fields: ['is_recurring']
      }
    ],
    hooks: {
      beforeCreate: async (invoice) => {
        // Generate invoice number if not provided
        if (!invoice.invoiceNumber) {
          const year = new Date().getFullYear();
          const count = await Invoice.count({
            where: {
              issueDate: {
                [sequelize.Op.gte]: new Date(year, 0, 1),
                [sequelize.Op.lt]: new Date(year + 1, 0, 1)
              }
            }
          });
          invoice.invoiceNumber = `INV-${year}-${(count + 1).toString().padStart(6, '0')}`;
        }
      },
      afterUpdate: async (invoice) => {
        // Update balance amount when payment is made
        if (invoice.changed('paidAmount')) {
          invoice.balanceAmount = invoice.totalAmount - invoice.paidAmount;
          
          // Update status based on payment
          if (invoice.balanceAmount <= 0) {
            invoice.status = 'paid';
          } else if (invoice.paidAmount > 0) {
            invoice.status = 'partially_paid';
          }
        }
      }
    }
  });

  return Invoice;
}; 