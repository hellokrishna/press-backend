const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { TokenTypes } = require('../config/tokens');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const RedisService = require('./redisService');
const UserService = require('./userService');
const TokenService = require('./tokenService');
const ApiError = require('../errors/apiError');

class AuthService {
    constructor() {
        this.redisService = new RedisService();
        this.userService = new UserService();
        this.tokenService = new TokenService();
    }

    /**
     * Create a user
     * @param {String} email
     * @param {String} password
     * @returns {Promise<{response: {code: *, message: *, status: boolean}, statusCode: *}>}
     */
    loginWithEmailPassword = async (email, password) => {
        try {
            let message = 'Login Successful';
            let statusCode = httpStatus.OK;
            let user = await this.userService.getUserByEmail(email);
            if (user == null) {
                return responseHandler.returnError(
                    httpStatus.NOT_FOUND,
                    'User not found.',
                );
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            user = user.toJSON();
            delete user.password;
            delete user.id;

            if (!isPasswordValid) {
                statusCode = httpStatus.BAD_REQUEST;
                message = 'Wrong Password!';
                return responseHandler.returnError(statusCode, message);
            }

            return responseHandler.returnSuccess(statusCode, message, user);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Something Went Wrong!!',
            );
        }
    };

    completeEmailVerification = async (token) => {
        const verifyEmailTokenDoc = await this.tokenService.verifyToken(
            token,
            TokenTypes.VERIFY_EMAIL,
        );
        const user = await this.userService.getUserByUuid(verifyEmailTokenDoc.user_uuid);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found. Password update failed.');
        }
        const { id, password, ...cleanedUser } = user.toJSON();
        await this.userService.completeUserEmailVerification(cleanedUser);
        await this.tokenService.removeTokenById(verifyEmailTokenDoc.id);
    };

    completeResetPassword = async (token, newPassword) => {
        const verifyResetPasswordDoc = await this.tokenService.verifyToken(
            token,
            TokenTypes.RESET_PASSWORD,
        );
        return this.userService.confirmForgotPassword(verifyResetPasswordDoc.user_uuid, newPassword);
    };

    logout = async (req) => {
        const refreshTokenDoc = await this.tokenService.getRefreshToken(req.body.refresh_token);
        if (!refreshTokenDoc) {
            return false;
        }
        const accessTokenDoc = await this.tokenService.getAccessTokenByUserUuid(refreshTokenDoc.user_uuid);
        await this.tokenService.removeAuthTokens(refreshTokenDoc.user_uuid);
        await this.redisService.removeToken(accessTokenDoc.token, TokenTypes.ACCESS);
        await this.redisService.removeToken(refreshTokenDoc.token, TokenTypes.REFRESH);
        return true;
    };
}

module.exports = AuthService;
