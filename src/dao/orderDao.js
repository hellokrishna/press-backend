const SuperDao = require("./superDao");
const models = require('../models');
const { OrderStatus } = require("../config/constant");
const { Op } = require("sequelize");

class OrderDao extends SuperDao {
    constructor() {
        super(models.Order);
    }

    async deleteByUuid(uuid) {
        return this.updateWhere({ order_status: OrderStatus.CANCELED }, { uuid });
    }

    async listAllOrdersByCustomer(customer_uuid) {
        return this.findByWhere({ customer_uuid }, { exclude: ['id'] });;
    }

    async listAllOrdersIncludingCustomers() {
        return this.Model.findAll({
            where: {},
            attributes: { exclude: ['id'] },
            include: [{
                model: models.Customer,
                attributes: { exclude: ['id', 'blacklisted'] },
                as: 'customer',
            }]
        })
    }

    async listAllOrders() {
        return this.findByWhere({}, { exclude: ['id'] });
    }

    async getOrderByUuid(uuid) {
        return this.findOneByWhere({ uuid }, { exclude: ['id'] });
    }

    async updateOrderByUuid(orderBody, uuid) {
        const existingOrder = await this.findOneByWhere({ uuid });
        if (existingOrder && existingOrder.order_status !== OrderStatus.CANCELED) {
            return this.updateWhere(orderBody, { uuid });
        }
    }

}

module.exports = OrderDao;