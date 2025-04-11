'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PromotionProduct extends Model {
    static associate(models) {
      PromotionProduct.belongsTo(models.Promotion, {
        foreignKey: 'promotion_id',
        as: 'promotion'
      });
      PromotionProduct.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }

  PromotionProduct.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    promotion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'promotions',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
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
    modelName: 'PromotionProduct',
    tableName: 'promotion_products',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['promotion_id', 'product_id']
      },
      {
        fields: ['promotion_id']
      },
      {
        fields: ['product_id']
      }
    ]
  });

  return PromotionProduct;
}; 