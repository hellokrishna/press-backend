class RedisHelper {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    /**
     * Set Value
     * @param {String} key
     * @param {String/JSON} value
     * @returns {String/Boolean}
     */
    async set(key, value) {
        try {
            return await this.redisClient.set(
                key,
                JSON.stringify(value) ? typeof value === 'object' : value,
            );
        } catch (e) {
            return false;
        }
    }

    /**
     * Set Value with Expiry
     * @param {String} key
     * @param {Integer} seconds
     * @param {String/JSON} value
     * @returns {String/boolean}
     */
    async setEx(key, seconds, value) {
        try {
            return await this.redisClient.setEx(
                key,
                seconds,
                typeof value === 'object' ? JSON.stringify(value) : value,
            );
        } catch (e) {
            return false;
        }
    }

    /**
     * Get Value
     * @param {String} key
     * @returns {String>}
     */
    async get(key) {
        try {
            return await this.redisClient.get(key);
        } catch (e) {
            return null;
        }
    }

    /**
     * Delete Value
     * @param {String} key
     * @returns {Boolean}
     */
    async del(key) {
        try {
            return await this.redisClient.del(key);
        } catch (e) {
            return false;
        }
    }

    async scanStream(key) {
        try {
            await this.redisClient.scanStream({
                // only returns keys following the pattern of "key"
                match: key,
                // returns approximately 100 elements per call
                count: 100,
            });
        } catch (e) {
            return false;
        }
    }
}

module.exports = RedisHelper;
