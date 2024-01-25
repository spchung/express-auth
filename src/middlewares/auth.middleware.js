const jwt = require('jsonwebtoken');
const { tokenService } = require('../services');
const config = require('../config/config');

function _parseCookie(rawCookie) {
    const parsedCookie = {};
    rawCookie.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        parsedCookie[parts[0].trim()] = parts[1].trim();
    });
    return parsedCookie;
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const cookies = _parseCookie(req.headers['cookie']);
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            message: 'Unauthorized',
        });
    }
    jwt.verify(token, config.jwt.accessTokenSecret, (err, user) => {
        if (err) {
            // get new access token
            const sessionToken = cookies.sessionToken;
            // validate refresh token
            const { user_id } = tokenService.extractJWTData(sessionToken, config.jwt.sessionTokenSecret);
            if (!user_id) {
                return res.status(403).send({
                    message: 'Forbidden',
                });
            }
            // generate new access token
            const accessToken = tokenService.generateToken({ user_id }, config.jwt.accessTokeExpires);
            res.cookie('accessToken', accessToken, { maxAge: process.env.COOKIE_MAX_AGE });
        };
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
}