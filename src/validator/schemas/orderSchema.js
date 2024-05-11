const Joi = require("joi");
const { LaminationType, PaymentType, OrderStatus, MachineType } = require("../../config/constant");

const baseOrderSchema = Object.freeze({
    work_description: Joi.string().allow(null).allow(''),
    size_page: Joi.string().allow(null).allow(''),
    unit_pieces: Joi.number().allow(null).allow(''),
    paper_description: Joi.string().allow(null).allow(''),
    bill_number: Joi.string().allow(null).allow(''),
    rim_sheet: Joi.string().allow(null).allow(''),
    plate_ctp_description: Joi.string().allow(null).allow(''),
    ink_description: Joi.string().allow(null).allow(''),
    binding_numbering: Joi.string().allow(null).allow(''),
    hot_lamination: Joi.string().valid(...Object.values(LaminationType)).allow(null).allow(''),
    normal_lamination: Joi.string().valid(...Object.values(LaminationType)).allow(null).allow(''),
    machine_type: Joi.string().valid(...Object.values(MachineType)).allow(null).allow(''),
    unit_price: Joi.number().allow(null).allow(''),
    advanced_payment: Joi.number().allow(null).allow(''),
    total_payment: Joi.number().allow(null).allow(''),
    delivery_date: Joi.date().allow(null).allow(''),
    remarks: Joi.string().allow(null).allow(''),
    payment_status: Joi.string().valid(...Object.values(PaymentType)).allow(null).allow(''),
    order_status: Joi.string().valid(...Object.values(OrderStatus).filter(order => order !== OrderStatus.CANCELED)).allow(null).allow(''),
});

const createOrder = Joi.object({
    customer_uuid: Joi.string().required(),
    ...baseOrderSchema,
});

const updateOrder = Joi.object(baseOrderSchema);

module.exports = {
    createOrder,
    updateOrder,
}