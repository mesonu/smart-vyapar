const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PromotionTemplate extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      this.hasMany(models.Promotion, {
        foreignKey: 'template_id',
        as: 'promotions'
      });
    }
  }

  PromotionTemplate.init({
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
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
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
    }
  }, {
    sequelize,
    modelName: 'PromotionTemplate',
    tableName: 'promotion_templates',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PromotionTemplate;
}; 