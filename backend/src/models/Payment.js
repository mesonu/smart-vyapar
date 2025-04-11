'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Invoice, {
        foreignKey: 'invoice_id',
        as: 'invoice'
      });
      Payment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Payment.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
    }
  }

  Payment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'invoices',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    payment_method: {
      type: DataTypes.ENUM(
        'cash',
        'credit_card',
        'bank_transfer',
        'check',
        'online_payment'
      ),
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'completed',
        'failed',
        'refunded',
        'partially_refunded'
      ),
      allowNull: false,
      defaultValue: 'pending'
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reference_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    refund_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refund_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    exchange_rate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    underscored: true,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['invoice_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['customer_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['payment_date']
      }
    ],
    hooks: {
      afterCreate: async (payment) => {
        // Update invoice status based on payment
        const invoice = await payment.getInvoice();
        const totalPaid = await Payment.sum('amount', {
          where: {
            invoice_id: payment.invoice_id,
            status: ['completed', 'partially_refunded']
          }
        });

        if (totalPaid >= invoice.totalAmount) {
          await invoice.update({ status: 'paid' });
        } else if (totalPaid > 0) {
          await invoice.update({ status: 'partially_paid' });
        }
      }
    }
  });

  return Payment;
}; 