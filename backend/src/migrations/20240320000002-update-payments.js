'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('payments', 'customerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    });

    await queryInterface.changeColumn('payments', 'amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    });

    await queryInterface.changeColumn('payments', 'paymentMethod', {
      type: Sequelize.ENUM('cash', 'credit_card', 'bank_transfer', 'check', 'online_payment'),
      allowNull: false
    });

    await queryInterface.changeColumn('payments', 'status', {
      type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded', 'partially_refunded'),
      allowNull: false,
      defaultValue: 'pending'
    });

    await queryInterface.renameColumn('payments', 'referenceNumber', 'transactionId');

    await queryInterface.addColumn('payments', 'currency', {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    });

    await queryInterface.addColumn('payments', 'exchangeRate', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true
    });

    await queryInterface.addColumn('payments', 'metadata', {
      type: Sequelize.JSONB,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('payments', 'customerId');
    await queryInterface.changeColumn('payments', 'amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('payments', 'paymentMethod', {
      type: Sequelize.ENUM('cash', 'card', 'bank_transfer', 'upi'),
      allowNull: false
    });
    await queryInterface.changeColumn('payments', 'status', {
      type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    });
    await queryInterface.renameColumn('payments', 'transactionId', 'referenceNumber');
    await queryInterface.removeColumn('payments', 'currency');
    await queryInterface.removeColumn('payments', 'exchangeRate');
    await queryInterface.removeColumn('payments', 'metadata');
  }
}; 