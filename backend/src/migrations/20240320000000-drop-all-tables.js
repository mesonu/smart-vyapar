'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order of dependencies
    await queryInterface.dropTable('product_tags');
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('invoice_items');
    await queryInterface.dropTable('invoices');
    await queryInterface.dropTable('product_variants');
    await queryInterface.dropTable('product_reviews');
    await queryInterface.dropTable('product_history');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('customers');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('tags');
  },

  down: async (queryInterface, Sequelize) => {
    // This is a destructive migration, so we don't implement a down method
    // Tables will be recreated by subsequent migrations
  }
}; 