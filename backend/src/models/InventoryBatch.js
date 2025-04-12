'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InventoryBatch extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      this.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });
      this.hasMany(models.InventoryTransaction, {
        foreignKey: 'batch_id',
        as: 'transactions'
      });
    }
  }

  InventoryBatch.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    batch_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    remaining_quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    manufacturing_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'depleted'),
      allowNull: false,
      defaultValue: 'active'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'InventoryBatch',
    tableName: 'inventory_batches',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['product_id']
      },
      {
        fields: ['batch_number']
      },
      {
        fields: ['expiry_date']
      },
      {
        fields: ['status']
      }
    ]
  });

  return InventoryBatch;
}; 