"use strict";

module.exports = function(sequelize, DataTypes) {
    var Seminar = sequelize.define("Seminar", {
          presenter: DataTypes.STRING,
          date: DataTypes.DATE,
          title: DataTypes.STRING
        });

    Seminar.associate = function(models) {
          Seminar.hasMany(models.Slide);
        }
    
    return Seminar;
};