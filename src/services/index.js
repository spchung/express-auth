const userService = require('./user.service');
const cryptService = require('./crypt.service');
const tokenService = require('./token.service');
const mailService = require('./mail.service');
const userActionService = require('./userAction.service');
const authService = require('./auth.service');

module.exports = {
    userService,
    cryptService,
    tokenService,
    mailService,
    userActionService,
    authService
}