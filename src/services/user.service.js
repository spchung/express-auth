const config = require('../config/config');
const db = require('../db/models');
const cryptService = require('./crypt.service');

async function getUserByEmail(email) {
    const user = await db.user.findOne({
        where: { email },
        raw: true,
    });
    return user;
}

async function createUser(email, password, firstName, lastName) {
    const hash = await cryptService.asyncGeneratePassword(password);
    const user = await db.user.create({
        email: email,
        password: hash,
        firstName: firstName,
        lastName: lastName,
        createdAt: new Date(),
        userRoleId: 2, // regular user
    });
    return user;
}

// user roles
async function listRoles() {
    const roles = await db.userRole.findAll({
        raw: true,
    });
    return roles;
}

module.exports = {
    getUserByEmail,
    createUser,
    listRoles
}