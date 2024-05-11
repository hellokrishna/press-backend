const httpStatus = require("http-status");
const { CustomerStatus } = require("../config/constant");
const CustomerDao = require("../dao/customerDao");
const responseHandler = require('../helper/responseHandler');
const logger = require("../config/logger");

class CustomerService {
    constructor() {
        this.customerDao = new CustomerDao();
    }

    /**
     * Create a customer
     * @param {Object} customerBody
     * @returns {Object}
     */
    createCustomer = async (customerBody) => {
        try {
            let message = 'Successfully registered the customer.';
            if (customerBody.email && await this.customerDao.isEmailExists(customerBody.email)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already taken');
            } 
            if (customerBody.pan && await this.customerDao.isPanExists(customerBody.pan)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'PAN number already exists.')
            }

            let customerData = await this.customerDao.create({
                ...customerBody,
                status: CustomerStatus.ACTIVE,
            });

            if (!customerData) {
                message = 'Customer Creation Failed!';
                return responseHandler.returnError(httpStatus.SERVICE_UNAVAILABLE, message);
            }

            customerData = customerData.toJSON();
            delete customerData.id;
            delete customerData.blacklisted;

            return responseHandler.returnSuccess(httpStatus.CREATED, message, customerData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not create the user.');
        }
    };

    updateCustomer = async (customerBody, uuid) => {
        let message = 'Successfully updated customer.'
        try {
            if (!await this.customerDao.updateWhere(customerBody, { uuid })) {
                message = 'Customer Update Failed!';
                return responseHandler.returnError(httpStatus.SERVICE_UNAVAILABLE, message);
            }
            return responseHandler.returnSuccess(httpStatus.OK, message);

        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not update the customer.');
        }
    }

    removeCustomer = async (uuid) => {
        try {
            const updated = await this.customerDao.deleteByUuid(uuid);
            if (!updated) {
                return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not delete the customer. UUID: ${uuid}`);
            }
            return responseHandler.returnSuccess(httpStatus.NO_CONTENT, `Customer UUID: ${uuid} has been deleted.`);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not delete the customer. UUID: ${uuid}`);
        }
    }

    listCustomers = async () => {
        try {
            const customers = await this.customerDao.listAllCustomers();
            if (!customers) {
                return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not fetch customers.`)
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Available Customers', customers.map((customer) => customer.toJSON()));
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not fetch customers.`)
        }
    }

    getCustomer = async (uuid) => {
        try {
            const customer = await this.customerDao.findByUuid(uuid);
            if (!customer) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, `The customer does not exist.`);
            }
            return responseHandler.returnSuccess(httpStatus.OK, `Customer`, customer.toJSON());
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.INTERNAL_SERVER_ERROR, `Could not fetch customer UUID: ${uuid}`);
        }
    }
}

module.exports = CustomerService