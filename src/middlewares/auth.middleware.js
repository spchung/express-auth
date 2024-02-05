const jwt = require('jsonwebtoken');
const { tokenService, userService, userActionService } = require('../services');
const config = require('../config/config');
const db = require('../db/models');
const { helpers } = require('../utils');

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     // Bearer TOKEN
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) {
//         return res.status(401).send({
//             message: 'Unauthorized: No accessToken',
//         });
//     }
//     // check if token is blacklisted
//     db.tokenBlacklist.findOne({
//         where: { token }
//     }).then((tokenBlacklistItem) => {
//         if (tokenBlacklistItem){
//             return db.token.destroy({
//                 where: { accessToken: tokenBlacklistItem.token }
//             })
//         }
//         else {
//             return Promise.resolve();
//         }
//     }).then(() => {
//         return res.status(401).send({
//             message: 'Unauthorized: Token Blacklisted',
//         });
//     }).catch((err) => {
//         console.log('Blacklist Error', err);
//         return res.status(400).send({
//             message: 'Error: Unknown Error',
//         });
//     });

//     // assign token to req
//     req.authToken = token;
//     jwt.verify(token, config.jwt.accessTokenSecret, (err, decoded) => {
//         if (err) {
//             // fetch refresh token
//             tokenService.getRefreshTokenFromAccessToken(token).then((tokenModel) => {
//                 if (!tokenModel){
//                     throw new Error('No Refresh Token Found');
//                 }
//                 return tokenModel.refreshToken;
//             }).then((refreshToken) => {
//                 const { user_id } = tokenService.extractJWTData(refreshToken, config.jwt.refreshTokenSecret);
//                 if(!user_id) { 
//                     // delete record
//                     db.token.destroy({
//                         where: { refreshToken }
//                     }).then(() => {
//                         throw new Error('RefreshToken Expired or Invalid');
//                     });
//                 }
//                 // gnenerate new access token
//                 const accessToken = tokenService.generateToken({ user_id }, config.jwt.accessTokeExpires);
//                 res.cookie('accessToken', accessToken, { maxAge: process.env.COOKIE_MAX_AGE });
//                 req.headers['authorization'] = `Bearer ${accessToken}`
//                 return {
//                     accessToken, 
//                     user_id,
//                     oldRefreshToken: refreshToken,
//                 };
//             }).then(({accessToken, user_id, oldRefreshToken}) => {
//                 const newRefreshToken = tokenService.generateToken({ user_id: user_id }, config.jwt.refreshTokenExpires, config.jwt.refreshTokenSecret);
//                 tokenService.saveTokenPair(accessToken, newRefreshToken, user_id).then(() => {
//                     db.token.destroy({
//                         where: { refreshToken: oldRefreshToken }
//                     }).then(() => {
//                         userActionService.refresnTokenAction(user_id).then(() => {
//                             req.user_id = user_id;
//                             next();
//                         });
//                     });
//                 });
//             }).catch((err) => {
//                 console.log(err);
//                 return res.status(403).send({
//                     message: `Redirect: ${err.message}`,
//                 });
//             });
//         }
//         else if (decoded?.user_id){
//             req.user_id = decoded.user_id;
//             next();
//         }
//         else {
//             return res.status(401).send({
//                 message: 'Unauthorized: Invalid Token',
//             });
//         }
//     });
// }

const verifyToken = async (token) => {
    try {
        // Wrap jwt.verify in a promise
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, config.jwt.accessTokenSecret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        // Token is valid, return true or the decoded information
        return decoded;
    } catch (error) {
        // Token is invalid or an error occurred during verification
        return false;
    }
};

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            message: 'Unauthorized',
        });
    }

    req.authToken = token;

    const isBlacklisted = await tokenService.tokenIsBlacklisted(token);
    if (isBlacklisted) {
        await tokenService.deleteToken(token);
        return res.status(401).send({
            message: 'Unauthorized: Token Blacklisted',
        });
    }
    const decoded = await verifyToken(token); 
    if (decoded === false) {
        // fetch refresh token
        const refreshToken = await tokenService.getRefreshTokenFromAccessToken(token);
        if (!refreshToken) {
            return res.status(403).send({
                message: 'Redirect: refesh token not valid',
            });
        }
        const { user_id, user_role } = tokenService.extractJWTData(refreshToken, config.jwt.refreshTokenSecret);
        //generate new access token
        const newAccessToken = tokenService.generateToken({ user_id, user_role }, config.jwt.accessTokeExpires);
        // rotate refresh token
        const newRefreshToken = tokenService.generateToken({ user_id, user_role }, config.jwt.refreshTokenExpires, config.jwt.refreshTokenSecret);
        await tokenService.updateTokenPair(token, newAccessToken, newRefreshToken);
        // log user action
        await userActionService.refresnTokenAction(user_id);
        res.cookie('accessToken', newAccessToken, { maxAge: process.env.COOKIE_MAX_AGE });
        console.log('New Access Token:', newAccessToken);
        req.user_id = user_id;
    }else{
        req.user_id = decoded.user_id;
    }
    next();
}

module.exports = {
    authenticateToken
}