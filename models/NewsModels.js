const { Sequelize } = require('sequelize');
const db = require('../config/Database.js');
const Admin = require('./AdminModel.js');

const {DataTypes} = Sequelize;

const News = db.define('news',{
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
    ket : {
        type : DataTypes.TEXT,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    url : {
        type : DataTypes.STRING
    }
}, {
    freezeTableName: true
});

Admin.hasMany(News);
News.belongsTo(Admin);

module.exports = News;