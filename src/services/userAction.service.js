// Log user action to table
const db = require('../db/models');

const actions = {
    LOG_IN: 1,
    RESET_PASSWORD: 2,
    SIGN_UP: 3,
    REFRESH_TOKEN: 4, //new session token generated
}

const logUserAction = async function (userId, actionTypeId) {
    return await db.userAction.create({
        userId,
        actionTypeId,
    });
}

const logInAction = async function(userId) {
    const userAction = await logUserAction(userId, actions.LOG_IN);
    return userAction;
}

const resetPasswordAction = async function(userId) {
    const userAction = await logUserAction(userId, actions.RESET_PASSWORD);
    return userAction;
}

const signUpAction = async function(userId) {
    const userAction = await logUserAction(userId, actions.SIGN_UP);
    return userAction;
}

const refresnTokenAction = async function(userId) {
    const userAction = await logUserAction(userId, actions.REFRESH_TOKEN);
    return userAction;
}

module.exports = {
    logInAction,
    resetPasswordAction,
    signUpAction,
    refresnTokenAction,
    actions
}