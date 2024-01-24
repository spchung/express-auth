const { DataTypes } = require('sequelize');

const UserModel = {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userRoleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    loginTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    name:'user',
    model: UserModel,
};