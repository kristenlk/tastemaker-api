'use strict';

module.exports = function(sequelize, Datatypes){

  var User = sequelize.define('User', {

    id: {
      type: Datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    email: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: false
    }
  }, {
    timestamps: true

  });

  return User;
};
