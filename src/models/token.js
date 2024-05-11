const { Model } = require('sequelize');
const { TokenTypes } = require('../config/tokens');

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        static associate(models) {
            Token.belongsTo(models.User, { foreignKey: 'user_uuid', targetKey: 'uuid' });
        }
    }
    Token.init(
        {
            token: DataTypes.STRING,
            user_uuid: DataTypes.UUID,
            type: {
                type: DataTypes.ENUM,
                values: Object.values(TokenTypes),
                allowNull: false,
            },
            expires: DataTypes.DATE,
            blacklisted: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            underscored: true,
        },
    );
    return Token;
};
