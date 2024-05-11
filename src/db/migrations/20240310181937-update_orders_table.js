'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'total_price');
    await queryInterface.removeColumn('orders', 'due_payment');
    await queryInterface.removeColumn('orders', 'due_payment_date');
    await queryInterface.removeColumn('orders', 'order_delivery_date');
  },

  async down (queryInterface, Sequelize) {
  }
};
