const { DataTypes } = require('sequelize');

const UserActionModel = {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    actionTypeId:{
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
    name:'user_action',
    model: UserActionModel,
};
