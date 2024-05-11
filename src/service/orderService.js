const httpStatus = require("http-status");
const { OrderStatus } = require("../config/constant");
const logger = require("../config/logger");
const OrderDao = require("../dao/orderDao");
const responseHandler = require('../helper/responseHandler');

class OrderService {
    constructor() {
        this.orderDao = new OrderDao();
    }

    createOrder = async (orderBody) => {
        try {
            let message = 'Successfully placed order.';
            let orderData = await this.orderDao.create({
                ...orderBody,
            });

            if (!orderData) {
                message = 'Order placement failed!';
                return responseHandler.returnError(httpStatus.SERVICE_UNAVAILABLE, message);
            }

            orderData = orderData.toJSON();
            delete orderData.id;

            return responseHandler.returnSuccess(httpStatus.CREATED, message, orderData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not place the order.');
        }
    }

    updateOrder = async (orderBody, uuid) => {
        let message = 'Successfully updated order.'
        try {
            if (!await this.orderDao.updateOrderByUuid(orderBody, uuid)) {
                message = 'Order update failed!';
                return responseHandler.returnError(httpStatus.SERVICE_UNAVAILABLE, message);
            }
            return responseHandler.returnSuccess(httpStatus.OK, message);

        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not update the order.');
        }
    }

    removeOrder = async (uuid) => {
        try {
            const updated = await this.orderDao.deleteByUuid(uuid);
            if (!updated) {
                return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not delete the Order. UUID: ${uuid}`);
            }
            return responseHandler.returnSuccess(httpStatus.NO_CONTENT, `Order UUID: ${uuid} has been deleted.`);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not delete the Order. UUID: ${uuid}`);
        }
    }

    listAllOrdersByCustomer = async (customer_uuid) => {
        try {
            const orders = await this.orderDao.listAllOrdersByCustomer(customer_uuid);
            return responseHandler.returnSuccess(httpStatus.OK, `Available Orders for customer uuid: ${customer_uuid}`, orders.map((order) => order.toJSON()));
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not fetch orders.`)
        }
    }

    listAllOrders = async (expand=false) => {
        try {
            let orders = []
            if(!expand)
                orders = await this.orderDao.listAllOrders();
            else
                orders = await this.orderDao.listAllOrdersIncludingCustomers();
            return responseHandler.returnSuccess(httpStatus.OK, `All available orders`, orders.map((order) => order.toJSON()));
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not fetch orders.`)
        }
    }

    getOrder = async (uuid) => {
        try {
            const order = await this.orderDao.getOrderByUuid(uuid);
            if (!order) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, `The order does not exist.`);
            }
            return responseHandler.returnSuccess(httpStatus.OK, `Order found.`, order.toJSON());
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not fetch order UUID: ${uuid}`);
        }
    }
}

module.exports = OrderService;