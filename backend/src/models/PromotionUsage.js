const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PromotionUsage extends Model {
    static associate(models) {
      // Define associations here
      PromotionUsage.belongsTo(models.Promotion, {
        foreignKey: 'promotion_id',
        as: 'promotion'
      });

      PromotionUsage.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      PromotionUsage.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });
    }
  }

  PromotionUsage.init({
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'PromotionUsage',
    tableName: 'promotion_usage',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: async (usage) => {
        // Validate discount amount
        if (usage.discount_amount <= 0) {
          throw new Error('Discount amount must be greater than 0');
        }
      }
    }
  });

  return PromotionUsage;
}; 