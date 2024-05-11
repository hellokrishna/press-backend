const jwt = require('jsonwebtoken');
const moment = require('moment');
const { Op } = require('sequelize');
const config = require('../config/config');
const { TokenTypes } = require('../config/tokens');
const TokenDao = require('../dao/tokenDao');
const RedisService = require('./redisService');
const AuthorizationError = require('../errors/authorizationError');
const httpStatus = require('http-status');

class TokenService {
    constructor() {
        this.tokenDao = new TokenDao();
        this.redisService = new RedisService();
    }

    /**
     * Generate token
     * @param {string} id
     * @param {Moment} expires
     * @param {string} type
     * @param {string} [secret]
     * @returns {string}
     */

    static generateToken = (uuid, expires, type, secret = config.jwt.secret) => {
        const payload = {
            sub: uuid,
            iat: moment().unix(),
            exp: expires.unix(),
            type,
        };
        return jwt.sign(payload, secret);
    };

    getRefreshToken = async (token) => {
        return this.tokenDao.findOne({
            token,
            type: TokenTypes.REFRESH,
            blacklisted: false,
        });
    };

    getAccessTokenByUserUuid = async (userUuid) => {
        return this.tokenDao.findOne({
            user_uuid: userUuid,
            type: TokenTypes.REFRESH,
            blacklisted: false,
        })
    }

    removeAuthTokens = async (userUuid) => {
        await this.tokenDao.remove({
            user_uuid: userUuid,
            type: TokenTypes.REFRESH,
            blacklisted: false,
        });
        await this.tokenDao.remove({
            user_uuid: userUuid,
            type: TokenTypes.ACCESS,
            blacklisted: false,
        });
    };

    verifyToken = async (token, type) => {
        const payload = await jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (err) {
                throw new AuthorizationError(httpStatus.UNPROCESSABLE_ENTITY, 'Token Invalid');
            } else {
                // if everything is good, save to request for use in other routes
                return decoded;
            }
        });
        const tokenDoc = await this.tokenDao.findOne({
            token,
            type,
            user_uuid: payload.sub,
            blacklisted: false,
        });
        if (!tokenDoc) {
            throw new AuthorizationError(httpStatus.NOT_FOUND, 'Tokens have expired');
        }
        return tokenDoc;
    };

    /**
     * Save a token
     * @param {string} token
     * @param {integer} userId
     * @param {Moment} expires
     * @param {string} type
     * @param {boolean} [blacklisted]
     * @returns {Promise<Token>}
     */
    saveToken = async ({ token, userId, expires, type, blacklisted = false }) => {
        return this.tokenDao.create({
            token,
            user_uuid: userId,
            expires,
            type,
            blacklisted,
        });
    };
    /**
     * Save a multiple token
     * @param {Object} tokens
     * @returns {Promise<Token>}
     */

    saveMultipleTokens = async (tokens) => {
        return this.tokenDao.bulkCreate(tokens);
    };

    removeTokenById = async (id) => {
        return this.tokenDao.remove({ id });
    };

    /**
     * Generate new registration email verification tokens
     * @param {{}} user
     * @returns {Promise<Object>}
     */
    generateEmailVerificationToken = async (user) => {
        const emailVerificationTokenExpires = moment().add(
            config.jwt.verifyEmailExpirationMinutes,
            'minutes',
        );
        const emailVerificationToken = await TokenService.generateToken(
            user.uuid,
            emailVerificationTokenExpires,
            TokenTypes.VERIFY_EMAIL,
        );

        const tokenPackage = {
            token: emailVerificationToken,
            userId: user.uuid,
            expires: emailVerificationTokenExpires.toDate(),
            type: TokenTypes.VERIFY_EMAIL,
        };

        await this.saveToken(tokenPackage);
        const expiredEmailVerificationToken = {
            expires: {
                [Op.lt]: moment().toDate(),
            },
            user_uuid: {
                [Op.eq]: user.uuid,
            },
            type: TokenTypes.VERIFY_EMAIL,
        };
        await this.tokenDao.remove(expiredEmailVerificationToken);
        await this.redisService.createEmailVerificationToken({
            uuid: user.uuid,
            token: emailVerificationToken,
        });
        return emailVerificationToken;
    };

    /**
     * Generate new reset password verification tokens
     * @param {{}} user
     * @returns {Promise<Object>}
     */
    generateResetPasswordToken = async (user) => {
        const resetPasswordTokenExpires = moment().add(
            config.jwt.resetPasswordExpirationMinutes,
            'minutes',
        );
        const resetPasswordToken = await TokenService.generateToken(
            user.uuid,
            resetPasswordTokenExpires,
            TokenTypes.RESET_PASSWORD,
        );
        await this.saveToken({
            token: resetPasswordToken,
            userId: user.uuid,
            expires: resetPasswordTokenExpires.toDate(),
            type: TokenTypes.RESET_PASSWORD,
        });

        const expiredResetPasswordToken = {
            expires: {
                [Op.lt]: moment().toDate(),
            },
            user_uuid: {
                [Op.eq]: user.uuid,
            },
            type: TokenTypes.RESET_PASSWORD,
        };
        await this.tokenDao.remove(expiredResetPasswordToken);
        await this.redisService.createResetPasswordToken({
            uuid: user.uuid,
            token: resetPasswordToken,
        });
        return resetPasswordToken;
    };

    /**
     * Generate auth tokens
     * @param {{}} user
     * @returns {Promise<Object>}
     */
    generateAuthTokens = async (user) => {
        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
        const accessToken = await TokenService.generateToken(
            user.uuid,
            accessTokenExpires,
            TokenTypes.ACCESS,
        );
        const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
        const refreshToken = await TokenService.generateToken(
            user.uuid,
            refreshTokenExpires,
            TokenTypes.REFRESH,
        );
        const authTokens = [];
        authTokens.push({
            token: accessToken,
            user_uuid: user.uuid,
            expires: accessTokenExpires.toDate(),
            type: TokenTypes.ACCESS,
            blacklisted: false,
        });
        authTokens.push({
            token: refreshToken,
            user_uuid: user.uuid,
            expires: refreshTokenExpires.toDate(),
            type: TokenTypes.REFRESH,
            blacklisted: false,
        });

        await this.saveMultipleTokens(authTokens);
        const expiredAccessTokenWhere = {
            expires: {
                [Op.lt]: moment().toDate(),
            },
            user_uuid: {
                [Op.eq]: user.uuid,
            },
            type: TokenTypes.ACCESS,
        };
        await this.tokenDao.remove(expiredAccessTokenWhere);
        const expiredRefreshTokenWhere = {
            expires: {
                [Op.lt]: moment().toDate(),
            },
            user_uuid: {
                [Op.eq]: user.uuid,
            },
            type: TokenTypes.REFRESH,
        };
        await this.tokenDao.remove(expiredRefreshTokenWhere);
        const tokens = {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };
        await this.redisService.createAuthTokens(user.uuid, tokens);

        return tokens;
    };
}

module.exports = TokenService;
