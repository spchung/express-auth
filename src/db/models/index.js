const Sequelize = require('sequelize');
const config = require('../../config/config');

// models
const userModel = require('./users.model');
const userRoleModel = require('./userRoles.model');
const userActionModel = require('./userActions.model');
const actionTypeModel = require('./actionTypes.model');

const sequelize = new Sequelize(
    config.postgres.database,
    config.postgres.user,
    config.postgres.password,
    {
        host: config.postgres.host,
        dialect: 'postgres',
        logging: false,
    }
);

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


const db = {
    // user 
    user: sequelize.define(userModel.name, userModel.model),
    userRole: sequelize.define(userRoleModel.name, userRoleModel.model),
    userAction: sequelize.define(userActionModel.name, userActionModel.model),
    actionType: sequelize.define(actionTypeModel.name, actionTypeModel.model),
}

module.exports = db;