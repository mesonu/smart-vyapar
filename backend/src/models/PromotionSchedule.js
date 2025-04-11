module.exports = (sequelize, DataTypes) => {
  const PromotionSchedule = sequelize.define('PromotionSchedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'promotion_templates',
        key: 'id'
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    last_run_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    next_run_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    run_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'promotion_schedules',
    underscored: true,
    timestamps: true,
    paranoid: true
  });

  PromotionSchedule.associate = (models) => {
    PromotionSchedule.belongsTo(models.PromotionTemplate, {
      foreignKey: 'template_id',
      as: 'template'
    });
    
    PromotionSchedule.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return PromotionSchedule;
}; 