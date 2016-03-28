"use strict";

module.exports = function (sequelize, DataTypes) {
    var Label = sequelize.define("Label", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
        }
    }, {
        underscored: true,
        classMethods: {
            associate: function (models) {
                Label.belongsToMany(models.Memo, {
                    through: "label_memo",
                    foreignKey: "label_id",
                    constraints: false
                })
            },
            indexes: [
                {
                    unique: true,
                    fields: ["title"]
                }
            ],
            getUpdateFields: function () {
                return ["title", "description"]
            }
        }
    });
    return Label;
};