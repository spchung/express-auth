const { authenticateToken, asyncAuthenticateToken, myMiddleware } = require('./auth.middleware');

module.exports = {
    authenticateToken,
    asyncAuthenticateToken,
    myMiddleware
}