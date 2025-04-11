'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new column
    await queryInterface.addColumn('products', 'new_column', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'description' // Optional: specify where to add the column
    });

    // Add new index
    await queryInterface.addIndex('products', ['new_column'], {
      name: 'products_new_column_idx'
    });

    // Modify existing column
    await queryInterface.changeColumn('products', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index
    await queryInterface.removeIndex('products', 'products_new_column_idx');
    
    // Remove column
    await queryInterface.removeColumn('products', 'new_column');
    
    // Revert column modification
    await queryInterface.changeColumn('products', 'description', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
}; 