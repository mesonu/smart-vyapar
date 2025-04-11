const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProductPromotion extends Model {
    static associate(models) {
      // Define associations here
      ProductPromotion.belongsTo(models.Promotion, {
        foreignKey: 'promotion_id',
        as: 'promotion'
      });

      ProductPromotion.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }

  ProductPromotion.init({
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
    discount_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['percentage', 'fixed']]
      }
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    min_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    max_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'ProductPromotion',
    tableName: 'product_promotions',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: async (productPromotion) => {
        // Validate discount value based on type
        if (productPromotion.discount_type === 'percentage' && productPromotion.discount_value > 100) {
          throw new Error('Percentage discount cannot exceed 100%');
        }

        // Validate quantity limits
        if (productPromotion.max_quantity && productPromotion.min_quantity > productPromotion.max_quantity) {
          throw new Error('Minimum quantity cannot be greater than maximum quantity');
        }
      }
    }
  });

  return ProductPromotion;
}; 