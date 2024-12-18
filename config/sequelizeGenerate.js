const SequelizeAuto = require("sequelize-auto");
require("dotenv").config();

const auto = new SequelizeAuto(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD, {
        host: process.env.HOST,
        dialect: process.env.DATABASE_DIALECT,
        directory: "./models",
        port: process.env.DATABASE_PORT,
        caseFile: "c",
        singularize: true,
        spaces: true,
        indentation: 2,
        additional: {
            timestamps: false
        }
    }
);

auto.run();
