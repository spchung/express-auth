const { Sequelize, DataTypes } = require('sequelize');

const UserRoleModel = {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    createdAt:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt:{
        type: DataTypes.DATE,
        allowNull: true,
    },
};

module.exports = {
    name:'user_role',
    model: UserRoleModel,
};