require('dotenv').config('../../.env');

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
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
    }
};