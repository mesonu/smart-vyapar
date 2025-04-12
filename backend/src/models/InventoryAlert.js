'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InventoryAlert extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      this.belongsTo(models.InventoryBatch, {
        foreignKey: 'batch_id',
        as: 'batch'
      });
      this.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });
    }
  }

  InventoryAlert.init({
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
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'inventory_batches',
        key: 'id'
      }
    },
    alert_type: {
      type: DataTypes.ENUM('low_stock', 'expiry', 'reorder'),
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'acknowledged', 'resolved'),
      allowNull: false,
      defaultValue: 'active'
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
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
    modelName: 'InventoryAlert',
    tableName: 'inventory_alerts',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['product_id']
      },
      {
        fields: ['batch_id']
      },
      {
        fields: ['alert_type']
      },
      {
        fields: ['status']
      }
    ]
  });

  return InventoryAlert;
}; 