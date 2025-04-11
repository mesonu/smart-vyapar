const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      Notification.belongsTo(models.NotificationTemplate, {
        foreignKey: 'template_id',
        as: 'template'
      });
      
      Notification.belongsTo(models.Invoice, {
        foreignKey: 'invoice_id',
        as: 'invoice'
      });
      
      Notification.belongsTo(models.Payment, {
        foreignKey: 'payment_id',
        as: 'payment'
      });
      
      Notification.belongsTo(models.Promotion, {
        foreignKey: 'promotion_id',
        as: 'promotion'
      });
    }
  }

  Notification.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      allowNull: false,
      references: {
        model: 'notification_templates',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM(
        'email',
        'whatsapp',
        'sms',
        'push'
      ),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'sent',
        'failed',
        'delivered',
        'read'
      ),
      allowNull: false,
      defaultValue: 'pending'
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    retry_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    max_retries: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    priority: {
      type: DataTypes.ENUM(
        'low',
        'medium',
        'high',
        'urgent'
      ),
      allowNull: false,
      defaultValue: 'medium'
    },
    channel_specific_data: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['template_id']
      },
      {
        fields: ['type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['sent_at']
      }
    ]
  });

  return Notification;
}; 