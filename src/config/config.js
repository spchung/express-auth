require('dotenv').config('../../.env');

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    domain: process.env.DOMAIN,
    postgres: {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expirationTime: process.env.JWT_EXPIRATION_TIME,
        resetPasswordSecret: process.env.RESET_JWT_PASSWORD_SECRET,
        resetPasswordExpires: process.env.RESET_JWT_EXPIRATION_TIME,
        confirmationSecret: process.env.CONFIRMATION_JWT_SECRET,
        confirmationExpires: process.env.CONFIRMATION_JWT_EXPIRATION_TIME,
    },
    mail: {
        googleAppPass: process.env.GOOGLE_APP_PASS,
        googleAppEmail: process.env.GOOGLE_APP_EMAIL,
    }
};