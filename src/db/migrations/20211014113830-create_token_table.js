const { TokenTypes } = require('../../config/tokens');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('tokens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            token: {
                type: Sequelize.STRING,
            },
            user_uuid: {
                allowNull: false,
                type: Sequelize.DataTypes.UUID,
                references: {
                    model: 'users',
                    key: 'uuid',
                },
            },
            type: {
                type: Sequelize.ENUM,
                values: Object.values(TokenTypes),
                allowNull: false,
            },
            blacklisted: {
                type: Sequelize.BOOLEAN,
            },
            expires: {
                allowNull: false,
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
        });
    },

    // eslint-disable-next-line no-unused-vars
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('tokens');
    },
};
