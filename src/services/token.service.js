const jwt = require('jsonwebtoken');
const config = require('../config/config');

function generateToken(data, expiresSeconds, secret = config.jwt.secret) {
    const token = jwt.sign(data, secret, { expiresIn: expiresSeconds });
    return token;
}

// generate timestamp to live
function generateExpires(hours) {
	const ms = Math.floor(Date.now() + hours * 60 * 60 * 1000);
	return ms;
}

module.exports = {
    generateToken,
    generateExpires,
}