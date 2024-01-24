const userService = require('./user.service');
const cryptService = require('./crypt.service')
const tokenService = require('./token.service')
const mailService = require('./mail.service')
module.exports = {
    userService,
    cryptService,
    tokenService,
    mailService
}