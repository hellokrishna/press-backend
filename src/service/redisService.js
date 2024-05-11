const redisClient = require('../config/redisClient');
const RedisHelper = require('../helper/redisHelper');
const { jwt } = require('../config/config');
const { TokenTypes } = require('../config/tokens');

class RedisService {
    constructor() {
        this.redisHelper = new RedisHelper(redisClient);
    }

    /**
     * Create access and refresh tokens
     * @param {String} uuid
     * @param {Object} tokens
     * @returns {boolean}
     */
    createAuthTokens = async (uuid, tokens) => {
        const accessKey = `${TokenTypes.ACCESS}:${tokens.access.token}`;
        const refreshKey = `${TokenTypes.REFRESH}:${tokens.refresh.token}`;
        const accessKeyExpires = jwt.accessExpirationMinutes * 60;
        const refreshKeyExpires = jwt.refreshExpirationDays * 24 * 60 * 60;
        await this.redisHelper.setEx(accessKey, accessKeyExpires, uuid);
        await this.redisHelper.setEx(refreshKey, refreshKeyExpires, uuid);
        return true;
    };

    /**
     * Create email verification token
     * @param {String} uuid
     * @param {Object} token
     * @returns {boolean}
     */
    createEmailVerificationToken = async ({ uuid, token }) => {
        const key = `${TokenTypes.VERIFY_EMAIL}:${token}`;
        const emailKeyExpires = jwt.verifyEmailExpirationMinutes * 60 * 60;
        await this.redisHelper.setEx(key, emailKeyExpires, uuid);
    };

    /**
     * Create email verification token
     * @param {String} uuid
     * @param {Object} token
     * @returns {boolean}
     */
    createResetPasswordToken = async ({ uuid, token }) => {
        const key = `${TokenTypes.RESET_PASSWORD}:${token}`;
        const resetPasswordKeyExpires = jwt.resetPasswordExpirationMinutes * 60 * 60;
        await this.redisHelper.setEx(key, resetPasswordKeyExpires, uuid);
    };

    /**
     * Check access and refresh tokens
     * @param {String} token
     * @param {String} type [TokenTypes]
     * @returns {boolean}
     */
    hasAuthToken = async (token, type) => {
        const hasToken = await this.redisHelper.get(`${type}:${token}`);
        if (hasToken != null) {
            return true;
        }
        return false;
    };

    /**
     * Remove tokens
     * @param {String} token
     * @param {String} type
     * @returns {boolean}
     */
    removeToken = async (token, type) => {
        return this.redisHelper.del(`${type}:${token}`);
    };

    /**
     * Get user
     * @param {String} uuid
     * @returns {Object/Boolean}
     */
    getUser = async (uuid) => {
        const user = await this.redisHelper.get(`user:${uuid}`);
        if (user != null) {
            return JSON.parse(user);
        }
        return false;
    };

    /**
     * Set user
     * @param {Object} user
     * @returns {boolean}
     */
    setUser = async (user) => {
        const setUser = await this.redisHelper.set(`user:${user.uuid}`, JSON.stringify(user));
        if (!setUser) {
            return true;
        }
        return false;
    };
}

module.exports = RedisService;
