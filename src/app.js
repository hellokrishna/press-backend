const express = require('express');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const routes = require('./route');
const { jwtStrategy } = require('./config/passport');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./errors/apiError');
const swaggerUi = require('swagger-ui-express');
const { swaggerOptions } = require('./swagger');
const swaggerJSDoc = require('swagger-jsdoc');

process.env.PWD = process.cwd();

const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.static(`${process.env.PWD}/public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// initiate swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.get('/api', async (req, res) => {
    res.redirect('/api/docs');
});
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
