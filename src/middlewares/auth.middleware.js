const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            message: 'Unauthorized',
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({
                message: 'Forbidden',
            });
        }
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
}