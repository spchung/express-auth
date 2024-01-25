const jwt = require('jsonwebtoken');
const config = require('../config/config');

function generateToken(data, expiresSeconds, secret = config.jwt.accessTokenSecret) {
    const token = jwt.sign(data, secret, { expiresIn: expiresSeconds });
    return token;
}

function generateResetPasswordToken(data) {
    const token = jwt.sign(
        data, 
        config.jwt.resetPasswordSecret, 
        { expiresIn: config.jwt.resetPasswordExpires });
    return token;
}

// generate timestamp to live
function generateExpires(hours) {
	const ms = Math.floor(Date.now() + hours * 60 * 60 * 1000);
	return ms;
}

// extract data from token
function extractJWTData(token, secret) {
    const data = jwt.verify(token, secret);
    return data;
}

module.exports = {
    generateToken,
    generateExpires,
    generateResetPasswordToken,
    extractJWTData,
}