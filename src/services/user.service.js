const config = require('../config/config');
const db = require('../db/models');
const cryptService  = require('./crypt.service');

async function getUserByEmail(email) {
    const user = await db.user.findOne({
        where: { email },
        raw: true,
    });
    return user;
}

// custom password
async function createCustomUser(email, password, firstName, lastName) {
    const hash = await cryptService.asyncGeneratePassword(password);
    const user = await db.user.create({
        email: email,
        password: hash,
        firstName: firstName,
        lastName: lastName,
        emailVerified: false,
        userRoleId: 2, // regular user
        loginTypeId: 1, // email login
        createdAt: new Date(),
    });

    return user;
}

async function createGoogleUser(email, firstName, lastName, sub) {
    const user = await db.user.create({
        email: email,
        firstName: firstName,
        lastName: lastName,
        emailVerified: true,
        userRoleId: 2, // regular user
        loginTypeId: 2, // google login
        createdAt: new Date(),
        oAuthId: sub,
    });

    return user;
}

async function updateUser(id, data) {
    const user = await db.user.update(data, {
        where: { id },
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
    createCustomUser,
    createGoogleUser,
    listRoles,
    updateUser
}