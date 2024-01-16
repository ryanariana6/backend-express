const { Sequelize } = require('sequelize');
const db = require('../config/Database');
const Admin = require('./AdminModel.js');

const {DataTypes} = Sequelize;

const Services = db.define('services', {
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
            notEmpty: true
        }
    },
    image : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    ketser : {
        type : DataTypes.TEXT,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    url : {
        type : DataTypes.STRING
    }
},{
    freezeTableNames : true
});

Admin.hasMany(Services);
Services.belongsTo(Admin);

module.exports = Services;