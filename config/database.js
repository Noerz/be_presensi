const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DATABASE_DIALECT,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = db;
