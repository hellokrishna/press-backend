const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../errors/apiError');

const verifyCallback = (req, res, resolve, reject) => {
    return async (err, user, info) => {
        if (err || info || !user) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Login to access the api'));
        }
        req.user = user;

        resolve();
    };
};

const isAuthenticated = () => {
    return async (req, res, next) => {
        return new Promise((resolve, reject) => {
            passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, res, resolve, reject),
            )(req, res, next);
        })
            .then(() => {
                return next();
            })
            .catch((err) => {
                return next(err);
            });
    };
};



module.exports = isAuthenticated;
