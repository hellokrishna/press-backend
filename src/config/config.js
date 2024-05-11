const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envValidation = Joi.object()
    .keys({
        DOMAIN_NAME: Joi.string().default('localhost'),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().default('localhost'),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
            .default(1)
            .description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
            .default(2)
            .description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which verify email token expires'),
        LOG_FOLDER: Joi.string().required(),
        LOG_FILE: Joi.string().required(),
        LOG_LEVEL: Joi.string().required(),
        REDIS_HOST: Joi.string().default('127.0.0.1'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_USE_PASSWORD: Joi.string().default('no'),
        REDIS_PASSWORD: Joi.string(),
        SYSTEM_EMAIL_ADDRESS: Joi.string().email(),
        SYSTEM_EMAIL_PASSWORD: Joi.string(),
        SYSTEM_EMAIL_HOST: Joi.string(),
        SYSTEM_EMAIL_PORT: Joi.number(),
        CLIENT_EMAIL_VERIFICATION_WEBHOOK: Joi.string().uri(),
        CLIENT_RESET_PASSWORD_WEBHOOK: Joi.string().uri(),
    })
    .unknown();

const { value: envVar, error } = envValidation
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    nodeEnv: envVar.NODE_ENV,
    port: envVar.PORT,
    dbHost: envVar.DB_HOST,
    dbUser: envVar.DB_USER,
    dbPass: envVar.DB_PASS,
    dbName: envVar.DB_NAME,
    jwt: {
        secret: envVar.JWT_SECRET,
        accessExpirationMinutes: envVar.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVar.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVar.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVar.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    logConfig: {
        logFolder: envVar.LOG_FOLDER,
        logFile: envVar.LOG_FILE,
        logLevel: envVar.LOG_LEVEL,
    },
    redis: {
        host: envVar.REDIS_HOST,
        port: envVar.REDIS_PORT,
        usePassword: envVar.REDIS_USE_PASSWORD,
        password: envVar.REDIS_PASSWORD,
    },
    emailConfig: {
        host: envVar.SYSTEM_EMAIL_HOST,
        port: envVar.SYSTEM_EMAIL_PORT,
        user: envVar.SYSTEM_EMAIL_ADDRESS,
        pass: envVar.SYSTEM_EMAIL_PASSWORD,
        verifyEmailClientWebhook: envVar.CLIENT_EMAIL_VERIFICATION_WEBHOOK,
        resetPasswordClientWebhook: envVar.CLIENT_RESET_PASSWORD_WEBHOOK,
    },
    swagger: {
        server: (['development', 'test'].includes(envVar.NODE_ENV) ? `http://localhost:${envVar.PORT}` : `https://${envVar.DOMAIN_NAME}`),
    }
};
