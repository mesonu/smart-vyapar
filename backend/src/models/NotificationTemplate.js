const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NotificationTemplate extends Model {
    static associate(models) {
      NotificationTemplate.hasMany(models.Notification, {
        foreignKey: 'template_id',
        as: 'notifications'
      });
    }
  }

  NotificationTemplate.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    category: {
      type: DataTypes.ENUM(
        'payment',
        'invoice',
        'promotion',
        'system',
        'marketing'
      ),
      allowNull: false
    },
    subject_template: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message_template: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    variables: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'List of variables used in the template'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'NotificationTemplate',
    tableName: 'notification_templates',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['type']
      },
      {
        fields: ['category']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  return NotificationTemplate;
}; 