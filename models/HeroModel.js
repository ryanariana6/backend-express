const { Sequelize } = require('sequelize');
const db = require('../config/Database.js');
const Admin = require('./AdminModel.js');


const {DataTypes} = Sequelize;

const Heros = db.define('heros', {
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
    kether : {
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

Admin.hasMany(Heros);
Heros.belongsTo(Admin);

module.exports = {
    Heros
}