'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Customer.hasMany(models.Invoice, {
        foreignKey: 'customer_id',
        as: 'invoices'
      });
      Customer.hasMany(models.Payment, {
        foreignKey: 'customer_id',
        as: 'payments'
      });
    }
  }

  Customer.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    alternatePhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'alternate_phone'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gstNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'gst_number'
    },
    creditLimit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'credit_limit'
    },
    outstandingBalance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'outstanding_balance'
    },
    lastPurchaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_purchase_date'
    },
    totalPurchases: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_purchases'
    },
    totalPayments: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_payments'
    },
    communicationPreferences: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { whatsapp: true, email: true, sms: true },
      field: 'communication_preferences'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blocked'),
      allowNull: false,
      defaultValue: 'active'
    },
    customerType: {
      type: DataTypes.ENUM('regular', 'premium', 'wholesale'),
      allowNull: false,
      defaultValue: 'regular',
      field: 'customer_type'
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
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['email']
      },
      {
        fields: ['phone']
      },
      {
        fields: ['status']
      }
    ]
  });

  return Customer;
}; 