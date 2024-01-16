const { Sequelize } = require('sequelize');
const db = require('../config/Database');

const {DataTypes} = Sequelize;

const Admin = db.define('admin', {
    uuid : {
        type : DataTypes.STRING,
        defaultValue : DataTypes.UUIDV4,
        allowNullValues : false,
        validate : {
            notEmpty: true
        }
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty: true,
            len: [3, 100]
        }
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
        validate : {
            notEmpty: true,
            isEmail : true
        }
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    role : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    }
},{
    freezeTableNames : true
});

module.exports = Admin;