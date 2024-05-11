const { Model } = require('sequelize');
const { CustomerStatus } = require('../config/constant');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Customer extends Model { }

    Customer.init(
        {
            uuid: DataTypes.UUID,
            company_name: DataTypes.STRING,
            email: DataTypes.STRING,
            phone_number: {type: DataTypes.STRING, allowNull: true},
            address:{type: DataTypes.STRING, allowNull: true},
            contact_person: DataTypes.STRING,
            pan: {type: DataTypes.STRING, allowNull: true},
            status: {
                type: DataTypes.ENUM,
                values: Object.values(CustomerStatus),
                allowNull: true,
            },
            blacklisted: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            underscored: true,
        },
    );
    Customer.beforeCreate(async (customer) => {
        customer.uuid = uuidv4();
    })
    return Customer;
};
