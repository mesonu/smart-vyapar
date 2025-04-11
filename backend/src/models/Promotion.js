'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      this.belongsTo(models.PromotionTemplate, {
        foreignKey: 'template_id',
        as: 'template'
      });
      this.belongsToMany(models.Product, {
        through: 'promotion_products',
        foreignKey: 'promotion_id',
        otherKey: 'product_id',
        as: 'products'
      });
      this.hasMany(models.PromotionHistory, {
        foreignKey: 'promotion_id',
        as: 'history'
      });
    }
  }

  Promotion.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    min_purchase_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    max_discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'promotion_templates',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Promotion',
    tableName: 'promotions',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Promotion;
}; 