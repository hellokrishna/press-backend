const httpStatus = require('http-status');
const AuthService = require('../service/authService');
const TokenService = require('../service/tokenService');
const UserService = require('../service/userService');
const logger = require('../config/logger');
const { TokenTypes } = require('../config/tokens');
const EmailHelper = require('../helper/emailHelper');
const { returnSuccess } = require('../helper/responseHandler');
const ApiError = require('../errors/apiError');

class UsersAndTokensController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
    }

    register = async (req, res) => {
        try {
            const user = await this.userService.createUser(req.body);
            const { status } = user.response;
            if (user.response.status) {
                const emailVerificationToken =
                    await this.tokenService.generateEmailVerificationToken(user.response.data);
                EmailHelper.sendEmail(
                    EmailHelper.prepareEmailVerificationMailOptions(
                        user.response.data,
                        emailVerificationToken,
                    ),
                );
            }
            const { message, data } = user.response;
            res.status(user.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    get = async (req, res) => {
        try {
            const user = await this.userService.getUser(req.params.uuid);
            const { message, data } = user.response;
            res.status(user.statusCode).send({message, data});
        } catch(e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    list = async (req, res) => {
        try {
            const users = await this.userService.listUsers();
            const { message, data } = users.response;
            res.status(users.statusCode).send({ message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    update = async (req, res) => {
        try {
            const user = await this.userService.updateUser(req.body, req.params.uuid);
            const { status, message } = user.response;
            res.status(user.statusCode).send({ status, message });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    remove = async (req, res) => {
        try {
            const { response } = await this.userService.removeUser(req.params.uuid);
            res.status(response.code).send(response.message);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    checkEmail = async (req, res) => {
        try {
            const isExists = await this.userService.isEmailExists(req.body.email.toLowerCase());
            res.status(isExists.statusCode).send(isExists.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await this.authService.loginWithEmailPassword(
                email.toLowerCase(),
                password,
            );
            const { message, data, status } = user.response;
            const code = user.statusCode;
            let tokens = {};
            if (user.response.status) {
                tokens = await this.tokenService.generateAuthTokens(data);
            }
            res.status(user.statusCode).send({ status, code, message, data, ...(tokens ?? { tokens }) });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    logout = async (req, res) => {
        res.status(httpStatus.NO_CONTENT).send(await this.authService.logout(req, res));
    };

    refreshTokens = async (req, res) => {
        try {
            const refreshTokenDoc = await this.tokenService.verifyToken(
                req.body.refresh_token,
                TokenTypes.REFRESH,
            );
            const user = await this.userService.getUserByUuid(refreshTokenDoc.user_uuid);
            if (user == null) {
                res.status(httpStatus.NOT_FOUND).send('User Not Found!');
            }
            await this.tokenService.removeTokenById(refreshTokenDoc.id);
            const tokens = await this.tokenService.generateAuthTokens(user);
            res.status(httpStatus.OK).send(tokens);
        } catch (e) {
            logger.error(e);
            res.status(e.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send(e.message || 'Something went wrong. Please report your admin.');
        }
    };

    confirmEmail = async (req, res) => {
        try {
            const { token } = req.body;
            await this.authService.completeEmailVerification(token);
            res.send(returnSuccess(httpStatus.OK, 'Email Verification Successful!'));
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send('Email Verficaition Failed.');
        }
    };

    resetPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found.');
            }
            const resetPasswordToken = await this.tokenService.generateResetPasswordToken(user);
            console.log(`Token ${resetPasswordToken}`);
            EmailHelper.sendEmail(
                EmailHelper.prepareResetPasswordVerificationMailOptions(user, resetPasswordToken),
            );
            res.status(httpStatus.OK).send('Email Accepted. Please check your email.');
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send('Reset password link generation failed.');
        }
    };

    confirmResetPassword = async (req, res) => {
        try {
            const { token, password } = req.body;
            const { statusCode, response } = await this.authService.completeResetPassword(token, password);
            res.status(statusCode).send(response.message);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send('Password update failed for the user.');
        }
    };

    changePassword = async (req, res) => {
        try {
            const responseData = await this.userService.changePassword(req.body, req.user.uuid);
            res.status(responseData.statusCode).send(responseData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = UsersAndTokensController;
