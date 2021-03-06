'use strict'

module.exports = function (sequelize, DataTypes) {
  var EMail = sequelize.define('EMail', {
    mailto: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    subject: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    body: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    execTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    sentDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    isSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        notEmpty: true
      }
    },
    key: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  })

  return EMail
}
