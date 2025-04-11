'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('invoice_items', 'description', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('invoice_items', 'quantity', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    });

    await queryInterface.renameColumn('invoice_items', 'price', 'unitPrice');

    await queryInterface.addColumn('invoice_items', 'taxRate', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('invoice_items', 'taxAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('invoice_items', 'discountType', {
      type: Sequelize.ENUM('percentage', 'fixed'),
      allowNull: true
    });

    await queryInterface.addColumn('invoice_items', 'discountValue', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });

    await queryInterface.addColumn('invoice_items', 'discountAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('invoice_items', 'subtotal', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('invoice_items', 'total', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('invoice_items', 'description');
    await queryInterface.changeColumn('invoice_items', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.renameColumn('invoice_items', 'unitPrice', 'price');
    await queryInterface.removeColumn('invoice_items', 'taxRate');
    await queryInterface.removeColumn('invoice_items', 'taxAmount');
    await queryInterface.removeColumn('invoice_items', 'discountType');
    await queryInterface.removeColumn('invoice_items', 'discountValue');
    await queryInterface.removeColumn('invoice_items', 'discountAmount');
    await queryInterface.removeColumn('invoice_items', 'subtotal');
    await queryInterface.removeColumn('invoice_items', 'total');
  }
}; 