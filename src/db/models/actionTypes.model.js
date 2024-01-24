const { DataTypes } = require('sequelize');

const ActionTypeModel = {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
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
};

module.exports = {
    name:'action_type',
    model: ActionTypeModel,
};