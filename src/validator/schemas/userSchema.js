const Joi = require('joi');
const { UserRoles } = require('../../config/role');
const { UserStatus } = require('../../config/constant');

const createUser = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().allow(null).allow(""),
    role: Joi.string().valid(...Object.values(UserRoles)).default(UserRoles.STAFF),
    address: Joi.string().allow(null).allow(""),
    phone_number: Joi.string().allow(null).allow(""),
});

const updateUser = Joi.object({
    name: Joi.string().allow(null),
    role: Joi.string().valid(...Object.values(UserRoles)),
    status: Joi.string().valid(...Object.values(UserStatus)),
    image: Joi.string().allow(null),
    address: Joi.string().allow(null).allow(""),
    phone_number: Joi.string().allow(null).allow(""),
});

const userLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

const checkEmail = Joi.object({
    email: Joi.string().email().required(),
});

const changePassword = Joi.object({
    old_password: Joi.string().min(8).required(),
    new_password: Joi.string().min(8).required(),
});

const refreshToken = Joi.object({
    refresh_token: Joi.string().required(),
});

const verificationToken = Joi.object({
    token: Joi.string().required(),
});

const confirmForgotPassword = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
});

module.exports = {
    createUser,
    userLogin,
    checkEmail,
    changePassword,
    refreshToken,
    verificationToken,
    confirmForgotPassword,
    updateUser,
};
