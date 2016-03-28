"use strict";

var db = {
    Label: "",
    Memo: ""
};

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

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

/* sample model

 "use strict";

 module.exports = function(sequelize, DataTypes) {
 var Client = sequelize.define("Client", {
 client_id: {
 type:DataTypes.INTEGER,
 allowNull: false,
 primaryKey:true,
 autoIncrement: true
 },
 email: {
 type:DataTypes.STRING(50),
 allowNull: false,
 defaultValue: "NO EMAIL"
 }
 }, {
 indexes:[
 {
 unique:true,
 fields:["email"]
 }
 ],
 classMethods: {
 associate: function(models) {
 Client.hasMany(models.ClientFamily)
 }
 }
 });

 return Client;
 };

 */