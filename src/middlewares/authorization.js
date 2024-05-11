const httpStatus = require("http-status");

const isAuthorized = (...roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(httpStatus.UNAUTHORIZED).send("This user is not authorized to perform the action.")
        }
        return next();
    };
};

module.exports = isAuthorized;

