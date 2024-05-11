const { CustomerStatus } = require('../../config/constant');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
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
      company_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: true,               
        type: Sequelize.STRING,
      },
      phone_number: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      contact_person: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      pan: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM,
        values: Object.values(CustomerStatus),
        defaultValue: CustomerStatus.PENDING,
      },
      blacklisted: {
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};
