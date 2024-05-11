const { UserStatus } = require('../../config/constant');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
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
            image: Sequelize.STRING,
            name: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            role: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM,
                values: Object.values(UserStatus),
                defaultValue: UserStatus.DISABLED,
            },
            email_verified: {
                type: Sequelize.BOOLEAN,
            },
            address: {
                type: Sequelize.STRING,
            },
            phone_number: {
                type: Sequelize.STRING,
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

    // eslint-disable-next-line no-unused-vars
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    },
};
