const httpStatus = require("http-status");
const CustomerService = require("../service/customerService");
const logger = require("../config/logger");
const { http } = require("winston");

class CustomerController {
    constructor() {
        this.customerService = new CustomerService();
    }

    register = async (req, res) => {
        try {
            const customer = await this.customerService.createCustomer(req.body);
            const { status, message, data } = customer.response;
            res.status(customer.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    update = async (req, res) => {
        try {
            const customer = await this.customerService.updateCustomer(req.body, req.params.uuid);
            const { status, message } = customer.response;
            res.status(customer.statusCode).send({ status, message });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    list = async (req, res) => {
        try {
            const customers = await this.customerService.listCustomers();
            const { status, message, data } = customers.response;
            res.status(customers.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    delete = async (req, res) => {
        try {
            await this.customerService.removeCustomer(req.params.uuid);
            res.status(httpStatus.OK).send(`Successfully removed customer UUID: ${req.params.uuid}`);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    get = async (req, res) => {
        try {
            const customer = await this.customerService.getCustomer(req.params.uuid);
            const { status, message, data } = customer.response;
            res.status(customer.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(http.BAD_GATEWAY).send(e);
        }
    }
}

module.exports = CustomerController