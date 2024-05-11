const Joi = require('joi');

const createCustomer = Joi.object({
    company_name: Joi.string().allow(null).allow(''),
    phone_number: Joi.string().max(10).allow(null).allow(''),
    address: Joi.string().allow(null).allow(''),
    contact_person: Joi.string(),
    pan: Joi.string().allow(null).allow(''),
    email: Joi.string().email().allow(null),
});

const updateCustomer = Joi.object({
    company_name: Joi.string().allow(null),
    phone_number: Joi.string().max(10),
    address: Joi.string().allow(null),
    contact_person: Joi.string(),
    pan: Joi.string().allow(null),
    email: Joi.string().email(),
    blacklisted: Joi.boolean(),
});

module.exports = {
    createCustomer,
    updateCustomer,
}