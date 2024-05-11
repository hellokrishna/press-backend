const NodeMailer = require('nodemailer');
const Config = require('../config/config');
const Logger = require('../config/logger');

class EmailHelper {
    constructor() {
        this.emailConfig = Config.emailConfig;
        if (!this.emailConfig) {
            Logger.warning('Email credentials not configured. Transporter wont be created.');
        } else {
            try {
                this.transporter = NodeMailer.createTransport({
                    host: this.emailConfig.host,
                    port: this.emailConfig.port,
                    secure: true,
                    auth: {
                        user: this.emailConfig.user,
                        pass: this.emailConfig.pass,
                    },
                });
            } catch (error) {
                Logger.error(error);
            }
        }
    }

    async sendEmail(mailOptions) {
        try {
            if (!this.transporter) {
                Logger.error('Transporter was not created. Cannot send email.');
            }
            return !!(await this.transporter.sendMail(mailOptions));
        } catch (err) {
            console.log(err);
            Logger.error(err);
            return false;
        }
    }

    prepareEmailVerificationMailOptions = (user, emailVerificationToken) => {
        return {
            from: this.emailConfig.user,
            to: user.email,
            subject: 'Verify your registration',
            html: `
            <h2>Activate your account by clicking on the link below</h2>
            <p><a href="${this.emailConfig.verifyEmailClientWebhook}/${emailVerificationToken}">ACTIVATE YOUR ACCOUNT</a></p>
        `,
        };
    };

    prepareResetPasswordVerificationMailOptions = (user, resestPasswordToken) => {
        return {
            from: this.emailConfig.user,
            to: user.email,
            subject: 'Reset Your Password',
            html: `
            <h2>Reset your password by clicking on the link below.</h2>
            <p><a href="${this.emailConfig.resetPasswordClientWebhook}/${resestPasswordToken}">RESET YOUR PASSWORD</a></p>
            `,
        };
    };
}

module.exports = Object.freeze(new EmailHelper());
