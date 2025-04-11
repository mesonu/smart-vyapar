const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WhatsappTemplate extends Model {
    static associate(models) {
      WhatsappTemplate.hasMany(models.WhatsappMessage, {
        foreignKey: 'template_id',
        as: 'messages'
      });
      
      WhatsappTemplate.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });
      
      WhatsappTemplate.belongsTo(models.User, {
        foreignKey: 'updated_by',
        as: 'updater'
      });
    }
  }

  WhatsappTemplate.init({
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
    category: {
      type: DataTypes.ENUM(
        'payment',
        'invoice',
        'promotion',
        'system',
        'marketing',
        'customer_service'
      ),
      allowNull: false
    },
    template_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'WhatsApp Business API template ID'
    },
    language: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: 'en',
      comment: 'Template language code (e.g., en, hi)'
    },
    header_type: {
      type: DataTypes.ENUM(
        'text',
        'image',
        'document',
        'video',
        'location'
      ),
      allowNull: true
    },
    header_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    body_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    footer_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    variables: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'List of variables used in the template'
    },
    button_type: {
      type: DataTypes.ENUM(
        'quick_reply',
        'url',
        'phone_number',
        'none'
      ),
      allowNull: true
    },
    buttons: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Template buttons configuration'
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'approved',
        'rejected',
        'disabled'
      ),
      allowNull: false,
      defaultValue: 'pending'
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    modelName: 'WhatsappTemplate',
    tableName: 'whatsapp_templates',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['template_id']
      },
      {
        fields: ['category']
      },
      {
        fields: ['status']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  return WhatsappTemplate;
}; 