const { Sequelize } = require('sequelize');

const db = new Sequelize('sql12677281', 'sql12677281', 'qzzNaNX45u', {
    host: "sql12.freemysqlhosting.net",
    port: 3306,
    dialect: "mysql",
    sync: true,
});

module.exports = db;