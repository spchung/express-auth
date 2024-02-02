const jwt = require('jsonwebtoken');
const { tokenService, userService, userActionService } = require('../services');
const config = require('../config/config');
const db = require('../db/models');

function _parseCookie(rawCookie) {
    const parsedCookie = {};
    if (rawCookie){
        rawCookie.split(';').forEach((cookie) => {
            const parts = cookie.split('=');
            parsedCookie[parts[0].trim()] = parts[1].trim();
        });
        return parsedCookie;
    }
    return {};
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            message: 'Unauthorized',
        });
    }

    jwt.verify(token, config.jwt.accessTokenSecret, (err, decoded) => {
        if (err) {
            // get new access token
            const cookies = _parseCookie(req.headers['cookie']);
            // must sign in again
            if (!cookies.accessToken) {
                return res.status(401).send({
                    message: 'Redirect',
                });
            }
            
            // fetch refresh token
            tokenService.getRefreshTokenFromAccessToken(token).then((tokenModel) => {
                if (!tokenModel){
                    throw new Error('RefreshToken Expired');
                }
                return tokenModel.refreshToken;
            }).then((refreshToken) => {
                const { user_id } = tokenService.extractJWTData(refreshToken, config.jwt.refreshTokenSecret);
                if(!user_id) { 
                    // delete record
                    db.token.destroy({
                        where: { refreshToken }
                    }).then(() => {
                        console.log("destroied")
                        throw new Error('RefreshToken Expired');
                    });
                }
                // gnenerate new access token
                const accessToken = tokenService.generateToken({ user_id }, config.jwt.accessTokeExpires);
                res.cookie('accessToken', accessToken, { maxAge: process.env.COOKIE_MAX_AGE });
                req.headers['authorization'] = `Bearer ${accessToken}`
                return {
                    accessToken, 
                    user_id,
                    oldRefreshToken: refreshToken,
                };
            }).then(({accessToken, user_id, oldRefreshToken}) => {
                const newRefreshToken = tokenService.generateToken({ user_id: user_id }, config.jwt.refreshTokenExpires, config.jwt.refreshTokenSecret);
                tokenService.saveTokenPair(accessToken, newRefreshToken, user_id).then(() => {
                    db.token.destroy({
                        where: { refreshToken: oldRefreshToken }
                    }).then(() => {
                        userActionService.refresnTokenAction(user_id).then(() => {
                            req.user_id = user_id;
                            next();
                        });
                    });
                });
            }).catch((err) => {
                console.log(err);
                return res.status(403).send({
                    message: 'Redirect',
                });
            });
        }
        else {
            req.user_id = decoded.user_id;
            next();
        }
    });
}

async function asyncAuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({
            message: 'Unauthorized',
        });
    }

    jwt.verify(token, config.jwt.accessTokenSecret, async (err, decoded) => {
        if (err) {
            // get new access token
            const cookies = _parseCookie(req.headers['cookie']);
            // must sign in again
            if (!cookies.accessToken) {
                return res.status(401).send({
                    message: 'Redirect',
                });
            }
            
            // fetch refresh token
            const refreshToken = await tokenService.getRefreshTokenFromAccessToken(token);
            
            if (refreshToken) {
                const { user_id } = tokenService.extractJWTData(refreshToken, config.jwt.refreshTokenSecret);
                //generate new access token
                const accessToken = tokenService.generateToken({ user_id }, config.jwt.accessTokeExpires);
                res.cookie('accessToken', accessToken, { maxAge: process.env.COOKIE_MAX_AGE });
                // rotate refresh token
                const newRefreshToken = tokenService.generateToken({ user_id }, config.jwt.refreshTokenExpires);
                db.token.update({
                    refreshToken: newRefreshToken,
                }, {
                    where: { id: refreshToken.id },
                }).catch((err) => {
                    console.log('DB Update err', err);
                });
                // log user action
                db.userAction.create({
                    userId: user_id,
                    action: userActionService.actions.REFRESH_TOKEN,
                })
                console.log("new refresh token", newRefreshToken);
            } else {
                console.log(refreshToken)
                return res.status(403).send({
                    message: 'Redirect',
                });
            }
        }
        if (decoded) {
            req.user_id = decoded.user_id;
        }
        next();
    });
}

module.exports = {
    authenticateToken,
    asyncAuthenticateToken
}