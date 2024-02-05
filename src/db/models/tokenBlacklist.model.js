// manage refresh tokens
const { DataTypes } = require('sequelize');

const TokenBlacklistModel = {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token:{
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
    }
};

module.exports = {
    name:'token_blacklist',
    model: TokenBlacklistModel,
};
