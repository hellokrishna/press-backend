'use strict';

const { PaymentType, OrderStatus, LaminationType, MachineType } = require('../../config/constant');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: true,
      },
      customer_uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'customers',
          key: 'uuid',
        },
      },
      work_description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      size_page: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      bill_number: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      unit_pieces: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      paper_description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      rim_sheet: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      plate_ctp_description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      ink_description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      binding_numbering: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      hot_lamination: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: Object.values(LaminationType),
      },
      normal_lamination: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: Object.values(LaminationType),
      },
      machine_type: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: Object.values(MachineType),
      },
      unit_price: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      total_price: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      advanced_payment: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      due_payment: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      total_payment: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      delivery_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      remarks: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      payment_status: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: Object.values(PaymentType),
      },
      order_status: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: Object.values(OrderStatus),
      },
      due_payment_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      order_delivery_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
