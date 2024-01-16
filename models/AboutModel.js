const { Sequelize } = require('sequelize');
const db = require('../config/Database');
const Admin = require('./AdminModel.js');

const {DataTypes} = Sequelize;

const Abouts = db.define('abouts', {
    uuid : {
        type : DataTypes.STRING,
        defaultValue : DataTypes.UUIDV4,
        allowNullValues : false,
        validate : {
            notEmpty: true
        }
    },
    history : {
        type : DataTypes.TEXT,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    vision : {
        type : DataTypes.TEXT,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    mision : {
        type : DataTypes.TEXT,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    values : {
        type : DataTypes.TEXT,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    adminId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    }
},{
    freezeTableNames : true
});

Admin.hasMany(Abouts);
Abouts.belongsTo(Admin, {foreignKey: 'adminId'});


module.exports = {
    Abouts
}