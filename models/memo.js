"use strict";

module.exports = function (sequelize, DataTypes) {
    var Memo = sequelize.define("Memo", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        content: DataTypes.TEXT
    }, {
        underscored: true,
        classMethods: {
            associate: function (models) {
                Memo.belongsToMany(models.Label, {
                    through: "label_memo",
                    foreignKey: "memo_id",
                    constraints: false
                })
            },
            getUpdateFields: function () {
                return ["title", "content"]
            }
        }
    });
    return Memo;
};