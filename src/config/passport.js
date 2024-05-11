const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const UserDao = require('../dao/userDao');
const config = require('./config');
const { TokenTypes } = require('./tokens');
const TokenDao = require('../dao/tokenDao');
const RedisService = require('../service/redisService');
const models = require('../models');

const User = models.user;
const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true,
};

const verifyCallback = async (req, payload, done) => {
    try {
        if (payload.type !== TokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }
        const userDao = new UserDao();
        const redisService = new RedisService();
        const authorization =
            req.headers.authorization !== undefined ? req.headers.authorization.split(' ') : [];
        if (authorization[1] === undefined) {
            return done(null, false);
        }

        let tokenDoc = redisService.hasAuthToken(authorization[1], TokenTypes.ACCESS);
        if (!tokenDoc) {
            console.log('Cache Missed!');

            tokenDoc = await tokenDao.findOne({
                token: authorization[1],
                type: TokenTypes.ACCESS,
                blacklisted: false,
            });
        }

        if (!tokenDoc) {
            return done(null, false);
        }
        let user = await redisService.getUser(payload.sub);
        if (user) {
            user = new User(user);
        }

        if (!user) {
            console.log('User Cache Missed!');
            user = await userDao.findByUuid(payload.sub);
            redisService.setUser(user);
        }

        if (!user) {
            return done(null, false);
        }

        done(null, user);
    } catch (error) {
        console.log(error);
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, verifyCallback);

module.exports = {
    jwtStrategy,
};
