const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PromotionHistory extends Model {
    static associate(models) {
      // Define associations here
      PromotionHistory.belongsTo(models.Promotion, {
        foreignKey: 'promotion_id',
        as: 'promotion'
      });

      PromotionHistory.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  PromotionHistory.init({
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
    action: {
      type: DataTypes.ENUM('created', 'updated', 'deleted'),
      allowNull: false
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PromotionHistory',
    tableName: 'promotion_history',
    timestamps: true,
    underscored: true
  });

  return PromotionHistory;
}; 