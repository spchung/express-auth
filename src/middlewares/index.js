const { authenticateToken, asyncAuthenticateToken } = require('./auth.middleware');

module.exports = {
    authenticateToken,
    asyncAuthenticateToken
}