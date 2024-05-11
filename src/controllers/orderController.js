const { http } = require("winston");
const OrderService = require("../service/orderService");
const logger = require("../config/logger");
const httpStatus = require("http-status");

class OrderController {
    constructor() {
        this.orderService = new OrderService();
    }

    register = async (req, res) => {
        try {
            const order = await this.orderService.createOrder(req.body);
            const { status, message, data } = order.response;
            res.status(order.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    update = async (req, res) => {
        try {
            const order = await this.orderService.updateOrder(req.body, req.params.uuid);
            const { status, message } = order.response;
            res.status(order.statusCode).send({ status, message });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    listAllOrdersByCustomer = async (req, res) => {
        try {
            const orders = await this.orderService.listAllOrdersByCustomer(req.params.customerUUID);
            const { status, message, data } = orders.response;
            res.status(orders.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    listAllOrders = async (req, res) => {
        const shouldExpand = req.query.expand && req.query.expand !== 'false'
        try {
            const orders = await this.orderService.listAllOrders(shouldExpand);
            const { status, message, data } = orders.response;
            res.status(orders.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    remove = async (req, res) => {
        try {
            const { response } = await this.orderService.removeOrder(req.params.uuid);
            res.status(response.code).send(response.message);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    get = async (req, res) => {
        try {
            const order = await this.orderService.getOrder(req.params.uuid);
            const { status, message, data } = order.response;
            res.status(order.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(http.BAD_GATEWAY).send(e);
        }
    }
}

module.exports = OrderController