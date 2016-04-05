"use strict";

var db = {
    Label: "",
    Memo: ""
};

var sequelizeOption = {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    charset: 'utf8',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
};
if(process.env.SERVICE_MODE !== "development"){
    sequelizeOption.logging = false;
}

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, sequelizeOption);

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
        console.log("Model initialized ", model.name);
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;