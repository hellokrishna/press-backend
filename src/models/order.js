const { Model } = require('sequelize');
const { LaminationType, MachineType, PaymentType, OrderStatus } = require('../config/constant');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.Customer, { foreignKey: 'customer_uuid', targetKey: 'uuid', as: 'customer' });
        }
    }
    Order.init(
        {
            uuid: DataTypes.UUID,
            customer_uuid: DataTypes.UUID,
            work_description: DataTypes.STRING,
            size_page: {type: DataTypes.STRING, allowNull: true},
            bill_number: {type: DataTypes.STRING, allowNull: true},
            unit_pieces: DataTypes.NUMBER,
            paper_description: {type: DataTypes.STRING, allowNull: true},
            rim_sheet: {type: DataTypes.STRING, allowNull: true},
            plate_ctp_description: {type: DataTypes.STRING, allowNull: true},
            ink_description: {type: DataTypes.STRING, allowNull: true},
            binding_numbering: DataTypes.STRING,
            hot_lamination: {
                type: DataTypes.ENUM,
                values: Object.values(LaminationType),
            
            },
            normal_lamination: {
                type: DataTypes.ENUM,
                values: Object.values(LaminationType),

            },
            machine_type: {
                type: DataTypes.ENUM,
                values: Object.values(MachineType),
                
            },
            unit_price: DataTypes.FLOAT,
            advanced_payment: DataTypes.FLOAT,
            total_payment: DataTypes.FLOAT,
            delivery_date: DataTypes.DATE,
            remarks: {type: DataTypes.STRING, allowNull: true},
            payment_status: {
                type: DataTypes.ENUM,
                values: Object.values(PaymentType),
            },
            order_status: {
                type: DataTypes.ENUM,
                values: Object.values(OrderStatus),
            },
        },
        {
            sequelize,
            underscored: true,
        },
    );
    Order.beforeCreate(async (order) => {
        order.uuid = uuidv4();
    });
    return Order;
};
