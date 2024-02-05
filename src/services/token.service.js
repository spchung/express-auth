const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../db/models');

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

// refresh token
async function saveTokenPair(accessToken, refreshToken, userId) {
    const tokenPair = await db.token.create({
        accessToken,
        refreshToken,
        userId,
        createdAt: new Date(),
        expireAt: generateExpires(168), //one week
    });
    return tokenPair;
}

async function updateAssessToken(token, refreshToken) {
    const newToken = await db.token.update({
        accessToken: token,
    }, {
        where: { refreshToken: refreshToken },
    });
    return newToken;
}

async function updateTokenPair(oldAccessToken, newAccessToken, newRefreshToken) {
    const tokenPair = await db.token.update({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }, {
        where: { 
            accessToken: oldAccessToken,
        },
    });
    return tokenPair;

}

async function getRefreshTokenFromAccessToken(accessToken) {
    const token = await db.token.findOne({
        where: { accessToken: accessToken },
        raw: true,
    });
    if (!token) {
        return null;
    }
    return token.refreshToken;
}

async function blackListToken(token) {
    const blackList = await db.tokenBlacklist.create({
        token,
        createdAt: new Date(),
    });
    return blackList;
}

async function deleteToken(accessToken) {
    const token = await db.token.destroy({
        where: {
            accessToken,
        },
    });
    return token;
}

async function tokenIsBlacklisted(token) {
    const blackList = await db.tokenBlacklist.findOne({
        where: {
            token,
        },
    });
    return blackList !== null;
}

module.exports = {
    generateToken,
    generateExpires,
    generateResetPasswordToken,
    extractJWTData,
    saveTokenPair,
    updateAssessToken,
    getRefreshTokenFromAccessToken,
    deleteToken,
    blackListToken,
    tokenIsBlacklisted,
    updateTokenPair
}