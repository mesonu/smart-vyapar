const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentStatus extends Model {
    static associate(models) {
      // Define associations here
      PaymentStatus.belongsTo(models.Payment, {
        foreignKey: 'payment_id',
        as: 'payment'
      });
      
      PaymentStatus.belongsTo(models.User, {
        foreignKey: 'updated_by',
        as: 'updatedBy'
      });
    }
  }

  PaymentStatus.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'payments',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'processing',
        'completed',
        'failed',
        'refunded',
        'partially_refunded',
        'cancelled'
      ),
      allowNull: false
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PaymentStatus',
    tableName: 'payment_statuses',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['payment_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['status_date']
      }
    ],
    hooks: {
      afterCreate: async (paymentStatus) => {
        // Update the payment status when a new status is created
        const payment = await paymentStatus.getPayment();
        if (payment) {
          await payment.update({
            status: paymentStatus.status
          });
        }
      }
    }
  });

  return PaymentStatus;
}; 