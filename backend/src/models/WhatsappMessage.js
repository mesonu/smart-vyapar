const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WhatsappMessage extends Model {
    static associate(models) {
      WhatsappMessage.belongsTo(models.WhatsappTemplate, {
        foreignKey: 'template_id',
        as: 'whatsapp_templates'
      });
      
      WhatsappMessage.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'users'
      });
      
      WhatsappMessage.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customers'
      });
      
      WhatsappMessage.belongsTo(models.Invoice, {
        foreignKey: 'invoice_id',
        as: 'invoices'
      });
      
      WhatsappMessage.belongsTo(models.Payment, {
        foreignKey: 'payment_id',
        as: 'payments'
      });
    }
  }

  WhatsappMessage.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'whatsapp_templates',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'invoices',
        key: 'id'
      }
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'payments',
        key: 'id'
      }
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Recipient phone number'
    },
    message_type: {
      type: DataTypes.ENUM(
        'text',
        'template',
        'image',
        'document',
        'video',
        'location'
      ),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    parameters: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Template parameters if message_type is template'
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'sent',
        'delivered',
        'read',
        'failed'
      ),
      allowNull: false,
      defaultValue: 'pending'
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
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    whatsapp_message_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'WhatsApp Business API message ID'
    },
    whatsapp_conversation_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'WhatsApp Business API conversation ID'
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
    }
  }, {
    sequelize,
    modelName: 'WhatsappMessage',
    tableName: 'whatsapp_messages',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['to']
      },
      {
        fields: ['template_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['sent_at']
      },
      {
        fields: ['whatsapp_message_id']
      }
    ],
    hooks: {
      afterCreate: async (message) => {
        // Update related entity status if needed
        if (message.invoice_id && message.message_type === 'template' && message.template_id) {
          const template = await message.getTemplate();
          if (template && template.category === 'payment') {
            const invoice = await message.getInvoice();
            if (invoice) {
              // Update invoice status based on payment notification
              await invoice.update({ 
                last_notification_sent: new Date(),
                notification_status: message.status
              });
            }
          }
        }
      }
    }
  });

  return WhatsappMessage;
}; 