// manage refresh tokens
const { DataTypes } = require('sequelize');

const TokenModel = {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    refreshToken:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    accessToken:{
        type: DataTypes.STRING,
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
    expireAt:{
        type: DataTypes.DATE,
        allowNull: false,
    },
};

module.exports = {
    name:'token',
    model: TokenModel,
};
